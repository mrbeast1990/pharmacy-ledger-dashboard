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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      app_owner: {
        Row: {
          singleton: boolean
          user_id: string
        }
        Insert: {
          singleton?: boolean
          user_id: string
        }
        Update: {
          singleton?: boolean
          user_id?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          company_id: string
          created_at: string
          id: string
          mime_type: string
          name: string
          object_path: string
          size_bytes: number
        }
        Insert: {
          company_id: string
          created_at?: string
          id: string
          mime_type: string
          name: string
          object_path: string
          size_bytes: number
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          mime_type?: string
          name?: string
          object_path?: string
          size_bytes?: number
        }
        Relationships: [
          {
            foreignKeyName: "attachments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string
          after_data: Json | null
          before_data: Json | null
          company_id: string
          id: number
          occurred_at: string
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          actor_id: string
          after_data?: Json | null
          before_data?: Json | null
          company_id: string
          id?: never
          occurred_at?: string
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string
          after_data?: Json | null
          before_data?: Json | null
          company_id?: string
          id?: never
          occurred_at?: string
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          has_commission: boolean
          id: string
        }
        Insert: {
          has_commission: boolean
          id: string
        }
        Update: {
          has_commission?: boolean
          id?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string
          company_id: string
          invoice_notes: string
          logo_id: string | null
          name: string
          phone: string
          version: number
        }
        Insert: {
          address?: string
          company_id: string
          invoice_notes?: string
          logo_id?: string | null
          name: string
          phone?: string
          version?: number
        }
        Update: {
          address?: string
          company_id?: string
          invoice_notes?: string
          logo_id?: string | null
          name?: string
          phone?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_settings_logo_id_company_id_fkey"
            columns: ["logo_id", "company_id"]
            isOneToOne: false
            referencedRelation: "attachments"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          attachment_id: string | null
          company_id: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          document_date: string
          id: string
          is_deleted: boolean
          notes: string
          pharmacy_id: string
          reference: string
          updated_at: string
          version: number
        }
        Insert: {
          amount: number
          attachment_id?: string | null
          company_id: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          document_date: string
          id: string
          is_deleted?: boolean
          notes?: string
          pharmacy_id: string
          reference: string
          updated_at?: string
          version?: number
        }
        Update: {
          amount?: number
          attachment_id?: string | null
          company_id?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          document_date?: string
          id?: string
          is_deleted?: boolean
          notes?: string
          pharmacy_id?: string
          reference?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_attachment_id_company_id_fkey"
            columns: ["attachment_id", "company_id"]
            isOneToOne: false
            referencedRelation: "attachments"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_pharmacy_id_company_id_fkey"
            columns: ["pharmacy_id", "company_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "invoices_pharmacy_id_company_id_fkey"
            columns: ["pharmacy_id", "company_id"]
            isOneToOne: false
            referencedRelation: "pharmacy_balances"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          attachment_id: string | null
          company_id: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          document_date: string
          id: string
          is_deleted: boolean
          notes: string
          pharmacy_id: string
          reference: string
          updated_at: string
          version: number
        }
        Insert: {
          amount: number
          attachment_id?: string | null
          company_id: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          document_date: string
          id: string
          is_deleted?: boolean
          notes?: string
          pharmacy_id: string
          reference?: string
          updated_at?: string
          version?: number
        }
        Update: {
          amount?: number
          attachment_id?: string | null
          company_id?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          document_date?: string
          id?: string
          is_deleted?: boolean
          notes?: string
          pharmacy_id?: string
          reference?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_attachment_id_company_id_fkey"
            columns: ["attachment_id", "company_id"]
            isOneToOne: false
            referencedRelation: "attachments"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_pharmacy_id_company_id_fkey"
            columns: ["pharmacy_id", "company_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "payments_pharmacy_id_company_id_fkey"
            columns: ["pharmacy_id", "company_id"]
            isOneToOne: false
            referencedRelation: "pharmacy_balances"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      pharmacies: {
        Row: {
          company_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id: string
          name: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharmacies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      ledger_entries: {
        Row: {
          amount: number | null
          attachment_id: string | null
          company_id: string | null
          created_at: string | null
          document_date: string | null
          id: string | null
          kind: string | null
          notes: string | null
          pharmacy_id: string | null
          reference: string | null
          updated_at: string | null
          version: number | null
        }
        Relationships: []
      }
      pharmacy_balances: {
        Row: {
          company_id: string | null
          id: string | null
          name: string | null
          remaining: number | null
          total_invoiced: number | null
          total_paid: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pharmacies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      running_ledger: {
        Row: {
          amount: number | null
          attachment_id: string | null
          attachment_name: string | null
          company_id: string | null
          created_at: string | null
          document_date: string | null
          id: string | null
          kind: string | null
          notes: string | null
          pharmacy_id: string | null
          reference: string | null
          running_balance: number | null
          updated_at: string | null
          version: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_commission: {
        Args: { p_company: string; p_from: string; p_to: string }
        Returns: Json
      }
      company_snapshot: { Args: { p_company: string }; Returns: Json }
      is_owner: { Args: never; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
