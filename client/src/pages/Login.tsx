// src/pages/Login.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/Forms/LoginForm";
import "../styles/login.css";

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
      const on = (e as any).getModifierState?.("CapsLock");
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
    } catch {
      // ignore storage errors
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSummaryMessages(null);
    try {
      await login(emailOrUser, password, remember);
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

            <LoginForm
              emailOrUser={emailOrUser}
              password={password}
              remember={remember}
              loading={loading}
              capsOn={capsOn}
              pwdVisible={pwdVisible}
              userRef={userRef}
              pwdRef={pwdRef}
              onChangeEmail={setEmailOrUser}
              onChangePassword={setPassword}
              onToggleRemember={setRemember}
              onTogglePwdVisible={() => setPwdVisible((v) => !v)}
              onSubmit={handleSubmit}
              summaryMessages={summaryMessages}
            />
          </div>
        </div>

        <p className="text-center text-muted x-small mt-3 mb-0">
          &copy; 2025 FSI &middot; <a href="/privacy" className="link-secondary">Security and Privacy</a>
        </p>
      </div>
    </main>
  );
}