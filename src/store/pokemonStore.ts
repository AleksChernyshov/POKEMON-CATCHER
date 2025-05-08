import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Pokemon {
  id: number
  name: string
  sprites: { front_default: string }
  species: { url: string }
}

export interface CaughtEntry extends Pokemon {
  count: number
  stage: number
}

interface PokemonStore {
  caught: CaughtEntry[]
  lastCaughtId: number | null
  addPokemon: (p: Pokemon, stage: number) => void
  removeOne: (id: number) => void
  clearAll: () => void
}

export const usePokemonStore = create<PokemonStore>()(
  persist(
    set => ({
      caught: [],
      lastCaughtId: null,

      addPokemon: (p, stage) =>
        set(s => {
          const ex = s.caught.find(c => c.id === p.id)
          if (ex) {
            const updated: CaughtEntry = { ...ex, count: ex.count + 1 }
            return {
              caught: [...s.caught.filter(c => c.id !== p.id), updated],
              lastCaughtId: p.id
            }
          }
          return {
            caught: [...s.caught, { ...p, count: 1, stage }],
            lastCaughtId: p.id
          }
        }),

      removeOne: id =>
        set(s => {
          const ex = s.caught.find(c => c.id === id)
          if (!ex) return s
          if (ex.count > 1)
            return {
              caught: s.caught.map(c =>
                c.id === id ? { ...c, count: c.count - 1 } : c
              )
            }
          return { caught: s.caught.filter(c => c.id !== id) }
        }),

      clearAll: () => set({ caught: [], lastCaughtId: null })
    }),
    { name: 'pokemon-storage-v2' }
  )
)
