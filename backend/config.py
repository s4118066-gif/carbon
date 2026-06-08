import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth
import google.generativeai as genai

# Load environment variables from .env
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("Gemini API configured successfully in backend!")
else:
    print("WARNING: GEMINI_API_KEY not found in backend environment variables. Chatbot will run in simulation mode.")

# Initialize Firebase
firebase_app = None
db = None

if os.path.exists(FIREBASE_CREDENTIALS_PATH):
    try:
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        firebase_app = firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("Firebase Admin SDK initialized using Service Account JSON!")
    except Exception as e:
        print(f"Error initializing Firebase with JSON credentials: {e}")
else:
    try:
        # Fallback: Initialize with default credentials
        firebase_app = firebase_admin.initialize_app()
        db = firestore.client()
        print("Firebase Admin SDK initialized using Application Default Credentials!")
    except Exception as e:
        print("WARNING: Firebase credentials file not found and ADC initialization failed. Backend will run in offline simulation mode.")

def get_db():
    return db

def get_gemini_model():
    if GEMINI_API_KEY:
        return genai.GenerativeModel('gemini-1.5-flash')
    return None
