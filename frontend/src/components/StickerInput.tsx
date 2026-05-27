import { useState, KeyboardEvent } from 'react'

interface Props {
  label: string
  color: 'blue' | 'green'
  values: number[]
  onChange: (values: number[]) => void
  maxSticker?: number
}

export default function StickerInput({ label, color, values, onChange, maxSticker = 250 }: Props) {
  const [input, setInput] = useState('')

  const colorClasses = {
    blue: {
      badge: 'bg-tsv-blue text-white',
      btn: 'bg-tsv-blue hover:bg-tsv-light text-white',
      ring: 'focus:ring-tsv-light',
    },
    green: {
      badge: 'bg-emerald-600 text-white',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      ring: 'focus:ring-emerald-500',
    },
  }[color]

  const parseNumbers = (raw: string): number[] => {
    return raw
      .split(/[\s,;]+/)
      .map(s => parseInt(s, 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= maxSticker)
  }

  const addNumbers = () => {
    const nums = parseNumbers(input)
    const merged = Array.from(new Set([...values, ...nums])).sort((a, b) => a - b)
    onChange(merged)
    setInput('')
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addNumbers()
    }
  }

  const remove = (n: number) => onChange(values.filter(v => v !== n))

  const clearAll = () => onChange([])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-gray-700">{label}</label>
        {values.length > 0 && (
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 transition">
            Alle löschen
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="z.B. 12 45 78 oder 12,45,78"
          className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ${colorClasses.ring} focus:border-transparent`}
        />
        <button
          type="button"
          onClick={addNumbers}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${colorClasses.btn}`}
        >
          Hinzufügen
        </button>
      </div>

      {values.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Noch keine Sticker eingetragen.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-100">
          {values.map(n => (
            <span
              key={n}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses.badge}`}
            >
              #{n}
              <button
                type="button"
                onClick={() => remove(n)}
                className="opacity-70 hover:opacity-100 leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">{values.length} Sticker eingetragen</p>
    </div>
  )
}
