create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  first_name text,
  last_name text,
  full_name text,
  phone_number text,
  preferred_language text default 'de',
  reply_default_tone text not null default 'automatic',
  reply_style_note text,
  reply_include_signature boolean not null default true,
  reply_signature text,
  reply_translation_mode text not null default 'app_language'
);

create table if not exists public.account_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists phone_number text;
alter table public.profiles add column if not exists reply_default_tone text not null default 'automatic';
alter table public.profiles add column if not exists reply_style_note text;
alter table public.profiles add column if not exists reply_include_signature boolean not null default true;
alter table public.profiles add column if not exists reply_signature text;
alter table public.profiles add column if not exists reply_translation_mode text not null default 'app_language';

alter table public.profiles
  drop constraint if exists profiles_preferred_language_check;

alter table public.profiles
  add constraint profiles_preferred_language_check
  check (preferred_language in ('de', 'en', 'tr', 'uk', 'es', 'zh'));

alter table public.profiles
  drop constraint if exists profiles_reply_default_tone_check;

alter table public.profiles
  add constraint profiles_reply_default_tone_check
  check (reply_default_tone in ('automatic', 'neutral', 'friendly', 'very_formal', 'simple'));

alter table public.profiles
  drop constraint if exists profiles_reply_translation_mode_check;

alter table public.profiles
  add constraint profiles_reply_translation_mode_check
  check (reply_translation_mode in ('german_only', 'app_language'));

alter table public.account_access
  drop constraint if exists account_access_role_check;

alter table public.account_access
  add constraint account_access_role_check
  check (role in ('user', 'tester', 'admin', 'super_admin'));

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

alter table public.cases add column if not exists case_brief jsonb;

alter table public.documents add column if not exists case_id uuid;
alter table public.documents add column if not exists kind_detection jsonb;
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
  check (status in ('open', 'in_progress', 'waiting', 'done'));

create table if not exists public.document_analyses (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  sender text,
  document_type text,
  contract_type text,
  contract_parties jsonb,
  subject text,
  summary_simple text,
  contract_summary_simple text,
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
  contract_action_points jsonb,
  contract_duration text,
  contract_notice_period text,
  contract_recurring_costs text,
  contract_auto_renewal text,
  contract_clarification_points jsonb,
  contract_flagged_clauses jsonb,
  contract_flagged_points jsonb,
  contract_possible_disadvantages jsonb,
  contract_pre_signing_checklist jsonb,
  contract_watch_out_for jsonb,
  contract_watch_out_points jsonb,
  contract_unclear_points jsonb,
  contract_risk_level_overview text,
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
alter table public.document_analyses add column if not exists contract_action_points jsonb;
alter table public.document_analyses add column if not exists contract_type text;
alter table public.document_analyses add column if not exists contract_parties jsonb;
alter table public.document_analyses add column if not exists contract_summary_simple text;
alter table public.document_analyses add column if not exists contract_duration text;
alter table public.document_analyses add column if not exists contract_notice_period text;
alter table public.document_analyses add column if not exists contract_recurring_costs text;
alter table public.document_analyses add column if not exists contract_auto_renewal text;
alter table public.document_analyses add column if not exists contract_clarification_points jsonb;
alter table public.document_analyses add column if not exists contract_flagged_clauses jsonb;
alter table public.document_analyses add column if not exists contract_flagged_points jsonb;
alter table public.document_analyses add column if not exists contract_possible_disadvantages jsonb;
alter table public.document_analyses add column if not exists contract_pre_signing_checklist jsonb;
alter table public.document_analyses add column if not exists contract_watch_out_for jsonb;
alter table public.document_analyses add column if not exists contract_watch_out_points jsonb;
alter table public.document_analyses add column if not exists contract_unclear_points jsonb;
alter table public.document_analyses add column if not exists contract_risk_level_overview text;

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

create table if not exists public.contract_question_drafts (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  question_tone text,
  message_type text,
  question_context jsonb,
  question_text_de text not null,
  question_text_translated text,
  translated_language_code text,
  created_at timestamptz not null default timezone('utc', now())
);

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

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  language_preferences jsonb not null default '{
    "native_language": null,
    "reply_language_mode": "app_language",
    "simplified_language": false,
    "explain_terms": true
  }'::jsonb,
  location_preferences jsonb not null default '{
    "enabled": false,
    "use_for_offices": true,
    "use_for_dropoff": true,
    "use_for_appointments": true,
    "use_for_process_hints": true
  }'::jsonb,
  document_preferences jsonb not null default '{
    "auto_case_assignment": true,
    "auto_sort_by_sender": true,
    "auto_merge_multi_page": true,
    "auto_rename": true,
    "keep_originals": true,
    "auto_update_status": true
  }'::jsonb,
  goal_preferences jsonb not null default '{
    "show_age": true,
    "show_finance_tracker": true,
    "allow_ai_suggestions": true,
    "show_progress": true,
    "reminders_enabled": true
  }'::jsonb,
  notification_preferences jsonb not null default '{
    "deadlines": { "in_app": true, "email": true },
    "analysis_ready": { "in_app": true, "email": false },
    "reply_ready": { "in_app": true, "email": false },
    "case_status": { "in_app": true, "email": false },
    "suggestions": { "in_app": true, "email": false },
    "goal_reminders": { "in_app": true, "email": false }
  }'::jsonb,
  tester_preferences jsonb not null default '{
    "feature_goals_enabled": true,
    "feature_modules_enabled": true,
    "beta_features_enabled": true
  }'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.welcome_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reason text not null,
  nationality text,
  city text not null,
  housing_status text not null,
  registration_status text not null,
  health_insurance_status text not null,
  work_status text not null,
  has_children boolean not null default false,
  german_level text not null,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.welcome_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  step_key text not null,
  sort_order integer not null,
  status text not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.welcome_step_preparations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  step_key text not null,
  current_section_id text,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.welcome_step_cases (
  user_id uuid not null references auth.users(id) on delete cascade,
  step_key text not null,
  case_id uuid not null references public.cases(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, step_key)
);

