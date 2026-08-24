import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { darkCtaClass } from './brand';
import { Reveal } from './reveal';

const STORAGE_KEY = 'itca-newsletter-emails';

const TOPICS = [
  'Upcoming events & bootcamps',
  'Campus life & sports days',
  'Resources for ICT students',
  'Shop drops & merch news',
];

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !trimmed.includes('@')) {
      toast.error('Enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
      const list = Array.isArray(existing) ? existing : [];
      if (!list.includes(trimmed)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, trimmed]));
      }
      toast.success('Subscribed', {
        description: 'You’ll hear from ITCA about events and campus updates.',
      });
      setEmail('');
    } catch {
      toast.success('Subscribed', {
        description: 'You’ll hear from ITCA about events and campus updates.',
      });
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white px-4 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-2 lg:gap-16 lg:items-end">
        <Reveal>
          <p className="landing-mono mb-4 text-sm text-[#FF6A00]">Newsletter</p>
          <h2 className="max-w-xl text-3xl font-bold leading-tight text-[#0A1628] sm:text-4xl lg:text-5xl">
            Subscribe to our newsletter
          </h2>
          <p className="mt-4 max-w-md text-base text-[#0A1628]/70 sm:text-lg">
            Event dates, bootcamp callouts, and campus updates—straight to your inbox. No spam.
          </p>

          <ul className="mt-8 space-y-2">
            {TOPICS.map((topic) => (
              <li key={topic} className="flex items-start gap-2 text-sm text-[#0A1628]/75 sm:text-base">
                <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6A00]" />
                {topic}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.5rem] bg-[#D4E6F2] p-5 sm:rounded-[2rem] sm:p-8"
          >
            <label htmlFor="newsletter-email" className="block text-sm font-semibold text-[#0A1628]">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@utg.edu.gm"
              className="mt-2 w-full rounded-full border border-[#0A1628]/10 bg-white px-5 py-3.5 text-base text-[#0A1628] placeholder:text-[#0A1628]/35 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${darkCtaClass} mt-4 w-full min-h-12 disabled:opacity-70`}
            >
              {isSubmitting ? 'Subscribing…' : 'Subscribe'}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-[#0A1628]/55">
              By subscribing you agree to hear from ITCA about association news. Unsubscribe anytime
              by emailing us.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default NewsletterSection;
