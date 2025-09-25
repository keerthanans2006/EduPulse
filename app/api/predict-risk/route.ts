import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { marks, attendance, fee_payment } = body;

    // Validate input
    if (marks === undefined || attendance === undefined || fee_payment === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: marks, attendance, fee_payment' },
        { status: 400 }
      );
    }

    // Call your Python Flask API
    const pythonApiUrl = 'http://localhost:5000/predict'; // Adjust if your Flask app runs on different port
    
    const response = await fetch(pythonApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        marks: Number(marks),
        attendance: Number(attendance),
        fee_payment: Number(fee_payment)
      })
    });

    if (!response.ok) {
      throw new Error(`Python API responded with status: ${response.status}`);
    }

    const prediction = await response.json();
    
    return NextResponse.json({
      risk: prediction.risk,
      confidence: prediction.confidence || null // Add if your model provides confidence scores
    });

  } catch (error) {
    console.error('Error calling Python predictor:', error);
    
    // Fallback to mock prediction if Python API is not available
    const { marks, attendance, fee_payment } = await request.json();
    
    // Simple fallback logic based on your training data patterns
    let risk = 'Low';
    if (marks < 50 || attendance < 60 || fee_payment === 0) {
      risk = 'High';
    } else if (marks < 70 || attendance < 80) {
      risk = 'Medium';
    }
    
    return NextResponse.json({
      risk,
      confidence: null,
      fallback: true // Indicate this is a fallback prediction
    });
  }
}