create table if not exists public.welcome_step_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  step_key text not null,
  document_id uuid not null references public.documents(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.welcome_step_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  step_key text not null,
  task_id uuid not null references public.tasks(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
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
alter table public.user_settings add column if not exists language_preferences jsonb not null default '{
  "native_language": null,
  "reply_language_mode": "app_language",
  "simplified_language": false,
  "explain_terms": true
}'::jsonb;
alter table public.user_settings add column if not exists location_preferences jsonb not null default '{
  "enabled": false,
  "use_for_offices": true,
  "use_for_dropoff": true,
  "use_for_appointments": true,
  "use_for_process_hints": true
}'::jsonb;
alter table public.user_settings add column if not exists document_preferences jsonb not null default '{
  "auto_case_assignment": true,
  "auto_sort_by_sender": true,
  "auto_merge_multi_page": true,
  "auto_rename": true,
  "keep_originals": true,
  "auto_update_status": true
}'::jsonb;
alter table public.user_settings add column if not exists goal_preferences jsonb not null default '{
  "show_age": true,
  "show_finance_tracker": true,
  "allow_ai_suggestions": true,
  "show_progress": true,
  "reminders_enabled": true
}'::jsonb;
alter table public.user_settings add column if not exists notification_preferences jsonb not null default '{
  "deadlines": { "in_app": true, "email": true },
  "analysis_ready": { "in_app": true, "email": false },
  "reply_ready": { "in_app": true, "email": false },
  "case_status": { "in_app": true, "email": false },
  "suggestions": { "in_app": true, "email": false },
  "goal_reminders": { "in_app": true, "email": false }
}'::jsonb;
alter table public.user_settings add column if not exists tester_preferences jsonb not null default '{
  "feature_goals_enabled": true,
  "feature_modules_enabled": true,
  "beta_features_enabled": true
}'::jsonb;
alter table public.user_settings add column if not exists created_at timestamptz not null default timezone('utc', now());
alter table public.user_settings add column if not exists updated_at timestamptz not null default timezone('utc', now());
alter table public.welcome_profiles add column if not exists reason text;
alter table public.welcome_profiles add column if not exists nationality text;
alter table public.welcome_profiles add column if not exists city text;
alter table public.welcome_profiles add column if not exists housing_status text;
alter table public.welcome_profiles add column if not exists registration_status text;
alter table public.welcome_profiles add column if not exists health_insurance_status text;
alter table public.welcome_profiles add column if not exists work_status text;
alter table public.welcome_profiles add column if not exists has_children boolean not null default false;
alter table public.welcome_profiles add column if not exists german_level text;
alter table public.welcome_profiles add column if not exists completed_at timestamptz;
alter table public.welcome_profiles add column if not exists created_at timestamptz not null default timezone('utc', now());
alter table public.welcome_profiles add column if not exists updated_at timestamptz not null default timezone('utc', now());
alter table public.welcome_steps add column if not exists step_key text;
alter table public.welcome_steps add column if not exists sort_order integer;
alter table public.welcome_steps add column if not exists status text not null default 'open';
alter table public.welcome_steps add column if not exists created_at timestamptz not null default timezone('utc', now());
alter table public.welcome_steps add column if not exists updated_at timestamptz not null default timezone('utc', now());
alter table public.welcome_step_preparations add column if not exists step_key text;
alter table public.welcome_step_preparations add column if not exists current_section_id text;
alter table public.welcome_step_preparations add column if not exists answers jsonb not null default '{}'::jsonb;
alter table public.welcome_step_preparations add column if not exists created_at timestamptz not null default timezone('utc', now());
alter table public.welcome_step_preparations add column if not exists updated_at timestamptz not null default timezone('utc', now());
alter table public.welcome_step_cases add column if not exists case_id uuid references public.cases(id) on delete cascade;
alter table public.welcome_step_cases add column if not exists created_at timestamptz not null default timezone('utc', now());
alter table public.welcome_step_cases add column if not exists updated_at timestamptz not null default timezone('utc', now());
alter table public.welcome_step_documents add column if not exists step_key text;
alter table public.welcome_step_documents add column if not exists document_id uuid references public.documents(id) on delete cascade;
alter table public.welcome_step_documents add column if not exists created_at timestamptz not null default timezone('utc', now());
alter table public.welcome_step_tasks add column if not exists step_key text;
alter table public.welcome_step_tasks add column if not exists task_id uuid references public.tasks(id) on delete cascade;
alter table public.welcome_step_tasks add column if not exists created_at timestamptz not null default timezone('utc', now());
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

