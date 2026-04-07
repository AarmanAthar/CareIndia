# from fastapi import FastAPI, Query
# from fastapi.responses import StreamingResponse
# from fastapi.middleware.cors import CORSMiddleware
# import requests
# from sarvamai import SarvamAI
# from fastapi.responses import StreamingResponse


# app = FastAPI()

# # ✅ CORS FIX (VERY IMPORTANT)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # for dev (later restrict)
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # 🔑 API Key (move to .env later)
# API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"

# API_URL = "https://api.sarvam.ai/text-to-speech/stream"

# # Sarvam client
# client = SarvamAI(api_subscription_key=API_KEY)


# # 🧠 1. Ollama (short response enforced)
# def generate_with_ollama(prompt: str) -> str:
#     try:
#         constrained_prompt = f"""
#         Answer in ONLY 1 short sentence.
#         You are a helpful doctor.
#         Be concise and clear.

#         {prompt}
#         """

#         response = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": constrained_prompt,
#                 "stream": False
#             },
#             timeout=10
#         )

#         response.raise_for_status()
#         return response.json().get("response", "Sorry, I couldn't respond.").strip()

#     except Exception as e:
#         print("Ollama Error:", e)
#         return "Sorry, I am unable to respond right now."


# # 🌍 2. Translation
# def translate_text(text: str) -> str:
#     try:
#         response = client.text.translate(
#             input=text,
#             source_language_code="en-IN",
#             target_language_code="hi-IN",
#             speaker_gender="Male",
#             mode="formal",
#             model="mayura:v1",
#             numerals_format="native"
#         )
#         return response.translated_text

#     except Exception as e:
#         print("Translate Error:", e)
#         return text  # fallback


# # 🔊 3. TTS streaming
# def generate_tts_stream(text: str):
#     try:
#         headers = {
#             "api-subscription-key": API_KEY,
#             "Content-Type": "application/json"
#         }

#         payload = {
#             "text": text,
#             "target_language_code": "hi-IN",
#             "speaker": "shubh",
#             "model": "bulbul:v3",
#             "pace": 1.1,
#             "speech_sample_rate": 22050,
#             "output_audio_codec": "mp3",
#             "enable_preprocessing": True
#         }

#         response = requests.post(
#             API_URL,
#             headers=headers,
#             json=payload,
#             stream=True
#         )

#         response.raise_for_status()

#         for chunk in response.iter_content(chunk_size=8192):
#             if chunk:
#                 yield chunk

#     except Exception as e:
#         print("TTS Error:", e)
#         yield b""


# # 🚀 4. Endpoint
# # @app.get("/tts")
# # def tts(text: str = Query(...)):
# #     print("Input:", text)

# #     # 🧠 Step 1: LLM
# #     ai_response = generate_with_ollama(text)
# #     print("Ollama:", ai_response)

# #     # 🌍 Step 2: Translate
# #     translated = translate_text(ai_response)
# #     print("Translated:", translated)

# #     # 🔊 Step 3: Stream TTS
# #     return StreamingResponse(
# #         generate_tts_stream(translated),
# #         media_type="audio/mpeg"
# #     )

# # /stt — receives audio/webm, returns {"text": "..."}
# @app.post("/stt")
# async def stt(file: UploadFile = File(...), language: str = "hi-IN"):
#     with open("input.webm", "wb") as f:
#         shutil.copyfileobj(file.file, f)
#     result = whisper_model.transcribe("input.webm")
#     return {"text": result["text"]}

# # /tts — already works, just add lang param if needed
# @app.get("/tts")
# async def tts(text: str, lang: str = "hi-IN"):
#     ...

# NEW 2
# import io
# import shutil
# import tempfile
# import requests
# import whisper
# from fastapi import FastAPI, File, UploadFile, Query
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse
# from pydantic import BaseModel
# from sarvamai import SarvamAI

# # ─────────────────────────────────────────────
# # Config
# # ─────────────────────────────────────────────
# API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"  # move to .env later
# TTS_URL = "https://api.sarvam.ai/text-to-speech/stream"

# # Sarvam language code → speaker mapping (Sarvam bulbul:v3 speakers)
# LANG_SPEAKERS = {
#     "hi-IN": ("shubh",   "hi-IN"),
#     "en-IN": ("angrezi", "en-IN"),
#     "bn-IN": ("amartya", "bn-IN"),
#     "te-IN": ("arvind",  "te-IN"),
#     "ta-IN": ("aditya",  "ta-IN"),
#     "kn-IN": ("ananya",  "kn-IN"),
#     "ml-IN": ("abhilash","ml-IN"),
#     "mr-IN": ("amol",    "mr-IN"),
#     "gu-IN": ("ankit",   "gu-IN"),
#     "pa-IN": ("amrinder","pa-IN"),
#     "od-IN": ("aishwarya","od-IN"),
# }

# # ─────────────────────────────────────────────
# # App & middleware
# # ─────────────────────────────────────────────
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],     # restrict in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ─────────────────────────────────────────────
# # Load models once at startup
# # ─────────────────────────────────────────────
# print("Loading Whisper model...")
# whisper_model = whisper.load_model("base")   # swap to "small" for better accuracy
# print("Whisper ready.")

# sarvam = SarvamAI(api_subscription_key=API_KEY)


# # ─────────────────────────────────────────────
# # Helpers
# # ─────────────────────────────────────────────

# def translate_text(text: str, source_lang: str, target_lang: str) -> str:
#     """Translate text between any two Sarvam-supported language codes."""
#     if source_lang == target_lang:
#         return text
#     try:
#         resp = sarvam.text.translate(
#             input=text,
#             source_language_code=source_lang,
#             target_language_code=target_lang,
#             speaker_gender="Male",
#             mode="formal",
#             model="mayura:v1",
#             numerals_format="native",
#         )
#         return resp.translated_text
#     except Exception as e:
#         print(f"Translation error ({source_lang}→{target_lang}):", e)
#         return text  # fallback: return original


# def ask_ollama(prompt: str) -> str:
#     """Send a prompt to local Ollama (llama3) and return the response."""
#     system = (
#         "You are a helpful, empathetic Indian doctor assistant. "
#         "Answer in clear English. Keep your answer to 2-3 short sentences max. "
#         "Do NOT add disclaimers. Be direct and practical."
#     )
#     try:
#         resp = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": f"{system}\n\nPatient: {prompt}\nDoctor:",
#                 "stream": False,
#             },
#             timeout=30,
#         )
#         resp.raise_for_status()
#         return resp.json().get("response", "").strip()
#     except Exception as e:
#         print("Ollama error:", e)
#         return "I'm sorry, I couldn't process that right now. Please try again."


# def tts_stream(text: str, lang: str):
#     """Stream MP3 audio from Sarvam TTS for the given language."""
#     speaker, lang_code = LANG_SPEAKERS.get(lang, ("shubh", "hi-IN"))
#     headers = {
#         "api-subscription-key": API_KEY,
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "text": text[:500],   # Sarvam has a char limit per request
#         "target_language_code": lang_code,
#         "speaker": speaker,
#         "model": "bulbul:v3",
#         "pace": 1.0,
#         "speech_sample_rate": 22050,
#         "output_audio_codec": "mp3",
#         "enable_preprocessing": True,
#     }
#     try:
#         resp = requests.post(TTS_URL, headers=headers, json=payload, stream=True)
#         resp.raise_for_status()
#         for chunk in resp.iter_content(chunk_size=8192):
#             if chunk:
#                 yield chunk
#     except Exception as e:
#         print("TTS stream error:", e)
#         yield b""


# # ─────────────────────────────────────────────
# # Routes
# # ─────────────────────────────────────────────

# # ── 1. Speech → Text (Whisper) ────────────────
# @app.post("/stt")
# async def speech_to_text(
#     file: UploadFile = File(...),
#     language: str = "hi-IN",
# ):
#     """
#     Receives audio/webm from the frontend.
#     Returns {"text": "<transcription in the user's language>"}
#     """
#     # Save uploaded audio to a temp file
#     suffix = ".webm"
#     with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name

#     # Whisper language code is just the 2-letter ISO code (e.g. "hi" from "hi-IN")
#     whisper_lang = language.split("-")[0]

