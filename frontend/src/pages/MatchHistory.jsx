import { useEffect, useState } from 'react';
import client from '../api/client';
import Layout from '../components/Layout';

export default function MatchHistory() {
  const [resumes, setResumes] = useState([]);
  const [analysesByResume, setAnalysesByResume] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: resumeList } = await client.get('/resume/list');
      setResumes(resumeList);
      const results = {};
      await Promise.all(
        resumeList.map(async (r) => {
          const { data } = await client.get(`/match/history/${r.id}`);
          results[r.id] = data;
        })
      );
      setAnalysesByResume(results);
      setLoading(false);
    })();
  }, []);

  const allAnalyses = Object.entries(analysesByResume).flatMap(([resumeId, analyses]) =>
    analyses.map((a) => ({ ...a, resumeName: resumes.find((r) => String(r.id) === String(resumeId))?.filename }))
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const scoreColor = (score) => {
    if (score >= 75) return 'var(--color-verdant)';
    if (score >= 50) return 'var(--color-amber)';
    return 'var(--color-ember)';
  };

  return (
    <Layout>
      <h1 className="text-3xl mb-2">Match History</h1>
      <p className="mb-8" style={{ color: 'var(--color-ink-muted)' }}>Every job match you've run, across all resumes.</p>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-black/5" />)}
        </div>
      ) : allAnalyses.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>No job matches run yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allAnalyses.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-xl border p-5"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}
            >
              <div>
                <p className="text-sm font-medium">{a.job_title || 'Untitled Role'} {a.company_name && `· ${a.company_name}`}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                  {a.resumeName} · {new Date(a.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="font-mono font-semibold text-lg" style={{ color: scoreColor(a.match_percentage) }}>
                {Math.round(a.match_percentage)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
