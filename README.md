# Resume Builder (Hugging Face AI Edition)

An AI-powered ATS-friendly Resume Builder that leverages **Qwen-2.5-7B-Instruct** via Hugging Face for industrial-grade extraction accuracy.

## Features
- **Industrial-Grade Extraction**: Powered by Qwen-2.5 for perfect parsing of names, contact info, and complex sections.
- **ATS-Friendly PDF Export**: Generates professionally formatted, single-column PDFs optimized for Applicant Tracking Systems.
- **Instant Preview**: Immediate JSON extraction and real-time preview of your resume.
- **No Heavy Downloads**: Uses serverless inference—no need for 4GB+ model files.
- **Completely Free**: Uses the free Hugging Face Inference API.

## Setup Instructions

### 1. Python Environment
Install the required Hugging Face SDK:
```bash
# Ensure you are in your project directory
.\.venv\Scripts\python.exe -m pip install huggingface_hub
```

### 2. Hugging Face API Key
The server is configured to use the provided Hugging Face Access Token. You can manage your tokens at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

## Running the Application

You will need two separate terminal windows.

### Terminal 1: Run the AI Server (Backend)
Start the FastAPI inference server:
```bash
# On Windows:
.\.venv\Scripts\python.exe -m uvicorn ai_server:app --reload --host 127.0.0.1 --port 8000
```
*Leave this running in the background.*

### Terminal 2: Run the Next.js Frontend
Start the web application:
```bash
npm run dev
```

### Access the Web App
Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

1. **Upload PDF**: Drag & drop your existing resume.
2. **Instant Extraction**: Qwen-2.5 will parse your details accurately.
3. **Edit JSON**: Adjust extracted data in the editor if needed.
4. **Download PDF**: Get your high-quality, ATS-optimized resume!
