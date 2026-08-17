import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import ResumeList from './pages/ResumeList';
import ResumeDetail from './pages/ResumeDetail';
import JobMatch from './pages/JobMatch';
import MatchHistory from './pages/MatchHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/resumes" element={<ProtectedRoute><ResumeList /></ProtectedRoute>} />
        <Route path="/resumes/:id" element={<ProtectedRoute><ResumeDetail /></ProtectedRoute>} />
        <Route path="/job-match" element={<ProtectedRoute><JobMatch /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><MatchHistory /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
