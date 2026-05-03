import express, { json } from 'express'
import cors from 'cors'
import multer from 'multer';
import PdfParse from 'pdf-parse-new';
import { SmartPDFParser } from 'pdf-parse-new';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk/client.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

const smarParser = new SmartPDFParser();
const grok = new Groq({
    apiKey: process.env.GROK_API
});

app.use(express.json());
app.use(cors());

app.get("/helloText", (req, res) => {
    res.send({
        myResponse: "Hello world"
    });
})

const storage = multer.memoryStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
});

const upload = multer({
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

        const chatCompletions = grok.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are the most ruthless, sarcastic, and brutally honest senior tech recruiter. 

YOUR INSTRUCTIONS:
1. ROAST LENGTH: The "brutal_roast" MUST be a detailed, highly sarcastic paragraph of AT LEAST 80 to 100 words. Tear apart their tutorial clones, bad formatting, and weak bullet points.
2. ATS SCORE LOGIC: You MUST calculate the score using this strict rubric. Start at 100 points.
   - Deduct 15 points if there are no measurable metrics (e.g., "increased by 20%").
   - Deduct 15 points if the projects are basic tutorial clones (To-Do list, Weather App, basic CRUD).
   - Deduct 10 points for missing GitHub/LinkedIn links.
   - Deduct 10 points for generic buzzwords (e.g., "hard worker", "team player").
   - Deduct 10 points for bad spelling/grammar.
   - Add 5 points for any cloud deployment (AWS, Vercel, etc.).
3. RED FLAGS: Provide exactly 4 highly specific, sarcastic bullet points.
4. ACTIONABLE FIXES: Provide exactly 3 highly specific, serious ways to fix the resume.

You MUST return ONLY a valid JSON object matching this structure:
{
  "ats_score": <calculated number based on rubric>,
  "brutal_roast": "<minimum 80 words of pure sarcasm>",
  "red_flags": ["<point 1>", "<point 2>", "<point 3>", "<point 4>"],
  "good_things": ["<sarcastic compliments>" , "<sarcastic compliments>"],
  "actionable_fixes": ["<fix 1>", "<fix 2>", "<fix 3>"]
}`
                },
                {
                    role: "user",
                    content: `Here is the raw text of the resume. Roast it: ${resumeText}`
                },

            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.2,
            max_completion_tokens: 1500
        })

        const roastedText = (await chatCompletions).choices[0]?.message.content || "No response"

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

        const chatCompletions = grok.chat.completions.create({
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
    { "college": "", "degree": "", "year": "", "cgpa": "" }
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
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.2,
            max_completion_tokens: 1500
        });

        const parsedData = (await chatCompletions).choices[0]?.message.content || "{}";

        res.json({
            message: "Resume scanned successfully",
            data: parsedData
        });

    } catch (error) {
        console.error("Error parsing resume", error);
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