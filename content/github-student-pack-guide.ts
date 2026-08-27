export type GuideStepLink = {
  label: string;
  href: string;
};

export type GuideStep = {
  title: string;
  body: string[];
  links?: GuideStepLink[];
};

export type GuideLink = {
  label: string;
  href: string;
  description?: string;
};

export const githubStudentPackIntro = {
  kicker: 'For UTG School of ICT students',
  title: 'GitHub Student Developer Pack',
  summary:
    'The GitHub Student Developer Pack gives enrolled students free access to professional developer tools — IDEs, Copilot, hosting credits, and more. ITCA put this guide together so you can apply, claim your benefits (including IntelliJ IDEA), and renew when verification expires.',
};

export const githubStudentPackPrerequisites = {
  title: 'Before you start',
  items: [
    'A GitHub account linked to your official UTG student email (@utg.edu.gm).',
    'Proof of enrollment — student ID, enrollment letter, or transcript if GitHub asks for it.',
    'Your GitHub profile updated with University of The Gambia as your school (Settings → Profile).',
    'A few minutes to complete verification — approvals are often instant but can take a few days.',
  ],
};

export const githubStudentPackSetupSteps: GuideStep[] = [
  {
    title: 'Apply for GitHub Education benefits',
    body: [
      'Sign in to GitHub with your @utg.edu.gm email (or add it to your account and verify it).',
      'Go to GitHub Education and choose “Get student benefits”.',
      'Select your school: University of The Gambia, and your role as a student.',
      'Upload proof of enrollment if prompted, then submit the application.',
      'Wait for approval — you will receive an email when your student status is verified.',
    ],
    links: [
      {
        label: 'Apply on GitHub Education',
        href: 'https://education.github.com/discount_requests/new',
      },
    ],
  },
  {
    title: 'Open your Student Developer Pack',
    body: [
      'Once approved, visit the Student Developer Pack page while signed in.',
      'Browse the partner offers — each tool has its own “Get access” or claim button.',
      'Read each offer’s terms; some are one-time credits, others renew with your student status.',
      'Bookmark the pack dashboard — you will return here to claim and renew tools.',
    ],
    links: [
      {
        label: 'Student Developer Pack',
        href: 'https://education.github.com/pack',
      },
    ],
  },
  {
    title: 'Claim IntelliJ IDEA (JetBrains)',
    body: [
      'From the pack dashboard, find the JetBrains offer and click to claim it.',
      'Create or sign in to a JetBrains Account using your student email.',
      'Complete the JetBrains student application if asked — GitHub verification often speeds this up.',
      'Download IntelliJ IDEA (Ultimate for students) from jetbrains.com/idea.',
      'Open the IDE → Help → Register → sign in with your JetBrains Account to activate the license.',
    ],
    links: [
      {
        label: 'JetBrains for Students',
        href: 'https://www.jetbrains.com/community/education/#students',
      },
      {
        label: 'Download IntelliJ IDEA',
        href: 'https://www.jetbrains.com/idea/download/',
      },
    ],
  },
  {
    title: 'Other tools worth claiming',
    body: [
      'GitHub Copilot — AI pair programming in your editor (included for verified students).',
      'Namecheap / other registrars — free or discounted domain names for personal projects.',
      'Heroku, Azure, or DigitalOcean credits — useful for deployment coursework and side projects.',
      'Each partner has its own signup flow from the pack page — claim only what you will use.',
    ],
    links: [
      {
        label: 'Browse all pack offers',
        href: 'https://education.github.com/pack#offers',
      },
    ],
  },
];

export const githubStudentPackRenewalSteps: GuideStep[] = [
  {
    title: 'Know when benefits expire',
    body: [
      'GitHub Education student benefits are time-limited — you must stay verified while enrolled.',
      'Re-verification is typically required about once per year, or when GitHub emails you to renew.',
      'If verification lapses, pack offers and linked licenses (including JetBrains) may stop working.',
      'Renew before deadlines — especially before exams or project deadlines when you rely on IntelliJ.',
    ],
  },
  {
    title: 'Renew GitHub Education verification',
    body: [
      'Sign in to GitHub and open your Education benefits dashboard.',
      'Check your verification status — if it shows “Action required” or an expiry date, start renewal.',
      'Re-submit with your current @utg.edu.gm email and fresh proof of enrollment if requested.',
      'After approval, your Student Developer Pack access is restored automatically.',
    ],
    links: [
      {
        label: 'GitHub Education benefits',
        href: 'https://education.github.com/benefits',
      },
    ],
  },
  {
    title: 'Renew JetBrains / IntelliJ IDEA',
    body: [
      'JetBrains student licenses renew annually while you remain an eligible student.',
      'Sign in at account.jetbrains.com → Licenses to check expiry and renew if prompted.',
      'If the license expired, re-claim from the GitHub Student Developer Pack JetBrains offer, or re-apply at JetBrains for Students.',
      'In IntelliJ: Help → Register → refresh login if the IDE shows a license warning.',
    ],
    links: [
      {
        label: 'JetBrains Account',
        href: 'https://account.jetbrains.com/licenses',
      },
    ],
  },
  {
    title: 'Renew or re-claim other partner tools',
    body: [
      'Some pack partners (Copilot, cloud credits, domains) follow GitHub’s student status; others have separate renewal dates.',
      'Return to the pack dashboard and look for offers marked expired or “Renew”.',
      'Follow each vendor’s instructions — you may need to sign in to their site again with your student email.',
    ],
    links: [
      {
        label: 'Student Developer Pack dashboard',
        href: 'https://education.github.com/pack',
      },
    ],
  },
];

export const githubStudentPackTips = [
  'Always use your @utg.edu.gm address for GitHub Education and JetBrains — personal emails can cause rejections.',
  'Keep a photo of your student ID or enrollment letter on your phone for quick re-verification.',
  'If verification is rejected, double-check school name spelling and that your GitHub profile matches UTG.',
  'One account per person — sharing pack benefits violates partner terms and can get accounts banned.',
  'Offers change over time; check the official pack page for the latest list.',
];

export const githubStudentPackOfficialLinks: GuideLink[] = [
  {
    label: 'GitHub Student Developer Pack',
    href: 'https://education.github.com/pack',
    description: 'Main hub for all partner offers',
  },
  {
    label: 'GitHub Education documentation',
    href: 'https://docs.github.com/en/education',
    description: 'Official help for students and teachers',
  },
  {
    label: 'JetBrains Free for Students',
    href: 'https://www.jetbrains.com/community/education/#students',
    description: 'IntelliJ IDEA and other JetBrains IDEs',
  },
];
