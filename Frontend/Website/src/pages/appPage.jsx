// import React, { useState, useRef } from 'react';

// export default function VoiceAppPage() {
//   // App States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [languageCode, setLanguageCode] = useState('hi-IN');
//   const [displayText, setDisplayText] = useState('Tap the microphone and tell me how you are feeling.');

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   // const sendAudioToBackend = async (blob) => {
//   //   setAppState('processing');
//   //   setDisplayText('Translating and thinking...');
    
//   //   const formData = new FormData();
//   //   // FIX 1: Name the key "file" (Verify this matches your backend FastAPI parameter!)
//   //   formData.append("file", blob, "user_voice.webm");
    
//   //   // FIX 2: Send the language code to the backend so Sarvam knows what to expect
//   //   formData.append("language", languageCode); 

//   //   try {
//   //       // Replace with your actual local backend URL, e.g., "http://localhost:8000/api/chat"
//   //       const response = await fetch("http://localhost:8000/api/chat", {
//   //           method: "POST",
//   //           body: formData,
//   //       });

// const sendAudioToBackend = async () => {
//   setAppState('processing');
//   setDisplayText('Thinking...');

//   try {
//     const userText = "I have a headache";

//     const response = await fetch(
//       `https://ganglionate-unconvincedly-perla.ngrok-free.dev/tts?text=${encodeURIComponent(userText)}`
//     );

//     if (!response.ok) throw new Error("Backend failed");

//     const audioBlob = await response.blob();
//     const audioUrl = URL.createObjectURL(audioBlob);

//     const audio = new Audio(audioUrl);

//     audio.onplay = () => {
//       setAppState('speaking');
//       setDisplayText('AI is responding...');
//     };

//     audio.onended = () => {
//       setAppState('idle');
//       setDisplayText('Tap the microphone to reply.');
//     };

//     audio.play();

//   } catch (e) {
//     console.error(e);
//     setAppState('idle');
//     setDisplayText('Connection failed.');
//   }
// };

//   const startRecording = async () => {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = mediaRecorder;
//         audioChunksRef.current = [];

//         mediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 audioChunksRef.current.push(event.data);
//             }
//         }

//         mediaRecorder.onstop = async () => {
//             const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//             stream.getTracks().forEach(track => track.stop());
//             await sendAudioToBackend(audioBlob);
//         }

//         mediaRecorder.start();
//         setAppState('listening');
//         setDisplayText('Listening...');
//     } catch (e) {
//         console.error("Mic access denied", e); 
//         alert("Give permission to access mic");
//         setAppState('idle');
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && appState === 'listening') {
//         mediaRecorderRef.current.stop();
//         // State changes to 'processing' inside sendAudioToBackend
//     }
//   }

//   // --- STYLES ---
//   const colors = {
//     bg: '#ffffff',
//     primary: '#10b981', // Emerald green
//     primaryGlow: 'rgba(16, 185, 129, 0.4)',
//     textDark: '#0f172a',
//     textLight: '#64748b',
//     surface: '#f8fafc',
//     border: '#e2e8f0'
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       backgroundColor: colors.bg,
//       fontFamily: '"Inter", -apple-system, sans-serif',
//       color: colors.textDark,
//       overflow: 'hidden'
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '20px 30px',
//       zIndex: 10
//     },
//     brand: {
//       fontSize: '20px',
//       fontWeight: 'bold',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     select: {
//       padding: '10px 16px',
//       borderRadius: '20px',
//       border: `1px solid ${colors.border}`,
//       backgroundColor: colors.surface,
//       fontSize: '15px',
//       fontWeight: '600',
//       cursor: 'pointer',
//       outline: 'none'
//     },
//     main: {
//       flex: 1,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '20px',
//       position: 'relative'
//     },
//     micButtonWrapper: {
//       position: 'relative',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: '200px',
//       height: '200px',
//       marginBottom: '40px'
//     },
//     micButton: {
//       width: '120px',
//       height: '120px',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       color: 'white',
//       border: 'none',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       boxShadow: `0 10px 25px ${appState === 'listening' ? 'rgba(239, 68, 68, 0.4)' : colors.primaryGlow}`,
//       zIndex: 2,
//       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//       transform: appState === 'listening' ? 'scale(1.1)' : 'scale(1)',
//     },
//     ripple: {
//       position: 'absolute',
//       width: '100%',
//       height: '100%',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       opacity: 0,
//       zIndex: 1,
//       animation: appState === 'listening' 
//         ? 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' 
//         : appState === 'speaking' 
//         ? 'wave-ring 2s ease-in-out infinite alternate' 
//         : 'none',
//     },
//     statusText: {
//       fontSize: '16px',
//       fontWeight: 'bold',
//       color: appState === 'listening' ? '#ef4444' : colors.primary,
//       textTransform: 'uppercase',
//       letterSpacing: '2px',
//       marginBottom: '16px',
//       transition: 'opacity 0.3s ease',
//       opacity: appState === 'idle' ? 0.5 : 1
//     },
//     subtitleBox: {
//       maxWidth: '600px',
//       width: '100%',
//       textAlign: 'center',
//       minHeight: '120px'
//     },
//     subtitleText: {
//       fontSize: '28px',
//       lineHeight: '1.4',
//       fontWeight: '500',
//       color: colors.textDark,
//       transition: 'all 0.3s ease',
//     }
//   };

//   const getIcon = () => {
//     if (appState === 'processing') {
//       return <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />;
//     }
//     if (appState === 'speaking') {
//       return (
//         <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
//         </svg>
//       );
//     }
//     return (
//       <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//       </svg>
//     );
//   };

//   return (
//     <div style={styles.container}>
//       <style>
//         {`
//           @keyframes pulse-ring {
//             0% { transform: scale(0.8); opacity: 0.5; }
//             100% { transform: scale(1.8); opacity: 0; }
//           }
//           @keyframes wave-ring {
//             0% { transform: scale(1); opacity: 0.2; }
//             100% { transform: scale(1.3); opacity: 0.1; }
//           }
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>

//       <header style={styles.header}>
//         <div style={styles.brand}>
//           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.primary }}></div>
//           CareIndia AI
//         </div>
//         {/* FIX 4: Bind value to languageCode so it updates visually */}
//         <select style={styles.select} value={languageCode} onChange={(e) => setLanguageCode(e.target.value)}>
//           <option value="hi-IN">हिंदी (Hindi)</option>
//           <option value="en-IN">English</option>
//           <option value="bn-IN">বাংলা (Bengali)</option>
//           <option value="te-IN">తెలుగు (Telugu)</option>
//           <option value="ta-IN">தமிழ் (Tamil)</option>
//           <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
//           <option value="ml-IN">മലയാളം (Malayalam)</option>
//           <option value="mr-IN">मराठी (Marathi)</option>
//           <option value="gu-IN">ગુજરાતી (Gujarati)</option>
//           <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
//           <option value="od-IN">ଓଡ଼ିଆ (Odia)</option>
//         </select>
//       </header>

//       <main style={styles.main}>
        
//         <div style={styles.statusText}>
//           {appState === 'idle' && 'Tap to Speak'}
//           {appState === 'listening' && 'Listening...'}
//           {appState === 'processing' && 'Translating...'}
//           {appState === 'speaking' && 'AI Responding'}
//         </div>

//         <div style={styles.micButtonWrapper}>
//           <div style={styles.ripple}></div>
//           <button 
//             onClick={() => sendAudioToBackend()} 
//             style={styles.micButton}
//             disabled={appState === 'processing'}
//           >
//             {getIcon()}
//           </button>
//         </div>

//         <div style={styles.subtitleBox}>
//           <p style={{
//             ...styles.subtitleText,
//             color: appState === 'listening' ? colors.textLight : colors.textDark,
//             fontSize: displayText.length > 80 ? '22px' : '28px'
//           }}>
//             {displayText}
//           </p>
//         </div>

//       </main>
//     </div>
//   );
// }



// NEW 1

// import React, { useState } from 'react';

// export default function VoiceAppPage() {
//   const [appState, setAppState] = useState('idle');
//   const [languageCode, setLanguageCode] = useState('hi-IN');
//   const [displayText, setDisplayText] = useState(
//     'Tap the microphone and tell me how you are feeling.'
//   );

//   // 🎤 Speech-to-Text
//   const startSpeechToText = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech recognition not supported in this browser");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = languageCode;
//     recognition.interimResults = false;

//     recognition.onstart = () => {
//       setAppState("listening");
//       setDisplayText("Listening...");
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log("User:", transcript);

//       setDisplayText(`You: ${transcript}`);
//       sendTextToBackend(transcript);
//     };

//     recognition.onerror = (e) => {
//       console.error(e);
//       setAppState("idle");
//       setDisplayText("Error capturing speech.");
//     };

//     recognition.start();
//   };

//   // 🔊 Send text → backend → play audio
//   const sendTextToBackend = async (text) => {
//     try {
//       setAppState("processing");
//       setDisplayText("Thinking...");

//       const audio = new Audio(
//         `https://ganglionate-unconvincedly-perla.ngrok-free.dev/tts?text=${encodeURIComponent(text)}`
//       );

//       audio.onplay = () => {
//         setAppState("speaking");
//         setDisplayText("AI is responding...");
//       };

//       audio.onended = () => {
//         setAppState("idle");
//         setDisplayText("Tap the microphone to reply.");
//       };

//       await audio.play();

//     } catch (e) {
//       console.error(e);
//       setAppState("idle");
//       setDisplayText("Connection failed.");
//     }
//   };

//   // 🎨 Styles
//   const colors = {
//     bg: '#ffffff',
//     primary: '#10b981',
//     primaryGlow: 'rgba(16, 185, 129, 0.4)',
//     textDark: '#0f172a',
//     textLight: '#64748b',
//     surface: '#f8fafc',
//     border: '#e2e8f0'
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       backgroundColor: colors.bg,
//       fontFamily: '"Inter", sans-serif',
//       color: colors.textDark
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       padding: '20px'
//     },
//     main: {
//       flex: 1,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     button: {
//       width: '120px',
//       height: '120px',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       color: 'white',
//       border: 'none',
//       fontSize: '20px',
//       cursor: 'pointer'
//     },
//     text: {
//       marginTop: '20px',
//       fontSize: '20px',
//       textAlign: 'center',
//       maxWidth: '600px'
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <h2>CareIndia AI</h2>

//         <select
//           value={languageCode}
//           onChange={(e) => setLanguageCode(e.target.value)}
//         >
//           <option value="hi-IN">Hindi</option>
//           <option value="en-IN">English</option>
//         </select>
//       </header>

//       <main style={styles.main}>
//         <button
//           style={styles.button}
//           onClick={startSpeechToText}
//           disabled={appState === "processing"}
//         >
//           🎤
//         </button>

//         <p style={styles.text}>{displayText}</p>
//       </main>
//     </div>
//   );
// }

// NEW 2
// import React, { useState, useRef, useEffect } from 'react';

// const BACKEND_URL = 'https://ganglionate-unconvincedly-perla.ngrok-free.app';

// const LANGUAGES = [
//   { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
//   { code: 'en-IN', label: 'English', name: 'English' },
//   { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
//   { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
//   { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
//   { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
//   { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
//   { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
//   { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
//   { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
//   { code: 'od-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
// ];

// // ── Waveform bars rendered as SVG ──────────────────────────────────────────
// function Waveform({ active, color = '#16a34a' }) {
//   const bars = 28;
//   return (
//     <svg width="120" height="36" viewBox={`0 0 ${bars * 5 - 1} 36`} style={{ display: 'block' }}>
//       {Array.from({ length: bars }).map((_, i) => {
//         const h = active
//           ? 8 + Math.abs(Math.sin((i / bars) * Math.PI * 3)) * 22
//           : 4;
//         const y = (36 - h) / 2;
//         return (
//           <rect
//             key={i}
//             x={i * 5}
//             y={y}
//             width={3}
//             height={h}
//             rx={1.5}
//             fill={color}
//             opacity={active ? 1 : 0.3}
//             style={{
//               transition: 'height 0.15s ease, y 0.15s ease',
//               animationDelay: `${i * 0.04}s`,
//             }}
//           />
//         );
//       })}
//     </svg>
//   );
// }

// // ── Mic SVG Icon ───────────────────────────────────────────────────────────
// function MicIcon({ size = 32, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="2" width="6" height="12" rx="3" />
//       <path d="M5 10a7 7 0 0 0 14 0" />
//       <line x1="12" y1="19" x2="12" y2="22" />
//       <line x1="8" y1="22" x2="16" y2="22" />
//     </svg>
//   );
// }

// function StopIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
//       <rect x="5" y="5" width="14" height="14" rx="2" />
//     </svg>
//   );
// }

// function SpeakerIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//     </svg>
//   );
// }

// // ── Spinner ────────────────────────────────────────────────────────────────
// function Spinner({ size = 28, color = 'white' }) {
//   return (
//     <div style={{
//       width: size, height: size,
//       border: `3px solid rgba(255,255,255,0.25)`,
//       borderTop: `3px solid ${color}`,
//       borderRadius: '50%',
//       animation: 'spin 0.85s linear infinite',
//     }} />
//   );
// }

// // ── Message Bubble ─────────────────────────────────────────────────────────
// function Bubble({ role, text }) {
//   const isUser = role === 'user';
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: isUser ? 'flex-end' : 'flex-start',
//       marginBottom: '10px',
//     }}>
//       <div style={{
//         maxWidth: '72%',
//         padding: '10px 14px',
//         borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//         background: isUser ? '#16a34a' : '#f1f5f9',
//         color: isUser ? '#fff' : '#0f172a',
//         fontSize: '15px',
//         lineHeight: '1.5',
//         fontFamily: "'DM Sans', sans-serif",
//         letterSpacing: '-0.01em',
//       }}>
//         {text}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function AppPage() {
//   // States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [language, setLanguage] = useState(LANGUAGES[0]);
//   const [messages, setMessages] = useState([]);
//   const [statusMsg, setStatusMsg] = useState('Tap the mic and speak');
//   const [animFrame, setAnimFrame] = useState(0);
//   const [showLangPicker, setShowLangPicker] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const animRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const currentAudioRef = useRef(null);

//   // ── Waveform animation loop while listening ──────────────────────────────
//   useEffect(() => {
//     if (appState === 'listening' || appState === 'speaking') {
//       animRef.current = setInterval(() => {
//         setAnimFrame(f => f + 1);
//       }, 120);
//     } else {
//       clearInterval(animRef.current);
//     }
//     return () => clearInterval(animRef.current);
//   }, [appState]);

//   // ── Auto-scroll messages ─────────────────────────────────────────────────
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ── Start recording ──────────────────────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
//       audioChunksRef.current = [];

//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';

//       const recorder = new MediaRecorder(stream, { mimeType });
//       mediaRecorderRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       recorder.onstop = async () => {
//         const blob = new Blob(audioChunksRef.current, { type: mimeType });
//         streamRef.current?.getTracks().forEach(t => t.stop());
//         await sendAudioToBackend(blob);
//       };

//       recorder.start(250);
//       setAppState('listening');
//       setStatusMsg('Listening… tap again to send');
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatusMsg('Microphone access denied.');
//     }
//   };

//   // ── Stop recording ───────────────────────────────────────────────────────
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       setAppState('processing');
//       setStatusMsg('Transcribing with Sarvam AI…');
//     }
//   };

//   // ── Full pipeline: audio → STT → Ollama → TTS → play ────────────────────
//   const sendAudioToBackend = async (blob) => {
//     try {
//       // Step 1 — STT via Sarvam
//       setStatusMsg('Transcribing with Sarvam AI…');
//       const formData = new FormData();
//       formData.append('file', blob, 'voice.webm');
//       formData.append('language', language.code);

//       const sttRes = await fetch(`${BACKEND_URL}/stt`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!sttRes.ok) throw new Error(`STT failed: ${sttRes.status}`);
//       const { text: userText } = await sttRes.json();

//       setMessages(prev => [...prev, { role: 'user', text: userText }]);

//       // Step 2 — Ollama (translate → respond → translate back) via backend
//       setStatusMsg('Ollama is thinking…');
//       const chatRes = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: userText, language: language.code }),
//       });

//       if (!chatRes.ok) throw new Error(`Chat failed: ${chatRes.status}`);
//       const { response: aiText } = await chatRes.json();

//       setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

//       // Step 3 — TTS via Sarvam → play audio
//       setStatusMsg('Generating voice response…');
//       const ttsRes = await fetch(
//         `${BACKEND_URL}/tts?text=${encodeURIComponent(aiText)}&lang=${language.code}`
//       );

//       if (!ttsRes.ok) throw new Error(`TTS failed: ${ttsRes.status}`);
//       const audioBlob = await ttsRes.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       currentAudioRef.current = audio;

//       audio.onplay = () => {
//         setAppState('speaking');
//         setStatusMsg('Playing AI response…');
//       };
//       audio.onended = () => {
//         setAppState('idle');
//         setStatusMsg('Tap the mic to reply');
//         URL.revokeObjectURL(audioUrl);
//       };
//       audio.onerror = () => {
//         setAppState('idle');
//         setStatusMsg('Audio playback failed.');
//       };

//       await audio.play();

//     } catch (err) {
//       console.error('Pipeline error:', err);
//       setAppState('idle');
//       setStatusMsg(`Error: ${err.message}`);
//     }
//   };

//   // ── Stop speaking ────────────────────────────────────────────────────────
//   const stopSpeaking = () => {
//     currentAudioRef.current?.pause();
//     setAppState('idle');
//     setStatusMsg('Tap the mic to speak');
//   };

//   // ── Mic button handler ───────────────────────────────────────────────────
//   const handleMicClick = () => {
//     if (appState === 'processing') return;
//     if (appState === 'speaking') { stopSpeaking(); return; }
//     if (appState === 'listening') { stopRecording(); return; }
//     startRecording();
//   };

//   // ── Derived UI values ────────────────────────────────────────────────────
//   const btnColor =
//     appState === 'listening' ? '#dc2626' :
//     appState === 'speaking'  ? '#2563eb' :
//     appState === 'processing'? '#6b7280' :
//     '#16a34a';

//   const ringColor =
//     appState === 'listening' ? 'rgba(220,38,38,0.35)' :
//     appState === 'speaking'  ? 'rgba(37,99,235,0.3)' :
//     'transparent';

//   const ringActive = appState === 'listening' || appState === 'speaking';

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       background: '#ffffff',
//       fontFamily: "'DM Sans', 'Inter', sans-serif",
//       color: '#0f172a',
//       overflow: 'hidden',
//     }}>

//       {/* ── Keyframes injected once ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes ring-pulse {
//           0%   { transform: scale(1);   opacity: 0.7; }
//           100% { transform: scale(1.65); opacity: 0;   }
//         }
//         @keyframes ring-pulse2 {
//           0%   { transform: scale(1);   opacity: 0.45; }
//           100% { transform: scale(1.45); opacity: 0;   }
//         }
//         @keyframes bar-bounce {
//           0%, 100% { transform: scaleY(1); }
//           50%       { transform: scaleY(1.7); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0);   }
//         }
//         .lang-option:hover { background: #f0fdf4 !important; }
//       `}</style>

//       {/* ── Header ── */}
//       <header style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '14px 20px',
//         borderBottom: '1px solid #e2e8f0',
//         flexShrink: 0,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{
//             width: 10, height: 10, borderRadius: '50%',
//             background: '#16a34a',
//             boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
//           }} />
//           <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>
//             CareIndia AI
//           </span>
//         </div>

//         {/* Language picker */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setShowLangPicker(p => !p)}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 6,
//               padding: '7px 14px',
//               border: '1px solid #d1d5db',
//               borderRadius: 20,
//               background: '#f9fafb',
//               cursor: 'pointer',
//               fontSize: 14,
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 500,
//               color: '#374151',
//             }}
//           >
//             <span>{language.label}</span>
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//               stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </button>

//           {showLangPicker && (
//             <div style={{
//               position: 'absolute', right: 0, top: 'calc(100% + 6px)',
//               background: '#fff',
//               border: '1px solid #e2e8f0',
//               borderRadius: 12,
//               boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
//               zIndex: 100,
//               overflow: 'hidden',
//               minWidth: 180,
//               animation: 'fadeUp 0.15s ease',
//             }}>
//               {LANGUAGES.map(lang => (
//                 <div
//                   key={lang.code}
//                   className="lang-option"
//                   onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
//                   style={{
//                     padding: '10px 16px',
//                     cursor: 'pointer',
//                     fontSize: 14,
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     background: lang.code === language.code ? '#f0fdf4' : '#fff',
//                     color: lang.code === language.code ? '#16a34a' : '#374151',
//                     fontWeight: lang.code === language.code ? 600 : 400,
//                     transition: 'background 0.1s',
//                   }}
//                 >
//                   <span style={{ fontSize: 16 }}>{lang.label}</span>
//                   <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang.name}</span>
//                   {lang.code === language.code && (
//                     <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* ── Chat transcript ── */}
//       <div style={{
//         flex: 1,
//         overflowY: 'auto',
//         padding: '16px 20px',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {messages.length === 0 && (
//           <div style={{
//             flex: 1, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             color: '#94a3b8', textAlign: 'center', gap: 8,
//           }}>
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
//               stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
//               <rect x="9" y="2" width="6" height="12" rx="3" />
//               <path d="M5 10a7 7 0 0 0 14 0" />
//               <line x1="12" y1="19" x2="12" y2="22" />
//               <line x1="8" y1="22" x2="16" y2="22" />
//             </svg>
//             <p style={{ fontSize: 15, margin: 0 }}>Your conversation will appear here</p>
//             <p style={{ fontSize: 13, margin: 0 }}>Speak in <strong style={{ color: '#16a34a' }}>{language.name}</strong></p>
//           </div>
//         )}

//         {messages.map((msg, i) => (
//           <div key={i} style={{ animation: 'fadeUp 0.2s ease' }}>
//             <Bubble role={msg.role} text={msg.text} />
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ── Pipeline status pill ── */}
//       <div style={{
//         display: 'flex', justifyContent: 'center',
//         padding: '4px 0 2px',
//         flexShrink: 0,
//       }}>
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 6,
//           padding: '5px 14px',
//           borderRadius: 999,
//           background: '#f1f5f9',
//           fontSize: 12,
//           color: '#64748b',
//           fontFamily: "'DM Mono', monospace",
//           letterSpacing: '0.02em',
//         }}>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam STT</span>
//           <span>→</span>
//           <span style={{ color: '#2563eb', fontWeight: 600 }}>Ollama</span>
//           <span>→</span>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam TTS</span>
//         </div>
//       </div>

//       {/* ── Bottom control zone ── */}
//       <div style={{
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: '20px 20px 32px',
//         gap: 16,
//         borderTop: '1px solid #f1f5f9',
//       }}>
//         {/* Waveform — shown when listening or speaking */}
//         <div style={{
//           height: 36,
//           opacity: (appState === 'listening' || appState === 'speaking') ? 1 : 0,
//           transition: 'opacity 0.3s',
//         }}>
//           <Waveform
//             active={appState === 'listening' || appState === 'speaking'}
//             color={appState === 'speaking' ? '#2563eb' : '#dc2626'}
//             key={animFrame}
//           />
//         </div>

//         {/* Status text */}
//         <p style={{
//           margin: 0,
//           fontSize: 13,
//           color: '#64748b',
//           letterSpacing: '-0.01em',
//           textAlign: 'center',
//           minHeight: 18,
//           transition: 'color 0.2s',
//         }}>
//           {statusMsg}
//         </p>

