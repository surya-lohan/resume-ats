import express from 'express'
import cors from 'cors'
import multer from 'multer';
import PdfParse from 'pdf-parse-new';
import { SmartPDFParser } from 'pdf-parse-new';

const app = express();
const smarParser = new SmartPDFParser();

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

        console.log("Extracted Text:", pdfData.text);
        res.json({
            message: "Success!",
            pages: pdfData.numpages,
            text: pdfData.text
        });

    } catch (error) {
        console.error("Error reading PDF:", error);
        res.status(500).json({ error: "Failed to parse PDF" });
    }

})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
});