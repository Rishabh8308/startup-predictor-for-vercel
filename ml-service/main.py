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
    
    return PredictionResponse(
        successProbability=success_probability,
        riskLevel=risk_level,
        featureImportance=feature_importance,
        breakdown=breakdown
    )

@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "healthy"}
