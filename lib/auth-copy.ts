import type { SupportedLanguage } from "@/lib/languages";

export type AuthCopy = {
  loginPage: {
    back: string;
    eyebrow: string;
    title: string;
    intro: string;
    trustItems: string[];
    form: {
      title: string;
      text: string;
      loginTab: string;
      signupTab: string;
      loginTitle: string;
      loginText: string;
      signupTitle: string;
      signupText: string;
      email: string;
      password: string;
      fullName: string;
      language: string;
      emailPlaceholder: string;
      namePlaceholder: string;
      passwordPlaceholder: string;
      passwordHint: string;
      login: string;
      loginPending: string;
      signup: string;
      signupPending: string;
      forgotPassword: string;
      trustNote: string;
    };
  };
  verifyEmail: {
    eyebrow: string;
    title: string;
    intro: string;
    sentToLabel: string;
    spamHint: string;
    resend: string;
    resendPending: string;
    resendSuccess: string;
    backToLogin: string;
    continueLater: string;
    trustNote: string;
  };
  confirmed: {
    successTitle: string;
    successText: string;
    alreadyTitle: string;
    alreadyText: string;
    expiredTitle: string;
    expiredText: string;
    invalidTitle: string;
    invalidText: string;
    openApp: string;
    goToLogin: string;
  };
};

