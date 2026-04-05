import { MobileScanCard } from "@/components/app/mobile-scan-card";
import { UploadForm } from "@/components/app/upload-form";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getContractAnalysisCopy } from "@/lib/contract-analysis-ui";
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
  const contractCopy = getContractAnalysisCopy(locale);

  const caseUploadCopy =
    locale === "en"
      ? { title: "This upload will be added directly to an existing case.", fallback: "Unknown office" }
      : locale === "tr"
        ? { title: "Bu yukleme dogrudan mevcut bir dosyaya eklenecek.", fallback: "Bilinmeyen kurum" }
        : locale === "uk"
          ? { title: "Ce zavantazhennya bude dodano bezposeredno do nayavnoyi spravy.", fallback: "Nevidoma ustanova" }
          : locale === "es"
            ? { title: "Esta subida se anadira directamente a un caso existente.", fallback: "Oficina desconocida" }
            : locale === "zh"
              ? { title: "\u8fd9\u6b21\u4e0a\u4f20\u4f1a\u76f4\u63a5\u52a0\u5165\u5230\u4e00\u4e2a\u5df2\u6709\u6848\u4ef6\u4e2d\u3002", fallback: "\u672a\u77e5\u673a\u6784" }
              : { title: "Dieser Upload wird direkt zu einem bestehenden Fall hinzugefugt.", fallback: "Unbekannte Stelle" };

  return (
    <div className="space-y-8">
      <section className="space-y-4 pt-4">
        <StatusBadge tone="accent">{copy.upload.badge}</StatusBadge>
        <h1 className="page-title page-title-accent text-3xl sm:text-4xl">{copy.upload.title}</h1>
      </section>

      <section className="grid gap-8 xl:grid-cols-2 xl:items-stretch">
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
            title:
              locale === "en"
                ? "Scan with your phone"
                : locale === "tr"
                  ? "Telefonla tara"
                  : locale === "uk"
                    ? "Skanuvaty telefonom"
                    : locale === "es"
                      ? "Escanear con el movil"
                      : locale === "zh"
                        ? "\u7528\u624b\u673a\u626b\u63cf"
                        : "Mit Handy scannen",
            text:
              locale === "en"
                ? "Scan this QR code with your phone to upload document pages directly into the same BureauCare account."
                : locale === "tr"
                  ? "Belge sayfalarini dogrudan ayni BureauCare hesabina yuklemek icin bu QR kodunu telefonunla tara."
                  : locale === "uk"
                    ? "Vidskanuy tsey QR-kod telefonom, shchob zavantazhyty storinky dokumenta pryamo v toy samyy akaunt BureauCare."
                    : locale === "es"
                      ? "Escanea este codigo QR con tu movil para subir las paginas del documento directamente a la misma cuenta de BureauCare."
                      : locale === "zh"
                        ? "\u7528\u624b\u673a\u626b\u63cf\u8fd9\u4e2a\u4e8c\u7ef4\u7801\uff0c\u5c31\u53ef\u4ee5\u628a\u6587\u4ef6\u9875\u9762\u76f4\u63a5\u4e0a\u4f20\u5230\u540c\u4e00\u4e2a BureauCare \u8d26\u6237\u3002"
                        : "Scanne diesen QR-Code mit deinem Handy, um Dokumentseiten direkt in denselben BureauCare-Account hochzuladen.",
            note:
              locale === "en"
                ? "This works best when you open BureauCare on your computer and scan the code with your phone."
                : locale === "tr"
                  ? "Bu ozellik en cok BureauCare bilgisayarda acikken ve kodu telefonunla taradiginda faydali olur."
                  : locale === "uk"
                    ? "Nayzruchnishe tse pratsyuye, koly BureauCare vidkryto na kompyuteri, a ty skanuiesh kod telefonom."
                    : locale === "es"
                      ? "Esto tiene mas sentido cuando BureauCare esta abierto en tu ordenador y escaneas el codigo con tu movil."
                      : locale === "zh"
                        ? "\u8fd9\u4e2a\u529f\u80fd\u6700\u9002\u5408\u5728\u7535\u8111\u4e0a\u6253\u5f00 BureauCare \u540e\uff0c\u518d\u7528\u624b\u673a\u626b\u63cf\u4e8c\u7ef4\u7801\u3002"
                        : "Am sinnvollsten ist das, wenn BureauCare auf deinem Computer offen ist und du den Code mit dem Handy scannst.",
            create:
              locale === "en"
                ? "Create QR code"
                : locale === "tr"
                  ? "QR kodu olustur"
                  : locale === "uk"
                    ? "Stvoryty QR-kod"
                    : locale === "es"
                      ? "Crear codigo QR"
                      : locale === "zh"
                        ? "\u751f\u6210\u4e8c\u7ef4\u7801"
                        : "QR-Code erzeugen",
            creating:
              locale === "en"
                ? "Creating..."
                : locale === "tr"
                  ? "Wird erstellt..."
                  : locale === "uk"
                    ? "Stvoryuyetsya..."
                    : locale === "es"
                      ? "Creando..."
                      : locale === "zh"
                        ? "\u6b63\u5728\u751f\u6210..."
                        : "Wird erstellt...",
            copyLink:
              locale === "en"
                ? "Copy link"
                : locale === "tr"
                  ? "Linki kopyala"
                  : locale === "uk"
                    ? "Skopiyuvaty posylannya"
                    : locale === "es"
                      ? "Copiar enlace"
                      : locale === "zh"
                        ? "\u590d\u5236\u94fe\u63a5"
                        : "Link kopieren",
            copied:
              locale === "en"
                ? "Copied"
                : locale === "tr"
                  ? "Kopiert"
                  : locale === "uk"
                    ? "Skopiyovano"
                    : locale === "es"
                      ? "Copiado"
                      : locale === "zh"
                        ? "\u5df2\u590d\u5236"
                        : "Kopiert",
            refresh:
              locale === "en"
                ? "Generate new code"
                : locale === "tr"
                  ? "Neuen Code erzeugen"
                  : locale === "uk"
                    ? "Stvoryty novyy kod"
                    : locale === "es"
                      ? "Generar codigo nuevo"
                      : locale === "zh"
                        ? "\u751f\u6210\u65b0\u7684\u4e8c\u7ef4\u7801"
                        : "Neuen Code erzeugen",
            waiting:
              locale === "en"
                ? "Waiting for the upload from your phone..."
                : locale === "tr"
                  ? "Warte auf den Upload vom Handy..."
                  : locale === "uk"
                    ? "Ochikuyemo zavantazhennya z telefonu..."
                    : locale === "es"
                      ? "Esperando la subida desde tu movil..."
                      : locale === "zh"
                        ? "\u6b63\u5728\u7b49\u5f85\u624b\u673a\u7aef\u4e0a\u4f20..."
                        : "Warte auf den Upload vom Handy...",
            success:
              locale === "en"
                ? "The mobile upload is complete."
                : locale === "tr"
                  ? "Der mobile Upload ist fertig."
                  : locale === "uk"
                    ? "Mobilne zavantazhennya zaversheno."
                    : locale === "es"
                      ? "La subida movil esta lista."
                      : locale === "zh"
                        ? "\u624b\u673a\u7aef\u4e0a\u4f20\u5df2\u5b8c\u6210\u3002"
                        : "Der mobile Upload ist fertig."
          }}
        />
      </section>

      <Card className="space-y-4 p-5 sm:p-6">
        <div className="rounded-[20px] border border-[rgba(95,163,163,0.16)] bg-[rgba(238,246,245,0.82)] p-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">{contractCopy.uploadHintTitle}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{contractCopy.uploadHintText}</p>
        </div>
        <p className="text-sm font-semibold text-[var(--foreground)]/90">{copy.upload.saveInfoTitle}</p>
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
  );
}
