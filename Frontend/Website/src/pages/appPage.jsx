import React, { useState, useEffect } from 'react';

export default function VoiceAppPage() {
  // App States: 'idle' | 'listening' | 'processing' | 'speaking'
  const [appState, setAppState] = useState('idle');
  const [language, setLanguage] = useState('English');
  
  // Text to display as "subtitles"
  const [displayText, setDisplayText] = useState('Tap the microphone and tell me how you are feeling.');

  // Mock flow to demonstrate the voice UI
  const handleMicClick = () => {
    if (appState === 'idle' || appState === 'speaking') {
      setAppState('listening');
      setDisplayText('Listening...');
      
      // Auto-stop listening after 3 seconds for demo purposes
        setTimeout(() => {
        setAppState('processing');
        setDisplayText(`Translating from ${language} and analyzing symptoms...`);
        
        // Mock AI thinking time
        setTimeout(() => {
          setAppState('speaking');
          setDisplayText('I understand you have a slight fever and headache. Please drink plenty of water and rest. If it persists for 2 days, visit your local clinic.');
        }, 2500);

        
      }, 3000);
    
    } else if (appState === 'listening') {
      // Manual stop
      setAppState('processing');
      setDisplayText('Processing your voice...');
    }

    setTimeout(()=>{
        setAppState('idle');
        setDisplayText('Tap the microphone and tell me how you are feeling.')
    },12000)
  };

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
    // The massive central button
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
    // The pulsating rings behind the button
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
    },
    keyboardFallback: {
      position: 'absolute',
      bottom: '30px',
      background: 'none',
      border: 'none',
      color: colors.textLight,
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: '14px'
    }
  };

  // Icons based on state
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
      {/* Injecting CSS Keyframes for sleek animations */}
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

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.primary }}></div>
          CareIndia AI
        </div>
        <select style={styles.select} value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Hindi">हिंदी (Hindi)</option>
          <option value="Bengali">বাংলা (Bengali)</option>
          <option value="Telugu">తెలుగు (Telugu)</option>
        </select>
      </header>

      {/* Main Voice Interface */}
      <main style={styles.main}>
        
        <div style={styles.statusText}>
          {appState === 'idle' && 'Tap to Speak'}
          {appState === 'listening' && 'Listening...'}
          {appState === 'processing' && 'Translating...'}
          {appState === 'speaking' && 'AI Responding'}
        </div>

        {/* Central Orb */}
        <div style={styles.micButtonWrapper}>
          <div style={styles.ripple}></div>
          <button 
            onClick={handleMicClick} 
            style={styles.micButton}
            disabled={appState === 'processing'}
          >
            {getIcon()}
          </button>
        </div>

        {/* Subtitles (Replaces Chat History) */}
        <div style={styles.subtitleBox}>
          <p style={{
            ...styles.subtitleText,
            color: appState === 'listening' ? colors.textLight : colors.textDark,
            fontSize: displayText.length > 80 ? '22px' : '28px' // Shrink text if it's very long
          }}>
            "{displayText}"
          </p>
        </div>

      </main>
    </div>
  );
}