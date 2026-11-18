require("dotenv").config({ path: __dirname + "/.env" });
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const mongoose = require("mongoose");

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("./models/User");
const Skill = require("./models/Skill");
const Interview = require("./models/Interview");
const {
    generateInterviewQuestions,
    evaluateInterviewAnswers
} = require("./services/geminiService");
const Resume = require("./models/resume");
const ExtractedSkill = require("./models/ExtractedSkill");
const TargetRole = require("./models/TargetRole");
const SkillGap = require("./models/SkillGap");
const Roadmap = require("./models/Roadmap");
const ATSScore = require("./models/ATSScore");
const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");
const path = require("path");
const { ROLE_REQUIREMENTS, calculateATSScore } = require("./utils/atsScorer");
const { parseResumeText } = require("./utils/resumeParser");
const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://placement-forge-ai.vercel.app",
        "https://placementforge-lemon.vercel.app",
        "https://placementforge-pen1kv4xc-vaishnavi-gadepallis-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
const uploadDir = path.join(__dirname, "uploads");

// Create uploads folder if it doesn't exist
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage
});


// ==================== HEALTH CHECK ====================

app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "PlacementForge AI backend is running",
        version: "1.0"
    });
});


// ==================== REGISTER ====================

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Minimum password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // Special character
        const specialCharacterPattern =
            /[!@#$%^&*(),.?":{}|<>[\]\\/'`~_+=;-]/;

        if (!specialCharacterPattern.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one special character"
            });
        }

        // Email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        // Check duplicate email
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        // Create user
        const newUser = new User({
            name: name,
            email: email,
            password: password
        });

        await newUser.save();

        res.json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});


// ==================== LOGIN ====================

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        console.log("JWT secret loaded:", !!process.env.JWT_SECRET);
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});


// ==================== PROFILE ====================

app.get("/api/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const targetRole = await TargetRole.findOne({
            userId: req.userId
        });

        res.json({
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college || "",
                branch: user.branch || "",
                targetPackage: user.targetPackage || "",
                targetRole: targetRole?.role || ""
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
});


app.put("/api/profile", authMiddleware, async (req, res) => {
    try {
        const { name, email, college, branch, targetPackage, targetRole } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.userId }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                name: name.trim(),
                email: email.trim(),
                college: college || "",
                branch: branch || "",
                targetPackage: targetPackage || ""
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        let savedTargetRole = null;

        if (targetRole?.trim()) {
            savedTargetRole = await TargetRole.findOneAndUpdate(
                { userId: req.userId },
                { role: targetRole.trim() },
                { new: true, upsert: true, runValidators: true }
            );
        }

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                branch: user.branch,
                targetPackage: user.targetPackage,
                targetRole: savedTargetRole?.role || targetRole || ""
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
});


// ==================== ADD SKILL ====================

app.post("/api/skills", authMiddleware, async (req, res) => {
    try {
        const { skill } = req.body;

        // Check skill
        if (!skill) {
            return res.status(400).json({
                message: "Skill is required"
            });
        }

        // Create skill
        const newSkill = new Skill({
            userId: req.userId,
            skill: skill
        });

        await newSkill.save();

        res.status(201).json({
            message: "Skill added successfully",
            skill: newSkill
        });

    } catch (error) {

        // Duplicate skill
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You already have this skill"
            });
        }

        res.status(500).json({
            message: "Failed to add skill",
            error: error.message
        });
    }
});


// ==================== GET SKILLS ====================

app.get("/api/skills", authMiddleware, async (req, res) => {
    try {
        const skills = await Skill.find({
            userId: req.userId
        });

        res.json({
            message: "Skills fetched successfully",
            skills: skills
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch skills",
            error: error.message
        });
    }
});


// ==================== DELETE SKILL ====================

app.delete("/api/skills/:id", authMiddleware, async (req, res) => {
    try {
        const skill = await Skill.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        await Skill.deleteOne({
            _id: req.params.id
        });

        res.json({
            message: "Skill deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete skill",
            error: error.message
        });
    }
});


// ==================== UPDATE SKILL ====================

app.put("/api/skills/:id", authMiddleware, async (req, res) => {
    try {
        const { skill } = req.body;

        // Check skill
        if (!skill) {
            return res.status(400).json({
                message: "Skill is required"
            });
        }

        const updatedSkill = await Skill.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            {
                skill: skill
            },
            {
                new: true
            }
        );

        if (!updatedSkill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.json({
            message: "Skill updated successfully",
            skill: updatedSkill
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update skill",
            error: error.message
        });
    }
});

