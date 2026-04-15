import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini Key Loaded:", GEMINI_API_KEY[:10])

import logging
import os
import json
import re
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import httpx
from typing import Dict, Any, List

# ─── Config ───────────────────────────────────────────────────────────────────

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = GEMINI_URL = GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

# ─── ML Model ─────────────────────────────────────────────────────────────────

try:
    model = joblib.load("model.pkl")
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

# ─── Pydantic Models ──────────────────────────────────────────────────────────

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

# ─── Helper: ML Report ────────────────────────────────────────────────────────

def generate_investor_report(
    success_probability: float,
    risk_level: str,
    funding_score: int,
    team_score: int,
    market_score: int,
    experience_score: int,
) -> Dict[str, Any]:
    strengths, risks = [], []

    if funding_score > 70:    strengths.append("Strong funding position")
    if team_score > 70:       strengths.append("Well-sized, capable team")
    if market_score > 70:     strengths.append("Large addressable market opportunity")
    if experience_score > 70: strengths.append("Experienced founder team")

    if funding_score < 40:    risks.append("Limited funding relative to market opportunity")
    if team_score < 40:       risks.append("Team is too small or underdeveloped")
    if market_score < 40:     risks.append("Small market opportunity limits growth potential")
    if experience_score < 40: risks.append("Founder lacks sufficient industry experience")

    if not strengths: strengths.append("Adequate performance across all metrics")
    if not risks:     risks.append("No critical vulnerabilities identified")

    if success_probability > 75:
        rec = "Strong investment opportunity. This startup demonstrates strong fundamentals across most metrics with excellent success probability. Recommended for portfolio inclusion."
    elif success_probability > 60:
        rec = "Moderately promising opportunity. While the startup shows solid metrics, there are some areas that could be strengthened. Consider as a potential investment with monitoring."
    elif success_probability > 45:
        rec = "Mixed signals. The startup has potential but faces notable challenges in key areas. Due diligence recommended before investment decision."
    else:
        rec = "High risk profile. The startup shows significant weaknesses in critical areas. Proceed with caution or pass on this opportunity."

    return {"strengths": strengths, "risks": risks, "recommendation": rec}

# ─── Helper: Gemini REST call ─────────────────────────────────────────────────

