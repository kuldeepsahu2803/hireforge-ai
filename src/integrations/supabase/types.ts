export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          date: string | null
          description: string | null
          id: string
          title: string | null
          type: string | null
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          title?: string | null
          type?: string | null
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          title?: string | null
          type?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          credential_url: string | null
          id: string
          issued_date: string | null
          issuer: string | null
          name: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credential_url?: string | null
          id?: string
          issued_date?: string | null
          issuer?: string | null
          name?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credential_url?: string | null
          id?: string
          issued_date?: string | null
          issuer?: string | null
          name?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          achievements: string[] | null
          branch: string | null
          cgpa: string | null
          created_at: string
          degree: string | null
          end_year: number | null
          id: string
          institution: string | null
          relevant_coursework: string[] | null
          start_year: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          branch?: string | null
          cgpa?: string | null
          created_at?: string
          degree?: string | null
          end_year?: number | null
          id?: string
          institution?: string | null
          relevant_coursework?: string[] | null
          start_year?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          branch?: string | null
          cgpa?: string | null
          created_at?: string
          degree?: string | null
          end_year?: number | null
          id?: string
          institution?: string | null
          relevant_coursework?: string[] | null
          start_year?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experience: {
        Row: {
          achievements: string[] | null
          company: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean
          location: string | null
          start_date: string | null
          tech_used: string[] | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          company?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          start_date?: string | null
          tech_used?: string[] | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          company?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          start_date?: string | null
          tech_used?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string | null
          company_logo_url: string | null
          description: string | null
          experience_required: string | null
          fetched_at: string
          id: string
          is_active: boolean
          is_remote: boolean
          job_hash: string | null
          job_type: string | null
          location: string | null
          original_url: string | null
          posted_at: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          skills_required: string[] | null
          source_platform: string | null
          title: string | null
        }
        Insert: {
          company?: string | null
          company_logo_url?: string | null
          description?: string | null
          experience_required?: string | null
          fetched_at?: string
          id?: string
          is_active?: boolean
          is_remote?: boolean
          job_hash?: string | null
          job_type?: string | null
          location?: string | null
          original_url?: string | null
          posted_at?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills_required?: string[] | null
          source_platform?: string | null
          title?: string | null
        }
        Update: {
          company?: string | null
          company_logo_url?: string | null
          description?: string | null
          experience_required?: string | null
          fetched_at?: string
          id?: string
          is_active?: boolean
          is_remote?: boolean
          job_hash?: string | null
          job_type?: string | null
          location?: string | null
          original_url?: string | null
          posted_at?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills_required?: string[] | null
          source_platform?: string | null
          title?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          completeness_score: number
          created_at: string
          email: string | null
          experience_level: string | null
          full_name: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
          preferred_job_types: string[] | null
          preferred_locations: string[] | null
          target_roles: string[] | null
          updated_at: string
        }
        Insert: {
          completeness_score?: number
          created_at?: string
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_job_types?: string[] | null
          preferred_locations?: string[] | null
          target_roles?: string[] | null
          updated_at?: string
        }
        Update: {
          completeness_score?: number
          created_at?: string
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_job_types?: string[] | null
          preferred_locations?: string[] | null
          target_roles?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          github_url: string | null
          id: string
          live_url: string | null
          name: string | null
          outcomes: string | null
          tags: string[] | null
          tech_stack: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          name?: string | null
          outcomes?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          name?: string | null
          outcomes?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          is_master: boolean
          parsed_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_master?: boolean
          parsed_text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_master?: boolean
          parsed_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resumes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_logs: {
        Row: {
          id: string
          jobs_duplicate: number
          jobs_found: number
          jobs_new: number
          notification_sent: boolean
          run_at: string
          top_match: Json | null
          user_id: string
        }
        Insert: {
          id?: string
          jobs_duplicate?: number
          jobs_found?: number
          jobs_new?: number
          notification_sent?: boolean
          run_at?: string
          top_match?: Json | null
          user_id: string
        }
        Update: {
          id?: string
          jobs_duplicate?: number
          jobs_found?: number
          jobs_new?: number
          notification_sent?: boolean
          run_at?: string
          top_match?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_schedules: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          last_run_at: string | null
          min_match_score: number
          next_run_at: string | null
          notify_channel: string
          notify_time: string
          updated_at: string
          user_id: string
          watch_keywords: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_run_at?: string | null
          min_match_score?: number
          next_run_at?: string | null
          notify_channel?: string
          notify_time?: string
          updated_at?: string
          user_id: string
          watch_keywords?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_run_at?: string | null
          min_match_score?: number
          next_run_at?: string | null
          notify_channel?: string
          notify_time?: string
          updated_at?: string
          user_id?: string
          watch_keywords?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "search_schedules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          id: string
          languages: string[] | null
          soft_skills: string[] | null
          technical: string[] | null
          tools: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          languages?: string[] | null
          soft_skills?: string[] | null
          technical?: string[] | null
          tools?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          languages?: string[] | null
          soft_skills?: string[] | null
          technical?: string[] | null
          tools?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tailored_resumes: {
        Row: {
          ats_score_after: number | null
          ats_score_before: number | null
          company: string | null
          created_at: string
          gap_analysis: Json | null
          id: string
          job_id: string | null
          job_title: string | null
          pdf_url: string | null
          tailored_content: Json | null
          user_id: string
        }
        Insert: {
          ats_score_after?: number | null
          ats_score_before?: number | null
          company?: string | null
          created_at?: string
          gap_analysis?: Json | null
          id?: string
          job_id?: string | null
          job_title?: string | null
          pdf_url?: string | null
          tailored_content?: Json | null
          user_id: string
        }
        Update: {
          ats_score_after?: number | null
          ats_score_before?: number | null
          company?: string | null
          created_at?: string
          gap_analysis?: Json | null
          id?: string
          job_id?: string | null
          job_title?: string | null
          pdf_url?: string | null
          tailored_content?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tailored_resumes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tailored_resumes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_jobs: {
        Row: {
          applied_at: string | null
          created_at: string
          id: string
          job_id: string
          match_score: number | null
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string
          id?: string
          job_id: string
          match_score?: number | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string
          id?: string
          job_id?: string
          match_score?: number | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
