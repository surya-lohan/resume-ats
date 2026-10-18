import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { SmartPDFParser } from 'pdf-parse-new'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { OpenRouter } from '@openrouter/sdk'

dotenv.config()
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'dist')))

const smarParser = new SmartPDFParser()
const client = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
})

app.use(express.json())
app.use(cors())

app.get('/helloText', (req, res) => {
  res.send({
    myResponse: 'Hello world',
  })
})

const storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "text/csv",
      "image/png",
      "image/jpeg"
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  }
});


app.post("/uploadFile", upload.single("file"), async (req, res) => {

  try {
    if (!req.file) {
      return res.status(404).json({
        Error: "File not found"
      })
    }

    const pdfBuffer = req.file.buffer;

    const pdfData = await smarParser.parse(pdfBuffer);
    const resumeText = pdfData.text;

    const chatCompletions = await client.chat.send({
      chatRequest: {
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
          {
            role: "system",
            content: `
You are ResumeDestroyer-9000 — a brutally honest, razor-sharp sarcastic AI resume evaluator 
with the combined personality of a burned-out senior recruiter, a disappointed hiring manager, 
and a stand-up comedian who moonlights in HR. You have reviewed over 500,000 resumes and your 
tolerance for mediocrity has been surgically removed.

Your job has two distinct responsibilities, and you must take BOTH equally seriously:

═══════════════════════════════════════════════
RESPONSIBILITY 1 — ATS SCORE (Be clinically accurate)
═══════════════════════════════════════════════

Before writing a single word of roast copy, you MUST silently evaluate the resume 
against this weighted ATS rubric (total = 100 points):

  [25 pts] KEYWORD DENSITY & RELEVANCE
    • Are industry-standard hard skills, tools, and role-specific keywords present?
    • Are keywords naturally distributed (not keyword-stuffed in a hidden block)?
    • Do verbs align with the target role's JD language?
    Score 0–25 based on density, placement, and relevance quality.

  [20 pts] FORMAT & ATS-PARSEABILITY
    • No tables, columns, text boxes, headers/footers, or inline graphics?
    • Clean section headers (Experience, Education, Skills, etc.)?
    • Standard readable fonts and no excessive special characters?
    Score 0–20 based on how cleanly an ATS parser would extract this data.

  [15 pts] SECTION COMPLETENESS
    • Presence and quality of: Contact Info, Summary/Objective, Work Experience, 
      Education, Skills. Bonus sections: Certifications, Projects, Awards.
    Score 0–15 based on presence and adequacy of critical sections.

  [20 pts] QUANTIFIED ACHIEVEMENTS
    • Do bullet points contain numbers, percentages, dollar figures, timeframes, or scale?
    • Are accomplishments shown (not just duties listed)?
    Score 0–20 based on the ratio of achievement bullets vs. responsibility-only bullets.

  [10 pts] JOB TITLE & CAREER TRAJECTORY CLARITY
    • Are job titles clear, standard, and interpretable by ATS?
    • Is career progression logical and visible?
    Score 0–10.

  [10 pts] LENGTH, DENSITY & READABILITY
    • Is the resume appropriately sized (1 page for <5 yrs, 2 pages max otherwise)?
    • Is white space reasonable? Is it scannable?
    Score 0–10.

Sum all six category scores. This is your ats_score. Do not inflate or soften it.
A score of 40 is a score of 40. Report the truth.

═══════════════════════════════════════════════
RESPONSIBILITY 2 — THE ROAST (Be mercilessly funny)
═══════════════════════════════════════════════

After scoring, switch to full roast mode. Your sarcasm must be:
  • SHARP — Every line should sting with wit, not vague insults
  • HONEST — The roast must reflect REAL problems in the resume
  • PUNCHY — No filler. Every sentence earns its place.
  • CONSTRUCTIVE beneath the surface — even the roast should implicitly signal what's wrong

Sarcasm style reference: Think David Letterman meets Simon Cowell meets a burned-out 
LinkedIn influencer who has seen "passionate team player with strong communication skills" 
one too many times.

TONE GUARDRAILS:
  ✗ Never attack the person's identity, background, or personal characteristics
  ✗ Never use slurs, profanity, or genuinely cruel language
  ✓ Always attack the resume — the choices, the clichés, the laziness, the missed opportunities
  ✓ Sarcastic compliments in good_things should feel like backhanded praise 
    (e.g., "Wow, they did include their email address. The bar is on the floor.")

═══════════════════════════════════════════════
OUTPUT FORMAT — STRICT JSON ONLY
═══════════════════════════════════════════════

You MUST return ONLY a valid JSON object. No preamble. No explanation. No markdown fences.
No "Here is your roast:". Just raw JSON, starting with { and ending with }.

{
  "ats_score": <integer 0–100, calculated from rubric above>,
  "section_scores": {
    "keywords": <integer 0–25>,
    "formatting": <integer 0–20>,
    "quantified_impact": <integer 0–20>,
    "completeness": <integer 0–15>,
    "trajectory": <integer 0–10>,
    "readability": <integer 0–10>
  },
  "brutal_roast": "<2–4 sentence savage but accurate roast paragraph>",
  "red_flags": [
    "<specific, concrete problem observed in the resume>",
    "<specific, concrete problem observed in the resume>",
    "<specific, concrete problem observed in the resume>",
    ... (as many as genuinely exist, minimum 3)
  ],
  "good_things": [
    "<sarcastic backhanded compliment about something that is actually decent>",
    "<sarcastic backhanded compliment about something that is actually decent>",
    ... (minimum 2, only if something genuinely good exists — don't invent praise)
  ],
  "actionable_fixes": [
    "<specific, implementable fix — what to change and ideally how>",
    "<specific, implementable fix — what to change and ideally how>",
    "<specific, implementable fix — what to change and ideally how>",
    ... (minimum 4, prioritized by impact on ATS score and human readability)
  ]
}

═══════════════════════════════════════════════
INTERNAL PROCESS (do this silently before responding)
═══════════════════════════════════════════════
Step 0 — Always keep in mind that the current ongoing year is 2026.
Step 1 — Read the entire resume text carefully.
Step 2 — Score each of the 6 ATS rubric dimensions. Sum them.
Step 3 — Identify the 3–7 most glaring problems (these become red_flags).
Step 4 — Identify 1–3 genuine positives, however small (these become good_things with sarcastic framing).
Step 5 — Determine the highest-impact fixes (these become actionable_fixes).
Step 6 — Write the brutal_roast last, after you know the full picture. It should feel earned.
Step 7 — Assemble and return the JSON object. Nothing else.

`
          },
          {
            role: "user",
            content: `Roast this resume.${req.body?.targetRole ? ` Target Role / Context: "${req.body.targetRole}".` : ''} Here is the full resume text: ${resumeText}`
          },

        ],
      },
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_completion_tokens: 3000
    })

    const roastedText = (chatCompletions).choices[0]?.message.content || "No response"

    res.json({
      message: "Resume roasted succesefully",
      roast: roastedText,
      resumeData: resumeText
    })

  } catch (error) {
    console.error("Error generating text", error);
    res.status(500).json({ error: "Something broke." });
  }

})

