// AI Predictor utility functions

export interface PredictionRequest {
  marks: number;
  attendance: number;
  fee_payment: number;
}

export interface PredictionResponse {
  risk: string;
  confidence?: number | null;
  fallback?: boolean;
}

// Function to call the AI predictor API
export async function predictRisk(data: PredictionRequest): Promise<PredictionResponse> {
  try {
    const response = await fetch('/api/predict-risk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling AI predictor:', error);
    
    // Fallback prediction logic
    let risk = 'Low';
    if (data.marks < 50 || data.attendance < 60 || data.fee_payment === 0) {
      risk = 'High';
    } else if (data.marks < 70 || data.attendance < 80) {
      risk = 'Medium';
    }
    
    return {
      risk,
      confidence: null,
      fallback: true
    };
  }
}

// Function to convert fee status string to number for AI model
export function feeStatusToNumber(feeStatus: string): number {
  return feeStatus.toLowerCase().includes('paid') ? 1 : 0;
}

// Function to get risk level color for UI
export function getRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
