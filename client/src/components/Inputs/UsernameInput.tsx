// src/components/UsernameInput.tsx
import React from "react";

type Props = {
  readonly value: string;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly inputRef: React.RefObject<HTMLInputElement | null>;
};

export default function UsernameInput({ value, onChange, inputRef }: Props) {
  return (
    <div className="form-floating mb-3">
      <input
        ref={inputRef}
        id="UsernameOrEmail"
        className="form-control"
        placeholder=" "
        autoComplete="username"
        required
        value={value}
        onChange={onChange}
        aria-describedby="usernameHelp"
      />
      <label htmlFor="UsernameOrEmail">Usuário ou e-mail</label>
      <div id="usernameHelp" className="form-text small">Enter username or email</div>
    </div>
  );
}