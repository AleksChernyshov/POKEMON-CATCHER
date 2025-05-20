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
  evolutionTargetId: number | null
  evolvedPokemonId: number | null
  addPokemon: (p: Pokemon, stage: number) => void
  removeOne: (id: number) => void
  removeThree: (id: number, evolvedPokemonId?: number) => void
  clearAll: () => void
  setEvolutionTarget: (id: number | null) => void
}

export const usePokemonStore = create<PokemonStore>()(
  persist(
    set => ({
      caught: [],
      lastCaughtId: null,
      evolutionTargetId: null,
      evolvedPokemonId: null,

      setEvolutionTarget: (id) => set({ evolutionTargetId: id }),

      addPokemon: (p, stage) =>
        set(s => {
          const ex = s.caught.find(c => c.id === p.id)
          if (ex) {
            const updated: CaughtEntry = { ...ex, count: ex.count + 1 }
            return {
              ...s,
              caught: s.caught.map(c => c.id === p.id ? updated : c),
              lastCaughtId: updated.id,
              evolvedPokemonId: null
            }
          }
          const newPokemon = { ...p, count: 1, stage }
          return {
            ...s,
            caught: [...s.caught, newPokemon],
            lastCaughtId: newPokemon.id,
            evolvedPokemonId: null
          }
        }),

      removeThree: (id, evolvedPokemonId) =>
        set(s => {
          const ex = s.caught.find(c => c.id === id)
          if (!ex || ex.count < 3) return s
          const newCount = ex.count - 3
          if (newCount <= 0) {
            const newCaught = s.caught.filter(c => c.id !== id)
            return {
              ...s,
              caught: newCaught,
              lastCaughtId: s.lastCaughtId,
              evolutionTargetId: null,
              evolvedPokemonId: evolvedPokemonId || null
            }
          }
          return {
            ...s,
            caught: s.caught.map(c =>
              c.id === id ? { ...c, count: newCount } : c
            ),
            lastCaughtId: s.lastCaughtId,
            evolutionTargetId: null,
            evolvedPokemonId: evolvedPokemonId || null
          }
        }),

      removeOne: id =>
        set(s => {
          const ex = s.caught.find(c => c.id === id)
          if (!ex) return s
          if (ex.count > 1)
            return {
              ...s,
              caught: s.caught.map(c =>
                c.id === id ? { ...c, count: c.count - 1 } : c
              ),
              lastCaughtId: s.lastCaughtId,
              evolvedPokemonId: null
            }
          // If this is the last copy, remove it and find next pokemon
          const newCaught = s.caught.filter(c => c.id !== id)
          const currentIndex = s.caught.findIndex(c => c.id === id)
          const nextPokemon = currentIndex + 1 < s.caught.length 
            ? s.caught[currentIndex + 1] 
            : s.caught[0]
          return {
            ...s,
            caught: newCaught,
            lastCaughtId: nextPokemon.id,
            evolvedPokemonId: null
          }
        }),

      clearAll: () => set({ 
        caught: [], 
        lastCaughtId: null, 
        evolutionTargetId: null,
        evolvedPokemonId: null 
      })
    }),
    { name: 'pokemon-storage-v2' }
  )
)