alter table public.welcome_profiles
  drop constraint if exists welcome_profiles_reason_check;

alter table public.welcome_profiles
  add constraint welcome_profiles_reason_check
  check (reason in ('study', 'work', 'training', 'family', 'au_pair', 'refugee', 'other'));

alter table public.welcome_profiles
  drop constraint if exists welcome_profiles_housing_status_check;

alter table public.welcome_profiles
  add constraint welcome_profiles_housing_status_check
  check (housing_status in ('yes', 'no', 'temporary'));

alter table public.welcome_profiles
  drop constraint if exists welcome_profiles_registration_status_check;

alter table public.welcome_profiles
  add constraint welcome_profiles_registration_status_check
  check (registration_status in ('yes', 'no', 'unknown', 'soon'));

alter table public.welcome_profiles
  drop constraint if exists welcome_profiles_health_insurance_status_check;

alter table public.welcome_profiles
  add constraint welcome_profiles_health_insurance_status_check
  check (health_insurance_status in ('yes', 'no', 'unknown', 'soon'));

alter table public.welcome_profiles
  drop constraint if exists welcome_profiles_work_status_check;

alter table public.welcome_profiles
  add constraint welcome_profiles_work_status_check
  check (work_status in ('yes', 'no', 'unknown', 'soon'));

alter table public.welcome_profiles
  drop constraint if exists welcome_profiles_german_level_check;

alter table public.welcome_profiles
  add constraint welcome_profiles_german_level_check
  check (german_level in ('none', 'basic', 'good'));

alter table public.welcome_steps
  drop constraint if exists welcome_steps_status_check;

alter table public.welcome_steps
  add constraint welcome_steps_status_check
  check (status in ('open', 'in_progress', 'done'));

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
create index if not exists welcome_steps_user_id_sort_order_idx on public.welcome_steps (user_id, sort_order asc);
create unique index if not exists welcome_step_preparations_user_id_step_key_key on public.welcome_step_preparations (user_id, step_key);
create index if not exists welcome_step_preparations_user_id_updated_at_idx on public.welcome_step_preparations (user_id, updated_at desc);
create unique index if not exists welcome_step_documents_user_id_step_key_document_id_key on public.welcome_step_documents (user_id, step_key, document_id);
create unique index if not exists welcome_step_tasks_user_id_step_key_task_id_key on public.welcome_step_tasks (user_id, step_key, task_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, full_name, phone_number, preferred_language, reply_default_tone, reply_include_signature, reply_translation_mode)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    new.raw_user_meta_data ->> 'full_name',
    nullif(new.raw_user_meta_data ->> 'phone_number', ''),
    case
      when coalesce(new.raw_user_meta_data ->> 'preferred_language', 'de') in ('de', 'en', 'tr', 'uk', 'es', 'zh')
        then coalesce(new.raw_user_meta_data ->> 'preferred_language', 'de')
      else 'de'
    end,
    'automatic',
    true,
    'app_language'
  )
  on conflict (id) do update
    set first_name = coalesce(public.profiles.first_name, excluded.first_name),
        last_name = coalesce(public.profiles.last_name, excluded.last_name),
        full_name = excluded.full_name,
        phone_number = coalesce(public.profiles.phone_number, excluded.phone_number),
        preferred_language = excluded.preferred_language;

  insert into public.account_access (user_id, role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, first_name, last_name, full_name, phone_number, preferred_language, reply_default_tone, reply_include_signature, reply_translation_mode)
