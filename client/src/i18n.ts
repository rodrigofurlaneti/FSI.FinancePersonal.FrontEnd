import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: {
        title: "Login",
        subtitle: "Use your corporate credentials",
        usernameOrEmail: "Email",
        email: "Email",
        password: "Password",
        showPassword: "Show password",
        hidePassword: "Hide password",
        capsLockOn: "CapsLock is on",
        keepPasswordSafe: "Keep your password safe",
        rememberMe: "Remember me",
        login: "Login",
        loggingIn: "Logging in...",
        forgotPassword: "Forgot my password",
        register: "Register",
        securityAndPrivacy: "Security and Privacy"
      },
      validation: {
        enterUsernameOrEmail: "Please enter username or email.",
        enterPassword: "Please enter password."
      },
      errors: {
        invalidCredentials: "Invalid credentials",
        loginFailedTitle: "Login Failed",
        ok: "OK"
      }
    }
  },
  ptBR: {
    translation: {
      login: {
        title: "Login",
        subtitle: "Use suas credenciais corporativas",
        usernameOrEmail: "E-mail",
        email: "E-mail",
        password: "Senha",
        showPassword: "Mostrar senha",
        hidePassword: "Ocultar senha",
        capsLockOn: "CapsLock está ativado",
        keepPasswordSafe: "Mantenha sua senha segura",
        rememberMe: "Lembrar-me",
        login: "Login",
        loggingIn: "Entrando...",
        forgotPassword: "Esqueci minha senha",
        register: "Cadastrar",
        securityAndPrivacy: "Segurança e Privacidade"
      },
      validation: {
        enterUsernameOrEmail: "Informe usuário ou e-mail.",
        enterPassword: "Informe a senha."
      },
      errors: {
        invalidCredentials: "Credenciais inválidas",
        loginFailedTitle: "Falha no login",
        ok: "OK"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // idioma padrão
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React já faz escaping
    },
  });

export default i18n;