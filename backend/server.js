require("dotenv").config();
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const mongoose = require("mongoose");

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("./models/User");
const Skill = require("./models/Skill");
const Resume = require("./models/resume");
const ExtractedSkill = require("./models/ExtractedSkill");
const TargetRole = require("./models/TargetRole");
const SkillGap = require("./models/SkillGap");
const Roadmap = require("./models/Roadmap");
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
        "https://placement-forge-ai.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
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

        res.json({
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
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

            if (!result.text || !result.text.trim()) {
                return res.status(400).json({
                    message: "No readable text found in this PDF"
                });
            }

            // Save extracted text in MongoDB
            resume.resumeText = result.text;
            await resume.save();

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
            const { role } = req.body;

            if (!role) {
                return res.status(400).json({
                    message: "Target role is required"
                });
            }

            const targetRole = await TargetRole.findOneAndUpdate(
                { userId: req.userId },
                { role: role },
                {
                    new: true,
                    upsert: true
                }
            );

            res.json({
                message: "Target role saved successfully",
                targetRole: targetRole
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
                ]
            };

            const requiredSkills =
                roleRequirements[targetRole.role];

            if (!requiredSkills) {
                return res.status(400).json({
                    message: "Requirements for this role are not available yet"
                });
            }

            // Get skills extracted from the user's resume
            const extractedSkills = await ExtractedSkill.find({
                userId: req.userId
            });

            const userSkills = extractedSkills.map(
                item => item.skill
            );

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