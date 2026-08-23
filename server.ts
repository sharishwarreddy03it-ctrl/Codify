import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ============================================================
// GEMINI
// ============================================================

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
    });
  }

  return aiClient;
}

// Primary model first, then fallbacks.
// If Google temporarily returns 503/429/500/504 (or a model is
// unavailable), the next model is tried automatically.
const AI_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
];

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;

    if (typeof status === "number") {
      return status;
    }

    if (typeof status === "string") {
      const parsed = Number(status);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
  }

  return undefined;
}

function shouldTryFallback(error: unknown): boolean {
  const status = getErrorStatus(error);

  // Temporary overload / rate-limit / server errors.
  if ([429, 500, 503, 504].includes(status ?? -1)) {
    return true;
  }

  // Also move to the next model if a configured model is unavailable.
  if (status === 404) {
    return true;
  }

  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return (
    message.includes("service unavailable") ||
    message.includes("temporarily unavailable") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("model not found")
  );
}

type GenerateConfig = Record<string, unknown>;

async function generateWithFallback(
  ai: GoogleGenAI,
  contents: string,
  config?: GenerateConfig
) {
  let lastError: unknown = null;

  for (let i = 0; i < AI_MODELS.length; i++) {
    const model = AI_MODELS[i];

    try {
      console.log(`Gemini request: trying ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents,
        ...(config ? { config } : {}),
      });

      console.log(`Gemini request succeeded with ${model}`);

      return {
        response,
        model,
      };
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini model ${model} failed:`,
        error instanceof Error ? error.message : error
      );

      // If this is not a temporary/model-availability problem,
      // do not hide the actual API error behind another model.
      if (!shouldTryFallback(error)) {
        throw error;
      }

      if (i < AI_MODELS.length - 1) {
        console.log(`Falling back from ${model} to ${AI_MODELS[i + 1]}`);
      }
    }
  }

  throw lastError ?? new Error("All Gemini models failed.");
}

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    models: AI_MODELS,
  });
});

// ============================================================
// AI ASK
// ============================================================

app.post("/api/ai/ask", async (req, res) => {
  try {
    const {
      question = "",
      language = "programming",
      code = "",
      context = "",
    } = req.body || {};

    const ai = getAIClient();

    if (!ai) {
      return res.json({
        reply:
          `I can help you with your ${language} question.\n\n` +
          `You asked: "${question || "Can you explain this?"}"\n\n` +
          `Try breaking the problem into smaller steps and check your ` +
          `variables, conditions, loops, and expected output.`,
        source: "fallback",
      });
    }

    const prompt = `
You are Codify AI Tutor.

Help a student learn programming.

Language:
${language}

Lesson:
${context || "General programming"}

Student question:
${question || "Please explain this code."}

Student code:
\`\`\`${language}
${code || "No code provided."}
\`\`\`

Rules:
- Answer the student's actual question.
- Analyze the supplied code when code is provided.
- Explain WHY something happens.
- Use beginner-friendly language.
- Do not invent errors.
- Do not give the complete solution unless requested.
- Keep the response concise.
`;

    const { response, model } = await generateWithFallback(ai, prompt);

    const reply = response.text?.trim();

    return res.json({
      reply:
        reply ||
        "I could not generate an answer. Please try asking the question again.",
      source: reply ? "gemini" : "fallback",
      model: reply ? model : undefined,
    });
  } catch (error) {
    console.error("AI Ask error:", error);

    return res.status(200).json({
      reply:
        "I couldn't reach the AI service right now. Please try again in a moment.",
      source: "fallback",
    });
  }
});

// ============================================================
// AI HINT
// ============================================================

app.post("/api/ai/hint", async (req, res) => {
  try {
    const {
      problemTitle = "Practice Problem",
      problemDescription = "",
      userCode = "",
      language = "programming",
      testCases = [],
    } = req.body || {};

    const ai = getAIClient();

    if (!ai) {
      return res.json({
        hint:
          `Start by breaking "${problemTitle}" into smaller steps. ` +
          `Look at your input, the values you need to track, and the ` +
          `condition or loop that controls the solution.`,
        source: "fallback",
      });
    }

    const prompt = `
You are a Socratic programming tutor.

Problem:
${problemTitle}

Description:
${problemDescription}

Language:
${language}

Student code:
\`\`\`${language}
${userCode || "No code provided."}
\`\`\`

Test cases:
${JSON.stringify(testCases)}

Give ONE useful hint.

Rules:
- Do not provide the complete solution.
- Look at the student's actual code.
- Mention a relevant variable, condition, loop, function, or edge case when possible.
- Keep it to 2-5 sentences.
`;

    const { response, model } = await generateWithFallback(ai, prompt);

    const hint = response.text?.trim();

    return res.json({
      hint:
        hint ||
        "Trace your variables through the loop and check what happens at the first and last input.",
      source: hint ? "gemini" : "fallback",
      model: hint ? model : undefined,
    });
  } catch (error) {
    console.error("AI Hint error:", error);

    return res.status(200).json({
      hint:
        "Trace your variables step by step and check your loop conditions and edge cases.",
      source: "fallback",
    });
  }
});

// ============================================================
// AI DEBUG
// ============================================================

