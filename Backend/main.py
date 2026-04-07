from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from sarvamai import SarvamAI
from fastapi.responses import StreamingResponse


app = FastAPI()

# ✅ CORS FIX (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev (later restrict)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔑 API Key (move to .env later)
API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"

API_URL = "https://api.sarvam.ai/text-to-speech/stream"

# Sarvam client
client = SarvamAI(api_subscription_key=API_KEY)


# 🧠 1. Ollama (short response enforced)
def generate_with_ollama(prompt: str) -> str:
    try:
        constrained_prompt = f"""
        Answer in ONLY 1 short sentence.
        You are a helpful doctor.
        Be concise and clear.

        {prompt}
        """

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": constrained_prompt,
                "stream": False
            },
            timeout=10
        )

        response.raise_for_status()
        return response.json().get("response", "Sorry, I couldn't respond.").strip()

    except Exception as e:
        print("Ollama Error:", e)
        return "Sorry, I am unable to respond right now."


# 🌍 2. Translation
def translate_text(text: str) -> str:
    try:
        response = client.text.translate(
            input=text,
            source_language_code="en-IN",
            target_language_code="hi-IN",
            speaker_gender="Male",
            mode="formal",
            model="mayura:v1",
            numerals_format="native"
        )
        return response.translated_text

    except Exception as e:
        print("Translate Error:", e)
        return text  # fallback


# 🔊 3. TTS streaming
def generate_tts_stream(text: str):
    try:
        headers = {
            "api-subscription-key": API_KEY,
            "Content-Type": "application/json"
        }

        payload = {
            "text": text,
            "target_language_code": "hi-IN",
            "speaker": "shubh",
            "model": "bulbul:v3",
            "pace": 1.1,
            "speech_sample_rate": 22050,
            "output_audio_codec": "mp3",
            "enable_preprocessing": True
        }

        response = requests.post(
            API_URL,
            headers=headers,
            json=payload,
            stream=True
        )

        response.raise_for_status()

        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                yield chunk

    except Exception as e:
        print("TTS Error:", e)
        yield b""


# 🚀 4. Endpoint
# @app.get("/tts")
# def tts(text: str = Query(...)):
#     print("Input:", text)

#     # 🧠 Step 1: LLM
#     ai_response = generate_with_ollama(text)
#     print("Ollama:", ai_response)

#     # 🌍 Step 2: Translate
#     translated = translate_text(ai_response)
#     print("Translated:", translated)

#     # 🔊 Step 3: Stream TTS
#     return StreamingResponse(
#         generate_tts_stream(translated),
#         media_type="audio/mpeg"
#     )


@app.get("/tts")
def tts(text: str = Query(...)):
    print("Input:", text)

    ai_response = generate_with_ollama(text)
    translated = translate_text(ai_response)

    response = StreamingResponse(
        generate_tts_stream(translated),
        media_type="audio/mpeg"
    )

    # ✅ FORCE CORS HEADERS (THIS FIXES YOUR ISSUE)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"

    return response