import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const getSnapshot = () => window.matchMedia(query).matches;
const getServerSnapshot = () => false;

// Use the same preference during server rendering and initial hydration.
export default function usePublicReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
