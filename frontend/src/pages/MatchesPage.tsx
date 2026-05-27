import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/api'
import { useUser } from '../context/UserContext'
import type { MatchResponse } from '../api/types'

export default function MatchesPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [matches, setMatches] = useState<MatchResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    api.getMatches(user.id)
      .then(setMatches)
      .catch(() => setError('Matches konnten nicht geladen werden.'))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return null

  const mutual = matches.filter(m => m.quality === 'MUTUAL')
  const oneSided = matches.filter(m => m.quality === 'ONE_SIDED')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tsv-blue">Tauschpartner</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {loading ? 'Suche…' : `${matches.length} Match${matches.length !== 1 ? 'es' : ''} gefunden`}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-tsv-blue hover:underline"
        >
          ← Meine Sticker bearbeiten
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-tsv-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium">Noch keine Matches gefunden.</p>
          <p className="text-sm mt-1">Trage mehr Sticker ein oder warte auf weitere Teilnehmer.</p>
        </div>
      )}

      {mutual.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-bold text-emerald-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            Gegenseitige Matches ({mutual.length})
          </h2>
          {mutual.map(m => <MatchCard key={m.partnerId} match={m} />)}
        </section>
      )}

      {oneSided.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-bold text-amber-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            Einseitige Matches ({oneSided.length})
          </h2>
          {oneSided.map(m => <MatchCard key={m.partnerId} match={m} />)}
        </section>
      )}
    </div>
  )
}

function MatchCard({ match }: { match: MatchResponse }) {
  const isMutual = match.quality === 'MUTUAL'

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-5 ${
      isMutual ? 'border-emerald-200' : 'border-amber-100'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isMutual ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {match.partnerNickname.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-800">{match.partnerNickname}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isMutual
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {isMutual ? '⇄ Gegenseitig' : '→ Einseitig'}
            </span>
          </div>
          <a
            href={`mailto:${match.partnerEmail}`}
            className="text-sm text-tsv-light hover:underline mt-1 block ml-10"
          >
            {match.partnerEmail}
          </a>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {match.iNeedFrom.length > 0 && (
          <div className="bg-emerald-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-emerald-700 mb-2">
              Du bekommst von {match.partnerNickname}:
            </p>
            <div className="flex flex-wrap gap-1">
              {match.iNeedFrom.map(n => (
                <span key={n} className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                  #{n}
                </span>
              ))}
            </div>
          </div>
        )}

        {match.iCanGive.length > 0 && (
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-tsv-blue mb-2">
              Du gibst an {match.partnerNickname}:
            </p>
            <div className="flex flex-wrap gap-1">
              {match.iCanGive.map(n => (
                <span key={n} className="bg-tsv-blue text-white text-xs px-2 py-0.5 rounded-full">
                  #{n}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
