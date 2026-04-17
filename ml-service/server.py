from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from typing import Dict

# Load the trained model
model = joblib.load('model.pkl')

app = FastAPI()

class PredictionRequest(BaseModel):
    funding: float
    teamSize: float
    marketSize: float
    founderExperience: float

class PredictionResponse(BaseModel):
    successProbability: float
    riskLevel: str
    featureImportance: Dict[str, float]

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
    
    # Get prediction probability
    prediction_prob = model.predict_proba(features)[0][1]
    success_probability = round(prediction_prob * 100, 2)
    
    # Determine risk level
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
    
    return PredictionResponse(
        successProbability=success_probability,
        riskLevel=risk_level,
        featureImportance=feature_importance
    )

@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
