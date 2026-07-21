export type Role = "admin" | "staff" | "client";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  job_title: string | null;
  phone: string | null;
  role: Role;
  created_at: string;
}