#     result = whisper_model.transcribe(tmp_path, language=whisper_lang)
#     text = result.get("text", "").strip()
#     print(f"[STT] lang={language} → '{text}'")

#     return {"text": text, "language": language}


# # ── 2. Text → Ollama → translated response ───
# class ChatRequest(BaseModel):
#     text: str
#     language: str = "hi-IN"  # user's language code


# @app.post("/chat")
# async def chat(body: ChatRequest):
#     """
#     Pipeline:
#       user text (original lang)
#         → translate to English
#         → Ollama (English)
#         → translate back to original lang
#     Returns {"response": "<AI reply in user's language>"}
#     """
#     user_lang = body.language
#     user_text = body.text
#     print(f"[CHAT] Received ({user_lang}): {user_text}")

#     # Step 1 — Translate user input → English (skip if already English)
#     english_input = translate_text(user_text, source_lang=user_lang, target_lang="en-IN")
#     print(f"[CHAT] Translated to EN: {english_input}")

#     # Step 2 — Ask Ollama in English
#     english_response = ask_ollama(english_input)
#     print(f"[CHAT] Ollama EN response: {english_response}")

#     # Step 3 — Translate Ollama response back to user's language
#     final_response = translate_text(english_response, source_lang="en-IN", target_lang=user_lang)
#     print(f"[CHAT] Translated back ({user_lang}): {final_response}")

#     return {"response": final_response}


# # ── 3. Text → Speech (Sarvam TTS stream) ──────
# @app.get("/tts")
# def text_to_speech(
#     text: str = Query(...),
#     lang: str = Query("hi-IN"),
# ):
#     """
#     Streams MP3 audio for the given text in the given language.
#     Frontend: new Audio(`/tts?text=...&lang=hi-IN`).play()
#     """
#     print(f"[TTS] lang={lang}, text={text[:60]}...")
#     return StreamingResponse(
#         tts_stream(text, lang),
#         media_type="audio/mpeg",
#     )


# # ── Health check ──────────────────────────────
# @app.get("/health")
# def health():
#     return {"status": "ok", "whisper": "loaded", "ollama": "localhost:11434"}

# new 3
# import json
# import shutil
# import tempfile
# import requests
# import whisper
# from fastapi import FastAPI, File, UploadFile, Query
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse, Response
# from pydantic import BaseModel
# from sarvamai import SarvamAI

# # ─────────────────────────────────────────────
# # Config
# # ─────────────────────────────────────────────
# API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"   # move to .env later
# TTS_URL = "https://api.sarvam.ai/text-to-speech/stream"

# LANG_SPEAKERS = {
#     "hi-IN": ("shubh",     "hi-IN"),
#     "en-IN": ("angrezi",   "en-IN"),
#     "bn-IN": ("amartya",   "bn-IN"),
#     "te-IN": ("arvind",    "te-IN"),
#     "ta-IN": ("aditya",    "ta-IN"),
#     "kn-IN": ("ananya",    "kn-IN"),
#     "ml-IN": ("abhilash",  "ml-IN"),
#     "mr-IN": ("amol",      "mr-IN"),
#     "gu-IN": ("ankit",     "gu-IN"),
#     "pa-IN": ("amrinder",  "pa-IN"),
#     "od-IN": ("aishwarya", "od-IN"),
# }

# # ─────────────────────────────────────────────
# # CORS headers — attached manually to EVERY
# # response so ngrok cannot swallow them.
# # ─────────────────────────────────────────────
# CORS_HEADERS = {
#     "Access-Control-Allow-Origin":  "*",
#     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
#     "Access-Control-Allow-Headers": "*",
#     "Access-Control-Max-Age":       "86400",
# }

# # ─────────────────────────────────────────────
# # App + standard CORS middleware (belt & braces)
# # ─────────────────────────────────────────────
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     expose_headers=["*"],
# )


# # ── Catch every preflight OPTIONS before ngrok can 404 it ─────────────────
# # Ngrok free tier returns its own HTML page for OPTIONS requests,
# # so FastAPI's middleware never gets a chance to add CORS headers.
# # This explicit route beats ngrok by responding 200 + CORS immediately.
# @app.options("/{full_path:path}")
# async def preflight_handler(full_path: str):
#     return Response(status_code=200, headers=CORS_HEADERS)


# # ─────────────────────────────────────────────
# # Load Whisper once at startup
# # ─────────────────────────────────────────────
# print("Loading Whisper model…")
# whisper_model = whisper.load_model("base")   # swap to "small" for better Hindi accuracy
# print("Whisper ready.")

# sarvam = SarvamAI(api_subscription_key=API_KEY)


# # ─────────────────────────────────────────────
# # Helpers
# # ─────────────────────────────────────────────

# def translate_text(text: str, source_lang: str, target_lang: str) -> str:
#     """Translate via Sarvam. Returns original text on failure."""
#     if source_lang == target_lang:
#         return text
#     try:
#         resp = sarvam.text.translate(
#             input=text,
#             source_language_code=source_lang,
#             target_language_code=target_lang,
#             speaker_gender="Male",
#             mode="formal",
#             model="mayura:v1",
#             numerals_format="native",
#         )
#         return resp.translated_text
#     except Exception as e:
#         print(f"[TRANSLATE] {source_lang}→{target_lang} error:", e)
#         return text


# def ask_ollama(prompt: str) -> str:
#     """Query local Ollama llama3 and return the response string."""
#     system = (
#         "You are a helpful, empathetic Indian doctor assistant. "
#         "Answer in clear English in 2-3 short sentences. "
#         "Be direct and practical. No disclaimers."
#     )
#     try:
#         resp = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": f"{system}\n\nPatient: {prompt}\nDoctor:",
#                 "stream": False,
#             },
#             timeout=30,
#         )
#         resp.raise_for_status()
#         return resp.json().get("response", "").strip()
#     except Exception as e:
#         print("[OLLAMA] Error:", e)
#         return "I'm sorry, I couldn't process that right now. Please try again."


# def tts_stream(text: str, lang: str):
#     """Yield MP3 chunks from Sarvam TTS."""
#     speaker, lang_code = LANG_SPEAKERS.get(lang, ("shubh", "hi-IN"))
#     headers = {
#         "api-subscription-key": API_KEY,
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "text": text[:500],
#         "target_language_code": lang_code,
#         "speaker": speaker,
#         "model": "bulbul:v3",
#         "pace": 1.0,
#         "speech_sample_rate": 22050,
#         "output_audio_codec": "mp3",
#         "enable_preprocessing": True,
#     }
#     try:
#         resp = requests.post(TTS_URL, headers=headers, json=payload, stream=True)
#         resp.raise_for_status()
#         for chunk in resp.iter_content(chunk_size=8192):
#             if chunk:
#                 yield chunk
#     except Exception as e:
#         print("[TTS] Error:", e)
#         yield b""


# # ─────────────────────────────────────────────
# # Routes
# # ─────────────────────────────────────────────

# # ── 1. /stt  — audio file → transcribed text ──
# @app.post("/stt")
# async def speech_to_text(
#     file: UploadFile = File(...),
#     language: str = "hi-IN",
# ):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name

#     whisper_lang = language.split("-")[0]   # "hi-IN" → "hi"
#     result = whisper_model.transcribe(tmp_path, language=whisper_lang)
#     text = result.get("text", "").strip()
#     print(f"[STT] lang={language} → '{text}'")

#     return Response(
#         content=json.dumps({"text": text, "language": language}),
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )


# # ── 2. /chat — text → Ollama → translated reply ─
# class ChatRequest(BaseModel):
#     text: str
#     language: str = "hi-IN"


# @app.post("/chat")
# async def chat(body: ChatRequest):
#     user_lang = body.language
#     user_text = body.text
#     print(f"[CHAT] in ({user_lang}): {user_text}")

#     en_input = translate_text(user_text, source_lang=user_lang,  target_lang="en-IN")
#     en_reply = ask_ollama(en_input)
#     final    = translate_text(en_reply,  source_lang="en-IN",    target_lang=user_lang)

#     print(f"[CHAT] out ({user_lang}): {final}")

#     return Response(
#         content=json.dumps({"response": final}),
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )


