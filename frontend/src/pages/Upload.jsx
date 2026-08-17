import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { LuUpload, LuFile, LuX } from 'react-icons/lu';
import client from '../api/client';
import Layout from '../components/Layout';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');
    if (rejectedFiles.length > 0) {
      setError('Only PDF and DOCX files under 5MB are supported.');
      return;
    }
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await client.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/resumes/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl mb-2">Upload Resume</h1>
      <p className="mb-8" style={{ color: 'var(--color-ink-muted)' }}>
        We'll parse it, score it against ATS standards, and extract your key details.
      </p>

      <div
        {...getRootProps()}
        className="rounded-2xl border-2 border-dashed p-14 text-center cursor-pointer transition-colors"
        style={{
          borderColor: isDragActive ? 'var(--color-signal)' : 'var(--color-border)',
          background: isDragActive ? 'var(--color-signal-dim)' : 'var(--color-paper-raised)',
        }}
      >
        <input {...getInputProps()} />
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-signal-dim)' }}>
          <LuUpload size={24} style={{ color: 'var(--color-signal)' }} />
        </div>
        <p className="font-medium mb-1">
          {isDragActive ? 'Drop your resume here' : 'Drag and drop your resume, or click to browse'}
        </p>
        <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>PDF or DOCX, up to 5MB</p>
      </div>

      {file && (
        <div className="mt-5 rounded-xl border p-4 flex items-center justify-between" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
          <div className="flex items-center gap-3">
            <LuFile size={20} style={{ color: 'var(--color-signal)' }} />
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          <button onClick={() => setFile(null)} className="p-1.5 rounded-lg hover:bg-black/5">
            <LuX size={18} />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--color-ember-dim)', color: 'var(--color-ember)' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-6 px-6 py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
        style={{ background: 'var(--color-signal)' }}
      >
        {uploading ? 'Analyzing resume…' : 'Analyze resume'}
      </button>
    </Layout>
  );
}
