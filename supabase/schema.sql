create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  full_name text,
  preferred_language text default 'de'
);

alter table public.profiles
  drop constraint if exists profiles_preferred_language_check;

alter table public.profiles
  add constraint profiles_preferred_language_check
  check (preferred_language in ('de', 'en', 'tr', 'uk', 'es', 'zh'));

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid,
  status text default 'neu',
  document_date date,
  sender text,
  subject text,
  file_path text not null,
  original_filename text not null,
  mime_type text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  organization text,
  status text not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.documents add column if not exists case_id uuid;
alter table public.documents add column if not exists status text default 'neu';
alter table public.documents add column if not exists document_date date;
alter table public.documents add column if not exists sender text;
alter table public.documents add column if not exists subject text;

alter table public.documents
  drop constraint if exists documents_case_id_fkey;

alter table public.documents
  add constraint documents_case_id_fkey
  foreign key (case_id) references public.cases(id) on delete set null;

alter table public.documents
  drop constraint if exists documents_status_check;

alter table public.documents
  add constraint documents_status_check
  check (status in ('neu', 'analysiert', 'antwort_erstellt', 'gesendet', 'warten', 'erledigt'));

alter table public.cases
  drop constraint if exists cases_status_check;

alter table public.cases
  add constraint cases_status_check
  check (status in ('open', 'waiting', 'done'));

