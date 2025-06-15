export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contribution_checklists: {
        Row: {
          completed_at: string | null
          description: string
          id: string
          is_completed: boolean | null
          project_id: string
          team_member_id: string
        }
        Insert: {
          completed_at?: string | null
          description: string
          id?: string
          is_completed?: boolean | null
          project_id: string
          team_member_id: string
        }
        Update: {
          completed_at?: string | null
          description?: string
          id?: string
          is_completed?: boolean | null
          project_id?: string
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_checklists_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_checklists_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_events: {
        Row: {
          amount: number
          id: string
          pledged_at: string | null
          pledged_by: string | null
          project_id: string | null
        }
        Insert: {
          amount: number
          id?: string
          pledged_at?: string | null
          pledged_by?: string | null
          project_id?: string | null
        }
        Update: {
          amount?: number
          id?: string
          pledged_at?: string | null
          pledged_by?: string | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_steps: {
        Row: {
          id: string
          project_id: string | null
          role_name: string
          step_description: string | null
          step_order: number | null
          step_title: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          role_name: string
          step_description?: string | null
          step_order?: number | null
          step_title: string
        }
        Update: {
          id?: string
          project_id?: string | null
          role_name?: string
          step_description?: string | null
          step_order?: number | null
          step_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_activity_log: {
        Row: {
          activity_description: string | null
          activity_type: string
          created_at: string | null
          id: string
          project_id: string
          team_member_id: string | null
        }
        Insert: {
          activity_description?: string | null
          activity_type: string
          created_at?: string | null
          id?: string
          project_id: string
          team_member_id?: string | null
        }
        Update: {
          activity_description?: string | null
          activity_type?: string
          created_at?: string | null
          id?: string
          project_id?: string
          team_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_activity_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_activity_log_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      project_analytics: {
        Row: {
          created_at: string | null
          id: string
          last_engagement_at: string | null
          project_id: string | null
          shares: number | null
          views: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_engagement_at?: string | null
          project_id?: string | null
          shares?: number | null
          views?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_engagement_at?: string | null
          project_id?: string | null
          shares?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_collaborators: {
        Row: {
          accepted_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          invited_email: string | null
          invited_wallet: string | null
          project_id: string | null
          status: string
        }
        Insert: {
          accepted_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          invited_email?: string | null
          invited_wallet?: string | null
          project_id?: string | null
          status?: string
        }
        Update: {
          accepted_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          invited_email?: string | null
          invited_wallet?: string | null
          project_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_collaborators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_discussion_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          posted_by: string | null
          thread_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          posted_by?: string | null
          thread_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          posted_by?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_discussion_messages_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_discussion_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "project_discussion_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      project_discussion_threads: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          project_id: string
          related_milestone_id: string | null
          related_task_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          project_id: string
          related_milestone_id?: string | null
          related_task_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          project_id?: string
          related_milestone_id?: string | null
          related_task_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_discussion_threads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_discussion_threads_related_milestone_id_fkey"
            columns: ["related_milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_discussion_threads_related_task_id_fkey"
            columns: ["related_task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      project_expenses: {
        Row: {
          amount_usdc: number
          id: string
          name: string
          payout_type: string | null
          project_id: string | null
          vendor_wallet: string | null
        }
        Insert: {
          amount_usdc: number
          id?: string
          name: string
          payout_type?: string | null
          project_id?: string | null
          vendor_wallet?: string | null
        }
        Update: {
          amount_usdc?: number
          id?: string
          name?: string
          payout_type?: string | null
          project_id?: string | null
          vendor_wallet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          created_at: string | null
          description: string | null
          file_type: string | null
          filename: string | null
          id: string
          project_id: string
          uploaded_by: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_type?: string | null
          filename?: string | null
          id?: string
          project_id: string
          uploaded_by?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_type?: string | null
          filename?: string | null
          id?: string
          project_id?: string
          uploaded_by?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          project_id: string
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          project_id: string
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_roles: {
        Row: {
          id: string
          name: string
          percent: number
          project_id: string | null
          stream_active: boolean | null
          stream_flow_rate: number | null
          wallet_address: string | null
        }
        Insert: {
          id?: string
          name: string
          percent: number
          project_id?: string | null
          stream_active?: boolean | null
          stream_flow_rate?: number | null
          wallet_address?: string | null
        }
        Update: {
          id?: string
          name?: string
          percent?: number
          project_id?: string | null
          stream_active?: boolean | null
          stream_flow_rate?: number | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          assigned_role: string | null
          assigned_to_team_member: string | null
          created_at: string | null
          created_by: string | null
          deadline: string | null
          description: string | null
          id: string
          project_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_role?: string | null
          assigned_to_team_member?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          project_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_role?: string | null
          assigned_to_team_member?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          project_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_assigned_to_team_member_fkey"
            columns: ["assigned_to_team_member"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          cover_art_url: string | null
          created_at: string | null
          escrow_funded_amount: number | null
          expense_sum: number | null
          funding_target: number | null
          funding_total: number | null
          id: string
          minted_at: string | null
          owner_id: string
          pledge_usdc: number | null
          project_idea: string
          project_type: string
          streams_active: boolean | null
          token_address: string | null
          tx_hash: string | null
          wallet_address: string | null
          zora_coin_url: string | null
        }
        Insert: {
          cover_art_url?: string | null
          created_at?: string | null
          escrow_funded_amount?: number | null
          expense_sum?: number | null
          funding_target?: number | null
          funding_total?: number | null
          id?: string
          minted_at?: string | null
          owner_id: string
          pledge_usdc?: number | null
          project_idea: string
          project_type: string
          streams_active?: boolean | null
          token_address?: string | null
          tx_hash?: string | null
          wallet_address?: string | null
          zora_coin_url?: string | null
        }
        Update: {
          cover_art_url?: string | null
          created_at?: string | null
          escrow_funded_amount?: number | null
          expense_sum?: number | null
          funding_target?: number | null
          funding_total?: number | null
          id?: string
          minted_at?: string | null
          owner_id?: string
          pledge_usdc?: number | null
          project_idea?: string
          project_type?: string
          streams_active?: boolean | null
          token_address?: string | null
          tx_hash?: string | null
          wallet_address?: string | null
          zora_coin_url?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: string
          permission: string
          project_id: string
          role_name: string
        }
        Insert: {
          id?: string
          permission: string
          project_id: string
          role_name: string
        }
        Update: {
          id?: string
          permission?: string
          project_id?: string
          role_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          assigned_role: string
          created_at: string | null
          declined_at: string | null
          id: string
          invited_by: string
          invited_email: string | null
          invited_wallet: string | null
          project_id: string
          status: string
          token: string | null
        }
        Insert: {
          accepted_at?: string | null
          assigned_role: string
          created_at?: string | null
          declined_at?: string | null
          id?: string
          invited_by: string
          invited_email?: string | null
          invited_wallet?: string | null
          project_id: string
          status?: string
          token?: string | null
        }
        Update: {
          accepted_at?: string | null
          assigned_role?: string
          created_at?: string | null
          declined_at?: string | null
          id?: string
          invited_by?: string
          invited_email?: string | null
          invited_wallet?: string | null
          project_id?: string
          status?: string
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          assigned_role: string
          exited_at: string | null
          id: string
          invited_email: string | null
          joined_at: string | null
          onboarded: boolean | null
          project_id: string
          status: string
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          assigned_role: string
          exited_at?: string | null
          id?: string
          invited_email?: string | null
          joined_at?: string | null
          onboarded?: boolean | null
          project_id: string
          status?: string
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          assigned_role?: string
          exited_at?: string | null
          id?: string
          invited_email?: string | null
          joined_at?: string | null
          onboarded?: boolean | null
          project_id?: string
          status?: string
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          project_id: string
          team_member_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          project_id: string
          team_member_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          project_id?: string
          team_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
