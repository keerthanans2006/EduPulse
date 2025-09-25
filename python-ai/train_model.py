import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Sample training data (replace with your CSV later)
data = {
    'marks': [80, 60, 40, 30, 90, 55],
    'attendance': [90, 75, 60, 40, 95, 70],
    'fee_payment': [1, 1, 0, 0, 1, 1],  # 1 = paid, 0 = not paid
    'risk': ['Low', 'Medium', 'High', 'High', 'Low', 'Medium']
}

df = pd.DataFrame(data)

# Features and target
X = df[['marks', 'attendance', 'fee_payment']]
y = df['risk']

# Train model
model = RandomForestClassifier()
model.fit(X, y)

# Save the model
joblib.dump(model, 'student_dropout_model.pkl')

print("✅ Model trained and saved as student_dropout_model.pkl")