//         {/* Mic button with ring animations */}
//         <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           {/* Outer ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse 1.4s ease-out infinite',
//               zIndex: 0,
//             }} />
//           )}
//           {/* Inner ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse2 1.4s ease-out 0.45s infinite',
//               zIndex: 0,
//             }} />
//           )}

//           <button
//             onClick={handleMicClick}
//             disabled={appState === 'processing'}
//             style={{
//               position: 'relative', zIndex: 1,
//               width: 72, height: 72,
//               borderRadius: '50%',
//               background: btnColor,
//               border: 'none',
//               cursor: appState === 'processing' ? 'not-allowed' : 'pointer',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               transition: 'background 0.25s, transform 0.15s',
//               transform: appState === 'listening' ? 'scale(1.08)' : 'scale(1)',
//               boxShadow: `0 4px 20px ${btnColor}55`,
//             }}
//           >
//             {appState === 'processing' && <Spinner size={26} />}
//             {appState === 'listening' && <StopIcon size={26} />}
//             {appState === 'speaking'  && <SpeakerIcon size={26} />}
//             {appState === 'idle'      && <MicIcon size={30} />}
//           </button>
//         </div>

//         {/* Tap hint */}
//         <p style={{
//           margin: 0,
//           fontSize: 11,
//           color: '#cbd5e1',
//           letterSpacing: '0.04em',
//           textTransform: 'uppercase',
//         }}>
//           {appState === 'idle'       && 'Tap to start speaking'}
//           {appState === 'listening'  && 'Tap to stop & send'}
//           {appState === 'processing' && 'Processing…'}
//           {appState === 'speaking'   && 'Tap to stop'}
//         </p>
//       </div>

//       {/* Click outside to close lang picker */}
//       {showLangPicker && (
//         <div
//           onClick={() => setShowLangPicker(false)}
//           style={{ position: 'fixed', inset: 0, zIndex: 99 }}
//         />
//       )}
//     </div>
//   );
// }

// //NEW3
// import React, { useState, useRef, useEffect } from 'react';

// // Relative URL → Vite proxy rewrites to ngrok. No cross-origin = no CORS preflight.
// const BACKEND_URL = '';

// const LANGUAGES = [
//   { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
//   { code: 'en-IN', label: 'English', name: 'English' },
//   { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
//   { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
//   { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
//   { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
//   { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
//   { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
//   { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
//   { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
//   { code: 'od-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
// ];

// // ── Waveform bars rendered as SVG ──────────────────────────────────────────
// function Waveform({ active, color = '#16a34a' }) {
//   const bars = 28;
//   return (
//     <svg width="120" height="36" viewBox={`0 0 ${bars * 5 - 1} 36`} style={{ display: 'block' }}>
//       {Array.from({ length: bars }).map((_, i) => {
//         const h = active
//           ? 8 + Math.abs(Math.sin((i / bars) * Math.PI * 3)) * 22
//           : 4;
//         const y = (36 - h) / 2;
//         return (
//           <rect
//             key={i}
//             x={i * 5}
//             y={y}
//             width={3}
//             height={h}
//             rx={1.5}
//             fill={color}
//             opacity={active ? 1 : 0.3}
//             style={{
//               transition: 'height 0.15s ease, y 0.15s ease',
//               animationDelay: `${i * 0.04}s`,
//             }}
//           />
//         );
//       })}
//     </svg>
//   );
// }

// // ── Mic SVG Icon ───────────────────────────────────────────────────────────
// function MicIcon({ size = 32, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="2" width="6" height="12" rx="3" />
//       <path d="M5 10a7 7 0 0 0 14 0" />
//       <line x1="12" y1="19" x2="12" y2="22" />
//       <line x1="8" y1="22" x2="16" y2="22" />
//     </svg>
//   );
// }

// function StopIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
//       <rect x="5" y="5" width="14" height="14" rx="2" />
//     </svg>
//   );
// }

// function SpeakerIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//     </svg>
//   );
// }

// // ── Spinner ────────────────────────────────────────────────────────────────
// function Spinner({ size = 28, color = 'white' }) {
//   return (
//     <div style={{
//       width: size, height: size,
//       border: `3px solid rgba(255,255,255,0.25)`,
//       borderTop: `3px solid ${color}`,
//       borderRadius: '50%',
//       animation: 'spin 0.85s linear infinite',
//     }} />
//   );
// }

// // ── Message Bubble ─────────────────────────────────────────────────────────
// function Bubble({ role, text }) {
//   const isUser = role === 'user';
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: isUser ? 'flex-end' : 'flex-start',
//       marginBottom: '10px',
//     }}>
//       <div style={{
//         maxWidth: '72%',
//         padding: '10px 14px',
//         borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//         background: isUser ? '#16a34a' : '#f1f5f9',
//         color: isUser ? '#fff' : '#0f172a',
//         fontSize: '15px',
//         lineHeight: '1.5',
//         fontFamily: "'DM Sans', sans-serif",
//         letterSpacing: '-0.01em',
//       }}>
//         {text}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function AppPage() {
//   // States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [language, setLanguage] = useState(LANGUAGES[0]);
//   const [messages, setMessages] = useState([]);
//   const [statusMsg, setStatusMsg] = useState('Tap the mic and speak');
//   const [animFrame, setAnimFrame] = useState(0);
//   const [showLangPicker, setShowLangPicker] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const animRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const currentAudioRef = useRef(null);

//   // ── Waveform animation loop while listening ──────────────────────────────
//   useEffect(() => {
//     if (appState === 'listening' || appState === 'speaking') {
//       animRef.current = setInterval(() => {
//         setAnimFrame(f => f + 1);
//       }, 120);
//     } else {
//       clearInterval(animRef.current);
//     }
//     return () => clearInterval(animRef.current);
//   }, [appState]);

//   // ── Auto-scroll messages ─────────────────────────────────────────────────
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ── Start recording ──────────────────────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
//       audioChunksRef.current = [];

//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';

//       const recorder = new MediaRecorder(stream, { mimeType });
//       mediaRecorderRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       recorder.onstop = async () => {
//         const blob = new Blob(audioChunksRef.current, { type: mimeType });
//         streamRef.current?.getTracks().forEach(t => t.stop());
//         await sendAudioToBackend(blob);
//       };

//       recorder.start(250);
//       setAppState('listening');
//       setStatusMsg('Listening… tap again to send');
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatusMsg('Microphone access denied.');
//     }
//   };

//   // ── Stop recording ───────────────────────────────────────────────────────
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       setAppState('processing');
//       setStatusMsg('Transcribing with Sarvam AI…');
//     }
//   };

//   // ── Full pipeline: audio → STT → Ollama → TTS → play ────────────────────
//   const sendAudioToBackend = async (blob) => {
//     try {
//       // Step 1 — STT via Sarvam
//       setStatusMsg('Transcribing with Sarvam AI…');
//       const formData = new FormData();
//       formData.append('file', blob, 'voice.webm');
//       formData.append('language', language.code);

//       const sttRes = await fetch(`${BACKEND_URL}/stt`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!sttRes.ok) throw new Error(`STT failed: ${sttRes.status}`);
//       const { text: userText } = await sttRes.json();

//       setMessages(prev => [...prev, { role: 'user', text: userText }]);

//       // Step 2 — Ollama (translate → respond → translate back) via backend
//       setStatusMsg('Ollama is thinking…');
//       const chatRes = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: userText, language: language.code }),
//       });

//       if (!chatRes.ok) throw new Error(`Chat failed: ${chatRes.status}`);
//       const { response: aiText } = await chatRes.json();

//       setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

//       // Step 3 — TTS via Sarvam → play audio
//       setStatusMsg('Generating voice response…');
//       const ttsRes = await fetch(
//         `${BACKEND_URL}/tts?text=${encodeURIComponent(aiText)}&lang=${language.code}`,
// {}
//       );

//       if (!ttsRes.ok) throw new Error(`TTS failed: ${ttsRes.status}`);
//       const audioBlob = await ttsRes.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       currentAudioRef.current = audio;

//       audio.onplay = () => {
//         setAppState('speaking');
//         setStatusMsg('Playing AI response…');
//       };
//       audio.onended = () => {
//         setAppState('idle');
//         setStatusMsg('Tap the mic to reply');
//         URL.revokeObjectURL(audioUrl);
//       };
//       audio.onerror = () => {
//         setAppState('idle');
//         setStatusMsg('Audio playback failed.');
//       };

//       await audio.play();

//     } catch (err) {
//       console.error('Pipeline error:', err);
//       setAppState('idle');
//       setStatusMsg(`Error: ${err.message}`);
//     }
//   };

//   // ── Stop speaking ────────────────────────────────────────────────────────
//   const stopSpeaking = () => {
//     currentAudioRef.current?.pause();
//     setAppState('idle');
//     setStatusMsg('Tap the mic to speak');
//   };

//   // ── Mic button handler ───────────────────────────────────────────────────
//   const handleMicClick = () => {
//     if (appState === 'processing') return;
//     if (appState === 'speaking') { stopSpeaking(); return; }
//     if (appState === 'listening') { stopRecording(); return; }
//     startRecording();
//   };

//   // ── Derived UI values ────────────────────────────────────────────────────
//   const btnColor =
//     appState === 'listening' ? '#dc2626' :
//     appState === 'speaking'  ? '#2563eb' :
//     appState === 'processing'? '#6b7280' :
//     '#16a34a';

//   const ringColor =
//     appState === 'listening' ? 'rgba(220,38,38,0.35)' :
//     appState === 'speaking'  ? 'rgba(37,99,235,0.3)' :
//     'transparent';

//   const ringActive = appState === 'listening' || appState === 'speaking';

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       background: '#ffffff',
//       fontFamily: "'DM Sans', 'Inter', sans-serif",
//       color: '#0f172a',
//       overflow: 'hidden',
//     }}>

//       {/* ── Keyframes injected once ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes ring-pulse {
//           0%   { transform: scale(1);   opacity: 0.7; }
//           100% { transform: scale(1.65); opacity: 0;   }
//         }
//         @keyframes ring-pulse2 {
//           0%   { transform: scale(1);   opacity: 0.45; }
//           100% { transform: scale(1.45); opacity: 0;   }
//         }
//         @keyframes bar-bounce {
//           0%, 100% { transform: scaleY(1); }
//           50%       { transform: scaleY(1.7); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0);   }
//         }
//         .lang-option:hover { background: #f0fdf4 !important; }
//       `}</style>

//       {/* ── Header ── */}
//       <header style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '14px 20px',
//         borderBottom: '1px solid #e2e8f0',
//         flexShrink: 0,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{
//             width: 10, height: 10, borderRadius: '50%',
//             background: '#16a34a',
//             boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
//           }} />
//           <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>
//             CareIndia AI
//           </span>
//         </div>

//         {/* Language picker */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setShowLangPicker(p => !p)}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 6,
//               padding: '7px 14px',
//               border: '1px solid #d1d5db',
//               borderRadius: 20,
//               background: '#f9fafb',
//               cursor: 'pointer',
//               fontSize: 14,
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 500,
//               color: '#374151',
//             }}
//           >
//             <span>{language.label}</span>
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//               stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </button>

//           {showLangPicker && (
//             <div style={{
//               position: 'absolute', right: 0, top: 'calc(100% + 6px)',
//               background: '#fff',
//               border: '1px solid #e2e8f0',
//               borderRadius: 12,
//               boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
//               zIndex: 100,
//               overflow: 'hidden',
//               minWidth: 180,
//               animation: 'fadeUp 0.15s ease',
//             }}>
//               {LANGUAGES.map(lang => (
//                 <div
//                   key={lang.code}
//                   className="lang-option"
//                   onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
//                   style={{
//                     padding: '10px 16px',
//                     cursor: 'pointer',
//                     fontSize: 14,
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     background: lang.code === language.code ? '#f0fdf4' : '#fff',
//                     color: lang.code === language.code ? '#16a34a' : '#374151',
//                     fontWeight: lang.code === language.code ? 600 : 400,
//                     transition: 'background 0.1s',
//                   }}
//                 >
//                   <span style={{ fontSize: 16 }}>{lang.label}</span>
//                   <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang.name}</span>
//                   {lang.code === language.code && (
//                     <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* ── Chat transcript ── */}
//       <div style={{
//         flex: 1,
//         overflowY: 'auto',
//         padding: '16px 20px',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {messages.length === 0 && (
//           <div style={{
//             flex: 1, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             color: '#94a3b8', textAlign: 'center', gap: 8,
//           }}>
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
//               stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
//               <rect x="9" y="2" width="6" height="12" rx="3" />
//               <path d="M5 10a7 7 0 0 0 14 0" />
//               <line x1="12" y1="19" x2="12" y2="22" />
//               <line x1="8" y1="22" x2="16" y2="22" />
//             </svg>
//             <p style={{ fontSize: 15, margin: 0 }}>Your conversation will appear here</p>
//             <p style={{ fontSize: 13, margin: 0 }}>Speak in <strong style={{ color: '#16a34a' }}>{language.name}</strong></p>
//           </div>
//         )}

//         {messages.map((msg, i) => (
//           <div key={i} style={{ animation: 'fadeUp 0.2s ease' }}>
//             <Bubble role={msg.role} text={msg.text} />
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ── Pipeline status pill ── */}
//       <div style={{
//         display: 'flex', justifyContent: 'center',
//         padding: '4px 0 2px',
//         flexShrink: 0,
//       }}>
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 6,
//           padding: '5px 14px',
//           borderRadius: 999,
//           background: '#f1f5f9',
//           fontSize: 12,
//           color: '#64748b',
//           fontFamily: "'DM Mono', monospace",
//           letterSpacing: '0.02em',
//         }}>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam STT</span>
//           <span>→</span>
//           <span style={{ color: '#2563eb', fontWeight: 600 }}>Ollama</span>
//           <span>→</span>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam TTS</span>
//         </div>
//       </div>

//       {/* ── Bottom control zone ── */}
//       <div style={{
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: '20px 20px 32px',
//         gap: 16,
//         borderTop: '1px solid #f1f5f9',
//       }}>
//         {/* Waveform — shown when listening or speaking */}
//         <div style={{
//           height: 36,
//           opacity: (appState === 'listening' || appState === 'speaking') ? 1 : 0,
//           transition: 'opacity 0.3s',
//         }}>
//           <Waveform
//             active={appState === 'listening' || appState === 'speaking'}
//             color={appState === 'speaking' ? '#2563eb' : '#dc2626'}
//             key={animFrame}
//           />
//         </div>

//         {/* Status text */}
//         <p style={{
//           margin: 0,
//           fontSize: 13,
//           color: '#64748b',
//           letterSpacing: '-0.01em',
//           textAlign: 'center',
//           minHeight: 18,
//           transition: 'color 0.2s',
//         }}>
//           {statusMsg}
//         </p>

//         {/* Mic button with ring animations */}
//         <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           {/* Outer ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse 1.4s ease-out infinite',
//               zIndex: 0,
//             }} />
//           )}
//           {/* Inner ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse2 1.4s ease-out 0.45s infinite',
//               zIndex: 0,
//             }} />
//           )}

//           <button
//             onClick={handleMicClick}
//             disabled={appState === 'processing'}
//             style={{
//               position: 'relative', zIndex: 1,
//               width: 72, height: 72,
//               borderRadius: '50%',
//               background: btnColor,
//               border: 'none',
//               cursor: appState === 'processing' ? 'not-allowed' : 'pointer',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               transition: 'background 0.25s, transform 0.15s',
//               transform: appState === 'listening' ? 'scale(1.08)' : 'scale(1)',
//               boxShadow: `0 4px 20px ${btnColor}55`,
//             }}
//           >
//             {appState === 'processing' && <Spinner size={26} />}
//             {appState === 'listening' && <StopIcon size={26} />}
//             {appState === 'speaking'  && <SpeakerIcon size={26} />}
//             {appState === 'idle'      && <MicIcon size={30} />}
//           </button>
//         </div>

//         {/* Tap hint */}
//         <p style={{
//           margin: 0,
//           fontSize: 11,
//           color: '#cbd5e1',
//           letterSpacing: '0.04em',
//           textTransform: 'uppercase',
//         }}>
//           {appState === 'idle'       && 'Tap to start speaking'}
//           {appState === 'listening'  && 'Tap to stop & send'}
//           {appState === 'processing' && 'Processing…'}
//           {appState === 'speaking'   && 'Tap to stop'}
//         </p>
//       </div>

//       {/* Click outside to close lang picker */}
//       {showLangPicker && (
//         <div
//           onClick={() => setShowLangPicker(false)}
//           style={{ position: 'fixed', inset: 0, zIndex: 99 }}
//         />
//       )}
//     </div>
//   );
// }

//new 4
// import React, { useState, useRef, useEffect } from 'react';

// // Relative URL → Vite proxy rewrites to ngrok. No cross-origin = no CORS preflight.
// const BACKEND_URL = '';

// const LANGUAGES = [
//   { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
//   { code: 'en-IN', label: 'English', name: 'English' },
//   { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
//   { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
//   { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
//   { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
//   { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
//   { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
//   { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
//   { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
//   { code: 'od-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
// ];

// // ── Waveform bars rendered as SVG ──────────────────────────────────────────
// function Waveform({ active, color = '#16a34a' }) {
//   const bars = 28;
//   return (
//     <svg width="120" height="36" viewBox={`0 0 ${bars * 5 - 1} 36`} style={{ display: 'block' }}>
//       {Array.from({ length: bars }).map((_, i) => {
//         const h = active
//           ? 8 + Math.abs(Math.sin((i / bars) * Math.PI * 3)) * 22
//           : 4;
//         const y = (36 - h) / 2;
//         return (
//           <rect
//             key={i}
//             x={i * 5}
//             y={y}
//             width={3}
//             height={h}
//             rx={1.5}
//             fill={color}
//             opacity={active ? 1 : 0.3}
//             style={{
//               transition: 'height 0.15s ease, y 0.15s ease',
//               animationDelay: `${i * 0.04}s`,
//             }}
//           />
//         );
//       })}
//     </svg>
//   );
// }

// // ── Mic SVG Icon ───────────────────────────────────────────────────────────
// function MicIcon({ size = 32, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="2" width="6" height="12" rx="3" />
//       <path d="M5 10a7 7 0 0 0 14 0" />
//       <line x1="12" y1="19" x2="12" y2="22" />
//       <line x1="8" y1="22" x2="16" y2="22" />
//     </svg>
//   );
// }

// function StopIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
//       <rect x="5" y="5" width="14" height="14" rx="2" />
//     </svg>
//   );
// }

// function SpeakerIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//     </svg>
//   );
// }

// // ── Spinner ────────────────────────────────────────────────────────────────
// function Spinner({ size = 28, color = 'white' }) {
//   return (
//     <div style={{
//       width: size, height: size,
//       border: `3px solid rgba(255,255,255,0.25)`,
//       borderTop: `3px solid ${color}`,
//       borderRadius: '50%',
//       animation: 'spin 0.85s linear infinite',
//     }} />
//   );
// }

// // ── Message Bubble ─────────────────────────────────────────────────────────
// function Bubble({ role, text }) {
//   const isUser = role === 'user';
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: isUser ? 'flex-end' : 'flex-start',
//       marginBottom: '10px',
//     }}>
//       <div style={{
//         maxWidth: '72%',
//         padding: '10px 14px',
//         borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//         background: isUser ? '#16a34a' : '#f1f5f9',
//         color: isUser ? '#fff' : '#0f172a',
//         fontSize: '15px',
//         lineHeight: '1.5',
//         fontFamily: "'DM Sans', sans-serif",
//         letterSpacing: '-0.01em',
//       }}>
//         {text}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function AppPage() {
//   // States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [language, setLanguage] = useState(LANGUAGES[0]);
//   const [messages, setMessages] = useState([]);
//   const [statusMsg, setStatusMsg] = useState('Tap the mic and speak');
//   const [animFrame, setAnimFrame] = useState(0);
//   const [showLangPicker, setShowLangPicker] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const animRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const currentAudioRef = useRef(null);

//   // ── Waveform animation loop while listening ──────────────────────────────
//   useEffect(() => {
//     if (appState === 'listening' || appState === 'speaking') {
//       animRef.current = setInterval(() => {
//         setAnimFrame(f => f + 1);
//       }, 120);
//     } else {
//       clearInterval(animRef.current);
//     }
//     return () => clearInterval(animRef.current);
//   }, [appState]);

//   // ── Auto-scroll messages ─────────────────────────────────────────────────
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ── Start recording ──────────────────────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
//       audioChunksRef.current = [];

//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';

//       const recorder = new MediaRecorder(stream, { mimeType });
//       mediaRecorderRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       recorder.onstop = async () => {
//         const blob = new Blob(audioChunksRef.current, { type: mimeType });
//         streamRef.current?.getTracks().forEach(t => t.stop());
//         await sendAudioToBackend(blob);
//       };

//       recorder.start(250);
//       setAppState('listening');
//       setStatusMsg('Listening… tap again to send');
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatusMsg('Microphone access denied.');
//     }
//   };

//   // ── Stop recording ───────────────────────────────────────────────────────
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       setAppState('processing');
//       setStatusMsg('Transcribing with Sarvam AI…');
//     }
//   };

//   // ── Full pipeline: audio → STT → Ollama → TTS → play ────────────────────
//   const sendAudioToBackend = async (blob) => {
//     try {
//       // Step 1 — STT via Sarvam
//       setStatusMsg('Transcribing with Sarvam AI…');
//       const formData = new FormData();
//       formData.append('file', blob, 'voice.webm');
//       formData.append('language', language.code);

//       const sttRes = await fetch(`${BACKEND_URL}/stt`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!sttRes.ok) throw new Error(`STT failed: ${sttRes.status}`);
//       const { text: userText } = await sttRes.json();

//       setMessages(prev => [...prev, { role: 'user', text: userText }]);

//       // Step 2 — Ollama (translate → respond → translate back) via backend
//       setStatusMsg('Ollama is thinking…');
//       const chatRes = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: userText, language: language.code }),
//       });

//       if (!chatRes.ok) throw new Error(`Chat failed: ${chatRes.status}`);
//       const { response: aiText } = await chatRes.json();

//       setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

//       // Step 3 — TTS via Sarvam → play audio
//       setStatusMsg('Generating voice response…');
//       const ttsRes = await fetch(
//         `${BACKEND_URL}/tts?text=${encodeURIComponent(aiText)}&lang=${language.code}`
//       );

//       if (!ttsRes.ok) throw new Error(`TTS failed: ${ttsRes.status}`);

//       // Use arrayBuffer + explicit WAV mime so browser decodes correctly
//       const audioBytes = await ttsRes.arrayBuffer();
//       const audioBlob = new Blob([audioBytes], { type: 'audio/wav' });
//       const audioUrl = URL.createObjectURL(audioBlob);

//       const audio = new Audio();
//       audio.src = audioUrl;
//       currentAudioRef.current = audio;

//       // Wait for enough data before playing to avoid NotSupportedError
//       await new Promise((resolve, reject) => {
//         audio.oncanplaythrough = resolve;
//         audio.onerror = (e) => reject(new Error('Audio decode failed'));
//         audio.load();
//       });

//       audio.onplay = () => {
//         setAppState('speaking');
//         setStatusMsg('Playing AI response…');
//       };
//       audio.onended = () => {
//         setAppState('idle');
//         setStatusMsg('Tap the mic to reply');
//         URL.revokeObjectURL(audioUrl);
//       };

//       await audio.play();

//     } catch (err) {
//       console.error('Pipeline error:', err);
//       setAppState('idle');
//       setStatusMsg(`Error: ${err.message}`);
//     }
//   };

