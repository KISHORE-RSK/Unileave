import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { gsap } from "gsap";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const cardRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const handleSubmit = async (e) => {
   console.log("SUBMIT FIRED");

    e.preventDefault();
    setError("");
    setLoading(true);

    try {
  
    const role = (await login(email, password)).toLowerCase();

    if (role === "student") navigate("/student");
    else if (role === "faculty") navigate("/faculty");
    else navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form ref={cardRef} className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <h1>UniLeave</h1>
          <p>Leave Management Portal</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
