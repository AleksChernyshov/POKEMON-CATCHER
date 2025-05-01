// src/components/CaughtList.tsx
import React from 'react'
import { usePokemonStore, CaughtEntry } from '../store/pokemonStore'

export const CaughtList: React.FC = () => {
  const caught = usePokemonStore((s) => s.caught)
  const removeOne = usePokemonStore((s) => s.removeOne)

  if (caught.length === 0) return null

  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      {caught.map((p: CaughtEntry) => (
        <div
          key={p.id}
          className="relative p-4 border-2 border-accent-yellow rounded-lg bg-bg-secondary"
        >
          {/* счётчик ×N — чуть опустили вниз */}
          {p.count > 1 && (
            <span className="absolute top-[6px] left-1 bg-accent-yellow text-black text-xs font-bold px-2 pt-[3px] pb-[1px] rounded-full shadow">
              ×{p.count}
            </span>
          )}

          {/* крестик для удаления */}
          <button
            aria-label="Remove one"
            onClick={() => removeOne(p.id)}
            className="absolute top-1 right-1 w-6 h-6 text-red-600 font-bold rounded-full hover:bg-red-600 hover:text-white transition
                       flex items-start justify-center pt-[2px]"
          >
            ×
          </button>

          <img
            src={p.sprites.front_default}
            alt={p.name}
            className="mx-auto mb-2 w-24 h-24"
          />
          <div className="text-text-default font-bold">
            {p.name}
            <span className="text-sm ml-1 text-accent-yellow">(Stage {p.stage + 1})</span>
          </div>
        </div>
      ))}
    </div>
  )
}