//   // ── Stop speaking ────────────────────────────────────────────────────────
//   const stopSpeaking = () => {
//     currentAudioRef.current?.pause();
//     setAppState('idle');
//     setStatusMsg('Tap the mic to speak');
//   };

//   // ── Mic button handler ───────────────────────────────────────────────────
//   const handleMicClick = () => {
//     if (appState === 'processing') return;
//     if (appState === 'speaking') { stopSpeaking(); return; }
//     if (appState === 'listening') { stopRecording(); return; }
//     startRecording();
//   };

//   // ── Derived UI values ────────────────────────────────────────────────────
//   const btnColor =
//     appState === 'listening' ? '#dc2626' :
//     appState === 'speaking'  ? '#2563eb' :
//     appState === 'processing'? '#6b7280' :
//     '#16a34a';

//   const ringColor =
//     appState === 'listening' ? 'rgba(220,38,38,0.35)' :
//     appState === 'speaking'  ? 'rgba(37,99,235,0.3)' :
//     'transparent';

//   const ringActive = appState === 'listening' || appState === 'speaking';

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       background: '#ffffff',
//       fontFamily: "'DM Sans', 'Inter', sans-serif",
//       color: '#0f172a',
//       overflow: 'hidden',
//     }}>

//       {/* ── Keyframes injected once ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes ring-pulse {
//           0%   { transform: scale(1);   opacity: 0.7; }
//           100% { transform: scale(1.65); opacity: 0;   }
//         }
//         @keyframes ring-pulse2 {
//           0%   { transform: scale(1);   opacity: 0.45; }
//           100% { transform: scale(1.45); opacity: 0;   }
//         }
//         @keyframes bar-bounce {
//           0%, 100% { transform: scaleY(1); }
//           50%       { transform: scaleY(1.7); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0);   }
//         }
//         .lang-option:hover { background: #f0fdf4 !important; }
//       `}</style>

//       {/* ── Header ── */}
//       <header style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '14px 20px',
//         borderBottom: '1px solid #e2e8f0',
//         flexShrink: 0,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{
//             width: 10, height: 10, borderRadius: '50%',
//             background: '#16a34a',
//             boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
//           }} />
//           <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>
//             CareIndia AI
//           </span>
//         </div>

//         {/* Language picker */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setShowLangPicker(p => !p)}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 6,
//               padding: '7px 14px',
//               border: '1px solid #d1d5db',
//               borderRadius: 20,
//               background: '#f9fafb',
//               cursor: 'pointer',
//               fontSize: 14,
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 500,
//               color: '#374151',
//             }}
//           >
//             <span>{language.label}</span>
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//               stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </button>

//           {showLangPicker && (
//             <div style={{
//               position: 'absolute', right: 0, top: 'calc(100% + 6px)',
//               background: '#fff',
//               border: '1px solid #e2e8f0',
//               borderRadius: 12,
//               boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
//               zIndex: 100,
//               overflow: 'hidden',
//               minWidth: 180,
//               animation: 'fadeUp 0.15s ease',
//             }}>
//               {LANGUAGES.map(lang => (
//                 <div
//                   key={lang.code}
//                   className="lang-option"
//                   onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
//                   style={{
//                     padding: '10px 16px',
//                     cursor: 'pointer',
//                     fontSize: 14,
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     background: lang.code === language.code ? '#f0fdf4' : '#fff',
//                     color: lang.code === language.code ? '#16a34a' : '#374151',
//                     fontWeight: lang.code === language.code ? 600 : 400,
//                     transition: 'background 0.1s',
//                   }}
//                 >
//                   <span style={{ fontSize: 16 }}>{lang.label}</span>
//                   <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang.name}</span>
//                   {lang.code === language.code && (
//                     <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* ── Chat transcript ── */}
//       <div style={{
//         flex: 1,
//         overflowY: 'auto',
//         padding: '16px 20px',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {messages.length === 0 && (
//           <div style={{
//             flex: 1, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             color: '#94a3b8', textAlign: 'center', gap: 8,
//           }}>
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
//               stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
//               <rect x="9" y="2" width="6" height="12" rx="3" />
//               <path d="M5 10a7 7 0 0 0 14 0" />
//               <line x1="12" y1="19" x2="12" y2="22" />
//               <line x1="8" y1="22" x2="16" y2="22" />
//             </svg>
//             <p style={{ fontSize: 15, margin: 0 }}>Your conversation will appear here</p>
//             <p style={{ fontSize: 13, margin: 0 }}>Speak in <strong style={{ color: '#16a34a' }}>{language.name}</strong></p>
//           </div>
//         )}

//         {messages.map((msg, i) => (
//           <div key={i} style={{ animation: 'fadeUp 0.2s ease' }}>
//             <Bubble role={msg.role} text={msg.text} />
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ── Pipeline status pill ── */}
//       <div style={{
//         display: 'flex', justifyContent: 'center',
//         padding: '4px 0 2px',
//         flexShrink: 0,
//       }}>
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 6,
//           padding: '5px 14px',
//           borderRadius: 999,
//           background: '#f1f5f9',
//           fontSize: 12,
//           color: '#64748b',
//           fontFamily: "'DM Mono', monospace",
//           letterSpacing: '0.02em',
//         }}>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam STT</span>
//           <span>→</span>
//           <span style={{ color: '#2563eb', fontWeight: 600 }}>Ollama</span>
//           <span>→</span>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam TTS</span>
//         </div>
//       </div>

//       {/* ── Bottom control zone ── */}
//       <div style={{
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: '20px 20px 32px',
//         gap: 16,
//         borderTop: '1px solid #f1f5f9',
//       }}>
//         {/* Waveform — shown when listening or speaking */}
//         <div style={{
//           height: 36,
//           opacity: (appState === 'listening' || appState === 'speaking') ? 1 : 0,
//           transition: 'opacity 0.3s',
//         }}>
//           <Waveform
//             active={appState === 'listening' || appState === 'speaking'}
//             color={appState === 'speaking' ? '#2563eb' : '#dc2626'}
//             key={animFrame}
//           />
//         </div>

//         {/* Status text */}
//         <p style={{
//           margin: 0,
//           fontSize: 13,
//           color: '#64748b',
//           letterSpacing: '-0.01em',
//           textAlign: 'center',
//           minHeight: 18,
//           transition: 'color 0.2s',
//         }}>
//           {statusMsg}
//         </p>

//         {/* Mic button with ring animations */}
//         <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           {/* Outer ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse 1.4s ease-out infinite',
//               zIndex: 0,
//             }} />
//           )}
//           {/* Inner ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse2 1.4s ease-out 0.45s infinite',
//               zIndex: 0,
//             }} />
//           )}

//           <button
//             onClick={handleMicClick}
//             disabled={appState === 'processing'}
//             style={{
//               position: 'relative', zIndex: 1,
//               width: 72, height: 72,
//               borderRadius: '50%',
//               background: btnColor,
//               border: 'none',
//               cursor: appState === 'processing' ? 'not-allowed' : 'pointer',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               transition: 'background 0.25s, transform 0.15s',
//               transform: appState === 'listening' ? 'scale(1.08)' : 'scale(1)',
//               boxShadow: `0 4px 20px ${btnColor}55`,
//             }}
//           >
//             {appState === 'processing' && <Spinner size={26} />}
//             {appState === 'listening' && <StopIcon size={26} />}
//             {appState === 'speaking'  && <SpeakerIcon size={26} />}
//             {appState === 'idle'      && <MicIcon size={30} />}
//           </button>
//         </div>

//         {/* Tap hint */}
//         <p style={{
//           margin: 0,
//           fontSize: 11,
//           color: '#cbd5e1',
//           letterSpacing: '0.04em',
//           textTransform: 'uppercase',
//         }}>
//           {appState === 'idle'       && 'Tap to start speaking'}
//           {appState === 'listening'  && 'Tap to stop & send'}
//           {appState === 'processing' && 'Processing…'}
//           {appState === 'speaking'   && 'Tap to stop'}
//         </p>
//       </div>

//       {/* Click outside to close lang picker */}
//       {showLangPicker && (
//         <div
//           onClick={() => setShowLangPicker(false)}
//           style={{ position: 'fixed', inset: 0, zIndex: 99 }}
//         />
//       )}
//     </div>
//   );
// }

// New 5
// import React, { useState, useRef } from 'react';

// export default function VoiceAppPage() {
//   // App States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [languageCode, setLanguageCode] = useState('hi-IN');
//   const [displayText, setDisplayText] = useState('Tap the microphone and tell me how you are feeling.');

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   // const sendAudioToBackend = async (blob) => {
//   //   setAppState('processing');
//   //   setDisplayText('Translating and thinking...');
    
//   //   const formData = new FormData();
//   //   // FIX 1: Name the key "file" (Verify this matches your backend FastAPI parameter!)
//   //   formData.append("file", blob, "user_voice.webm");
    
//   //   // FIX 2: Send the language code to the backend so Sarvam knows what to expect
//   //   formData.append("language", languageCode); 

//   //   try {
//   //       // Replace with your actual local backend URL, e.g., "http://localhost:8000/api/chat"
//   //       const response = await fetch("http://localhost:8000/api/chat", {
//   //           method: "POST",
//   //           body: formData,
//   //       });

// const sendAudioToBackend = async () => {
//   setAppState('processing');
//   setDisplayText('Thinking...');

//   try {
//     const userText = "I have a headache";

//     const response = await fetch(
//       `https://ganglionate-unconvincedly-perla.ngrok-free.dev/tts?text=${encodeURIComponent(userText)}`
//     );

//     if (!response.ok) throw new Error("Backend failed");

//     const audioBlob = await response.blob();
//     const audioUrl = URL.createObjectURL(audioBlob);

//     const audio = new Audio(audioUrl);

//     audio.onplay = () => {
//       setAppState('speaking');
//       setDisplayText('AI is responding...');
//     };

//     audio.onended = () => {
//       setAppState('idle');
//       setDisplayText('Tap the microphone to reply.');
//     };

//     audio.play();

//   } catch (e) {
//     console.error(e);
//     setAppState('idle');
//     setDisplayText('Connection failed.');
//   }
// };

//   const startRecording = async () => {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = mediaRecorder;
//         audioChunksRef.current = [];

//         mediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 audioChunksRef.current.push(event.data);
//             }
//         }

//         mediaRecorder.onstop = async () => {
//             const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//             stream.getTracks().forEach(track => track.stop());
//             await sendAudioToBackend(audioBlob);
//         }

//         mediaRecorder.start();
//         setAppState('listening');
//         setDisplayText('Listening...');
//     } catch (e) {
//         console.error("Mic access denied", e); 
//         alert("Give permission to access mic");
//         setAppState('idle');
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && appState === 'listening') {
//         mediaRecorderRef.current.stop();
//         // State changes to 'processing' inside sendAudioToBackend
//     }
//   }

//   // --- STYLES ---
//   const colors = {
//     bg: '#ffffff',
//     primary: '#10b981', // Emerald green
//     primaryGlow: 'rgba(16, 185, 129, 0.4)',
//     textDark: '#0f172a',
//     textLight: '#64748b',
//     surface: '#f8fafc',
//     border: '#e2e8f0'
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       backgroundColor: colors.bg,
//       fontFamily: '"Inter", -apple-system, sans-serif',
//       color: colors.textDark,
//       overflow: 'hidden'
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '20px 30px',
//       zIndex: 10
//     },
//     brand: {
//       fontSize: '20px',
//       fontWeight: 'bold',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     select: {
//       padding: '10px 16px',
//       borderRadius: '20px',
//       border: `1px solid ${colors.border}`,
//       backgroundColor: colors.surface,
//       fontSize: '15px',
//       fontWeight: '600',
//       cursor: 'pointer',
//       outline: 'none'
//     },
//     main: {
//       flex: 1,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '20px',
//       position: 'relative'
//     },
//     micButtonWrapper: {
//       position: 'relative',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: '200px',
//       height: '200px',
//       marginBottom: '40px'
//     },
//     micButton: {
//       width: '120px',
//       height: '120px',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       color: 'white',
//       border: 'none',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       boxShadow: `0 10px 25px ${appState === 'listening' ? 'rgba(239, 68, 68, 0.4)' : colors.primaryGlow}`,
//       zIndex: 2,
//       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//       transform: appState === 'listening' ? 'scale(1.1)' : 'scale(1)',
//     },
//     ripple: {
//       position: 'absolute',
//       width: '100%',
//       height: '100%',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       opacity: 0,
//       zIndex: 1,
//       animation: appState === 'listening' 
//         ? 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' 
//         : appState === 'speaking' 
//         ? 'wave-ring 2s ease-in-out infinite alternate' 
//         : 'none',
//     },
//     statusText: {
//       fontSize: '16px',
//       fontWeight: 'bold',
//       color: appState === 'listening' ? '#ef4444' : colors.primary,
//       textTransform: 'uppercase',
//       letterSpacing: '2px',
//       marginBottom: '16px',
//       transition: 'opacity 0.3s ease',
//       opacity: appState === 'idle' ? 0.5 : 1
//     },
//     subtitleBox: {
//       maxWidth: '600px',
//       width: '100%',
//       textAlign: 'center',
//       minHeight: '120px'
//     },
//     subtitleText: {
//       fontSize: '28px',
//       lineHeight: '1.4',
//       fontWeight: '500',
//       color: colors.textDark,
//       transition: 'all 0.3s ease',
//     }
//   };

//   const getIcon = () => {
//     if (appState === 'processing') {
//       return <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />;
//     }
//     if (appState === 'speaking') {
//       return (
//         <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
//         </svg>
//       );
//     }
//     return (
//       <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//       </svg>
//     );
//   };

//   return (
//     <div style={styles.container}>
//       <style>
//         {`
//           @keyframes pulse-ring {
//             0% { transform: scale(0.8); opacity: 0.5; }
//             100% { transform: scale(1.8); opacity: 0; }
//           }
//           @keyframes wave-ring {
//             0% { transform: scale(1); opacity: 0.2; }
//             100% { transform: scale(1.3); opacity: 0.1; }
//           }
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>

//       <header style={styles.header}>
//         <div style={styles.brand}>
//           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.primary }}></div>
//           CareIndia AI
//         </div>
//         {/* FIX 4: Bind value to languageCode so it updates visually */}
//         <select style={styles.select} value={languageCode} onChange={(e) => setLanguageCode(e.target.value)}>
//           <option value="hi-IN">हिंदी (Hindi)</option>
//           <option value="en-IN">English</option>
//           <option value="bn-IN">বাংলা (Bengali)</option>
//           <option value="te-IN">తెలుగు (Telugu)</option>
//           <option value="ta-IN">தமிழ் (Tamil)</option>
//           <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
//           <option value="ml-IN">മലയാളം (Malayalam)</option>
//           <option value="mr-IN">मराठी (Marathi)</option>
//           <option value="gu-IN">ગુજરાતી (Gujarati)</option>
//           <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
//           <option value="od-IN">ଓଡ଼ିଆ (Odia)</option>
//         </select>
//       </header>

//       <main style={styles.main}>
        
//         <div style={styles.statusText}>
//           {appState === 'idle' && 'Tap to Speak'}
//           {appState === 'listening' && 'Listening...'}
//           {appState === 'processing' && 'Translating...'}
//           {appState === 'speaking' && 'AI Responding'}
//         </div>

//         <div style={styles.micButtonWrapper}>
//           <div style={styles.ripple}></div>
//           <button 
//             onClick={() => sendAudioToBackend()} 
//             style={styles.micButton}
//             disabled={appState === 'processing'}
//           >
//             {getIcon()}
//           </button>
//         </div>

//         <div style={styles.subtitleBox}>
//           <p style={{
//             ...styles.subtitleText,
//             color: appState === 'listening' ? colors.textLight : colors.textDark,
//             fontSize: displayText.length > 80 ? '22px' : '28px'
//           }}>
//             {displayText}
//           </p>
//         </div>

//       </main>
//     </div>
//   );
// }



// NEW 1

// import React, { useState } from 'react';

// export default function VoiceAppPage() {
//   const [appState, setAppState] = useState('idle');
//   const [languageCode, setLanguageCode] = useState('hi-IN');
//   const [displayText, setDisplayText] = useState(
//     'Tap the microphone and tell me how you are feeling.'
//   );

//   // 🎤 Speech-to-Text
//   const startSpeechToText = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech recognition not supported in this browser");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = languageCode;
//     recognition.interimResults = false;

//     recognition.onstart = () => {
//       setAppState("listening");
//       setDisplayText("Listening...");
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log("User:", transcript);

//       setDisplayText(`You: ${transcript}`);
//       sendTextToBackend(transcript);
//     };

//     recognition.onerror = (e) => {
//       console.error(e);
//       setAppState("idle");
//       setDisplayText("Error capturing speech.");
//     };

//     recognition.start();
//   };

//   // 🔊 Send text → backend → play audio
//   const sendTextToBackend = async (text) => {
//     try {
//       setAppState("processing");
//       setDisplayText("Thinking...");

//       const audio = new Audio(
//         `https://ganglionate-unconvincedly-perla.ngrok-free.dev/tts?text=${encodeURIComponent(text)}`
//       );

//       audio.onplay = () => {
//         setAppState("speaking");
//         setDisplayText("AI is responding...");
//       };

//       audio.onended = () => {
//         setAppState("idle");
//         setDisplayText("Tap the microphone to reply.");
//       };

//       await audio.play();

//     } catch (e) {
//       console.error(e);
//       setAppState("idle");
//       setDisplayText("Connection failed.");
//     }
//   };

//   // 🎨 Styles
//   const colors = {
//     bg: '#ffffff',
//     primary: '#10b981',
//     primaryGlow: 'rgba(16, 185, 129, 0.4)',
//     textDark: '#0f172a',
//     textLight: '#64748b',
//     surface: '#f8fafc',
//     border: '#e2e8f0'
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       backgroundColor: colors.bg,
//       fontFamily: '"Inter", sans-serif',
//       color: colors.textDark
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       padding: '20px'
//     },
//     main: {
//       flex: 1,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     button: {
//       width: '120px',
//       height: '120px',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       color: 'white',
//       border: 'none',
//       fontSize: '20px',
//       cursor: 'pointer'
//     },
//     text: {
//       marginTop: '20px',
//       fontSize: '20px',
//       textAlign: 'center',
//       maxWidth: '600px'
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <h2>CareIndia AI</h2>

//         <select
//           value={languageCode}
//           onChange={(e) => setLanguageCode(e.target.value)}
//         >
//           <option value="hi-IN">Hindi</option>
//           <option value="en-IN">English</option>
//         </select>
//       </header>

//       <main style={styles.main}>
//         <button
//           style={styles.button}
//           onClick={startSpeechToText}
//           disabled={appState === "processing"}
//         >
//           🎤
//         </button>

//         <p style={styles.text}>{displayText}</p>
//       </main>
//     </div>
//   );
// }

// NEW 2
// import React, { useState, useRef, useEffect } from 'react';

// const BACKEND_URL = 'https://ganglionate-unconvincedly-perla.ngrok-free.app';

// const LANGUAGES = [
//   { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
//   { code: 'en-IN', label: 'English', name: 'English' },
//   { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
//   { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
//   { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
//   { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
//   { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
//   { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
//   { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
//   { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
//   { code: 'od-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
// ];

// // ── Waveform bars rendered as SVG ──────────────────────────────────────────
// function Waveform({ active, color = '#16a34a' }) {
//   const bars = 28;
//   return (
//     <svg width="120" height="36" viewBox={`0 0 ${bars * 5 - 1} 36`} style={{ display: 'block' }}>
//       {Array.from({ length: bars }).map((_, i) => {
//         const h = active
//           ? 8 + Math.abs(Math.sin((i / bars) * Math.PI * 3)) * 22
//           : 4;
//         const y = (36 - h) / 2;
//         return (
//           <rect
//             key={i}
//             x={i * 5}
//             y={y}
//             width={3}
//             height={h}
//             rx={1.5}
//             fill={color}
//             opacity={active ? 1 : 0.3}
//             style={{
//               transition: 'height 0.15s ease, y 0.15s ease',
//               animationDelay: `${i * 0.04}s`,
//             }}
//           />
//         );
//       })}
//     </svg>
//   );
// }

// // ── Mic SVG Icon ───────────────────────────────────────────────────────────
// function MicIcon({ size = 32, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="2" width="6" height="12" rx="3" />
//       <path d="M5 10a7 7 0 0 0 14 0" />
//       <line x1="12" y1="19" x2="12" y2="22" />
//       <line x1="8" y1="22" x2="16" y2="22" />
//     </svg>
//   );
// }

// function StopIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
//       <rect x="5" y="5" width="14" height="14" rx="2" />
//     </svg>
//   );
// }

// function SpeakerIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//     </svg>
//   );
// }

// // ── Spinner ────────────────────────────────────────────────────────────────
// function Spinner({ size = 28, color = 'white' }) {
//   return (
//     <div style={{
//       width: size, height: size,
//       border: `3px solid rgba(255,255,255,0.25)`,
//       borderTop: `3px solid ${color}`,
//       borderRadius: '50%',
//       animation: 'spin 0.85s linear infinite',
//     }} />
//   );
// }

// // ── Message Bubble ─────────────────────────────────────────────────────────
// function Bubble({ role, text }) {
//   const isUser = role === 'user';
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: isUser ? 'flex-end' : 'flex-start',
//       marginBottom: '10px',
//     }}>
//       <div style={{
//         maxWidth: '72%',
//         padding: '10px 14px',
//         borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//         background: isUser ? '#16a34a' : '#f1f5f9',
//         color: isUser ? '#fff' : '#0f172a',
//         fontSize: '15px',
//         lineHeight: '1.5',
//         fontFamily: "'DM Sans', sans-serif",
//         letterSpacing: '-0.01em',
//       }}>
//         {text}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function AppPage() {
//   // States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [language, setLanguage] = useState(LANGUAGES[0]);
//   const [messages, setMessages] = useState([]);
//   const [statusMsg, setStatusMsg] = useState('Tap the mic and speak');
//   const [animFrame, setAnimFrame] = useState(0);
//   const [showLangPicker, setShowLangPicker] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const animRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const currentAudioRef = useRef(null);

//   // ── Waveform animation loop while listening ──────────────────────────────
//   useEffect(() => {
//     if (appState === 'listening' || appState === 'speaking') {
//       animRef.current = setInterval(() => {
//         setAnimFrame(f => f + 1);
//       }, 120);
//     } else {
//       clearInterval(animRef.current);
//     }
//     return () => clearInterval(animRef.current);
//   }, [appState]);

//   // ── Auto-scroll messages ─────────────────────────────────────────────────
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ── Start recording ──────────────────────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
//       audioChunksRef.current = [];

//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';

//       const recorder = new MediaRecorder(stream, { mimeType });
//       mediaRecorderRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       recorder.onstop = async () => {
//         const blob = new Blob(audioChunksRef.current, { type: mimeType });
//         streamRef.current?.getTracks().forEach(t => t.stop());
//         await sendAudioToBackend(blob);
//       };

//       recorder.start(250);
//       setAppState('listening');
//       setStatusMsg('Listening… tap again to send');
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatusMsg('Microphone access denied.');
//     }
//   };

//   // ── Stop recording ───────────────────────────────────────────────────────
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       setAppState('processing');
//       setStatusMsg('Transcribing with Sarvam AI…');
//     }
//   };

//   // ── Full pipeline: audio → STT → Ollama → TTS → play ────────────────────
//   const sendAudioToBackend = async (blob) => {
//     try {
//       // Step 1 — STT via Sarvam
//       setStatusMsg('Transcribing with Sarvam AI…');
//       const formData = new FormData();
//       formData.append('file', blob, 'voice.webm');
//       formData.append('language', language.code);

//       const sttRes = await fetch(`${BACKEND_URL}/stt`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!sttRes.ok) throw new Error(`STT failed: ${sttRes.status}`);
//       const { text: userText } = await sttRes.json();

//       setMessages(prev => [...prev, { role: 'user', text: userText }]);

//       // Step 2 — Ollama (translate → respond → translate back) via backend
//       setStatusMsg('Ollama is thinking…');
//       const chatRes = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: userText, language: language.code }),
//       });

//       if (!chatRes.ok) throw new Error(`Chat failed: ${chatRes.status}`);
//       const { response: aiText } = await chatRes.json();

//       setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

//       // Step 3 — TTS via Sarvam → play audio
//       setStatusMsg('Generating voice response…');
//       const ttsRes = await fetch(
//         `${BACKEND_URL}/tts?text=${encodeURIComponent(aiText)}&lang=${language.code}`
//       );

//       if (!ttsRes.ok) throw new Error(`TTS failed: ${ttsRes.status}`);
//       const audioBlob = await ttsRes.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       currentAudioRef.current = audio;

//       audio.onplay = () => {
//         setAppState('speaking');
//         setStatusMsg('Playing AI response…');
//       };
//       audio.onended = () => {
//         setAppState('idle');
//         setStatusMsg('Tap the mic to reply');
//         URL.revokeObjectURL(audioUrl);
//       };
//       audio.onerror = () => {
//         setAppState('idle');
//         setStatusMsg('Audio playback failed.');
//       };

//       await audio.play();

//     } catch (err) {
//       console.error('Pipeline error:', err);
//       setAppState('idle');
//       setStatusMsg(`Error: ${err.message}`);
//     }
//   };

//   // ── Stop speaking ────────────────────────────────────────────────────────
//   const stopSpeaking = () => {
//     currentAudioRef.current?.pause();
//     setAppState('idle');
//     setStatusMsg('Tap the mic to speak');
//   };

//   // ── Mic button handler ───────────────────────────────────────────────────
//   const handleMicClick = () => {
//     if (appState === 'processing') return;
//     if (appState === 'speaking') { stopSpeaking(); return; }
//     if (appState === 'listening') { stopRecording(); return; }
//     startRecording();
//   };

//   // ── Derived UI values ────────────────────────────────────────────────────
//   const btnColor =
//     appState === 'listening' ? '#dc2626' :
//     appState === 'speaking'  ? '#2563eb' :
//     appState === 'processing'? '#6b7280' :
//     '#16a34a';

//   const ringColor =
//     appState === 'listening' ? 'rgba(220,38,38,0.35)' :
//     appState === 'speaking'  ? 'rgba(37,99,235,0.3)' :
//     'transparent';

//   const ringActive = appState === 'listening' || appState === 'speaking';

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       background: '#ffffff',
//       fontFamily: "'DM Sans', 'Inter', sans-serif",
//       color: '#0f172a',
//       overflow: 'hidden',
//     }}>

//       {/* ── Keyframes injected once ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes ring-pulse {
//           0%   { transform: scale(1);   opacity: 0.7; }
//           100% { transform: scale(1.65); opacity: 0;   }
//         }
//         @keyframes ring-pulse2 {
//           0%   { transform: scale(1);   opacity: 0.45; }
//           100% { transform: scale(1.45); opacity: 0;   }
//         }
//         @keyframes bar-bounce {
//           0%, 100% { transform: scaleY(1); }
//           50%       { transform: scaleY(1.7); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0);   }
//         }
//         .lang-option:hover { background: #f0fdf4 !important; }
//       `}</style>

//       {/* ── Header ── */}
//       <header style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '14px 20px',
//         borderBottom: '1px solid #e2e8f0',
//         flexShrink: 0,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{
//             width: 10, height: 10, borderRadius: '50%',
//             background: '#16a34a',
//             boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
//           }} />
//           <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>
//             CareIndia AI
//           </span>
//         </div>

//         {/* Language picker */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setShowLangPicker(p => !p)}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 6,
//               padding: '7px 14px',
//               border: '1px solid #d1d5db',
//               borderRadius: 20,
//               background: '#f9fafb',
//               cursor: 'pointer',
//               fontSize: 14,
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 500,
//               color: '#374151',
//             }}
//           >
//             <span>{language.label}</span>
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//               stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </button>

//           {showLangPicker && (
//             <div style={{
//               position: 'absolute', right: 0, top: 'calc(100% + 6px)',
//               background: '#fff',
//               border: '1px solid #e2e8f0',
//               borderRadius: 12,
//               boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
//               zIndex: 100,
//               overflow: 'hidden',
//               minWidth: 180,
//               animation: 'fadeUp 0.15s ease',
//             }}>
//               {LANGUAGES.map(lang => (
//                 <div
//                   key={lang.code}
//                   className="lang-option"
//                   onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
//                   style={{
//                     padding: '10px 16px',
//                     cursor: 'pointer',
//                     fontSize: 14,
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     background: lang.code === language.code ? '#f0fdf4' : '#fff',
//                     color: lang.code === language.code ? '#16a34a' : '#374151',
//                     fontWeight: lang.code === language.code ? 600 : 400,
//                     transition: 'background 0.1s',
//                   }}
//                 >
//                   <span style={{ fontSize: 16 }}>{lang.label}</span>
//                   <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang.name}</span>
//                   {lang.code === language.code && (
//                     <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* ── Chat transcript ── */}
//       <div style={{
//         flex: 1,
//         overflowY: 'auto',
//         padding: '16px 20px',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {messages.length === 0 && (
//           <div style={{
//             flex: 1, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             color: '#94a3b8', textAlign: 'center', gap: 8,
//           }}>
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
//               stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
//               <rect x="9" y="2" width="6" height="12" rx="3" />
//               <path d="M5 10a7 7 0 0 0 14 0" />
//               <line x1="12" y1="19" x2="12" y2="22" />
//               <line x1="8" y1="22" x2="16" y2="22" />
//             </svg>
//             <p style={{ fontSize: 15, margin: 0 }}>Your conversation will appear here</p>
//             <p style={{ fontSize: 13, margin: 0 }}>Speak in <strong style={{ color: '#16a34a' }}>{language.name}</strong></p>
//           </div>
//         )}

//         {messages.map((msg, i) => (
//           <div key={i} style={{ animation: 'fadeUp 0.2s ease' }}>
//             <Bubble role={msg.role} text={msg.text} />
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ── Pipeline status pill ── */}
//       <div style={{
//         display: 'flex', justifyContent: 'center',
//         padding: '4px 0 2px',
//         flexShrink: 0,
//       }}>
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 6,
//           padding: '5px 14px',
//           borderRadius: 999,
//           background: '#f1f5f9',
//           fontSize: 12,
//           color: '#64748b',
//           fontFamily: "'DM Mono', monospace",
//           letterSpacing: '0.02em',
//         }}>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam STT</span>
//           <span>→</span>
//           <span style={{ color: '#2563eb', fontWeight: 600 }}>Ollama</span>
//           <span>→</span>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam TTS</span>
//         </div>
//       </div>

