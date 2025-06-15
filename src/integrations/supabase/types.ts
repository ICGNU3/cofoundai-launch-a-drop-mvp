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
      project_roles: {
        Row: {
          id: string
          name: string
          percent: number
          project_id: string | null
          wallet_address: string | null
        }
        Insert: {
          id?: string
          name: string
          percent: number
          project_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          id?: string
          name?: string
          percent?: number
          project_id?: string | null
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
      projects: {
        Row: {
          cover_art_url: string | null
          created_at: string | null
          funding_target: number | null
          funding_total: number | null
          id: string
          minted_at: string | null
          owner_id: string
          pledge_usdc: number | null
          project_idea: string
          project_type: string
          wallet_address: string | null
          zora_coin_url: string | null
        }
        Insert: {
          cover_art_url?: string | null
          created_at?: string | null
          funding_target?: number | null
          funding_total?: number | null
          id?: string
          minted_at?: string | null
          owner_id: string
          pledge_usdc?: number | null
          project_idea: string
          project_type: string
          wallet_address?: string | null
          zora_coin_url?: string | null
        }
        Update: {
          cover_art_url?: string | null
          created_at?: string | null
          funding_target?: number | null
          funding_total?: number | null
          id?: string
          minted_at?: string | null
          owner_id?: string
          pledge_usdc?: number | null
          project_idea?: string
          project_type?: string
          wallet_address?: string | null
          zora_coin_url?: string | null
        }
        Relationships: []
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
