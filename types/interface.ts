export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  password_confirmation: string;
}

export interface UserTypes {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
}

export interface CampaignTypes {
  title: string;
  email_template_id: number;
  scheduled_at?: string;
  send_now: boolean;
}

export interface ContactTypes {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_id: string;
  group: string;
  contactDate: string;
  address: string;
}

export interface TemplateTypes {
  name: string;
  content: string;
}