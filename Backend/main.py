from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional  
import requests
import json
import time
from supabase import create_client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = "https://spiotoavhyppaixfyinh.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaW90b2F2aHlwcGFpeGZ5aW5oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM5MjEwMCwiZXhwIjoyMDkwOTY4MTAwfQ.xAuswAOxsdm_myOiN803SoyBQGsLfi6du0tMZfGrrxs"  # ⚠️ use service role key, NOT anon key

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# ───────────────────────────────────────────
# OLLAMA HELPERS
# ───────────────────────────────────────────

def ask_ollama(prompt: str) -> str:
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt, "stream": False}
    )
    return response.json()["response"]


def extract_keyword(text: str) -> str:
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": f"Give 1 simple visual keyword (like fever, headache, hospital) from this: {text}",
            "stream": False
        }
    )
    return response.json()["response"].strip()


def get_images(query: str) -> list:
    base = int(time.time())
    return [f"https://picsum.photos/600/600?random={base+i}" for i in range(5)]


# ───────────────────────────────────────────
# SUPABASE HELPERS
# ───────────────────────────────────────────

def get_user_from_token(token: str) -> dict:
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user.user


def get_patient_context(user_id: str) -> str:
    """Fetch all trackers + last 7 readings and format as context string."""
    trackers = supabase.table("trackers").select("*").eq("user_id", user_id).execute().data

    if not trackers:
        return "This patient has no health trackers set up yet."

    context_lines = ["Patient's health history:"]
    for tracker in trackers:
        readings = (
            supabase.table("readings")
            .select("value, recorded_at")
            .eq("tracker_id", tracker["id"])
            .order("recorded_at", desc=True)
            .limit(7)
            .execute()
            .data
        )
        if readings:
            values = [str(r["value"]) for r in readings]
            context_lines.append(
                f"- {tracker['name']} ({tracker['unit']}): last readings = {', '.join(values)}"
            )
        else:
            context_lines.append(f"- {tracker['name']} ({tracker['unit']}): no readings yet")

    return "\n".join(context_lines)


def detect_tracker_intent(text: str) -> Optional[dict]:
    """Ask Ollama if the user wants to create a new tracker. Returns tracker info or None."""
    prompt = f"""
Does this message indicate the user wants to START TRACKING a health metric?
Message: "{text}"

If YES, reply with ONLY a JSON object like this (no explanation):
{{"name": "Sugar Level", "unit": "mg/dL"}}

If NO, reply with ONLY the word: NO
"""
    result = ask_ollama(prompt).strip()
    if result.upper().startswith("NO"):
        return None
    try:
        # strip markdown fences if model adds them
        clean = result.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except Exception:
        return None


def detect_reading_intent(text: str, trackers: list) -> Optional[dict]:
    """Ask Ollama if the user is logging a reading for an existing tracker."""
    if not trackers:
        return None

    tracker_list = "\n".join(
        [f"- id: {t['id']}, name: {t['name']}, unit: {t['unit']}" for t in trackers]
    )

    prompt = f"""
The user said: "{text}"

They have these health trackers:
{tracker_list}

Is the user logging a new reading for one of these trackers?
If YES, reply with ONLY a JSON object like:
{{"tracker_id": "<id>", "value": <number>}}

If NO, reply with ONLY the word: NO
"""
    result = ask_ollama(prompt).strip()
    if result.upper().startswith("NO"):
        return None
    try:
        clean = result.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except Exception:
        return None


# ───────────────────────────────────────────
# MAIN ENDPOINT
# ───────────────────────────────────────────

@app.post("/process")
def process(data: dict, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user = get_user_from_token(token)
    user_id = user.id

    user_text = data.get("text", "")

    # 1. Fetch patient context
    patient_context = get_patient_context(user_id)

    # 2. Fetch trackers for intent detection
    trackers = supabase.table("trackers").select("*").eq("user_id", user_id).execute().data

    # 3. Detect if user wants to CREATE a new tracker
    tracker_created = None
    tracker_intent = detect_tracker_intent(user_text)
    if tracker_intent:
        existing_names = [t["name"].lower() for t in trackers]
        if tracker_intent["name"].lower() not in existing_names:
            supabase.table("trackers").insert({
                "user_id": user_id,
                "name": tracker_intent["name"],
                "unit": tracker_intent["unit"],
            }).execute()
            tracker_created = tracker_intent["name"]

    # 4. Detect if user is LOGGING a reading
    reading_logged = None
    reading_intent = detect_reading_intent(user_text, trackers)
    if reading_intent:
        tracker_id = reading_intent.get("tracker_id")
        value = reading_intent.get("value")
        if tracker_id and value is not None:
            reading_logged = {"tracker_id": tracker_id, "value": value}

    # 5. Build AI prompt with full patient context
    prompt = f"""
You are a warm, caring health companion AI named Care — like a knowledgeable friend who genuinely remembers the patient.

{patient_context}

{"You just created a new tracker for: " + tracker_created if tracker_created else ""}
{"The patient just logged a reading of: " + str(reading_logged['value']) if reading_logged else ""}

Rules:
- Be warm, conversational, and personal — NOT clinical
- Reference their actual history if relevant (e.g. "your sugar has been creeping up this week")
- If they logged a reading, react to it with genuine feedback based on the trend
- If you created a tracker, confirm it warmly and tell them you'll ask them daily
- Keep response under 4 sentences
- No bullet points, no medical jargon

Patient said: {user_text}
"""

    reply = ask_ollama(prompt)

    # 6. Save the reading with AI feedback AFTER generating reply
    if reading_logged:
        supabase.table("readings").insert({
            "tracker_id": reading_logged["tracker_id"],
            "user_id": user_id,
            "value": reading_logged["value"],
            "ai_feedback": reply,
        }).execute()

    # 7. Keyword + images
    keyword = extract_keyword(reply)
    images = get_images(keyword)

    return {
        "reply": reply,
        "keyword": keyword,
        "images": images,
        "tracker_created": tracker_created,
        "reading_logged": reading_logged is not None,
    }