app.post('/scanResume', upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(404).json({
        message: "Please select the right file!"
      })
    }

    const pdfBuffer = req.file.buffer;
    const pdfData = await smarParser.parse(pdfBuffer);
    const resumeText = pdfData.text;

    const chatCompletions = await client.chat.send({
      chatRequest: {
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
          {
            role: "system",
            content: `You are an expert Applicant Tracking System (ATS) data parser. Your task is to extract information from the provided unstructured resume text and output it STRICTLY as a valid JSON object. 
CRITICAL INSTRUCTIONS:
1. Output ONLY valid JSON. Do not include any conversational text, greetings, explanations, or markdown formatting (do not use \`\`\`json backticks). 
2. You must strictly adhere to the exact JSON schema provided below. Do not add, remove, or rename any keys.
3. If a piece of information is missing from the text, you MUST use an empty string "". Do NOT use null, undefined, or "N/A".
4. For arrays (education, experience, projects, skills), create a new object in the array for each distinct entry found in the text. If no entries are found for a category, return an array with one empty object matching the schema.
5. Dates and durations should be extracted exactly as written (e.g., "Jan 2024 - Present").

REQUIRED JSON SCHEMA:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "description": ""
  },
  "education": [
    { "college": "", "degree": "", "year": "", "cgpa": "", "location": "" }
  ],
  "experience": [
    { "company": "", "role": "", "description": "", "duration": "" }
  ],
  "projects": [
    { "name": "", "description": "", "tools": "", "duration": "" }
  ],
  "skills": [
    { "Languages": "", "Frameworks": "", "Tools": "" }
  ]
}`
          },
          {
            role: "user",
            content: `Here is the raw text of the resume. Parse it: ${resumeText}`
          }
        ]
      },
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_completion_tokens: 1500
    });

    const parsedData = (chatCompletions).choices[0]?.message.content || "{}";

    res.json({
      message: "Resume scanned successfully",
      data: parsedData
    });

  } catch (error) {
    console.error("Error parsing resume", error);
    res.status(500).json({ error: "Something broke." });
  }
})

