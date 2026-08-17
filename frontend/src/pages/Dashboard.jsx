import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LuUpload, LuTarget } from 'react-icons/lu';
import client from '../api/client';
import Layout from '../components/Layout';
import ScoreGauge from '../components/ScoreGauge';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/dashboard/stats').then(({ data }) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-black/5" />
          <div className="h-40 rounded-2xl bg-black/5" />
        </div>
      </Layout>
    );
  }

  if (!stats || stats.total_resumes === 0) {
    return (
      <Layout>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="mb-8" style={{ color: 'var(--color-ink-muted)' }}>Your resume readiness, at a glance.</p>
        <div className="rounded-2xl border p-12 text-center" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-signal-dim)' }}>
            <LuUpload size={24} style={{ color: 'var(--color-signal)' }} />
          </div>
          <h2 className="text-lg font-semibold mb-1">No resumes yet</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>Upload your first resume to see your ATS score and analytics here.</p>
          <Link
            to="/upload"
            className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--color-signal)' }}
          >
            Upload resume
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl mb-2">Dashboard</h1>
      <p className="mb-8" style={{ color: 'var(--color-ink-muted)' }}>Your resume readiness, at a glance.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl border p-6 flex items-center gap-5" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <ScoreGauge score={stats.latest_ats_score} size={100} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>Latest ATS Score</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>From your most recent upload</p>
          </div>
        </div>
        <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>Total Resumes</p>
          <p className="text-4xl font-mono font-semibold">{stats.total_resumes}</p>
          <p className="text-xs mt-2" style={{ color: 'var(--color-ink-muted)' }}>Average score: {stats.average_ats_score}/100</p>
        </div>
        <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-ink-muted)' }}>Job Match Analyses</p>
          <p className="text-4xl font-mono font-semibold">{stats.total_analyses}</p>
          <Link to="/job-match" className="text-xs mt-2 inline-flex items-center gap-1 font-medium" style={{ color: 'var(--color-signal)' }}>
            <LuTarget size={12} /> Run a new match
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <h3 className="text-base font-semibold mb-4">ATS Score Trend</h3>
          {stats.ats_trend.length > 1 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.ats_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="var(--color-signal)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm py-16 text-center" style={{ color: 'var(--color-ink-muted)' }}>Upload more resumes to see a trend line.</p>
          )}
        </div>

        <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <h3 className="text-base font-semibold mb-4">Top Skills Across Resumes</h3>
          {stats.skill_distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.skill_distribution} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="skill" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-verdant)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm py-16 text-center" style={{ color: 'var(--color-ink-muted)' }}>No skill data yet.</p>
          )}
        </div>
      </div>

      {stats.top_missing_skills && stats.top_missing_skills.length > 0 && (
        <div className="rounded-2xl border p-6 mt-5" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <h3 className="text-base font-semibold mb-4">Most Common Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {stats.top_missing_skills.map((s) => (
              <span
                key={s.skill}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'var(--color-ember-dim)', color: 'var(--color-ember)' }}
              >
                {s.skill} · {s.count}
              </span>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
