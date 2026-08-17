import { NavLink, useNavigate } from 'react-router-dom';
import { LuLayoutDashboard, LuUpload, LuFileText, LuTarget, LuHistory, LuLogOut } from 'react-icons/lu';
import useAuthStore from '../store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
  { to: '/upload', label: 'Upload Resume', icon: LuUpload },
  { to: '/resumes', label: 'My Resumes', icon: LuFileText },
  { to: '/job-match', label: 'Job Match', icon: LuTarget },
  { to: '/history', label: 'Match History', icon: LuHistory },
];

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-paper)' }}>
      <aside className="w-64 shrink-0 border-r flex flex-col" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper-raised)' }}>
        <div className="px-6 py-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-signal)' }}>
            <span className="text-white font-display font-bold text-sm">R</span>
          </div>
          <span className="font-display font-semibold text-lg">Resumatic</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'hover:bg-black/5'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'var(--color-signal)' : 'transparent',
                color: isActive ? 'white' : 'var(--color-ink)',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs truncate" style={{ color: 'var(--color-ink-muted)' }}>{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors"
            style={{ color: 'var(--color-ember)' }}
          >
            <LuLogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
