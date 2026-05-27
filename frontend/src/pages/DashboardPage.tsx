import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/api'
import { useUser } from '../context/UserContext'
import StickerInput from '../components/StickerInput'

export default function DashboardPage() {
  const { user, setUser } = useUser()
  const navigate = useNavigate()
  const [doubles, setDoubles] = useState<number[]>(user?.doubles ?? [])
  const [needed, setNeeded] = useState<number[]>(user?.needed ?? [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    api.getUser(user.id).then(u => {
      setDoubles(u.doubles)
      setNeeded(u.needed)
      setUser(u)
    })
  }, [])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const updated = await api.updateStickers(user.id, { doubles, needed })
      setUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Speichern fehlgeschlagen.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tsv-blue">Meine Sticker</h1>
          <p className="text-gray-500 text-sm mt-0.5">Trage ein, was du tauschen kannst</p>
        </div>
        <button
          onClick={() => navigate('/matches')}
          className="bg-tsv-gold text-tsv-blue font-semibold px-4 py-2 rounded-lg hover:brightness-95 transition text-sm"
        >
          Matches anzeigen →
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-tsv-blue" />
            <h2 className="font-bold text-gray-800">Doppelte Sticker</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Diese Sticker hast du doppelt und kannst sie tauschen.</p>
          <StickerInput
            label="Doppelte hinzufügen"
            color="blue"
            values={doubles}
            onChange={setDoubles}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h2 className="font-bold text-gray-800">Fehlende Sticker</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Diese Sticker fehlen dir noch fürs Album.</p>
          <StickerInput
            label="Fehlende hinzufügen"
            color="green"
            values={needed}
            onChange={setNeeded}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-tsv-blue hover:bg-tsv-light text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-60"
        >
          {saving ? 'Wird gespeichert…' : 'Speichern'}
        </button>
        {saved && (
          <span className="text-emerald-600 text-sm font-medium animate-fade-in">
            ✓ Gespeichert!
          </span>
        )}
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>

      <div className="bg-tsv-blue/5 border border-tsv-blue/10 rounded-xl p-4 text-sm text-gray-600">
        <strong className="text-tsv-blue">Tipp:</strong> Du kannst mehrere Nummern auf einmal eingeben – trenne sie
        durch Leerzeichen oder Kommas (z.B. <code className="bg-white px-1 rounded">12 45 78</code> oder{' '}
        <code className="bg-white px-1 rounded">12,45,78</code>).
      </div>
    </div>
  )
}