# # ── 3. /tts  — text → streamed MP3 ────────────
# @app.get("/tts")
# def text_to_speech(
#     text: str = Query(...),
#     lang: str = Query("hi-IN"),
# ):
#     print(f"[TTS] lang={lang} text={text[:60]}…")
#     return StreamingResponse(
#         tts_stream(text, lang),
#         media_type="audio/mpeg",
#         headers=CORS_HEADERS,
#     )


# # ── 4. /health ─────────────────────────────────
# @app.get("/health")
# def health():
#     return Response(
#         content='{"status":"ok","whisper":"loaded","ollama":"localhost:11434"}',
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )

# NEW 4
# import json
# import shutil
# import tempfile
# import requests
# import whisper
# from fastapi import FastAPI, File, UploadFile, Query
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse, Response
# from pydantic import BaseModel
# from sarvamai import SarvamAI

# # ─────────────────────────────────────────────
# # Config
# # ─────────────────────────────────────────────
# API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"   # move to .env later

# # Sarvam TTS — non-streaming endpoint is more reliable than /stream
# TTS_URL = "https://api.sarvam.ai/text-to-speech"

# LANG_SPEAKERS = {
#     "hi-IN": ("meera",    "hi-IN"),
#     "en-IN": ("meera",    "en-IN"),
#     "bn-IN": ("meera",    "bn-IN"),
#     "te-IN": ("meera",    "te-IN"),
#     "ta-IN": ("meera",    "ta-IN"),
#     "kn-IN": ("meera",    "kn-IN"),
#     "ml-IN": ("meera",    "ml-IN"),
#     "mr-IN": ("meera",    "mr-IN"),
#     "gu-IN": ("meera",    "gu-IN"),
#     "pa-IN": ("meera",    "pa-IN"),
#     "od-IN": ("meera",    "od-IN"),
# }

# # ─────────────────────────────────────────────
# # CORS — attached manually to every response
# # so ngrok cannot strip them
# # ─────────────────────────────────────────────
# CORS_HEADERS = {
#     "Access-Control-Allow-Origin":  "*",
#     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
#     "Access-Control-Allow-Headers": "*",
#     "Access-Control-Max-Age":       "86400",
# }

# # ─────────────────────────────────────────────
# # App
# # ─────────────────────────────────────────────
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     expose_headers=["*"],
# )

# @app.options("/{full_path:path}")
# async def preflight_handler(full_path: str):
#     return Response(status_code=200, headers=CORS_HEADERS)

# # ─────────────────────────────────────────────
# # Load Whisper once at startup
# # ─────────────────────────────────────────────
# print("Loading Whisper model…")
# whisper_model = whisper.load_model("small")  # "small" is much better than "base" for Indian languages
# print("Whisper ready.")

# sarvam = SarvamAI(api_subscription_key=API_KEY)


# # ─────────────────────────────────────────────
# # Helpers
# # ─────────────────────────────────────────────

# def translate_text(text: str, source_lang: str, target_lang: str) -> str:
#     """Translate via Sarvam mayura. Falls back to original on error."""
#     if source_lang == target_lang:
#         return text
#     try:
#         resp = sarvam.text.translate(
#             input=text,
#             source_language_code=source_lang,
#             target_language_code=target_lang,
#             speaker_gender="Female",
#             mode="formal",
#             model="mayura:v1",
#             numerals_format="native",
#         )
#         return resp.translated_text
#     except Exception as e:
#         print(f"[TRANSLATE] {source_lang}→{target_lang} error:", e)
#         return text


# def ask_ollama(prompt: str) -> str:
#     """Query local Ollama llama3."""
#     system = (
#         "You are a helpful, empathetic Indian doctor assistant. "
#         "Answer in clear English in 2-3 short sentences. "
#         "Be direct and practical. No disclaimers."
#     )
#     try:
#         resp = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": f"{system}\n\nPatient: {prompt}\nDoctor:",
#                 "stream": False,
#             },
#             timeout=30,
#         )
#         resp.raise_for_status()
#         return resp.json().get("response", "").strip()
#     except Exception as e:
#         print("[OLLAMA] Error:", e)
#         return "I'm sorry, I couldn't process that right now. Please try again."


# def get_tts_audio(text: str, lang: str) -> bytes:
#     """
#     Call Sarvam TTS (non-streaming) and return raw WAV bytes.
#     The /stream endpoint sometimes returns empty chunks which breaks
#     the browser Audio element with NotSupportedError.
#     Using the regular endpoint returns a complete base64-encoded WAV.
#     """
#     speaker, lang_code = LANG_SPEAKERS.get(lang, ("meera", "hi-IN"))

#     headers = {
#         "api-subscription-key": API_KEY,
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "inputs": [text[:500]],              # non-streaming API uses "inputs" array
#         "target_language_code": lang_code,
#         "speaker": speaker,
#         "model": "bulbul:v2",
#         "pace": 1.0,
#         "speech_sample_rate": 22050,
#         "enable_preprocessing": True,
#         "loudness": 1.5,
#     }

#     try:
#         resp = requests.post(TTS_URL, headers=headers, json=payload, timeout=30)
#         resp.raise_for_status()
#         data = resp.json()

#         # Sarvam non-streaming returns: {"audios": ["<base64-wav>", ...]}
#         import base64
#         audio_b64 = data.get("audios", [""])[0]
#         if not audio_b64:
#             print("[TTS] Empty audio in response:", data)
#             return b""

#         audio_bytes = base64.b64decode(audio_b64)
#         print(f"[TTS] Got {len(audio_bytes)} bytes of WAV audio")
#         return audio_bytes

#     except Exception as e:
#         print("[TTS] Error:", e)
#         return b""


# # ─────────────────────────────────────────────
# # Routes
# # ─────────────────────────────────────────────

# # ── 1. /stt  — audio → text via Whisper ───────
# @app.post("/stt")
# async def speech_to_text(
#     file: UploadFile = File(...),
#     language: str = "hi-IN",
# ):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name

#     # Pass language explicitly so Whisper doesn't auto-detect wrong language
#     whisper_lang = language.split("-")[0]   # "hi-IN" → "hi"
#     print(f"[STT] Transcribing with lang={whisper_lang}…")

#     result = whisper_model.transcribe(
#         tmp_path,
#         language=whisper_lang,   # ← FORCES the language, no auto-detection
#         task="transcribe",       # transcribe (not translate) keeps original language
#         fp16=False,              # avoid fp16 warnings on CPU
#     )
#     text = result.get("text", "").strip()
#     print(f"[STT] Result: '{text}'")

#     return Response(
#         content=json.dumps({"text": text, "language": language}),
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )


# # ── 2. /chat — text → Ollama → translated reply ─
# class ChatRequest(BaseModel):
#     text: str
#     language: str = "hi-IN"


# @app.post("/chat")
# async def chat(body: ChatRequest):
#     user_lang = body.language
#     user_text = body.text
#     print(f"[CHAT] in ({user_lang}): {user_text}")

#     en_input = translate_text(user_text, source_lang=user_lang, target_lang="en-IN")
#     print(f"[CHAT] → EN: {en_input}")

#     en_reply = ask_ollama(en_input)
#     print(f"[CHAT] Ollama: {en_reply}")

#     final = translate_text(en_reply, source_lang="en-IN", target_lang=user_lang)
#     print(f"[CHAT] → {user_lang}: {final}")

#     return Response(
#         content=json.dumps({"response": final}),
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )


# # ── 3. /tts  — text → WAV audio bytes ─────────
# @app.get("/tts")
# def text_to_speech(
#     text: str = Query(...),
#     lang: str = Query("hi-IN"),
# ):
#     print(f"[TTS] lang={lang} text={text[:60]}…")
#     audio_bytes = get_tts_audio(text, lang)

#     if not audio_bytes:
#         return Response(
#             content=json.dumps({"error": "TTS failed"}),
#             media_type="application/json",
#             status_code=500,
#             headers=CORS_HEADERS,
#         )

#     return Response(
#         content=audio_bytes,
#         media_type="audio/wav",       # Sarvam non-streaming returns WAV
#         headers={
#             **CORS_HEADERS,
#             "Content-Length": str(len(audio_bytes)),
#             "Accept-Ranges": "bytes",
#         },
#     )