select
  users.id,
  nullif(users.raw_user_meta_data ->> 'first_name', ''),
  nullif(users.raw_user_meta_data ->> 'last_name', ''),
  users.raw_user_meta_data ->> 'full_name',
  nullif(users.raw_user_meta_data ->> 'phone_number', ''),
  case
    when coalesce(users.raw_user_meta_data ->> 'preferred_language', 'de') in ('de', 'en', 'tr', 'uk', 'es', 'zh')
      then coalesce(users.raw_user_meta_data ->> 'preferred_language', 'de')
    else 'de'
  end,
  'automatic',
  true,
  'app_language'
from auth.users as users
on conflict (id) do update
set
  first_name = coalesce(public.profiles.first_name, excluded.first_name),
  last_name = coalesce(public.profiles.last_name, excluded.last_name),
  full_name = coalesce(public.profiles.full_name, excluded.full_name),
  phone_number = coalesce(public.profiles.phone_number, excluded.phone_number),
  preferred_language = case
    when public.profiles.preferred_language in ('de', 'en', 'tr', 'uk', 'es', 'zh') then public.profiles.preferred_language
    else excluded.preferred_language
  end;

update public.profiles
set first_name = split_part(trim(full_name), ' ', 1)
where coalesce(first_name, '') = ''
  and coalesce(full_name, '') <> '';

update public.profiles
set last_name = nullif(trim(substr(trim(full_name), length(split_part(trim(full_name), ' ', 1)) + 1)), '')
where coalesce(last_name, '') = ''
  and coalesce(full_name, '') <> ''
  and trim(full_name) like '% %';

update public.profiles
set preferred_language = 'de'
where preferred_language is null
   or preferred_language not in ('de', 'en', 'tr', 'uk', 'es', 'zh');

insert into public.account_access (user_id, role)
select users.id, 'user'
from auth.users as users
on conflict (user_id) do nothing;

insert into public.user_settings (user_id)
select users.id
from auth.users as users
on conflict (user_id) do nothing;

alter table public.profiles enable row level security;
alter table public.account_access enable row level security;
alter table public.cases enable row level security;
alter table public.documents enable row level security;
alter table public.document_analyses enable row level security;
alter table public.tasks enable row level security;
alter table public.draft_replies enable row level security;
alter table public.contract_question_drafts enable row level security;
alter table public.usage_events enable row level security;
alter table public.mobile_upload_tokens enable row level security;
alter table public.case_events enable row level security;
alter table public.goals enable row level security;
alter table public.user_personal_data enable row level security;
alter table public.user_settings enable row level security;
alter table public.welcome_profiles enable row level security;
alter table public.welcome_steps enable row level security;
alter table public.welcome_step_preparations enable row level security;
alter table public.welcome_step_cases enable row level security;
alter table public.welcome_step_documents enable row level security;
alter table public.welcome_step_tasks enable row level security;
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

drop policy if exists "account_access_select_own" on public.account_access;
create policy "account_access_select_own"
on public.account_access for select
using (auth.uid() = user_id);

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

drop policy if exists "contract_question_drafts_select_via_document_owner" on public.contract_question_drafts;
create policy "contract_question_drafts_select_via_document_owner"
on public.contract_question_drafts for select
using (
  exists (
    select 1
    from public.documents
    where documents.id = contract_question_drafts.document_id
      and documents.user_id = auth.uid()
  )
);

