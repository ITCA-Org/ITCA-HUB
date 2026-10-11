export type ApplicationStatus = 'pending' | 'accepted' | 'waitlisted' | 'rejected';
export type HackathonSettings = {
  applicationsOpen: boolean;
  problemsPublished: boolean;
  problems: { title: string; description: string }[];
};
export type HackathonApplication = {
  _id: string;
  teamName: string;
  leaderName: string;
  email: string;
  phone: string;
  institution: string;
  institutionType?: 'utg' | 'other';
  interests?: string;
  experienceLevel?: string;
  previousHackathons?: string;
  technologies?: string;
  motivation?: string;
  problemInterests?: string;
  laptopAccess?: string;
  members: { name: string; role: string; matricNumber?: string }[];
  status?: ApplicationStatus;
  adminNotes?: string;
  createdAt?: string;
  reviewedAt?: string;
};
