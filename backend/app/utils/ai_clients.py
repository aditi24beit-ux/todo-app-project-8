
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from groq import Groq

# Load backend environment variables
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(env_path, override=True)

# Get API keys from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Check that required API keys are configured
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing from backend .env")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is missing from backend .env")

# Initialize AI clients
gemini_client = genai.Client(api_key=GEMINI_API_KEY)
groq_client = Groq(api_key=GROQ_API_KEY)