//======================POST RESUME===========================
app.post("/api/resume", authMiddleware, async (req, res) => {
    try {
        const { resumeUrl } = req.body;

        if (!resumeUrl) {
            return res.status(400).json({
                message: "Resume URL is required"
            });
        }

        const newResume = new Resume({
            userId: req.userId,
            resumeUrl: resumeUrl
        });

        await newResume.save();

        res.status(201).json({
            message: "Resume added successfully",
            resume: newResume
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add resume",
            error: error.message
        });
    }
});
//=====================GET RESUME==============================
app.get("/api/resume", authMiddleware, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            userId: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.json({
            message: "Resume fetched successfully",
            resume: resume
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch resume",
            error: error.message
        });
    }
});
//=====================UPDATE RESUME==========================
app.put("/api/resume", authMiddleware, async (req, res) => {
    try {
        const { resumeUrl } = req.body;

        if (!resumeUrl) {
            return res.status(400).json({
                message: "Resume URL is required"
            });
        }

        const updatedResume = await Resume.findOneAndUpdate(
            {
                userId: req.userId
            },
            {
                resumeUrl: resumeUrl
            },
            {
                new: true
            }
        );

        if (!updatedResume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.json({
            message: "Resume updated successfully",
            resume: updatedResume
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update resume",
            error: error.message
        });
    }
});
//=====================DELETE RESUME===========================
app.delete("/api/resume", authMiddleware, async (req, res) => {
    try {
        const deletedResume = await Resume.findOneAndDelete({
            userId: req.userId
        });

        if (!deletedResume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.json({
            message: "Resume deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete resume",
            error: error.message
        });
    }
});


app.post(
    "/api/resume/upload",
    authMiddleware,
    upload.single("resume"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Resume PDF is required"
                });
            }

            // Accept PDF files only
            if (req.file.mimetype !== "application/pdf") {
                fs.unlinkSync(req.file.path);

                return res.status(400).json({
                    message: "Only PDF files are allowed"
                });
            }

            const resumeUrl = `/uploads/${req.file.filename}`;

            // Find only the uploaded PDF record
            let resume = await Resume.findOne({
                userId: req.userId,
                resumeUrl: { $ne: "" }
            });

            if (resume) {
                resume.resumeUrl = resumeUrl;
                resume.resumeText = "";
                await resume.save();
            } else {
                resume = new Resume({
                    userId: req.userId,
                    resumeUrl: resumeUrl,
                    resumeText: ""
                });

                await resume.save();
            }

            res.status(200).json({
                message: "Resume uploaded successfully",
                resume: {
                    resumeUrl: resume.resumeUrl,
                    resumeText: resume.resumeText
                }
            });

        } catch (error) {
            console.error("Resume upload error:", error);

            res.status(500).json({
                message: "Failed to upload resume",
                error: error.message
            });
        }
    }
);



app.get(
    "/api/resume/text",
    authMiddleware,
    async (req, res) => {
        let parser;

        try {
            // Find only the uploaded PDF record
            const resume = await Resume.findOne({
                userId: req.userId,
                resumeUrl: { $ne: "" }
            });

            if (!resume) {
                return res.status(404).json({
                    message: "Uploaded resume not found"
                });
            }

            const filePath = "." + resume.resumeUrl;

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    message: "Resume PDF file not found"
                });
            }

            const dataBuffer = fs.readFileSync(filePath);

            parser = new PDFParse({
                data: dataBuffer
            });

            const result = await parser.getText();
            await parser.destroy();

// Validate extracted text
if (!result.text || !result.text.trim()) {
    return res.status(400).json({
        message: "No readable text found in this PDF"
    });
}