# # ── 4. /health ─────────────────────────────────
# @app.get("/health")
# def health():
#     return Response(
#         content='{"status":"ok","whisper":"small","ollama":"localhost:11434"}',
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )

# new 5
# from fastapi import FastAPI, Query
# from fastapi.responses import StreamingResponse
# from fastapi.middleware.cors import CORSMiddleware
# import requests
# from sarvamai import SarvamAI
# from fastapi.responses import StreamingResponse


# app = FastAPI()

# # ✅ CORS FIX (VERY IMPORTANT)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # for dev (later restrict)
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # 🔑 API Key (move to .env later)
# API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"

# API_URL = "https://api.sarvam.ai/text-to-speech/stream"

# # Sarvam client
# client = SarvamAI(api_subscription_key=API_KEY)


# # 🧠 1. Ollama (short response enforced)
# def generate_with_ollama(prompt: str) -> str:
#     try:
#         constrained_prompt = f"""
#         Answer in ONLY 1 short sentence.
#         You are a helpful doctor.
#         Be concise and clear.

#         {prompt}
#         """

#         response = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": constrained_prompt,
#                 "stream": False
#             },
#             timeout=10
#         )

#         response.raise_for_status()
#         return response.json().get("response", "Sorry, I couldn't respond.").strip()

#     except Exception as e:
#         print("Ollama Error:", e)
#         return "Sorry, I am unable to respond right now."


# # 🌍 2. Translation
# def translate_text(text: str) -> str:
#     try:
#         response = client.text.translate(
#             input=text,
#             source_language_code="en-IN",
#             target_language_code="hi-IN",
#             speaker_gender="Male",
#             mode="formal",
#             model="mayura:v1",
#             numerals_format="native"
#         )
#         return response.translated_text

#     except Exception as e:
#         print("Translate Error:", e)
#         return text  # fallback


# # 🔊 3. TTS streaming
# def generate_tts_stream(text: str):
#     try:
#         headers = {
#             "api-subscription-key": API_KEY,
#             "Content-Type": "application/json"
#         }

#         payload = {
#             "text": text,
#             "target_language_code": "hi-IN",
#             "speaker": "shubh",
#             "model": "bulbul:v3",
#             "pace": 1.1,
#             "speech_sample_rate": 22050,
#             "output_audio_codec": "mp3",
#             "enable_preprocessing": True
#         }

#         response = requests.post(
#             API_URL,
#             headers=headers,
#             json=payload,
#             stream=True
#         )

#         response.raise_for_status()

#         for chunk in response.iter_content(chunk_size=8192):
#             if chunk:
#                 yield chunk

#     except Exception as e:
#         print("TTS Error:", e)
#         yield b""


# # 🚀 4. Endpoint
# # @app.get("/tts")
# # def tts(text: str = Query(...)):
# #     print("Input:", text)

# #     # 🧠 Step 1: LLM
# #     ai_response = generate_with_ollama(text)
# #     print("Ollama:", ai_response)

# #     # 🌍 Step 2: Translate
# #     translated = translate_text(ai_response)
# #     print("Translated:", translated)

# #     # 🔊 Step 3: Stream TTS
# #     return StreamingResponse(
# #         generate_tts_stream(translated),
# #         media_type="audio/mpeg"
# #     )

# # /stt — receives audio/webm, returns {"text": "..."}
# @app.post("/stt")
# async def stt(file: UploadFile = File(...), language: str = "hi-IN"):
#     with open("input.webm", "wb") as f:
#         shutil.copyfileobj(file.file, f)
#     result = whisper_model.transcribe("input.webm")
#     return {"text": result["text"]}

# # /tts — already works, just add lang param if needed
# @app.get("/tts")
# async def tts(text: str, lang: str = "hi-IN"):
#     ...

# NEW 2
# import io
# import shutil
# import tempfile
# import requests
# import whisper
# from fastapi import FastAPI, File, UploadFile, Query
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse
# from pydantic import BaseModel
# from sarvamai import SarvamAI

# # ─────────────────────────────────────────────
# # Config
# # ─────────────────────────────────────────────
# API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"  # move to .env later
# TTS_URL = "https://api.sarvam.ai/text-to-speech/stream"

# # Sarvam language code → speaker mapping (Sarvam bulbul:v3 speakers)
# LANG_SPEAKERS = {
#     "hi-IN": ("shubh",   "hi-IN"),
#     "en-IN": ("angrezi", "en-IN"),
#     "bn-IN": ("amartya", "bn-IN"),
#     "te-IN": ("arvind",  "te-IN"),
#     "ta-IN": ("aditya",  "ta-IN"),
#     "kn-IN": ("ananya",  "kn-IN"),
#     "ml-IN": ("abhilash","ml-IN"),
#     "mr-IN": ("amol",    "mr-IN"),
#     "gu-IN": ("ankit",   "gu-IN"),
#     "pa-IN": ("amrinder","pa-IN"),
#     "od-IN": ("aishwarya","od-IN"),
# }

# # ─────────────────────────────────────────────
# # App & middleware
# # ─────────────────────────────────────────────
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],     # restrict in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ─────────────────────────────────────────────
# # Load models once at startup
# # ─────────────────────────────────────────────
# print("Loading Whisper model...")
# whisper_model = whisper.load_model("base")   # swap to "small" for better accuracy
# print("Whisper ready.")

# sarvam = SarvamAI(api_subscription_key=API_KEY)


# # ─────────────────────────────────────────────
# # Helpers
# # ─────────────────────────────────────────────

# def translate_text(text: str, source_lang: str, target_lang: str) -> str:
#     """Translate text between any two Sarvam-supported language codes."""
#     if source_lang == target_lang:
#         return text
#     try:
#         resp = sarvam.text.translate(
#             input=text,
#             source_language_code=source_lang,
#             target_language_code=target_lang,
#             speaker_gender="Male",
#             mode="formal",
#             model="mayura:v1",
#             numerals_format="native",
#         )
#         return resp.translated_text
#     except Exception as e:
#         print(f"Translation error ({source_lang}→{target_lang}):", e)
#         return text  # fallback: return original


# def ask_ollama(prompt: str) -> str:
#     """Send a prompt to local Ollama (llama3) and return the response."""
#     system = (
#         "You are a helpful, empathetic Indian doctor assistant. "
#         "Answer in clear English. Keep your answer to 2-3 short sentences max. "
#         "Do NOT add disclaimers. Be direct and practical."
#     )
#     try:
#         resp = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": f"{system}\n\nPatient: {prompt}\nDoctor:",
#                 "stream": False,
#             },
#             timeout=30,
#         )
#         resp.raise_for_status()
#         return resp.json().get("response", "").strip()
#     except Exception as e:
#         print("Ollama error:", e)
#         return "I'm sorry, I couldn't process that right now. Please try again."


# def tts_stream(text: str, lang: str):
#     """Stream MP3 audio from Sarvam TTS for the given language."""
#     speaker, lang_code = LANG_SPEAKERS.get(lang, ("shubh", "hi-IN"))
#     headers = {
#         "api-subscription-key": API_KEY,
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "text": text[:500],   # Sarvam has a char limit per request
#         "target_language_code": lang_code,
#         "speaker": speaker,
#         "model": "bulbul:v3",
#         "pace": 1.0,
#         "speech_sample_rate": 22050,
#         "output_audio_codec": "mp3",
#         "enable_preprocessing": True,
#     }
#     try:
#         resp = requests.post(TTS_URL, headers=headers, json=payload, stream=True)
#         resp.raise_for_status()
#         for chunk in resp.iter_content(chunk_size=8192):
#             if chunk:
#                 yield chunk
#     except Exception as e:
#         print("TTS stream error:", e)
#         yield b""


# # ─────────────────────────────────────────────
# # Routes
# # ─────────────────────────────────────────────

# # ── 1. Speech → Text (Whisper) ────────────────
# @app.post("/stt")
# async def speech_to_text(
#     file: UploadFile = File(...),
#     language: str = "hi-IN",
# ):
#     """
#     Receives audio/webm from the frontend.
#     Returns {"text": "<transcription in the user's language>"}
#     """
#     # Save uploaded audio to a temp file
#     suffix = ".webm"
#     with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name

