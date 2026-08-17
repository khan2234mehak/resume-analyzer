import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuCircleCheck, LuCircleAlert, LuTarget } from 'react-icons/lu';
import client from '../api/client';
import Layout from '../components/Layout';
import ScoreGauge from '../components/ScoreGauge';

const SECTION_LABELS = {
  sections_present: 'Section Coverage',
  contact_info: 'Contact Info',
  resume_length: 'Resume Length',
  action_verbs: 'Action Verbs',
  skills_presence: 'Skills Presence',
  formatting: 'Formatting',
};

export default function ResumeDetail() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/resume/${id}`).then(({ data }) => {
      setResume(data);
      setLoading(false);
    });
  }, [id]);

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

  if (!resume) {
    return (
      <Layout>
        <p>Resume not found.</p>
      </Layout>
    );
  }

  const sections = resume.section_scores || {};

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">{resume.filename}</h1>
          <p style={{ color: 'var(--color-ink-muted)' }}>
            Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
          </p>
        </div>
        <Link
          to="/job-match"
          state={{ resumeId: resume.id }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'var(--color-signal)' }}
        >
          <LuTarget size={16} /> Match against a job
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl border p-6 flex flex-col items-center" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <ScoreGauge score={resume.ats_score} label="Overall ATS Score" size={150} />
        </div>

        <div className="lg:col-span-2 rounded-2xl border p-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <h3 className="text-base font-semibold mb-4">Section Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(SECTION_LABELS).map(([key, label]) => {
              const value = sections[key] ?? 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--color-ink-muted)' }}>{label}</span>
                    <span className="font-mono font-medium">{value}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--color-border)' }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${value}%`,
                        background: value >= 75 ? 'var(--color-verdant)' : value >= 50 ? 'var(--color-amber)' : 'var(--color-ember)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {sections.feedback && sections.feedback.length > 0 && (
        <div className="rounded-2xl border p-6 mb-8" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <h3 className="text-base font-semibold mb-4">Improvement Suggestions</h3>
          <ul className="space-y-2.5">
            {sections.feedback.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <LuCircleAlert size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--color-amber)' }} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <h3 className="text-base font-semibold mb-4">Extracted Details</h3>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt style={{ color: 'var(--color-ink-muted)' }}>Name</dt><dd>{resume.full_name || '—'}</dd></div>
            <div className="flex justify-between"><dt style={{ color: 'var(--color-ink-muted)' }}>Email</dt><dd>{resume.email || '—'}</dd></div>
            <div className="flex justify-between"><dt style={{ color: 'var(--color-ink-muted)' }}>Phone</dt><dd>{resume.phone || '—'}</dd></div>
            <div className="flex justify-between"><dt style={{ color: 'var(--color-ink-muted)' }}>Links</dt><dd className="text-right">{resume.links?.join(', ') || '—'}</dd></div>
          </dl>
        </div>

        <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <h3 className="text-base font-semibold mb-4">Skills Detected ({resume.skills?.length || 0})</h3>
          <div className="flex flex-wrap gap-2">
            {resume.skills?.length > 0 ? resume.skills.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--color-verdant-dim)', color: 'var(--color-verdant)' }}>
                {s}
              </span>
            )) : <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>No skills detected.</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
