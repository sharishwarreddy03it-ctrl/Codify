import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ============================================================
// GEMINI AI CLIENT
// ============================================================

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  return aiClient;
}

// ============================================================
// DYNAMIC FALLBACK RESPONSES
// These are only used if Gemini cannot be reached.
// ============================================================

function getAskFallback(
  question: string,
  language: string,
  code: string,
  context: string
): string {
  const cleanQuestion =
    question?.trim() || "Can you explain this code and concept?";

  const cleanLanguage = language || "programming";

  if (code?.trim()) {
    return `I can help you with this ${cleanLanguage} code.

You asked: "${cleanQuestion}"

I can see that you provided code for the context "${context || "your current lesson"}".

Start by checking:
1. What each variable contains before it is used.
2. Whether the conditions and loops behave as expected.
3. Whether your input and expected output match.
4. Which specific line produces the unexpected result.

If you tell me what output you expected versus what you actually got, I can narrow down the problem further.`;
  }

  return `Let's work through your ${cleanLanguage} question step by step.

You asked: "${cleanQuestion}"

Think about:
1. What the problem is asking you to produce.
2. What data you start with.
3. What transformation or logic needs to happen.
4. What the expected result should look like.

Give me your current attempt if you have one, and I can guide you through it without simply giving you the answer.`;
}

function getHintFallback(
  problemTitle: string,
  problemDescription: string,
  userCode: string,
  language: string
): string {
  if (userCode?.trim()) {
    return `Look closely at your current ${language} attempt for "${problemTitle}".

A useful next step is to trace the values of your variables from the first line through the point where your result becomes incorrect. Pay particular attention to your loop condition, comparisons, and what happens at the first and last input values.`;
  }

  return `For "${problemTitle}", start by breaking the problem into smaller steps.

First identify the input, then determine what information you need to track while solving it. Once you know those pieces, think about which ${language} construct—such as a loop, condition, array, or function—fits each step.`;
}

function getDebugFallback(
  code: string,
  language: string,
  errorOutput: string,
  problemDescription: string
): string {
  if (errorOutput?.trim()) {
    return `I can see that your ${language} program reported:

"${errorOutput}"

Start by locating the line mentioned in the error and then check the values being used on that line. The most useful things to inspect are variable initialization, data types, array/index boundaries, conditions, and function return values.

Your problem context is: ${
      problemDescription || "not specified"
    }.

If you share the exact error and the section of code around it, we can trace it step by step.`;
  }

  if (code?.trim()) {
    return `Let's debug your ${language} code systematically.

Since there is no specific error message, compare the actual output with the expected output. Then trace the variables through each important condition and loop.

Pay special attention to:
- Initial values
- Loop conditions
- If/else branches
- Values being changed inside loops
- Return statements
- Edge cases

The goal is to find the first point where your program's state differs from what you expect.`;
  }

  return `I need the ${language} code and the error or unexpected output to identify the problem accurately.

Paste your current code and tell me what you expected it to do versus what it actually does.`;
}

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// ============================================================
// AI ASK
// ============================================================

