import { useNavigate } from "react-router-dom"
import FadeIn from "../components/fadeIn";

export default function LandingPage(){

    const navigate = useNavigate();
    const green = "#16a34a";
    const languageNames = ['English', 'हिंद', 'اردو', 'বাংলা', 'தமிழ்', 'తెలుగు', 'मराठी', 'ગુજરાતી',
'ಕನ್ನಡ', 'മലയാളം', 'ਪੰਜਾਬੀ','ଓଡ଼ିଆ', 'অসমীয়া', 'संस्कृतम्', 'کٲشُر'  , 'سنڌي', 'कोंकणी', 'ꯃꯤꯇꯩ ꯂꯣꯟ', 'बड़ो', 'ᱥᱟᱱᱛᱟᱲᱤ'  ]

    return(
        <div style={{ fontFamily: "Arial, sans-serif", color: "#000", background: "#fff" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid #eee"
      }}>
        <h2 style={{ color: green }}>CareIndia AI</h2>
        <button
          onClick={() => navigate("/app")}
          style={{
            padding: "10px 20px",
            background: green,
            color: "#fff",
            border: "none",
            cursor: "pointer"
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
          <h1 style={{ fontSize: "42px", fontWeight: "bold", color:'black'}}>
            Healthcare Guidance in <span style={{ color: green }}>Your Language</span>
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
                fontSize: "16px"
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
          <div style={{ maxWidth: "900px", margin: "auto", color: 'black'}}>
            <h2 style={{color: 'black'}}>The Problem</h2>
            <p style={{ color: "#444" }}>
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
            <h2 style={{color:'black'}}>Our Solution</h2>
            <p style={{ color: "#444" }}>
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
            <h2 style={{color: 'black'}}>How It Works</h2>

            <ol style={{ color: "#444", marginTop: "20px" }}>
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
            <h2 style={{color: 'black'}}>Key Features</h2>

            <ul style={{ color: "#444", marginTop: "20px" }}>
              <li>🌍 Multilingual support</li>
              <li>🎤 Voice input & response</li>
              <li style={{ color: green }}>🔒 Privacy-focused (local AI)</li>
              <li>⚡ Instant responses</li>
            </ul>
          </div>
        </FadeIn>
      </section>

      {/* TECH STACK */}
      <section style={{ padding: "80px 20px", background: "#f9fafb" }}>
        <FadeIn>
          <div style={{ maxWidth: "900px", margin: "auto" }}>
            <h2 style={{color: 'black'}}>Technology</h2>

            <ul style={{ color: "#444", marginTop: "20px" }}>
              <li>Frontend: React</li>
              <li>Backend: FastAPI</li>
              <li>AI: Ollama (LLaMA 3)</li>
              <li style={{ color: green }}>Translation: Sarvam AI</li>
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
          <h2 style={{color: 'black'}}>Experience It Yourself</h2>
          <p style={{ color: "#444" }}>Try the live AI assistant now</p>

          <button
            onClick={() => navigate("/app")}
            style={{
              padding: "14px 28px",
              marginTop: "20px",
              background: green,
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            Launch App
          </button>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "20px",
        textAlign: "center",
        borderTop: "1px solid #eee",
        color: "#666"
      }}>
        <p style={{color: 'black'}}>IndiaCare AI • Hackathon Project</p>
      </footer>

    </div>
    )
}