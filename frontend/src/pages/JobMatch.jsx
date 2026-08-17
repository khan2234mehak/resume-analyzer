import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LuCircleCheck, LuCircleX } from 'react-icons/lu';
import client from '../api/client';
import Layout from '../components/Layout';
import ScoreGauge from '../components/ScoreGauge';

export default function JobMatch() {
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState(location.state?.resumeId || '');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/resume/list').then(({ data }) => {
      setResumes(data);
      if (!resumeId && data.length > 0) setResumeId(data[0].id);
    });
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await client.post('/match/analyze', {
        resume_id: resumeId,
        job_title: jobTitle,
        company_name: companyName,
        job_description: jobDescription,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl mb-2">Job Match</h1>
      <p className="mb-8" style={{ color: 'var(--color-ink-muted)' }}>
        Paste a job description to see how well your resume matches.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleAnalyze} className="rounded-2xl border p-6 space-y-4" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <div>
            <label className="block text-sm font-medium mb-1.5">Resume</label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border text-sm"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="" disabled>Select a resume</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>{r.filename}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Job title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="Data Scientist"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Company</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="LatentView"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Job description</label>
            <textarea
              required
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none"
              style={{ borderColor: 'var(--color-border)' }}
              placeholder="Paste the full job description here…"
            />
          </div>

          {error && (
            <div className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--color-ember-dim)', color: 'var(--color-ember)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || resumes.length === 0}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--color-signal)' }}
          >
            {loading ? 'Analyzing…' : 'Analyze match'}
          </button>
          {resumes.length === 0 && (
            <p className="text-xs text-center" style={{ color: 'var(--color-ink-muted)' }}>Upload a resume first to run a match.</p>
          )}
        </form>

        <div>
          {result ? (
            <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
              <div className="flex flex-col items-center mb-6">
                <ScoreGauge score={result.match_percentage} label="Match Score" size={150} />
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-semibold mb-2.5 flex items-center gap-2">
                  <LuCircleCheck size={16} style={{ color: 'var(--color-verdant)' }} /> Matching Skills ({result.matching_skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.matching_skills.length > 0 ? result.matching_skills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--color-verdant-dim)', color: 'var(--color-verdant)' }}>
                      {s}
                    </span>
                  )) : <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>No overlapping skills detected.</p>}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2.5 flex items-center gap-2">
                  <LuCircleX size={16} style={{ color: 'var(--color-ember)' }} /> Missing Skills ({result.missing_skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.length > 0 ? result.missing_skills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--color-ember-dim)', color: 'var(--color-ember)' }}>
                      {s}
                    </span>
                  )) : <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>No gaps — great coverage!</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border p-12 text-center h-full flex items-center justify-center" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
              <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>Results will appear here after you run an analysis.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