const copy: Record<SupportedLanguage, AuthCopy> = {
  de: {
    loginPage: {
      back: "Zur Startseite",
      eyebrow: "Sicherer Zugang",
      title: "Dein ruhiger Ort für Bürokratie.",
      intro:
        "Melde dich an und behalte Dokumente, Anträge und nächste Schritte an einem Ort – klar sortiert, ohne zusätzlichen Lärm.",
      trustItems: [
        "Deine Dokumente werden geschützt gespeichert.",
        "Nur du hast Zugriff auf deine Daten.",
        "BureauCare gibt nichts ohne deine Zustimmung weiter."
      ],
      form: {
        title: "Dein Einstieg ohne Bürokratie-Stress.",
        text: "Ein Konto, und du hast deine Dokumente, Anträge und nächsten Schritte an einem Ort.",
        loginTab: "Anmelden",
        signupTab: "Registrieren",
        loginTitle: "Anmelden",
        loginText: "Greife sicher auf deine Dokumente und laufenden Vorgänge zu.",
        signupTitle: "Registrieren",
        signupText: "Erstelle in wenigen Sekunden dein Konto und starte später schneller in neue Anträge.",
        email: "E-Mail",
        password: "Passwort",
        fullName: "Vollständiger Name",
        language: "Sprache",
        emailPlaceholder: "name@beispiel.de",
        namePlaceholder: "Max Mustermann",
        passwordPlaceholder: "Mindestens 8 Zeichen",
        passwordHint: "Bitte wähle ein sicheres Passwort mit mindestens 8 Zeichen.",
        login: "Anmelden",
        loginPending: "Anmeldung läuft…",
        signup: "Konto erstellen",
        signupPending: "Konto wird erstellt…",
        forgotPassword: "Passwort vergessen? (Link senden)",
        trustNote: "Deine Angaben werden nur für dein Konto und spätere Anträge genutzt."
      }
    },
    verifyEmail: {
      eyebrow: "Nur noch ein Schritt",
      title: "Bitte bestätige deine E-Mail",
      intro:
        "Wir haben dir eine E-Mail geschickt. Bitte öffne den Link darin, damit dein Konto sicher freigeschaltet wird.",
      sentToLabel: "Gesendet an",
      spamHint: "Falls nichts ankommt, prüfe bitte auch deinen Spam-Ordner.",
      resend: "E-Mail erneut senden",
      resendPending: "Wird erneut gesendet…",
      resendSuccess: "Wir haben dir eine neue E-Mail geschickt.",
      backToLogin: "Zurück zum Login",
      continueLater: "Jetzt anmelden",
      trustNote: "Wir verwenden deine E-Mail nur für dein Konto und wichtige Sicherheitsnachrichten."
    },
    confirmed: {
      successTitle: "Dein Konto ist bestätigt",
      successText: "Deine E-Mail wurde erfolgreich bestätigt. Du kannst BureauCare jetzt sicher nutzen.",
      alreadyTitle: "Dein Konto ist bereits bestätigt",
      alreadyText: "Diese E-Mail wurde schon bestätigt. Du kannst dich direkt anmelden oder weiter in die App gehen.",
      expiredTitle: "Dieser Link ist nicht mehr gültig",
      expiredText: "Bitte fordere einfach eine neue Bestätigungs-E-Mail an und versuche es noch einmal.",
      invalidTitle: "Bestätigung nicht möglich",
      invalidText: "Der Link war unvollständig oder konnte nicht mehr verarbeitet werden.",
      openApp: "Zur App",
      goToLogin: "Zum Login"
    }
  },
  en: {
    loginPage: {
      back: "Back to start",
      eyebrow: "Secure access",
      title: "Your quiet place for paperwork.",
      intro:
        "Sign in and keep documents, applications, and next steps in one place—organized, without the noise.",
      trustItems: [
        "Your documents are stored securely.",
        "Only you can access your data.",
        "BureauCare never shares anything without your permission."
      ],
      form: {
        title: "Your calm entry—without the bureaucracy stress.",
        text: "One account keeps your documents, applications, and next steps in one clear place.",
        loginTab: "Sign in",
        signupTab: "Register",
        loginTitle: "Sign in",
        loginText: "Access your documents and ongoing processes securely.",
        signupTitle: "Register",
        signupText: "Create your account in seconds and start future applications faster.",
        email: "Email",
        password: "Password",
        fullName: "Full name",
        language: "Language",
        emailPlaceholder: "name@example.com",
        namePlaceholder: "Alex Example",
        passwordPlaceholder: "At least 8 characters",
        passwordHint: "Please choose a secure password with at least 8 characters.",
        login: "Sign in",
        loginPending: "Signing in...",
        signup: "Create account",
        signupPending: "Creating account...",
        forgotPassword: "Forgot password? (Send link)",
        trustNote: "Your details are only used for your account and future applications."
      }
    },
    verifyEmail: {
      eyebrow: "One more step",
      title: "Please confirm your email",
      intro: "We sent you an email. Open the link inside it so your account can be securely activated.",
      sentToLabel: "Sent to",
      spamHint: "If nothing arrives, please also check your spam folder.",
      resend: "Send email again",
      resendPending: "Sending again...",
      resendSuccess: "We sent you a new email.",
      backToLogin: "Back to login",
      continueLater: "Log in now",
      trustNote: "We only use your email for your account and important security messages."
    },
    confirmed: {
      successTitle: "Your account is confirmed",
      successText: "Your email was confirmed successfully. You can now use BureauCare safely.",
      alreadyTitle: "Your account is already confirmed",
      alreadyText: "This email was already confirmed. You can sign in directly or continue into the app.",
      expiredTitle: "This link is no longer valid",
      expiredText: "Please request a new confirmation email and try again.",
      invalidTitle: "Confirmation was not possible",
      invalidText: "The link was incomplete or could no longer be processed.",
      openApp: "Open app",
      goToLogin: "Go to login"
    }
  },
  tr: {
    loginPage: {
      back: "Baslangica don",
      eyebrow: "Guvenli erisim",
      title: "BureauCare'e hos geldin",
      intro: "Belgelerini, basvurularini ve sonraki adimlarini tek bir sakin yerde guvenle yonet.",
      trustItems: [
        "Belgelerin guvenli sekilde saklanir.",
        "Verilerine sadece sen erisirsin.",
        "BureauCare iznin olmadan hicbir seyi paylasmaz."
      ],
      form: {
        title: "Sakin ve guvenli basla",
        text: "Belgelerini guvenle yonetmek ve gelecekteki basvurulari daha hizli baslatmak icin tek bir hesap yeterlidir.",
        loginTab: "Giris yap",
        signupTab: "Kayit ol",
        loginTitle: "Giris yap",
        loginText: "Belgelerine ve acik sureclerine guvenli sekilde ulas.",
        signupTitle: "Kayit ol",
        signupText: "Hesabini saniyeler icinde olustur ve gelecekteki basvurulara daha hizli basla.",
        email: "E-posta",
        password: "Sifre",
        fullName: "Ad soyad",
        language: "Dil",
        emailPlaceholder: "isim@ornek.de",
        namePlaceholder: "Ali Ornek",
        passwordPlaceholder: "En az 8 karakter",
        passwordHint: "Lütfen en az 8 karakterli güvenli bir şifre seç.",
        login: "Giris yap",
        loginPending: "Giris yapiliyor...",
        signup: "Hesap olustur",
        signupPending: "Hesap olusturuluyor...",
        forgotPassword: "Sifremi unuttum (Link gonder)",
        trustNote: "Bilgilerin sadece hesabin ve gelecekteki basvurular icin kullanilir."
      }
    },
    verifyEmail: {
      eyebrow: "Sadece bir adim daha",
      title: "Lutfen e-postani onayla",
      intro: "Sana bir e-posta gonderdik. Hesabinin guvenle acilmasi icin icindeki baglantiyi ac.",
      sentToLabel: "Gonderilen adres",
      spamHint: "Bir sey gelmezse spam klasorunu de kontrol et.",
      resend: "E-postayi tekrar gonder",
      resendPending: "Tekrar gonderiliyor...",
      resendSuccess: "Sana yeni bir e-posta gonderdik.",
      backToLogin: "Logine don",
      continueLater: "Simdi giris yap",
      trustNote: "E-postani sadece hesabin ve onemli guvenlik mesajlari icin kullaniriz."
    },
    confirmed: {
      successTitle: "Hesabin onaylandi",
      successText: "E-postan basariyla onaylandi. Artik BureauCare'i guvenle kullanabilirsin.",
      alreadyTitle: "Hesabin zaten onayli",
      alreadyText: "Bu e-posta zaten onaylanmis. Dogrudan giris yapabilir veya uygulamaya gecebilirsin.",
      expiredTitle: "Bu baglanti artik gecerli degil",
      expiredText: "Lutfen yeni bir onay e-postasi iste ve tekrar dene.",
      invalidTitle: "Onaylama mumkun olmadi",
      invalidText: "Baglanti eksikti veya artik islenemedi.",
      openApp: "Uygulamaya git",
      goToLogin: "Logine git"
    }
  },
  uk: {
    loginPage: {
      back: "Nazad na start",
      eyebrow: "Bezpechnyi dostup",
      title: "Laskavo prosymo do BureauCare",
      intro: "Bezpechno uviid i trymay dokumenty, zaiavy ta nastupni kroky v odnomu spokiinomu mistsi.",
      trustItems: [
        "Tvoi dokumenty zberihaiutsia bezpechno.",
        "Lyshe ty maiesh dostup do svoikh danykh.",
        "BureauCare nichoho ne peredaie bez tvoiei zghody."
      ],
      form: {
        title: "Spokiinyi ta bezpechnyi start",
        text: "Odnoho akaunta dostatno, shchob bezpechno keruvaty dokumentamy ta shvydshe pochaty maibutni zaiavy.",
        loginTab: "Uviity",
        signupTab: "Zareiestruvatysia",
        loginTitle: "Uviity",
        loginText: "Bezpechno vidkryi svoi dokumenty ta aktyvni protsesy.",
        signupTitle: "Zareiestruvatysia",
        signupText: "Stvory akaunt za kilka sekund i pochnesh nastupni zaiavy shvydshe.",
        email: "Email",
        password: "Parol",
        fullName: "Povne imia",
        language: "Mova",
        emailPlaceholder: "name@example.com",
        namePlaceholder: "Olena Pryklad",
        passwordPlaceholder: "Shchonaimenshe 8 symvoliv",
        passwordHint: "Bud laska, obery bezpechnyi parol shchonaimenshe z 8 symvoliv.",
        login: "Uviity",
        loginPending: "Vkhid...",
        signup: "Stvoryty akaunt",
        signupPending: "Stvorennia akaunta...",
        forgotPassword: "Zabuly parol? (Nadislaty posylannia)",
        trustNote: "Tvoi dani vykorystovuiutsia lyshe dlia tvoho akaunta ta maibutnikh zaiav."
      }
    },
    verifyEmail: {
      eyebrow: "Shche odyn krok",
      title: "Bud laska, pidtverdy email",
      intro: "My nadisly tobi lyst. Vidkryi posylannia vseredyni, shchob bezpechno aktyvuvaty akaunt.",
      sentToLabel: "Nadislano na",
      spamHint: "Yakshcho lysta nemae, perevir takozh papku spam.",
      resend: "Nadislaty lyst shche raz",
      resendPending: "Povtorne nadsylannia...",
      resendSuccess: "My nadisly tobi novyi lyst.",
      backToLogin: "Nazad do loginu",
      continueLater: "Uviity zaraz",
      trustNote: "My vykorystovuiemo tvii email lyshe dlia akaunta ta vazhlyvykh bezpekhovykh povidomlen."
    },
    confirmed: {
      successTitle: "Tvii akaunt pidtverdzheno",
      successText: "Tvii email uspishno pidtverdzheno. Teper mozhesh bezpechno korystuvatys BureauCare.",
      alreadyTitle: "Tvii akaunt uzhe pidtverdzheno",
      alreadyText: "Tsei email uzhe pidtverdzhenyi. Mozhesh odrazu uviity abo pereity do zastosunku.",
      expiredTitle: "Tse posylannia bilshe ne diie",
      expiredText: "Bud laska, zapytai novu lystivku dlia pidtverdzhennia i sprobui shche raz.",
      invalidTitle: "Pidtverdzhennia nemozhlyve",
      invalidText: "Posylannia bulo ne povne abo bilshe ne obrobliaietsia.",
      openApp: "Do zastosunku",
      goToLogin: "Do loginu"
    }
  },
  es: {
    loginPage: {
      back: "Volver al inicio",
      eyebrow: "Acceso seguro",
      title: "Bienvenido a BureauCare",
      intro: "Entra de forma segura y manten tus documentos, tramites y siguientes pasos en un solo lugar tranquilo.",
      trustItems: [
        "Tus documentos se guardan de forma segura.",
        "Solo tu puedes acceder a tus datos.",
        "BureauCare no comparte nada sin tu permiso."
      ],
      form: {
        title: "Empieza con calma y seguridad",
        text: "Una sola cuenta es suficiente para gestionar tus documentos y empezar futuros tramites mas rapido.",
        loginTab: "Entrar",
        signupTab: "Registrarse",
        loginTitle: "Entrar",
        loginText: "Accede de forma segura a tus documentos y procesos abiertos.",
        signupTitle: "Registrarse",
        signupText: "Crea tu cuenta en segundos y empieza futuros tramites mas rapido.",
        email: "Correo electronico",
        password: "Contrasena",
        fullName: "Nombre completo",
        language: "Idioma",
        emailPlaceholder: "nombre@ejemplo.com",
        namePlaceholder: "Lucia Ejemplo",
        passwordPlaceholder: "Al menos 8 caracteres",
        passwordHint: "Elige una contraseña segura con al menos 8 caracteres.",
        login: "Entrar",
        loginPending: "Entrando...",
        signup: "Crear cuenta",
        signupPending: "Creando cuenta...",
        forgotPassword: "Olvide mi contrasena (Enviar enlace)",
        trustNote: "Tus datos solo se usan para tu cuenta y tus futuros tramites."
      }
    },
    verifyEmail: {
      eyebrow: "Solo falta un paso",
      title: "Confirma tu correo electronico",
      intro: "Te enviamos un correo. Abre el enlace dentro para activar tu cuenta de forma segura.",
      sentToLabel: "Enviado a",
      spamHint: "Si no llega nada, revisa tambien tu carpeta de spam.",
      resend: "Enviar correo otra vez",
      resendPending: "Se esta enviando otra vez...",
      resendSuccess: "Te enviamos un nuevo correo.",
      backToLogin: "Volver al login",
      continueLater: "Entrar ahora",
      trustNote: "Solo usamos tu correo para tu cuenta y mensajes de seguridad importantes."
    },
    confirmed: {
      successTitle: "Tu cuenta esta confirmada",
      successText: "Tu correo se confirmo correctamente. Ahora puedes usar BureauCare con seguridad.",
      alreadyTitle: "Tu cuenta ya esta confirmada",
      alreadyText: "Este correo ya estaba confirmado. Puedes entrar directamente o seguir a la app.",
      expiredTitle: "Este enlace ya no es valido",
      expiredText: "Pide un nuevo correo de confirmacion y vuelve a intentarlo.",
      invalidTitle: "No fue posible confirmar",
      invalidText: "El enlace estaba incompleto o ya no se pudo procesar.",
      openApp: "Ir a la app",
      goToLogin: "Ir al login"
    }
  },
  zh: {
    loginPage: {
      back: "返回首页",
      eyebrow: "安全访问",
      title: "欢迎来到 BureauCare",
      intro: "安全登录后，你可以在一个安静清晰的地方查看自己的文件、申请和下一步事项。",
      trustItems: [
        "你的文件会被安全保存。",
        "只有你可以访问自己的数据。",
        "未经你的同意，BureauCare 不会共享任何内容。"
      ],
      form: {
        title: "安心开始，安全使用",
        text: "一个账号就可以安全管理你的文件，也能让之后的申请更快开始。",
        loginTab: "登录",
        signupTab: "注册",
        loginTitle: "登录",
        loginText: "安全访问你的文件和正在进行的流程。",
        signupTitle: "注册",
        signupText: "几秒钟内创建账号，以后办理申请会更快。",
        email: "电子邮箱",
        password: "密码",
        fullName: "姓名",
        language: "语言",
        emailPlaceholder: "name@example.com",
        namePlaceholder: "张三",
        passwordPlaceholder: "至少 8 个字符",
        passwordHint: "请选择至少 8 个字符的安全密码。",
        login: "登录",
        loginPending: "正在登录...",
        signup: "创建账号",
        signupPending: "正在创建账号...",
        forgotPassword: "忘记密码？(发送链接)",
        trustNote: "这些信息只会用于你的账号和之后的申请。"
      }
    },
    verifyEmail: {
      eyebrow: "还差一步",
      title: "请确认你的邮箱地址",
      intro: "我们已经向你发送了一封邮件。请打开邮件中的链接，安全激活你的账号。",
      sentToLabel: "已发送到",
      spamHint: "如果暂时没有收到，请也检查一下垃圾邮件文件夹。",
      resend: "重新发送邮件",
      resendPending: "正在重新发送...",
      resendSuccess: "我们已经重新向你发送了一封邮件。",
      backToLogin: "返回登录",
      continueLater: "现在登录",
      trustNote: "我们只会将你的邮箱用于账号和重要的安全通知。"
    },
    confirmed: {
      successTitle: "你的账号已确认",
      successText: "你的邮箱已成功确认。现在你可以安全使用 BureauCare。",
      alreadyTitle: "你的账号已经确认过了",
      alreadyText: "这个邮箱已经完成确认。你现在可以直接登录，或者继续进入应用。",
      expiredTitle: "这个链接已失效",
      expiredText: "请重新申请一封确认邮件，然后再试一次。",
      invalidTitle: "无法完成确认",
      invalidText: "这个链接不完整，或者已经无法继续处理。",
      openApp: "进入应用",
      goToLogin: "前往登录"
    }
  }
};

export function getAuthCopy(locale: SupportedLanguage) {
  return copy[locale];
}
