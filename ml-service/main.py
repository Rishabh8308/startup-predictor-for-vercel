from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import Dict

# Load the trained model
model = joblib.load('model.pkl')

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    funding: float
    teamSize: float
    marketSize: float
    founderExperience: float

class PredictionResponse(BaseModel):
    successProbability: float
    riskLevel: str
    featureImportance: Dict[str, float]
    breakdown: Dict[str, int]
    report: Dict[str, any]

def generate_investor_report(
    success_probability: float,
    risk_level: str,
    funding_score: int,
    team_score: int,
    market_score: int,
    experience_score: int
) -> Dict[str, any]:
    """
    Generate an investor report with strengths, risks, and recommendation
    based on startup metrics.
    
    Args:
        success_probability: Overall success probability (10-95%)
        risk_level: Risk level classification (low, medium, high)
        funding_score: Normalized funding score (0-100)
        team_score: Normalized team size score (0-100)
        market_score: Normalized market size score (0-100)
        experience_score: Normalized founder experience score (0-100)
    
    Returns:
        Dictionary with 'strengths', 'risks', and 'recommendation' keys
    """
    strengths = []
    risks = []
    
    # Identify strengths (scores above 70)
    if funding_score > 70:
        strengths.append("Strong funding position")
    if team_score > 70:
        strengths.append("Well-sized, capable team")
    if market_score > 70:
        strengths.append("Large addressable market opportunity")
    if experience_score > 70:
        strengths.append("Experienced founder team")
    
    # Identify risks (scores below 40)
    if funding_score < 40:
        risks.append("Limited funding relative to market opportunity")
    if team_score < 40:
        risks.append("Team is too small or underdeveloped")
    if market_score < 40:
        risks.append("Small market opportunity limits growth potential")
    if experience_score < 40:
        risks.append("Founder lacks sufficient industry experience")
    
    # Generate recommendation based on success probability
    if success_probability > 75:
        recommendation = "Strong investment opportunity. This startup demonstrates strong fundamentals across most metrics with excellent success probability. Recommended for portfolio inclusion."
    elif success_probability > 60:
        recommendation = "Moderately promising opportunity. While the startup shows solid metrics, there are some areas that could be strengthened. Consider as a potential investment with monitoring."
    elif success_probability > 45:
        recommendation = "Mixed signals. The startup has potential but faces notable challenges in key areas. Due diligence recommended before investment decision."
    else:
        recommendation = "High risk profile. The startup shows significant weaknesses in critical areas. Proceed with caution or pass on this opportunity."
    
    # If no specific strengths or risks, provide general feedback
    if not strengths:
        strengths.append("Adequate performance across all metrics")
    if not risks:
        risks.append("No critical vulnerabilities identified")
    
    return {
        "strengths": strengths,
        "risks": risks,
        "recommendation": recommendation
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    """
    Predict startup success based on input features.
    """
    # Create feature array
    features = np.array([[
        request.funding,
        request.teamSize,
        request.marketSize,
        request.founderExperience
    ]])
    
    # Get prediction probability from model
    raw_prediction_prob = model.predict_proba(features)[0][1]
    raw_percentage = raw_prediction_prob * 100
    
    # Scale probability between 10% and 95% for better UX
    # Formula: scaled = raw_percentage * (95 - 10) / 100 + 10
    success_probability = round(raw_percentage * 0.85 + 10, 2)
    
    # Determine risk level based on scaled probability
    if success_probability > 70:
        risk_level = "low"
    elif success_probability > 40:
        risk_level = "medium"
    else:
        risk_level = "high"
    
    # Get feature importance
    feature_names = ["funding", "teamSize", "marketSize", "founderExperience"]
    feature_importance = {
        name: round(float(importance), 4) 
        for name, importance in zip(feature_names, model.feature_importances_)
    }
    
    # Calculate normalized scores (0-100 scale) for breakdown
    fundingScore = min(100, int((request.funding / 5000000) * 100))
    marketScore = min(100, int((request.marketSize / 500000000) * 100))
    teamScore = min(100, int((request.teamSize / 15) * 100))
    experienceScore = min(100, int((request.founderExperience / 10) * 100))
    
    breakdown = {
        "fundingScore": fundingScore,
        "teamScore": teamScore,
        "marketScore": marketScore,
        "experienceScore": experienceScore,
    }
    
    # Generate investor report
    report = generate_investor_report(
        success_probability=success_probability,
        risk_level=risk_level,
        funding_score=fundingScore,
        team_score=teamScore,
        market_score=marketScore,
        experience_score=experienceScore
    )
    
    return PredictionResponse(
        successProbability=success_probability,
        riskLevel=risk_level,
        featureImportance=feature_importance,
        breakdown=breakdown,
        report=report
    )

@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "healthy"}
