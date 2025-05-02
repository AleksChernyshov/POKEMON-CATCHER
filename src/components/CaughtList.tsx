import React from 'react'
import { usePokemonStore, CaughtEntry } from '../store/pokemonStore'

export const CaughtList: React.FC = () => {
  const caught    = usePokemonStore(s => s.caught)
  const removeOne = usePokemonStore(s => s.removeOne)

  if (!caught.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
      {caught.map((p: CaughtEntry) => (
        <div
          key={p.id}
          className="relative w-full max-w-[300px] p-5 border-2 border-accent-yellow rounded-lg bg-bg-secondary"
        >
          {p.count > 1 && (
            <span className="absolute top-[10px] left-2 rounded-full bg-accent-yellow px-2 pt-[4px] pb-[2px] text-xs font-bold text-black shadow">
              ×{p.count}
            </span>
          )}

          <button
            onClick={() => removeOne(p.id)}
            aria-label="Remove one"
            className="absolute top-2 right-2 flex h-7 w-7 items-start justify-center rounded-full text-xl text-red-600 transition hover:bg-red-600 hover:text-white pt-[2px]"
          >
            ×
          </button>

          <img
            src={p.sprites.front_default}
            alt={p.name}
            className="mx-auto mb-3 h-24 w-24 object-contain"
          />

          <div className="text-center font-bold text-text-default whitespace-nowrap">
            {p.name}
            <span className="ml-1 text-sm text-accent-yellow">
              (Stage&nbsp;{p.stage + 1})
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