drop policy if exists "contract_question_drafts_insert_via_document_owner" on public.contract_question_drafts;
create policy "contract_question_drafts_insert_via_document_owner"
on public.contract_question_drafts for insert
with check (
  exists (
    select 1
    from public.documents
    where documents.id = contract_question_drafts.document_id
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

drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own"
on public.user_settings for select
using (auth.uid() = user_id);

drop policy if exists "user_settings_insert_own" on public.user_settings;
create policy "user_settings_insert_own"
on public.user_settings for insert
with check (auth.uid() = user_id);

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own"
on public.user_settings for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_settings_delete_own" on public.user_settings;
create policy "user_settings_delete_own"
on public.user_settings for delete
using (auth.uid() = user_id);

drop policy if exists "welcome_profiles_select_own" on public.welcome_profiles;
create policy "welcome_profiles_select_own"
on public.welcome_profiles for select
using (auth.uid() = user_id);

drop policy if exists "welcome_profiles_insert_own" on public.welcome_profiles;
create policy "welcome_profiles_insert_own"
on public.welcome_profiles for insert
with check (auth.uid() = user_id);

drop policy if exists "welcome_profiles_update_own" on public.welcome_profiles;
create policy "welcome_profiles_update_own"
on public.welcome_profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "welcome_profiles_delete_own" on public.welcome_profiles;
create policy "welcome_profiles_delete_own"
on public.welcome_profiles for delete
using (auth.uid() = user_id);

drop policy if exists "welcome_steps_select_own" on public.welcome_steps;
create policy "welcome_steps_select_own"
on public.welcome_steps for select
using (auth.uid() = user_id);

drop policy if exists "welcome_steps_insert_own" on public.welcome_steps;
create policy "welcome_steps_insert_own"
on public.welcome_steps for insert
with check (auth.uid() = user_id);

drop policy if exists "welcome_steps_update_own" on public.welcome_steps;
create policy "welcome_steps_update_own"
on public.welcome_steps for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "welcome_steps_delete_own" on public.welcome_steps;
create policy "welcome_steps_delete_own"
on public.welcome_steps for delete
using (auth.uid() = user_id);

drop policy if exists "welcome_step_preparations_select_own" on public.welcome_step_preparations;
create policy "welcome_step_preparations_select_own"
on public.welcome_step_preparations for select
using (auth.uid() = user_id);

drop policy if exists "welcome_step_preparations_insert_own" on public.welcome_step_preparations;
create policy "welcome_step_preparations_insert_own"
on public.welcome_step_preparations for insert
with check (auth.uid() = user_id);

drop policy if exists "welcome_step_preparations_update_own" on public.welcome_step_preparations;
create policy "welcome_step_preparations_update_own"
on public.welcome_step_preparations for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "welcome_step_preparations_delete_own" on public.welcome_step_preparations;
create policy "welcome_step_preparations_delete_own"
on public.welcome_step_preparations for delete
using (auth.uid() = user_id);

drop policy if exists "welcome_step_cases_select_own" on public.welcome_step_cases;
create policy "welcome_step_cases_select_own"
on public.welcome_step_cases for select
using (auth.uid() = user_id);

drop policy if exists "welcome_step_cases_insert_own" on public.welcome_step_cases;
create policy "welcome_step_cases_insert_own"
on public.welcome_step_cases for insert
with check (auth.uid() = user_id);

drop policy if exists "welcome_step_cases_update_own" on public.welcome_step_cases;
create policy "welcome_step_cases_update_own"
on public.welcome_step_cases for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "welcome_step_cases_delete_own" on public.welcome_step_cases;
create policy "welcome_step_cases_delete_own"
on public.welcome_step_cases for delete
using (auth.uid() = user_id);

drop policy if exists "welcome_step_documents_select_own" on public.welcome_step_documents;
create policy "welcome_step_documents_select_own"
on public.welcome_step_documents for select
using (auth.uid() = user_id);

drop policy if exists "welcome_step_documents_insert_own" on public.welcome_step_documents;
create policy "welcome_step_documents_insert_own"
on public.welcome_step_documents for insert
with check (auth.uid() = user_id);

drop policy if exists "welcome_step_documents_update_own" on public.welcome_step_documents;
create policy "welcome_step_documents_update_own"
on public.welcome_step_documents for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "welcome_step_documents_delete_own" on public.welcome_step_documents;
create policy "welcome_step_documents_delete_own"
on public.welcome_step_documents for delete
using (auth.uid() = user_id);

drop policy if exists "welcome_step_tasks_select_own" on public.welcome_step_tasks;
create policy "welcome_step_tasks_select_own"
on public.welcome_step_tasks for select
using (auth.uid() = user_id);

drop policy if exists "welcome_step_tasks_insert_own" on public.welcome_step_tasks;
create policy "welcome_step_tasks_insert_own"
on public.welcome_step_tasks for insert
with check (auth.uid() = user_id);

drop policy if exists "welcome_step_tasks_update_own" on public.welcome_step_tasks;
create policy "welcome_step_tasks_update_own"
on public.welcome_step_tasks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "welcome_step_tasks_delete_own" on public.welcome_step_tasks;
create policy "welcome_step_tasks_delete_own"
on public.welcome_step_tasks for delete
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
