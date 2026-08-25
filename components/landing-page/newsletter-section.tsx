'use client';

import axios from 'axios';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { darkCtaClass } from './brand';
import { Reveal } from './reveal';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';

const TOPICS = [
  'Upcoming events & bootcamps',
  'Campus life & sports days',
  'Resources for ICT students',
  'Shop drops & merch news',
];

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !trimmed.includes('@')) {
      toast.error('Enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post(
        `${BASE_URL}/newsletter-subscribers/subscribe`,
        { email: trimmed }
      );

      const alreadySubscribed = data?.data?.alreadySubscribed;
      toast.success(alreadySubscribed ? 'Already subscribed' : 'Subscribed', {
        description: alreadySubscribed
          ? 'This email is already on the ITCA newsletter list.'
          : 'Check your inbox for a confirmation email from ITCA.',
      });
      setEmail('');
    } catch (error) {
      const { message } = getErrorMessage(error as Error);
      toast.error('Could not subscribe', {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white px-4 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2 lg:items-end lg:gap-20">
        <Reveal>
          <p className="landing-mono mb-5 text-base text-[#FF6A00] sm:text-lg">Newsletter</p>
          <h2 className="max-w-2xl text-4xl font-bold leading-tight text-[#0A1628] sm:text-5xl lg:text-6xl">
            Subscribe to our newsletter
          </h2>
          <p className="mt-6 max-w-lg text-lg text-[#0A1628]/70 sm:text-xl">
            Event dates, bootcamp callouts, and campus updates—straight to your inbox. No spam.
          </p>

          <ul className="mt-10 space-y-3">
            {TOPICS.map((topic) => (
              <li
                key={topic}
                className="flex items-start gap-3 text-base text-[#0A1628]/75 sm:text-lg"
              >
                <span className="mt-2.5 inline-block h-2 w-2 shrink-0 rounded-full bg-[#FF6A00]" />
                {topic}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.75rem] bg-[#D4E6F2] p-7 sm:rounded-[2.25rem] sm:p-10 lg:p-12"
          >
            <label
              htmlFor="newsletter-email"
              className="block text-base font-semibold text-[#0A1628] sm:text-lg"
            >
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
              className="mt-3 w-full rounded-full border border-[#0A1628]/10 bg-white px-6 py-4 text-lg text-[#0A1628] placeholder:text-[#0A1628]/35 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${darkCtaClass} mt-5 w-full min-h-14 text-lg disabled:opacity-70`}
            >
              {isSubmitting ? 'Subscribing…' : 'Subscribe'}
            </button>
            <p className="mt-4 text-sm leading-relaxed text-[#0A1628]/55 sm:text-base">
              By subscribing you agree to hear from ITCA about association news. Unsubscribe anytime
              via the link in our emails.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default NewsletterSection;
