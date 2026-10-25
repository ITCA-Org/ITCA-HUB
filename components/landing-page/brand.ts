export const CONTACT_MAIL = 'mailto:itca@utg.edu.gm';

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/1GUd1gGihV/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/utgitca?igsh=MTRwcTF4amRuZ2x0YQ==',
  linkedin:
    'https://gm.linkedin.com/company/utg-itca-information-technology-communication-association-university-of-the-gambia',
} as const;

/** Public site palette: blue and white. */
export const ITCA = {
  ink: '#005080',
  blue: '#005080',
  blueSoft: '#FFFFFF',
  orange: '#005080',
  orangeSoft: '#FFFFFF',
  white: '#FFFFFF',
} as const;

export const darkCtaClass =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#005080] itca-blue-surface px-5 py-3 text-sm font-semibold text-[var(--itca-accent-ink)] transition hover:brightness-110 active:scale-[0.98]';
