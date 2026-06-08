from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
import datetime
from .config import get_db, get_gemini_model
from firebase_admin import auth

router = APIRouter()

# --- Pydantic Data Schemas ---
class TokenVerification(BaseModel):
    id_token: str

class CalculatorData(BaseModel):
    carType: str
    carMiles: float
    transitMiles: float
    shortFlights: int
    longFlights: int
    electricityKwh: float
    heatingType: str
    heatingUsage: float
    dietType: str
    localFoodPct: float
    clothingSpend: float
    electronicsCount: int
    servicesSpend: float

class ChatMessage(BaseModel):
    message: str

class ChallengeCompletion(BaseModel):
    challenge_id: str
    points_reward: int

# --- Helper to Verify Firebase Tokens ---
async def verify_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication token invalid: {str(e)}")

# --- Endpoints ---

@router.post("/auth/verify")
async def verify_auth_token(payload: TokenVerification):
    try:
        decoded_token = auth.verify_id_token(payload.id_token)
        return {"status": "success", "uid": decoded_token["uid"], "email": decoded_token.get("email")}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Token validation failed: {str(e)}")

@router.post("/emissions/calculate")
async def calculate_emissions(payload: CalculatorData, user: dict = Depends(verify_user)):
    db = get_db()
    uid = user["uid"]
    
    # Calculate Transportation (Tonnes/yr)
    car_factor = 0.404
    if payload.carType == 'diesel': car_factor = 0.35
    elif payload.carType == 'hybrid': car_factor = 0.22
    elif payload.carType == 'electric': car_factor = 0.10
    
    t_car = (payload.carMiles * car_factor) / 2204.62
    t_transit = (payload.transitMiles * 0.14) / 2204.62
    t_short = payload.shortFlights * 0.25
    t_long = payload.longFlights * 0.90
    transport_total = t_car + t_transit + t_short + t_long

    # Calculate Energy (Utilities)
    t_elec = (payload.electricityKwh * 12 * 0.38) / 1000
    heat_factor = 5.3
    if payload.heatingType == 'electric': heat_factor = 0.0
    elif payload.heatingType == 'oil': heat_factor = 10.1
    t_heat = (payload.heatingUsage * 12 * heat_factor) / 1000
    energy_total = t_elec + t_heat

    # Calculate Diet
    base_diet = 2.5
    if payload.dietType == 'heavy-meat': base_diet = 3.3
    elif payload.dietType == 'low-meat': base_diet = 1.9
    elif payload.dietType == 'vegetarian': base_diet = 1.5
    elif payload.dietType == 'vegan': base_diet = 1.1
    discount = (payload.localFoodPct / 100) * 0.1 * base_diet
    diet_total = base_diet - discount

    # Calculate Shopping
    t_cloth = (payload.clothingSpend * 12 * 0.5) / 1000
    t_elec_goods = (payload.electronicsCount * 120) / 1000
    t_services = (payload.servicesSpend * 12 * 0.25) / 1000
    shopping_total = t_cloth + t_elec_goods + t_services

    total_footprint = transport_total + energy_total + diet_total + shopping_total
    total_footprint_rounded = round(total_footprint, 2)

    # Save to database (Firestore) if active
    if db:
        try:
            # Update user profile doc
            user_ref = db.collection("users").document(uid)
            user_ref.update({
                "footprint": total_footprint_rounded
            })
            
            # Log in historical entries subcollection
            user_ref.collection("emissions_history").add({
                "timestamp": datetime.datetime.utcnow(),
                "total": total_footprint_rounded,
                "breakdown": {
                    "transport": round(transport_total, 2),
                    "energy": round(energy_total, 2),
                    "diet": round(diet_total, 2),
                    "shopping": round(shopping_total, 2)
                }
            })
        except Exception as e:
            # Document not initialized or update error
            print(f"Firestore update error: {e}")

    return {
        "total": total_footprint_rounded,
        "breakdown": {
            "transport": round(transport_total, 2),
            "energy": round(energy_total, 2),
            "diet": round(diet_total, 2),
            "shopping": round(shopping_total, 2)
        }
    }

@router.post("/coach/chat")
async def chat_with_coach(payload: ChatMessage, user: dict = Depends(verify_user)):
    model = get_gemini_model()
    db = get_db()
    
    # Get user current footprint to contextualize AI response
    footprint = 4.2
    if db:
        try:
            user_doc = db.collection("users").document(user["uid"]).get()
            if user_doc.exists:
                footprint = user_doc.to_dict().get("footprint", 4.2)
        except Exception:
            pass

    if model:
        try:
            prompt = f"You are EcoWise AI, a helpful sustainability coach. The user has a carbon footprint of {footprint} tonnes CO2e/year. Answer this query concisely: {payload.message}"
            response = model.generate_content(prompt)
            return {"reply": response.text}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gemini API failure: {str(e)}")
    
    # Fallback response
    return {"reply": f"Hi there! The backend is running in Mock Mode. You asked: '{payload.message}'. Normally, I'd fetch live Gemini results, but for now: try switching to plant-based diets or cycling to reduce your {footprint} t CO2 footprint!"}

@router.post("/challenges/complete")
async def complete_challenge(payload: ChallengeCompletion, user: dict = Depends(verify_user)):
    db = get_db()
    uid = user["uid"]
    
    if db:
        try:
            user_ref = db.collection("users").document(uid)
            doc_snap = user_ref.get()
            if doc_snap.exists:
                profile = doc_snap.to_dict()
                current_points = profile.get("points", 0)
                completed = profile.get("completedChallenges", [])
                
                if payload.challenge_id not in completed:
                    completed.append(payload.challenge_id)
                    user_ref.update({
                        "points": current_points + payload.points_reward,
                        "completedChallenges": completed
                    })
                    return {"status": "success", "points": current_points + payload.points_reward}
                return {"status": "already_completed", "points": current_points}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database update failed: {str(e)}")
            
    return {"status": "sandbox_success", "points": 280 + payload.points_reward}

@router.get("/leaderboard")
async def get_leaderboard(user: dict = Depends(verify_user)):
    db = get_db()
    
    if db:
        try:
            users_ref = db.collection("users")
            query = users_ref.order_by("points", direction="DESCENDING").limit(10)
            results = []
            for idx, doc in enumerate(query.stream()):
                data = doc.to_dict()
                results.append({
                    "rank": idx + 1,
                    "name": data.get("displayName", "Eco Warrior"),
                    "points": data.get("points", 0),
                    "location": data.get("location", "Global")
                })
            return results
        except Exception as e:
            print(f"Leaderboard fetch error: {e}")
            
    # Mock fallback
    return [
        {"rank": 1, "name": "Greta T.", "points": 850, "location": "Sweden"},
        {"rank": 2, "name": "David A.", "points": 720, "location": "UK"},
        {"rank": 3, "name": "Leon S.", "points": 640, "location": "Germany"},
        {"rank": 4, "name": "Sophia K.", "points": 590, "location": "US"},
        {"rank": 5, "name": "Yuki T.", "points": 510, "location": "Japan"}
    ]
