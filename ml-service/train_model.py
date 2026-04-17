import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Load the dataset
print("Loading dataset...")
df = pd.read_csv('startup_dataset.csv')

print(f"Dataset shape: {df.shape}")
print(f"Features: {df.columns.tolist()}")
print("\nDataset Statistics:")
print(df[[
    "funding",
    "teamSize",
    "marketSize",
    "founderExperience"
]].describe())

print("\nFirst 5 Rows:")
print(df.head())

# Split data into features and target
X = df[[
    "funding",
    "teamSize",
    "marketSize",
    "founderExperience"
]]
y = df['success']

print(f"\nFeature shape: {X.shape}")
print(f"Target shape: {y.shape}")

# Split into training and testing sets (80-20 split)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\nTraining set size: {X_train.shape[0]}")
print(f"Testing set size: {X_test.shape[0]}")

# Train RandomForestClassifier
print("\nTraining RandomForestClassifier...")
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1,
    max_depth=15
)

model.fit(X_train, y_train)

# Evaluate accuracy
print("Evaluating model...")
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\nModel Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

# Feature importance
print("\nFeature Importance:")
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

for _, row in feature_importance.iterrows():
    print(f"  {row['feature']}: {row['importance']:.4f}")

# Save the trained model
print("\nSaving model...")
joblib.dump(model, 'model.pkl')
print("Model saved as model.pkl")