#     # Whisper language code is just the 2-letter ISO code (e.g. "hi" from "hi-IN")
#     whisper_lang = language.split("-")[0]

#     result = whisper_model.transcribe(tmp_path, language=whisper_lang)
#     text = result.get("text", "").strip()
#     print(f"[STT] lang={language} → '{text}'")

#     return {"text": text, "language": language}


# # ── 2. Text → Ollama → translated response ───
# class ChatRequest(BaseModel):
#     text: str
#     language: str = "hi-IN"  # user's language code


# @app.post("/chat")
# async def chat(body: ChatRequest):
#     """
#     Pipeline:
#       user text (original lang)
#         → translate to English
#         → Ollama (English)
#         → translate back to original lang
#     Returns {"response": "<AI reply in user's language>"}
#     """
#     user_lang = body.language
#     user_text = body.text
#     print(f"[CHAT] Received ({user_lang}): {user_text}")

#     # Step 1 — Translate user input → English (skip if already English)
#     english_input = translate_text(user_text, source_lang=user_lang, target_lang="en-IN")
#     print(f"[CHAT] Translated to EN: {english_input}")

#     # Step 2 — Ask Ollama in English
#     english_response = ask_ollama(english_input)
#     print(f"[CHAT] Ollama EN response: {english_response}")

#     # Step 3 — Translate Ollama response back to user's language
#     final_response = translate_text(english_response, source_lang="en-IN", target_lang=user_lang)
#     print(f"[CHAT] Translated back ({user_lang}): {final_response}")

#     return {"response": final_response}


# # ── 3. Text → Speech (Sarvam TTS stream) ──────
# @app.get("/tts")
# def text_to_speech(
#     text: str = Query(...),
#     lang: str = Query("hi-IN"),
# ):
#     """
#     Streams MP3 audio for the given text in the given language.
#     Frontend: new Audio(`/tts?text=...&lang=hi-IN`).play()
#     """
#     print(f"[TTS] lang={lang}, text={text[:60]}...")
#     return StreamingResponse(
#         tts_stream(text, lang),
#         media_type="audio/mpeg",
#     )


# # ── Health check ──────────────────────────────
# @app.get("/health")
# def health():
#     return {"status": "ok", "whisper": "loaded", "ollama": "localhost:11434"}

# new 3
# import json
# import shutil
# import tempfile
# import requests
# import whisper
# from fastapi import FastAPI, File, UploadFile, Query
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse, Response
# from pydantic import BaseModel
# from sarvamai import SarvamAI

# # ─────────────────────────────────────────────
# # Config
# # ─────────────────────────────────────────────
# API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"   # move to .env later
# TTS_URL = "https://api.sarvam.ai/text-to-speech/stream"

# LANG_SPEAKERS = {
#     "hi-IN": ("shubh",     "hi-IN"),
#     "en-IN": ("angrezi",   "en-IN"),
#     "bn-IN": ("amartya",   "bn-IN"),
#     "te-IN": ("arvind",    "te-IN"),
#     "ta-IN": ("aditya",    "ta-IN"),
#     "kn-IN": ("ananya",    "kn-IN"),
#     "ml-IN": ("abhilash",  "ml-IN"),
#     "mr-IN": ("amol",      "mr-IN"),
#     "gu-IN": ("ankit",     "gu-IN"),
#     "pa-IN": ("amrinder",  "pa-IN"),
#     "od-IN": ("aishwarya", "od-IN"),
# }

# # ─────────────────────────────────────────────
# # CORS headers — attached manually to EVERY
# # response so ngrok cannot swallow them.
# # ─────────────────────────────────────────────
# CORS_HEADERS = {
#     "Access-Control-Allow-Origin":  "*",
#     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
#     "Access-Control-Allow-Headers": "*",
#     "Access-Control-Max-Age":       "86400",
# }

# # ─────────────────────────────────────────────
# # App + standard CORS middleware (belt & braces)
# # ─────────────────────────────────────────────
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     expose_headers=["*"],
# )


# # ── Catch every preflight OPTIONS before ngrok can 404 it ─────────────────
# # Ngrok free tier returns its own HTML page for OPTIONS requests,
# # so FastAPI's middleware never gets a chance to add CORS headers.
# # This explicit route beats ngrok by responding 200 + CORS immediately.
# @app.options("/{full_path:path}")
# async def preflight_handler(full_path: str):
#     return Response(status_code=200, headers=CORS_HEADERS)


# # ─────────────────────────────────────────────
# # Load Whisper once at startup
# # ─────────────────────────────────────────────
# print("Loading Whisper model…")
# whisper_model = whisper.load_model("base")   # swap to "small" for better Hindi accuracy
# print("Whisper ready.")

# sarvam = SarvamAI(api_subscription_key=API_KEY)


# # ─────────────────────────────────────────────
# # Helpers
# # ─────────────────────────────────────────────

# def translate_text(text: str, source_lang: str, target_lang: str) -> str:
#     """Translate via Sarvam. Returns original text on failure."""
#     if source_lang == target_lang:
#         return text
#     try:
#         resp = sarvam.text.translate(
#             input=text,
#             source_language_code=source_lang,
#             target_language_code=target_lang,
#             speaker_gender="Male",
#             mode="formal",
#             model="mayura:v1",
#             numerals_format="native",
#         )
#         return resp.translated_text
#     except Exception as e:
#         print(f"[TRANSLATE] {source_lang}→{target_lang} error:", e)
#         return text


# def ask_ollama(prompt: str) -> str:
#     """Query local Ollama llama3 and return the response string."""
#     system = (
#         "You are a helpful, empathetic Indian doctor assistant. "
#         "Answer in clear English in 2-3 short sentences. "
#         "Be direct and practical. No disclaimers."
#     )
#     try:
#         resp = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": f"{system}\n\nPatient: {prompt}\nDoctor:",
#                 "stream": False,
#             },
#             timeout=30,
#         )
#         resp.raise_for_status()
#         return resp.json().get("response", "").strip()
#     except Exception as e:
#         print("[OLLAMA] Error:", e)
#         return "I'm sorry, I couldn't process that right now. Please try again."


# def tts_stream(text: str, lang: str):
#     """Yield MP3 chunks from Sarvam TTS."""
#     speaker, lang_code = LANG_SPEAKERS.get(lang, ("shubh", "hi-IN"))
#     headers = {
#         "api-subscription-key": API_KEY,
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "text": text[:500],
#         "target_language_code": lang_code,
#         "speaker": speaker,
#         "model": "bulbul:v3",
#         "pace": 1.0,
#         "speech_sample_rate": 22050,
#         "output_audio_codec": "mp3",
#         "enable_preprocessing": True,
#     }
#     try:
#         resp = requests.post(TTS_URL, headers=headers, json=payload, stream=True)
#         resp.raise_for_status()
#         for chunk in resp.iter_content(chunk_size=8192):
#             if chunk:
#                 yield chunk
#     except Exception as e:
#         print("[TTS] Error:", e)
#         yield b""


# # ─────────────────────────────────────────────
# # Routes
# # ─────────────────────────────────────────────

# # ── 1. /stt  — audio file → transcribed text ──
# @app.post("/stt")
# async def speech_to_text(
#     file: UploadFile = File(...),
#     language: str = "hi-IN",
# ):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name

#     whisper_lang = language.split("-")[0]   # "hi-IN" → "hi"
#     result = whisper_model.transcribe(tmp_path, language=whisper_lang)
#     text = result.get("text", "").strip()
#     print(f"[STT] lang={language} → '{text}'")

#     return Response(
#         content=json.dumps({"text": text, "language": language}),
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )


# # ── 2. /chat — text → Ollama → translated reply ─
# class ChatRequest(BaseModel):
#     text: str
#     language: str = "hi-IN"


# @app.post("/chat")
# async def chat(body: ChatRequest):
#     user_lang = body.language
#     user_text = body.text
#     print(f"[CHAT] in ({user_lang}): {user_text}")

#     en_input = translate_text(user_text, source_lang=user_lang,  target_lang="en-IN")
#     en_reply = ask_ollama(en_input)
#     final    = translate_text(en_reply,  source_lang="en-IN",    target_lang=user_lang)

#     print(f"[CHAT] out ({user_lang}): {final}")

