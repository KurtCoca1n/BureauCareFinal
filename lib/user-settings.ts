import type {
  DocumentPreferences,
  GoalPreferences,
  LanguagePreferences,
  LocationPreferences,
  NotificationPreferences,
  TesterPreferences,
  UserSettingsRecord
} from "@/lib/types";

export const DEFAULT_LANGUAGE_PREFERENCES: LanguagePreferences = {
  native_language: null,
  reply_language_mode: "app_language",
  simplified_language: false,
  explain_terms: true
};

export const DEFAULT_LOCATION_PREFERENCES: LocationPreferences = {
  enabled: false,
  use_for_offices: true,
  use_for_dropoff: true,
  use_for_appointments: true,
  use_for_process_hints: true,
  latitude: null,
  longitude: null,
  granted_at: null,
  permission_status: null
};

export const DEFAULT_DOCUMENT_PREFERENCES: DocumentPreferences = {
  auto_case_assignment: true,
  auto_sort_by_sender: true,
  auto_merge_multi_page: true,
  auto_rename: true,
  keep_originals: true,
  auto_update_status: true
};

export const DEFAULT_GOAL_PREFERENCES: GoalPreferences = {
  show_age: true,
  show_finance_tracker: true,
  allow_ai_suggestions: true,
  show_progress: true,
  reminders_enabled: true
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  deadlines: { in_app: true, email: true },
  analysis_ready: { in_app: true, email: false },
  reply_ready: { in_app: true, email: false },
  case_status: { in_app: true, email: false },
  suggestions: { in_app: true, email: false },
  goal_reminders: { in_app: true, email: false }
};

export const DEFAULT_TESTER_PREFERENCES: TesterPreferences = {
  feature_goals_enabled: true,
  feature_modules_enabled: true,
  beta_features_enabled: true
};

export function buildDefaultUserSettings(userId: string): UserSettingsRecord {
  const now = new Date().toISOString();
  return {
    user_id: userId,
    language_preferences: DEFAULT_LANGUAGE_PREFERENCES,
    location_preferences: DEFAULT_LOCATION_PREFERENCES,
    document_preferences: DEFAULT_DOCUMENT_PREFERENCES,
    goal_preferences: DEFAULT_GOAL_PREFERENCES,
    notification_preferences: DEFAULT_NOTIFICATION_PREFERENCES,
    tester_preferences: DEFAULT_TESTER_PREFERENCES,
    created_at: now,
    updated_at: now
  };
}

export function normalizeUserSettings(record: UserSettingsRecord | null | undefined, userId: string): UserSettingsRecord {
  const base = buildDefaultUserSettings(userId);

  return {
    ...base,
    ...record,
    language_preferences: { ...DEFAULT_LANGUAGE_PREFERENCES, ...(record?.language_preferences ?? {}) },
    location_preferences: { ...DEFAULT_LOCATION_PREFERENCES, ...(record?.location_preferences ?? {}) },
    document_preferences: { ...DEFAULT_DOCUMENT_PREFERENCES, ...(record?.document_preferences ?? {}) },
    goal_preferences: { ...DEFAULT_GOAL_PREFERENCES, ...(record?.goal_preferences ?? {}) },
    notification_preferences: {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      ...(record?.notification_preferences ?? {}),
      deadlines: { ...DEFAULT_NOTIFICATION_PREFERENCES.deadlines, ...(record?.notification_preferences?.deadlines ?? {}) },
      analysis_ready: { ...DEFAULT_NOTIFICATION_PREFERENCES.analysis_ready, ...(record?.notification_preferences?.analysis_ready ?? {}) },
      reply_ready: { ...DEFAULT_NOTIFICATION_PREFERENCES.reply_ready, ...(record?.notification_preferences?.reply_ready ?? {}) },
      case_status: { ...DEFAULT_NOTIFICATION_PREFERENCES.case_status, ...(record?.notification_preferences?.case_status ?? {}) },
      suggestions: { ...DEFAULT_NOTIFICATION_PREFERENCES.suggestions, ...(record?.notification_preferences?.suggestions ?? {}) },
      goal_reminders: { ...DEFAULT_NOTIFICATION_PREFERENCES.goal_reminders, ...(record?.notification_preferences?.goal_reminders ?? {}) }
    },
    tester_preferences: { ...DEFAULT_TESTER_PREFERENCES, ...(record?.tester_preferences ?? {}) }
  };
}
