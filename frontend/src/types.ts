export type Course = {
  title: string;
  type: string;
  description: string;
  duration: string;
  fees: string;
  route: string;
  syllabus_pdf: string;
  focus: string;
  why_choose: string[];
  quote: string;
};

export type CampusItem = {
  title: string;
  description: string;
  details: string[];
  subtitle?: string;
  detail_cards?: { title: string; body: string }[];
  quote?: string;
};

export type College = {
  name: string;
  kicker: string;
  summary: string;
  about: string[];
  highlights: string[];
  stats: { value: string; label: string }[];
  courses: Course[];
  campus_life: CampusItem[];
  faculty: { name: string; role: string }[];
  alumni: { name: string; role: string; quote: string }[];
  contacts: { campus: string; address: string; phone: string; email: string }[];
  links: { label: string; url: string }[];
};
