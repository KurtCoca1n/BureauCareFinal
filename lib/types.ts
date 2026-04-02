export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type DifficultTerm = { term: string; explanation_simple: string };
export type PageSummary = { page: number; summary: string };
export type ImportantReference = {
  label: string;
  value: string;
  page: number;
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
export type UsageEventType = "analysis_generated" | "reply_generated";
export type CaseStatus = "open" | "waiting" | "done";
export type DocumentStatus = "neu" | "analysiert" | "antwort_erstellt" | "gesendet" | "warten" | "erledigt";
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
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          preferred_language: string | null;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          preferred_language?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      cases: {
        Row: {
          created_at: string;
          id: string;
          organization: string | null;
          status: CaseStatus;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CaseRecord = Database["public"]["Tables"]["cases"]["Row"];
export type CaseInsert = Database["public"]["Tables"]["cases"]["Insert"];
export type CaseEventRecord = Database["public"]["Tables"]["case_events"]["Row"];
export type DocumentRecord = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
export type DocumentAnalysisRecord = Database["public"]["Tables"]["document_analyses"]["Row"];
export type DocumentAnalysisInsert = Database["public"]["Tables"]["document_analyses"]["Insert"];
export type DraftReplyRecord = Database["public"]["Tables"]["draft_replies"]["Row"];
export type TaskRecord = Database["public"]["Tables"]["tasks"]["Row"];
export type UsageEventRecord = Database["public"]["Tables"]["usage_events"]["Row"];
export type MobileUploadTokenRecord = Database["public"]["Tables"]["mobile_upload_tokens"]["Row"];
export type GoalRecord = Database["public"]["Tables"]["goals"]["Row"];