//       {/* ── Bottom control zone ── */}
//       <div style={{
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: '20px 20px 32px',
//         gap: 16,
//         borderTop: '1px solid #f1f5f9',
//       }}>
//         {/* Waveform — shown when listening or speaking */}
//         <div style={{
//           height: 36,
//           opacity: (appState === 'listening' || appState === 'speaking') ? 1 : 0,
//           transition: 'opacity 0.3s',
//         }}>
//           <Waveform
//             active={appState === 'listening' || appState === 'speaking'}
//             color={appState === 'speaking' ? '#2563eb' : '#dc2626'}
//             key={animFrame}
//           />
//         </div>

//         {/* Status text */}
//         <p style={{
//           margin: 0,
//           fontSize: 13,
//           color: '#64748b',
//           letterSpacing: '-0.01em',
//           textAlign: 'center',
//           minHeight: 18,
//           transition: 'color 0.2s',
//         }}>
//           {statusMsg}
//         </p>

//         {/* Mic button with ring animations */}
//         <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           {/* Outer ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse 1.4s ease-out infinite',
//               zIndex: 0,
//             }} />
//           )}
//           {/* Inner ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse2 1.4s ease-out 0.45s infinite',
//               zIndex: 0,
//             }} />
//           )}

//           <button
//             onClick={handleMicClick}
//             disabled={appState === 'processing'}
//             style={{
//               position: 'relative', zIndex: 1,
//               width: 72, height: 72,
//               borderRadius: '50%',
//               background: btnColor,
//               border: 'none',
//               cursor: appState === 'processing' ? 'not-allowed' : 'pointer',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               transition: 'background 0.25s, transform 0.15s',
//               transform: appState === 'listening' ? 'scale(1.08)' : 'scale(1)',
//               boxShadow: `0 4px 20px ${btnColor}55`,
//             }}
//           >
//             {appState === 'processing' && <Spinner size={26} />}
//             {appState === 'listening' && <StopIcon size={26} />}
//             {appState === 'speaking'  && <SpeakerIcon size={26} />}
//             {appState === 'idle'      && <MicIcon size={30} />}
//           </button>
//         </div>

//         {/* Tap hint */}
//         <p style={{
//           margin: 0,
//           fontSize: 11,
//           color: '#cbd5e1',
//           letterSpacing: '0.04em',
//           textTransform: 'uppercase',
//         }}>
//           {appState === 'idle'       && 'Tap to start speaking'}
//           {appState === 'listening'  && 'Tap to stop & send'}
//           {appState === 'processing' && 'Processing…'}
//           {appState === 'speaking'   && 'Tap to stop'}
//         </p>
//       </div>

//       {/* Click outside to close lang picker */}
//       {showLangPicker && (
//         <div
//           onClick={() => setShowLangPicker(false)}
//           style={{ position: 'fixed', inset: 0, zIndex: 99 }}
//         />
//       )}
//     </div>
//   );
// }

// //NEW3
// import React, { useState, useRef, useEffect } from 'react';

// // Relative URL → Vite proxy rewrites to ngrok. No cross-origin = no CORS preflight.
// const BACKEND_URL = '';

// const LANGUAGES = [
//   { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
//   { code: 'en-IN', label: 'English', name: 'English' },
//   { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
//   { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
//   { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
//   { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
//   { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
//   { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
//   { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
//   { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
//   { code: 'od-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
// ];

// // ── Waveform bars rendered as SVG ──────────────────────────────────────────
// function Waveform({ active, color = '#16a34a' }) {
//   const bars = 28;
//   return (
//     <svg width="120" height="36" viewBox={`0 0 ${bars * 5 - 1} 36`} style={{ display: 'block' }}>
//       {Array.from({ length: bars }).map((_, i) => {
//         const h = active
//           ? 8 + Math.abs(Math.sin((i / bars) * Math.PI * 3)) * 22
//           : 4;
//         const y = (36 - h) / 2;
//         return (
//           <rect
//             key={i}
//             x={i * 5}
//             y={y}
//             width={3}
//             height={h}
//             rx={1.5}
//             fill={color}
//             opacity={active ? 1 : 0.3}
//             style={{
//               transition: 'height 0.15s ease, y 0.15s ease',
//               animationDelay: `${i * 0.04}s`,
//             }}
//           />
//         );
//       })}
//     </svg>
//   );
// }

// // ── Mic SVG Icon ───────────────────────────────────────────────────────────
// function MicIcon({ size = 32, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="2" width="6" height="12" rx="3" />
//       <path d="M5 10a7 7 0 0 0 14 0" />
//       <line x1="12" y1="19" x2="12" y2="22" />
//       <line x1="8" y1="22" x2="16" y2="22" />
//     </svg>
//   );
// }

// function StopIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
//       <rect x="5" y="5" width="14" height="14" rx="2" />
//     </svg>
//   );
// }

// function SpeakerIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//     </svg>
//   );
// }

// // ── Spinner ────────────────────────────────────────────────────────────────
// function Spinner({ size = 28, color = 'white' }) {
//   return (
//     <div style={{
//       width: size, height: size,
//       border: `3px solid rgba(255,255,255,0.25)`,
//       borderTop: `3px solid ${color}`,
//       borderRadius: '50%',
//       animation: 'spin 0.85s linear infinite',
//     }} />
//   );
// }

// // ── Message Bubble ─────────────────────────────────────────────────────────
// function Bubble({ role, text }) {
//   const isUser = role === 'user';
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: isUser ? 'flex-end' : 'flex-start',
//       marginBottom: '10px',
//     }}>
//       <div style={{
//         maxWidth: '72%',
//         padding: '10px 14px',
//         borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//         background: isUser ? '#16a34a' : '#f1f5f9',
//         color: isUser ? '#fff' : '#0f172a',
//         fontSize: '15px',
//         lineHeight: '1.5',
//         fontFamily: "'DM Sans', sans-serif",
//         letterSpacing: '-0.01em',
//       }}>
//         {text}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function AppPage() {
//   // States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [language, setLanguage] = useState(LANGUAGES[0]);
//   const [messages, setMessages] = useState([]);
//   const [statusMsg, setStatusMsg] = useState('Tap the mic and speak');
//   const [animFrame, setAnimFrame] = useState(0);
//   const [showLangPicker, setShowLangPicker] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const animRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const currentAudioRef = useRef(null);

//   // ── Waveform animation loop while listening ──────────────────────────────
//   useEffect(() => {
//     if (appState === 'listening' || appState === 'speaking') {
//       animRef.current = setInterval(() => {
//         setAnimFrame(f => f + 1);
//       }, 120);
//     } else {
//       clearInterval(animRef.current);
//     }
//     return () => clearInterval(animRef.current);
//   }, [appState]);

//   // ── Auto-scroll messages ─────────────────────────────────────────────────
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ── Start recording ──────────────────────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
//       audioChunksRef.current = [];

//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';

//       const recorder = new MediaRecorder(stream, { mimeType });
//       mediaRecorderRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       recorder.onstop = async () => {
//         const blob = new Blob(audioChunksRef.current, { type: mimeType });
//         streamRef.current?.getTracks().forEach(t => t.stop());
//         await sendAudioToBackend(blob);
//       };

//       recorder.start(250);
//       setAppState('listening');
//       setStatusMsg('Listening… tap again to send');
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatusMsg('Microphone access denied.');
//     }
//   };

//   // ── Stop recording ───────────────────────────────────────────────────────
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       setAppState('processing');
//       setStatusMsg('Transcribing with Sarvam AI…');
//     }
//   };

//   // ── Full pipeline: audio → STT → Ollama → TTS → play ────────────────────
//   const sendAudioToBackend = async (blob) => {
//     try {
//       // Step 1 — STT via Sarvam
//       setStatusMsg('Transcribing with Sarvam AI…');
//       const formData = new FormData();
//       formData.append('file', blob, 'voice.webm');
//       formData.append('language', language.code);

//       const sttRes = await fetch(`${BACKEND_URL}/stt`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!sttRes.ok) throw new Error(`STT failed: ${sttRes.status}`);
//       const { text: userText } = await sttRes.json();

//       setMessages(prev => [...prev, { role: 'user', text: userText }]);

//       // Step 2 — Ollama (translate → respond → translate back) via backend
//       setStatusMsg('Ollama is thinking…');
//       const chatRes = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: userText, language: language.code }),
//       });

//       if (!chatRes.ok) throw new Error(`Chat failed: ${chatRes.status}`);
//       const { response: aiText } = await chatRes.json();

//       setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

//       // Step 3 — TTS via Sarvam → play audio
//       setStatusMsg('Generating voice response…');
//       const ttsRes = await fetch(
//         `${BACKEND_URL}/tts?text=${encodeURIComponent(aiText)}&lang=${language.code}`,
// {}
//       );

//       if (!ttsRes.ok) throw new Error(`TTS failed: ${ttsRes.status}`);
//       const audioBlob = await ttsRes.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       currentAudioRef.current = audio;

//       audio.onplay = () => {
//         setAppState('speaking');
//         setStatusMsg('Playing AI response…');
//       };
//       audio.onended = () => {
//         setAppState('idle');
//         setStatusMsg('Tap the mic to reply');
//         URL.revokeObjectURL(audioUrl);
//       };
//       audio.onerror = () => {
//         setAppState('idle');
//         setStatusMsg('Audio playback failed.');
//       };

//       await audio.play();

//     } catch (err) {
//       console.error('Pipeline error:', err);
//       setAppState('idle');
//       setStatusMsg(`Error: ${err.message}`);
//     }
//   };

//   // ── Stop speaking ────────────────────────────────────────────────────────
//   const stopSpeaking = () => {
//     currentAudioRef.current?.pause();
//     setAppState('idle');
//     setStatusMsg('Tap the mic to speak');
//   };

//   // ── Mic button handler ───────────────────────────────────────────────────
//   const handleMicClick = () => {
//     if (appState === 'processing') return;
//     if (appState === 'speaking') { stopSpeaking(); return; }
//     if (appState === 'listening') { stopRecording(); return; }
//     startRecording();
//   };

//   // ── Derived UI values ────────────────────────────────────────────────────
//   const btnColor =
//     appState === 'listening' ? '#dc2626' :
//     appState === 'speaking'  ? '#2563eb' :
//     appState === 'processing'? '#6b7280' :
//     '#16a34a';

//   const ringColor =
//     appState === 'listening' ? 'rgba(220,38,38,0.35)' :
//     appState === 'speaking'  ? 'rgba(37,99,235,0.3)' :
//     'transparent';

//   const ringActive = appState === 'listening' || appState === 'speaking';

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       background: '#ffffff',
//       fontFamily: "'DM Sans', 'Inter', sans-serif",
//       color: '#0f172a',
//       overflow: 'hidden',
//     }}>

//       {/* ── Keyframes injected once ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes ring-pulse {
//           0%   { transform: scale(1);   opacity: 0.7; }
//           100% { transform: scale(1.65); opacity: 0;   }
//         }
//         @keyframes ring-pulse2 {
//           0%   { transform: scale(1);   opacity: 0.45; }
//           100% { transform: scale(1.45); opacity: 0;   }
//         }
//         @keyframes bar-bounce {
//           0%, 100% { transform: scaleY(1); }
//           50%       { transform: scaleY(1.7); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0);   }
//         }
//         .lang-option:hover { background: #f0fdf4 !important; }
//       `}</style>

//       {/* ── Header ── */}
//       <header style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '14px 20px',
//         borderBottom: '1px solid #e2e8f0',
//         flexShrink: 0,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{
//             width: 10, height: 10, borderRadius: '50%',
//             background: '#16a34a',
//             boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
//           }} />
//           <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>
//             CareIndia AI
//           </span>
//         </div>

//         {/* Language picker */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setShowLangPicker(p => !p)}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 6,
//               padding: '7px 14px',
//               border: '1px solid #d1d5db',
//               borderRadius: 20,
//               background: '#f9fafb',
//               cursor: 'pointer',
//               fontSize: 14,
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 500,
//               color: '#374151',
//             }}
//           >
//             <span>{language.label}</span>
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//               stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </button>

//           {showLangPicker && (
//             <div style={{
//               position: 'absolute', right: 0, top: 'calc(100% + 6px)',
//               background: '#fff',
//               border: '1px solid #e2e8f0',
//               borderRadius: 12,
//               boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
//               zIndex: 100,
//               overflow: 'hidden',
//               minWidth: 180,
//               animation: 'fadeUp 0.15s ease',
//             }}>
//               {LANGUAGES.map(lang => (
//                 <div
//                   key={lang.code}
//                   className="lang-option"
//                   onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
//                   style={{
//                     padding: '10px 16px',
//                     cursor: 'pointer',
//                     fontSize: 14,
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     background: lang.code === language.code ? '#f0fdf4' : '#fff',
//                     color: lang.code === language.code ? '#16a34a' : '#374151',
//                     fontWeight: lang.code === language.code ? 600 : 400,
//                     transition: 'background 0.1s',
//                   }}
//                 >
//                   <span style={{ fontSize: 16 }}>{lang.label}</span>
//                   <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang.name}</span>
//                   {lang.code === language.code && (
//                     <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* ── Chat transcript ── */}
//       <div style={{
//         flex: 1,
//         overflowY: 'auto',
//         padding: '16px 20px',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {messages.length === 0 && (
//           <div style={{
//             flex: 1, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             color: '#94a3b8', textAlign: 'center', gap: 8,
//           }}>
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
//               stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
//               <rect x="9" y="2" width="6" height="12" rx="3" />
//               <path d="M5 10a7 7 0 0 0 14 0" />
//               <line x1="12" y1="19" x2="12" y2="22" />
//               <line x1="8" y1="22" x2="16" y2="22" />
//             </svg>
//             <p style={{ fontSize: 15, margin: 0 }}>Your conversation will appear here</p>
//             <p style={{ fontSize: 13, margin: 0 }}>Speak in <strong style={{ color: '#16a34a' }}>{language.name}</strong></p>
//           </div>
//         )}

//         {messages.map((msg, i) => (
//           <div key={i} style={{ animation: 'fadeUp 0.2s ease' }}>
//             <Bubble role={msg.role} text={msg.text} />
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ── Pipeline status pill ── */}
//       <div style={{
//         display: 'flex', justifyContent: 'center',
//         padding: '4px 0 2px',
//         flexShrink: 0,
//       }}>
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 6,
//           padding: '5px 14px',
//           borderRadius: 999,
//           background: '#f1f5f9',
//           fontSize: 12,
//           color: '#64748b',
//           fontFamily: "'DM Mono', monospace",
//           letterSpacing: '0.02em',
//         }}>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam STT</span>
//           <span>→</span>
//           <span style={{ color: '#2563eb', fontWeight: 600 }}>Ollama</span>
//           <span>→</span>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam TTS</span>
//         </div>
//       </div>

//       {/* ── Bottom control zone ── */}
//       <div style={{
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: '20px 20px 32px',
//         gap: 16,
//         borderTop: '1px solid #f1f5f9',
//       }}>
//         {/* Waveform — shown when listening or speaking */}
//         <div style={{
//           height: 36,
//           opacity: (appState === 'listening' || appState === 'speaking') ? 1 : 0,
//           transition: 'opacity 0.3s',
//         }}>
//           <Waveform
//             active={appState === 'listening' || appState === 'speaking'}
//             color={appState === 'speaking' ? '#2563eb' : '#dc2626'}
//             key={animFrame}
//           />
//         </div>

//         {/* Status text */}
//         <p style={{
//           margin: 0,
//           fontSize: 13,
//           color: '#64748b',
//           letterSpacing: '-0.01em',
//           textAlign: 'center',
//           minHeight: 18,
//           transition: 'color 0.2s',
//         }}>
//           {statusMsg}
//         </p>

//         {/* Mic button with ring animations */}
//         <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           {/* Outer ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse 1.4s ease-out infinite',
//               zIndex: 0,
//             }} />
//           )}
//           {/* Inner ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse2 1.4s ease-out 0.45s infinite',
//               zIndex: 0,
//             }} />
//           )}

//           <button
//             onClick={handleMicClick}
//             disabled={appState === 'processing'}
//             style={{
//               position: 'relative', zIndex: 1,
//               width: 72, height: 72,
//               borderRadius: '50%',
//               background: btnColor,
//               border: 'none',
//               cursor: appState === 'processing' ? 'not-allowed' : 'pointer',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               transition: 'background 0.25s, transform 0.15s',
//               transform: appState === 'listening' ? 'scale(1.08)' : 'scale(1)',
//               boxShadow: `0 4px 20px ${btnColor}55`,
//             }}
//           >
//             {appState === 'processing' && <Spinner size={26} />}
//             {appState === 'listening' && <StopIcon size={26} />}
//             {appState === 'speaking'  && <SpeakerIcon size={26} />}
//             {appState === 'idle'      && <MicIcon size={30} />}
//           </button>
//         </div>

