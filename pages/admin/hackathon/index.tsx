import { useEffect, useState } from 'react';
import { NextApiRequest } from 'next';
import axios from 'axios';
import { UserAuth } from '@/types';
import { requireAdminAuth } from '@/utils/auth';
import { BASE_URL } from '@/utils/url';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import type { HackathonSettings } from '@/pages/hackathon';

type Application = {
  _id: string;
  teamName: string;
  leaderName: string;
  email: string;
  phone: string;
  institution: string;
  interests: string;
  experienceLevel?: string;
  previousHackathons?: string;
  technologies?: string;
  motivation?: string;
  problemInterests?: string;
  laptopAccess?: string;
  members: { name: string; role: string; matricNumber?: string }[];
};
export default function HackathonAdmin({ userData }: { userData: UserAuth }) {
  const [settings, setSettings] = useState<HackathonSettings | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const headers = { Authorization: `Bearer ${userData.token}` };
    Promise.all([
      axios.get(`${BASE_URL}/hackathon/settings`, { headers }),
      axios.get(`${BASE_URL}/hackathon/applications`, { headers }),
    ])
      .then(([config, teams]) => {
        setSettings(config.data.data);
        setApplications(teams.data.data);
      })
      .catch(() => setMessage('Unable to load hackathon data. Please refresh.'));
  }, [userData.token]);
  async function save() {
    setBusy(true);
    setMessage('');
    try {
      await axios.put(`${BASE_URL}/hackathon`, settings, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      setMessage('Saved. Problem statements remain hidden on the public page for now.');
    } catch (error) {
      setMessage(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Unable to save.'
          : 'Unable to save.'
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <DashboardLayout title="Hackathon 2026" token={userData.token}>
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <h1 className="text-3xl font-bold">Hackathon 2026</h1>
        <a href="/hackathon" className="text-blue-800 underline">
          View public page
        </a>
        {message && <p role="status">{message}</p>}
        {settings && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
            className="space-y-5 rounded-xl bg-white p-6"
          >
            <label className="flex gap-3">
              <input
                type="checkbox"
                checked={settings.applicationsOpen}
                onChange={(e) => setSettings({ ...settings, applicationsOpen: e.target.checked })}
              />
              Accept team applications
            </label>
            <h2 className="text-xl font-bold">Public problem statements</h2>
            <p>
              Prepare challenges here. Problem statements remain hidden on the public page for now.
            </p>
            {settings.problems.map((problem, i) => (
              <fieldset key={i} className="space-y-3 rounded-xl border p-4">
                <legend>Problem {i + 1}</legend>
                <label className="block">
                  Title
                  <input
                    required
                    minLength={2}
                    maxLength={200}
                    value={problem.title}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        problems: settings.problems.map((p, index) =>
                          index === i ? { ...p, title: e.target.value } : p
                        ),
                      })
                    }
                    className="mt-2 w-full rounded border p-3"
                  />
                </label>
                <label className="block">
                  Description
                  <textarea
                    required
                    minLength={10}
                    maxLength={10000}
                    rows={5}
                    value={problem.description}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        problems: settings.problems.map((p, index) =>
                          index === i ? { ...p, description: e.target.value } : p
                        ),
                      })
                    }
                    className="mt-2 w-full rounded border p-3"
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      problems: settings.problems.filter((_, index) => index !== i),
                    })
                  }
                  className="text-red-700"
                >
                  Remove problem
                </button>
              </fieldset>
            ))}
            <div className="flex gap-5">
              <button
                type="button"
                disabled={settings.problems.length >= 50}
                onClick={() =>
                  setSettings({
                    ...settings,
                    problems: [...settings.problems, { title: '', description: '' }],
                  })
                }
              >
                + Add problem
              </button>
              <button disabled={busy} className="rounded bg-orange-600 px-5 py-3 text-white">
                {busy ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        )}
        <h2 className="text-2xl font-bold">Team applications ({applications.length})</h2>
        {settings && applications.length === 0 && <p>No applications yet.</p>}
        {applications.map((team) => (
          <article key={team._id} className="rounded-xl bg-white p-6">
            <h3 className="text-xl font-bold">{team.teamName}</h3>
            <p className="mt-2">
              {team.leaderName} · {team.institution}
            </p>
            <p className="break-all">
              {team.email} · {team.phone}
            </p>
            <ul className="mt-4 list-inside list-disc">
              {team.members.map((member, i) => (
                <li key={i}>
                  {member.name} — {member.role}
                  {member.matricNumber && ` · Matric: ${member.matricNumber}`}
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2">
              {[
                ['Experience', team.experienceLevel],
                ['Previous hackathons', team.previousHackathons],
                ['Technologies', team.technologies],
                ['Motivation & goals', team.motivation],
                ['Problem interests', team.problemInterests],
                ['Laptop access', team.laptopAccess],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-sm font-semibold">{label}</dt>
                    <dd className="whitespace-pre-wrap">{value}</dd>
                  </div>
                ))}
            </dl>
            {team.interests && <p className="mt-4 whitespace-pre-wrap">{team.interests}</p>}
            <p className="mt-3 text-sm text-slate-500">Reference: {team._id}</p>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}
export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => requireAdminAuth(req);
