import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/Forms/LoginForm";
import Swal from "sweetalert2";
import "../styles/login.css";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t, i18n } = useTranslation();
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
    if (!emailOrUser.trim()) msgs.push(t("validation.enterUsernameOrEmail"));
    if (!password.trim()) msgs.push(t("validation.enterPassword"));
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
      const msg =
        err?.response?.data?.message ?? err?.message ?? t("errors.invalidCredentials");
      setSummaryMessages([msg]);
      setLoading(false);

      // Exibe alerta com SweetAlert2
      Swal.fire({
        icon: "error",
        title: t("errors.loginFailedTitle") || "Login Failed",
        text: msg,
        confirmButtonText: t("errors.ok") || "OK",
      });
    }
  };

  // Função para trocar idioma
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <main id="loginShell" className="login-shell bg-body" style={{ position: "relative" }}>
      {/* Botão de troca de idioma no canto superior direito */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          onClick={() => changeLanguage("en")}
          disabled={i18n.language === "en"}
          style={{
            padding: "6px 12px",
            cursor: i18n.language === "en" ? "default" : "pointer",
            opacity: i18n.language === "en" ? 0.6 : 1,
          }}
          aria-label="Switch to English"
        >
          English
        </button>
        <button
          onClick={() => changeLanguage("ptBR")}
          disabled={i18n.language === "ptBR"}
          style={{
            padding: "6px 12px",
            cursor: i18n.language === "ptBR" ? "default" : "pointer",
            opacity: i18n.language === "ptBR" ? 0.6 : 1,
          }}
          aria-label="Mudar para Português (BR)"
        >
          Português (BR)
        </button>
      </div>

      <div className="login-wrapper col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
        <div className="card shadow-sm rounded-4 border-0">
          <div className="card-body p-4 p-lg-5">
            <div className="text-center mb-4">
              <h1 className="h4 fw-bold mb-1">{t("login.title")}</h1>
              <p className="text-muted small mb-0">{t("login.subtitle")}</p>
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
          &copy; 2025 FSI &middot;{" "}
          <a href="/privacy" className="link-secondary">
            {t("login.securityAndPrivacy")}
          </a>
        </p>
      </div>
    </main>
  );
}