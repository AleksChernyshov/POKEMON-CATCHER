// src/store/pokemonStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Pokemon {
  id: number
  name: string
  sprites: { front_default: string }
  species: { url: string }                    // ← добавлено
}

export interface CaughtEntry extends Pokemon {
  count: number
  stage: number
}

interface PokemonStore {
  caught: CaughtEntry[]
  addPokemon: (p: Pokemon, stage: number) => void
  removeOne: (id: number) => void
  clearAll: () => void
}

export const usePokemonStore = create<PokemonStore>()(
  persist(
    (set) => ({
      caught: [],
      addPokemon: (p, stage) =>
        set((s) => {
          const ex = s.caught.find((c) => c.id === p.id)
          return ex
            ? {
                caught: s.caught.map((c) =>
                  c.id === p.id ? { ...c, count: c.count + 1 } : c
                ),
              }
            : { caught: [...s.caught, { ...p, count: 1, stage }] }
        }),
      removeOne: (id) =>
        set((s) => {
          const e = s.caught.find((c) => c.id === id)
          if (!e) return s
          if (e.count > 1)
            return {
              caught: s.caught.map((c) =>
                c.id === id ? { ...c, count: c.count - 1 } : c
              ),
            }
          return { caught: s.caught.filter((c) => c.id !== id) }
        }),
      clearAll: () => set({ caught: [] }),
    }),
    { name: 'pokemon-storage-v2' }
  )
)
