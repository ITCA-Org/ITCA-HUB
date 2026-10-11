import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NextApiRequest } from 'next';
import Link from 'next/link';
import axios from 'axios';
import {
  Download,
  ExternalLink,
  RefreshCw,
  Search,
  Settings2,
  Users,
  FileText,
  Plus,
  Trash2,
  X,
  Save,
  CheckCircle2,
  Clock,
  Laptop,
} from 'lucide-react';
import { UserAuth } from '@/types';
import {
  ApplicationStatus,
  HackathonApplication as Application,
  HackathonSettings,
} from '@/types/interfaces/hackathon';
import { requireAdminAuth } from '@/utils/auth';
import { BASE_URL } from '@/utils/url';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

const statuses: ApplicationStatus[] = ['pending', 'accepted', 'waitlisted', 'rejected'];
const statusStyles = {
  pending: 'bg-amber-50 text-amber-800',
  accepted: 'bg-emerald-50 text-emerald-800',
  waitlisted: 'bg-blue-50 text-blue-800',
  rejected: 'bg-red-50 text-red-800',
};
const labels: Record<string, string> = {
  pending: 'Pending review',
  accepted: 'Accepted',
  waitlisted: 'Waitlisted',
  rejected: 'Rejected',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  mixed: 'Mixed experience',
  none: 'No team members',
  some: 'Some team members',
  all: 'All team members',
  yes: 'Everyone has a laptop',
  shared: 'Sharing laptops',
  support: 'Needs laptop support',
};
const field =
  'w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-[#0A1628] outline-none focus:border-[#005080] focus:ring-2 focus:ring-[#005080]/15 sm:text-sm';
