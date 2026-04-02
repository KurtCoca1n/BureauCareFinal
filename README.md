# BureauCare V1

Mobile-first WebApp mit Next.js App Router, Supabase, Dokument-Upload, Analyse, Antwortgenerator und Fristen.

## Lokal starten

1. `npm install`
2. `.env.example` nach `.env.local` kopieren
3. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` und `OPENAI_API_KEY` eintragen
4. SQL aus [supabase/schema.sql](/C:/Users/kyahm/Desktop/Projekte/BureauCare/supabase/schema.sql) im Supabase SQL Editor ausführen
5. `npm run dev`

## Wichtige Hinweise

- Es wird kein `service_role` Key im Client verwendet.
- Für die Analyse und den Antwortgenerator wird nur `OPENAI_API_KEY` serverseitig genutzt.
- Nach Schema-Änderungen muss [supabase/schema.sql](/C:/Users/kyahm/Desktop/Projekte/BureauCare/supabase/schema.sql) erneut im Supabase-Projekt ausgeführt werden.
- Neue Nutzer bekommen über den Trigger `handle_new_user` automatisch einen `profiles`-Eintrag.

## Freemium-Logik

- Standardmäßig sind `3` Dokument-Analysen pro Monat kostenlos.
- Die Nutzung wird über `usage_events` vorbereitet und im UI angezeigt.
- Wenn das Monatslimit erreicht ist, startet keine neue Analyse mehr.

## Deployment

Für Vercel oder ähnliche Deployments:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- optional `OPENAI_MODEL`

Vor dem Deployment prüfen:

- Build lokal mit `npm run build`
- aktuelles Supabase-Schema ausgeführt
- keine sensiblen Server-Keys im Client
- Supabase Storage-Bucket `documents` vorhanden

## Troubleshooting

- Wenn Tabellen oder Policies fehlen, zuerst [supabase/schema.sql](/C:/Users/kyahm/Desktop/Projekte/BureauCare/supabase/schema.sql) ausführen.
- Wenn Uploads scheitern, Storage-Bucket und Storage-Policies prüfen.
- Wenn Analysen nicht starten, Monatslimit, OpenAI-Key und lesbare Dokumentdatei prüfen.
