export interface ContactInfo {
  email: string;
  cv: string;
  linkedin: string;
  github: string;
}

export interface Skills {
  languages: string[];
  frameworks: string[];
  tools: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  live_url: string;
  code_repo_url: string;
  date: string;
  features: string[];
  images: string[];
  type: "personal" | "work" | "academic";
  category: "web" | "mobile" | "desktop" | "library";
  featured: boolean;
  isPrivate: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  id: string;
  institution: string;
  job: string;
  technologies: string[];
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  working: "remote" | "onsite" | "hybrid";
}

export interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
}

export interface GuestbookEntry {
  id: string;
  message: string;
  createdAt: Date;
  user: {
    username: string;
    avatarUrl: string | null;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  tags: string[];
}