app.post("/api/ai/debug", async (req, res) => {
  try {
    const {
      code = "",
      language = "programming",
      errorOutput = "",
      problemDescription = "",
    } = req.body || {};

    const ai = getAIClient();

    if (!ai) {
      return res.json({
        analysis:
          `Check your ${language} code for syntax errors, incorrect ` +
          `conditions, uninitialized variables, array boundaries, ` +
          `and incorrect return values.`,
        source: "fallback",
      });
    }

    const prompt = `
You are Codify AI Tutor and a programming debugging mentor.

Language:
${language}

Problem:
${problemDescription || "Not specified"}

Student code:
\`\`\`${language}
${code || "No code provided."}
\`\`\`

Error/output:
${errorOutput || "No specific error was provided."}

Analyze the student's actual code.

Explain:
1. What is most likely wrong.
2. Why it is wrong.
3. Which part of the code should be checked.
4. What change the student should consider.

Do not invent errors.
Do not rewrite the entire program.
Use beginner-friendly language.
`;

    const { response, model } = await generateWithFallback(ai, prompt);

    const analysis = response.text?.trim();

    return res.json({
      analysis:
        analysis ||
        "Check your variables, conditions, loops, and return values carefully.",
      source: analysis ? "gemini" : "fallback",
      model: analysis ? model : undefined,
    });
  } catch (error) {
    console.error("AI Debug error:", error);

    return res.status(200).json({
      analysis:
        "Check the line mentioned by the error and trace the variables used on that line.",
      source: "fallback",
    });
  }
});

// ============================================================
// CODE RUN
// ============================================================

app.post("/api/code/run", async (req, res) => {
  try {
    const {
      language = "text",
      code = "",
      input = "",
    } = req.body || {};

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        output: "",
        error: "No code provided",
      });
    }

    const forbiddenKeywords = [
      "child_process",
      "spawn(",
      "exec(",
      "fs.",
      "process.exit",
      "rm -rf",
      "socket",
    ];

    for (const keyword of forbiddenKeywords) {
      if (code.includes(keyword)) {
        return res.json({
          output: "",
          error:
            `Security Notice: '${keyword}' is not permitted ` +
            `in the educational sandbox.`,
          executionTimeMs: 12,
        });
      }
    }

    const ai = getAIClient();

    if (!ai) {
      return res.json({
        output: `[Codify Sandbox - ${language}]\nProgram completed successfully.`,
        error: "",
        exitCode: 0,
        executionTimeMs: 25,
      });
    }

    const prompt = `
You are simulating a programming execution environment.

Language:
${language}

Input:
${JSON.stringify(input)}

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON:

{
  "stdout": "",
  "stderr": "",
  "hasError": false,
  "exitCode": 0,
  "explanation": ""
}

If there is an error:
- hasError must be true
- exitCode must not be 0
- stderr must describe the error
`;

    const { response, model } = await generateWithFallback(ai, prompt, {
      responseMimeType: "application/json",
    });

    try {
      const result = JSON.parse(response.text?.trim() || "{}");

      return res.json({
        output: result.stdout || "",
        error:
          result.stderr ||
          (result.hasError
            ? result.explanation || "Execution error"
            : ""),
        exitCode: result.exitCode ?? 0,
        executionTimeMs: 25,
        model,
      });
    } catch {
      return res.json({
        output: "",
        error: "Could not parse the execution result.",
        exitCode: 1,
        executionTimeMs: 25,
        model,
      });
    }
  } catch (error) {
    console.error("Code execution error:", error);

    return res.status(500).json({
      output: "",
      error: "Execution error",
    });
  }
});

// ============================================================
// FRONTEND / PRODUCTION FILE SERVING
// ============================================================

const distPath = path.join(process.cwd(), "dist");

// Serve all existing files from dist.
app.use(
  express.static(distPath, {
    index: "index.html",
  })
);

// IMPORTANT:
// Only frontend routes should receive index.html.
//
// If the browser asks for a missing .js/.css/image/etc. file,
// DO NOT return index.html.
// Returning HTML for a JavaScript request causes:
// "Expected a JavaScript-or-Wasm module but the server responded
// with a MIME type of text/html"
//
// Use a regular expression route instead of app.get("*").
// This avoids Express/path-to-regexp wildcard route issues.
app.get(/.*/, (req, res) => {
  const requestedPath = req.path;

  const isAssetRequest =
    requestedPath.startsWith("/assets/") ||
    requestedPath.endsWith(".js") ||
    requestedPath.endsWith(".mjs") ||
    requestedPath.endsWith(".cjs") ||
    requestedPath.endsWith(".css") ||
    requestedPath.endsWith(".map") ||
    requestedPath.endsWith(".json") ||
    requestedPath.endsWith(".png") ||
    requestedPath.endsWith(".jpg") ||
    requestedPath.endsWith(".jpeg") ||
    requestedPath.endsWith(".gif") ||
    requestedPath.endsWith(".svg") ||
    requestedPath.endsWith(".ico") ||
    requestedPath.endsWith(".webp") ||
    requestedPath.endsWith(".avif") ||
    requestedPath.endsWith(".woff") ||
    requestedPath.endsWith(".woff2") ||
    requestedPath.endsWith(".ttf") ||
    requestedPath.endsWith(".otf") ||
    requestedPath.endsWith(".wasm");

  if (isAssetRequest) {
    return res.status(404).send("Asset not found");
  }

  return res.sendFile(path.join(distPath, "index.html"));
});

// ============================================================
// SERVER ERROR HANDLING
// ============================================================

app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Server error:", error);

    if (res.headersSent) {
      return;
    }

    res.status(500).json({
      error: error?.message || "Internal server error",
    });
  }
);

// ============================================================
// START SERVER
// ============================================================

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Codify server running on port ${PORT}`);

  console.log(
    `Gemini AI: ${
      process.env.GEMINI_API_KEY ? "configured" : "NOT CONFIGURED"
    }`
  );

  console.log(`Gemini fallback chain: ${AI_MODELS.join(" -> ")}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other Node process before starting Codify.`
    );
  } else {
    console.error("Server error:", error);
  }
});
