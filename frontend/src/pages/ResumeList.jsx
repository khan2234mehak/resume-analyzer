import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuFileText, LuTrash2, LuUpload } from 'react-icons/lu';
import client from '../api/client';
import Layout from '../components/Layout';

export default function ResumeList() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = () => {
    client.get('/resume/list').then(({ data }) => {
      setResumes(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this resume? This cannot be undone.')) return;
    await client.delete(`/resume/${id}`);
    fetchResumes();
  };

  const scoreColor = (score) => {
    if (score >= 75) return 'var(--color-verdant)';
    if (score >= 50) return 'var(--color-amber)';
    return 'var(--color-ember)';
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">My Resumes</h1>
          <p style={{ color: 'var(--color-ink-muted)' }}>All your uploaded resumes and their ATS scores.</p>
        </div>
        <Link
          to="/upload"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'var(--color-signal)' }}
        >
          <LuUpload size={16} /> Upload new
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-black/5" />)}
        </div>
      ) : resumes.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>No resumes uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((r) => (
            <Link
              key={r.id}
              to={`/resumes/${r.id}`}
              className="flex items-center justify-between rounded-xl border p-5 hover:shadow-sm transition-shadow"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-signal-dim)' }}>
                  <LuFileText size={18} style={{ color: 'var(--color-signal)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium">{r.filename}</p>
                  <p className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                    Uploaded {new Date(r.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-semibold text-lg" style={{ color: scoreColor(r.ats_score) }}>
                  {r.ats_score}
                </span>
                <button onClick={(e) => handleDelete(r.id, e)} className="p-2 rounded-lg hover:bg-black/5">
                  <LuTrash2 size={16} style={{ color: 'var(--color-ink-muted)' }} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
