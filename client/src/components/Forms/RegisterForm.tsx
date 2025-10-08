import React from "react";
import RegisterFormContent from "../Content/RegisterFormContent";

type Props = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  pwdVisible: boolean;
  loading: boolean;
  summaryMessages?: string[] | null;

  nameRef: React.RefObject<HTMLInputElement | null>;
  emailRef: React.RefObject<HTMLInputElement | null>;
  pwdRef: React.RefObject<HTMLInputElement | null>;

  onChangeName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangePassword: (v: string) => void;
  onChangeConfirmPassword: (v: string) => void;
  onTogglePwdVisible: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function RegisterForm(props: Props) {
  const {
    summaryMessages,
    loading,
    onSubmit,
    onChangeName,
    onChangeEmail,
    onChangePassword,
    onChangeConfirmPassword,
    onTogglePwdVisible,
    name,
    email,
    password,
    confirmPassword,
    nameRef,
    emailRef,
    pwdRef,
    pwdVisible,
  } = props;

  return (
    <form id="registerForm" onSubmit={onSubmit} noValidate>
      {/* summary */}
      <div id="formSummary" className={`alert alert-danger ${!summaryMessages ? "d-none" : ""}`} role="alert" aria-live="assertive">
        {summaryMessages && (
          <ul className="mb-0 ps-3">
            {summaryMessages.map((m) => <li key={m}>{m}</li>)}
          </ul>
        )}
      </div>

      {/* content */}
      <RegisterFormContent
        name={name}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        pwdVisible={pwdVisible}
        nameRef={nameRef}
        emailRef={emailRef}
        pwdRef={pwdRef}
        onChangeName={onChangeName}
        onChangeEmail={onChangeEmail}
        onChangePassword={onChangePassword}
        onChangeConfirmPassword={onChangeConfirmPassword}
        onTogglePwdVisible={onTogglePwdVisible}
      />

      {/* submit */}
      <button id="submitBtn" type="submit" className="btn btn-primary btn-register w-100 py-2 fw-semibold" disabled={loading}>
        <span className="btn-label">{loading ? "Cadastrando..." : "Cadastrar"}</span>
        <span className={`spinner-border spinner-border-sm ms-2 ${loading ? "" : "d-none"}`} aria-hidden="true" />
        <output className="visually-hidden" aria-live="polite">{loading ? "Cadastrando..." : ""}</output>
      </button>

      <div className="text-center mt-3">
        <span>Já é cadastrado? </span>
        <a className="small" href="/login">Entrar</a>
      </div>
    </form>
  );
}
