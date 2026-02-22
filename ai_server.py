from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient
import json
import os
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face Configuration
# Create a free token at https://huggingface.co/settings/tokens
HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    print("CRITICAL: HF_TOKEN not found in environment variables.")
    # For local dev, you might want to load from .env manually if not using a runner that does it
    try:
        from dotenv import load_dotenv
        load_dotenv()
        HF_TOKEN = os.getenv("HF_TOKEN")
    except ImportError:
        pass

client = InferenceClient(api_key=HF_TOKEN)

# Model choice: Qwen/Qwen2.5-7B-Instruct is highly compatible with the chat endpoint and great at JSON
MODEL_ID = "Qwen/Qwen2.5-7B-Instruct"

class RequestModel(BaseModel):
    raw_text: str

@app.on_event("startup")
def verify_api():
    print("--- DEBUG: Hugging Face AI Server Starting ---")
    if HF_TOKEN == "hf_PLACEHOLDER_TOKEN_PLEASE_REPLACE":
        print("WARNING: HF_TOKEN is still the placeholder. Please set your real token.")
    else:
        print(f"Token active: {HF_TOKEN[:8]}...")
    print(f"Target Model: {MODEL_ID}")
    print("---------------------------------------------")

@app.get("/health")
def health_check():
    return {"status": "ready"}

SYSTEM_PROMPT = """You are a professional resume parser.
Extract information into a JSON object with EXACTLY this structure:
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "summary": "string",
  "skills": ["string"],
  "education": [{"degree": "string", "institution": "string", "year": "string"}],
  "work_experience": [{"title": "string", "company": "string", "date": "string", "description": "string"}],
  "projects": [{"title": "string", "description": "string"}],
  "languages": ["string"]
}

Rules:
1. Extract ALL details accurately using ONLY the provided text.
2. For 'description' in work experience, include all bullet points.
3. For 'summary', provide a professional overview.
4. If a field is missing, use an empty string or empty array.
5. Return ONLY the raw JSON object, no markdown, no explanations."""

@app.post("/parse")
async def parse_resume(req: RequestModel):
    start_time = time.time()
    try:
        print(f"--- DEBUG: Processing Resume with Hugging Face ({len(req.raw_text)} chars) ---")
        
        # Hugging Face chat completion with JSON mode support
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"TEXT TO PARSE:\n{req.raw_text}"}
        ]
        
        response = client.chat_completion(
            model=MODEL_ID,
            messages=messages,
            max_tokens=2048,
            response_format={"type": "json_object"}
        )
        
        text = response.choices[0].message.content.strip()
        execution_time = time.time() - start_time
        print(f"--- DEBUG: HF Output (took {execution_time:.2f}s) ---\n{text}\n-----------------------")
        
        parsed = json.loads(text)
        return parsed
    except Exception as e:
        execution_time = time.time() - start_time
        print(f"--- DEBUG: HF Error after {execution_time:.2f}s: {e} ---")
        return {"error": "extraction_failed", "message": str(e)}