// Save extracted text in MongoDB
            resume.resumeText = result.text;
            await resume.save();
            // Extract skills from resume text
            const knownSkills = [
                "Java",
                "Python",
                "JavaScript",
                "HTML",
                "CSS",
                "React.js",
                "Node.js",
                "Express.js",
                "MongoDB",
                "SQL",
                "DBMS",
                "Spring Boot",
                "REST API",
                "Data Structures & Algorithms",
                "OOP",
                "Git",
                "Excel",
                "Statistics",
                "Power BI",
                "Machine Learning",
                "TensorFlow",
                "Linear Algebra",
                "Data Visualization"
           ];
           const resumeText = result.text.toLowerCase();
           const extractedSkills = knownSkills.filter(skill =>
    resumeText.includes(skill.toLowerCase())
           );
           // Replace previously extracted skills for this user
           await ExtractedSkill.deleteMany({
            userId: req.userId
        });
        // Save newly extracted skills
        if (extractedSkills.length > 0) {
            await ExtractedSkill.insertMany(
            extractedSkills.map(skill => ({
                 userId: req.userId,
                 skill
                }))
             );
            }

            res.status(200).json({
                message: "Resume text extracted and saved successfully",
                text: result.text
            });

        } catch (error) {
            console.error("Resume text extraction error:", error);

            res.status(500).json({
                message: "Failed to extract resume text",
                error: error.message
            });
        } finally {
            if (parser) {
                await parser.destroy();
            }
        }
    }
);



app.post(
    "/api/resume/extract-skills",
    authMiddleware,
    async (req, res) => {
        try {
            // Find the uploaded PDF record containing extracted text
            const resume = await Resume.findOne({
                userId: req.userId,
                resumeUrl: { $ne: "" }
            }).sort({ updatedAt: -1 });
            
            console.log("Resume found:", !!resume);
            console.log("Resume text length:", resume?.resumeText?.length);

            if (!resume || !resume.resumeText.trim()) {
                return res.status(404).json({
                    message: "Uploaded resume text not found. Upload and extract your resume first."
                });
            }

            const skillList = [
                "JavaScript",
                "TypeScript",
                "Java",
                "Python",
                "C++",
                "C#",
                "React.js",
                "React",
                "Node.js",
                "Express.js",
                "MongoDB",
                "MySQL",
                "SQL",
                "DBMS",
                "OOP",
                "Data Structures & Algorithms",
                "Data Structures",
                "HTML",
                "CSS",
                "Tailwind CSS",
                "GitHub",
                "Git",
                "AWS",
                "Docker",
                "Next.js",
                "Flask",
                "Django",
                "Spring Boot",
                "PostgreSQL",
                "Firebase",
                "REST API"
            ];

            const resumeText = resume.resumeText.toLowerCase();

            const extractedSkills = skillList.filter(skill => {
                const escapedSkill = skill
                    .toLowerCase()
                    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

                const regex = new RegExp(
                    `(?<![a-z0-9])${escapedSkill}(?![a-z0-9])`,
                    "i"
                );

                return regex.test(resumeText);
            });

            // Remove previously extracted skills for this user
            await ExtractedSkill.deleteMany({
                userId: req.userId
            });

            // Save newly extracted skills
            if (extractedSkills.length > 0) {
                await ExtractedSkill.insertMany(
                    extractedSkills.map(skill => ({
                        userId: req.userId,
                        skill: skill
                    }))
                );
            }

            res.status(200).json({
                message: "Skills extracted successfully",
                totalSkills: extractedSkills.length,
                skills: extractedSkills
            });

        } catch (error) {
            console.error("Skill extraction error:", error);

            res.status(500).json({
                message: "Failed to extract skills",
                error: error.message
            });
        }
    }
);


app.post(
    "/api/target-role",
    authMiddleware,
    async (req, res) => {
        try {
            const { role, targetPackage } = req.body;

            if (!role) {
                return res.status(400).json({
                    message: "Target role is required"
                });
            }

            const targetRole = await TargetRole.findOneAndUpdate(
                { userId: req.userId },
                {
                    role: role,
                    targetPackage:
                        targetPackage !== undefined
                            ? Number(targetPackage)
                            : null
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }
            );

            res.json({
                message: "Target role saved successfully",
                targetRole
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to save target role",
                error: error.message
            });
        }
    }
);
app.get(
    "/api/target-role",
    authMiddleware,
    async (req, res) => {
        try {
            const targetRole = await TargetRole.findOne({
                userId: req.userId
            });

            res.json({
                targetRole
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch target role",
                error: error.message
            });
        }
    }
);

