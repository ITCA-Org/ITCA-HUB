import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import LandingLayout from '@/components/landing-page/landing-layout';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { darkCtaClass } from '@/components/landing-page/brand';
import { BASE_URL } from '@/utils/url';

export type HackathonSettings = {
  applicationsOpen: boolean;
  problems: { title: string; description: string }[];
};
const inputClass =
  'mt-2 w-full rounded-xl border border-[#0A1628]/15 bg-white px-4 py-3.5 text-base text-[#0A1628] transition placeholder:text-[#0A1628]/35 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/15 disabled:opacity-60';

export default function HackathonApplyPage() {
  const [settings, setSettings] = useState<HackathonSettings | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [members, setMembers] = useState([{ name: '', role: '', matricNumber: '' }]);
  const [institutionType, setInstitutionType] = useState('utg');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const steps = ['Team details', 'Participants', 'Experience & goals', 'Review & submit'];
  const advance = (next: number) => {
    setStep(next);
    setError('');
    document
      .getElementById('application-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  useEffect(() => {
    axios
      .get(`${BASE_URL}/hackathon`)
      .then((res) => setSettings(res.data.data))
      .catch(() => setLoadError(true));
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) {
      advance(step + 1);
      return;
    }
    if (busy) return;
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const res = await axios.post(`${BASE_URL}/hackathon/applications`, {
        ...answers,
        institutionType,
        institution: institutionType === 'utg' ? 'University of The Gambia' : answers.institution,
        members: members.map((member) => ({
          ...member,
          matricNumber: institutionType === 'utg' ? member.matricNumber : '',
        })),
        consent: form.get('consent') === 'on',
      });
      setReference(res.data.data.reference);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Unable to submit. Please try again.'
          : 'Unable to submit. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <LandingLayout
      path="/hackathon/apply"
      title="Apply for Hackathon 2026 | ITCA Hub"
      description="Submit your team application for the ITCA Hackathon 2026."
      showFloatingCta={false}
      showNewsletter={false}
    >
      <section className="min-h-screen bg-white px-5 pb-20 pt-28 text-[#0A1628] sm:px-10 md:pt-36 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <Link
            href="/hackathon"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#005080] transition hover:text-[#FF6A00]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to hackathon
          </Link>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
            <aside className="lg:sticky lg:top-32">
              <p className="landing-mono text-xs uppercase tracking-widest text-[#FF6A00]">
                Hackathon 2026 · Team application
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Bring your team.
                <br />
                <span className="text-[#005080]">Start something.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[#0A1628]/65">
                Tell us who you are, what you bring, and what you hope to build. Submit once per
                team using your team leader&apos;s email.
              </p>
              <div className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#FFE0CC] px-5 py-3 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#FF6A00]" />
                21 October 2026
              </div>
              {!reference && (
                <ol
                  aria-label="Application progress"
                  className="mt-10 hidden max-w-md border-t border-[#0A1628]/15 lg:block"
                >
                  {steps.map((label, index) => (
                    <li
                      key={label}
                      aria-current={step === index ? 'step' : undefined}
                      className="flex items-center gap-4 border-b border-[#0A1628]/15 py-4"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${index <= step ? 'bg-[#0A1628] text-[#FF6A00]' : 'bg-[#D4E6F2] text-[#005080]'}`}
                      >
                        {index < step ? <Check className="h-4 w-4" /> : `0${index + 1}`}
                      </span>
                      <span
                        className={`text-base ${index === step ? 'font-bold' : 'text-[#0A1628]/55'}`}
                      >
                        {label}
                      </span>
                      {index === step && <ArrowRight className="ml-auto h-4 w-4 text-[#FF6A00]" />}
                    </li>
                  ))}
                </ol>
              )}
              <p className="mt-6 hidden text-sm text-[#0A1628]/55 lg:block">
                Applications are reviewed by the organisers.
              </p>
            </aside>
            <div className="min-w-0">
              {reference ? (
                <div role="status" className="rounded-[2rem] bg-[#D4E6F2] p-8 sm:p-10">
                  <CheckCircle2 className="mb-6 h-12 w-12 text-[#005080]" />
                  <h2 className="text-3xl font-bold">Application received.</h2>
                  <p className="mt-3">
                    Keep your reference: <strong className="break-all">{reference}</strong>.
                    Submission does not yet confirm participation.
                  </p>
                </div>
              ) : settings?.applicationsOpen ? (
                <form
                  id="application-form"
                  onSubmit={submit}
                  onChange={(event) => {
                    const target = event.target as HTMLInputElement;
                    if (target.name && target.type !== 'checkbox')
                      setAnswers((previous) => ({ ...previous, [target.name]: target.value }));
                  }}
                  className="scroll-mt-28 space-y-7 rounded-[2rem] bg-[#D4E6F2] p-5 sm:p-8 lg:p-10"
                >
                  <div className="border-b border-[#005080]/20 pb-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="landing-mono text-xs uppercase tracking-widest text-[#005080]">
                        Step 0{step + 1} / 04
                      </p>
                      <span className="text-xs text-[#0A1628]/55">
                        {Math.round(((step + 1) / 4) * 100)}% through the form
                      </span>
                    </div>
                    <div aria-hidden="true" className="mt-4 flex gap-2 lg:hidden">
                      {steps.map((label, index) => (
                        <span
                          key={label}
                          className={`h-1.5 flex-1 rounded-full ${index <= step ? 'bg-[#FF6A00]' : 'bg-[#005080]/15'}`}
                        />
                      ))}
                    </div>
                    <h2
                      role="status"
                      className="mt-5 text-2xl font-bold tracking-tight sm:text-4xl"
                    >
                      {steps[step]}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#0A1628]/65">
                      {
                        [
                          'Start with your team name, contact details, and institution.',
                          'Introduce everyone taking part, including your team leader.',
                          'Share your experience, goals, and anything you need from us.',
                          'Check your answers, then send your application to the organisers.',
                        ][step]
                      }
                    </p>
                  </div>
                  <fieldset disabled={step !== 0 || busy} hidden={step !== 0} className="space-y-6">
                    <legend className="sr-only">Team details</legend>
                    <div className="grid gap-5 sm:grid-cols-2">
                      {[
                        ['teamName', 'Team name', 'text', 100],
                        ['leaderName', 'Team leader name', 'text', 100],
                        ['email', 'Team leader email', 'email', 254],
                        ['phone', 'Phone / WhatsApp', 'tel', 30],
                      ].map(([name, label, type, max]) => (
                        <label key={name} className="text-sm font-semibold">
                          {label}
                          <input
                            name={String(name)}
                            type={String(type)}
                            required
                            minLength={type === 'tel' ? 7 : 2}
                            maxLength={Number(max)}
                            className={inputClass}
                          />
                        </label>
                      ))}
                    </div>
                    <label className="block text-sm font-semibold">
                      Institution
                      <select
                        value={institutionType}
                        onChange={(e) => setInstitutionType(e.target.value)}
                        className={inputClass}
                      >
                        <option value="utg">University of The Gambia</option>
                        <option value="other">Others</option>
                      </select>
                    </label>
                    {institutionType === 'other' && (
                      <label className="block text-sm font-semibold">
                        Exact institution name
                        <input
                          name="institution"
                          required
                          minLength={2}
                          maxLength={150}
                          className={inputClass}
                        />
                      </label>
                    )}
                  </fieldset>
                  <fieldset disabled={step !== 1 || busy} hidden={step !== 1}>
                    <legend className="font-semibold">
                      Team members (include your team leader)
                    </legend>
                    <p className="mt-2 text-sm text-slate-600">
                      Tell us how each member will contribute to your project.
                    </p>
                    {members.map((member, i) => (
                      <div
                        key={i}
                        className="mt-5 grid gap-5 rounded-2xl bg-white/50 p-5 sm:grid-cols-2"
                      >
                        <label className="text-sm font-semibold">
                          Member {i + 1} name
                          <input
                            required
                            minLength={2}
                            maxLength={100}
                            className={inputClass}
                            value={member.name}
                            onChange={(e) =>
                              setMembers(
                                members.map((m, index) =>
                                  index === i ? { ...m, name: e.target.value } : m
                                )
                              )
                            }
                          />
                        </label>
                        <label className="text-sm font-semibold">
                          Role / skills
                          <input
                            required
                            minLength={2}
                            maxLength={100}
                            className={inputClass}
                            value={member.role}
                            onChange={(e) =>
                              setMembers(
                                members.map((m, index) =>
                                  index === i ? { ...m, role: e.target.value } : m
                                )
                              )
                            }
                          />
                        </label>
                        {institutionType === 'utg' && (
                          <label className="text-sm font-semibold">
                            Matriculation number
                            <input
                              required
                              minLength={2}
                              maxLength={50}
                              className={inputClass}
                              value={member.matricNumber}
                              onChange={(e) =>
                                setMembers(
                                  members.map((m, index) =>
                                    index === i ? { ...m, matricNumber: e.target.value } : m
                                  )
                                )
                              }
                            />
                          </label>
                        )}
                        {members.length > 1 && (
                          <button
                            type="button"
                            aria-label={`Remove member ${i + 1}`}
                            onClick={() => setMembers(members.filter((_, index) => index !== i))}
                            className="self-end p-3 text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      disabled={members.length >= 30}
                      onClick={() =>
                        setMembers([...members, { name: '', role: '', matricNumber: '' }])
                      }
                      className={`${darkCtaClass} mt-5`}
                    >
                      + Add team member
                    </button>
                  </fieldset>
                  <fieldset disabled={step !== 2 || busy} hidden={step !== 2} className="space-y-6">
                    <legend className="sr-only">Experience and goals</legend>
                    <label className="block text-sm font-semibold">
                      How would you describe your team&apos;s experience?
                      <select
                        name="experienceLevel"
                        required
                        defaultValue=""
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select experience level
                        </option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="mixed">Mixed experience</option>
                      </select>
                    </label>
                    <label className="block text-sm font-semibold">
                      Has your team participated in a hackathon before?
                      <select
                        name="previousHackathons"
                        required
                        defaultValue=""
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select an answer
                        </option>
                        <option value="none">No team members have</option>
                        <option value="some">Some team members have</option>
                        <option value="all">All team members have</option>
                      </select>
                    </label>
                    <label className="block text-sm font-semibold">
                      Which tools or technologies does your team use?
                      <textarea
                        name="technologies"
                        required
                        minLength={2}
                        maxLength={1000}
                        rows={3}
                        className={inputClass}
                      />
                    </label>
                    <label className="block text-sm font-semibold">
                      Why do you want to participate, and what do you hope to learn?
                      <textarea
                        name="motivation"
                        required
                        minLength={10}
                        maxLength={2000}
                        rows={4}
                        className={inputClass}
                      />
                    </label>
                    <label className="block text-sm font-semibold">
                      What kinds of problems would your team like to work on? (optional)
                      <textarea
                        name="problemInterests"
                        maxLength={1000}
                        rows={3}
                        className={inputClass}
                      />
                    </label>
                    <label className="block text-sm font-semibold">
                      Will each participant have access to a laptop?
                      <select name="laptopAccess" required defaultValue="" className={inputClass}>
                        <option value="" disabled>
                          Select an answer
                        </option>
                        <option value="yes">Yes, everyone has access</option>
                        <option value="shared">We will share laptops</option>
                        <option value="support">We need support</option>
                      </select>
                    </label>
                    <label className="block text-sm font-semibold">
                      Support or accessibility needs (optional)
                      <textarea name="interests" maxLength={2000} rows={4} className={inputClass} />
                    </label>
                  </fieldset>
                  <fieldset disabled={step !== 3 || busy} hidden={step !== 3} className="space-y-6">
                    <legend className="sr-only">Review and submit</legend>
                    <p>Review your details before submitting. Use Back to make changes.</p>
                    <dl className="space-y-4 rounded-2xl bg-white/60 p-6">
                      {[
                        ['Team', answers.teamName],
                        ['Leader', answers.leaderName],
                        ['Email', answers.email],
                        ['Phone', answers.phone],
                        [
                          'Institution',
                          institutionType === 'utg'
                            ? 'University of The Gambia'
                            : answers.institution,
                        ],
                        ['Experience', answers.experienceLevel],
                        ['Previous hackathons', answers.previousHackathons],
                        ['Technologies', answers.technologies],
                        ['Motivation & goals', answers.motivation],
                        ['Problem interests', answers.problemInterests],
                        ['Laptop access', answers.laptopAccess],
                        ['Support needs', answers.interests],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="landing-mono text-xs text-[#005080]">{label}</dt>
                          <dd className="whitespace-pre-wrap break-words">
                            {value || 'Not provided'}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <ul className="space-y-2">
                      {members.map((member, index) => (
                        <li key={index}>
                          {member.name} · {member.role}
                          {institutionType === 'utg' && ` · Matric: ${member.matricNumber}`}
                        </li>
                      ))}
                    </ul>
                    <label className="flex items-start gap-3 text-sm">
                      <input name="consent" type="checkbox" required className="mt-1" />
                      <span>
                        My team agrees to share these details with the organisers for application
                        review and event communication.
                      </span>
                    </label>
                  </fieldset>
                  {error && (
                    <p role="alert" className="text-red-700">
                      {error}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-4 border-t border-[#005080]/20 pt-6">
                    {step > 0 && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => advance(step - 1)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#0A1628]/20 px-4 py-3.5 text-sm font-semibold transition hover:bg-white/50 disabled:opacity-50"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                    )}
                    <button
                      key={step}
                      type="submit"
                      disabled={busy}
                      className={`${darkCtaClass} ml-auto px-5 py-4 disabled:cursor-wait disabled:opacity-60`}
                    >
                      {busy ? 'Submitting…' : step === 3 ? 'Submit application' : 'Continue'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <p className="rounded-[2rem] bg-[#D4E6F2] p-8">
                  {loadError
                    ? 'Applications are unavailable until event information can be loaded.'
                    : settings
                      ? 'Team applications are currently closed.'
                      : 'Loading applications…'}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
