import { UploadForm } from "@/components/app/upload-form";
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
    <div className="space-y-6">
      <section className="space-y-3 pt-3">
        <StatusBadge tone="accent">{copy.upload.badge}</StatusBadge>
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">{copy.upload.title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">{copy.upload.intro}</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
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

        <Card className="space-y-3 p-5 xl:sticky xl:top-6">
          <h2 className="text-lg font-semibold">{copy.upload.saveInfoTitle}</h2>
          <p className="text-sm leading-6 text-[var(--muted)]">{copy.upload.saveInfoText}</p>
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