app.get(
    "/api/skill-gap",
    authMiddleware,
    async (req, res) => {
        try {
            // Get user's target role
            const targetRole = await TargetRole.findOne({
                userId: req.userId
            });

            if (!targetRole) {
                return res.status(404).json({
                    message: "Target role not found"
                });
            }

            // Skills required for different roles
            const roleRequirements = {
                "Java Developer": [
                    "Java",
                    "Data Structures & Algorithms",
                    "OOP",
                    "SQL",
                    "DBMS",
                    "Spring Boot",
                    "REST API"
                ],

                "Frontend Developer": [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "React.js",
                    "Git"
                ],

                "Backend Developer": [
                    "Node.js",
                    "Express.js",
                    "MongoDB",
                    "SQL",
                    "REST API",
                    "Git"
                ],

                "Software Engineer": [
                    "JavaScript",
                    "Python",
                    "Data Structures & Algorithms",
                    "OOP",
                    "SQL",
                     "Git"
                ],

                "Full Stack Developer": [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "React.js",
                    "Node.js",
                    "Express.js",
                    "MongoDB",
                    "SQL"
                ],

                "Data Analyst": [
                    "Python",
                    "SQL",
                    "Excel",
                   "Statistics",
                   "Power BI",
                   "Data Visualization"
               ],

                "ML Engineer": [
                    "Python",
                    "Machine Learning",
                    "Statistics",
                    "Linear Algebra",
                    "TensorFlow",
                    "Data Processing"
              ]
            };

            const requiredSkills = roleRequirements[targetRole.role];

            if (!requiredSkills) {
                return res.status(400).json({
                    message: "Requirements for this role are not available yet"
                });
            }

            // Get skills extracted from the user's resume
            // Get skills from ExtractedSkill collection
const extractedSkills = await ExtractedSkill.find({
    userId: req.userId
});

const extractedSkillNames = extractedSkills.map(
    item => item.skill
);

// Get skills saved through Resume Builder
const resume = await Resume.findOne({
    userId: req.userId
}).sort({ updatedAt: -1 });

const builderSkills = Array.isArray(resume?.resumeData?.skills)
    ? resume.resumeData.skills
    : [];

// Combine both skill sources without duplicates
const userSkills = [
    ...new Set([
        ...extractedSkillNames,
        ...builderSkills
    ].map(skill => skill.trim()).filter(Boolean))
];

            // Find missing skills
            const missingSkills = requiredSkills.filter(
                skill => !userSkills.some(
                    userSkill =>
                        userSkill.toLowerCase() === skill.toLowerCase()
                )
            );

            // Save/update skill gap
            const skillGap = await SkillGap.findOneAndUpdate(
                { userId: req.userId },
                {
                    userId: req.userId,
                    targetRole: targetRole.role,
                    requiredSkills: requiredSkills,
                    userSkills: userSkills,
                    missingSkills: missingSkills
                },
                {
                    new: true,
                    upsert: true
                }
            );

            res.json({
                message: "Skill gap analyzed successfully",
                skillGap: skillGap
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to analyze skill gap",
                error: error.message
            });
        }
    }
);

app.get(
    "/api/roadmap",
    authMiddleware,
    async (req, res) => {
        try {
            const skillGap = await SkillGap.findOne({
                userId: req.userId
            });

            if (!skillGap) {
                return res.status(404).json({
                    message: "Skill gap analysis not found"
                });
            }

            const roadmapSteps = [];

            for (const skill of skillGap.missingSkills) {
                roadmapSteps.push(`Learn ${skill} fundamentals`);
                roadmapSteps.push(`Practice ${skill} concepts`);
                roadmapSteps.push(`Build a small project using ${skill}`);
            }

            const roadmap = await Roadmap.findOneAndUpdate(
                { userId: req.userId },
                {
                    userId: req.userId,
                    targetRole: skillGap.targetRole,
                    skills: skillGap.missingSkills,
                    roadmap: roadmapSteps
                },
                {
                    new: true,
                    upsert: true
                }
            );

            res.json({
                message: "Personalized roadmap generated successfully",
                roadmap: roadmap
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to generate roadmap",
                error: error.message
            });
        }
    }
);
// ==================== ATS RESUME SCORING ====================

