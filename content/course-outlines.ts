export type CourseOutlineRow = {
  sn: number;
  code: string;
  title: string;
  creditHours: number;
  section: string;
};

export type CourseOutline = {
  slug: string;
  title: string;
  university: string;
  school: string;
  programme: string;
  tableHeading: string;
  summary: string;
  courses: CourseOutlineRow[];
};

export const COURSE_OUTLINES: CourseOutline[] = [
  {
    slug: 'computer-science-minor',
    title: 'Computer Science Minor Requirements',
    university: 'The University of The Gambia',
    school: 'School of Information Technology and Communication (SITC)',
    programme: 'Computer Science Minor',
    tableHeading: 'Computer Science Minor Core Courses',
    summary:
      'Students wishing to graduate from the University of The Gambia with a minor in Computer Science must complete a minimum of 120 credit hours including: All General Education Requirements of the University of The Gambia. All 57 credit hours of the 18 Computer Science core courses as defined below.',
    courses: [
      {
        sn: 1,
        code: 'ICT 101',
        title: 'Introduction to I.C.T.',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 2,
        code: 'ICT 105',
        title: 'Computer Programming I',
        creditHours: 4,
        section: 'MINOR',
      },
      {
        sn: 3,
        code: 'ICT 201',
        title: 'Computer Architecture & Organization',
        creditHours: 4,
        section: 'MINOR',
      },
      {
        sn: 4,
        code: 'ICT 202',
        title: 'Computer Programming II',
        creditHours: 4,
        section: 'MINOR',
      },
      {
        sn: 5,
        code: 'ICT 203',
        title: 'Computer Networking I',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 6,
        code: 'ICT 204',
        title: 'Database Systems I',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 7,
        code: 'ICT 205',
        title: 'Data Structure & Algorithms',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 8,
        code: 'ICT 206',
        title: 'Principles of Operating System',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 9,
        code: 'CPS 302',
        title: 'Internet and Web Programming I',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 10,
        code: 'CPS 305',
        title: 'Computer Logic and Discrete Structures',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 11,
        code: 'CPS 306',
        title: 'Automata and Languages',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 12,
        code: 'CPS 403',
        title: 'Artificial Intelligence',
        creditHours: 3,
        section: 'MINOR',
      },
    ],
  },
  {
    slug: 'information-systems-minor',
    title: 'Information Systems Minor Requirements',
    university: 'The University of The Gambia',
    school: 'School of Information Technology and Communication (SITC)',
    programme: 'Information Systems Minor',
    tableHeading: 'Information Systems Minor Courses',
    summary:
      'Students wishing to graduate from the University of The Gambia with a minor in Information Systems must complete a minimum of 12 Minor courses as defined below.',
    courses: [
      {
        sn: 1,
        code: 'ICT 102',
        title: 'Introduction to Computing & I.S',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 2,
        code: 'ICT 103',
        title: 'Programming Logic and Design',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 3,
        code: 'ICT 106',
        title: 'Ethics for Computing and Engineering',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 4,
        code: 'ICT 301',
        title: 'Project Management',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 5,
        code: 'INS 302',
        title: 'Systems Analysis & Design',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 6,
        code: 'ICT 204',
        title: 'Database Systems I',
        creditHours: 4,
        section: 'MINOR',
      },
      {
        sn: 7,
        code: 'INS 304',
        title: 'Service Centric and Cloud Computing',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 8,
        code: 'INS 305',
        title: 'Systems Administration and Security',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 9,
        code: 'INS 308',
        title: 'Internetworking & TCP/IP',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 10,
        code: 'INS 402',
        title: 'Access Control Sys. & Methodology',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 11,
        code: 'INS 414',
        title: 'Information Security & Auditing',
        creditHours: 3,
        section: 'MINOR',
      },
      {
        sn: 12,
        code: 'INS 405',
        title: 'Computer Forensics',
        creditHours: 3,
        section: 'MINOR',
      },
    ],
  },
];

export function getCourseOutline(slug: string) {
  return COURSE_OUTLINES.find((outline) => outline.slug === slug) ?? null;
}

export function totalCreditHours(outline: CourseOutline) {
  return outline.courses.reduce((sum, course) => sum + course.creditHours, 0);
}