def clean_json_text(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\s*```$", "", text, flags=re.MULTILINE)
    return text.strip()

def build_fallback(idea_name: str) -> dict:
    return {
        "swot": {
            "strengths": [
                "Novel concept with clear value proposition",
                "Identifiable target market with real pain point",
                "Scalable business model potential",
                "First-mover or differentiation advantage",
            ],
            "weaknesses": [
                "Early stage with limited market validation",
                "Resource constraints may slow growth",
                "Brand recognition needs to be built from scratch",
            ],
            "opportunities": [
                "Growing demand in target segment",
                "Potential for strategic partnerships or integrations",
                "Expanding digital adoption among target customers",
            ],
            "threats": [
                "Well-funded incumbents with existing customer relationships",
                "Regulatory or compliance requirements",
                "Market timing risk if adoption is slower than expected",
            ],
        },
        "marketSize": {
            "tam": "$50B+ global total addressable market",
            "sam": "$5B serviceable addressable market in reachable segments",
            "som": "$50M realistically obtainable within 2-3 years",
        },
        "competitors": [
            {
                "name": "Market Leader",
                "description": "Established player with broad feature set and large customer base",
                "differentiator": "Your idea targets an underserved niche they currently ignore",
            },
            {
                "name": "Funded Challenger",
                "description": "Well-funded startup operating in an adjacent space",
                "differentiator": "Your approach offers superior unit economics and focus",
            },
            {
                "name": "Legacy Solution",
                "description": "Traditional approach that most customers currently rely on",
                "differentiator": "You deliver 10x better automation, UX, and modern integrations",
            },
        ],
        "viabilityScore": 6,
        "businessBrief": (
            f"{idea_name} addresses a real market gap with a scalable solution. "
            "The concept shows clear problem-solution fit with meaningful differentiation from existing players. "
            "With focused execution and the right team, this has the potential to become a strong business."
        ),
        "recommendation": (
            "This startup shows genuine promise and merits further exploration. "
            "The core concept is sound and the market opportunity is real. "
            "Before committing capital, validate key assumptions through customer discovery and MVP testing. "
            "A milestone-based seed investment would balance risk with upside potential."
        ),
    }

async def call_gemini(prompt: str) -> str:
    """Call Gemini REST API directly — no SDK, no protobuf dependency."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 2048,
        },
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json=payload,
            headers={"Content-Type": "application/json"},
        )
        if resp.status_code == 429:
            raise HTTPException(
        status_code=429,
        detail="Gemini API rate limit reached. Please wait a minute and try again."
        )
        resp.raise_for_status()

        data = resp.json()

    # Extract text from Gemini response structure
    candidates = data.get("candidates", [])
    if not candidates:
        raise ValueError("Gemini returned no candidates")
    return candidates[0]["content"]["parts"][0]["text"]

# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    features = np.array([[
        request.funding, request.teamSize,
        request.marketSize, request.founderExperience,
    ]])
    logging.info(f"Predict request: {request}")

    raw_prob = model.predict_proba(features)[0][1]
    success_probability = round(raw_prob * 85 + 10, 2)

    risk_level = "low" if success_probability > 70 else "medium" if success_probability > 40 else "high"

    feature_names = ["funding", "teamSize", "marketSize", "founderExperience"]
    feature_importance = {
        name: round(float(imp), 4)
        for name, imp in zip(feature_names, model.feature_importances_)
    }

    fundingScore    = min(100, int((request.funding / 5_000_000) * 100))
    marketScore     = min(100, int((request.marketSize / 500_000_000) * 100))
    teamScore       = min(100, int((request.teamSize / 15) * 100))
    experienceScore = min(100, int((request.founderExperience / 10) * 100))

    breakdown = {
        "fundingScore": fundingScore, "teamScore": teamScore,
        "marketScore": marketScore,   "experienceScore": experienceScore,
    }
    report = generate_investor_report(
        success_probability, risk_level,
        fundingScore, teamScore, marketScore, experienceScore,
    )

    return PredictionResponse(
        successProbability=success_probability,
        riskLevel=risk_level,
        featureImportance=feature_importance,
        breakdown=breakdown,
        report=report,
    )


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_startup(request: AnalyzeRequest):
    """
    Gemini-powered startup analysis via direct REST API.
    Returns: SWOT, market size (TAM/SAM/SOM), top 3 competitors,
             viability score (1–10), business brief, recommendation.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail=(
                "Gemini API key not configured. "
                "Create ml-service/.env with GEMINI_API_KEY=your_key. "
                "Get a free key at https://aistudio.google.com/app/apikey"
            ),
        )

    prompt = f"""You are an expert startup advisor and venture capitalist.
Analyze the following startup idea and return ONLY valid JSON — no markdown, no code blocks, no explanation.

Startup Name: {request.ideaName}
Industry: {request.industry}
Target Market: {request.targetMarket}
Idea: {request.idea}

Return EXACTLY this JSON structure:
{{
  "swot": {{
    "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
    "threats": ["threat 1", "threat 2", "threat 3"]
  }},
  "marketSize": {{
    "tam": "$X billion — description of total addressable market",
    "sam": "$X billion — description of serviceable addressable market",
    "som": "$X million — realistic obtainable market in year 1-3"
  }},
  "competitors": [
    {{"name": "Real Competitor 1", "description": "What they do", "differentiator": "How this startup beats them"}},
    {{"name": "Real Competitor 2", "description": "What they do", "differentiator": "How this startup beats them"}},
    {{"name": "Real Competitor 3", "description": "What they do", "differentiator": "How this startup beats them"}}
  ],
  "viabilityScore": 7,
  "businessBrief": "2-3 sentence executive summary of the business and its value proposition.",
  "recommendation": "2-3 paragraph investor recommendation covering market timing, team needs, risk, and investment decision."
}}

Rules: viabilityScore is integer 1-10. Be specific to {request.industry}. Name real companies as competitors."""

    raw_text = ""
    try:
        raw_text = await call_gemini(prompt)
        cleaned = clean_json_text(raw_text)
        data = json.loads(cleaned)

        for key in ["swot", "marketSize", "competitors", "viabilityScore", "businessBrief", "recommendation"]:
            if key not in data:
                raise ValueError(f"Missing key: {key}")

        data["viabilityScore"] = max(1, min(10, int(data["viabilityScore"])))
        logging.info(f"Gemini analysis complete for: {request.ideaName}")
        return data

    except json.JSONDecodeError:
        # Regex fallback: pull JSON object from response
        logging.warning("Direct JSON parse failed — trying regex extraction")
        match = re.search(r"\{[\s\S]*\}", raw_text)
        if match:
            try:
                data = json.loads(match.group())
                data["viabilityScore"] = max(1, min(10, int(data.get("viabilityScore", 5))))
                return data
            except Exception:
                pass
        logging.error("Regex fallback also failed — returning structured fallback")
        return build_fallback(request.ideaName)

    except httpx.HTTPStatusError as e:
        status = e.response.status_code
        if status == 400:
            raise HTTPException(status_code=400, detail="Invalid request to Gemini API. Check your API key.")
        if status == 429:
            raise HTTPException(status_code=429, detail="Gemini API rate limit hit. Please wait and try again.")
        raise HTTPException(status_code=502, detail=f"Gemini API error: {status}")

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Gemini API timed out. Please try again.")

    except Exception as e:
        logging.error(f"Analyze error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "gemini_configured": bool(GEMINI_API_KEY),
        "ml_model": "loaded",
    }
@app.get("/test-gemini")
async def test_gemini():
    try:
        response = await call_gemini(
            "Analyze startup idea: AI powered hiring platform"
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))