app.post("/api/resume/score", authMiddleware, async (req, res) => {
  try {
    // 1. Get the user's uploaded resume
    const resume = await Resume.findOne({ userId: req.userId });

    if (!resume) {
      return res.status(404).json({
        message: "Please upload your resume before running ATS analysis."
      });
    }

    if (!resume.resumeText || !resume.resumeText.trim()) {
      return res.status(400).json({
        message: "Resume text is not available. Please extract your resume text first."
      });
    }

    // 2. Get the user's selected target role
    const targetRole = await TargetRole.findOne({ userId: req.userId });

    if (!targetRole) {
      return res.status(400).json({
        message: "Please select a target role before running ATS analysis."
      });
    }

    // 3. Requirements for each supported role
    const roleRequirements = {
      "Java Developer": [
        "Java", "Data Structures & Algorithms", "OOP",
        "SQL", "DBMS", "Spring Boot", "REST API"
      ],
      "Frontend Developer": [
        "HTML", "CSS", "JavaScript", "React.js", "Git"
      ],
      "Backend Developer": [
        "Node.js", "Express.js", "MongoDB", "SQL", "REST API", "Git"
      ],
      "Software Engineer": [
        "JavaScript", "Python", "Data Structures & Algorithms",
        "OOP", "SQL", "Git"
      ],
      "Full Stack Developer": [
        "HTML", "CSS", "JavaScript", "React.js",
        "Node.js", "Express.js", "MongoDB", "SQL"
      ],
      "Data Analyst": [
        "Python", "SQL", "Excel", "Statistics",
        "Power BI", "Data Visualization"
      ],
      "ML Engineer": [
        "Python", "Machine Learning", "Statistics",
        "Linear Algebra", "TensorFlow", "Data Processing"
      ]
    };

    const requiredSkills = roleRequirements[targetRole.role];

    if (!requiredSkills) {
      return res.status(400).json({
        message: "ATS requirements are not available for this target role."
      });
    }

    // 4. Analyze resume text
    const resumeText = resume.resumeText.toLowerCase();

    const matchedKeywords = requiredSkills.filter(skill =>
      resumeText.includes(skill.toLowerCase())
    );

    const missingKeywords = requiredSkills.filter(skill =>
      !matchedKeywords.some(
        matched => matched.toLowerCase() === skill.toLowerCase()
      )
    );

    // 5. Calculate category scores
    const keywordScore = requiredSkills.length
      ? Math.round((matchedKeywords.length / requiredSkills.length) * 30)
      : 0;

    const skillScore = requiredSkills.length
      ? Math.round((matchedKeywords.length / requiredSkills.length) * 25)
      : 0;

    const hasExperience =
      /\b(experience|internship|intern|employment|worked|developer)\b/i.test(resumeText);

    const hasProjects =
      /\b(projects|project|developed|built|implemented)\b/i.test(resumeText);

    const hasEducation =
      /\b(education|bachelor|b\.tech|b\.e\.|degree|university|college|master)\b/i.test(resumeText);

    const hasContact =
      /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(resumeText);

    const hasSections =
      /\b(summary|objective|skills|education|experience|projects)\b/i.test(resumeText);

    const categoryScores = [
      {
        category: "Keyword Match",
        score: keywordScore,
        maxScore: 30
      },
      {
        category: "Skills",
        score: skillScore,
        maxScore: 25
      },
      {
        category: "Work Experience",
        score: hasExperience ? 15 : 0,
        maxScore: 15
      },
      {
        category: "Projects",
        score: hasProjects ? 15 : 0,
        maxScore: 15
      },
      {
        category: "Education",
        score: hasEducation ? 10 : 0,
        maxScore: 10
      },
      {
        category: "Formatting",
        score: (hasContact ? 3 : 0) + (hasSections ? 2 : 0),
        maxScore: 5
      }
    ];

    const score = categoryScores.reduce(
      (total, category) => total + category.score,
      0
    );

    // 6. Generate strengths
    const strengths = [];

    if (matchedKeywords.length > 0) {
      strengths.push(
        `Your resume contains ${matchedKeywords.length} required skills for ${targetRole.role}.`
      );
    }

    if (hasExperience) strengths.push("Experience-related content was detected.");
    if (hasProjects) strengths.push("Project-related content was detected.");
    if (hasEducation) strengths.push("Education-related content was detected.");
    if (hasContact) strengths.push("An email address was detected.");

    // 7. Generate weaknesses
    const weaknesses = [];

    if (missingKeywords.length > 0) {
      weaknesses.push(
        `Your resume is missing ${missingKeywords.length} role-related keywords.`
      );
    }

    if (!hasExperience) weaknesses.push("Experience-related content was not detected.");
    if (!hasProjects) weaknesses.push("Project-related content was not detected.");
    if (!hasEducation) weaknesses.push("Education-related content was not detected.");
    if (!hasContact) weaknesses.push("A recognizable email address was not detected.");

    // 8. Generate suggestions
    const suggestions = [];

    if (missingKeywords.length > 0) {
      suggestions.push(
        `If you genuinely have these skills, include them in your resume: ${missingKeywords.join(", ")}.`
      );
    }

    if (!hasProjects) {
      suggestions.push("Add a Projects section describing relevant work you have completed.");
    }

    if (!hasExperience) {
      suggestions.push("Add relevant internships, work experience, or practical experience if applicable.");
    }

    if (!hasEducation) {
      suggestions.push("Add a clearly labelled Education section.");
    }

    if (!hasContact) {
      suggestions.push("Add a clearly visible professional email address.");
    }

    if (suggestions.length === 0) {
      suggestions.push("Keep your resume updated with relevant, accurate experience and skills.");
    }

    // 9. Save the score in MongoDB
    const savedScore = await ATSScore.create({
      userId: req.userId,
      targetRole: targetRole.role,
      score,
      categoryScores,
      matchedKeywords,
      missingKeywords,
      strengths,
      weaknesses,
      suggestions
    });

    // 10. Return results to frontend
    res.status(200).json({
      message: "ATS analysis completed successfully",
      scoreData: {
        id: savedScore._id,
        score: savedScore.score,
        targetRole: savedScore.targetRole,
        categoryScores: savedScore.categoryScores,
        matchedKeywords: savedScore.matchedKeywords,
        missingKeywords: savedScore.missingKeywords,
        strengths: savedScore.strengths,
        weaknesses: savedScore.weaknesses,
        suggestions: savedScore.suggestions,
        createdAt: savedScore.createdAt
      }
    });

  } catch (error) {
    console.error("ATS scoring error:", error);

    res.status(500).json({
      message: "Failed to analyze resume",
      error: error.message
    });
  }
});