//         {/* Tap hint */}
//         <p style={{
//           margin: 0,
//           fontSize: 11,
//           color: '#cbd5e1',
//           letterSpacing: '0.04em',
//           textTransform: 'uppercase',
//         }}>
//           {appState === 'idle'       && 'Tap to start speaking'}
//           {appState === 'listening'  && 'Tap to stop & send'}
//           {appState === 'processing' && 'Processing…'}
//           {appState === 'speaking'   && 'Tap to stop'}
//         </p>
//       </div>

//       {/* Click outside to close lang picker */}
//       {showLangPicker && (
//         <div
//           onClick={() => setShowLangPicker(false)}
//           style={{ position: 'fixed', inset: 0, zIndex: 99 }}
//         />
//       )}
//     </div>
//   );
// }

//new 4
// import React, { useState, useRef } from 'react';

// export default function VoiceAppPage() {
//   // App States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [languageCode, setLanguageCode] = useState('hi-IN');
//   const [displayText, setDisplayText] = useState('Tap the microphone and tell me how you are feeling.');

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   // const sendAudioToBackend = async (blob) => {
//   //   setAppState('processing');
//   //   setDisplayText('Translating and thinking...');
    
//   //   const formData = new FormData();
//   //   // FIX 1: Name the key "file" (Verify this matches your backend FastAPI parameter!)
//   //   formData.append("file", blob, "user_voice.webm");
    
//   //   // FIX 2: Send the language code to the backend so Sarvam knows what to expect
//   //   formData.append("language", languageCode); 

//   //   try {
//   //       // Replace with your actual local backend URL, e.g., "http://localhost:8000/api/chat"
//   //       const response = await fetch("http://localhost:8000/api/chat", {
//   //           method: "POST",
//   //           body: formData,
//   //       });

// const sendAudioToBackend = async () => {
//   setAppState('processing');
//   setDisplayText('Thinking...');

//   try {
//     const userText = "I have a headache";

//     const response = await fetch(
//       `https://ganglionate-unconvincedly-perla.ngrok-free.dev/tts?text=${encodeURIComponent(userText)}`
//     );

//     if (!response.ok) throw new Error("Backend failed");

//     const audioBlob = await response.blob();
//     const audioUrl = URL.createObjectURL(audioBlob);

//     const audio = new Audio(audioUrl);

//     audio.onplay = () => {
//       setAppState('speaking');
//       setDisplayText('AI is responding...');
//     };

//     audio.onended = () => {
//       setAppState('idle');
//       setDisplayText('Tap the microphone to reply.');
//     };

//     audio.play();

//   } catch (e) {
//     console.error(e);
//     setAppState('idle');
//     setDisplayText('Connection failed.');
//   }
// };

//   const startRecording = async () => {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = mediaRecorder;
//         audioChunksRef.current = [];

//         mediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 audioChunksRef.current.push(event.data);
//             }
//         }

//         mediaRecorder.onstop = async () => {
//             const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//             stream.getTracks().forEach(track => track.stop());
//             await sendAudioToBackend(audioBlob);
//         }

//         mediaRecorder.start();
//         setAppState('listening');
//         setDisplayText('Listening...');
//     } catch (e) {
//         console.error("Mic access denied", e); 
//         alert("Give permission to access mic");
//         setAppState('idle');
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && appState === 'listening') {
//         mediaRecorderRef.current.stop();
//         // State changes to 'processing' inside sendAudioToBackend
//     }
//   }

//   // --- STYLES ---
//   const colors = {
//     bg: '#ffffff',
//     primary: '#10b981', // Emerald green
//     primaryGlow: 'rgba(16, 185, 129, 0.4)',
//     textDark: '#0f172a',
//     textLight: '#64748b',
//     surface: '#f8fafc',
//     border: '#e2e8f0'
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       backgroundColor: colors.bg,
//       fontFamily: '"Inter", -apple-system, sans-serif',
//       color: colors.textDark,
//       overflow: 'hidden'
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '20px 30px',
//       zIndex: 10
//     },
//     brand: {
//       fontSize: '20px',
//       fontWeight: 'bold',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     select: {
//       padding: '10px 16px',
//       borderRadius: '20px',
//       border: `1px solid ${colors.border}`,
//       backgroundColor: colors.surface,
//       fontSize: '15px',
//       fontWeight: '600',
//       cursor: 'pointer',
//       outline: 'none'
//     },
//     main: {
//       flex: 1,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '20px',
//       position: 'relative'
//     },
//     micButtonWrapper: {
//       position: 'relative',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: '200px',
//       height: '200px',
//       marginBottom: '40px'
//     },
//     micButton: {
//       width: '120px',
//       height: '120px',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       color: 'white',
//       border: 'none',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       boxShadow: `0 10px 25px ${appState === 'listening' ? 'rgba(239, 68, 68, 0.4)' : colors.primaryGlow}`,
//       zIndex: 2,
//       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//       transform: appState === 'listening' ? 'scale(1.1)' : 'scale(1)',
//     },
//     ripple: {
//       position: 'absolute',
//       width: '100%',
//       height: '100%',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       opacity: 0,
//       zIndex: 1,
//       animation: appState === 'listening' 
//         ? 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' 
//         : appState === 'speaking' 
//         ? 'wave-ring 2s ease-in-out infinite alternate' 
//         : 'none',
//     },
//     statusText: {
//       fontSize: '16px',
//       fontWeight: 'bold',
//       color: appState === 'listening' ? '#ef4444' : colors.primary,
//       textTransform: 'uppercase',
//       letterSpacing: '2px',
//       marginBottom: '16px',
//       transition: 'opacity 0.3s ease',
//       opacity: appState === 'idle' ? 0.5 : 1
//     },
//     subtitleBox: {
//       maxWidth: '600px',
//       width: '100%',
//       textAlign: 'center',
//       minHeight: '120px'
//     },
//     subtitleText: {
//       fontSize: '28px',
//       lineHeight: '1.4',
//       fontWeight: '500',
//       color: colors.textDark,
//       transition: 'all 0.3s ease',
//     }
//   };

//   const getIcon = () => {
//     if (appState === 'processing') {
//       return <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />;
//     }
//     if (appState === 'speaking') {
//       return (
//         <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
//         </svg>
//       );
//     }
//     return (
//       <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//       </svg>
//     );
//   };

//   return (
//     <div style={styles.container}>
//       <style>
//         {`
//           @keyframes pulse-ring {
//             0% { transform: scale(0.8); opacity: 0.5; }
//             100% { transform: scale(1.8); opacity: 0; }
//           }
//           @keyframes wave-ring {
//             0% { transform: scale(1); opacity: 0.2; }
//             100% { transform: scale(1.3); opacity: 0.1; }
//           }
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>

//       <header style={styles.header}>
//         <div style={styles.brand}>
//           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.primary }}></div>
//           CareIndia AI
//         </div>
//         {/* FIX 4: Bind value to languageCode so it updates visually */}
//         <select style={styles.select} value={languageCode} onChange={(e) => setLanguageCode(e.target.value)}>
//           <option value="hi-IN">हिंदी (Hindi)</option>
//           <option value="en-IN">English</option>
//           <option value="bn-IN">বাংলা (Bengali)</option>
//           <option value="te-IN">తెలుగు (Telugu)</option>
//           <option value="ta-IN">தமிழ் (Tamil)</option>
//           <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
//           <option value="ml-IN">മലയാളം (Malayalam)</option>
//           <option value="mr-IN">मराठी (Marathi)</option>
//           <option value="gu-IN">ગુજરાતી (Gujarati)</option>
//           <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
//           <option value="od-IN">ଓଡ଼ିଆ (Odia)</option>
//         </select>
//       </header>

//       <main style={styles.main}>
        
//         <div style={styles.statusText}>
//           {appState === 'idle' && 'Tap to Speak'}
//           {appState === 'listening' && 'Listening...'}
//           {appState === 'processing' && 'Translating...'}
//           {appState === 'speaking' && 'AI Responding'}
//         </div>

//         <div style={styles.micButtonWrapper}>
//           <div style={styles.ripple}></div>
//           <button 
//             onClick={() => sendAudioToBackend()} 
//             style={styles.micButton}
//             disabled={appState === 'processing'}
//           >
//             {getIcon()}
//           </button>
//         </div>

//         <div style={styles.subtitleBox}>
//           <p style={{
//             ...styles.subtitleText,
//             color: appState === 'listening' ? colors.textLight : colors.textDark,
//             fontSize: displayText.length > 80 ? '22px' : '28px'
//           }}>
//             {displayText}
//           </p>
//         </div>

//       </main>
//     </div>
//   );
// }



// NEW 1

// import React, { useState } from 'react';

// export default function VoiceAppPage() {
//   const [appState, setAppState] = useState('idle');
//   const [languageCode, setLanguageCode] = useState('hi-IN');
//   const [displayText, setDisplayText] = useState(
//     'Tap the microphone and tell me how you are feeling.'
//   );

//   // 🎤 Speech-to-Text
//   const startSpeechToText = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech recognition not supported in this browser");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = languageCode;
//     recognition.interimResults = false;

//     recognition.onstart = () => {
//       setAppState("listening");
//       setDisplayText("Listening...");
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log("User:", transcript);

//       setDisplayText(`You: ${transcript}`);
//       sendTextToBackend(transcript);
//     };

//     recognition.onerror = (e) => {
//       console.error(e);
//       setAppState("idle");
//       setDisplayText("Error capturing speech.");
//     };

//     recognition.start();
//   };

//   // 🔊 Send text → backend → play audio
//   const sendTextToBackend = async (text) => {
//     try {
//       setAppState("processing");
//       setDisplayText("Thinking...");

//       const audio = new Audio(
//         `https://ganglionate-unconvincedly-perla.ngrok-free.dev/tts?text=${encodeURIComponent(text)}`
//       );

//       audio.onplay = () => {
//         setAppState("speaking");
//         setDisplayText("AI is responding...");
//       };

//       audio.onended = () => {
//         setAppState("idle");
//         setDisplayText("Tap the microphone to reply.");
//       };

//       await audio.play();

//     } catch (e) {
//       console.error(e);
//       setAppState("idle");
//       setDisplayText("Connection failed.");
//     }
//   };

//   // 🎨 Styles
//   const colors = {
//     bg: '#ffffff',
//     primary: '#10b981',
//     primaryGlow: 'rgba(16, 185, 129, 0.4)',
//     textDark: '#0f172a',
//     textLight: '#64748b',
//     surface: '#f8fafc',
//     border: '#e2e8f0'
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       backgroundColor: colors.bg,
//       fontFamily: '"Inter", sans-serif',
//       color: colors.textDark
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       padding: '20px'
//     },
//     main: {
//       flex: 1,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     button: {
//       width: '120px',
//       height: '120px',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       color: 'white',
//       border: 'none',
//       fontSize: '20px',
//       cursor: 'pointer'
//     },
//     text: {
//       marginTop: '20px',
//       fontSize: '20px',
//       textAlign: 'center',
//       maxWidth: '600px'
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <h2>CareIndia AI</h2>

//         <select
//           value={languageCode}
//           onChange={(e) => setLanguageCode(e.target.value)}
//         >
//           <option value="hi-IN">Hindi</option>
//           <option value="en-IN">English</option>
//         </select>
//       </header>

//       <main style={styles.main}>
//         <button
//           style={styles.button}
//           onClick={startSpeechToText}
//           disabled={appState === "processing"}
//         >
//           🎤
//         </button>

//         <p style={styles.text}>{displayText}</p>
//       </main>
//     </div>
//   );
// }

// NEW 2
// import React, { useState, useRef, useEffect } from 'react';

// const BACKEND_URL = 'https://ganglionate-unconvincedly-perla.ngrok-free.app';

// const LANGUAGES = [
//   { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
//   { code: 'en-IN', label: 'English', name: 'English' },
//   { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
//   { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
//   { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
//   { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
//   { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
//   { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
//   { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
//   { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
//   { code: 'od-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
// ];

// // ── Waveform bars rendered as SVG ──────────────────────────────────────────
// function Waveform({ active, color = '#16a34a' }) {
//   const bars = 28;
//   return (
//     <svg width="120" height="36" viewBox={`0 0 ${bars * 5 - 1} 36`} style={{ display: 'block' }}>
//       {Array.from({ length: bars }).map((_, i) => {
//         const h = active
//           ? 8 + Math.abs(Math.sin((i / bars) * Math.PI * 3)) * 22
//           : 4;
//         const y = (36 - h) / 2;
//         return (
//           <rect
//             key={i}
//             x={i * 5}
//             y={y}
//             width={3}
//             height={h}
//             rx={1.5}
//             fill={color}
//             opacity={active ? 1 : 0.3}
//             style={{
//               transition: 'height 0.15s ease, y 0.15s ease',
//               animationDelay: `${i * 0.04}s`,
//             }}
//           />
//         );
//       })}
//     </svg>
//   );
// }

// // ── Mic SVG Icon ───────────────────────────────────────────────────────────
// function MicIcon({ size = 32, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="2" width="6" height="12" rx="3" />
//       <path d="M5 10a7 7 0 0 0 14 0" />
//       <line x1="12" y1="19" x2="12" y2="22" />
//       <line x1="8" y1="22" x2="16" y2="22" />
//     </svg>
//   );
// }

// function StopIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
//       <rect x="5" y="5" width="14" height="14" rx="2" />
//     </svg>
//   );
// }

// function SpeakerIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//     </svg>
//   );
// }

// // ── Spinner ────────────────────────────────────────────────────────────────
// function Spinner({ size = 28, color = 'white' }) {
//   return (
//     <div style={{
//       width: size, height: size,
//       border: `3px solid rgba(255,255,255,0.25)`,
//       borderTop: `3px solid ${color}`,
//       borderRadius: '50%',
//       animation: 'spin 0.85s linear infinite',
//     }} />
//   );
// }

// // ── Message Bubble ─────────────────────────────────────────────────────────
// function Bubble({ role, text }) {
//   const isUser = role === 'user';
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: isUser ? 'flex-end' : 'flex-start',
//       marginBottom: '10px',
//     }}>
//       <div style={{
//         maxWidth: '72%',
//         padding: '10px 14px',
//         borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//         background: isUser ? '#16a34a' : '#f1f5f9',
//         color: isUser ? '#fff' : '#0f172a',
//         fontSize: '15px',
//         lineHeight: '1.5',
//         fontFamily: "'DM Sans', sans-serif",
//         letterSpacing: '-0.01em',
//       }}>
//         {text}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function AppPage() {
//   // States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [language, setLanguage] = useState(LANGUAGES[0]);
//   const [messages, setMessages] = useState([]);
//   const [statusMsg, setStatusMsg] = useState('Tap the mic and speak');
//   const [animFrame, setAnimFrame] = useState(0);
//   const [showLangPicker, setShowLangPicker] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const animRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const currentAudioRef = useRef(null);

//   // ── Waveform animation loop while listening ──────────────────────────────
//   useEffect(() => {
//     if (appState === 'listening' || appState === 'speaking') {
//       animRef.current = setInterval(() => {
//         setAnimFrame(f => f + 1);
//       }, 120);
//     } else {
//       clearInterval(animRef.current);
//     }
//     return () => clearInterval(animRef.current);
//   }, [appState]);

//   // ── Auto-scroll messages ─────────────────────────────────────────────────
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ── Start recording ──────────────────────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
//       audioChunksRef.current = [];

//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';

//       const recorder = new MediaRecorder(stream, { mimeType });
//       mediaRecorderRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       recorder.onstop = async () => {
//         const blob = new Blob(audioChunksRef.current, { type: mimeType });
//         streamRef.current?.getTracks().forEach(t => t.stop());
//         await sendAudioToBackend(blob);
//       };

//       recorder.start(250);
//       setAppState('listening');
//       setStatusMsg('Listening… tap again to send');
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatusMsg('Microphone access denied.');
//     }
//   };

//   // ── Stop recording ───────────────────────────────────────────────────────
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       setAppState('processing');
//       setStatusMsg('Transcribing with Sarvam AI…');
//     }
//   };

//   // ── Full pipeline: audio → STT → Ollama → TTS → play ────────────────────
//   const sendAudioToBackend = async (blob) => {
//     try {
//       // Step 1 — STT via Sarvam
//       setStatusMsg('Transcribing with Sarvam AI…');
//       const formData = new FormData();
//       formData.append('file', blob, 'voice.webm');
//       formData.append('language', language.code);

//       const sttRes = await fetch(`${BACKEND_URL}/stt`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!sttRes.ok) throw new Error(`STT failed: ${sttRes.status}`);
//       const { text: userText } = await sttRes.json();

//       setMessages(prev => [...prev, { role: 'user', text: userText }]);

//       // Step 2 — Ollama (translate → respond → translate back) via backend
//       setStatusMsg('Ollama is thinking…');
//       const chatRes = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: userText, language: language.code }),
//       });

//       if (!chatRes.ok) throw new Error(`Chat failed: ${chatRes.status}`);
//       const { response: aiText } = await chatRes.json();

//       setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

//       // Step 3 — TTS via Sarvam → play audio
//       setStatusMsg('Generating voice response…');
//       const ttsRes = await fetch(
//         `${BACKEND_URL}/tts?text=${encodeURIComponent(aiText)}&lang=${language.code}`
//       );

//       if (!ttsRes.ok) throw new Error(`TTS failed: ${ttsRes.status}`);
//       const audioBlob = await ttsRes.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       currentAudioRef.current = audio;

//       audio.onplay = () => {
//         setAppState('speaking');
//         setStatusMsg('Playing AI response…');
//       };
//       audio.onended = () => {
//         setAppState('idle');
//         setStatusMsg('Tap the mic to reply');
//         URL.revokeObjectURL(audioUrl);
//       };
//       audio.onerror = () => {
//         setAppState('idle');
//         setStatusMsg('Audio playback failed.');
//       };

//       await audio.play();

//     } catch (err) {
//       console.error('Pipeline error:', err);
//       setAppState('idle');
//       setStatusMsg(`Error: ${err.message}`);
//     }
//   };

//   // ── Stop speaking ────────────────────────────────────────────────────────
//   const stopSpeaking = () => {
//     currentAudioRef.current?.pause();
//     setAppState('idle');
//     setStatusMsg('Tap the mic to speak');
//   };

//   // ── Mic button handler ───────────────────────────────────────────────────
//   const handleMicClick = () => {
//     if (appState === 'processing') return;
//     if (appState === 'speaking') { stopSpeaking(); return; }
//     if (appState === 'listening') { stopRecording(); return; }
//     startRecording();
//   };

//   // ── Derived UI values ────────────────────────────────────────────────────
//   const btnColor =
//     appState === 'listening' ? '#dc2626' :
//     appState === 'speaking'  ? '#2563eb' :
//     appState === 'processing'? '#6b7280' :
//     '#16a34a';

//   const ringColor =
//     appState === 'listening' ? 'rgba(220,38,38,0.35)' :
//     appState === 'speaking'  ? 'rgba(37,99,235,0.3)' :
//     'transparent';

//   const ringActive = appState === 'listening' || appState === 'speaking';

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       background: '#ffffff',
//       fontFamily: "'DM Sans', 'Inter', sans-serif",
//       color: '#0f172a',
//       overflow: 'hidden',
//     }}>

//       {/* ── Keyframes injected once ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes ring-pulse {
//           0%   { transform: scale(1);   opacity: 0.7; }
//           100% { transform: scale(1.65); opacity: 0;   }
//         }
//         @keyframes ring-pulse2 {
//           0%   { transform: scale(1);   opacity: 0.45; }
//           100% { transform: scale(1.45); opacity: 0;   }
//         }
//         @keyframes bar-bounce {
//           0%, 100% { transform: scaleY(1); }
//           50%       { transform: scaleY(1.7); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0);   }
//         }
//         .lang-option:hover { background: #f0fdf4 !important; }
//       `}</style>

//       {/* ── Header ── */}
//       <header style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '14px 20px',
//         borderBottom: '1px solid #e2e8f0',
//         flexShrink: 0,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{
//             width: 10, height: 10, borderRadius: '50%',
//             background: '#16a34a',
//             boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
//           }} />
//           <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>
//             CareIndia AI
//           </span>
//         </div>

//         {/* Language picker */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setShowLangPicker(p => !p)}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 6,
//               padding: '7px 14px',
//               border: '1px solid #d1d5db',
//               borderRadius: 20,
//               background: '#f9fafb',
//               cursor: 'pointer',
//               fontSize: 14,
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 500,
//               color: '#374151',
//             }}
//           >
//             <span>{language.label}</span>
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//               stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </button>

//           {showLangPicker && (
//             <div style={{
//               position: 'absolute', right: 0, top: 'calc(100% + 6px)',
//               background: '#fff',
//               border: '1px solid #e2e8f0',
//               borderRadius: 12,
//               boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
//               zIndex: 100,
//               overflow: 'hidden',
//               minWidth: 180,
//               animation: 'fadeUp 0.15s ease',
//             }}>
//               {LANGUAGES.map(lang => (
//                 <div
//                   key={lang.code}
//                   className="lang-option"
//                   onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
//                   style={{
//                     padding: '10px 16px',
//                     cursor: 'pointer',
//                     fontSize: 14,
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     background: lang.code === language.code ? '#f0fdf4' : '#fff',
//                     color: lang.code === language.code ? '#16a34a' : '#374151',
//                     fontWeight: lang.code === language.code ? 600 : 400,
//                     transition: 'background 0.1s',
//                   }}
//                 >
//                   <span style={{ fontSize: 16 }}>{lang.label}</span>
//                   <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang.name}</span>
//                   {lang.code === language.code && (
//                     <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* ── Chat transcript ── */}
//       <div style={{
//         flex: 1,
//         overflowY: 'auto',
//         padding: '16px 20px',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {messages.length === 0 && (
//           <div style={{
//             flex: 1, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             color: '#94a3b8', textAlign: 'center', gap: 8,
//           }}>
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
//               stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
//               <rect x="9" y="2" width="6" height="12" rx="3" />
//               <path d="M5 10a7 7 0 0 0 14 0" />
//               <line x1="12" y1="19" x2="12" y2="22" />
//               <line x1="8" y1="22" x2="16" y2="22" />
//             </svg>
//             <p style={{ fontSize: 15, margin: 0 }}>Your conversation will appear here</p>
//             <p style={{ fontSize: 13, margin: 0 }}>Speak in <strong style={{ color: '#16a34a' }}>{language.name}</strong></p>
//           </div>
//         )}

//         {messages.map((msg, i) => (
//           <div key={i} style={{ animation: 'fadeUp 0.2s ease' }}>
//             <Bubble role={msg.role} text={msg.text} />
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ── Pipeline status pill ── */}
//       <div style={{
//         display: 'flex', justifyContent: 'center',
//         padding: '4px 0 2px',
//         flexShrink: 0,
//       }}>
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 6,
//           padding: '5px 14px',
//           borderRadius: 999,
//           background: '#f1f5f9',
//           fontSize: 12,
//           color: '#64748b',
//           fontFamily: "'DM Mono', monospace",
//           letterSpacing: '0.02em',
//         }}>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam STT</span>
//           <span>→</span>
//           <span style={{ color: '#2563eb', fontWeight: 600 }}>Ollama</span>
//           <span>→</span>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam TTS</span>
//         </div>
//       </div>