#     return Response(
#         content=json.dumps({"response": final}),
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )


# # ── 3. /tts  — text → streamed MP3 ────────────
# @app.get("/tts")
# def text_to_speech(
#     text: str = Query(...),
#     lang: str = Query("hi-IN"),
# ):
#     print(f"[TTS] lang={lang} text={text[:60]}…")
#     return StreamingResponse(
#         tts_stream(text, lang),
#         media_type="audio/mpeg",
#         headers=CORS_HEADERS,
#     )


# # ── 4. /health ─────────────────────────────────
# @app.get("/health")
# def health():
#     return Response(
#         content='{"status":"ok","whisper":"loaded","ollama":"localhost:11434"}',
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )

# NEW 4
# from fastapi import FastAPI, Query
# from fastapi.responses import StreamingResponse
# from fastapi.middleware.cors import CORSMiddleware
# import requests
# from sarvamai import SarvamAI
# from fastapi.responses import StreamingResponse


# app = FastAPI()

# # ✅ CORS FIX (VERY IMPORTANT)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # for dev (later restrict)
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # 🔑 API Key (move to .env later)
# API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"

# API_URL = "https://api.sarvam.ai/text-to-speech/stream"

# # Sarvam client
# client = SarvamAI(api_subscription_key=API_KEY)


# # 🧠 1. Ollama (short response enforced)
# def generate_with_ollama(prompt: str) -> str:
#     try:
#         constrained_prompt = f"""
#         Answer in ONLY 1 short sentence.
#         You are a helpful doctor.
#         Be concise and clear.

#         {prompt}
#         """

#         response = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": constrained_prompt,
#                 "stream": False
#             },
#             timeout=10
#         )

#         response.raise_for_status()
#         return response.json().get("response", "Sorry, I couldn't respond.").strip()

#     except Exception as e:
#         print("Ollama Error:", e)
#         return "Sorry, I am unable to respond right now."


# # 🌍 2. Translation
# def translate_text(text: str) -> str:
#     try:
#         response = client.text.translate(
#             input=text,
#             source_language_code="en-IN",
#             target_language_code="hi-IN",
#             speaker_gender="Male",
#             mode="formal",
#             model="mayura:v1",
#             numerals_format="native"
#         )
#         return response.translated_text

#     except Exception as e:
#         print("Translate Error:", e)
#         return text  # fallback


# # 🔊 3. TTS streaming
# def generate_tts_stream(text: str):
#     try:
#         headers = {
#             "api-subscription-key": API_KEY,
#             "Content-Type": "application/json"
#         }

#         payload = {
#             "text": text,
#             "target_language_code": "hi-IN",
#             "speaker": "shubh",
#             "model": "bulbul:v3",
#             "pace": 1.1,
#             "speech_sample_rate": 22050,
#             "output_audio_codec": "mp3",
#             "enable_preprocessing": True
#         }

#         response = requests.post(
#             API_URL,
#             headers=headers,
#             json=payload,
#             stream=True
#         )

#         response.raise_for_status()

#         for chunk in response.iter_content(chunk_size=8192):
#             if chunk:
#                 yield chunk

#     except Exception as e:
#         print("TTS Error:", e)
#         yield b""


# # 🚀 4. Endpoint
# # @app.get("/tts")
# # def tts(text: str = Query(...)):
# #     print("Input:", text)

# #     # 🧠 Step 1: LLM
# #     ai_response = generate_with_ollama(text)
# #     print("Ollama:", ai_response)

# #     # 🌍 Step 2: Translate
# #     translated = translate_text(ai_response)
# #     print("Translated:", translated)

# #     # 🔊 Step 3: Stream TTS
# #     return StreamingResponse(
# #         generate_tts_stream(translated),
# #         media_type="audio/mpeg"
# #     )

# # /stt — receives audio/webm, returns {"text": "..."}
# @app.post("/stt")
# async def stt(file: UploadFile = File(...), language: str = "hi-IN"):
#     with open("input.webm", "wb") as f:
#         shutil.copyfileobj(file.file, f)
#     result = whisper_model.transcribe("input.webm")
#     return {"text": result["text"]}

# # /tts — already works, just add lang param if needed
# @app.get("/tts")
# async def tts(text: str, lang: str = "hi-IN"):
#     ...

# NEW 2
# import io
# import shutil
# import tempfile
# import requests
# import whisper
# from fastapi import FastAPI, File, UploadFile, Query
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse
# from pydantic import BaseModel
# from sarvamai import SarvamAI

# # ─────────────────────────────────────────────
# # Config
# # ─────────────────────────────────────────────
# API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"  # move to .env later
# TTS_URL = "https://api.sarvam.ai/text-to-speech/stream"

# # Sarvam language code → speaker mapping (Sarvam bulbul:v3 speakers)
# LANG_SPEAKERS = {
#     "hi-IN": ("shubh",   "hi-IN"),
#     "en-IN": ("angrezi", "en-IN"),
#     "bn-IN": ("amartya", "bn-IN"),
#     "te-IN": ("arvind",  "te-IN"),
#     "ta-IN": ("aditya",  "ta-IN"),
#     "kn-IN": ("ananya",  "kn-IN"),
#     "ml-IN": ("abhilash","ml-IN"),
#     "mr-IN": ("amol",    "mr-IN"),
#     "gu-IN": ("ankit",   "gu-IN"),
#     "pa-IN": ("amrinder","pa-IN"),
#     "od-IN": ("aishwarya","od-IN"),
# }

# # ─────────────────────────────────────────────
# # App & middleware
# # ─────────────────────────────────────────────
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],     # restrict in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ─────────────────────────────────────────────
# # Load models once at startup
# # ─────────────────────────────────────────────
# print("Loading Whisper model...")
# whisper_model = whisper.load_model("base")   # swap to "small" for better accuracy
# print("Whisper ready.")

# sarvam = SarvamAI(api_subscription_key=API_KEY)


# # ─────────────────────────────────────────────
# # Helpers
# # ─────────────────────────────────────────────

# def translate_text(text: str, source_lang: str, target_lang: str) -> str:
#     """Translate text between any two Sarvam-supported language codes."""
#     if source_lang == target_lang:
#         return text
#     try:
#         resp = sarvam.text.translate(
#             input=text,
#             source_language_code=source_lang,
#             target_language_code=target_lang,
#             speaker_gender="Male",
#             mode="formal",
#             model="mayura:v1",
#             numerals_format="native",
#         )
#         return resp.translated_text
#     except Exception as e:
#         print(f"Translation error ({source_lang}→{target_lang}):", e)
#         return text  # fallback: return original


# def ask_ollama(prompt: str) -> str:
#     """Send a prompt to local Ollama (llama3) and return the response."""
#     system = (
#         "You are a helpful, empathetic Indian doctor assistant. "
#         "Answer in clear English. Keep your answer to 2-3 short sentences max. "
#         "Do NOT add disclaimers. Be direct and practical."
#     )
#     try:
#         resp = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": f"{system}\n\nPatient: {prompt}\nDoctor:",
#                 "stream": False,
#             },
#             timeout=30,
#         )
#         resp.raise_for_status()
#         return resp.json().get("response", "").strip()
#     except Exception as e:
#         print("Ollama error:", e)
#         return "I'm sorry, I couldn't process that right now. Please try again."


# def tts_stream(text: str, lang: str):
#     """Stream MP3 audio from Sarvam TTS for the given language."""
#     speaker, lang_code = LANG_SPEAKERS.get(lang, ("shubh", "hi-IN"))
#     headers = {
#         "api-subscription-key": API_KEY,
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "text": text[:500],   # Sarvam has a char limit per request
#         "target_language_code": lang_code,
#         "speaker": speaker,
#         "model": "bulbul:v3",
#         "pace": 1.0,
#         "speech_sample_rate": 22050,
#         "output_audio_codec": "mp3",
#         "enable_preprocessing": True,
#     }
#     try:
#         resp = requests.post(TTS_URL, headers=headers, json=payload, stream=True)
#         resp.raise_for_status()
#         for chunk in resp.iter_content(chunk_size=8192):
#             if chunk:
#                 yield chunk
#     except Exception as e:
#         print("TTS stream error:", e)
#         yield b""


# # ─────────────────────────────────────────────
# # Routes
# # ─────────────────────────────────────────────

