#!/usr/bin/env python3
"""
Test script to verify AI integration is working
"""
import requests
import json

def test_ai_prediction():
    """Test the AI prediction API"""
    try:
        # Test data
        test_data = {
            "marks": 75,
            "attendance": 85,
            "fee_payment": 1
        }
        
        print("🧪 Testing AI Prediction API...")
        print(f"📊 Test data: {test_data}")
        
        # Call the Python Flask API directly
        response = requests.post('http://localhost:5000/predict', json=test_data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ AI Prediction: {result['risk']}")
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Python API. Make sure it's running on port 5000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_nextjs_api():
    """Test the Next.js API proxy"""
    try:
        test_data = {
            "marks": 60,
            "attendance": 70,
            "fee_payment": 0
        }
        
        print("\n🧪 Testing Next.js API Proxy...")
        print(f"📊 Test data: {test_data}")
        
        # Call the Next.js API
        response = requests.post('http://localhost:3000/api/predict-risk', json=test_data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Next.js API Response: {result}")
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Next.js API. Make sure it's running on port 3000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing EduPulse AI Integration")
    print("=" * 40)
    
    # Test Python API
    python_ok = test_ai_prediction()
    
    # Test Next.js API
    nextjs_ok = test_nextjs_api()
    
    print("\n" + "=" * 40)
    if python_ok and nextjs_ok:
        print("🎉 All tests passed! AI integration is working!")
    else:
        print("⚠️  Some tests failed. Check the error messages above.")
    
    print("\n📝 Next steps:")
    print("1. Visit http://localhost:3000/students to see AI predictions")
    print("2. Look for 🤖 emojis next to risk levels")
    print("3. Check the browser console for any errors")
