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
const Resume = require("./models/Resume");
const ExtractedSkill = require("./models/ExtractedSkill");
const TargetRole = require("./models/TargetRole");
const SkillGap = require("./models/SkillGap");
const Roadmap = require("./models/Roadmap");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
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
app.use(express.json());


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

            const resumeUrl = `/uploads/${req.file.filename}`;

            const existingResume = await Resume.findOne({
                userId: req.userId
            });

            if (existingResume) {
                existingResume.resumeUrl = resumeUrl;
                await existingResume.save();

                return res.json({
                    message: "Resume uploaded successfully",
                    resume: existingResume
                });
            }

            const newResume = new Resume({
                userId: req.userId,
                resumeUrl: resumeUrl
            });

            await newResume.save();

            res.status(201).json({
                message: "Resume uploaded successfully",
                resume: newResume
            });

        } catch (error) {
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
        try {
            const resume = await Resume.findOne({
                userId: req.userId
            });

            if (!resume) {
                return res.status(404).json({
                    message: "Resume not found"
                });
            }

            const filePath = "." + resume.resumeUrl;

            const dataBuffer = fs.readFileSync(filePath);

            const parser = new PDFParse({
                data: dataBuffer
            });

            const result = await parser.getText();

            await parser.destroy();

            // Save extracted text in MongoDB
            resume.resumeText = result.text;
            await resume.save();

            res.json({
                message: "Resume text extracted and saved successfully",
                text: result.text
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to extract resume text",
                error: error.message
            });
        }
    }
);

app.post(
    "/api/resume/extract-skills",
    authMiddleware,
    async (req, res) => {
        try {
            const resume = await Resume.findOne({
                userId: req.userId
            });

            if (!resume || !resume.resumeText) {
                return res.status(404).json({
                    message: "Resume text not found"
                });
            }

            const skillList = [
                "Java",
                "Python",
                "C++",
                "JavaScript",
                "React",
                "React.js",
                "Node.js",
                "Express.js",
                "MongoDB",
                "SQL",
                "DBMS",
                "OOP",
                "Data Structures",
                "Data Structures & Algorithms",
                "HTML",
                "CSS",
                "Tailwind CSS",
                "Git",
                "GitHub",
                "AWS",
                "Docker"
            ];

            const resumeText = resume.resumeText.toLowerCase();

            const extractedSkills = skillList.filter(skill =>
                resumeText.includes(skill.toLowerCase())
            );

            for (const skill of extractedSkills) {
                await ExtractedSkill.updateOne(
                    {
                        userId: req.userId,
                        skill: skill
                    },
                    {
                        userId: req.userId,
                        skill: skill
                    },
                    {
                        upsert: true
                    }
                );
            }

            res.json({
                message: "Skills extracted successfully",
                skills: extractedSkills
            });

        } catch (error) {
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
