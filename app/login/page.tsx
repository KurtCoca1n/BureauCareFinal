import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/ui/page-shell";
import { getRequestLanguage } from "@/lib/request-locale";

const loginCopy = {
  de: {
    back: "Zur Startseite",
    eyebrow: "Sicherer Zugang",
    title: "Anmelden oder Konto erstellen",
    intro: "Melde dich an, um Dokumente hochzuladen, wiederzufinden und verständliche Erklärungen zu erhalten.",
    form: {
      badge: "BureauCare V1",
      title: "Sicherer Zugriff auf deine Dokumente",
      text: "Registrieren, einloggen und deine Unterlagen direkt im geschützten Bereich verwalten.",
      email: "E-Mail",
      password: "Passwort",
      fullName: "Vollständiger Name",
      language: "Sprache",
      emailPlaceholder: "name@beispiel.de",
      namePlaceholder: "Max Mustermann",
      passwordPlaceholder: "Mindestens 8 Zeichen",
      login: "Einloggen",
      loginPending: "Einloggen…",
      signup: "Registrieren",
      signupPending: "Registrieren…"
    }
  },
  en: {
    back: "Back to start",
    eyebrow: "Secure access",
    title: "Sign in or create an account",
    intro: "Sign in to upload documents, find them again and receive clear explanations.",
    form: {
      badge: "BureauCare V1",
      title: "Secure access to your documents",
      text: "Register, sign in and manage your documents directly in your protected area.",
      email: "Email",
      password: "Password",
      fullName: "Full name",
      language: "Language",
      emailPlaceholder: "name@example.com",
      namePlaceholder: "Alex Example",
      passwordPlaceholder: "At least 8 characters",
      login: "Sign in",
      loginPending: "Signing in…",
      signup: "Create account",
      signupPending: "Creating account…"
    }
  },
  tr: {
    back: "Başlangıca dön",
    eyebrow: "Güvenli erişim",
    title: "Giriş yap veya hesap oluştur",
    intro: "Belge yüklemek, tekrar bulmak ve açık açıklamalar almak için giriş yap.",
    form: {
      badge: "BureauCare V1",
      title: "Belgelerine güvenli erişim",
      text: "Kayıt ol, giriş yap ve belgelerini korumalı alanında yönet.",
      email: "E-posta",
      password: "Şifre",
      fullName: "Ad soyad",
      language: "Dil",
      emailPlaceholder: "isim@ornek.de",
      namePlaceholder: "Ali Örnek",
      passwordPlaceholder: "En az 8 karakter",
      login: "Giriş yap",
      loginPending: "Giriş yapılıyor…",
      signup: "Kayıt ol",
      signupPending: "Kayıt oluşturuluyor…"
    }
  },
  uk: {
    back: "Назад на старт",
    eyebrow: "Безпечний доступ",
    title: "Увійти або створити акаунт",
    intro: "Увійди, щоб завантажувати документи, легко знаходити їх знову й отримувати зрозумілі пояснення.",
    form: {
      badge: "BureauCare V1",
      title: "Безпечний доступ до твоїх документів",
      text: "Зареєструйся, увійди та керуй документами у своєму захищеному просторі.",
      email: "Електронна пошта",
      password: "Пароль",
      fullName: "Повне ім’я",
      language: "Мова",
      emailPlaceholder: "name@example.com",
      namePlaceholder: "Олена Приклад",
      passwordPlaceholder: "Щонайменше 8 символів",
      login: "Увійти",
      loginPending: "Вхід…",
      signup: "Створити акаунт",
      signupPending: "Створення акаунта…"
    }
  },
  es: {
    back: "Volver al inicio",
    eyebrow: "Acceso seguro",
    title: "Iniciar sesión o crear cuenta",
    intro: "Inicia sesión para subir documentos, volver a encontrarlos y recibir explicaciones claras.",
    form: {
      badge: "BureauCare V1",
      title: "Acceso seguro a tus documentos",
      text: "Regístrate, inicia sesión y gestiona tus documentos en tu área protegida.",
      email: "Correo electrónico",
      password: "Contraseña",
      fullName: "Nombre completo",
      language: "Idioma",
      emailPlaceholder: "nombre@ejemplo.com",
      namePlaceholder: "Lucía Ejemplo",
      passwordPlaceholder: "Al menos 8 caracteres",
      login: "Entrar",
      loginPending: "Entrando…",
      signup: "Crear cuenta",
      signupPending: "Creando cuenta…"
    }
  }
} as const;

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const locale = await getRequestLanguage();
  const copy = loginCopy[locale];

  return (
    <PageShell className="max-w-md justify-center gap-8 py-8">
      <div className="space-y-4">
        <Link href="/" className="text-sm font-medium text-[var(--muted)]">
          {copy.back}
        </Link>
        <div className="space-y-3">
          <p className="text-sm text-[var(--muted)]">{copy.eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em]">{copy.title}</h1>
          <p className="text-sm leading-6 text-[var(--muted)]">{copy.intro}</p>
        </div>
      </div>
      <AuthForm nextPath={params.next} locale={locale} defaultLanguage={locale} copy={copy.form} />
    </PageShell>
  );
}
