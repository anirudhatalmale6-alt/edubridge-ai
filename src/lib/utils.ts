export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getMatchColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50';
  if (score >= 60) return 'text-blue-600 bg-blue-50';
  if (score >= 40) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
}

export function getDifficultyColor(level: string): string {
  switch (level) {
    case 'high': return 'text-emerald-700 bg-emerald-100';
    case 'medium': return 'text-amber-700 bg-amber-100';
    case 'low': return 'text-red-700 bg-red-100';
    default: return 'text-gray-700 bg-gray-100';
  }
}

export function getDifficultyLabel(level: string): string {
  switch (level) {
    case 'high': return 'Good chance';
    case 'medium': return 'Possible';
    case 'low': return 'Competitive';
    default: return level;
  }
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Algeria' },
  { code: 'AR', name: 'Argentina' }, { code: 'BD', name: 'Bangladesh' }, { code: 'BR', name: 'Brazil' },
  { code: 'CM', name: 'Cameroon' }, { code: 'CN', name: 'China' }, { code: 'CO', name: 'Colombia' },
  { code: 'CD', name: 'DR Congo' }, { code: 'EG', name: 'Egypt' }, { code: 'ET', name: 'Ethiopia' },
  { code: 'GH', name: 'Ghana' }, { code: 'GT', name: 'Guatemala' }, { code: 'HT', name: 'Haiti' },
  { code: 'IN', name: 'India' }, { code: 'ID', name: 'Indonesia' }, { code: 'IQ', name: 'Iraq' },
  { code: 'JO', name: 'Jordan' }, { code: 'KE', name: 'Kenya' }, { code: 'LB', name: 'Lebanon' },
  { code: 'MY', name: 'Malaysia' }, { code: 'MX', name: 'Mexico' }, { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' }, { code: 'MM', name: 'Myanmar' }, { code: 'NP', name: 'Nepal' },
  { code: 'NG', name: 'Nigeria' }, { code: 'PK', name: 'Pakistan' }, { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' }, { code: 'RW', name: 'Rwanda' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' }, { code: 'ZA', name: 'South Africa' }, { code: 'KR', name: 'South Korea' },
  { code: 'LK', name: 'Sri Lanka' }, { code: 'SD', name: 'Sudan' }, { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' }, { code: 'TZ', name: 'Tanzania' }, { code: 'TH', name: 'Thailand' },
  { code: 'TR', name: 'Turkey' }, { code: 'UG', name: 'Uganda' }, { code: 'UA', name: 'Ukraine' },
  { code: 'VN', name: 'Vietnam' }, { code: 'YE', name: 'Yemen' }, { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
].sort((a, b) => a.name.localeCompare(b.name));

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
];

export const MAJORS = [
  'Accounting', 'Aerospace Engineering', 'Agriculture', 'Architecture', 'Biology',
  'Biomedical Engineering', 'Business Administration', 'Chemical Engineering', 'Chemistry',
  'Civil Engineering', 'Communication', 'Computer Engineering', 'Computer Science',
  'Criminal Justice', 'Data Science', 'Economics', 'Education', 'Electrical Engineering',
  'English Literature', 'Environmental Science', 'Film & Media', 'Finance', 'Graphic Design',
  'Health Sciences', 'History', 'Hospitality Management', 'Information Technology',
  'International Relations', 'Journalism', 'Law (Pre-Law)', 'Liberal Arts', 'Linguistics',
  'Marketing', 'Mathematics', 'Mechanical Engineering', 'Medicine (Pre-Med)', 'Music',
  'Nursing', 'Nutrition', 'Pharmacy (Pre-Pharmacy)', 'Philosophy', 'Physics',
  'Political Science', 'Psychology', 'Public Health', 'Social Work', 'Sociology',
  'Software Engineering', 'Statistics', 'Theater Arts', 'Undecided',
];
