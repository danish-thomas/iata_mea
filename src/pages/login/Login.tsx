import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

const USERS = {
  "iata": {
    password: "12345",
    role: "iata",
    route: "/",
  },
  "airline": {
    password: "12345",
    role: "airline",
    route: "/airline-dashboard",
  },
  "freight": {
    password: "12345",
    role: "freight",
    route: "/freight-forwarder",
  },
};

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    setError("");

    const user = USERS[username as keyof typeof USERS];

    if (!user || user.password !== password) {
      setError("Invalid username or password.");
      return;
    }

    navigate(user.route, {
      state: {
        username,
        role: user.role,
      },
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-brand">
          <div className="login-logo">IATA</div>

          <div className="login-product">
            <strong>MeA</strong>
            <span>Matchmaker</span>
          </div>
        </div>

        <div className="login-card">

          <div className="login-card-header">
            <h1>Welcome</h1>
            <p>Please sign in to continue</p>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              value={username}
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <a href="#">Forgot Password?</a>
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
          >
            LOGIN
          </button>

        </div>

        <div className="login-footer">
          © 2026 IATA MeA. All rights reserved.
        </div>

      </div>
    </div>
  );
}

export default Login;