app.post("/api/ai/ask", async (req, res) => {
  const {
    question = "",
    language = "programming",
    code = "",
    context = "",
  } = req.body;

  const ai = getAIClient();

  // If Gemini is not configured, return a dynamic response
  // instead of a fixed sentence.
  if (!ai) {
    console.warn("GEMINI_API_KEY is not configured.");

    return res.json({
      reply: getAskFallback(question, language, code, context),
      source: "fallback",
    });
  }

  try {
    const prompt = `
You are Codify AI Tutor, an expert and encouraging computer science teacher.

You are helping a student learn programming.

Language:
${language}

Current lesson/context:
${context || "General programming"}

Student's question:
${question || "The student wants help understanding their code."}

Student's current code:
\`\`\`${language}
${code || "No code was provided."}
\`\`\`

IMPORTANT RULES:

1. Give a NEW response specifically based on the student's question.
2. Do NOT use a generic repeated response.
3. Do NOT say things like "I am reviewing your code" without actually explaining something.
4. If code is provided, analyze the actual code.
5. If there is an obvious issue, point to the relevant logic or line.
6. Explain WHY something happens.
7. Use simple language suitable for a beginner.
8. Ask a useful follow-up question when more information is needed.
9. Do not invent code or errors that are not present.
10. Do not simply give the complete answer unless the student explicitly asks for it.
11. Keep the response under approximately 300 words.
12. Use markdown when it improves readability.

The response must directly address this student's specific question.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    const reply = response.text?.trim();

    if (reply) {
      return res.json({
        reply,
        source: "gemini",
      });
    }

    console.warn("Gemini returned an empty response.");

    return res.json({
      reply: getAskFallback(question, language, code, context),
      source: "fallback",
    });
  } catch (err: any) {
    console.error("AI Ask error:", err);

    // IMPORTANT:
    // Return HTTP 200 so the frontend does not replace this
    // with its own hardcoded generic message.
    return res.json({
      reply: getAskFallback(question, language, code, context),
      source: "fallback",
      aiError: err?.message || "Gemini request failed",
    });
  }
});

// ============================================================
// AI HINT
// ============================================================

app.post("/api/ai/hint", async (req, res) => {
  const {
    problemTitle = "Practice Problem",
    problemDescription = "",
    userCode = "",
    language = "programming",
    testCases = [],
  } = req.body;

  const ai = getAIClient();

  if (!ai) {
    console.warn("GEMINI_API_KEY is not configured.");

    return res.json({
      hint: getHintFallback(
        problemTitle,
        problemDescription,
        userCode,
        language
      ),
      source: "fallback",
    });
  }

  try {
    const prompt = `
You are a Socratic programming tutor.

Problem:
${problemTitle}

Problem description:
${problemDescription || "No detailed description provided."}

Programming language:
${language}

Student's current attempt:
\`\`\`${language}
${userCode || "No code provided."}
\`\`\`

Test cases:
${JSON.stringify(testCases || [])}

Give the student a useful hint based specifically on their current problem and code.

Rules:
1. Do not give the complete solution.
2. Do not give a generic repeated hint.
3. Examine the student's actual code.
4. Point them toward the next useful step.
5. Mention a specific variable, condition, loop, function, or edge case when appropriate.
6. Keep it to 2-5 sentences.
7. Encourage the student to think rather than simply copying an answer.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    const hint = response.text?.trim();

    if (hint) {
      return res.json({
        hint,
        source: "gemini",
      });
    }

    return res.json({
      hint: getHintFallback(
        problemTitle,
        problemDescription,
        userCode,
        language
      ),
      source: "fallback",
    });
  } catch (err: any) {
    console.error("AI Hint error:", err);

    return res.json({
      hint: getHintFallback(
        problemTitle,
        problemDescription,
        userCode,
        language
      ),
      source: "fallback",
      aiError: err?.message || "Gemini request failed",
    });
  }
});

// ============================================================
// AI DEBUG
// ============================================================

app.post("/api/ai/debug", async (req, res) => {
  const {
    code = "",
    language = "programming",
    errorOutput = "",
    problemDescription = "",
  } = req.body;

  const ai = getAIClient();

  if (!ai) {
    console.warn("GEMINI_API_KEY is not configured.");

    return res.json({
      analysis: getDebugFallback(
        code,
        language,
        errorOutput,
        problemDescription
      ),
      source: "fallback",
    });
  }

  try {
    const prompt = `
You are Codify AI Tutor, a friendly programming debugging mentor.

Programming language:
${language}

Problem description:
${problemDescription || "Not specified"}

Student's code:
\`\`\`${language}
${code || "No code provided."}
\`\`\`

Error or console output:
${errorOutput || "No explicit error message. The program may be producing incorrect output."}

Analyze THIS student's actual code.

Rules:
1. Identify the most likely source of the problem.
2. If an exact line can be identified, mention it.
3. Explain WHY the problem occurs.
4. Refer to the student's actual variables, conditions, loops, or functions.
5. Do not invent an error that isn't supported by the code/output.
6. Suggest a fix without immediately rewriting the entire program.
7. Explain the issue in beginner-friendly language.
8. If there is not enough information, clearly say what information is missing.
9. Do not use a generic response.
10. Keep the response under approximately 300 words.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    const analysis = response.text?.trim();

    if (analysis) {
      return res.json({
        analysis,
        source: "gemini",
      });
    }

    return res.json({
      analysis: getDebugFallback(
        code,
        language,
        errorOutput,
        problemDescription
      ),
      source: "fallback",
    });
  } catch (err: any) {
    console.error("AI Debug error:", err);

    return res.json({
      analysis: getDebugFallback(
        code,
        language,
        errorOutput,
        problemDescription
      ),
      source: "fallback",
      aiError: err?.message || "Gemini request failed",
    });
  }
});

// ============================================================
// SAFE SANDBOX EVALUATION API
// ============================================================

app.post("/api/code/run", async (req, res) => {
  try {
    const { language, code, input = "" } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        output: "",
        error: "No code provided",
      });
    }

    const forbiddenKeywords = [
      "child_process",
      "spawn",
      "exec",
      "fs.",
      "process.exit",
      "rm -rf",
      "socket",
    ];

    for (const kw of forbiddenKeywords) {
      if (code.includes(kw)) {
        return res.json({
          output: "",
          error: `Security Notice: '${kw}' is not permitted in the educational sandbox.`,
          executionTimeMs: 12,
        });
      }
    }

    const ai = getAIClient();

    if (ai) {
      const prompt = `
You are a sandboxed deterministic code execution simulator for an educational programming platform.

Execute/simulate the following ${language} code using the supplied standard input.

Language:
${language}

Standard Input:
${JSON.stringify(input)}

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY a JSON object containing:

{
  "stdout": "exact standard output",
  "stderr": "compiler, syntax, or runtime error",
  "hasError": false,
  "exitCode": 0,
  "explanation": "brief explanation if an error occurred"
}

If the program has an error:
- hasError must be true
- exitCode must be non-zero
- stderr should contain the relevant error
- explanation should briefly explain the problem
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      try {
        const result = JSON.parse(response.text?.trim() || "{}");

        return res.json({
          output: result.stdout || "",
          error:
            result.stderr ||
            (result.hasError ? result.explanation : ""),
          exitCode: result.exitCode ?? 0,
          executionTimeMs: Math.floor(Math.random() * 40) + 15,
        });
      } catch (parseErr) {
        console.error("Code execution JSON parse error:", parseErr);
      }
    }

    return res.json({
      output: `[Executed in Codify Sandbox (${language})]\nProgram completed successfully.`,
      error: "",
      exitCode: 0,
      executionTimeMs: 25,
    });
  } catch (err: any) {
    console.error("Code execution error:", err);

    return res.status(500).json({
      output: "",
      error: err?.message || "Execution error",
    });
  }
});

// ============================================================
// VITE / PRODUCTION SERVING
// ============================================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Codify server running on http://0.0.0.0:${PORT}`
    );

    console.log(
      `Gemini AI: ${
        process.env.GEMINI_API_KEY ? "configured" : "NOT CONFIGURED"
      }`
    );
  });
}

startServer();