create table if not exists public.document_analyses (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  sender text,
  document_type text,
  subject text,
  summary_simple text,
  summary_simple_short text,
  summary_simple_long text,
  is_action_required boolean,
  deadline_date date,
  urgency text,
  key_points jsonb,
  highlight_terms jsonb,
  difficult_terms jsonb,
  next_steps jsonb,
  page_count integer,
  page_summaries jsonb,
  important_references jsonb,
  action_location_name text,
  action_location_address text,
  action_url text,
  action_mode text,
  risks_if_ignored text,
  required_action text,
  raw_extracted_text text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.document_analyses add column if not exists document_type text;
alter table public.document_analyses add column if not exists is_action_required boolean;
alter table public.document_analyses add column if not exists summary_simple_short text;
alter table public.document_analyses add column if not exists summary_simple_long text;
alter table public.document_analyses add column if not exists key_points jsonb;
alter table public.document_analyses add column if not exists highlight_terms jsonb;
alter table public.document_analyses add column if not exists difficult_terms jsonb;
alter table public.document_analyses add column if not exists next_steps jsonb;
alter table public.document_analyses add column if not exists page_count integer;
alter table public.document_analyses add column if not exists page_summaries jsonb;
alter table public.document_analyses add column if not exists important_references jsonb;
alter table public.document_analyses add column if not exists action_location_name text;
alter table public.document_analyses add column if not exists action_location_address text;
alter table public.document_analyses add column if not exists action_url text;
alter table public.document_analyses add column if not exists action_mode text;
alter table public.document_analyses add column if not exists risks_if_ignored text;

create unique index if not exists document_analyses_document_id_key
on public.document_analyses (document_id);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  title text not null,
  document_sender text,
  document_subject text,
  action_summary text,
  importance_reason text,
  action_location_name text,
  action_location_address text,
  action_url text,
  action_mode text,
  due_date date,
  status text default 'open',
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.tasks add column if not exists document_sender text;
alter table public.tasks add column if not exists document_subject text;
alter table public.tasks add column if not exists action_summary text;
alter table public.tasks add column if not exists importance_reason text;
alter table public.tasks add column if not exists action_location_name text;
alter table public.tasks add column if not exists action_location_address text;
alter table public.tasks add column if not exists action_url text;
alter table public.tasks add column if not exists action_mode text;

create table if not exists public.draft_replies (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  tone text,
  format_type text,
  language_code text,
  reply_text text not null,
  updated_at timestamptz default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.draft_replies add column if not exists format_type text;
alter table public.draft_replies add column if not exists language_code text;
alter table public.draft_replies add column if not exists updated_at timestamptz default timezone('utc', now());

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  event_type text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mobile_upload_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid references public.cases(id) on delete set null,
  document_id uuid references public.documents(id) on delete set null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  goal_text text not null,
  current_age integer,
  target_age integer,
  financial_amount numeric(12,2),
  monthly_income numeric(12,2),
  analysis_result jsonb,
  progress_percentage integer default 0,
  financial_readiness_percentage integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_personal_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_version integer not null default 1,
  personal_details jsonb not null default '{}'::jsonb,
  contact_details jsonb not null default '{}'::jsonb,
  household_details jsonb not null default '{}'::jsonb,
  income_details jsonb not null default '{}'::jsonb,
  family_details jsonb not null default '{}'::jsonb,
  residency_details jsonb not null default '{}'::jsonb,
  field_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.process_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid references public.cases(id) on delete set null,
  process_slug text not null,
  procedure_id text not null,
  current_step_id text,
  current_step_index integer not null default 0,
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'in_progress',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.goals add column if not exists monthly_income numeric(12,2);
alter table public.user_personal_data add column if not exists profile_version integer not null default 1;
alter table public.user_personal_data add column if not exists personal_details jsonb not null default '{}'::jsonb;
alter table public.user_personal_data add column if not exists contact_details jsonb not null default '{}'::jsonb;
alter table public.user_personal_data add column if not exists household_details jsonb not null default '{}'::jsonb;
alter table public.user_personal_data add column if not exists income_details jsonb not null default '{}'::jsonb;
alter table public.user_personal_data add column if not exists family_details jsonb not null default '{}'::jsonb;
alter table public.user_personal_data add column if not exists residency_details jsonb not null default '{}'::jsonb;
alter table public.user_personal_data add column if not exists field_meta jsonb not null default '{}'::jsonb;
alter table public.user_personal_data add column if not exists updated_at timestamptz not null default timezone('utc', now());
alter table public.process_sessions add column if not exists case_id uuid references public.cases(id) on delete set null;
alter table public.process_sessions add column if not exists process_slug text;
alter table public.process_sessions add column if not exists procedure_id text;
alter table public.process_sessions add column if not exists current_step_id text;
alter table public.process_sessions add column if not exists current_step_index integer not null default 0;
alter table public.process_sessions add column if not exists answers jsonb not null default '{}'::jsonb;
alter table public.process_sessions add column if not exists status text not null default 'in_progress';
alter table public.process_sessions add column if not exists updated_at timestamptz not null default timezone('utc', now());

alter table public.goals
  drop constraint if exists goals_progress_percentage_check;

alter table public.goals
  add constraint goals_progress_percentage_check
  check (progress_percentage between 0 and 100);

alter table public.goals
  drop constraint if exists goals_financial_readiness_percentage_check;

alter table public.goals
  add constraint goals_financial_readiness_percentage_check
  check (financial_readiness_percentage is null or financial_readiness_percentage between 0 and 100);

alter table public.process_sessions
  drop constraint if exists process_sessions_status_check;

alter table public.process_sessions
  add constraint process_sessions_status_check
  check (status in ('in_progress', 'ready'));

alter table public.usage_events
  drop constraint if exists usage_events_event_type_check;

alter table public.usage_events
  add constraint usage_events_event_type_check
  check (event_type in ('analysis_generated', 'reply_generated'));

create table if not exists public.case_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  event_type text not null,
  event_date timestamptz not null default timezone('utc', now()),
  note text
);

alter table public.case_events
  drop constraint if exists case_events_event_type_check;

alter table public.case_events
  add constraint case_events_event_type_check
  check (
    event_type in (
      'document_uploaded',
      'document_analyzed',
      'reply_created',
      'reply_sent',
      'task_created',
      'task_completed',
      'new_document_added',
      'case_closed',
      'status_changed'
    )
  );

create index if not exists cases_user_id_idx on public.cases (user_id);
create index if not exists documents_case_id_idx on public.documents (case_id);
create index if not exists case_events_case_id_event_date_idx on public.case_events (case_id, event_date desc);
create unique index if not exists process_sessions_user_id_process_slug_key on public.process_sessions (user_id, process_slug);
create index if not exists process_sessions_user_id_updated_at_idx on public.process_sessions (user_id, updated_at desc);
create index if not exists user_personal_data_updated_at_idx on public.user_personal_data (updated_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, preferred_language)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    case
      when coalesce(new.raw_user_meta_data ->> 'preferred_language', 'de') in ('de', 'en', 'tr', 'uk', 'es', 'zh')
        then coalesce(new.raw_user_meta_data ->> 'preferred_language', 'de')
      else 'de'
    end
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        preferred_language = excluded.preferred_language;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, full_name, preferred_language)
select
  users.id,
  users.raw_user_meta_data ->> 'full_name',
  case
    when coalesce(users.raw_user_meta_data ->> 'preferred_language', 'de') in ('de', 'en', 'tr', 'uk', 'es', 'zh')
      then coalesce(users.raw_user_meta_data ->> 'preferred_language', 'de')
    else 'de'
  end