# # ── 1. Speech → Text (Whisper) ────────────────
# @app.post("/stt")
# async def speech_to_text(
#     file: UploadFile = File(...),
#     language: str = "hi-IN",
# ):
#     """
#     Receives audio/webm from the frontend.
#     Returns {"text": "<transcription in the user's language>"}
#     """
#     # Save uploaded audio to a temp file
#     suffix = ".webm"
#     with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name

#     # Whisper language code is just the 2-letter ISO code (e.g. "hi" from "hi-IN")
#     whisper_lang = language.split("-")[0]

#     result = whisper_model.transcribe(tmp_path, language=whisper_lang)
#     text = result.get("text", "").strip()
#     print(f"[STT] lang={language} → '{text}'")

#     return {"text": text, "language": language}


# # ── 2. Text → Ollama → translated response ───
# class ChatRequest(BaseModel):
#     text: str
#     language: str = "hi-IN"  # user's language code


# @app.post("/chat")
# async def chat(body: ChatRequest):
#     """
#     Pipeline:
#       user text (original lang)
#         → translate to English
#         → Ollama (English)
#         → translate back to original lang
#     Returns {"response": "<AI reply in user's language>"}
#     """
#     user_lang = body.language
#     user_text = body.text
#     print(f"[CHAT] Received ({user_lang}): {user_text}")

#     # Step 1 — Translate user input → English (skip if already English)
#     english_input = translate_text(user_text, source_lang=user_lang, target_lang="en-IN")
#     print(f"[CHAT] Translated to EN: {english_input}")

#     # Step 2 — Ask Ollama in English
#     english_response = ask_ollama(english_input)
#     print(f"[CHAT] Ollama EN response: {english_response}")

#     # Step 3 — Translate Ollama response back to user's language
#     final_response = translate_text(english_response, source_lang="en-IN", target_lang=user_lang)
#     print(f"[CHAT] Translated back ({user_lang}): {final_response}")

#     return {"response": final_response}


# # ── 3. Text → Speech (Sarvam TTS stream) ──────
# @app.get("/tts")
# def text_to_speech(
#     text: str = Query(...),
#     lang: str = Query("hi-IN"),
# ):
#     """
#     Streams MP3 audio for the given text in the given language.
#     Frontend: new Audio(`/tts?text=...&lang=hi-IN`).play()
#     """
#     print(f"[TTS] lang={lang}, text={text[:60]}...")
#     return StreamingResponse(
#         tts_stream(text, lang),
#         media_type="audio/mpeg",
#     )


# # ── Health check ──────────────────────────────
# @app.get("/health")
# def health():
#     return {"status": "ok", "whisper": "loaded", "ollama": "localhost:11434"}

# new 3
# import json
# import shutil
# import tempfile
# import requests
# import whisper
# from fastapi import FastAPI, File, UploadFile, Query
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse, Response
# from pydantic import BaseModel
# from sarvamai import SarvamAI

# # ─────────────────────────────────────────────
# # Config
# # ─────────────────────────────────────────────
# API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"   # move to .env later
# TTS_URL = "https://api.sarvam.ai/text-to-speech/stream"

# LANG_SPEAKERS = {
#     "hi-IN": ("shubh",     "hi-IN"),
#     "en-IN": ("angrezi",   "en-IN"),
#     "bn-IN": ("amartya",   "bn-IN"),
#     "te-IN": ("arvind",    "te-IN"),
#     "ta-IN": ("aditya",    "ta-IN"),
#     "kn-IN": ("ananya",    "kn-IN"),
#     "ml-IN": ("abhilash",  "ml-IN"),
#     "mr-IN": ("amol",      "mr-IN"),
#     "gu-IN": ("ankit",     "gu-IN"),
#     "pa-IN": ("amrinder",  "pa-IN"),
#     "od-IN": ("aishwarya", "od-IN"),
# }

# # ─────────────────────────────────────────────
# # CORS headers — attached manually to EVERY
# # response so ngrok cannot swallow them.
# # ─────────────────────────────────────────────
# CORS_HEADERS = {
#     "Access-Control-Allow-Origin":  "*",
#     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
#     "Access-Control-Allow-Headers": "*",
#     "Access-Control-Max-Age":       "86400",
# }

# # ─────────────────────────────────────────────
# # App + standard CORS middleware (belt & braces)
# # ─────────────────────────────────────────────
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     expose_headers=["*"],
# )


# # ── Catch every preflight OPTIONS before ngrok can 404 it ─────────────────
# # Ngrok free tier returns its own HTML page for OPTIONS requests,
# # so FastAPI's middleware never gets a chance to add CORS headers.
# # This explicit route beats ngrok by responding 200 + CORS immediately.
# @app.options("/{full_path:path}")
# async def preflight_handler(full_path: str):
#     return Response(status_code=200, headers=CORS_HEADERS)


# # ─────────────────────────────────────────────
# # Load Whisper once at startup
# # ─────────────────────────────────────────────
# print("Loading Whisper model…")
# whisper_model = whisper.load_model("base")   # swap to "small" for better Hindi accuracy
# print("Whisper ready.")

# sarvam = SarvamAI(api_subscription_key=API_KEY)


# # ─────────────────────────────────────────────
# # Helpers
# # ─────────────────────────────────────────────

# def translate_text(text: str, source_lang: str, target_lang: str) -> str:
#     """Translate via Sarvam. Returns original text on failure."""
#     if source_lang == target_lang:
#         return text
#     try:
#         resp = sarvam.text.translate(
#             input=text,
#             source_language_code=source_lang,
#             target_language_code=target_lang,
#             speaker_gender="Male",
#             mode="formal",
#             model="mayura:v1",
#             numerals_format="native",
#         )
#         return resp.translated_text
#     except Exception as e:
#         print(f"[TRANSLATE] {source_lang}→{target_lang} error:", e)
#         return text


# def ask_ollama(prompt: str) -> str:
#     """Query local Ollama llama3 and return the response string."""
#     system = (
#         "You are a helpful, empathetic Indian doctor assistant. "
#         "Answer in clear English in 2-3 short sentences. "
#         "Be direct and practical. No disclaimers."
#     )
#     try:
#         resp = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": f"{system}\n\nPatient: {prompt}\nDoctor:",
#                 "stream": False,
#             },
#             timeout=30,
#         )
#         resp.raise_for_status()
#         return resp.json().get("response", "").strip()
#     except Exception as e:
#         print("[OLLAMA] Error:", e)
#         return "I'm sorry, I couldn't process that right now. Please try again."


# def tts_stream(text: str, lang: str):
#     """Yield MP3 chunks from Sarvam TTS."""
#     speaker, lang_code = LANG_SPEAKERS.get(lang, ("shubh", "hi-IN"))
#     headers = {
#         "api-subscription-key": API_KEY,
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "text": text[:500],
#         "target_language_code": lang_code,
#         "speaker": speaker,
#         "model": "bulbul:v3",
#         "pace": 1.0,
#         "speech_sample_rate": 22050,
#         "output_audio_codec": "mp3",
#         "enable_preprocessing": True,
#     }
#     try:
#         resp = requests.post(TTS_URL, headers=headers, json=payload, stream=True)
#         resp.raise_for_status()
#         for chunk in resp.iter_content(chunk_size=8192):
#             if chunk:
#                 yield chunk
#     except Exception as e:
#         print("[TTS] Error:", e)
#         yield b""


# # ─────────────────────────────────────────────
# # Routes
# # ─────────────────────────────────────────────

# # ── 1. /stt  — audio file → transcribed text ──
# @app.post("/stt")
# async def speech_to_text(
#     file: UploadFile = File(...),
#     language: str = "hi-IN",
# ):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name

#     whisper_lang = language.split("-")[0]   # "hi-IN" → "hi"
#     result = whisper_model.transcribe(tmp_path, language=whisper_lang)
#     text = result.get("text", "").strip()
#     print(f"[STT] lang={language} → '{text}'")

#     return Response(
#         content=json.dumps({"text": text, "language": language}),
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )


# # ── 2. /chat — text → Ollama → translated reply ─
# class ChatRequest(BaseModel):
#     text: str
#     language: str = "hi-IN"


