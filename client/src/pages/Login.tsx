// src/pages/Login.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import UsernameInput from "../components/UsernameInput";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summaryMessages, setSummaryMessages] = useState<string[] | null>(null);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [capsOn, setCapsOn] = useState(false);

  const userRef = useRef<HTMLInputElement | null>(null);
  const pwdRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const remembered = localStorage.getItem("login.username");
    if (remembered) {
      setEmailOrUser(remembered);
      setRemember(true);
    }
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    const toggleCaps = (e: KeyboardEvent) => {
      const on = e.getModifierState?.("CapsLock");
      setCapsOn(!!on);
    };
    window.addEventListener("keydown", toggleCaps);
    window.addEventListener("keyup", toggleCaps);
    return () => {
      window.removeEventListener("keydown", toggleCaps);
      window.removeEventListener("keyup", toggleCaps);
    };
  }, []);

  function validate() {
    const msgs: string[] = [];
    if (!emailOrUser.trim()) msgs.push("Informe usuário ou e-mail.");
    if (!password.trim()) msgs.push("Informe a senha.");
    setSummaryMessages(msgs.length ? msgs : null);
    return msgs.length === 0;
  }

  function syncRememberStorage(val = emailOrUser) {
    try {
      if (remember && val.trim()) localStorage.setItem("login.username", val);
      else localStorage.removeItem("login.username");
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(emailOrUser, password);
      syncRememberStorage();
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Credenciais inválidas";
      setSummaryMessages([msg]);
      setLoading(false);
    }
  };

  return (
    <main id="loginShell" className="login-shell bg-body">
      <div className="login-wrapper col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
        <div className="card shadow-sm rounded-4 border-0">
          <div className="card-body p-4 p-lg-5">
            <div className="text-center mb-4">
              <h1 className="h4 fw-bold mb-1">Login</h1>
              <p className="text-muted small mb-0">Use your corporate credentials</p>
            </div>

            <div
              id="formSummary"
              className={`alert alert-danger ${!summaryMessages ? "d-none" : ""}`}
              role="alert"
              aria-live="assertive"
            >
              {summaryMessages && (
                <ul className="mb-0 ps-3">{summaryMessages.map((m) => <li key={m}>{m}</li>)}</ul>
              )}
            </div>

            <form id="loginForm" onSubmit={handleSubmit} noValidate>
              <UsernameInput
                value={emailOrUser}
                onChange={(e) => setEmailOrUser(e.target.value)}
                inputRef={userRef}
              />

              <div className="mb-2">
                <div className="input-group">
                  <div className="form-floating flex-grow-1">
                    <input
                      ref={pwdRef}
                      id="Password"
                      type={pwdVisible ? "text" : "password"}
                      className="form-control"
                      placeholder=" "
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-describedby="pwdHelp capsNotice"
                    />
                    <label htmlFor="Password">Senha</label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    id="togglePwd"
                    aria-label="Show password"
                    aria-pressed={pwdVisible}
                    onClick={() => {
                      setPwdVisible(!pwdVisible);
                      pwdRef.current?.focus();
                    }}
                  >
                    <i className={pwdVisible ? "bi bi-eye-slash" : "bi bi-eye"} aria-hidden="true"></i>
                  </button>
                </div>

                <div id="capsNotice" className={`form-text small text-warning ${capsOn ? "" : "d-none"}`}>
                  <i className="bi bi-exclamation-triangle me-1" />CapsLock is on
                </div>
                <div id="pwdHelp" className="form-text small text-muted">Keep your password safe</div>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="RememberMe"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="RememberMe">Lembrar-me</label>
              </div>

              <button
                id="submitBtn"
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
              >
                <span className="btn-label">{loading ? "Entrando..." : "Login"}</span>
                <span className={`spinner-border spinner-border-sm ms-2 ${loading ? "" : "d-none"}`} aria-hidden="true"></span>
                <output className="visually-hidden" aria-live="polite">
                  {loading ? "Entrando..." : ""}
                </output>
              </button>

              <div className="text-center mt-3">
                <a className="small" href="/forgot-password">Forgot password</a>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-muted x-small mt-3 mb-0">
          &copy; 2025 FSI &middot; <a href="/privacy" className="link-secondary">Security and Privacy</a>
        </p>
      </div>
    </main>
  );
}