from auth.users as users
on conflict (id) do update
set
  full_name = coalesce(public.profiles.full_name, excluded.full_name),
  preferred_language = case
    when public.profiles.preferred_language in ('de', 'en', 'tr', 'uk', 'es', 'zh') then public.profiles.preferred_language
    else excluded.preferred_language
  end;

update public.profiles
set preferred_language = 'de'
where preferred_language is null
   or preferred_language not in ('de', 'en', 'tr', 'uk', 'es', 'zh');

alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.documents enable row level security;
alter table public.document_analyses enable row level security;
alter table public.tasks enable row level security;
alter table public.draft_replies enable row level security;
alter table public.usage_events enable row level security;
alter table public.mobile_upload_tokens enable row level security;
alter table public.case_events enable row level security;
alter table public.goals enable row level security;
alter table public.user_personal_data enable row level security;
alter table public.process_sessions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "documents_select_own" on public.documents;
create policy "documents_select_own"
on public.documents for select
using (auth.uid() = user_id);

drop policy if exists "cases_select_own" on public.cases;
create policy "cases_select_own"
on public.cases for select
using (auth.uid() = user_id);

drop policy if exists "cases_insert_own" on public.cases;
create policy "cases_insert_own"
on public.cases for insert
with check (auth.uid() = user_id);

drop policy if exists "cases_update_own" on public.cases;
create policy "cases_update_own"
on public.cases for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "cases_delete_own" on public.cases;
create policy "cases_delete_own"
on public.cases for delete
using (auth.uid() = user_id);

drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own"
on public.documents for insert
with check (auth.uid() = user_id);

drop policy if exists "documents_update_own" on public.documents;
create policy "documents_update_own"
on public.documents for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "document_analyses_select_via_document_owner" on public.document_analyses;
create policy "document_analyses_select_via_document_owner"
on public.document_analyses for select
using (
  exists (
    select 1
    from public.documents
    where documents.id = document_analyses.document_id
      and documents.user_id = auth.uid()
  )
);

drop policy if exists "document_analyses_insert_via_document_owner" on public.document_analyses;
create policy "document_analyses_insert_via_document_owner"
on public.document_analyses for insert
with check (
  exists (
    select 1
    from public.documents
    where documents.id = document_analyses.document_id
      and documents.user_id = auth.uid()
  )
);

drop policy if exists "document_analyses_update_via_document_owner" on public.document_analyses;
create policy "document_analyses_update_via_document_owner"
on public.document_analyses for update
using (
  exists (
    select 1
    from public.documents
    where documents.id = document_analyses.document_id
      and documents.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.documents
    where documents.id = document_analyses.document_id
      and documents.user_id = auth.uid()
  )
);

drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own"
on public.tasks for select
using (auth.uid() = user_id);

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own"
on public.tasks for insert
with check (auth.uid() = user_id);

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own"
on public.tasks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "draft_replies_select_via_document_owner" on public.draft_replies;
create policy "draft_replies_select_via_document_owner"
on public.draft_replies for select
using (
  exists (
    select 1
    from public.documents
    where documents.id = draft_replies.document_id
      and documents.user_id = auth.uid()
  )
);

