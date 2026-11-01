
const ROLE_REQUIREMENTS = {
    "Java Developer": [
        "Java", "OOP", "Data Structures", "SQL",
        "DBMS", "Spring Boot", "REST API"
    ],

    "Python Developer": [
        "Python", "OOP", "Data Structures", "SQL",
        "Flask", "Django", "REST API"
    ],

    "C++ Developer": [
        "C++", "OOP", "Data Structures", "Algorithms",
        "STL", "SQL"
    ],

    "Frontend Developer": [
        "HTML", "CSS", "JavaScript", "React", "Git"
    ],

    "Backend Developer": [
        "Node.js", "Express.js", "MongoDB",
        "SQL", "REST API", "Git"
    ],

    "Full Stack Developer": [
        "HTML", "CSS", "JavaScript", "React",
        "Node.js", "Express.js", "MongoDB", "SQL"
    ],

    "MERN Stack Developer": [
        "MongoDB", "Express.js", "React",
        "Node.js", "JavaScript", "REST API"
    ],

    "Data Analyst": [
        "Python", "SQL", "Excel", "Power BI",
        "Tableau", "Statistics"
    ],

    "Data Scientist": [
        "Python", "SQL", "Statistics",
        "Machine Learning", "Pandas", "NumPy"
    ],

    "Machine Learning Engineer": [
        "Python", "Machine Learning", "Deep Learning",
        "TensorFlow", "PyTorch", "Scikit-learn"
    ],

    "AI Engineer": [
        "Python", "Machine Learning", "Deep Learning",
        "NLP", "LLMs", "RAG"
    ],

    "DevOps Engineer": [
        "Linux", "Git", "Docker", "Kubernetes",
        "CI/CD", "AWS"
    ],

    "Cloud Engineer": [
        "AWS", "Azure", "GCP", "Linux",
        "Networking", "Docker"
    ],

    "QA / Automation Engineer": [
        "Manual Testing", "Selenium", "Java",
        "Python", "API Testing", "SQL"
    ],

    "Cybersecurity Analyst": [
        "Networking", "Linux", "Cybersecurity",
        "Python", "SIEM", "Ethical Hacking"
    ]
};


// Additional skills that can be useful for each role
const ROLE_RELEVANT_SKILLS = {
    "Java Developer": [
        "JavaScript", "React", "Node.js", "Python",
        "PostgreSQL", "MongoDB", "Git", "Docker"
    ],

    "Python Developer": [
        "JavaScript", "React", "Node.js", "MongoDB",
        "Docker", "Git"
    ],

    "C++ Developer": [
        "Java", "Python", "JavaScript", "SQL", "Git"
    ],

    "Frontend Developer": [
        "TypeScript", "Next.js", "Tailwind CSS",
        "Node.js", "Docker"
    ],

    "Backend Developer": [
        "Java", "Python", "PostgreSQL",
        "Docker", "AWS", "Git"
    ],

    "Full Stack Developer": [
        "Python", "Java", "Docker", "AWS"
    ],

    "MERN Stack Developer": [
        "TypeScript", "Next.js", "Tailwind CSS",
        "Docker", "AWS"
    ],

    "Data Analyst": [
        "Java", "JavaScript", "MongoDB", "Git"
    ],

    "Data Scientist": [
        "Java", "R", "Deep Learning", "Docker"
    ],

    "Machine Learning Engineer": [
        "SQL", "Docker", "AWS", "Git"
    ],

    "AI Engineer": [
        "JavaScript", "React", "Node.js", "Docker"
    ],

    "DevOps Engineer": [
        "Python", "Java", "AWS", "Azure"
    ],

    "Cloud Engineer": [
        "Python", "Java", "Docker", "Kubernetes"
    ],

    "QA / Automation Engineer": [
        "JavaScript", "React", "Node.js", "Docker"
    ],

    "Cybersecurity Analyst": [
        "Java", "JavaScript", "Docker", "AWS"
    ]
};


// Alternative names for matching skills
const SKILL_ALIASES = {
    "React": ["React.js"],
    "Express.js": ["Express"],
    "SQL": ["PostgreSQL", "MySQL"],
    "Data Structures": [
        "DSA",
        "Data Structures & Algorithms",
        "Data Structures and Algorithms"
    ]
};


