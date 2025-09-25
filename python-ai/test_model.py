import joblib

# Load model
model = joblib.load('student_dropout_model.pkl')

# Sample data
marks = 70
attendance = 85
fee_payment = 1

prediction = model.predict([[marks, attendance, fee_payment]])
print(f"Predicted risk: {prediction[0]}")
