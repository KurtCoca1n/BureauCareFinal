export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type DifficultTerm = { term: string; explanation_simple: string };
export type PageSummary = { page: number; summary: string };
export type ImportantReference = {
  label: string;
  value: string;
  page: number;
};
export type ContractFlaggedPointTone = "notice" | "watch" | "caution";
export type ContractFlaggedPoint = {
  title: string;
  explanation_simple: string;
  tone: ContractFlaggedPointTone;
};
export type ContractClauseCategory =
  | "duration"
  | "termination"
  | "auto_renewal"
  | "costs"
  | "liability"
  | "user_duties"
  | "provider_rights"
  | "privacy"
  | "unclear_language"
  | "other";
export type ContractClauseRiskLevel = "low" | "medium" | "elevated";
export type ContractGuidancePriority = "high" | "medium" | "general";
export type ContractFlaggedClause = {
  category: ContractClauseCategory;
  secondary_categories: ContractClauseCategory[];
  clause_summary_simple: string;
  clause_reason_simple: string;
  clause_risk_level: ContractClauseRiskLevel;
  source_excerpt: string | null;
  source_page: number | null;
  source_section: string | null;
  source_context_label: string | null;
  source_context_reason: string | null;
};
export type ContractGuidanceItem = {
  category: ContractClauseCategory;
  priority: ContractGuidancePriority;
};
export type GoalStepImportance = "low" | "medium" | "high";
export type GoalStepStatus = "open" | "done";
export type GoalStep = {
  id: string;
  title: string;
  description_simple: string;
  estimated_duration: string | null;
  importance: GoalStepImportance;
  status: GoalStepStatus;
  related_costs_note: string | null;
};
export type GoalAnalysisResult = {
  goal_title: string;
  goal_summary_simple: string;
  current_age: number | null;
  target_age: number | null;
  target_year?: number | null;
  estimated_overall_timeline: string | null;
  bureaucracy_steps: GoalStep[];
  progress_percentage: number;
  financial_readiness_percentage: number | null;
  finance_relevant: boolean;
  ai_guidance: string[];
  recommendation_simple: string;
};
export type AccountRole = "user" | "tester" | "admin" | "super_admin";
export type UsageEventType = "analysis_generated" | "reply_generated";
export type CaseStatus = "open" | "in_progress" | "waiting" | "done";
export type DocumentStatus = "neu" | "analysiert" | "antwort_erstellt" | "gesendet" | "warten" | "erledigt";
export type ProcessSessionStatus = "in_progress" | "ready";
export type ReplyDefaultTone = "automatic" | "neutral" | "friendly" | "very_formal" | "simple";
export type ReplyTranslationMode = "german_only" | "app_language";
export type ContractQuestionTone = "friendly" | "factual" | "formal" | "careful_firm";
export type ContractQuestionFormat = "email" | "message" | "question_list";
export type ProcessSessionAnswers = { [key: string]: Json | undefined };
export type WelcomeReason = "study" | "work" | "training" | "family" | "au_pair" | "refugee" | "other";
export type WelcomeHousingStatus = "yes" | "no" | "temporary";
export type WelcomeAnswerStatus = "yes" | "no" | "unknown" | "soon";
export type WelcomeGermanLevel = "none" | "basic" | "good";
export type WelcomeStepStatus = "open" | "in_progress" | "done";
export type WelcomeStepPreparationAnswers = { [key: string]: Json | undefined };
export type PersonalDataSource = "user_input" | "application_import" | "document_extracted" | "system_inferred";
export type PersonalDataSuggestionPriority = "high" | "medium" | "low";
export type PersonalDataFieldMeta = {
  source: PersonalDataSource;
  updated_at: string;
  confirmed_by_user: boolean;
  confirmed_at: string | null;
  last_used_at: string | null;
};
export type UserPersonalDataSectionKey = "personal_details" | "contact_details" | "household_details" | "income_details" | "family_details" | "residency_details";
export type UserPersonalDataFieldMetaMap = {
  [section in UserPersonalDataSectionKey]?: {
    [field: string]: PersonalDataFieldMeta | undefined;
  };
};
export type PersonalDetails = {
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  gender?: string;
  nationality?: string;
  family_status?: string;
};
export type ContactDetails = {
  street?: string;
  house_number?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
};
export type HouseholdDetails = {
  housing_status?: string;
  household_size?: number;
  living_space_sqm?: number;
  monthly_rent?: number;
  move_in_date?: string;
};
export type IncomeDetails = {
  employment_status?: string;
  monthly_income_approx?: number;
  additional_income?: string;
  employer?: string;
};
export type FamilyDetails = {
  children_count?: number;
  family_constellation?: string;
};
export type ResidencyDetails = {
  residence_status?: string;
  current_life_phase?: string;
};
export type UserPersonalDataSections = {
  personal_details: PersonalDetails;
  contact_details: ContactDetails;
  household_details: HouseholdDetails;
  income_details: IncomeDetails;
  family_details: FamilyDetails;
  residency_details: ResidencyDetails;
};
export type LanguagePreferences = {
  native_language: string | null;
  reply_language_mode: "german_only" | "app_language" | "native_only";
  simplified_language: boolean;
  explain_terms: boolean;
};
export type LocationPreferences = {
  enabled: boolean;
  use_for_offices: boolean;
  use_for_dropoff: boolean;
  use_for_appointments: boolean;
  use_for_process_hints: boolean;
  latitude: number | null;
  longitude: number | null;
  granted_at: string | null;
  permission_status: "granted" | "denied" | "prompt" | null;
};
export type DocumentPreferences = {
  auto_case_assignment: boolean;
  auto_sort_by_sender: boolean;
  auto_merge_multi_page: boolean;
  auto_rename: boolean;
  keep_originals: boolean;
  auto_update_status: boolean;
};
export type GoalPreferences = {
  show_age: boolean;
  show_finance_tracker: boolean;
  allow_ai_suggestions: boolean;
  show_progress: boolean;
  reminders_enabled: boolean;
};
export type NotificationChannelPreference = {
  in_app: boolean;
  email: boolean;
};
export type NotificationPreferences = {
  deadlines: NotificationChannelPreference;
  analysis_ready: NotificationChannelPreference;
  reply_ready: NotificationChannelPreference;
  case_status: NotificationChannelPreference;
  suggestions: NotificationChannelPreference;
  goal_reminders: NotificationChannelPreference;
};
export type TesterPreferences = {
  feature_goals_enabled: boolean;
  feature_modules_enabled: boolean;
  beta_features_enabled: boolean;
};
export type WelcomeProfileAnswers = {
  reason: WelcomeReason;
  nationality?: string | null;
  city: string;
  housing_status: WelcomeHousingStatus;
  registration_status: WelcomeAnswerStatus;
  health_insurance_status: WelcomeAnswerStatus;
  work_status: WelcomeAnswerStatus;
  has_children: boolean;
  german_level: WelcomeGermanLevel;
};
export type PersonalDataSuggestion = {
  id: string;
  procedure_id: string;
  title: string;
  reason: string;
  priority: PersonalDataSuggestionPriority;
  score: number;
  evidence: string[];
};
export type CaseEventType =
  | "document_uploaded"
  | "document_analyzed"
  | "reply_created"
  | "reply_sent"
  | "task_created"
  | "task_completed"
  | "new_document_added"
  | "case_closed"
  | "status_changed";

