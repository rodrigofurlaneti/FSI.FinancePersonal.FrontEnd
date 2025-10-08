import React from "react";

type Props = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  pwdVisible: boolean;

  nameRef: React.RefObject<HTMLInputElement | null>;
  emailRef: React.RefObject<HTMLInputElement | null>;
  pwdRef: React.RefObject<HTMLInputElement | null>;

  onChangeName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangePassword: (v: string) => void;
  onChangeConfirmPassword: (v: string) => void;
  onTogglePwdVisible: () => void;
};

export default function RegisterFormContent({
  name,
  email,
  password,
  confirmPassword,
  pwdVisible,
  nameRef,
  emailRef,
  pwdRef,
  onChangeName,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
  onTogglePwdVisible,
}: Props) {
  return (
    <>
      <div className="form-floating mb-3 input-pill">
        <input
          ref={nameRef}
          id="Name"
          type="text"
          className="form-control"
          placeholder=" "
          required
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          autoComplete="name"
        />
        <label htmlFor="Name"><i className="bi bi-person me-2" /> Nome</label>
      </div>

      <div className="form-floating mb-3 input-pill">
        <input
          ref={emailRef}
          id="Email"
          type="email"
          className="form-control"
          placeholder=" "
          required
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          autoComplete="email"
        />
        <label htmlFor="Email"><i className="bi bi-envelope me-2" /> E-mail</label>
      </div>

      <div className="mb-3 input-pill input-group">
        <div className="form-floating flex-grow-1">
          <input
            ref={pwdRef}
            id="Password"
            type={pwdVisible ? "text" : "password"}
            className="form-control"
            placeholder=" "
            required
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            autoComplete="new-password"
          />
          <label htmlFor="Password"><i className="bi bi-lock me-2" /> Senha</label>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary ms-2 toggle-eye"
          aria-label={pwdVisible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={pwdVisible}
          onClick={() => {
            onTogglePwdVisible();
            pwdRef.current?.focus();
          }}
        >
          <i className={pwdVisible ? "bi bi-eye-slash" : "bi bi-eye"} />
        </button>
      </div>

      <div className="form-floating mb-3 input-pill input-group">
        <div className="form-floating flex-grow-1">
          <input
            id="ConfirmPassword"
            type={pwdVisible ? "text" : "password"}
            className="form-control"
            placeholder=" "
            required
            value={confirmPassword}
            onChange={(e) => onChangeConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <label htmlFor="ConfirmPassword"><i className="bi bi-lock me-2" /> Confirmar senha</label>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary ms-2 toggle-eye"
          aria-label={pwdVisible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => {
            onTogglePwdVisible();
            const el = document.getElementById("ConfirmPassword") as HTMLInputElement | null;
            el?.focus();
          }}
        >
          <i className={pwdVisible ? "bi bi-eye-slash" : "bi bi-eye"} />
        </button>
      </div>

      <div className="small text-center mb-3 form-terms">
        Ao continuar você concorda com as <a href="/privacy">Políticas de privacidade</a> e <a href="/terms">Termos de uso</a>
      </div>
    </>
  );
}
