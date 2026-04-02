import { UploadForm } from "@/components/app/upload-form";
import { MobileScanCard } from "@/components/app/mobile-scan-card";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCopy } from "@/lib/i18n";
import { getCaseById, getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function UploadPage({
  searchParams
}: {
  searchParams?: Promise<{ caseId?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const caseId = resolvedSearchParams?.caseId?.trim() || null;
  const profile = await getProfile();
  const linkedCase = caseId ? await getCaseById(caseId) : null;
  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getCopy(locale);
  const caseUploadCopy =
    locale === "en"
      ? { title: "This upload will be added directly to an existing case.", fallback: "Unknown office" }
      : locale === "tr"
        ? { title: "Bu yükleme doğrudan mevcut bir dosyaya eklenecek.", fallback: "Bilinmeyen kurum" }
        : locale === "uk"
          ? { title: "Це завантаження буде додано безпосередньо до наявної справи.", fallback: "Невідома установа" }
          : locale === "es"
            ? { title: "Esta subida se añadirá directamente a un caso existente.", fallback: "Oficina desconocida" }
            : { title: "Dieser Upload wird direkt zu einem bestehenden Fall hinzugefügt.", fallback: "Unbekannte Stelle" };

  return (
    <div className="space-y-8">
      <section className="space-y-4 pt-4">
        <StatusBadge tone="accent">{copy.upload.badge}</StatusBadge>
        <h1 className="page-title page-title-accent text-3xl sm:text-4xl">{copy.upload.title}</h1>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-8 2xl:grid-cols-2">
          <UploadForm
            caseId={linkedCase?.id ?? null}
            labels={{
              title: copy.upload.cardTitle,
              allowedFormats: copy.upload.allowedFormats,
              dropzoneTitle: copy.upload.dropzoneTitle,
              dropzoneText: copy.upload.dropzoneText,
              pickFile: copy.upload.pickFile,
              submit: copy.upload.submit,
              submitting: copy.upload.submitting
            }}
          />

          <MobileScanCard
            caseId={linkedCase?.id ?? null}
            labels={{
              title: locale === "en" ? "Scan with your phone" : locale === "tr" ? "Telefonla tara" : locale === "uk" ? "Сканувати телефоном" : locale === "es" ? "Escanear con el móvil" : "Mit Handy scannen",
              text:
                locale === "en"
                  ? "Scan this QR code with your phone to upload document pages directly into the same BureauCare account."
                  : locale === "tr"
                    ? "Belge sayfalarını doğrudan aynı BureauCare hesabına yüklemek için bu QR kodunu telefonunla tara."
                    : locale === "uk"
                      ? "Відскануй цей QR-код телефоном, щоб завантажити сторінки документа прямо в той самий акаунт BureauCare."
                      : locale === "es"
                        ? "Escanea este código QR con tu móvil para subir las páginas del documento directamente a la misma cuenta de BureauCare."
                        : "Scanne diesen QR-Code mit deinem Handy, um Dokumentseiten direkt in denselben BureauCare-Account hochzuladen.",
              create: locale === "en" ? "Create QR code" : locale === "tr" ? "QR kodu oluştur" : locale === "uk" ? "Створити QR-код" : locale === "es" ? "Crear código QR" : "QR-Code erzeugen",
              creating: locale === "en" ? "Creating..." : locale === "tr" ? "Wird erstellt..." : locale === "uk" ? "Створюється..." : locale === "es" ? "Creando..." : "Wird erstellt...",
              copyLink: locale === "en" ? "Copy link" : locale === "tr" ? "Linki kopyala" : locale === "uk" ? "Скопіювати посилання" : locale === "es" ? "Copiar enlace" : "Link kopieren",
              copied: locale === "en" ? "Copied" : locale === "tr" ? "Kopiert" : locale === "uk" ? "Скопійовано" : locale === "es" ? "Copiado" : "Kopiert",
              refresh: locale === "en" ? "Generate new code" : locale === "tr" ? "Neuen Code erzeugen" : locale === "uk" ? "Створити новий код" : locale === "es" ? "Generar código nuevo" : "Neuen Code erzeugen",
              waiting: locale === "en" ? "Waiting for the upload from your phone..." : locale === "tr" ? "Warte auf den Upload vom Handy..." : locale === "uk" ? "Очікуємо завантаження з телефону..." : locale === "es" ? "Esperando la subida desde tu móvil..." : "Warte auf den Upload vom Handy...",
              success: locale === "en" ? "The mobile upload is complete." : locale === "tr" ? "Der mobile Upload ist fertig." : locale === "uk" ? "Мобільне завантаження завершено." : locale === "es" ? "La subida móvil está lista." : "Der mobile Upload ist fertig."
            }}
          />
        </div>

        <Card className="space-y-4 p-6 xl:sticky xl:top-6">
          <h2 className="text-lg font-semibold">{copy.upload.saveInfoTitle}</h2>
          <p className="text-sm leading-7 text-[var(--muted)]">{copy.upload.saveInfoText}</p>
          {linkedCase ? (
            <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
              <p className="text-sm font-semibold">{caseUploadCopy.title}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{linkedCase.title}</p>
              <p className="text-sm text-[var(--muted)]">{linkedCase.organization ?? caseUploadCopy.fallback}</p>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
