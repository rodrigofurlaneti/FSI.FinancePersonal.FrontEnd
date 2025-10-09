import React from "react";

type UsernameInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  label: string;
  placeholder: string;
};

export default function UsernameInput({
  value,
  onChange,
  inputRef,
  label,
  placeholder,
}: UsernameInputProps) {
  return (
    <div className="mb-3">
      <div className="form-floating">
        <input
          id="usernameOrEmail"
          type="text"
          className="form-control"
          value={value}
          onChange={onChange}
          ref={inputRef}
          placeholder={placeholder}
          required
          autoComplete="username"
        />
        <label htmlFor="usernameOrEmail">{label}</label>
      </div>
    </div>
  );
}