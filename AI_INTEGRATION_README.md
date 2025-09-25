# AI Integration Setup Guide

This EduPulse application now integrates with your Python AI classifier for student dropout risk prediction.

## Setup Instructions

### 1. Install Python Dependencies
Run the setup script to install required packages:
```bash
# Double-click setup-python-ai.bat
# OR run manually:
cd python-ai
pip install -r requirements.txt
```

### 2. Start the Python Flask API
Run the batch file to start the Python API:
```bash
# Double-click the start-python-api.bat file
# OR run manually:
cd python-ai
python app.py
```

The Python API will start on `http://localhost:5000`

### 3. Start the Next.js Application
In a separate terminal, start the EduPulse application:
```bash
cd "C:\Users\Juan\Downloads\edupulse\edupulse"
npm run dev
```

The Next.js app will start on `http://localhost:3000`

## How It Works

1. **AI Prediction**: The application calls your Python Flask API at `/predict` endpoint
2. **Input Data**: Sends student data (marks, attendance, fee_payment) to the AI model
3. **Risk Classification**: Your Random Forest model predicts risk levels (Low/Medium/High)
4. **Fallback Logic**: If the Python API is unavailable, the app uses fallback prediction logic
5. **Visual Indicators**: AI-predicted risks are marked with a 🤖 emoji

## API Endpoints

### Python Flask API (Port 5000)
- `POST /predict` - Predicts student risk level
  - Input: `{ "marks": number, "attendance": number, "fee_payment": number }`
  - Output: `{ "risk": "Low|Medium|High" }`

### Next.js API (Port 3000)
- `POST /api/predict-risk` - Proxy to Python API with fallback logic

## Project Structure

```
edupulse/
├── app/                    # Next.js application
├── lib/                    # Utility functions and mock data
├── python-ai/              # Python AI classifier
│   ├── app.py             # Flask API server
│   ├── train_model.py     # Model training script
│   ├── test_model.py      # Model testing script
│   ├── student_dropout_model.pkl  # Trained model
│   └── requirements.txt   # Python dependencies
├── start-python-api.bat   # Start Python API
├── setup-python-ai.bat    # Setup Python dependencies
└── AI_INTEGRATION_README.md
```

## Features

- ✅ Real-time AI predictions for student risk levels
- ✅ Fallback logic when AI is unavailable
- ✅ Visual indicators for AI-predicted risks
- ✅ Loading states and error handling
- ✅ Maintains all existing sample data and UI
- ✅ Everything in one project folder

## Testing the Integration

Run the test script to verify everything is working:
```bash
# Double-click test-ai.bat
# OR run manually:
python test-ai-integration.py
```

This will test:
- ✅ Python Flask API (port 5000)
- ✅ Next.js API proxy (port 3000)
- ✅ AI predictions with sample data

## Troubleshooting

1. **Python API not starting**: Check if port 5000 is available
2. **Predictions not working**: Verify the model file `student_dropout_model.pkl` exists
3. **Connection errors**: Ensure both servers are running on correct ports
4. **Fallback mode**: If you see fallback predictions, the Python API might not be running
5. **Module not found errors**: Run `pip install flask scikit-learn pandas joblib` in the python-ai folder

## Model Information

Your AI model uses:
- **Features**: Marks (0-100), Attendance (0-100), Fee Payment (0/1)
- **Algorithm**: Random Forest Classifier
- **Output**: Risk levels (Low, Medium, High)
- **Training Data**: Based on your sample dataset