function hasSkill(text, skill) {
    const variations = [
        skill,
        ...(SKILL_ALIASES[skill] || [])
    ];

    return variations.some(variation => {
        const escaped = variation.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(
            `(?<![a-z0-9])${escaped}(?![a-z0-9])`,
            "i"
        );

        return regex.test(text);
    });
}


function calculateATSScore(resume, targetRole) {
    const requiredSkills = ROLE_REQUIREMENTS[targetRole];

    if (!requiredSkills) {
        throw new Error("Unsupported target role");
    }

    // Convert complete resume into searchable text
    
function sectionToText(section) {
    if (!section) return "";

    if (typeof section === "string") {
        return section;
    }

    if (Array.isArray(section)) {
        return section.map(item => {
            if (typeof item === "string") return item;

            if (typeof item === "object" && item !== null) {
                return Object.values(item).join(" ");
            }

            return "";
        }).join(" ");
    }

    return "";
}

const resumeText = [
    resume.summary || "",
    sectionToText(resume.skills),
    sectionToText(resume.education),
    sectionToText(resume.experience),
    sectionToText(resume.projects),
    sectionToText(resume.certifications),
    sectionToText(resume.achievements)
].join(" ");


    const personal = resume.personalInfo || {};

    // Mandatory skills matching
    const matchedSkills = requiredSkills.filter(skill =>
        hasSkill(resumeText, skill)
    );

    const missingSkills = requiredSkills.filter(skill =>
        !hasSkill(resumeText, skill)
    );

    // Additional relevant skills matching
    const additionalRelevantSkills =
        ROLE_RELEVANT_SKILLS[targetRole] || [];

    const matchedRelevantSkills = additionalRelevantSkills.filter(
        skill => hasSkill(resumeText, skill)
    );

    // 1. Skills score: 40 points
    const skillsScore = Math.round(
        (matchedSkills.length / requiredSkills.length) * 40
    );

    // 2. Resume completeness: 20 points
    const completenessFields = [
        personal.name,
        personal.email,
        personal.phone,
        personal.location,
        resume.summary
    ];

    const completedFields = completenessFields.filter(
        field => field && String(field).trim()
    ).length;

    const completenessScore = Math.round(
        (completedFields / completenessFields.length) * 20
    );

    // 3. Projects and experience: 15 points
    const hasProjects = (resume.projects || []).length > 0;
    const hasExperience = (resume.experience || []).length > 0;

    const projectsExperienceScore =
        (hasProjects ? 10 : 0) + (hasExperience ? 5 : 0);

    // 4. Education: 10 points
    const educationScore =
        (resume.education || []).length > 0 ? 10 : 0;

    // 5. Certifications: 10 points
    const certificationsScore =
        (resume.certifications || []).length > 0 ? 10 : 0;

    // 6. Readability and structure: 5 points
    const readabilityScore = [
        personal.linkedin,
        personal.github,
        resume.summary,
        hasProjects,
        (resume.education || []).length > 0
    ].filter(Boolean).length;

    const finalReadabilityScore = readabilityScore;

    // Final ATS score
    const totalScore =
        skillsScore +
        completenessScore +
        projectsExperienceScore +
        educationScore +
        certificationsScore +
        finalReadabilityScore;

    // Suggestions
    const suggestions = [];

    if (missingSkills.length > 0) {
        suggestions.push(
            `Consider learning these missing mandatory skills: ${missingSkills.join(", ")}`
        );
    }

    if (!resume.summary) {
        suggestions.push("Add a professional summary.");
    }

    if (!hasProjects) {
        suggestions.push("Add relevant projects to your resume.");
    }

    if (!hasExperience) {
        suggestions.push("Add internship or work experience if available.");
    }

    if (!(resume.certifications || []).length) {
        suggestions.push("Include relevant certifications if you have them.");
    }

    if (!personal.linkedin) {
        suggestions.push("Add your LinkedIn profile.");
    }

    if (!personal.github) {
        suggestions.push("Add your GitHub profile.");
    }

    return {
        targetRole,

        totalScore,

        categoryScores: {
            skills: skillsScore,
            completeness: completenessScore,
            projectsAndExperience: projectsExperienceScore,
            education: educationScore,
            certifications: certificationsScore,
            readability: finalReadabilityScore
        },

        matchedSkills,
        missingSkills,

        additionalRelevantSkills: matchedRelevantSkills,

        suggestions
    };
}


module.exports = {
    ROLE_REQUIREMENTS,
    ROLE_RELEVANT_SKILLS,
    calculateATSScore
};