export type Database = {
  public: {
    Tables: {
      document_analyses: {
        Row: {
          action_location_address: string | null;
          action_location_name: string | null;
          action_mode: string | null;
          action_url: string | null;
          contract_auto_renewal: string | null;
          contract_duration: string | null;
          contract_action_points: ContractGuidanceItem[] | null;
          contract_flagged_clauses: ContractFlaggedClause[] | null;
          contract_flagged_points: ContractFlaggedPoint[] | null;
          contract_notice_period: string | null;
          contract_parties: string[] | null;
          contract_possible_disadvantages: ContractGuidanceItem[] | null;
          contract_pre_signing_checklist: ContractGuidanceItem[] | null;
          contract_recurring_costs: string | null;
          contract_risk_level_overview: string | null;
          contract_summary_simple: string | null;
          contract_type: string | null;
          contract_clarification_points: ContractGuidanceItem[] | null;
          contract_unclear_points: string[] | null;
          contract_watch_out_for: string[] | null;
          contract_watch_out_points: string[] | null;
          created_at: string;
          deadline_date: string | null;
          difficult_terms: DifficultTerm[] | null;
          document_type: string | null;
          document_id: string;
          highlight_terms: string[] | null;
          id: string;
          important_references: ImportantReference[] | null;
          is_action_required: boolean | null;
          key_points: string[] | null;
          next_steps: string[] | null;
          page_count: number | null;
          page_summaries: PageSummary[] | null;
          raw_extracted_text: string | null;
          risks_if_ignored: string | null;
          required_action: string | null;
          sender: string | null;
          subject: string | null;
          summary_simple_long: string | null;
          summary_simple_short: string | null;
          summary_simple: string | null;
          urgency: string | null;
        };
        Insert: {
          action_location_address?: string | null;
          action_location_name?: string | null;
          action_mode?: string | null;
          action_url?: string | null;
          contract_action_points?: ContractGuidanceItem[] | null;
          contract_auto_renewal?: string | null;
          contract_clarification_points?: ContractGuidanceItem[] | null;
          contract_duration?: string | null;
          contract_flagged_clauses?: ContractFlaggedClause[] | null;
          contract_flagged_points?: ContractFlaggedPoint[] | null;
          contract_notice_period?: string | null;
          contract_parties?: string[] | null;
          contract_possible_disadvantages?: ContractGuidanceItem[] | null;
          contract_pre_signing_checklist?: ContractGuidanceItem[] | null;
          contract_recurring_costs?: string | null;
          contract_risk_level_overview?: string | null;
          contract_summary_simple?: string | null;
          contract_type?: string | null;
          contract_unclear_points?: string[] | null;
          contract_watch_out_for?: string[] | null;
          contract_watch_out_points?: string[] | null;
          created_at?: string;
          deadline_date?: string | null;
          difficult_terms?: DifficultTerm[] | null;
          document_type?: string | null;
          document_id: string;
          highlight_terms?: string[] | null;
          id?: string;
          important_references?: ImportantReference[] | null;
          is_action_required?: boolean | null;
          key_points?: string[] | null;
          next_steps?: string[] | null;
          page_count?: number | null;
          page_summaries?: PageSummary[] | null;
          raw_extracted_text?: string | null;
          risks_if_ignored?: string | null;
          required_action?: string | null;
          sender?: string | null;
          subject?: string | null;
          summary_simple_long?: string | null;
          summary_simple_short?: string | null;
          summary_simple?: string | null;
          urgency?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["document_analyses"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "document_analyses_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          }
        ];
      };
      documents: {
        Row: {
          case_id: string | null;
          created_at: string;
          document_date: string | null;
          file_path: string;
          id: string;
          kind_detection: Json | null;
          mime_type: string | null;
          original_filename: string;
          sender: string | null;
          status: DocumentStatus | null;
          subject: string | null;
          user_id: string;
        };
        Insert: {
          case_id?: string | null;
          created_at?: string;
          document_date?: string | null;
          file_path: string;
          id?: string;
          kind_detection?: Json | null;
          mime_type?: string | null;
          original_filename: string;
          sender?: string | null;
          status?: DocumentStatus | null;
          subject?: string | null;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      draft_replies: {
        Row: {
          created_at: string;
          document_id: string;
          format_type: string | null;
          id: string;
          language_code: string | null;
          reply_text: string;
          tone: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          document_id: string;
          format_type?: string | null;
          id?: string;
          language_code?: string | null;
          reply_text: string;
          tone?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["draft_replies"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "draft_replies_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          }
        ];
      };
      contract_question_drafts: {
        Row: {
          created_at: string;
          document_id: string;
          id: string;
          message_type: ContractQuestionFormat | null;
          question_context: Json | null;
          question_text_de: string;
          question_text_translated: string | null;
          question_tone: ContractQuestionTone | null;
          translated_language_code: string | null;
        };
        Insert: {
          created_at?: string;
          document_id: string;
          id?: string;
          message_type?: ContractQuestionFormat | null;
          question_context?: Json | null;
          question_text_de: string;
          question_text_translated?: string | null;
          question_tone?: ContractQuestionTone | null;
          translated_language_code?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contract_question_drafts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "contract_question_drafts_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          first_name: string | null;
          full_name: string | null;
          id: string;
          last_name: string | null;
          phone_number: string | null;
          preferred_language: string | null;
          reply_default_tone: ReplyDefaultTone;
          reply_include_signature: boolean;
          reply_signature: string | null;
          reply_style_note: string | null;
          reply_translation_mode: ReplyTranslationMode;
        };
        Insert: {
          created_at?: string;
          first_name?: string | null;
          full_name?: string | null;
          id: string;
          last_name?: string | null;
          phone_number?: string | null;
          preferred_language?: string | null;
          reply_default_tone?: ReplyDefaultTone;
          reply_include_signature?: boolean;
          reply_signature?: string | null;
          reply_style_note?: string | null;
          reply_translation_mode?: ReplyTranslationMode;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      account_access: {
        Row: {
          created_at: string;
          role: AccountRole;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          role?: AccountRole;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["account_access"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "account_access_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      cases: {
        Row: {
          case_brief: Json | null;
          created_at: string;
          id: string;
          organization: string | null;
          status: CaseStatus;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          case_brief?: Json | null;
          created_at?: string;
          id?: string;
          organization?: string | null;
          status?: CaseStatus;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["cases"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "cases_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      case_events: {
        Row: {
          case_id: string;
          document_id: string | null;
          event_date: string;
          event_type: CaseEventType;
          id: string;
          note: string | null;
        };
        Insert: {
          case_id: string;
          document_id?: string | null;
          event_date?: string;
          event_type: CaseEventType;
          id?: string;
          note?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["case_events"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "case_events_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "case_events_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: {
          created_at: string;
          document_sender: string | null;
          document_subject: string | null;
          document_id: string | null;
          due_date: string | null;
          id: string;
          action_location_address: string | null;
          action_location_name: string | null;
          action_mode: string | null;
          action_summary: string | null;
          action_url: string | null;
          importance_reason: string | null;
          status: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          document_sender?: string | null;
          document_subject?: string | null;
          document_id?: string | null;
          due_date?: string | null;
          id?: string;
          action_location_address?: string | null;
          action_location_name?: string | null;
          action_mode?: string | null;
          action_summary?: string | null;
          action_url?: string | null;
          importance_reason?: string | null;
          status?: string | null;
          title: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "tasks_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      usage_events: {
        Row: {
          created_at: string;
          document_id: string | null;
          event_type: UsageEventType;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          document_id?: string | null;
          event_type: UsageEventType;
          id?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["usage_events"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "usage_events_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "usage_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      mobile_upload_tokens: {
        Row: {
          case_id: string | null;
          created_at: string;
          document_id: string | null;
          expires_at: string;
          id: string;
          token_hash: string;
          used_at: string | null;
          user_id: string;
        };
        Insert: {
          case_id?: string | null;
          created_at?: string;
          document_id?: string | null;
          expires_at: string;
          id?: string;
          token_hash: string;
          used_at?: string | null;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["mobile_upload_tokens"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "mobile_upload_tokens_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "mobile_upload_tokens_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "mobile_upload_tokens_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      goals: {
        Row: {
          analysis_result: GoalAnalysisResult | null;
          created_at: string;
          current_age: number | null;
          financial_amount: number | null;
          monthly_income: number | null;
          financial_readiness_percentage: number | null;
          goal_text: string;
          id: string;
          progress_percentage: number | null;
          target_age: number | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          analysis_result?: GoalAnalysisResult | null;
          created_at?: string;
          current_age?: number | null;
          financial_amount?: number | null;
          monthly_income?: number | null;
          financial_readiness_percentage?: number | null;
          goal_text: string;
          id?: string;
          progress_percentage?: number | null;
          target_age?: number | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["goals"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_personal_data: {
        Row: {
          contact_details: ContactDetails;
          created_at: string;
          family_details: FamilyDetails;
          field_meta: UserPersonalDataFieldMetaMap;
          household_details: HouseholdDetails;
          income_details: IncomeDetails;
          personal_details: PersonalDetails;
          profile_version: number;
          residency_details: ResidencyDetails;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          contact_details?: ContactDetails;
          created_at?: string;
          family_details?: FamilyDetails;
          field_meta?: UserPersonalDataFieldMetaMap;
          household_details?: HouseholdDetails;
          income_details?: IncomeDetails;
          personal_details?: PersonalDetails;
          profile_version?: number;
          residency_details?: ResidencyDetails;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_personal_data"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "user_personal_data_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_settings: {
        Row: {
          created_at: string;
          document_preferences: DocumentPreferences;
          goal_preferences: GoalPreferences;
          language_preferences: LanguagePreferences;
          location_preferences: LocationPreferences;
          notification_preferences: NotificationPreferences;
          tester_preferences: TesterPreferences;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          document_preferences?: DocumentPreferences;
          goal_preferences?: GoalPreferences;
          language_preferences?: LanguagePreferences;
          location_preferences?: LocationPreferences;
          notification_preferences?: NotificationPreferences;
          tester_preferences?: TesterPreferences;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_settings"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      welcome_profiles: {
        Row: {
          city: string;
          completed_at: string | null;
          created_at: string;
          german_level: WelcomeGermanLevel;
          has_children: boolean;
          health_insurance_status: WelcomeAnswerStatus;
          housing_status: WelcomeHousingStatus;
          nationality: string | null;
          reason: WelcomeReason;
          registration_status: WelcomeAnswerStatus;
          updated_at: string;
          user_id: string;
          work_status: WelcomeAnswerStatus;
        };
        Insert: {
          city: string;
          completed_at?: string | null;
          created_at?: string;
          german_level: WelcomeGermanLevel;
          has_children?: boolean;
          health_insurance_status: WelcomeAnswerStatus;
          housing_status: WelcomeHousingStatus;
          nationality?: string | null;
          reason: WelcomeReason;
          registration_status: WelcomeAnswerStatus;
          updated_at?: string;
          user_id: string;
          work_status: WelcomeAnswerStatus;
        };
        Update: Partial<Database["public"]["Tables"]["welcome_profiles"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "welcome_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      welcome_steps: {
        Row: {
          created_at: string;
          id: string;
          sort_order: number;
          status: WelcomeStepStatus;
          step_key: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          sort_order: number;
          status?: WelcomeStepStatus;
          step_key: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["welcome_steps"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "welcome_steps_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      welcome_step_preparations: {
        Row: {
          answers: WelcomeStepPreparationAnswers;
          created_at: string;
          current_section_id: string | null;
          id: string;
          step_key: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          answers?: WelcomeStepPreparationAnswers;
          created_at?: string;
          current_section_id?: string | null;
          id?: string;
          step_key: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["welcome_step_preparations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "welcome_step_preparations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      welcome_step_cases: {
        Row: {
          case_id: string;
          created_at: string;
          step_key: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          case_id: string;
          created_at?: string;
          step_key: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["welcome_step_cases"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "welcome_step_cases_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "welcome_step_cases_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      welcome_step_documents: {
        Row: {
          created_at: string;
          document_id: string;
          id: string;
          step_key: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          document_id: string;
          id?: string;
          step_key: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["welcome_step_documents"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "welcome_step_documents_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "welcome_step_documents_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      welcome_step_tasks: {
        Row: {
          created_at: string;
          id: string;
          step_key: string;
          task_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          step_key: string;
          task_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["welcome_step_tasks"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "welcome_step_tasks_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "welcome_step_tasks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      process_sessions: {
        Row: {
          answers: ProcessSessionAnswers;
          case_id: string | null;
          created_at: string;
          current_step_id: string | null;
          current_step_index: number;
          id: string;
          procedure_id: string;
          process_slug: string;
          status: ProcessSessionStatus;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          answers?: ProcessSessionAnswers;
          case_id?: string | null;
          created_at?: string;
          current_step_id?: string | null;
          current_step_index?: number;
          id?: string;
          procedure_id: string;
          process_slug: string;
          status?: ProcessSessionStatus;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["process_sessions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "process_sessions_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "process_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AccountAccessRecord = Database["public"]["Tables"]["account_access"]["Row"];
export type CaseRecord = Database["public"]["Tables"]["cases"]["Row"];
export type CaseInsert = Database["public"]["Tables"]["cases"]["Insert"];
export type CaseEventRecord = Database["public"]["Tables"]["case_events"]["Row"];
export type DocumentRecord = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
export type DocumentAnalysisRecord = Database["public"]["Tables"]["document_analyses"]["Row"];
export type DocumentAnalysisInsert = Database["public"]["Tables"]["document_analyses"]["Insert"];
export type DraftReplyRecord = Database["public"]["Tables"]["draft_replies"]["Row"];
export type ContractQuestionDraftRecord = Database["public"]["Tables"]["contract_question_drafts"]["Row"];
export type TaskRecord = Database["public"]["Tables"]["tasks"]["Row"];
export type UsageEventRecord = Database["public"]["Tables"]["usage_events"]["Row"];
export type MobileUploadTokenRecord = Database["public"]["Tables"]["mobile_upload_tokens"]["Row"];
export type GoalRecord = Database["public"]["Tables"]["goals"]["Row"];
export type UserPersonalDataRecord = Database["public"]["Tables"]["user_personal_data"]["Row"];
export type UserPersonalDataInsert = Database["public"]["Tables"]["user_personal_data"]["Insert"];
export type ProcessSessionRecord = Database["public"]["Tables"]["process_sessions"]["Row"];
export type UserSettingsRecord = Database["public"]["Tables"]["user_settings"]["Row"];
export type WelcomeProfileRecord = Database["public"]["Tables"]["welcome_profiles"]["Row"];
export type WelcomeStepRecord = Database["public"]["Tables"]["welcome_steps"]["Row"];
export type WelcomeStepPreparationRecord = Database["public"]["Tables"]["welcome_step_preparations"]["Row"];
export type WelcomeStepCaseRecord = Database["public"]["Tables"]["welcome_step_cases"]["Row"];
export type WelcomeStepDocumentRecord = Database["public"]["Tables"]["welcome_step_documents"]["Row"];
export type WelcomeStepTaskRecord = Database["public"]["Tables"]["welcome_step_tasks"]["Row"];
