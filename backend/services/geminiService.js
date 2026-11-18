
const Groq = require("groq-sdk");

let groqClient;

function getGroqClient() {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("Groq API key is not configured");
    }

    if (!groqClient) {
        groqClient = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    }

    return groqClient;
}

const MODEL = "openai/gpt-oss-20b";

// Generate fresh interview questions
async function generateInterviewQuestions({
    interviewType,
    targetRole,
    difficulty,
    experienceLevel,
    questionCount
}) {
    const groq = getGroqClient();

    const prompt = `
You are an experienced placement interviewer.

Generate exactly ${questionCount} fresh interview questions.

Interview type: ${interviewType}
Target role: ${targetRole}
Difficulty: ${difficulty}
Experience level: ${experienceLevel}

Requirements:
- Questions must be relevant to the target role.
- Match the requested difficulty.
- Avoid duplicate questions.
- HR interviews should contain behavioral questions.
- Coding interviews should contain programming problems.
- Technical interviews should test relevant technical concepts.
- Make every question clear and suitable for a placement interview.

Return JSON in exactly this structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "hint": "Short hint"
    }
  ]
}

Generate exactly ${questionCount} questions.
`;

    const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: {
            type: "json_object"
        },
        temperature: 0.7,
        max_completion_tokens: 4000
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
        throw new Error("Groq returned an empty response");
    }

    const result = JSON.parse(content);

    if (
        !Array.isArray(result.questions) ||
        result.questions.length !== Number(questionCount)
    ) {
        throw new Error("Groq returned an invalid number of questions");
    }

    return result.questions.map((question, index) => ({
        id: `q${index + 1}`,
        question: question.question,
        hint: question.hint || ""
    }));
}


// Evaluate all interview answers in one API call
async function evaluateInterviewAnswers({
    answers,
    interviewType,
    targetRole,
    difficulty
}) {
    const groq = getGroqClient();

    const prompt = `
You are an experienced placement interviewer.

Evaluate every submitted answer independently and fairly.

Target role: ${targetRole}
Interview type: ${interviewType}
Difficulty: ${difficulty}

Candidate responses:
${JSON.stringify(answers, null, 2)}

For each answer:
- Evaluate technical correctness and relevance.
- Check clarity and completeness.
- For coding answers, examine logic and code quality.
- Give a score between 0 and 10.
- Do not give high scores to incorrect or empty answers.
- Provide specific strengths and improvements.
- Provide a concise ideal answer.
- Evaluate every answer independently.

Return valid JSON in exactly this structure:
{
  "evaluations": [
    {
      "questionId": "q1",
      "score": 8,
      "feedback": "Overall evaluation",
      "strengths": ["Strength 1"],
      "improvements": ["Improvement 1"],
      "idealAnswer": "A good sample answer"
    }
  ]
}

Return exactly one evaluation for every submitted answer.
Preserve each questionId exactly.
`;

    const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: {
            type: "json_object"
        },
        temperature: 0.3,
        max_completion_tokens: 6000
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
        throw new Error("Groq returned an empty evaluation");
    }

    const result = JSON.parse(content);

    if (
        !Array.isArray(result.evaluations) ||
        result.evaluations.length !== answers.length
    ) {
        throw new Error("Groq did not evaluate every submitted answer");
    }

    for (const evaluation of result.evaluations) {
        if (
            typeof evaluation.questionId !== "string" ||
            typeof evaluation.score !== "number" ||
            evaluation.score < 0 ||
            evaluation.score > 10 ||
            typeof evaluation.feedback !== "string" ||
            !Array.isArray(evaluation.strengths) ||
            !Array.isArray(evaluation.improvements) ||
            typeof evaluation.idealAnswer !== "string"
        ) {
            throw new Error("Groq returned an invalid evaluation");
        }
    }

    return result.evaluations;
}


module.exports = {
    generateInterviewQuestions,
    evaluateInterviewAnswers
};
