import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function Layout() {
  const { user, setUser } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    setUser(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-tsv-blue text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tsv-gold rounded-full flex items-center justify-center font-bold text-tsv-blue text-sm">
              TSV
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">Sticker-Tauschbörse</div>
              <div className="text-xs text-blue-200">TSV Oberpframmern</div>
            </div>
          </Link>

          {user && (
            <nav className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className={`text-sm px-3 py-1.5 rounded transition ${
                  location.pathname === '/dashboard'
                    ? 'bg-tsv-gold text-tsv-blue font-semibold'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Meine Sticker
              </Link>
              <Link
                to="/matches"
                className={`text-sm px-3 py-1.5 rounded transition ${
                  location.pathname === '/matches'
                    ? 'bg-tsv-gold text-tsv-blue font-semibold'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Matches
              </Link>
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-blue-400">
                <span className="text-sm text-blue-200">Hi, <strong className="text-white">{user.nickname}</strong></span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-blue-300 hover:text-white transition"
                >
                  Abmelden
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-tsv-blue text-blue-300 text-center text-xs py-3">
        TSV Oberpframmern · Sticker-Tauschbörse
      </footer>
    </div>
  )
}