app.post('/fixresume', async (req, res) => {
  try {
    if (!req.body || (typeof req.body === 'object' && Object.keys(req.body).length === 0)) {
      return res.status(400).json({
        message: "Unable to find data!"
      })
    }

    const roastData = req.body;
    const rawResumeText = roastData.rawResumeText || "";
    const actionableFixes = Array.isArray(roastData.actionable_fixes)
      ? roastData.actionable_fixes.map((fix, idx) => `${idx + 1}. ${fix}`).join("\n")
      : (typeof roastData.actionable_fixes === 'string' ? roastData.actionable_fixes : "");
    const redFlags = Array.isArray(roastData.red_flags)
      ? roastData.red_flags.map((flag, idx) => `${idx + 1}. ${flag}`).join("\n")
      : "";
    const targetRole = roastData.targetRole || "";

    const userPrompt = `Please fix and reconstruct this candidate's resume into the required JSON schema, applying the audit fixes and optimizing for high ATS compatibility:

${targetRole ? `TARGET ROLE:\n${targetRole}\n\n` : ''}${actionableFixes ? `ACTIONABLE FIXES TO IMPLEMENT:\n${actionableFixes}\n\n` : ''}${redFlags ? `RED FLAGS TO RESOLVE:\n${redFlags}\n\n` : ''}ORIGINAL RESUME CONTENT:
${rawResumeText || JSON.stringify(roastData, null, 2)}`;

    const chatCompletion = await client.chat.send({
      chatRequest: {
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
          {
            role: "system",
            content: `You are a Senior level Software Engineer and resume optimization expert. Your task is to extract information from the provided resume text and optimize it using the provided actionable fixes and red flags to produce an updated output as a STRICTLY valid JSON object.
CRITICAL INSTRUCTIONS:
1. Output ONLY valid JSON. Do not include any conversational text, greetings, explanations, or markdown formatting (do not use \`\`\`json backticks). 
2. You must strictly adhere to the exact JSON schema provided below. Do not add, remove, or rename any keys.
3. If a piece of information is missing from the text, you MUST use an empty string "". Do NOT use null, undefined, or "N/A".
4. For arrays (education, experience, projects, skills), create a new object in the array for each distinct entry found in the text. If no entries are found for a category, return an array with one empty object matching the schema.
5. Dates and durations should be extracted exactly as written (e.g., "Jan 2024 - Present").
6. Rewrite and polish experience bullets and project descriptions to include measurable metrics, strong action verbs, and keyword optimization based on the actionable fixes.
7. DO NOT RETURN AN EMPTY JSON OBJECT OR EMPTY ARRAYS. Extract all candidate information from the original resume content.

REQUIRED JSON SCHEMA:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "description": ""
  },
  "education": [
    { "college": "", "degree": "", "year": "", "cgpa": "", "location": "" }
  ],
  "experience": [
    { "company": "", "role": "", "description": "", "duration": "" }
  ],
  "projects": [
    { "name": "", "description": "", "tools": "", "duration": "" }
  ],
  "skills": [
    { "Languages": "", "Frameworks": "", "Tools": "" }
  ]
}`
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_completion_tokens: 3000
      }
    })

    let parsedData = (chatCompletion).choices[0]?.message.content || "{}";
    parsedData = parsedData.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    res.json({
      message: "Resume updated successfully",
      data: parsedData
    });

  } catch (error) {
    console.error("Error updating resume", error);
    res.status(500).json({ error: "Something broke." });
  }
})

app.use(/\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});