from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load trained model
model = joblib.load('student_dropout_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    marks = data['marks']
    attendance = data['attendance']
    fee_payment = data['fee_payment']

    prediction = model.predict([[marks, attendance, fee_payment]])
    return jsonify({'risk': prediction[0]})

if __name__ == "__main__":
    # Use Flask’s built-in server
    app.run(debug=True)