const button =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0A1628] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';
const primary = `${button} !border-[#0A1628] !bg-[#0A1628] !text-white hover:!bg-[#005080]`;
const dateLabel = (value?: string) =>
  value
    ? new Date(value).toLocaleString('en-GB', {
        timeZone: 'Africa/Banjul',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Not recorded';
const messageFor = (error: unknown) =>
  axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
    ? error.response.data.message
    : 'Unable to complete this request. Please try again.';
const cleanSettings = (data: HackathonSettings): HackathonSettings => ({
  applicationsOpen: data.applicationsOpen,
  problemsPublished: data.problemsPublished ?? false,
  problems: data.problems.map(({ title, description }) => ({ title, description })),
});
function Badge({ status = 'pending' }: { status?: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
export default function HackathonAdmin({ userData }: { userData: UserAuth }) {
  const [tab, setTab] = useState<'applications' | 'settings'>('applications');
  const [settings, setSettings] = useState<HackathonSettings | null>(null);
  const [savedSettings, setSavedSettings] = useState<HackathonSettings | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [institution, setInstitution] = useState('all');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Application | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ApplicationStatus>('pending');
  const [notes, setNotes] = useState('');
  const [reviewError, setReviewError] = useState('');
  const dialog = useRef<HTMLDivElement>(null);
  const headers = useMemo(() => ({ Authorization: `Bearer ${userData.token}` }), [userData.token]);
  const dirty = !!settings && JSON.stringify(settings) !== JSON.stringify(savedSettings);
  const reviewDirty =
    !!selected &&
    (reviewStatus !== (selected.status ?? 'pending') || notes !== (selected.adminNotes ?? ''));
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [config, teams] = await Promise.all([
        axios.get(`${BASE_URL}/hackathon/settings`, { headers }),
        axios.get(`${BASE_URL}/hackathon/applications`, { headers }),
      ]);
      const normalized = cleanSettings(config.data.data);
      setSettings(normalized);
      setSavedSettings(normalized);
      setApplications(teams.data.data);
      setPage(0);
    } catch (error) {
      setLoadError(messageFor(error));
    } finally {
      setLoading(false);
    }
  }, [headers]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (!dirty && !reviewDirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, reviewDirty]);
  const closeReview = useCallback(() => {
    if (busy || (reviewDirty && !window.confirm('Discard unsaved review changes?'))) return;
    setSelected(null);
    setReviewError('');
  }, [busy, reviewDirty]);
  const closeRef = useRef(closeReview);
  useEffect(() => {
    closeRef.current = closeReview;
  }, [closeReview]);
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab') return;
      const elements = Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], select:not(:disabled), textarea:not(:disabled)'
        ) ?? []
      );
      const first = elements[0],
        last = elements[elements.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog.current)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', key);
      previous?.focus();
    };
  }, [selected]);
  const counts = useMemo(
    () => ({
      total: applications.length,
      participants: applications.reduce((sum, team) => sum + team.members.length, 0),
      pending: applications.filter((team) => !team.status || team.status === 'pending').length,
      accepted: applications.filter((team) => team.status === 'accepted').length,
      support: applications.filter(
        (team) => team.laptopAccess === 'support' || team.laptopAccess === 'shared'
      ).length,
    }),
    [applications]
  );
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return applications.filter(
      (team) =>
        (filter === 'all' || (team.status ?? 'pending') === filter) &&
        (institution === 'all' ||
          (institution === 'utg'
            ? team.institutionType === 'utg' || team.institution === 'University of The Gambia'
            : team.institutionType !== 'utg' && team.institution !== 'University of The Gambia')) &&
        (!search ||
          [
            team.teamName,
            team.leaderName,
            team.email,
            team.phone,
            team.institution,
            team._id,
            ...team.members.flatMap((member) => [member.name, member.matricNumber ?? '']),
          ]
            .join(' ')
            .toLowerCase()
            .includes(search))
    );
  }, [applications, query, filter, institution]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, pageCount - 1);
  function openReview(team: Application) {
    setSelected(team);
    setReviewStatus(team.status ?? 'pending');
    setNotes(team.adminNotes ?? '');
    setReviewError('');
  }
  async function saveReview(event: FormEvent) {
    event.preventDefault();
    if (!selected || busy) return;
    setBusy(true);
    setReviewError('');
    try {
      const res = await axios.patch(
        `${BASE_URL}/hackathon/applications/${selected._id}`,
        { status: reviewStatus, adminNotes: notes },
        { headers }
      );
      setApplications((previous) =>
        previous.map((team) => (team._id === selected._id ? res.data.data : team))
      );
      setSelected(null);
      setNotice({ text: 'Application review saved. No email has been sent to the team.' });
    } catch (error) {
      setReviewError(messageFor(error));
    } finally {
      setBusy(false);
    }
  }
  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    if (!settings || busy) return;
    if (
      !savedSettings?.problemsPublished &&
      settings.problemsPublished &&
      !window.confirm('Publish these problem statements on the public hackathon page now?')
    )
      return;
    if (
      savedSettings?.applicationsOpen &&
      !settings.applicationsOpen &&
      !window.confirm('Close team applications now? Existing applications will be kept.')
    )
      return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await axios.put(`${BASE_URL}/hackathon`, settings, { headers });
      const normalized = cleanSettings(res.data.data);
      setSettings(normalized);
      setSavedSettings(normalized);
      setNotice({ text: 'Event controls and problem statements saved.' });
    } catch (error) {
      setNotice({ text: messageFor(error), error: true });
    } finally {
      setBusy(false);
    }
  }
  function exportCsv() {
    const cell = (value: unknown) => {
      const text = String(value ?? '');
      return `"${(/^[=+@\-\t\r]/.test(text.trimStart()) ? "'" : '') + text.replace(/"/g, '""')}"`;
    };
    const rows = [
      [
        'Reference',
        'Team',
        'Status',
        'Leader',
        'Email',
        'Phone',
        'Institution',
        'Participants',
        'Members / roles / matric numbers',
        'Experience',
        'Previous hackathons',
        'Technologies',
        'Motivation',
        'Problem interests',
        'Laptop access',
        'Support needs',
        'Submitted',
        'Reviewed',
      ],
      ...filtered.map((team) => [
        team._id,
        team.teamName,
        labels[team.status ?? 'pending'],
        team.leaderName,
        team.email,
        team.phone,
        team.institution,
        team.members.length,
        team.members
          .map((member) => `${member.name} / ${member.role} / ${member.matricNumber ?? ''}`)
          .join('; '),
        team.experienceLevel,
        team.previousHackathons,
        team.technologies,
        team.motivation,
        team.problemInterests,
        team.laptopAccess,
        team.interests,
        team.createdAt,
        team.reviewedAt,
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(['\uFEFF' + rows.map((row) => row.map(cell).join(',')).join('\r\n')], {
        type: 'text/csv;charset=utf-8;',
      })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hackathon-2026-applications.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const stats = [
    { icon: Users, title: 'Teams', value: counts.total },
    { icon: Users, title: 'Participants', value: counts.participants },
    { icon: Clock, title: 'Pending review', value: counts.pending },
    { icon: CheckCircle2, title: 'Accepted teams', value: counts.accepted },
    { icon: Laptop, title: 'Laptop support / sharing', value: counts.support },
  ];
  return (
    <DashboardLayout title="Hackathon 2026" token={userData.token}>
      <div className="mx-auto max-w-7xl p-4 text-[#0A1628] sm:p-6 lg:p-8">
        <DashboardPageHeader
          title="Hackathon"
          subtitle="2026"
          description="Review teams, prepare challenges, and manage registration from one place."
          actions={
            <>
              <Link href="/hackathon" target="_blank" rel="noreferrer" className={button}>
                <ExternalLink size={16} />
                Public page
              </Link>
              <button
                disabled={loading || busy}
                onClick={() => {
                  if (!dirty || window.confirm('Discard unsaved settings and refresh?'))
                    void load();
                }}
                className={button}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </>
          }
        />
        {notice && (
          <div
            role={notice.error ? 'alert' : 'status'}
            className={`mb-5 flex items-center justify-between gap-3 rounded-xl border p-4 text-sm ${notice.error ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}
          >
            {notice.text}
            <button aria-label="Dismiss message" onClick={() => setNotice(null)}>
              <X size={18} />
            </button>
          </div>
        )}
        {loadError ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-white p-8">
            <h2 className="font-semibold">Couldn&apos;t load hackathon data</h2>
            <p className="my-3 text-sm text-slate-600">{loadError}</p>
            <button onClick={() => void load()} className={button}>
              Try again
            </button>
          </div>
        ) : loading ? (
          <div role="status" className="space-y-5">
            <p className="text-sm text-slate-500">Loading hackathon workspace…</p>
            <div className="h-28 animate-pulse rounded-2xl bg-slate-200/60" />
            <div className="h-80 animate-pulse rounded-2xl bg-white" />
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-5">
              {stats.map(({ icon: Icon, title, value }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#0A1628]/10 bg-white p-4 last:col-span-2 xl:last:col-span-1"
                >
                  <Icon size={18} className="mb-3 text-[#005080]" />
                  <p className="text-3xl font-semibold">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{title}</p>
                </div>
              ))}
            </div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Hackathon sections">
                {(['applications', 'settings'] as const).map((value) => (
                  <button
                    key={value}
                    aria-pressed={tab === value}
                    onClick={() => {
                      setTab(value);
                      setNotice(null);
                    }}
                    className={tab === value ? primary : button}
                  >
                    {value === 'applications' ? <Users size={16} /> : <Settings2 size={16} />}
                    {value === 'applications' ? 'Applications' : 'Event controls'}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span
                  className={`rounded-full px-3 py-2 ${savedSettings?.applicationsOpen ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}
                >
                  Registration {savedSettings?.applicationsOpen ? 'open' : 'closed'}
                </span>
                <span className="rounded-full bg-blue-50 px-3 py-2 text-blue-800">
                  Problems {savedSettings?.problemsPublished ? 'public' : 'hidden'}
                </span>
              </div>
            </div>
            {tab === 'applications' ? (
              <section className="overflow-hidden rounded-2xl border border-[#0A1628]/10 bg-white">
                <div className="space-y-4 border-b border-slate-100 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">Team applications</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Open an application to review participants and record a decision.
                      </p>
                    </div>
                    <button disabled={!filtered.length} onClick={exportCsv} className={button}>
                      <Download size={16} />
                      Export {filtered.length} {filtered.length === 1 ? 'team' : 'teams'}
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
                    <label className="relative">
                      <span className="sr-only">Search applications</span>
                      <Search size={17} className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setPage(0);
                        }}
                        placeholder="Team, name, email or matric number"
                        className={`${field} pl-10`}
                      />
                    </label>
                    <label>
                      <span className="sr-only">Filter by review status</span>
                      <select
                        value={filter}
                        onChange={(event) => {
                          setFilter(event.target.value);
                          setPage(0);
                        }}
                        className={field}
                      >
                        <option value="all">All statuses</option>
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {labels[status]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">Filter by institution</span>
                      <select
                        value={institution}
                        onChange={(event) => {
                          setInstitution(event.target.value);
                          setPage(0);
                        }}
                        className={field}
                      >
                        <option value="all">All institutions</option>
                        <option value="utg">UTG</option>
                        <option value="other">Other institutions</option>
                      </select>
                    </label>
                  </div>
                </div>
                {!filtered.length ? (
                  <div className="px-6 py-16 text-center">
                    <FileText className="mx-auto mb-4 text-slate-300" size={36} />
                    <h3 className="font-semibold">
                      {applications.length ? 'No matching applications' : 'No applications yet'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {applications.length
                        ? 'Try another search or clear the filters.'
                        : 'Team applications will appear here when students submit them.'}
                    </p>
                    {applications.length > 0 && (
                      <button
                        onClick={() => {
                          setQuery('');
                          setFilter('all');
                          setInstitution('all');
                          setPage(0);
                        }}
                        className={`${button} mt-5`}
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-slate-100">
                      {filtered.slice(currentPage * 10, currentPage * 10 + 10).map((team) => (
                        <article
                          key={team._id}
                          className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/60 sm:flex-row sm:items-center"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="break-words font-semibold">{team.teamName}</h3>
                              <Badge status={team.status} />
                            </div>
                            <p className="mt-2 break-words text-sm text-slate-600">
                              {team.leaderName} · {team.institution}
                            </p>
                            <p className="mt-1 break-all text-xs text-slate-400">{team.email}</p>
                          </div>
                          <div className="shrink-0 text-xs text-slate-500">
                            <p>{team.members.length} participants</p>
                            <p className="mt-1">{dateLabel(team.createdAt)}</p>
                          </div>
                          <button
                            onClick={() => openReview(team)}
                            aria-label={`Review ${team.teamName}`}
                            className={button}
                          >
                            Review team
                          </button>
                        </article>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5 text-sm">
                      <p className="text-slate-500">
                        {currentPage * 10 + 1}–{Math.min(currentPage * 10 + 10, filtered.length)} of{' '}
                        {filtered.length} teams
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={currentPage === 0}
                          onClick={() => setPage(currentPage - 1)}
                          className={button}
                        >
                          Previous
                        </button>
                        <span className="px-2 text-xs">
                          {currentPage + 1} / {pageCount}
                        </span>
                        <button
                          disabled={currentPage + 1 === pageCount}
                          onClick={() => setPage(currentPage + 1)}
                          className={button}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </section>
            ) : (
              settings && (
                <form onSubmit={saveSettings} className="space-y-6">
                  <fieldset disabled={busy} className="space-y-6">
                    <div className="grid gap-5 lg:grid-cols-2">
                      {[
                        {
                          key: 'applicationsOpen' as const,
                          title: 'Team registration',
                          description:
                            'Allow new teams to submit an application. Closing registration keeps existing applications.',
                        },
                        {
                          key: 'problemsPublished' as const,
                          title: 'Problem statement visibility',
                          description:
                            'Reveal approved challenges on the public hackathon page. Leave off to keep the blurred preview.',
                        },
                      ].map((control) => (
                        <label
                          key={control.key}
                          className="flex cursor-pointer items-start gap-4 rounded-2xl border border-[#0A1628]/10 bg-white p-6"
                        >
                          <input
                            type="checkbox"
                            checked={settings[control.key]}
                            onChange={(event) =>
                              setSettings({ ...settings, [control.key]: event.target.checked })
                            }
                            className="mt-1 h-5 w-5 shrink-0 accent-[#005080]"
                          />
                          <span>
                            <span className="block font-semibold">{control.title}</span>
                            <span className="mt-2 block text-sm leading-relaxed text-slate-500">
                              {control.description}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <section className="space-y-5 rounded-2xl border border-[#0A1628]/10 bg-white p-5 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold">Problem statements</h2>
                          <p className="mt-1 text-sm text-slate-500">
                            {settings.problems.length} challenges · changes take effect when saved.
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={settings.problems.length >= 50}
                          onClick={() =>
                            setSettings({
                              ...settings,
                              problems: [...settings.problems, { title: '', description: '' }],
                            })
                          }
                          className={button}
                        >
                          <Plus size={16} />
                          Add challenge
                        </button>
                      </div>
                      {!settings.problems.length && (
                        <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                          No problem statements. Add a challenge before making them public.
                        </p>
                      )}
                      {settings.problems.map((problem, index) => (
                        <div
                          key={index}
                          className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold">
                              Challenge {String(index + 1).padStart(2, '0')}
                            </h3>
                            <button
                              type="button"
                              aria-label={`Remove challenge ${index + 1}`}
                              onClick={() => {
                                if (
                                  !problem.title ||
                                  window.confirm(
                                    `Remove “${problem.title}”? This change takes effect when saved.`
                                  )
                                )
                                  setSettings({
                                    ...settings,
                                    problems: settings.problems.filter((_, i) => i !== index),
                                  });
                              }}
                              className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-red-700"
                            >
                              <Trash2 size={16} />
                              Remove
                            </button>
                          </div>
                          <label className="block text-sm font-medium">
                            Title
                            <input
                              required
                              minLength={2}
                              maxLength={200}
                              value={problem.title}
                              onChange={(event) =>
                                setSettings({
                                  ...settings,
                                  problems: settings.problems.map((p, i) =>
                                    i === index ? { ...p, title: event.target.value } : p
                                  ),
                                })
                              }
                              className={`${field} mt-2`}
                            />
                          </label>
                          <label className="block text-sm font-medium">
                            Problem description
                            <textarea
                              required
                              minLength={10}
                              maxLength={10000}
                              rows={6}
                              value={problem.description}
                              onChange={(event) =>
                                setSettings({
                                  ...settings,
                                  problems: settings.problems.map((p, i) =>
                                    i === index ? { ...p, description: event.target.value } : p
                                  ),
                                })
                              }
                              className={`${field} mt-2`}
                            />
                          </label>
                        </div>
                      ))}
                    </section>
                  </fieldset>
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                    <p role="status" className="text-sm text-slate-500">
                      {dirty ? 'You have unsaved changes.' : 'All changes saved.'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!dirty || busy}
                        onClick={() => {
                          if (window.confirm('Discard your unsaved settings?'))
                            setSettings(savedSettings);
                        }}
                        className={button}
                      >
                        Discard
                      </button>
                      <button
                        disabled={
                          !dirty ||
                          busy ||
                          (settings.problemsPublished && !settings.problems.length)
                        }
                        className={primary}
                      >
                        <Save size={16} />
                        {busy ? 'Saving…' : 'Save controls'}
                      </button>
                    </div>
                  </div>
                </form>
              )
            )}
          </>
        )}
      </div>
      {selected && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-[#0A1628]/50">
          <div
            ref={dialog}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
            className="flex h-dvh w-full max-w-2xl flex-col bg-white shadow-2xl outline-none"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 p-5">
              <div className="min-w-0">
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#005080]">
                  Application review
                </p>
                <h2 id="review-title" className="break-words text-2xl font-semibold">
                  {selected.teamName}
                </h2>
              </div>
              <button
                disabled={busy}
                aria-label="Close review"
                onClick={closeReview}
                className={button}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveReview} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain p-5 sm:p-6">
                <section className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Badge status={selected.status} />
                    <span className="text-xs text-slate-400">
                      Submitted {dateLabel(selected.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-semibold">Team leader & institution</h3>
                  <p className="text-sm text-slate-600">
                    {selected.leaderName} · {selected.institution}
                  </p>
                  <p className="break-all text-sm">
                    <a href={`mailto:${selected.email}`} className="text-[#005080] underline">
                      {selected.email}
                    </a>
                  </p>
                  <p className="text-sm text-slate-600">{selected.phone}</p>
                  <p className="break-all text-xs text-slate-400">Reference: {selected._id}</p>
                </section>
                <section>
                  <h3 className="mb-3 font-semibold">Participants ({selected.members.length})</h3>
                  <div className="space-y-2">
                    {selected.members.map((member, index) => (
                      <div key={index} className="rounded-xl bg-slate-50 p-4">
                        <p className="break-words text-sm font-semibold">{member.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{member.role}</p>
                        {member.matricNumber && (
                          <p className="mt-2 text-xs text-[#005080]">
                            Matriculation number: {member.matricNumber}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="mb-3 font-semibold">Experience & support</h3>
                  <dl className="space-y-4">
                    {[
                      ['Experience', labels[selected.experienceLevel ?? '']],
                      ['Previous hackathons', labels[selected.previousHackathons ?? '']],
                      ['Technologies', selected.technologies],
                      ['Motivation & learning goals', selected.motivation],
                      ['Problem interests', selected.problemInterests],
                      ['Laptop access', labels[selected.laptopAccess ?? '']],
                      ['Support / accessibility needs', selected.interests],
                    ].map(([title, value]) => (
                      <div key={title}>
                        <dt className="text-xs font-semibold text-slate-400">{title}</dt>
                        <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">
                          {value || 'Not provided'}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
                <fieldset
                  disabled={busy}
                  className="space-y-4 rounded-2xl border border-[#005080]/15 bg-[#D4E6F2]/30 p-5"
                >
                  <legend className="px-2 font-semibold">Organiser review</legend>
                  <label className="block text-sm font-medium">
                    Decision
                    <select
                      value={reviewStatus}
                      onChange={(event) => setReviewStatus(event.target.value as ApplicationStatus)}
                      className={`${field} mt-2`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {labels[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-medium">
                    Private organiser notes
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      maxLength={5000}
                      rows={4}
                      className={`${field} mt-2`}
                      placeholder="Record review context, support arrangements, or follow-up actions."
                    />
                  </label>
                  <p className="text-xs text-slate-500">
                    Notes and decisions are private. Saving does not send an email.
                  </p>
                  {selected.reviewedAt && (
                    <p className="text-xs text-slate-500">
                      Last reviewed {dateLabel(selected.reviewedAt)}
                    </p>
                  )}
                </fieldset>
                {reviewError && (
                  <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
                    {reviewError}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <button type="button" disabled={busy} onClick={closeReview} className={button}>
                  Cancel
                </button>
                <button disabled={busy || !reviewDirty} className={primary}>
                  <Save size={16} />
                  {busy ? 'Saving…' : 'Save review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => requireAdminAuth(req);
