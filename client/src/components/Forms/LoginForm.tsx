// src/components/LoginForm.tsx
import React from "react";
import UsernameInput from "../Inputs/UsernameInput";

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
            <label htmlFor="Password">Senha</label>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary"
            id="togglePwd"
            aria-label="Show password"
            aria-pressed={pwdVisible}
            onClick={() => {
              onTogglePwdVisible();
              pwdRef.current?.focus();
            }}
          >
            <i className={pwdVisible ? "bi bi-eye-slash" : "bi bi-eye"} aria-hidden="true"></i>
          </button>
        </div>

        <div id="capsNotice" className={`form-text small text-warning ${capsOn ? "" : "d-none"}`}>
          <i className="bi bi-exclamation-triangle me-1" />CapsLock is on
        </div>
        <div id="pwdHelp" className="form-text small text-muted">
          Keep your password safe
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
          Lembrar-me
        </label>
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
        <a className="small" href="/forgot-password">
          Esqueci minha senha
        </a>
      </div>

      <div className="text-center mt-3">
        <a className="small" href="/register">
          Cadastrar
        </a>
      </div>
    </form>
  );
}