//       {/* ── Bottom control zone ── */}
//       <div style={{
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: '20px 20px 32px',
//         gap: 16,
//         borderTop: '1px solid #f1f5f9',
//       }}>
//         {/* Waveform — shown when listening or speaking */}
//         <div style={{
//           height: 36,
//           opacity: (appState === 'listening' || appState === 'speaking') ? 1 : 0,
//           transition: 'opacity 0.3s',
//         }}>
//           <Waveform
//             active={appState === 'listening' || appState === 'speaking'}
//             color={appState === 'speaking' ? '#2563eb' : '#dc2626'}
//             key={animFrame}
//           />
//         </div>

//         {/* Status text */}
//         <p style={{
//           margin: 0,
//           fontSize: 13,
//           color: '#64748b',
//           letterSpacing: '-0.01em',
//           textAlign: 'center',
//           minHeight: 18,
//           transition: 'color 0.2s',
//         }}>
//           {statusMsg}
//         </p>

//         {/* Mic button with ring animations */}
//         <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           {/* Outer ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse 1.4s ease-out infinite',
//               zIndex: 0,
//             }} />
//           )}
//           {/* Inner ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse2 1.4s ease-out 0.45s infinite',
//               zIndex: 0,
//             }} />
//           )}

//           <button
//             onClick={handleMicClick}
//             disabled={appState === 'processing'}
//             style={{
//               position: 'relative', zIndex: 1,
//               width: 72, height: 72,
//               borderRadius: '50%',
//               background: btnColor,
//               border: 'none',
//               cursor: appState === 'processing' ? 'not-allowed' : 'pointer',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               transition: 'background 0.25s, transform 0.15s',
//               transform: appState === 'listening' ? 'scale(1.08)' : 'scale(1)',
//               boxShadow: `0 4px 20px ${btnColor}55`,
//             }}
//           >
//             {appState === 'processing' && <Spinner size={26} />}
//             {appState === 'listening' && <StopIcon size={26} />}
//             {appState === 'speaking'  && <SpeakerIcon size={26} />}
//             {appState === 'idle'      && <MicIcon size={30} />}
//           </button>
//         </div>

//         {/* Tap hint */}
//         <p style={{
//           margin: 0,
//           fontSize: 11,
//           color: '#cbd5e1',
//           letterSpacing: '0.04em',
//           textTransform: 'uppercase',
//         }}>
//           {appState === 'idle'       && 'Tap to start speaking'}
//           {appState === 'listening'  && 'Tap to stop & send'}
//           {appState === 'processing' && 'Processing…'}
//           {appState === 'speaking'   && 'Tap to stop'}
//         </p>
//       </div>

//       {/* Click outside to close lang picker */}
//       {showLangPicker && (
//         <div
//           onClick={() => setShowLangPicker(false)}
//           style={{ position: 'fixed', inset: 0, zIndex: 99 }}
//         />
//       )}
//     </div>
//   );
// }

// //NEW3
// import React, { useState, useRef, useEffect } from 'react';

// // Relative URL → Vite proxy rewrites to ngrok. No cross-origin = no CORS preflight.
// const BACKEND_URL = '';

// const LANGUAGES = [
//   { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
//   { code: 'en-IN', label: 'English', name: 'English' },
//   { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
//   { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
//   { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
//   { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
//   { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
//   { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
//   { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
//   { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
//   { code: 'od-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
// ];

// // ── Waveform bars rendered as SVG ──────────────────────────────────────────
// function Waveform({ active, color = '#16a34a' }) {
//   const bars = 28;
//   return (
//     <svg width="120" height="36" viewBox={`0 0 ${bars * 5 - 1} 36`} style={{ display: 'block' }}>
//       {Array.from({ length: bars }).map((_, i) => {
//         const h = active
//           ? 8 + Math.abs(Math.sin((i / bars) * Math.PI * 3)) * 22
//           : 4;
//         const y = (36 - h) / 2;
//         return (
//           <rect
//             key={i}
//             x={i * 5}
//             y={y}
//             width={3}
//             height={h}
//             rx={1.5}
//             fill={color}
//             opacity={active ? 1 : 0.3}
//             style={{
//               transition: 'height 0.15s ease, y 0.15s ease',
//               animationDelay: `${i * 0.04}s`,
//             }}
//           />
//         );
//       })}
//     </svg>
//   );
// }

// // ── Mic SVG Icon ───────────────────────────────────────────────────────────
// function MicIcon({ size = 32, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="2" width="6" height="12" rx="3" />
//       <path d="M5 10a7 7 0 0 0 14 0" />
//       <line x1="12" y1="19" x2="12" y2="22" />
//       <line x1="8" y1="22" x2="16" y2="22" />
//     </svg>
//   );
// }

// function StopIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
//       <rect x="5" y="5" width="14" height="14" rx="2" />
//     </svg>
//   );
// }

// function SpeakerIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//     </svg>
//   );
// }

// // ── Spinner ────────────────────────────────────────────────────────────────
// function Spinner({ size = 28, color = 'white' }) {
//   return (
//     <div style={{
//       width: size, height: size,
//       border: `3px solid rgba(255,255,255,0.25)`,
//       borderTop: `3px solid ${color}`,
//       borderRadius: '50%',
//       animation: 'spin 0.85s linear infinite',
//     }} />
//   );
// }

// // ── Message Bubble ─────────────────────────────────────────────────────────
// function Bubble({ role, text }) {
//   const isUser = role === 'user';
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: isUser ? 'flex-end' : 'flex-start',
//       marginBottom: '10px',
//     }}>
//       <div style={{
//         maxWidth: '72%',
//         padding: '10px 14px',
//         borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//         background: isUser ? '#16a34a' : '#f1f5f9',
//         color: isUser ? '#fff' : '#0f172a',
//         fontSize: '15px',
//         lineHeight: '1.5',
//         fontFamily: "'DM Sans', sans-serif",
//         letterSpacing: '-0.01em',
//       }}>
//         {text}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function AppPage() {
//   // States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [language, setLanguage] = useState(LANGUAGES[0]);
//   const [messages, setMessages] = useState([]);
//   const [statusMsg, setStatusMsg] = useState('Tap the mic and speak');
//   const [animFrame, setAnimFrame] = useState(0);
//   const [showLangPicker, setShowLangPicker] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const animRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const currentAudioRef = useRef(null);

//   // ── Waveform animation loop while listening ──────────────────────────────
//   useEffect(() => {
//     if (appState === 'listening' || appState === 'speaking') {
//       animRef.current = setInterval(() => {
//         setAnimFrame(f => f + 1);
//       }, 120);
//     } else {
//       clearInterval(animRef.current);
//     }
//     return () => clearInterval(animRef.current);
//   }, [appState]);

//   // ── Auto-scroll messages ─────────────────────────────────────────────────
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ── Start recording ──────────────────────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
//       audioChunksRef.current = [];

//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';

//       const recorder = new MediaRecorder(stream, { mimeType });
//       mediaRecorderRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       recorder.onstop = async () => {
//         const blob = new Blob(audioChunksRef.current, { type: mimeType });
//         streamRef.current?.getTracks().forEach(t => t.stop());
//         await sendAudioToBackend(blob);
//       };

//       recorder.start(250);
//       setAppState('listening');
//       setStatusMsg('Listening… tap again to send');
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatusMsg('Microphone access denied.');
//     }
//   };

//   // ── Stop recording ───────────────────────────────────────────────────────
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       setAppState('processing');
//       setStatusMsg('Transcribing with Sarvam AI…');
//     }
//   };

//   // ── Full pipeline: audio → STT → Ollama → TTS → play ────────────────────
//   const sendAudioToBackend = async (blob) => {
//     try {
//       // Step 1 — STT via Sarvam
//       setStatusMsg('Transcribing with Sarvam AI…');
//       const formData = new FormData();
//       formData.append('file', blob, 'voice.webm');
//       formData.append('language', language.code);

//       const sttRes = await fetch(`${BACKEND_URL}/stt`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!sttRes.ok) throw new Error(`STT failed: ${sttRes.status}`);
//       const { text: userText } = await sttRes.json();

//       setMessages(prev => [...prev, { role: 'user', text: userText }]);

//       // Step 2 — Ollama (translate → respond → translate back) via backend
//       setStatusMsg('Ollama is thinking…');
//       const chatRes = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: userText, language: language.code }),
//       });

//       if (!chatRes.ok) throw new Error(`Chat failed: ${chatRes.status}`);
//       const { response: aiText } = await chatRes.json();

//       setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

//       // Step 3 — TTS via Sarvam → play audio
//       setStatusMsg('Generating voice response…');
//       const ttsRes = await fetch(
//         `${BACKEND_URL}/tts?text=${encodeURIComponent(aiText)}&lang=${language.code}`,
// {}
//       );

//       if (!ttsRes.ok) throw new Error(`TTS failed: ${ttsRes.status}`);
//       const audioBlob = await ttsRes.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       currentAudioRef.current = audio;

//       audio.onplay = () => {
//         setAppState('speaking');
//         setStatusMsg('Playing AI response…');
//       };
//       audio.onended = () => {
//         setAppState('idle');
//         setStatusMsg('Tap the mic to reply');
//         URL.revokeObjectURL(audioUrl);
//       };
//       audio.onerror = () => {
//         setAppState('idle');
//         setStatusMsg('Audio playback failed.');
//       };

//       await audio.play();

//     } catch (err) {
//       console.error('Pipeline error:', err);
//       setAppState('idle');
//       setStatusMsg(`Error: ${err.message}`);
//     }
//   };

//   // ── Stop speaking ────────────────────────────────────────────────────────
//   const stopSpeaking = () => {
//     currentAudioRef.current?.pause();
//     setAppState('idle');
//     setStatusMsg('Tap the mic to speak');
//   };

//   // ── Mic button handler ───────────────────────────────────────────────────
//   const handleMicClick = () => {
//     if (appState === 'processing') return;
//     if (appState === 'speaking') { stopSpeaking(); return; }
//     if (appState === 'listening') { stopRecording(); return; }
//     startRecording();
//   };

//   // ── Derived UI values ────────────────────────────────────────────────────
//   const btnColor =
//     appState === 'listening' ? '#dc2626' :
//     appState === 'speaking'  ? '#2563eb' :
//     appState === 'processing'? '#6b7280' :
//     '#16a34a';

//   const ringColor =
//     appState === 'listening' ? 'rgba(220,38,38,0.35)' :
//     appState === 'speaking'  ? 'rgba(37,99,235,0.3)' :
//     'transparent';

//   const ringActive = appState === 'listening' || appState === 'speaking';

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       background: '#ffffff',
//       fontFamily: "'DM Sans', 'Inter', sans-serif",
//       color: '#0f172a',
//       overflow: 'hidden',
//     }}>

//       {/* ── Keyframes injected once ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes ring-pulse {
//           0%   { transform: scale(1);   opacity: 0.7; }
//           100% { transform: scale(1.65); opacity: 0;   }
//         }
//         @keyframes ring-pulse2 {
//           0%   { transform: scale(1);   opacity: 0.45; }
//           100% { transform: scale(1.45); opacity: 0;   }
//         }
//         @keyframes bar-bounce {
//           0%, 100% { transform: scaleY(1); }
//           50%       { transform: scaleY(1.7); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0);   }
//         }
//         .lang-option:hover { background: #f0fdf4 !important; }
//       `}</style>

//       {/* ── Header ── */}
//       <header style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '14px 20px',
//         borderBottom: '1px solid #e2e8f0',
//         flexShrink: 0,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{
//             width: 10, height: 10, borderRadius: '50%',
//             background: '#16a34a',
//             boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
//           }} />
//           <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>
//             CareIndia AI
//           </span>
//         </div>

//         {/* Language picker */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setShowLangPicker(p => !p)}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 6,
//               padding: '7px 14px',
//               border: '1px solid #d1d5db',
//               borderRadius: 20,
//               background: '#f9fafb',
//               cursor: 'pointer',
//               fontSize: 14,
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 500,
//               color: '#374151',
//             }}
//           >
//             <span>{language.label}</span>
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//               stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </button>

//           {showLangPicker && (
//             <div style={{
//               position: 'absolute', right: 0, top: 'calc(100% + 6px)',
//               background: '#fff',
//               border: '1px solid #e2e8f0',
//               borderRadius: 12,
//               boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
//               zIndex: 100,
//               overflow: 'hidden',
//               minWidth: 180,
//               animation: 'fadeUp 0.15s ease',
//             }}>
//               {LANGUAGES.map(lang => (
//                 <div
//                   key={lang.code}
//                   className="lang-option"
//                   onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
//                   style={{
//                     padding: '10px 16px',
//                     cursor: 'pointer',
//                     fontSize: 14,
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     background: lang.code === language.code ? '#f0fdf4' : '#fff',
//                     color: lang.code === language.code ? '#16a34a' : '#374151',
//                     fontWeight: lang.code === language.code ? 600 : 400,
//                     transition: 'background 0.1s',
//                   }}
//                 >
//                   <span style={{ fontSize: 16 }}>{lang.label}</span>
//                   <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang.name}</span>
//                   {lang.code === language.code && (
//                     <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* ── Chat transcript ── */}
//       <div style={{
//         flex: 1,
//         overflowY: 'auto',
//         padding: '16px 20px',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {messages.length === 0 && (
//           <div style={{
//             flex: 1, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             color: '#94a3b8', textAlign: 'center', gap: 8,
//           }}>
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
//               stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
//               <rect x="9" y="2" width="6" height="12" rx="3" />
//               <path d="M5 10a7 7 0 0 0 14 0" />
//               <line x1="12" y1="19" x2="12" y2="22" />
//               <line x1="8" y1="22" x2="16" y2="22" />
//             </svg>
//             <p style={{ fontSize: 15, margin: 0 }}>Your conversation will appear here</p>
//             <p style={{ fontSize: 13, margin: 0 }}>Speak in <strong style={{ color: '#16a34a' }}>{language.name}</strong></p>
//           </div>
//         )}

//         {messages.map((msg, i) => (
//           <div key={i} style={{ animation: 'fadeUp 0.2s ease' }}>
//             <Bubble role={msg.role} text={msg.text} />
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ── Pipeline status pill ── */}
//       <div style={{
//         display: 'flex', justifyContent: 'center',
//         padding: '4px 0 2px',
//         flexShrink: 0,
//       }}>
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 6,
//           padding: '5px 14px',
//           borderRadius: 999,
//           background: '#f1f5f9',
//           fontSize: 12,
//           color: '#64748b',
//           fontFamily: "'DM Mono', monospace",
//           letterSpacing: '0.02em',
//         }}>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam STT</span>
//           <span>→</span>
//           <span style={{ color: '#2563eb', fontWeight: 600 }}>Ollama</span>
//           <span>→</span>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam TTS</span>
//         </div>
//       </div>

//       {/* ── Bottom control zone ── */}
//       <div style={{
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: '20px 20px 32px',
//         gap: 16,
//         borderTop: '1px solid #f1f5f9',
//       }}>
//         {/* Waveform — shown when listening or speaking */}
//         <div style={{
//           height: 36,
//           opacity: (appState === 'listening' || appState === 'speaking') ? 1 : 0,
//           transition: 'opacity 0.3s',
//         }}>
//           <Waveform
//             active={appState === 'listening' || appState === 'speaking'}
//             color={appState === 'speaking' ? '#2563eb' : '#dc2626'}
//             key={animFrame}
//           />
//         </div>

//         {/* Status text */}
//         <p style={{
//           margin: 0,
//           fontSize: 13,
//           color: '#64748b',
//           letterSpacing: '-0.01em',
//           textAlign: 'center',
//           minHeight: 18,
//           transition: 'color 0.2s',
//         }}>
//           {statusMsg}
//         </p>

//         {/* Mic button with ring animations */}
//         <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           {/* Outer ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse 1.4s ease-out infinite',
//               zIndex: 0,
//             }} />
//           )}
//           {/* Inner ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse2 1.4s ease-out 0.45s infinite',
//               zIndex: 0,
//             }} />
//           )}

//           <button
//             onClick={handleMicClick}
//             disabled={appState === 'processing'}
//             style={{
//               position: 'relative', zIndex: 1,
//               width: 72, height: 72,
//               borderRadius: '50%',
//               background: btnColor,
//               border: 'none',
//               cursor: appState === 'processing' ? 'not-allowed' : 'pointer',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               transition: 'background 0.25s, transform 0.15s',
//               transform: appState === 'listening' ? 'scale(1.08)' : 'scale(1)',
//               boxShadow: `0 4px 20px ${btnColor}55`,
//             }}
//           >
//             {appState === 'processing' && <Spinner size={26} />}
//             {appState === 'listening' && <StopIcon size={26} />}
//             {appState === 'speaking'  && <SpeakerIcon size={26} />}
//             {appState === 'idle'      && <MicIcon size={30} />}
//           </button>
//         </div>

//         {/* Tap hint */}
//         <p style={{
//           margin: 0,
//           fontSize: 11,
//           color: '#cbd5e1',
//           letterSpacing: '0.04em',
//           textTransform: 'uppercase',
//         }}>
//           {appState === 'idle'       && 'Tap to start speaking'}
//           {appState === 'listening'  && 'Tap to stop & send'}
//           {appState === 'processing' && 'Processing…'}
//           {appState === 'speaking'   && 'Tap to stop'}
//         </p>
//       </div>

//       {/* Click outside to close lang picker */}
//       {showLangPicker && (
//         <div
//           onClick={() => setShowLangPicker(false)}
//           style={{ position: 'fixed', inset: 0, zIndex: 99 }}
//         />
//       )}
//     </div>
//   );
// }

//new 4
// import React, { useState, useRef } from 'react';

// export default function VoiceAppPage() {
//   // App States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [languageCode, setLanguageCode] = useState('hi-IN');
//   const [displayText, setDisplayText] = useState('Tap the microphone and tell me how you are feeling.');

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   // const sendAudioToBackend = async (blob) => {
//   //   setAppState('processing');
//   //   setDisplayText('Translating and thinking...');
    
//   //   const formData = new FormData();
//   //   // FIX 1: Name the key "file" (Verify this matches your backend FastAPI parameter!)
//   //   formData.append("file", blob, "user_voice.webm");
    
//   //   // FIX 2: Send the language code to the backend so Sarvam knows what to expect
//   //   formData.append("language", languageCode); 

//   //   try {
//   //       // Replace with your actual local backend URL, e.g., "http://localhost:8000/api/chat"
//   //       const response = await fetch("http://localhost:8000/api/chat", {
//   //           method: "POST",
//   //           body: formData,
//   //       });

// const sendAudioToBackend = async () => {
//   setAppState('processing');
//   setDisplayText('Thinking...');

//   try {
//     const userText = "I have a headache";

//     const response = await fetch(
//       `https://ganglionate-unconvincedly-perla.ngrok-free.dev/tts?text=${encodeURIComponent(userText)}`
//     );

//     if (!response.ok) throw new Error("Backend failed");

//     const audioBlob = await response.blob();
//     const audioUrl = URL.createObjectURL(audioBlob);

//     const audio = new Audio(audioUrl);

//     audio.onplay = () => {
//       setAppState('speaking');
//       setDisplayText('AI is responding...');
//     };

//     audio.onended = () => {
//       setAppState('idle');
//       setDisplayText('Tap the microphone to reply.');
//     };

//     audio.play();

//   } catch (e) {
//     console.error(e);
//     setAppState('idle');
//     setDisplayText('Connection failed.');
//   }
// };

//   const startRecording = async () => {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = mediaRecorder;
//         audioChunksRef.current = [];

//         mediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 audioChunksRef.current.push(event.data);
//             }
//         }

//         mediaRecorder.onstop = async () => {
//             const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//             stream.getTracks().forEach(track => track.stop());
//             await sendAudioToBackend(audioBlob);
//         }

