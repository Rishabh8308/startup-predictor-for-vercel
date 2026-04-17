import numpy as np
import pandas as pd

# Set random seed for reproducibility
np.random.seed(42)

# Generate 5000 startup records
n_samples = 5000

# Generate features with specified ranges
funding = np.random.uniform(100_000, 20_000_000, n_samples)  # 100k to 20M
team_size = np.random.randint(1, 51, n_samples)  # 1 to 50
market_size = np.random.uniform(1_000_000, 1_000_000_000, n_samples)  # 1M to 1B
founder_experience = np.random.uniform(0, 20, n_samples)  # 0 to 20 years

# New features
burn_rate = np.random.uniform(20_000, 500_000, n_samples)  # 20k to 500k monthly
runway_months = np.random.uniform(6, 36, n_samples)  # 6 to 36 months
competition_level = np.random.uniform(1, 10, n_samples)  # 1-10 scale
product_stage = np.random.uniform(1, 5, n_samples)  # 1-5 scale (5 = mature)
industry_growth = np.random.uniform(1, 10, n_samples)  # 1-10 scale
investor_tier = np.random.uniform(1, 5, n_samples)  # 1-5 scale (5 = top VC)

# Calculate success probability based on all features
# Normalize each feature to 0-1 scale for probability calculation

# Existing features
funding_norm = np.minimum(funding / 5_000_000, 1.0)
market_norm = np.minimum(market_size / 500_000_000, 1.0)
experience_norm = np.minimum(founder_experience / 10, 1.0)

# Team size performs best at ~10, penalty for too small or too large
team_norm = 1.0 - (np.abs(team_size - 10) / 40) ** 0.8
team_norm = np.maximum(team_norm, 0.1)  # Ensure minimum score

# New features normalized
runway_norm = np.minimum(runway_months / 36, 1.0)  # Higher runway is better
burn_rate_norm = 1.0 - np.minimum(burn_rate / 500_000, 1.0)  # Lower burn is better
competition_norm = 1.0 - (competition_level / 10)  # Lower competition is better
product_stage_norm = product_stage / 5  # Higher product stage is better
industry_growth_norm = industry_growth / 10  # Higher growth is better
investor_tier_norm = investor_tier / 5  # Higher investor tier is better

# Calculate success probability (0 to 1) with weighted features
# Weights chosen to reflect business impact
success_probability = (
    funding_norm * 0.20 +           # Higher funding increases success
    market_norm * 0.15 +            # Larger market increases success
    experience_norm * 0.12 +        # More experience increases success
    runway_norm * 0.15 +            # Longer runway increases success
    burn_rate_norm * 0.10 +         # Lower burn rate increases success
    product_stage_norm * 0.12 +     # More mature product increases success
    industry_growth_norm * 0.10 +   # Higher industry growth increases success
    investor_tier_norm * 0.08 +     # Better investor tier increases success
    competition_norm * 0.08         # Lower competition increases success
)

# Add some randomness
success_probability += np.random.normal(0, 0.05, n_samples)
success_probability = np.clip(success_probability, 0, 1)

# Generate success labels (1 if probability > 0.5, else 0)
success = (success_probability > 0.5).astype(int)

# Create DataFrame
df = pd.DataFrame({
    'funding': funding,
    'teamSize': team_size,
    'marketSize': market_size,
    'founderExperience': founder_experience,
    'burnRate': burn_rate,
    'runwayMonths': runway_months,
    'competitionLevel': competition_level,
    'productStage': product_stage,
    'industryGrowth': industry_growth,
    'investorTier': investor_tier,
    'success': success
})

# Save to CSV
df.to_csv('startup_dataset.csv', index=False)

print(f"Dataset generated successfully!")
print(f"Total samples: {len(df)}")
print(f"\nDataset statistics:")
print(df.describe())
print(f"\nSuccess distribution:")
print(df['success'].value_counts())
print(f"Success rate: {df['success'].mean():.2%}")
