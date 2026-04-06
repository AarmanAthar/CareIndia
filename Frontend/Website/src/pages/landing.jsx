import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FadeIn from "../components/fadeIn"; // Assuming you have this locally

export default function LandingPage() {
  const navigate = useNavigate();
  const green = "#16a34a";
  const languageNames = [
    'English', 'हिंदी', 'اردو', 'বাংলা', 'தமிழ்', 'తెలుగు', 'मराठी', 'ગુજરાતી',
    'ಕನ್ನಡ', 'മലയാളം', 'ਪੰਜਾਬੀ', 'ଓଡ଼ିଆ', 'অসমীয়া', 'संस्कृतम्', 'کٲشُر', 'سنڌي', 'कोंकणी', 'ꯃꯤꯇꯩ ꯂꯣꯟ', 'बड़ो', 'ᱥᱟᱱᱛᱟᱲᱤ'
  ];

  // State for the animated text
  const [langIndex, setLangIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Effect to cycle through languages with a fade animation
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setIsVisible(false); // Start fading out

      setTimeout(() => {
        // Change the text while it's invisible
        setLangIndex((prevIndex) => (prevIndex + 1) % languageNames.length);
        setIsVisible(true); // Fade back in
      }, 500); // 500ms matches the CSS transition duration below

    }, 2000); // Change language every 2.5 seconds

    return () => clearInterval(cycleInterval);
  }, [languageNames.length]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#000", background: "#fff" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid #eee"
      }}>
        <h2 style={{ color: green, margin: 0, display: "flex", alignItems: "center" }}>CareIndia AI</h2>
        <button
          onClick={() => navigate("/app")}
          style={{
            padding: "10px 20px",
            background: green,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "6px",
            fontWeight: "bold"
          }}
        >
          Launch App
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        padding: "100px 20px",
        textAlign: "center",
        maxWidth: "900px",
        margin: "auto"
      }}>
        <FadeIn>
          <h1 style={{ fontSize: "48px", fontWeight: "bold", color: 'black', lineHeight: "1.2" }}>
            Healthcare Guidance in <br />
            {/* Animated Span */}
            <span style={{
              color: green,
              display: "inline-block",
              minWidth: "250px", // Prevents the layout from jumping around when text length changes
              transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0px)" : "translateY(10px)"
            }}>
              {languageNames[langIndex]}
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{ marginTop: "20px", fontSize: "18px", color: "#444" }}>
            Speak or type your symptoms. Get instant AI-powered guidance —
            in Hindi, English, and more.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div style={{ marginTop: "30px" }}>
            <button
              onClick={() => navigate("/app")}
              style={{
                padding: "14px 28px",
                background: green,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                borderRadius: "8px",
                fontWeight: "bold",
                boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)"
              }}
            >
              Try Demo
            </button>
          </div>
        </FadeIn>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: "80px 20px", background: "#f9fafb" }}>
        <FadeIn>
          <div style={{ maxWidth: "900px", margin: "auto", color: 'black' }}>
            <h2 style={{ color: 'black' }}>The Problem</h2>
            <p style={{ color: "#444", lineHeight: "1.6" }}>
              Millions lack access to quick and understandable healthcare advice.
              Language barriers, limited doctors, and delayed responses make it worse.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* SOLUTION */}
      <section style={{ padding: "80px 20px" }}>
        <FadeIn>
          <div style={{ maxWidth: "900px", margin: "auto" }}>
            <h2 style={{ color: 'black' }}>Our Solution</h2>
            <p style={{ color: "#444", lineHeight: "1.6" }}>
              CareIndia AI provides instant, multilingual healthcare assistance using
              voice input, real-time translation, and locally running AI models.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 20px", background: "#f9fafb" }}>
        <FadeIn>
          <div style={{ maxWidth: "900px", margin: "auto" }}>
            <h2 style={{ color: 'black' }}>How It Works</h2>
            <ol style={{ color: "#444", marginTop: "20px", lineHeight: "1.8" }}>
              <li>🎤 Speak or type your symptoms</li>
              <li>🌐 Input is translated using Sarvam AI</li>
              <li>🧠 AI processes it locally (Ollama + LLaMA 3)</li>
              <li>💬 You receive a clear response instantly</li>
            </ol>
          </div>
        </FadeIn>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 20px" }}>
        <FadeIn>
          <div style={{ maxWidth: "900px", margin: "auto" }}>
            <h2 style={{ color: 'black' }}>Key Features</h2>
            <ul style={{ color: "#444", marginTop: "20px", lineHeight: "1.8", listStyleType: "none", padding: 0 }}>
              <li>🌍 Multilingual support</li>
              <li>🎤 Voice input & response</li>
              <li style={{ color: green, fontWeight: "bold" }}>🔒 Privacy-focused (local AI)</li>
              <li>⚡ Instant responses</li>
            </ul>
          </div>
        </FadeIn>
      </section>

      {/* TECH STACK */}
      <section style={{ padding: "80px 20px", background: "#f9fafb" }}>
        <FadeIn>
          <div style={{ maxWidth: "900px", margin: "auto" }}>
            <h2 style={{ color: 'black' }}>Technology</h2>
            <ul style={{ color: "#444", marginTop: "20px", lineHeight: "1.8", listStyleType: "none", padding: 0 }}>
              <li>Frontend: React</li>
              <li>Backend: FastAPI</li>
              <li>AI: Ollama (LLaMA 3)</li>
              <li style={{ color: green, fontWeight: "bold" }}>Translation: Sarvam AI</li>
              <li>Speech: Whisper</li>
            </ul>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section style={{
        padding: "100px 20px",
        textAlign: "center"
      }}>
        <FadeIn>
          <h2 style={{ color: 'black' }}>Experience It Yourself</h2>
          <p style={{ color: "#444" }}>Try the live AI assistant now</p>
          <button
            onClick={() => navigate("/app")}
            style={{
              padding: "14px 28px",
              marginTop: "20px",
              background: green,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            Launch App
          </button>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "30px",
        textAlign: "center",
        borderTop: "1px solid #eee",
        color: "#666",
        background: "#f9fafb"
      }}>
        <p style={{ margin: 0 }}>CareIndia AI • Hackathon Project</p>
      </footer>

    </div>
  );
}