// ==================== ATS SCORE HISTORY ====================

app.get("/api/resume/score-history", authMiddleware, async (req, res) => {
  try {
    const history = await ATSScore.find({ userId: req.userId })
      .sort({ createdAt: 1 })
      .limit(20)
      .select("score targetRole createdAt");

    res.json({
      message: "ATS score history fetched successfully",
      history
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ATS score history",
      error: error.message
    });
  }
});

// ==================== INTERVIEW APIs ====================

// START INTERVIEW

app.post("/api/interviews", authMiddleware, async (req, res) => {
    try {
        const {
            interviewType,
            targetRole,
            difficulty,
            experienceLevel,
            questionCount
        } = req.body;

        if (!["technical", "coding", "hr"].includes(interviewType)) {
            return res.status(400).json({
                message: "Invalid interview type"
            });
        }

        if (!targetRole) {
            return res.status(400).json({
                message: "Target role is required"
            });
        }

        const count = Number(questionCount) || 5;

        if (!Number.isInteger(count) || count < 1 || count > 15) {
            return res.status(400).json({
                message: "Question count must be between 1 and 15"
            });
        }

        // Generate questions using Gemini
        const questions = await generateInterviewQuestions({
            interviewType,
            targetRole,
            difficulty: difficulty || "Medium",
            experienceLevel: experienceLevel || "Beginner",
            questionCount: count
        });

        // Save interview and generated questions in MongoDB
        const interview = await Interview.create({
            userId: req.userId,
            interviewType,
            targetRole,
            difficulty: difficulty || "Medium",
            questions: questions.map((q) => ({
                questionId: q.id,
                question: q.question,
                hint: q.hint
            }))
        });

        res.status(201).json({
            message: "Interview started successfully",
            interview,
            questions
        });

    } catch (error) {
        console.error("Interview creation error:", error);

        res.status(500).json({
            message: "Failed to start interview",
            error: error.message
        });
    }
});

// SAVE ANSWER



app.put(
    "/api/interviews/:id/answers",
    authMiddleware,
    async (req, res) => {
        try {
            const { questionId, question, answer, code, language } = req.body;

            if (!questionId || !question) {
                return res.status(400).json({
                    message: "Question ID and question are required"
                });
            }

            const interview = await Interview.findOne({
                _id: req.params.id,
                userId: req.userId,
                status: "in-progress"
            });

            if (!interview) {
                return res.status(404).json({
                    message: "Active interview not found"
                });
            }

            const answerData = {
                questionId,
                question,
                answer: answer || "",
                code: code || "",
                language: language || "",
                submittedAt: new Date()
            };

            const existingAnswer = interview.answers.find(
                item => item.questionId === questionId
            );

            if (existingAnswer) {
                Object.assign(existingAnswer, answerData);
                existingAnswer.evaluation = undefined;
            } else {
                interview.answers.push(answerData);
            }

            await interview.save();

            return res.status(200).json({
                message: "Answer saved successfully"
            });

        } catch (error) {
            console.error("Answer saving error:", error);

            return res.status(500).json({
                message: "Failed to save answer",
                error: error.message
            });
        }
    }
);