//         mediaRecorder.start();
//         setAppState('listening');
//         setDisplayText('Listening...');
//     } catch (e) {
//         console.error("Mic access denied", e); 
//         alert("Give permission to access mic");
//         setAppState('idle');
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && appState === 'listening') {
//         mediaRecorderRef.current.stop();
//         // State changes to 'processing' inside sendAudioToBackend
//     }
//   }

//   // --- STYLES ---
//   const colors = {
//     bg: '#ffffff',
//     primary: '#10b981', // Emerald green
//     primaryGlow: 'rgba(16, 185, 129, 0.4)',
//     textDark: '#0f172a',
//     textLight: '#64748b',
//     surface: '#f8fafc',
//     border: '#e2e8f0'
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       backgroundColor: colors.bg,
//       fontFamily: '"Inter", -apple-system, sans-serif',
//       color: colors.textDark,
//       overflow: 'hidden'
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '20px 30px',
//       zIndex: 10
//     },
//     brand: {
//       fontSize: '20px',
//       fontWeight: 'bold',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     select: {
//       padding: '10px 16px',
//       borderRadius: '20px',
//       border: `1px solid ${colors.border}`,
//       backgroundColor: colors.surface,
//       fontSize: '15px',
//       fontWeight: '600',
//       cursor: 'pointer',
//       outline: 'none'
//     },
//     main: {
//       flex: 1,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '20px',
//       position: 'relative'
//     },
//     micButtonWrapper: {
//       position: 'relative',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: '200px',
//       height: '200px',
//       marginBottom: '40px'
//     },
//     micButton: {
//       width: '120px',
//       height: '120px',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       color: 'white',
//       border: 'none',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       boxShadow: `0 10px 25px ${appState === 'listening' ? 'rgba(239, 68, 68, 0.4)' : colors.primaryGlow}`,
//       zIndex: 2,
//       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//       transform: appState === 'listening' ? 'scale(1.1)' : 'scale(1)',
//     },
//     ripple: {
//       position: 'absolute',
//       width: '100%',
//       height: '100%',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       opacity: 0,
//       zIndex: 1,
//       animation: appState === 'listening' 
//         ? 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' 
//         : appState === 'speaking' 
//         ? 'wave-ring 2s ease-in-out infinite alternate' 
//         : 'none',
//     },
//     statusText: {
//       fontSize: '16px',
//       fontWeight: 'bold',
//       color: appState === 'listening' ? '#ef4444' : colors.primary,
//       textTransform: 'uppercase',
//       letterSpacing: '2px',
//       marginBottom: '16px',
//       transition: 'opacity 0.3s ease',
//       opacity: appState === 'idle' ? 0.5 : 1
//     },
//     subtitleBox: {
//       maxWidth: '600px',
//       width: '100%',
//       textAlign: 'center',
//       minHeight: '120px'
//     },
//     subtitleText: {
//       fontSize: '28px',
//       lineHeight: '1.4',
//       fontWeight: '500',
//       color: colors.textDark,
//       transition: 'all 0.3s ease',
//     }
//   };

//   const getIcon = () => {
//     if (appState === 'processing') {
//       return <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />;
//     }
//     if (appState === 'speaking') {
//       return (
//         <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
//         </svg>
//       );
//     }
//     return (
//       <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//       </svg>
//     );
//   };

//   return (
//     <div style={styles.container}>
//       <style>
//         {`
//           @keyframes pulse-ring {
//             0% { transform: scale(0.8); opacity: 0.5; }
//             100% { transform: scale(1.8); opacity: 0; }
//           }
//           @keyframes wave-ring {
//             0% { transform: scale(1); opacity: 0.2; }
//             100% { transform: scale(1.3); opacity: 0.1; }
//           }
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>

//       <header style={styles.header}>
//         <div style={styles.brand}>
//           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.primary }}></div>
//           CareIndia AI
//         </div>
//         {/* FIX 4: Bind value to languageCode so it updates visually */}
//         <select style={styles.select} value={languageCode} onChange={(e) => setLanguageCode(e.target.value)}>
//           <option value="hi-IN">हिंदी (Hindi)</option>
//           <option value="en-IN">English</option>
//           <option value="bn-IN">বাংলা (Bengali)</option>
//           <option value="te-IN">తెలుగు (Telugu)</option>
//           <option value="ta-IN">தமிழ் (Tamil)</option>
//           <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
//           <option value="ml-IN">മലയാളം (Malayalam)</option>
//           <option value="mr-IN">मराठी (Marathi)</option>
//           <option value="gu-IN">ગુજરાતી (Gujarati)</option>
//           <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
//           <option value="od-IN">ଓଡ଼ିଆ (Odia)</option>
//         </select>
//       </header>

//       <main style={styles.main}>
        
//         <div style={styles.statusText}>
//           {appState === 'idle' && 'Tap to Speak'}
//           {appState === 'listening' && 'Listening...'}
//           {appState === 'processing' && 'Translating...'}
//           {appState === 'speaking' && 'AI Responding'}
//         </div>

//         <div style={styles.micButtonWrapper}>
//           <div style={styles.ripple}></div>
//           <button 
//             onClick={() => sendAudioToBackend()} 
//             style={styles.micButton}
//             disabled={appState === 'processing'}
//           >
//             {getIcon()}
//           </button>
//         </div>

//         <div style={styles.subtitleBox}>
//           <p style={{
//             ...styles.subtitleText,
//             color: appState === 'listening' ? colors.textLight : colors.textDark,
//             fontSize: displayText.length > 80 ? '22px' : '28px'
//           }}>
//             {displayText}
//           </p>
//         </div>

//       </main>
//     </div>
//   );
// }



// NEW 1

// import React, { useState } from 'react';

// export default function VoiceAppPage() {
//   const [appState, setAppState] = useState('idle');
//   const [languageCode, setLanguageCode] = useState('hi-IN');
//   const [displayText, setDisplayText] = useState(
//     'Tap the microphone and tell me how you are feeling.'
//   );

//   // 🎤 Speech-to-Text
//   const startSpeechToText = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech recognition not supported in this browser");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = languageCode;
//     recognition.interimResults = false;

//     recognition.onstart = () => {
//       setAppState("listening");
//       setDisplayText("Listening...");
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       console.log("User:", transcript);

//       setDisplayText(`You: ${transcript}`);
//       sendTextToBackend(transcript);
//     };

//     recognition.onerror = (e) => {
//       console.error(e);
//       setAppState("idle");
//       setDisplayText("Error capturing speech.");
//     };

//     recognition.start();
//   };

//   // 🔊 Send text → backend → play audio
//   const sendTextToBackend = async (text) => {
//     try {
//       setAppState("processing");
//       setDisplayText("Thinking...");

//       const audio = new Audio(
//         `https://ganglionate-unconvincedly-perla.ngrok-free.dev/tts?text=${encodeURIComponent(text)}`
//       );

//       audio.onplay = () => {
//         setAppState("speaking");
//         setDisplayText("AI is responding...");
//       };

//       audio.onended = () => {
//         setAppState("idle");
//         setDisplayText("Tap the microphone to reply.");
//       };

//       await audio.play();

//     } catch (e) {
//       console.error(e);
//       setAppState("idle");
//       setDisplayText("Connection failed.");
//     }
//   };

//   // 🎨 Styles
//   const colors = {
//     bg: '#ffffff',
//     primary: '#10b981',
//     primaryGlow: 'rgba(16, 185, 129, 0.4)',
//     textDark: '#0f172a',
//     textLight: '#64748b',
//     surface: '#f8fafc',
//     border: '#e2e8f0'
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       backgroundColor: colors.bg,
//       fontFamily: '"Inter", sans-serif',
//       color: colors.textDark
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       padding: '20px'
//     },
//     main: {
//       flex: 1,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     button: {
//       width: '120px',
//       height: '120px',
//       borderRadius: '50%',
//       backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
//       color: 'white',
//       border: 'none',
//       fontSize: '20px',
//       cursor: 'pointer'
//     },
//     text: {
//       marginTop: '20px',
//       fontSize: '20px',
//       textAlign: 'center',
//       maxWidth: '600px'
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <h2>CareIndia AI</h2>

//         <select
//           value={languageCode}
//           onChange={(e) => setLanguageCode(e.target.value)}
//         >
//           <option value="hi-IN">Hindi</option>
//           <option value="en-IN">English</option>
//         </select>
//       </header>

//       <main style={styles.main}>
//         <button
//           style={styles.button}
//           onClick={startSpeechToText}
//           disabled={appState === "processing"}
//         >
//           🎤
//         </button>

//         <p style={styles.text}>{displayText}</p>
//       </main>
//     </div>
//   );
// }

// NEW 2
// import React, { useState, useRef, useEffect } from 'react';

// const BACKEND_URL = 'https://ganglionate-unconvincedly-perla.ngrok-free.app';

// const LANGUAGES = [
//   { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
//   { code: 'en-IN', label: 'English', name: 'English' },
//   { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
//   { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
//   { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
//   { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
//   { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
//   { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
//   { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
//   { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
//   { code: 'od-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
// ];

// // ── Waveform bars rendered as SVG ──────────────────────────────────────────
// function Waveform({ active, color = '#16a34a' }) {
//   const bars = 28;
//   return (
//     <svg width="120" height="36" viewBox={`0 0 ${bars * 5 - 1} 36`} style={{ display: 'block' }}>
//       {Array.from({ length: bars }).map((_, i) => {
//         const h = active
//           ? 8 + Math.abs(Math.sin((i / bars) * Math.PI * 3)) * 22
//           : 4;
//         const y = (36 - h) / 2;
//         return (
//           <rect
//             key={i}
//             x={i * 5}
//             y={y}
//             width={3}
//             height={h}
//             rx={1.5}
//             fill={color}
//             opacity={active ? 1 : 0.3}
//             style={{
//               transition: 'height 0.15s ease, y 0.15s ease',
//               animationDelay: `${i * 0.04}s`,
//             }}
//           />
//         );
//       })}
//     </svg>
//   );
// }

// // ── Mic SVG Icon ───────────────────────────────────────────────────────────
// function MicIcon({ size = 32, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="2" width="6" height="12" rx="3" />
//       <path d="M5 10a7 7 0 0 0 14 0" />
//       <line x1="12" y1="19" x2="12" y2="22" />
//       <line x1="8" y1="22" x2="16" y2="22" />
//     </svg>
//   );
// }

// function StopIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
//       <rect x="5" y="5" width="14" height="14" rx="2" />
//     </svg>
//   );
// }

// function SpeakerIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//     </svg>
//   );
// }

// // ── Spinner ────────────────────────────────────────────────────────────────
// function Spinner({ size = 28, color = 'white' }) {
//   return (
//     <div style={{
//       width: size, height: size,
//       border: `3px solid rgba(255,255,255,0.25)`,
//       borderTop: `3px solid ${color}`,
//       borderRadius: '50%',
//       animation: 'spin 0.85s linear infinite',
//     }} />
//   );
// }

// // ── Message Bubble ─────────────────────────────────────────────────────────
// function Bubble({ role, text }) {
//   const isUser = role === 'user';
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: isUser ? 'flex-end' : 'flex-start',
//       marginBottom: '10px',
//     }}>
//       <div style={{
//         maxWidth: '72%',
//         padding: '10px 14px',
//         borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//         background: isUser ? '#16a34a' : '#f1f5f9',
//         color: isUser ? '#fff' : '#0f172a',
//         fontSize: '15px',
//         lineHeight: '1.5',
//         fontFamily: "'DM Sans', sans-serif",
//         letterSpacing: '-0.01em',
//       }}>
//         {text}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function AppPage() {
//   // States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [language, setLanguage] = useState(LANGUAGES[0]);
//   const [messages, setMessages] = useState([]);
//   const [statusMsg, setStatusMsg] = useState('Tap the mic and speak');
//   const [animFrame, setAnimFrame] = useState(0);
//   const [showLangPicker, setShowLangPicker] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const animRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const currentAudioRef = useRef(null);

//   // ── Waveform animation loop while listening ──────────────────────────────
//   useEffect(() => {
//     if (appState === 'listening' || appState === 'speaking') {
//       animRef.current = setInterval(() => {
//         setAnimFrame(f => f + 1);
//       }, 120);
//     } else {
//       clearInterval(animRef.current);
//     }
//     return () => clearInterval(animRef.current);
//   }, [appState]);

//   // ── Auto-scroll messages ─────────────────────────────────────────────────
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ── Start recording ──────────────────────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
//       audioChunksRef.current = [];

//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';

//       const recorder = new MediaRecorder(stream, { mimeType });
//       mediaRecorderRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       recorder.onstop = async () => {
//         const blob = new Blob(audioChunksRef.current, { type: mimeType });
//         streamRef.current?.getTracks().forEach(t => t.stop());
//         await sendAudioToBackend(blob);
//       };

//       recorder.start(250);
//       setAppState('listening');
//       setStatusMsg('Listening… tap again to send');
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatusMsg('Microphone access denied.');
//     }
//   };

//   // ── Stop recording ───────────────────────────────────────────────────────
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       setAppState('processing');
//       setStatusMsg('Transcribing with Sarvam AI…');
//     }
//   };

//   // ── Full pipeline: audio → STT → Ollama → TTS → play ────────────────────
//   const sendAudioToBackend = async (blob) => {
//     try {
//       // Step 1 — STT via Sarvam
//       setStatusMsg('Transcribing with Sarvam AI…');
//       const formData = new FormData();
//       formData.append('file', blob, 'voice.webm');
//       formData.append('language', language.code);

//       const sttRes = await fetch(`${BACKEND_URL}/stt`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!sttRes.ok) throw new Error(`STT failed: ${sttRes.status}`);
//       const { text: userText } = await sttRes.json();

//       setMessages(prev => [...prev, { role: 'user', text: userText }]);

//       // Step 2 — Ollama (translate → respond → translate back) via backend
//       setStatusMsg('Ollama is thinking…');
//       const chatRes = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: userText, language: language.code }),
//       });

//       if (!chatRes.ok) throw new Error(`Chat failed: ${chatRes.status}`);
//       const { response: aiText } = await chatRes.json();

//       setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

//       // Step 3 — TTS via Sarvam → play audio
//       setStatusMsg('Generating voice response…');
//       const ttsRes = await fetch(
//         `${BACKEND_URL}/tts?text=${encodeURIComponent(aiText)}&lang=${language.code}`
//       );

//       if (!ttsRes.ok) throw new Error(`TTS failed: ${ttsRes.status}`);
//       const audioBlob = await ttsRes.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       currentAudioRef.current = audio;

//       audio.onplay = () => {
//         setAppState('speaking');
//         setStatusMsg('Playing AI response…');
//       };
//       audio.onended = () => {
//         setAppState('idle');
//         setStatusMsg('Tap the mic to reply');
//         URL.revokeObjectURL(audioUrl);
//       };
//       audio.onerror = () => {
//         setAppState('idle');
//         setStatusMsg('Audio playback failed.');
//       };

//       await audio.play();

//     } catch (err) {
//       console.error('Pipeline error:', err);
//       setAppState('idle');
//       setStatusMsg(`Error: ${err.message}`);
//     }
//   };

//   // ── Stop speaking ────────────────────────────────────────────────────────
//   const stopSpeaking = () => {
//     currentAudioRef.current?.pause();
//     setAppState('idle');
//     setStatusMsg('Tap the mic to speak');
//   };

//   // ── Mic button handler ───────────────────────────────────────────────────
//   const handleMicClick = () => {
//     if (appState === 'processing') return;
//     if (appState === 'speaking') { stopSpeaking(); return; }
//     if (appState === 'listening') { stopRecording(); return; }
//     startRecording();
//   };

//   // ── Derived UI values ────────────────────────────────────────────────────
//   const btnColor =
//     appState === 'listening' ? '#dc2626' :
//     appState === 'speaking'  ? '#2563eb' :
//     appState === 'processing'? '#6b7280' :
//     '#16a34a';

//   const ringColor =
//     appState === 'listening' ? 'rgba(220,38,38,0.35)' :
//     appState === 'speaking'  ? 'rgba(37,99,235,0.3)' :
//     'transparent';

//   const ringActive = appState === 'listening' || appState === 'speaking';

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       background: '#ffffff',
//       fontFamily: "'DM Sans', 'Inter', sans-serif",
//       color: '#0f172a',
//       overflow: 'hidden',
//     }}>

//       {/* ── Keyframes injected once ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes ring-pulse {
//           0%   { transform: scale(1);   opacity: 0.7; }
//           100% { transform: scale(1.65); opacity: 0;   }
//         }
//         @keyframes ring-pulse2 {
//           0%   { transform: scale(1);   opacity: 0.45; }
//           100% { transform: scale(1.45); opacity: 0;   }
//         }
//         @keyframes bar-bounce {
//           0%, 100% { transform: scaleY(1); }
//           50%       { transform: scaleY(1.7); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0);   }
//         }
//         .lang-option:hover { background: #f0fdf4 !important; }
//       `}</style>

//       {/* ── Header ── */}
//       <header style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '14px 20px',
//         borderBottom: '1px solid #e2e8f0',
//         flexShrink: 0,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{
//             width: 10, height: 10, borderRadius: '50%',
//             background: '#16a34a',
//             boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
//           }} />
//           <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>
//             CareIndia AI
//           </span>
//         </div>

//         {/* Language picker */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setShowLangPicker(p => !p)}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 6,
//               padding: '7px 14px',
//               border: '1px solid #d1d5db',
//               borderRadius: 20,
//               background: '#f9fafb',
//               cursor: 'pointer',
//               fontSize: 14,
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 500,
//               color: '#374151',
//             }}
//           >
//             <span>{language.label}</span>
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//               stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </button>

//           {showLangPicker && (
//             <div style={{
//               position: 'absolute', right: 0, top: 'calc(100% + 6px)',
//               background: '#fff',
//               border: '1px solid #e2e8f0',
//               borderRadius: 12,
//               boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
//               zIndex: 100,
//               overflow: 'hidden',
//               minWidth: 180,
//               animation: 'fadeUp 0.15s ease',
//             }}>
//               {LANGUAGES.map(lang => (
//                 <div
//                   key={lang.code}
//                   className="lang-option"
//                   onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
//                   style={{
//                     padding: '10px 16px',
//                     cursor: 'pointer',
//                     fontSize: 14,
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     background: lang.code === language.code ? '#f0fdf4' : '#fff',
//                     color: lang.code === language.code ? '#16a34a' : '#374151',
//                     fontWeight: lang.code === language.code ? 600 : 400,
//                     transition: 'background 0.1s',
//                   }}
//                 >
//                   <span style={{ fontSize: 16 }}>{lang.label}</span>
//                   <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang.name}</span>
//                   {lang.code === language.code && (
//                     <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* ── Chat transcript ── */}
//       <div style={{
//         flex: 1,
//         overflowY: 'auto',
//         padding: '16px 20px',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {messages.length === 0 && (
//           <div style={{
//             flex: 1, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             color: '#94a3b8', textAlign: 'center', gap: 8,
//           }}>
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
//               stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
//               <rect x="9" y="2" width="6" height="12" rx="3" />
//               <path d="M5 10a7 7 0 0 0 14 0" />
//               <line x1="12" y1="19" x2="12" y2="22" />
//               <line x1="8" y1="22" x2="16" y2="22" />
//             </svg>
//             <p style={{ fontSize: 15, margin: 0 }}>Your conversation will appear here</p>
//             <p style={{ fontSize: 13, margin: 0 }}>Speak in <strong style={{ color: '#16a34a' }}>{language.name}</strong></p>
//           </div>
//         )}

//         {messages.map((msg, i) => (
//           <div key={i} style={{ animation: 'fadeUp 0.2s ease' }}>
//             <Bubble role={msg.role} text={msg.text} />
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ── Pipeline status pill ── */}
//       <div style={{
//         display: 'flex', justifyContent: 'center',
//         padding: '4px 0 2px',
//         flexShrink: 0,
//       }}>
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 6,
//           padding: '5px 14px',
//           borderRadius: 999,
//           background: '#f1f5f9',
//           fontSize: 12,
//           color: '#64748b',
//           fontFamily: "'DM Mono', monospace",
//           letterSpacing: '0.02em',
//         }}>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam STT</span>
//           <span>→</span>
//           <span style={{ color: '#2563eb', fontWeight: 600 }}>Ollama</span>
//           <span>→</span>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam TTS</span>
//         </div>
//       </div>

//       {/* ── Bottom control zone ── */}
//       <div style={{
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: '20px 20px 32px',
//         gap: 16,
//         borderTop: '1px solid #f1f5f9',
//       }}>
//         {/* Waveform — shown when listening or speaking */}
//         <div style={{
//           height: 36,
//           opacity: (appState === 'listening' || appState === 'speaking') ? 1 : 0,
//           transition: 'opacity 0.3s',
//         }}>
//           <Waveform
//             active={appState === 'listening' || appState === 'speaking'}
//             color={appState === 'speaking' ? '#2563eb' : '#dc2626'}
//             key={animFrame}
//           />
//         </div>

//         {/* Status text */}
//         <p style={{
//           margin: 0,
//           fontSize: 13,
//           color: '#64748b',
//           letterSpacing: '-0.01em',
//           textAlign: 'center',
//           minHeight: 18,
//           transition: 'color 0.2s',
//         }}>
//           {statusMsg}
//         </p>

//         {/* Mic button with ring animations */}
//         <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           {/* Outer ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse 1.4s ease-out infinite',
//               zIndex: 0,
//             }} />
//           )}
//           {/* Inner ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse2 1.4s ease-out 0.45s infinite',
//               zIndex: 0,
//             }} />
//           )}

//           <button
//             onClick={handleMicClick}
//             disabled={appState === 'processing'}
//             style={{
//               position: 'relative', zIndex: 1,
//               width: 72, height: 72,
//               borderRadius: '50%',
//               background: btnColor,
//               border: 'none',
//               cursor: appState === 'processing' ? 'not-allowed' : 'pointer',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               transition: 'background 0.25s, transform 0.15s',
//               transform: appState === 'listening' ? 'scale(1.08)' : 'scale(1)',
//               boxShadow: `0 4px 20px ${btnColor}55`,
//             }}
//           >
//             {appState === 'processing' && <Spinner size={26} />}
//             {appState === 'listening' && <StopIcon size={26} />}
//             {appState === 'speaking'  && <SpeakerIcon size={26} />}
//             {appState === 'idle'      && <MicIcon size={30} />}
//           </button>
//         </div>

//         {/* Tap hint */}
//         <p style={{
//           margin: 0,
//           fontSize: 11,
//           color: '#cbd5e1',
//           letterSpacing: '0.04em',
//           textTransform: 'uppercase',
//         }}>
//           {appState === 'idle'       && 'Tap to start speaking'}
//           {appState === 'listening'  && 'Tap to stop & send'}
//           {appState === 'processing' && 'Processing…'}
//           {appState === 'speaking'   && 'Tap to stop'}
//         </p>
//       </div>

//       {/* Click outside to close lang picker */}
//       {showLangPicker && (
//         <div
//           onClick={() => setShowLangPicker(false)}
//           style={{ position: 'fixed', inset: 0, zIndex: 99 }}
//         />
//       )}
//     </div>
//   );
// }

// //NEW3
// import React, { useState, useRef, useEffect } from 'react';

// // Relative URL → Vite proxy rewrites to ngrok. No cross-origin = no CORS preflight.
// const BACKEND_URL = '';

// const LANGUAGES = [
//   { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
//   { code: 'en-IN', label: 'English', name: 'English' },
//   { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
//   { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
//   { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
//   { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
//   { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
//   { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
//   { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
//   { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
//   { code: 'od-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
// ];

// // ── Waveform bars rendered as SVG ──────────────────────────────────────────
// function Waveform({ active, color = '#16a34a' }) {
//   const bars = 28;
//   return (
//     <svg width="120" height="36" viewBox={`0 0 ${bars * 5 - 1} 36`} style={{ display: 'block' }}>
//       {Array.from({ length: bars }).map((_, i) => {
//         const h = active
//           ? 8 + Math.abs(Math.sin((i / bars) * Math.PI * 3)) * 22
//           : 4;
//         const y = (36 - h) / 2;
//         return (
//           <rect
//             key={i}
//             x={i * 5}
//             y={y}
//             width={3}
//             height={h}
//             rx={1.5}
//             fill={color}
//             opacity={active ? 1 : 0.3}
//             style={{
//               transition: 'height 0.15s ease, y 0.15s ease',
//               animationDelay: `${i * 0.04}s`,
//             }}
//           />
//         );
//       })}
//     </svg>
//   );
// }

// // ── Mic SVG Icon ───────────────────────────────────────────────────────────
// function MicIcon({ size = 32, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="2" width="6" height="12" rx="3" />
//       <path d="M5 10a7 7 0 0 0 14 0" />
//       <line x1="12" y1="19" x2="12" y2="22" />
//       <line x1="8" y1="22" x2="16" y2="22" />
//     </svg>
//   );
// }

// function StopIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
//       <rect x="5" y="5" width="14" height="14" rx="2" />
//     </svg>
//   );
// }

// function SpeakerIcon({ size = 28, color = 'white' }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//       <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//       <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//     </svg>
//   );
// }

// // ── Spinner ────────────────────────────────────────────────────────────────
// function Spinner({ size = 28, color = 'white' }) {
//   return (
//     <div style={{
//       width: size, height: size,
//       border: `3px solid rgba(255,255,255,0.25)`,
//       borderTop: `3px solid ${color}`,
//       borderRadius: '50%',
//       animation: 'spin 0.85s linear infinite',
//     }} />
//   );
// }

// // ── Message Bubble ─────────────────────────────────────────────────────────
// function Bubble({ role, text }) {
//   const isUser = role === 'user';
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: isUser ? 'flex-end' : 'flex-start',
//       marginBottom: '10px',
//     }}>
//       <div style={{
//         maxWidth: '72%',
//         padding: '10px 14px',
//         borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//         background: isUser ? '#16a34a' : '#f1f5f9',
//         color: isUser ? '#fff' : '#0f172a',
//         fontSize: '15px',
//         lineHeight: '1.5',
//         fontFamily: "'DM Sans', sans-serif",
//         letterSpacing: '-0.01em',
//       }}>
//         {text}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function AppPage() {
//   // States: 'idle' | 'listening' | 'processing' | 'speaking'
//   const [appState, setAppState] = useState('idle');
//   const [language, setLanguage] = useState(LANGUAGES[0]);
//   const [messages, setMessages] = useState([]);
//   const [statusMsg, setStatusMsg] = useState('Tap the mic and speak');
//   const [animFrame, setAnimFrame] = useState(0);
//   const [showLangPicker, setShowLangPicker] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);
//   const animRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const currentAudioRef = useRef(null);

//   // ── Waveform animation loop while listening ──────────────────────────────
//   useEffect(() => {
//     if (appState === 'listening' || appState === 'speaking') {
//       animRef.current = setInterval(() => {
//         setAnimFrame(f => f + 1);
//       }, 120);
//     } else {
//       clearInterval(animRef.current);
//     }
//     return () => clearInterval(animRef.current);
//   }, [appState]);

//   // ── Auto-scroll messages ─────────────────────────────────────────────────
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ── Start recording ──────────────────────────────────────────────────────
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;
//       audioChunksRef.current = [];

//       const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
//         ? 'audio/webm;codecs=opus'
//         : 'audio/webm';

//       const recorder = new MediaRecorder(stream, { mimeType });
//       mediaRecorderRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       recorder.onstop = async () => {
//         const blob = new Blob(audioChunksRef.current, { type: mimeType });
//         streamRef.current?.getTracks().forEach(t => t.stop());
//         await sendAudioToBackend(blob);
//       };

