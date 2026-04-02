import { MobileUploadForm } from "@/components/mobile/mobile-upload-form";
import { Card } from "@/components/ui/card";
import { getMobileUploadToken, isMobileUploadTokenValid } from "@/lib/mobile-upload";

export default async function MobileUploadPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const tokenRecord = await getMobileUploadToken(token);

  if (!isMobileUploadTokenValid(tokenRecord)) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-10">
        <div className="mx-auto max-w-md">
          <Card className="space-y-3 p-5 text-center">
            <h1 className="page-title page-title-accent text-3xl">Link abgelaufen</h1>
            <p className="text-sm leading-6 text-[var(--muted)]">
              Dieser mobile Upload-Link ist nicht mehr gültig. Bitte erstelle auf deinem Computer einen neuen QR-Code.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6">
      <div className="mx-auto max-w-md">
        <MobileUploadForm
          token={token}
          labels={{
            title: "Dokument mit dem Handy hochladen",
            text: "Füge alle Seiten hinzu, prüfe kurz die Reihenfolge und lade das Dokument dann direkt in deinen BureauCare-Account.",
            addPage: "Weitere Seite hinzufügen",
            finish: "Jetzt hochladen",
            finishing: "Wird hochgeladen...",
            camera: "Foto machen",
            gallery: "Bilder auswählen",
            pages: "Seiten",
            success: "Der Upload ist fertig."
          }}
        />
      </div>
    </main>
  );
}
