export interface Profile {
  id: string;
  full_name: string;
  email: string;
  country: string;
  date_of_birth?: string;
  gender?: string;
  first_generation: boolean;
  low_income: boolean;

  // Academic
  gpa?: number;
  gpa_scale: string;
  intended_major?: string;
  education_level: string;
  academic_strengths?: string;
  extracurriculars?: string[];
  sat_score?: number;
  act_score?: number;
  toefl_score?: number;
  ielts_score?: number;
  english_level?: number;
  test_optional_preference: boolean;

  // Goals
  destination_country: string;
  target_start_term?: string;
  preferred_school_type?: string;
  preferred_states?: string[];
  preferred_campus_size?: string;
  preferred_setting?: string;

  // Financial
  annual_family_income?: string;
  max_annual_budget?: number;
  needs_full_scholarship: boolean;
  willing_community_college_transfer: boolean;

  // Visa & Work
  needs_f1_visa: boolean;
  plans_to_work: boolean;
  work_goals?: string;

  // Support needs
  support_needs?: string[];

  // Meta
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  acceptance_rate?: number;
  avg_sat?: number;
  avg_act?: number;
  min_toefl?: number;
  min_ielts?: number;
  tuition_in_state?: number;
  tuition_out_of_state?: number;
  tuition_international?: number;
  room_and_board?: number;
  estimated_total_cost?: number;
  avg_financial_aid?: number;
  international_aid_available: boolean;
  merit_scholarships_available: boolean;
  need_blind_international: boolean;
  test_optional: boolean;
  total_enrollment?: number;
  international_student_pct?: number;
  student_faculty_ratio?: string;
  popular_majors?: string[];
  campus_setting?: string;
  website?: string;
  description?: string;
  image_url?: string;
  us_news_rank?: number;
  created_at: string;
}

export interface Scholarship {
  id: number;
  name: string;
  slug: string;
  provider: string;
  type: string;
  amount_min?: number;
  amount_max?: number;
  covers_tuition: boolean;
  covers_living: boolean;
  renewable: boolean;
  duration_years: number;
  eligible_countries?: string[];
  eligible_majors?: string[];
  min_gpa?: number;
  min_toefl?: number;
  min_ielts?: number;
  education_level?: string[];
  income_requirement?: string;
  first_gen_only: boolean;
  deadline?: string;
  application_url?: string;
  description?: string;
  requirements?: string;
  university_id?: number;
  university?: University;
  created_at: string;
}

export interface SavedMatch {
  id: number;
  user_id: string;
  university_id?: number;
  scholarship_id?: number;
  match_score: number;
  match_reasons: string[];
  estimated_net_cost?: number;
  difficulty_level?: string;
  status: string;
  notes?: string;
  university?: University;
  scholarship?: Scholarship;
  created_at: string;
}

export interface ChatMessage {
  id?: number;
  user_id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

export interface MatchResult {
  university_matches: {
    id: number;
    score: number;
    reasons: string[];
    estimated_net_cost: number;
    difficulty_level: string;
  }[];
  scholarship_matches: {
    id: number;
    score: number;
    reasons: string[];
  }[];
  pathways: {
    university_id: number;
    scholarship_ids: number[];
    estimated_net_cost: number;
    description: string;
  }[];
  summary: string;
}
