export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type DifficultTerm = { term: string; explanation_simple: string };
export type PageSummary = { page: number; summary: string };
export type ImportantReference = {
  label: string;
  value: string;
  page: number;
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
