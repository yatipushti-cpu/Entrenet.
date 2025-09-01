import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"login" | "profile">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Profile info states
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  // Handle login submit
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      setStep("profile");
      setLoading(false);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  }

  // Demo login handler
  async function handleDemoLogin() {
    setLoading(true);
    setError("");
    try {
      const demoEmail = "test@login1.com";
      const demoPassword = "demopassword"; // You must ensure this user exists in your backend
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Demo login failed");
        setLoading(false);
        return;
      }
      setStep("profile");
      setLoading(false);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  }

  // Handle profile submit
  async function handleProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // For demo, just go to dashboard
      setLocation("/dashboard");
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  }

  if (step === "login") {
    return (
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleLogin}>
          <h1 style={styles.title}>Login</h1>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <div style={styles.error}>{error}</div>}
        </form>
        {/* Demo clickable UI element */}
        <div style={styles.demoBox} onClick={handleDemoLogin}>
          <span style={styles.demoText}>Try a Demo (bypass login)</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleProfile}>
        <h1 style={styles.title}>Complete Your Profile</h1>
        <input
          style={styles.input}
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={e => setName(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Position"
          value={position}
          required
          onChange={e => setPosition(e.target.value)}
        />
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Saving..." : "Continue"}
        </button>
        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8f8fa",
  },
  form: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    minWidth: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  title: {
    margin: "0 0 1rem 0",
    fontWeight: "bold",
    fontSize: "1.6rem",
    textAlign: "center",
    color: "#313146",
  },
  input: {
    fontSize: "1rem",
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
  button: {
    padding: "0.75rem",
    fontSize: "1rem",
    background: "#5656bb",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "#ee3c3c",
    fontSize: "1rem",
    padding: "0.5rem",
    textAlign: "center",
  },
  demoBox: {
    marginTop: "1.5rem",
    background: "#eef1fa",
    padding: "0.8rem 1.2rem",
    borderRadius: "6px",
    textAlign: "center",
    boxShadow: "0 2px 8px #e8e8e8",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  demoText: {
    color: "#5656bb",
    fontWeight: "bold",
    fontSize: "1rem",
    letterSpacing: "0.5px",
  },
};