//       recorder.start(250);
//       setAppState('listening');
//       setStatusMsg('Listening… tap again to send');
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatusMsg('Microphone access denied.');
//     }
//   };

//   // ── Stop recording ───────────────────────────────────────────────────────
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
//       mediaRecorderRef.current.stop();
//       setAppState('processing');
//       setStatusMsg('Transcribing with Sarvam AI…');
//     }
//   };

//   // ── Full pipeline: audio → STT → Ollama → TTS → play ────────────────────
//   const sendAudioToBackend = async (blob) => {
//     try {
//       // Step 1 — STT via Sarvam
//       setStatusMsg('Transcribing with Sarvam AI…');
//       const formData = new FormData();
//       formData.append('file', blob, 'voice.webm');
//       formData.append('language', language.code);

//       const sttRes = await fetch(`${BACKEND_URL}/stt`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!sttRes.ok) throw new Error(`STT failed: ${sttRes.status}`);
//       const { text: userText } = await sttRes.json();

//       setMessages(prev => [...prev, { role: 'user', text: userText }]);

//       // Step 2 — Ollama (translate → respond → translate back) via backend
//       setStatusMsg('Ollama is thinking…');
//       const chatRes = await fetch(`${BACKEND_URL}/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: userText, language: language.code }),
//       });

//       if (!chatRes.ok) throw new Error(`Chat failed: ${chatRes.status}`);
//       const { response: aiText } = await chatRes.json();

//       setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

//       // Step 3 — TTS via Sarvam → play audio
//       setStatusMsg('Generating voice response…');
//       const ttsRes = await fetch(
//         `${BACKEND_URL}/tts?text=${encodeURIComponent(aiText)}&lang=${language.code}`,
// {}
//       );

//       if (!ttsRes.ok) throw new Error(`TTS failed: ${ttsRes.status}`);
//       const audioBlob = await ttsRes.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       currentAudioRef.current = audio;

//       audio.onplay = () => {
//         setAppState('speaking');
//         setStatusMsg('Playing AI response…');
//       };
//       audio.onended = () => {
//         setAppState('idle');
//         setStatusMsg('Tap the mic to reply');
//         URL.revokeObjectURL(audioUrl);
//       };
//       audio.onerror = () => {
//         setAppState('idle');
//         setStatusMsg('Audio playback failed.');
//       };

//       await audio.play();

//     } catch (err) {
//       console.error('Pipeline error:', err);
//       setAppState('idle');
//       setStatusMsg(`Error: ${err.message}`);
//     }
//   };

//   // ── Stop speaking ────────────────────────────────────────────────────────
//   const stopSpeaking = () => {
//     currentAudioRef.current?.pause();
//     setAppState('idle');
//     setStatusMsg('Tap the mic to speak');
//   };

//   // ── Mic button handler ───────────────────────────────────────────────────
//   const handleMicClick = () => {
//     if (appState === 'processing') return;
//     if (appState === 'speaking') { stopSpeaking(); return; }
//     if (appState === 'listening') { stopRecording(); return; }
//     startRecording();
//   };

//   // ── Derived UI values ────────────────────────────────────────────────────
//   const btnColor =
//     appState === 'listening' ? '#dc2626' :
//     appState === 'speaking'  ? '#2563eb' :
//     appState === 'processing'? '#6b7280' :
//     '#16a34a';

//   const ringColor =
//     appState === 'listening' ? 'rgba(220,38,38,0.35)' :
//     appState === 'speaking'  ? 'rgba(37,99,235,0.3)' :
//     'transparent';

//   const ringActive = appState === 'listening' || appState === 'speaking';

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       background: '#ffffff',
//       fontFamily: "'DM Sans', 'Inter', sans-serif",
//       color: '#0f172a',
//       overflow: 'hidden',
//     }}>

//       {/* ── Keyframes injected once ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes ring-pulse {
//           0%   { transform: scale(1);   opacity: 0.7; }
//           100% { transform: scale(1.65); opacity: 0;   }
//         }
//         @keyframes ring-pulse2 {
//           0%   { transform: scale(1);   opacity: 0.45; }
//           100% { transform: scale(1.45); opacity: 0;   }
//         }
//         @keyframes bar-bounce {
//           0%, 100% { transform: scaleY(1); }
//           50%       { transform: scaleY(1.7); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0);   }
//         }
//         .lang-option:hover { background: #f0fdf4 !important; }
//       `}</style>

//       {/* ── Header ── */}
//       <header style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '14px 20px',
//         borderBottom: '1px solid #e2e8f0',
//         flexShrink: 0,
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{
//             width: 10, height: 10, borderRadius: '50%',
//             background: '#16a34a',
//             boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
//           }} />
//           <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>
//             CareIndia AI
//           </span>
//         </div>

//         {/* Language picker */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setShowLangPicker(p => !p)}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 6,
//               padding: '7px 14px',
//               border: '1px solid #d1d5db',
//               borderRadius: 20,
//               background: '#f9fafb',
//               cursor: 'pointer',
//               fontSize: 14,
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 500,
//               color: '#374151',
//             }}
//           >
//             <span>{language.label}</span>
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//               stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </button>

//           {showLangPicker && (
//             <div style={{
//               position: 'absolute', right: 0, top: 'calc(100% + 6px)',
//               background: '#fff',
//               border: '1px solid #e2e8f0',
//               borderRadius: 12,
//               boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
//               zIndex: 100,
//               overflow: 'hidden',
//               minWidth: 180,
//               animation: 'fadeUp 0.15s ease',
//             }}>
//               {LANGUAGES.map(lang => (
//                 <div
//                   key={lang.code}
//                   className="lang-option"
//                   onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
//                   style={{
//                     padding: '10px 16px',
//                     cursor: 'pointer',
//                     fontSize: 14,
//                     display: 'flex', alignItems: 'center', gap: 10,
//                     background: lang.code === language.code ? '#f0fdf4' : '#fff',
//                     color: lang.code === language.code ? '#16a34a' : '#374151',
//                     fontWeight: lang.code === language.code ? 600 : 400,
//                     transition: 'background 0.1s',
//                   }}
//                 >
//                   <span style={{ fontSize: 16 }}>{lang.label}</span>
//                   <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang.name}</span>
//                   {lang.code === language.code && (
//                     <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* ── Chat transcript ── */}
//       <div style={{
//         flex: 1,
//         overflowY: 'auto',
//         padding: '16px 20px',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {messages.length === 0 && (
//           <div style={{
//             flex: 1, display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             color: '#94a3b8', textAlign: 'center', gap: 8,
//           }}>
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
//               stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
//               <rect x="9" y="2" width="6" height="12" rx="3" />
//               <path d="M5 10a7 7 0 0 0 14 0" />
//               <line x1="12" y1="19" x2="12" y2="22" />
//               <line x1="8" y1="22" x2="16" y2="22" />
//             </svg>
//             <p style={{ fontSize: 15, margin: 0 }}>Your conversation will appear here</p>
//             <p style={{ fontSize: 13, margin: 0 }}>Speak in <strong style={{ color: '#16a34a' }}>{language.name}</strong></p>
//           </div>
//         )}

//         {messages.map((msg, i) => (
//           <div key={i} style={{ animation: 'fadeUp 0.2s ease' }}>
//             <Bubble role={msg.role} text={msg.text} />
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ── Pipeline status pill ── */}
//       <div style={{
//         display: 'flex', justifyContent: 'center',
//         padding: '4px 0 2px',
//         flexShrink: 0,
//       }}>
//         <div style={{
//           display: 'inline-flex', alignItems: 'center', gap: 6,
//           padding: '5px 14px',
//           borderRadius: 999,
//           background: '#f1f5f9',
//           fontSize: 12,
//           color: '#64748b',
//           fontFamily: "'DM Mono', monospace",
//           letterSpacing: '0.02em',
//         }}>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam STT</span>
//           <span>→</span>
//           <span style={{ color: '#2563eb', fontWeight: 600 }}>Ollama</span>
//           <span>→</span>
//           <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam TTS</span>
//         </div>
//       </div>

//       {/* ── Bottom control zone ── */}
//       <div style={{
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: '20px 20px 32px',
//         gap: 16,
//         borderTop: '1px solid #f1f5f9',
//       }}>
//         {/* Waveform — shown when listening or speaking */}
//         <div style={{
//           height: 36,
//           opacity: (appState === 'listening' || appState === 'speaking') ? 1 : 0,
//           transition: 'opacity 0.3s',
//         }}>
//           <Waveform
//             active={appState === 'listening' || appState === 'speaking'}
//             color={appState === 'speaking' ? '#2563eb' : '#dc2626'}
//             key={animFrame}
//           />
//         </div>

//         {/* Status text */}
//         <p style={{
//           margin: 0,
//           fontSize: 13,
//           color: '#64748b',
//           letterSpacing: '-0.01em',
//           textAlign: 'center',
//           minHeight: 18,
//           transition: 'color 0.2s',
//         }}>
//           {statusMsg}
//         </p>

//         {/* Mic button with ring animations */}
//         <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           {/* Outer ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse 1.4s ease-out infinite',
//               zIndex: 0,
//             }} />
//           )}
//           {/* Inner ring */}
//           {ringActive && (
//             <div style={{
//               position: 'absolute',
//               width: 80, height: 80,
//               borderRadius: '50%',
//               background: ringColor,
//               animation: 'ring-pulse2 1.4s ease-out 0.45s infinite',
//               zIndex: 0,
//             }} />
//           )}

//           <button
//             onClick={handleMicClick}
//             disabled={appState === 'processing'}
//             style={{
//               position: 'relative', zIndex: 1,
//               width: 72, height: 72,
//               borderRadius: '50%',
//               background: btnColor,
//               border: 'none',
//               cursor: appState === 'processing' ? 'not-allowed' : 'pointer',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               transition: 'background 0.25s, transform 0.15s',
//               transform: appState === 'listening' ? 'scale(1.08)' : 'scale(1)',
//               boxShadow: `0 4px 20px ${btnColor}55`,
//             }}
//           >
//             {appState === 'processing' && <Spinner size={26} />}
//             {appState === 'listening' && <StopIcon size={26} />}
//             {appState === 'speaking'  && <SpeakerIcon size={26} />}
//             {appState === 'idle'      && <MicIcon size={30} />}
//           </button>
//         </div>

//         {/* Tap hint */}
//         <p style={{
//           margin: 0,
//           fontSize: 11,
//           color: '#cbd5e1',
//           letterSpacing: '0.04em',
//           textTransform: 'uppercase',
//         }}>
//           {appState === 'idle'       && 'Tap to start speaking'}
//           {appState === 'listening'  && 'Tap to stop & send'}
//           {appState === 'processing' && 'Processing…'}
//           {appState === 'speaking'   && 'Tap to stop'}
//         </p>
//       </div>

//       {/* Click outside to close lang picker */}
//       {showLangPicker && (
//         <div
//           onClick={() => setShowLangPicker(false)}
//           style={{ position: 'fixed', inset: 0, zIndex: 99 }}
//         />
//       )}
//     </div>
//   );
// }

//new 4
import React, { useState, useRef, useEffect } from 'react';

// Relative URL → Vite proxy rewrites to ngrok. No cross-origin = no CORS preflight.
const BACKEND_URL = '';

// Sarvam API key — TTS called directly from browser to avoid proxy byte-corruption
const SARVAM_KEY = 'sk_kkry1f3l_psgNHGomerUrTEEWd1YNN28D';

const LANG_SPEAKERS = {
  'hi-IN': 'meera',
  'en-IN': 'meera',
  'bn-IN': 'meera',
  'te-IN': 'meera',
  'ta-IN': 'meera',
  'kn-IN': 'meera',
  'ml-IN': 'meera',
  'mr-IN': 'meera',
  'gu-IN': 'meera',
  'pa-IN': 'meera',
  'od-IN': 'meera',
};

const LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
  { code: 'en-IN', label: 'English', name: 'English' },
  { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
  { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
  { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
  { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
  { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
  { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
  { code: 'od-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
];

// ── Waveform bars rendered as SVG ──────────────────────────────────────────
function Waveform({ active, color = '#16a34a' }) {
  const bars = 28;
  return (
    <svg width="120" height="36" viewBox={`0 0 ${bars * 5 - 1} 36`} style={{ display: 'block' }}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = active
          ? 8 + Math.abs(Math.sin((i / bars) * Math.PI * 3)) * 22
          : 4;
        const y = (36 - h) / 2;
        return (
          <rect
            key={i}
            x={i * 5}
            y={y}
            width={3}
            height={h}
            rx={1.5}
            fill={color}
            opacity={active ? 1 : 0.3}
            style={{
              transition: 'height 0.15s ease, y 0.15s ease',
              animationDelay: `${i * 0.04}s`,
            }}
          />
        );
      })}
    </svg>
  );
}

// ── Mic SVG Icon ───────────────────────────────────────────────────────────
function MicIcon({ size = 32, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

function StopIcon({ size = 28, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}

function SpeakerIcon({ size = 28, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

// ── Spinner ────────────────────────────────────────────────────────────────
function Spinner({ size = 28, color = 'white' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid rgba(255,255,255,0.25)`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.85s linear infinite',
    }} />
  );
}

// ── Message Bubble ─────────────────────────────────────────────────────────
function Bubble({ role, text }) {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '10px',
    }}>
      <div style={{
        maxWidth: '72%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? '#16a34a' : '#f1f5f9',
        color: isUser ? '#fff' : '#0f172a',
        fontSize: '15px',
        lineHeight: '1.5',
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: '-0.01em',
      }}>
        {text}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function AppPage() {
  // States: 'idle' | 'listening' | 'processing' | 'speaking'
  const [appState, setAppState] = useState('idle');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [messages, setMessages] = useState([]);
  const [statusMsg, setStatusMsg] = useState('Tap the mic and speak');
  const [animFrame, setAnimFrame] = useState(0);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const animRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentAudioRef = useRef(null);

  // ── Waveform animation loop while listening ──────────────────────────────
  useEffect(() => {
    if (appState === 'listening' || appState === 'speaking') {
      animRef.current = setInterval(() => {
        setAnimFrame(f => f + 1);
      }, 120);
    } else {
      clearInterval(animRef.current);
    }
    return () => clearInterval(animRef.current);
  }, [appState]);

  // ── Auto-scroll messages ─────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Start recording ──────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        streamRef.current?.getTracks().forEach(t => t.stop());
        await sendAudioToBackend(blob);
      };

      recorder.start(250);
      setAppState('listening');
      setStatusMsg('Listening… tap again to send');
    } catch (err) {
      console.error('Mic error:', err);
      setStatusMsg('Microphone access denied.');
    }
  };

  // ── Stop recording ───────────────────────────────────────────────────────
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setAppState('processing');
      setStatusMsg('Transcribing with Sarvam AI…');
    }
  };

  // ── Full pipeline: audio → STT → Ollama → TTS → play ────────────────────
  const sendAudioToBackend = async (blob) => {
    try {
      // Step 1 — STT via Sarvam
      setStatusMsg('Transcribing with Sarvam AI…');
      const formData = new FormData();
      formData.append('file', blob, 'voice.webm');
      formData.append('language', language.code);

      const sttRes = await fetch(`${BACKEND_URL}/stt`, {
        method: 'POST',
        body: formData,
      });

      if (!sttRes.ok) throw new Error(`STT failed: ${sttRes.status}`);
      const { text: userText } = await sttRes.json();

      setMessages(prev => [...prev, { role: 'user', text: userText }]);

      // Step 2 — Ollama (translate → respond → translate back) via backend
      setStatusMsg('Ollama is thinking…');
      const chatRes = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userText, language: language.code }),
      });

      if (!chatRes.ok) throw new Error(`Chat failed: ${chatRes.status}`);
      const { response: aiText } = await chatRes.json();

      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);

      // Step 3 — TTS: call Sarvam directly from browser (exact pattern from Sarvam docs)
      // Step 3 — TTS: call Sarvam directly from browser
      setStatusMsg('Generating voice response…');
      const ttsRes = await fetch('https://api.sarvam.ai/text-to-speech', { // Removed /stream
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: aiText.slice(0, 500),
          target_language_code: language.code,
          speaker: 'anushka', // 'meera' is generally unsupported on newer models
          model: 'bulbul:v2', // Upgraded from the deprecated bulbul:v1
          pace: 1.1,
          speech_sample_rate: 22050,
        }),
      });

      if (!ttsRes.ok) {
        const errorText = await ttsRes.text();
        throw new Error(`TTS failed: ${ttsRes.status} - ${errorText}`);
      }

      const data = await ttsRes.json();
      if (!data.audios || data.audios.length === 0) {
        throw new Error('TTS returned empty audio data');
      }

      // Sarvam returns Base64 encoded audio. We need to decode it to a binary Blob.
      const base64Audio = data.audios[0];
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Note: bulbul:v2 REST default is WAV format
      const audioBlob = new Blob([bytes], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      await new Promise((resolve, reject) => {
        audio.oncanplaythrough = resolve;
        audio.onerror = () => reject(new Error(`Audio playback failed: ${audio.error?.message}`));
        audio.load();
      });

      audio.onplay = () => {
        setAppState('speaking');
        setStatusMsg('Playing AI response…');
      };
      
      audio.onended = () => {
        setAppState('idle');
        setStatusMsg('Tap the mic to reply');
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();

    } catch (err) {
      console.error('Pipeline error:', err);
      setAppState('idle');
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  // ── Stop speaking ────────────────────────────────────────────────────────
  const stopSpeaking = () => {
    currentAudioRef.current?.pause();
    setAppState('idle');
    setStatusMsg('Tap the mic to speak');
  };

  // ── Mic button handler ───────────────────────────────────────────────────
  const handleMicClick = () => {
    if (appState === 'processing') return;
    if (appState === 'speaking') { stopSpeaking(); return; }
    if (appState === 'listening') { stopRecording(); return; }
    startRecording();
  };

  // ── Derived UI values ────────────────────────────────────────────────────
  const btnColor =
    appState === 'listening' ? '#dc2626' :
    appState === 'speaking'  ? '#2563eb' :
    appState === 'processing'? '#6b7280' :
    '#16a34a';

  const ringColor =
    appState === 'listening' ? 'rgba(220,38,38,0.35)' :
    appState === 'speaking'  ? 'rgba(37,99,235,0.3)' :
    'transparent';

  const ringActive = appState === 'listening' || appState === 'speaking';

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#ffffff',
      fontFamily: "'DM Sans', 'Inter', sans-serif",
      color: '#0f172a',
      overflow: 'hidden',
    }}>

      {/* ── Keyframes injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ring-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.65); opacity: 0;   }
        }
        @keyframes ring-pulse2 {
          0%   { transform: scale(1);   opacity: 0.45; }
          100% { transform: scale(1.45); opacity: 0;   }
        }
        @keyframes bar-bounce {
          0%, 100% { transform: scaleY(1); }
          50%       { transform: scaleY(1.7); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .lang-option:hover { background: #f0fdf4 !important; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: '1px solid #e2e8f0',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#16a34a',
            boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
          }} />
          <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>
            CareIndia AI
          </span>
        </div>

        {/* Language picker */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLangPicker(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px',
              border: '1px solid #d1d5db',
              borderRadius: 20,
              background: '#f9fafb',
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              color: '#374151',
            }}
          >
            <span>{language.label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showLangPicker && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
              zIndex: 100,
              overflow: 'hidden',
              minWidth: 180,
              animation: 'fadeUp 0.15s ease',
            }}>
              {LANGUAGES.map(lang => (
                <div
                  key={lang.code}
                  className="lang-option"
                  onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
                  style={{
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: 14,
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: lang.code === language.code ? '#f0fdf4' : '#fff',
                    color: lang.code === language.code ? '#16a34a' : '#374151',
                    fontWeight: lang.code === language.code ? 600 : 400,
                    transition: 'background 0.1s',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{lang.label}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang.name}</span>
                  {lang.code === language.code && (
                    <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── Chat transcript ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {messages.length === 0 && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: '#94a3b8', textAlign: 'center', gap: 8,
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
            <p style={{ fontSize: 15, margin: 0 }}>Your conversation will appear here</p>
            <p style={{ fontSize: 13, margin: 0 }}>Speak in <strong style={{ color: '#16a34a' }}>{language.name}</strong></p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ animation: 'fadeUp 0.2s ease' }}>
            <Bubble role={msg.role} text={msg.text} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Pipeline status pill ── */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        padding: '4px 0 2px',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px',
          borderRadius: 999,
          background: '#f1f5f9',
          fontSize: 12,
          color: '#64748b',
          fontFamily: "'DM Mono', monospace",
          letterSpacing: '0.02em',
        }}>
          <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam STT</span>
          <span>→</span>
          <span style={{ color: '#2563eb', fontWeight: 600 }}>Ollama</span>
          <span>→</span>
          <span style={{ color: '#16a34a', fontWeight: 600 }}>Sarvam TTS</span>
        </div>
      </div>

      {/* ── Bottom control zone ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 20px 32px',
        gap: 16,
        borderTop: '1px solid #f1f5f9',
      }}>
        {/* Waveform — shown when listening or speaking */}
        <div style={{
          height: 36,
          opacity: (appState === 'listening' || appState === 'speaking') ? 1 : 0,
          transition: 'opacity 0.3s',
        }}>
          <Waveform
            active={appState === 'listening' || appState === 'speaking'}
            color={appState === 'speaking' ? '#2563eb' : '#dc2626'}
            key={animFrame}
          />
        </div>

        {/* Status text */}
        <p style={{
          margin: 0,
          fontSize: 13,
          color: '#64748b',
          letterSpacing: '-0.01em',
          textAlign: 'center',
          minHeight: 18,
          transition: 'color 0.2s',
        }}>
          {statusMsg}
        </p>

        {/* Mic button with ring animations */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Outer ring */}
          {ringActive && (
            <div style={{
              position: 'absolute',
              width: 80, height: 80,
              borderRadius: '50%',
              background: ringColor,
              animation: 'ring-pulse 1.4s ease-out infinite',
              zIndex: 0,
            }} />
          )}
          {/* Inner ring */}
          {ringActive && (
            <div style={{
              position: 'absolute',
              width: 80, height: 80,
              borderRadius: '50%',
              background: ringColor,
              animation: 'ring-pulse2 1.4s ease-out 0.45s infinite',
              zIndex: 0,
            }} />
          )}

          <button
            onClick={handleMicClick}
            disabled={appState === 'processing'}
            style={{
              position: 'relative', zIndex: 1,
              width: 72, height: 72,
              borderRadius: '50%',
              background: btnColor,
              border: 'none',
              cursor: appState === 'processing' ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.25s, transform 0.15s',
              transform: appState === 'listening' ? 'scale(1.08)' : 'scale(1)',
              boxShadow: `0 4px 20px ${btnColor}55`,
            }}
          >
            {appState === 'processing' && <Spinner size={26} />}
            {appState === 'listening' && <StopIcon size={26} />}
            {appState === 'speaking'  && <SpeakerIcon size={26} />}
            {appState === 'idle'      && <MicIcon size={30} />}
          </button>
        </div>

        {/* Tap hint */}
        <p style={{
          margin: 0,
          fontSize: 11,
          color: '#cbd5e1',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {appState === 'idle'       && 'Tap to start speaking'}
          {appState === 'listening'  && 'Tap to stop & send'}
          {appState === 'processing' && 'Processing…'}
          {appState === 'speaking'   && 'Tap to stop'}
        </p>
      </div>

      {/* Click outside to close lang picker */}
      {showLangPicker && (
        <div
          onClick={() => setShowLangPicker(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
        />
      )}
    </div>
  );
}