drop policy if exists "draft_replies_insert_via_document_owner" on public.draft_replies;
create policy "draft_replies_insert_via_document_owner"
on public.draft_replies for insert
with check (
  exists (
    select 1
    from public.documents
    where documents.id = draft_replies.document_id
      and documents.user_id = auth.uid()
  )
);

drop policy if exists "usage_events_select_own" on public.usage_events;
create policy "usage_events_select_own"
on public.usage_events for select
using (auth.uid() = user_id);

drop policy if exists "usage_events_insert_own" on public.usage_events;
create policy "usage_events_insert_own"
on public.usage_events for insert
with check (auth.uid() = user_id);

drop policy if exists "mobile_upload_tokens_select_own" on public.mobile_upload_tokens;
create policy "mobile_upload_tokens_select_own"
on public.mobile_upload_tokens for select
using (auth.uid() = user_id);

drop policy if exists "mobile_upload_tokens_insert_own" on public.mobile_upload_tokens;
create policy "mobile_upload_tokens_insert_own"
on public.mobile_upload_tokens for insert
with check (auth.uid() = user_id);

drop policy if exists "mobile_upload_tokens_update_own" on public.mobile_upload_tokens;
create policy "mobile_upload_tokens_update_own"
on public.mobile_upload_tokens for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "goals_select_own" on public.goals;
create policy "goals_select_own"
on public.goals for select
using (auth.uid() = user_id);

drop policy if exists "goals_insert_own" on public.goals;
create policy "goals_insert_own"
on public.goals for insert
with check (auth.uid() = user_id);

drop policy if exists "goals_update_own" on public.goals;
create policy "goals_update_own"
on public.goals for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "goals_delete_own" on public.goals;
create policy "goals_delete_own"
on public.goals for delete
using (auth.uid() = user_id);

drop policy if exists "user_personal_data_select_own" on public.user_personal_data;
create policy "user_personal_data_select_own"
on public.user_personal_data for select
using (auth.uid() = user_id);

drop policy if exists "user_personal_data_insert_own" on public.user_personal_data;
create policy "user_personal_data_insert_own"
on public.user_personal_data for insert
with check (auth.uid() = user_id);

drop policy if exists "user_personal_data_update_own" on public.user_personal_data;
create policy "user_personal_data_update_own"
on public.user_personal_data for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_personal_data_delete_own" on public.user_personal_data;
create policy "user_personal_data_delete_own"
on public.user_personal_data for delete
using (auth.uid() = user_id);

drop policy if exists "process_sessions_select_own" on public.process_sessions;
create policy "process_sessions_select_own"
on public.process_sessions for select
using (auth.uid() = user_id);

drop policy if exists "process_sessions_insert_own" on public.process_sessions;
create policy "process_sessions_insert_own"
on public.process_sessions for insert
with check (auth.uid() = user_id);

drop policy if exists "process_sessions_update_own" on public.process_sessions;
create policy "process_sessions_update_own"
on public.process_sessions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "process_sessions_delete_own" on public.process_sessions;
create policy "process_sessions_delete_own"
on public.process_sessions for delete
using (auth.uid() = user_id);

drop policy if exists "case_events_select_via_case_owner" on public.case_events;
create policy "case_events_select_via_case_owner"
on public.case_events for select
using (
  exists (
    select 1
    from public.cases
    where cases.id = case_events.case_id
      and cases.user_id = auth.uid()
  )
);

drop policy if exists "case_events_insert_via_case_owner" on public.case_events;
create policy "case_events_insert_via_case_owner"
on public.case_events for insert
with check (
  exists (
    select 1
    from public.cases
    where cases.id = case_events.case_id
      and cases.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

drop policy if exists "storage_select_own_documents" on storage.objects;
create policy "storage_select_own_documents"
on storage.objects for select
using (
  bucket_id = 'documents'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "storage_insert_own_documents" on storage.objects;
create policy "storage_insert_own_documents"
on storage.objects for insert
with check (
  bucket_id = 'documents'
  and auth.uid()::text = (storage.foldername(name))[1]
);
