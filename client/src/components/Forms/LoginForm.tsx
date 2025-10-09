import React from "react";
import UsernameInput from "../Inputs/UsernameInput";
import { useTranslation } from "react-i18next";

type LoginFormProps = {
  emailOrUser: string;
  password: string;
  remember: boolean;
  loading: boolean;
  capsOn: boolean;
  pwdVisible: boolean;
  userRef: React.RefObject<HTMLInputElement | null>;
  pwdRef: React.RefObject<HTMLInputElement | null>;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onToggleRemember: (checked: boolean) => void;
  onTogglePwdVisible: () => void;
  onSubmit: (e: React.FormEvent) => void;
  summaryMessages?: string[] | null;
};

export default function LoginForm({
  emailOrUser,
  password,
  remember,
  loading,
  capsOn,
  pwdVisible,
  userRef,
  pwdRef,
  onChangeEmail,
  onChangePassword,
  onToggleRemember,
  onTogglePwdVisible,
  onSubmit,
  summaryMessages,
}: LoginFormProps) {
  const { t } = useTranslation();

  return (
    <form id="loginForm" onSubmit={onSubmit} noValidate>
      <div
        id="formSummary"
        className={`alert alert-danger ${!summaryMessages ? "d-none" : ""}`}
        role="alert"
        aria-live="assertive"
      >
        {summaryMessages && (
          <ul className="mb-0 ps-3">
            {summaryMessages.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
      </div>

    <UsernameInput
      value={emailOrUser}
      onChange={(e) => onChangeEmail(e.target.value)}
      inputRef={userRef}
      label={t("login.usernameOrEmail")}
      placeholder={t("login.usernameOrEmail")}
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
              onChange={(e) => onChangePassword(e.target.value)}
              aria-describedby="pwdHelp capsNotice"
            />
            <label htmlFor="Password">{t("login.password")}</label>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
            id="togglePwd"
            aria-label={pwdVisible ? t("login.hidePassword") : t("login.showPassword")}
            aria-pressed={pwdVisible}
            onClick={() => {
              onTogglePwdVisible();
              pwdRef.current?.focus();
            }}
            style={{ width: "3rem" }} // largura fixa para o botão
          >
            <i
              className={pwdVisible ? "bi bi-eye-slash" : "bi bi-eye"}
              aria-hidden="true"
              style={{ fontSize: "1.25rem" }} // tamanho do ícone
            ></i>
          </button>
        </div>

        <div
          id="capsNotice"
          className={`form-text small text-warning ${capsOn ? "" : "d-none"}`}
        >
          <i className="bi bi-exclamation-triangle me-1" />
          {t("login.capsLockOn")}
        </div>
        <div id="pwdHelp" className="form-text small text-muted">
          {t("login.keepPasswordSafe")}
        </div>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="RememberMe"
          checked={remember}
          onChange={(e) => onToggleRemember(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="RememberMe">
          {t("login.rememberMe")}
        </label>
      </div>

      <button
        id="submitBtn"
        type="submit"
        className="btn btn-primary w-100 py-2 fw-semibold"
        disabled={loading}
      >
        <span className="btn-label">
          {loading ? t("login.loggingIn") : t("login.login")}
        </span>
        <span
          className={`spinner-border spinner-border-sm ms-2 ${
            loading ? "" : "d-none"
          }`}
          aria-hidden="true"
        ></span>
        <output className="visually-hidden" aria-live="polite">
          {loading ? t("login.loggingIn") : ""}
        </output>
      </button>

      <div className="text-center mt-3">
        <a className="small" href="/forgot-password">
          {t("login.forgotPassword")}
        </a>
      </div>

      <div className="text-center mt-3">
        <a className="small" href="/register">
          {t("login.register")}
        </a>
      </div>
    </form>
  );
}