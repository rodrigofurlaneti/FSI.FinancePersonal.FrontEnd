// src/pages/Register.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/Forms/RegisterForm";
import { RegisterService } from "../service/registerService";
import type { CreateRegisterPayload } from "../types/register";
import "../styles/register.css";
import logoRegister from "../images/logo-register.jpg";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pwdVisible, setPwdVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summaryMessages, setSummaryMessages] = useState<string[] | null>(null);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const pwdRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // auto-focus no campo nome ao montar a página
    nameRef.current?.focus();
  }, []);

  function validate(): string[] {
    const msgs: string[] = [];
    if (!name.trim()) msgs.push("Informe seu nome.");
    if (!email.trim()) msgs.push("Informe um e-mail válido.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) msgs.push("E-mail inválido.");
    if (!password) msgs.push("Informe a senha.");
    if (password.length > 0 && password.length < 6) msgs.push("A senha deve ter ao menos 6 caracteres.");
    if (password !== confirmPassword) msgs.push("As senhas não coincidem.");
    return msgs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSummaryMessages(null);

    const errors = validate();
    if (errors.length > 0) {
      setSummaryMessages(errors);
      // foca no primeiro campo inválido
      if (!name.trim()) nameRef.current?.focus();
      else if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) emailRef.current?.focus();
      else pwdRef.current?.focus();
      return;
    }

    setLoading(true);

    const payload: CreateRegisterPayload = {
      name: name.trim(),
      email: email.trim(),
      password: password,
    };

    try {
      await RegisterService.create(payload);
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err: any) {
      console.error("register error:", err);
      const status = err?.status ?? err?.response?.status;
      const message =
        err?.message ?? err?.response?.data?.message ?? (status === 409 ? "Usuário já existe." : "Erro ao registrar.");
      setSummaryMessages([message]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page d-flex align-items-center justify-content-center">
      <div className="register-card">
        <div className="text-center mb-3">
          <img src={logoRegister} alt="minhasfinanças" className="register-logo mb-2" />
          <h2 className="brand">minhas<span className="accent">finanças</span></h2>
          <p className="lead-muted">Crie sua conta para começar a ter um controle financeiro avançado</p>
        </div>

        <RegisterForm
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          pwdVisible={pwdVisible}
          loading={loading}
          summaryMessages={summaryMessages}
          nameRef={nameRef}
          emailRef={emailRef}
          pwdRef={pwdRef}
          onChangeName={setName}
          onChangeEmail={setEmail}
          onChangePassword={setPassword}
          onChangeConfirmPassword={setConfirmPassword}
          onTogglePwdVisible={() => setPwdVisible((v) => !v)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
