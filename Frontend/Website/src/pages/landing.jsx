import { useNavigate } from "react-router-dom"

export default function LandingPage(){

    const navigate = useNavigate();
    return(
        <div style={{ fontFamily: "Arial, sans-serif", color: "#111" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid #eee"
      }}>
        <h2>IndiaCare AI</h2>
        <button onClick={() => navigate("/app")}>Launch App</button>
      </nav>

      {/* HERO */}
      <section style={{
        padding: "80px 20px",
        textAlign: "center",
        maxWidth: "900px",
        margin: "auto"
      }}>
        <h1 style={{ fontSize: "40px" }}>
          Healthcare Guidance in Your Language
        </h1>

        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          Speak or type your symptoms. Get instant AI-powered guidance —
          in Hindi, English, and more.
        </p>

        <div style={{ marginTop: "30px" }}>
          <button onClick={() => navigate("/app")} style={{ padding: "12px 24px", marginRight: "10px" }}>
            Try Demo
          </button>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: "60px 20px", background: "#f9f9f9" }}>
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <h2>The Problem</h2>
          <p>
            Millions lack access to quick and understandable healthcare advice.
            Language barriers, limited doctors, and delayed responses make it worse.
          </p>
        </div>
      </section>

      {/* SOLUTION */}
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <h2>Our Solution</h2>
          <p>
            IndiaCare AI provides instant, multilingual healthcare assistance using
            voice input, real-time translation, and locally running AI models.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "60px 20px", background: "#f9f9f9" }}>
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <h2>How It Works</h2>

          <ol>
            <li>🎤 Speak or type your symptoms</li>
            <li>🌐 Input is translated using Sarvam AI</li>
            <li>🧠 AI processes it locally (Ollama + LLaMA 3)</li>
            <li>💬 You receive a clear response instantly</li>
          </ol>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <h2>Key Features</h2>

          <ul>
            <li>🌍 Multilingual support (Hindi + regional languages)</li>
            <li>🎤 Voice input and response</li>
            <li>🔒 Runs locally — privacy focused</li>
            <li>⚡ Instant AI responses</li>
          </ul>
        </div>
      </section>

      {/* TECH STACK (important for judges) */}
      <section style={{ padding: "60px 20px", background: "#f9f9f9" }}>
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <h2>Technology</h2>

          <ul>
            <li>Frontend: React</li>
            <li>Backend: FastAPI</li>
            <li>AI: Ollama (LLaMA 3)</li>
            <li>Translation: Sarvam AI</li>
            <li>Speech: Whisper</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 20px",
        textAlign: "center"
      }}>
        <h2>Experience It Yourself</h2>
        <p>Try the live AI assistant now</p>

        <button onClick={() => navigate("/app")} style={{ padding: "14px 28px", marginTop: "20px" }}>
          Launch App
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "20px",
        textAlign: "center",
        borderTop: "1px solid #eee"
      }}>
        <p>IndiaCare AI • Hackathon Project</p>
      </footer>

    </div>
        
    )
}