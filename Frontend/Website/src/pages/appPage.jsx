import React, { useState, useRef } from 'react';

export default function VoiceAppPage() {
  // App States: 'idle' | 'listening' | 'processing' | 'speaking'
  const [appState, setAppState] = useState('idle');
  const [languageCode, setLanguageCode] = useState('hi-IN');
  const [displayText, setDisplayText] = useState('Tap the microphone and tell me how you are feeling.');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const sendAudioToBackend = async (blob) => {
    setAppState('processing');
    setDisplayText('Translating and thinking...');
    
    const formData = new FormData();
    // FIX 1: Name the key "file" (Verify this matches your backend FastAPI parameter!)
    formData.append("file", blob, "user_voice.webm");
    
    // FIX 2: Send the language code to the backend so Sarvam knows what to expect
    formData.append("language", languageCode); 

    try {
        // Replace with your actual local backend URL, e.g., "http://localhost:8000/api/chat"
        const response = await fetch("http://localhost:8000/api/chat", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Backend connection failed");
        }
        
        const aiVoiceBlob = await response.blob();
        const audioUrl = URL.createObjectURL(aiVoiceBlob);

        const audio = new Audio(audioUrl);
        
        // FIX 3: Track when AI starts and stops speaking!
        audio.onplay = () => {
            setAppState('speaking');
            setDisplayText('AI is responding...');
        };
        
        audio.onended = () => {
            setAppState('idle');
            setDisplayText('Tap the microphone to reply.');
        };

        audio.play();

    } catch (e) {
        console.error("error sending audio to backend", e);
        setAppState('idle');
        setDisplayText('Connection failed. Please try again.');
    }
  }

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        }

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            stream.getTracks().forEach(track => track.stop());
            await sendAudioToBackend(audioBlob);
        }

        mediaRecorder.start();
        setAppState('listening');
        setDisplayText('Listening...');
    } catch (e) {
        console.error("Mic access denied", e); 
        alert("Give permission to access mic");
        setAppState('idle');
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && appState === 'listening') {
        mediaRecorderRef.current.stop();
        // State changes to 'processing' inside sendAudioToBackend
    }
  }

  // --- STYLES ---
  const colors = {
    bg: '#ffffff',
    primary: '#10b981', // Emerald green
    primaryGlow: 'rgba(16, 185, 129, 0.4)',
    textDark: '#0f172a',
    textLight: '#64748b',
    surface: '#f8fafc',
    border: '#e2e8f0'
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: colors.bg,
      fontFamily: '"Inter", -apple-system, sans-serif',
      color: colors.textDark,
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 30px',
      zIndex: 10
    },
    brand: {
      fontSize: '20px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    select: {
      padding: '10px 16px',
      borderRadius: '20px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.surface,
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      outline: 'none'
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    },
    micButtonWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '200px',
      height: '200px',
      marginBottom: '40px'
    },
    micButton: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 10px 25px ${appState === 'listening' ? 'rgba(239, 68, 68, 0.4)' : colors.primaryGlow}`,
      zIndex: 2,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: appState === 'listening' ? 'scale(1.1)' : 'scale(1)',
    },
    ripple: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor: appState === 'listening' ? '#ef4444' : colors.primary,
      opacity: 0,
      zIndex: 1,
      animation: appState === 'listening' 
        ? 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' 
        : appState === 'speaking' 
        ? 'wave-ring 2s ease-in-out infinite alternate' 
        : 'none',
    },
    statusText: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: appState === 'listening' ? '#ef4444' : colors.primary,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '16px',
      transition: 'opacity 0.3s ease',
      opacity: appState === 'idle' ? 0.5 : 1
    },
    subtitleBox: {
      maxWidth: '600px',
      width: '100%',
      textAlign: 'center',
      minHeight: '120px'
    },
    subtitleText: {
      fontSize: '28px',
      lineHeight: '1.4',
      fontWeight: '500',
      color: colors.textDark,
      transition: 'all 0.3s ease',
    }
  };

  const getIcon = () => {
    if (appState === 'processing') {
      return <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />;
    }
    if (appState === 'speaking') {
      return (
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    }
    return (
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    );
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1.8); opacity: 0; }
          }
          @keyframes wave-ring {
            0% { transform: scale(1); opacity: 0.2; }
            100% { transform: scale(1.3); opacity: 0.1; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.primary }}></div>
          CareIndia AI
        </div>
        {/* FIX 4: Bind value to languageCode so it updates visually */}
        <select style={styles.select} value={languageCode} onChange={(e) => setLanguageCode(e.target.value)}>
          <option value="hi-IN">हिंदी (Hindi)</option>
          <option value="en-IN">English</option>
          <option value="bn-IN">বাংলা (Bengali)</option>
          <option value="te-IN">తెలుగు (Telugu)</option>
          <option value="ta-IN">தமிழ் (Tamil)</option>
          <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
          <option value="ml-IN">മലയാളം (Malayalam)</option>
          <option value="mr-IN">मराठी (Marathi)</option>
          <option value="gu-IN">ગુજરાતી (Gujarati)</option>
          <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
          <option value="od-IN">ଓଡ଼ିଆ (Odia)</option>
        </select>
      </header>

      <main style={styles.main}>
        
        <div style={styles.statusText}>
          {appState === 'idle' && 'Tap to Speak'}
          {appState === 'listening' && 'Listening...'}
          {appState === 'processing' && 'Translating...'}
          {appState === 'speaking' && 'AI Responding'}
        </div>

        <div style={styles.micButtonWrapper}>
          <div style={styles.ripple}></div>
          <button 
            onClick={() => { appState === 'listening' ? stopRecording() : startRecording() }} 
            style={styles.micButton}
            disabled={appState === 'processing'}
          >
            {getIcon()}
          </button>
        </div>

        <div style={styles.subtitleBox}>
          <p style={{
            ...styles.subtitleText,
            color: appState === 'listening' ? colors.textLight : colors.textDark,
            fontSize: displayText.length > 80 ? '22px' : '28px'
          }}>
            {displayText}
          </p>
        </div>

      </main>
    </div>
  );
}