// COMPLETE INTERVIEW

app.put(
    "/api/interviews/:id/complete",
    authMiddleware,
    async (req, res) => {
        try {
            const interview = await Interview.findOne({
                _id: req.params.id,
                userId: req.userId,
                status: "in-progress"
            });

            if (!interview) {
                return res.status(404).json({
                    message: "Active interview not found"
                });
            }

            let evaluationStatus = "completed";

            // Evaluate all submitted answers in one Gemini API call
            if (interview.answers.length > 0) {
                try {
                    const answersForEvaluation = interview.answers.map(
                        item => ({
                            questionId: item.questionId,
                            question: item.question,
                            answer: item.answer || "",
                            code: item.code || "",
                            language: item.language || ""
                        })
                    );

                    const evaluations = await evaluateInterviewAnswers({
                        answers: answersForEvaluation,
                        interviewType: interview.interviewType,
                        targetRole: interview.targetRole,
                        difficulty: interview.difficulty
                    });

                    const evaluationMap = new Map(
                        evaluations.map(item => [
                            item.questionId,
                            item
                        ])
                    );

                    // Save each evaluation against its corresponding answer
                    for (const answer of interview.answers) {
                        const evaluation = evaluationMap.get(
                            answer.questionId
                        );

                        if (!evaluation) {
                            throw new Error(
                                `Evaluation missing for question ${answer.questionId}`
                            );
                        }

                        answer.evaluation = {
                            score: evaluation.score,
                            feedback: evaluation.feedback,
                            strengths: evaluation.strengths,
                            improvements: evaluation.improvements,
                            idealAnswer: evaluation.idealAnswer
                        };
                    }

                } catch (evaluationError) {
                    console.error(
                        "Gemini batch evaluation error:",
                        evaluationError
                    );

                    evaluationStatus = "failed";
                }
            }

            // Calculate overall interview score
let overallScore = null;

if (
    evaluationStatus === "completed" &&
    interview.answers.length > 0
) {
    const totalScore = interview.answers.reduce(
        (sum, answer) => sum + (answer.evaluation?.score || 0),
        0
    );

    const averageScore = totalScore / interview.answers.length;

    overallScore = Math.round(averageScore * 10);
}

// Complete the interview
interview.status = "completed";
interview.completedAt = new Date();

await interview.save();
return res.status(200).json({
    message: evaluationStatus === "completed"
        ? "Interview completed and evaluated successfully"
        : "Interview completed, but AI evaluation could not be generated",
    evaluationStatus,
    overallScore,
    interview
});

            return res.status(200).json({
                message: evaluationStatus === "completed"
                    ? "Interview completed and evaluated successfully"
                    : "Interview completed, but AI evaluation could not be generated",
                evaluationStatus,
                interview
            });

        } catch (error) {
            console.error("Interview completion error:", error);

            return res.status(500).json({
                message: "Failed to complete interview",
                error: error.message
            });
        }
    }
);



// GET USER'S INTERVIEW HISTORY
app.get("/api/interviews", authMiddleware, async (req, res) => {
    try {
        const interviews = await Interview.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.json({
            message: "Interview history fetched successfully",
            interviews
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch interviews",
            error: error.message
        });
    }
});

app.get("/api/interviews/:id", authMiddleware, async (req, res) => {
    try {
        const interview = await Interview.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        res.json({
            message: "Interview details fetched successfully",
            interview
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch interview details",
            error: error.message
        });
    }
});

// ==================== MONGODB CONNECTION ====================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        console.log("Database:", mongoose.connection.name);
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });


// ==================== START SERVER ====================

app.listen(process.env.PORT || 5000, () => {
    console.log("PlacementForge AI backend is running");
});
// GET saved Resume Builder data
app.get("/api/resume/builder", authMiddleware, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            userId: req.userId
        });

        res.status(200).json({
            resumeData: resume ? resume.resumeData : null
        });

    } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).json({
            message: "Failed to fetch resume data"
        });
    }
});


