import os
import json
import re
import logging
from typing import Dict, Any, List
from datetime import datetime, timezone

from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import httpx

# ─── Load Environment Variables ───────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    print("✅ Gemini Key Loaded:", GEMINI_API_KEY[:10])
else:
    print("❌ GEMINI_API_KEY NOT FOUND")

# ─── MongoDB Setup ────────────────────────────────────────────────────────────

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("❌ MONGO_URI not found in .env")

client = MongoClient(MONGO_URI)
db = client["startupDB"]

predictions_collection = db["predictions"]
analysis_collection = db["analysis"]

print("✅ MongoDB connected")

# ─── Config ───────────────────────────────────────────────────────────────────

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

logging.basicConfig(level=logging.INFO)

# ─── Load ML Model ────────────────────────────────────────────────────────────

try:
    model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
    logging.info("ML model loaded successfully.")
except Exception as e:
    raise RuntimeError(f"Model failed to load: {e}")

# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(title="Startup Predictor + AI Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Request / Response Models ────────────────────────────────────────────────

class PredictionRequest(BaseModel):
    funding: float = Field(gt=0)
    teamSize: int = Field(gt=0, le=100)
    marketSize: float = Field(gt=0)
    founderExperience: int = Field(ge=0, le=40)

class PredictionResponse(BaseModel):
    successProbability: float
    riskLevel: str
    featureImportance: Dict[str, float]
    breakdown: Dict[str, int]
    report: Dict[str, Any]

class AnalyzeRequest(BaseModel):
    ideaName: str = Field(min_length=1, max_length=200)
    idea: str = Field(min_length=10, max_length=5000)
    industry: str = Field(default="Technology")
    targetMarket: str = Field(default="General")

class AnalyzeResponse(BaseModel):
    swot: Dict[str, List[str]]
    marketSize: Dict[str, str]
    competitors: List[Dict[str, str]]
    viabilityScore: int
    businessBrief: str
    recommendation: str

# ─── Helper: Investor Report ─────────────────────────────────────────────────

def generate_investor_report(
    success_probability: float,
    risk_level: str,
    funding_score: int,
    team_score: int,
    market_score: int,
    experience_score: int,
) -> Dict[str, Any]:
    strengths, risks = [], []

    if funding_score > 70: strengths.append("Strong funding position")
    if team_score > 70: strengths.append("Well-sized, capable team")
    if market_score > 70: strengths.append("Large market opportunity")
    if experience_score > 70: strengths.append("Experienced founders")

    if funding_score < 40: risks.append("Low funding")
    if team_score < 40: risks.append("Small team")
    if market_score < 40: risks.append("Limited market")
    if experience_score < 40: risks.append("Low experience")

    if not strengths: strengths.append("Balanced metrics")
    if not risks: risks.append("No major risks")

    if success_probability > 75:
        rec = "Strong investment opportunity."
    elif success_probability > 60:
        rec = "Moderately promising."
    elif success_probability > 45:
        rec = "Needs improvement."
    else:
        rec = "High risk."

    return {"strengths": strengths, "risks": risks, "recommendation": rec}

# ─── Gemini Helpers ──────────────────────────────────────────────────────────

def clean_json_text(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()

def build_fallback(name: str) -> dict:
    return {
        "swot": {
            "strengths": ["Scalable idea"],
            "weaknesses": ["Early stage"],
            "opportunities": ["Market growth"],
            "threats": ["Competition"],
        },
        "marketSize": {
            "tam": "$50B",
            "sam": "$5B",
            "som": "$50M",
        },
        "competitors": [],
        "viabilityScore": 6,
        "businessBrief": f"{name} has potential.",
        "recommendation": "Validate with MVP.",
    }

async def call_gemini(prompt: str) -> str:
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="Missing API key")

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7},
    }

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json=payload,
        )

        if resp.status_code == 429:
            raise HTTPException(status_code=429, detail="Rate limit hit")

        resp.raise_for_status()
        data = resp.json()

    return data["candidates"][0]["content"]["parts"][0]["text"]

# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "API running 🚀"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "gemini_configured": bool(GEMINI_API_KEY),
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    features = np.array([[req.funding, req.teamSize, req.marketSize, req.founderExperience]])

    prob = model.predict_proba(features)[0][1]
    score = round(prob * 85 + 10, 2)

    risk = "low" if score > 70 else "medium" if score > 40 else "high"

    breakdown = {
        "fundingScore": int(req.funding / 5_000_000 * 100),
        "teamScore": int(req.teamSize / 15 * 100),
        "marketScore": int(req.marketSize / 500_000_000 * 100),
        "experienceScore": int(req.founderExperience / 10 * 100),
    }

    report = generate_investor_report(score, risk, *breakdown.values())

    # Persisting history should not break core prediction response.
    try:
        predictions_collection.insert_one({
            "type": "prediction",
            "successProbability": score,
            "riskLevel": risk,
            "funding": req.funding,
            "teamSize": req.teamSize,
            "marketSize": req.marketSize,
            "founderExperience": req.founderExperience,
            "request": req.dict(),
            "response": {
                "successProbability": score,
                "riskLevel": risk,
                "featureImportance": {},
                "breakdown": breakdown,
                "report": report,
            },
            "createdAt": datetime.now(timezone.utc),
        })
    except Exception as db_error:
        logging.exception("Failed to save prediction to MongoDB: %s", db_error)

    return {
        "successProbability": score,
        "riskLevel": risk,
        "featureImportance": {},
        "breakdown": breakdown,
        "report": report,
    }

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    prompt = f"Analyze startup: {req.idea}"

    try:
        raw = await call_gemini(prompt)
        data = json.loads(clean_json_text(raw))

        # Persisting history should not break analysis response.
        try:
            analysis_collection.insert_one({
                "type": "analysis",
                "ideaName": req.ideaName,
                "industry": req.industry,
                "targetMarket": req.targetMarket,
                "viabilityScore": data.get("viabilityScore"),
                "recommendation": data.get("recommendation"),
                "request": req.dict(),
                "response": data,
                "createdAt": datetime.now(timezone.utc),
            })
        except Exception as db_error:
            logging.exception("Failed to save analysis to MongoDB: %s", db_error)

        return data
    except Exception:
        fallback = build_fallback(req.ideaName)
        try:
            analysis_collection.insert_one({
                "type": "analysis",
                "ideaName": req.ideaName,
                "industry": req.industry,
                "targetMarket": req.targetMarket,
                "viabilityScore": fallback.get("viabilityScore"),
                "recommendation": fallback.get("recommendation"),
                "request": req.dict(),
                "response": fallback,
                "createdAt": datetime.now(timezone.utc),
            })
        except Exception as db_error:
            logging.exception("Failed to save fallback analysis to MongoDB: %s", db_error)
        return fallback

@app.get("/predictions")
def get_predictions(limit: int = 20):
    safe_limit = max(1, min(limit, 100))
    cursor = predictions_collection.find({}).sort("createdAt", -1).limit(safe_limit)
    data = []
    for doc in cursor:
        response_data = doc.get("response") or doc.get("output", {})
        request_data = doc.get("request") or doc.get("input", {})
        data.append({
            "_id": str(doc.get("_id")),
            "type": doc.get("type", "prediction"),
            "successProbability": doc.get("successProbability", response_data.get("successProbability")),
            "riskLevel": doc.get("riskLevel", response_data.get("riskLevel")),
            "funding": doc.get("funding", request_data.get("funding")),
            "teamSize": doc.get("teamSize", request_data.get("teamSize")),
            "marketSize": doc.get("marketSize", request_data.get("marketSize")),
            "founderExperience": doc.get("founderExperience", request_data.get("founderExperience")),
            "request": request_data,
            "response": response_data,
            "createdAt": doc.get("createdAt"),
        })
    return data

@app.get("/analyses")
def get_analyses(limit: int = 20):
    safe_limit = max(1, min(limit, 100))
    cursor = analysis_collection.find({}).sort("createdAt", -1).limit(safe_limit)
    data = []
    for doc in cursor:
        response_data = doc.get("response") or doc.get("output", {})
        request_data = doc.get("request") or doc.get("input", {})
        data.append({
            "_id": str(doc.get("_id")),
            "type": doc.get("type", "analysis"),
            "ideaName": doc.get("ideaName", request_data.get("ideaName")),
            "industry": doc.get("industry", request_data.get("industry")),
            "targetMarket": doc.get("targetMarket", request_data.get("targetMarket")),
            "viabilityScore": doc.get("viabilityScore", response_data.get("viabilityScore")),
            "recommendation": doc.get("recommendation", response_data.get("recommendation")),
            "request": request_data,
            "response": response_data,
            "createdAt": doc.get("createdAt"),
        })
    return data

@app.get("/test-gemini")
async def test():
    try:
        return {"response": await call_gemini("Test AI")}
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        logging.exception("Gemini test endpoint failed: %s", exc)
        raise HTTPException(status_code=503, detail="Gemini unavailable")