# @app.post("/chat")
# async def chat(body: ChatRequest):
#     user_lang = body.language
#     user_text = body.text
#     print(f"[CHAT] in ({user_lang}): {user_text}")

#     en_input = translate_text(user_text, source_lang=user_lang,  target_lang="en-IN")
#     en_reply = ask_ollama(en_input)
#     final    = translate_text(en_reply,  source_lang="en-IN",    target_lang=user_lang)

#     print(f"[CHAT] out ({user_lang}): {final}")

#     return Response(
#         content=json.dumps({"response": final}),
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )


# # ── 3. /tts  — text → streamed MP3 ────────────
# @app.get("/tts")
# def text_to_speech(
#     text: str = Query(...),
#     lang: str = Query("hi-IN"),
# ):
#     print(f"[TTS] lang={lang} text={text[:60]}…")
#     return StreamingResponse(
#         tts_stream(text, lang),
#         media_type="audio/mpeg",
#         headers=CORS_HEADERS,
#     )


# # ── 4. /health ─────────────────────────────────
# @app.get("/health")
# def health():
#     return Response(
#         content='{"status":"ok","whisper":"loaded","ollama":"localhost:11434"}',
#         media_type="application/json",
#         headers=CORS_HEADERS,
#     )

# NEW 4
import json
import shutil
import tempfile
import requests
import whisper
import base64
from fastapi import FastAPI, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from sarvamai import SarvamAI

# ─────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────
API_KEY = "sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D"   # move to .env later

# Updated Endpoint
TTS_URL = "https://api.sarvam.ai/text-to-speech"

LANG_SPEAKERS = {
    "hi-IN": ("meera",    "hi-IN"),
    "en-IN": ("meera",    "en-IN"),
    "bn-IN": ("meera",    "bn-IN"),
    "te-IN": ("meera",    "te-IN"),
    "ta-IN": ("meera",    "ta-IN"),
    "kn-IN": ("meera",    "kn-IN"),
    "ml-IN": ("meera",    "ml-IN"),
    "mr-IN": ("meera",    "mr-IN"),
    "gu-IN": ("meera",    "gu-IN"),
    "pa-IN": ("meera",    "pa-IN"),
    "od-IN": ("meera",    "od-IN"),
}

# ─────────────────────────────────────────────
# CORS — attached manually to every response
# so ngrok cannot strip them
# ─────────────────────────────────────────────
CORS_HEADERS = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age":       "86400",
}

# ─────────────────────────────────────────────
# App
# ─────────────────────────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.options("/{full_path:path}")
async def preflight_handler(full_path: str):
    return Response(status_code=200, headers=CORS_HEADERS)

# ─────────────────────────────────────────────
# Load Whisper once at startup
# ─────────────────────────────────────────────
print("Loading Whisper model…")
whisper_model = whisper.load_model("small")  # "small" is much better than "base" for Indian languages
print("Whisper ready.")

sarvam = SarvamAI(api_subscription_key=API_KEY)


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """Translate via Sarvam mayura. Falls back to original on error."""
    if source_lang == target_lang:
        return text
    try:
        resp = sarvam.text.translate(
            input=text,
            source_language_code=source_lang,
            target_language_code=target_lang,
            speaker_gender="Female",
            mode="formal",
            model="mayura:v1",
            numerals_format="native",
        )
        return resp.translated_text
    except Exception as e:
        print(f"[TRANSLATE] {source_lang}→{target_lang} error:", e)
        return text


def ask_ollama(prompt: str) -> str:
    """Query local Ollama llama3."""
    system = (
        "You are an experienced, pragmatic doctor consulting a patient."
        " When the patient describes their condition, briefly mention 1-2 possible common causes."
        " Then, immediately ask 1-2 highly specific follow-up questions about other related symptoms to narrow down the diagnosis. "
        "Speak directly, naturally, and professionally. Avoid dramatic roleplay, excessive pleasantries, and robotic AI disclaimers. "
        "Limit your response to 3-4 sentences."
    )
    try:
        resp = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": f"{system}\n\nPatient: {prompt}\nDoctor:",
                "stream": False,
            },
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json().get("response", "").strip()
    except Exception as e:
        print("[OLLAMA] Error:", e)
        return "I'm sorry, I couldn't process that right now. Please try again."


def get_tts_audio(text: str, lang: str) -> bytes:
    """
    Call Sarvam TTS endpoint — decodes the Base64 JSON response to raw bytes.
    """
    speaker = "anushka" # Updating speaker to a v2 compatible default
    lang_code = lang

    headers = {
        "api-subscription-key": API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": text[:500],
        "target_language_code": lang_code,
        "speaker": speaker,
        "model": "bulbul:v2", # Upgraded from the deprecated bulbul:v1
        "pace": 1.1,
        "speech_sample_rate": 22050,
    }

    try:
        # Removed stream=True since we are expecting a single JSON object
        resp = requests.post(TTS_URL, headers=headers, json=payload, timeout=30)
        
        if not resp.ok:
            print(f"[TTS] Failed: {resp.status_code} - {resp.text}")
            resp.raise_for_status()

        data = resp.json()
        
        if "audios" in data and len(data["audios"]) > 0:
            # Decode the base64 string provided in the JSON array
            audio_bytes = base64.b64decode(data["audios"][0])
            print(f"[TTS] Got {len(audio_bytes)} bytes of WAV data")
            return audio_bytes
        else:
            print("[TTS] API returned empty audio array")
            return b""

    except Exception as e:
        print("[TTS] Error:", e)
        return b""


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

# ── 1. /stt  — audio → text via Whisper ───────
@app.post("/stt")
async def speech_to_text(
    file: UploadFile = File(...),
    language: str = "hi-IN",
):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    # Pass language explicitly so Whisper doesn't auto-detect wrong language
    whisper_lang = language.split("-")[0]   # "hi-IN" → "hi"
    print(f"[STT] Transcribing with lang={whisper_lang}…")

    result = whisper_model.transcribe(
        tmp_path,
        language=whisper_lang,   # ← FORCES the language, no auto-detection
        task="transcribe",       # transcribe (not translate) keeps original language
        fp16=False,              # avoid fp16 warnings on CPU
    )
    text = result.get("text", "").strip()
    print(f"[STT] Result: '{text}'")

    return Response(
        content=json.dumps({"text": text, "language": language}),
        media_type="application/json",
        headers=CORS_HEADERS,
    )


# ── 2. /chat — text → Ollama → translated reply ─
class ChatRequest(BaseModel):
    text: str
    language: str = "hi-IN"


@app.post("/chat")
async def chat(body: ChatRequest):
    user_lang = body.language
    user_text = body.text
    print(f"[CHAT] in ({user_lang}): {user_text}")

    en_input = translate_text(user_text, source_lang=user_lang, target_lang="en-IN")
    print(f"[CHAT] → EN: {en_input}")

    en_reply = ask_ollama(en_input)
    print(f"[CHAT] Ollama: {en_reply}")

    final = translate_text(en_reply, source_lang="en-IN", target_lang=user_lang)
    print(f"[CHAT] → {user_lang}: {final}")

    return Response(
        content=json.dumps({"response": final}),
        media_type="application/json",
        headers=CORS_HEADERS,
    )


# ── 3. /tts  — text → WAV audio bytes ─────────
@app.get("/tts")
def text_to_speech(
    text: str = Query(...),
    lang: str = Query("hi-IN"),
):
    print(f"[TTS] lang={lang} text={text[:60]}…")
    audio_bytes = get_tts_audio(text, lang)

    if not audio_bytes:
        return Response(
            content=json.dumps({"error": "TTS failed"}),
            media_type="application/json",
            status_code=500,
            headers=CORS_HEADERS,
        )

    return Response(
        content=audio_bytes,
        media_type="audio/wav",      # Changed to audio/wav for bulbul:v2 defaults
        headers={
            **CORS_HEADERS,
            "Content-Length": str(len(audio_bytes)),
            "Accept-Ranges": "bytes",
        },
    )


# ── 4. /health ─────────────────────────────────
@app.get("/health")
def health():
    return Response(
        content='{"status":"ok","whisper":"small","ollama":"localhost:11434"}',
        media_type="application/json",
        headers=CORS_HEADERS,
    )