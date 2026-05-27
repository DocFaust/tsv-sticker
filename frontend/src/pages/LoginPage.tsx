import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/api'
import { useUser } from '../context/UserContext'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { setUser } = useUser()
  const navigate = useNavigate()

  const switchMode = (m: Mode) => {
    setMode(m)
    setError(null)
    setPassword('')
    setPasswordConfirm('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (mode === 'register' && password !== passwordConfirm) {
      setError('Passwörter stimmen nicht überein.')
      return
    }
    if (mode === 'register' && password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }

    setLoading(true)
    try {
      const user = mode === 'register'
        ? await api.register({ nickname: nickname.trim(), email: email.trim(), password })
        : await api.login({ nickname: nickname.trim(), password })
      setUser(user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message

      if (status === 401) {
        setError('Nickname oder Passwort falsch.')
      } else if (status === 409) {
        setError(msg ?? 'Nickname oder E-Mail bereits vergeben.')
      } else {
        setError(msg ?? 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-tsv-blue rounded-full mb-4">
            <span className="text-2xl font-bold text-tsv-gold">TSV</span>
          </div>
          <h1 className="text-2xl font-bold text-tsv-blue">Sticker-Tauschbörse</h1>
          <p className="text-gray-500 mt-1">TSV Oberpframmern</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Tab-Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                mode === 'login'
                  ? 'bg-white text-tsv-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Anmelden
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                mode === 'register'
                  ? 'bg-white text-tsv-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Registrieren
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="z.B. MaxMustermann"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tsv-light focus:border-transparent transition"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-Mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="max@beispiel.de"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tsv-light focus:border-transparent transition"
                />
                <p className="text-xs text-gray-400 mt-1">Wird für Tauschkontakte angezeigt.</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Mindestens 6 Zeichen' : ''}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tsv-light focus:border-transparent transition"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Passwort bestätigen</label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tsv-light focus:border-transparent transition"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tsv-blue hover:bg-tsv-light text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading
                ? 'Einen Moment…'
                : mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