// SAVE or UPDATE Resume Builder data
app.put("/api/resume/builder", authMiddleware, async (req, res) => {
    try {
        const { resumeData } = req.body;

        if (!resumeData || typeof resumeData !== "object" || Array.isArray(resumeData)) {
            return res.status(400).json({
                message: "Valid resume data is required"
            });
        }

        const resume = await Resume.findOneAndUpdate(
            { userId: req.userId, resumeUrl: "" },
            { $set: { resumeData } },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Resume saved successfully",
            resumeData: resume.resumeData
        });

    } catch (error) {
        console.error("Error saving resume:", error);
        res.status(500).json({
            message: "Failed to save resume data"
        });
    }
});
// ATS Resume Scoring
app.post("/api/ats/score", authMiddleware, async (req, res) => {
    try {
        const { source } = req.body;

        // Validate resume source
        if (!["pdf", "builder"].includes(source)) {
            return res.status(400).json({
                message: "Source must be either pdf or builder"
            });
        }

        // Get the user's selected target role
        const targetRole = await TargetRole.findOne({
            userId: req.userId
        });

        if (!targetRole) {
            return res.status(404).json({
                message: "Please select a target role first"
            });
        }

        let resumeData;

        if (source === "pdf") {
            // Get the latest uploaded PDF resume
            const resume = await Resume.findOne({
                userId: req.userId,
                resumeUrl: { $ne: "" }
            }).sort({ updatedAt: -1 });

            if (!resume || !resume.resumeText.trim()) {
                return res.status(404).json({
                    message: "Please upload a PDF and extract its text first"
                });
            }

            // Use extracted PDF text for skill matching
            resumeData = parseResumeText(resume.resumeText);
            console.log("PDF parsing results:", {
                hasName: !!resumeData.personalInfo?.name,
                hasEmail: !!resumeData.personalInfo?.email,
                hasPhone: !!resumeData.personalInfo?.phone,
                hasLinkedIn: !!resumeData.personalInfo?.linkedin,
                hasGitHub: !!resumeData.personalInfo?.github,
                summaryLength: resumeData.summary?.length || 0,
                skillsLength: resumeData.skills?.length || 0,
                educationLength: resumeData.education?.length || 0,
                experienceLength: resumeData.experience?.length || 0,
                projectsLength: resumeData.projects?.length || 0,
                certificationsLength: resumeData.certifications?.length || 0
            });

        } else {
            // Get Resume Builder data
            const resume = await Resume.findOne({
                userId: req.userId,
                resumeData: { $exists: true }
            }).sort({ updatedAt: -1 });

            if (!resume || !resume.resumeData ||
                Object.keys(resume.resumeData).length === 0) {
                return res.status(404).json({
                    message: "Please complete your Resume Builder first"
                });
            }

            resumeData = resume.resumeData;
        }

        // Calculate ATS score
        const result = calculateATSScore(
            resumeData,
            targetRole.role
        );
        // Save ATS score to history
await ATSScore.create({
    userId: req.userId,
    targetRole: targetRole.role,
    score: result.totalScore
});

        return res.status(200).json({
            message: "ATS score calculated successfully",
            result
        });

    } catch (error) {
        console.error("ATS scoring error:", error);

        return res.status(500).json({
            message: "Failed to calculate ATS score",
            error: error.message
        });
    }
});

// Dashboard ATS Score - automatically detects the latest available resume
app.get("/api/ats/dashboard-score", authMiddleware, async (req, res) => {
    try {
        const targetRole = await TargetRole.findOne({
            userId: req.userId
        });

        if (!targetRole) {
            return res.status(404).json({
                message: "Please select a target role first"
            });
        }

        const resumes = await Resume.find({
            userId: req.userId
        }).sort({ updatedAt: -1 });

        let resumeData = null;
        let source = null;

        for (const resume of resumes) {
            if (resume.resumeUrl && resume.resumeText?.trim()) {
                resumeData = parseResumeText(resume.resumeText);
                source = "pdf";
                break;
            }

            if (
                resume.resumeData &&
                Object.keys(resume.resumeData).length > 0
            ) {
                resumeData = resume.resumeData;
                source = "builder";
                break;
            }
        }

        if (!resumeData) {
            return res.status(404).json({
                message: "No available resume found"
            });
        }

        const result = calculateATSScore(
            resumeData,
            targetRole.role
        );

        return res.status(200).json({
            message: "Dashboard ATS score fetched successfully",
            source,
            result
        });

    } catch (error) {
        console.error("Dashboard ATS score error:", error);

        return res.status(500).json({
            message: "Failed to fetch dashboard ATS score",
            error: error.message
        });
    }
});
