
function extractSection(text, headings) {
    const headingPattern = headings
        .map(heading => heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");

    const regex = new RegExp(
        `(?:^|\\n)\\s*(?:${headingPattern})\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n\\s*(?:[A-Z][A-Z\\s/&-]{2,})\\s*:?\\s*\\n|$)`,
        "i"
    );

    const match = text.match(regex);
    return match ? match[1].trim() : "";
}

function parseResumeText(text) {
    if (!text || typeof text !== "string") {
        throw new Error("Valid resume text is required");
    }

    const cleanText = text
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .trim();

    const email = cleanText.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    );

    const phone = cleanText.match(
        /(?:\+91[\s-]?)?[6-9]\d{9}\b/
    );

    const linkedin = cleanText.match(
        /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|]+/i
    );
    
    const github = cleanText.match(
        /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|]+/i
    );

    const summary = extractSection(cleanText, [
        "Professional Summary",
        "Summary",
        "Profile",
        "Career Objective",
        "Objective"
    ]);

    const skillsText = extractSection(cleanText, [
        "Technical Skills",
        "Skills",
        "Key Skills"
    ]);

    const educationText = extractSection(cleanText, [
        "Education",
        "Academic Background",
        "Educational Qualifications"
    ]);

    const experienceText = extractSection(cleanText, [
        "Experience",
        "Work Experience",
        "Internships",
        "Professional Experience"
    ]);

    const projectsText = extractSection(cleanText, [
        "Projects",
        "Academic Projects",
        "Personal Projects"
    ]);

    const certificationsText = extractSection(cleanText, [
        "Certifications",
        "Certificates"
    ]);

    const achievementsText = extractSection(cleanText, [
        "Achievements",
        "Awards"
    ]);

    return {
        personalInfo: {
            name: cleanText.split("\n")[0]?.trim() || "",
            email: email ? email[0] : "",
            phone: phone ? phone[0] : "",
            linkedin: linkedin ? linkedin[0] : "",
            github: github ? github[0] : ""
        },
        summary,
        skills: skillsText,
        education: educationText,
        experience: experienceText,
        projects: projectsText,
        certifications: certificationsText,
        achievements: achievementsText
    };
}

module.exports = { parseResumeText };
