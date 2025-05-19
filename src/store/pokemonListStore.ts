import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EvolutionChain {
  id: number
  name: string
  sprite: string
}

export interface PokemonListItem {
  id: number
  name: string
  image: string
  sprites?: { front_default: string }
  species?: { url: string }
  evolutionChain?: EvolutionChain[]
  stage?: number
  isLoaded?: boolean
  catchChance?: number
}

interface PokemonListStore {
  pokemons: PokemonListItem[]
  isLoading: boolean
  isFullyLoaded: boolean
  error: string | null
  setPokemons: (pokemons: PokemonListItem[]) => void
  setLoading: (isLoading: boolean) => void
  setFullyLoaded: (isFullyLoaded: boolean) => void
  setError: (error: string | null) => void
  updatePokemon: (id: number, data: Partial<PokemonListItem>) => void
}

export const usePokemonListStore = create<PokemonListStore>()(
  persist(
    (set) => ({
      pokemons: [],
      isLoading: false,
      isFullyLoaded: false,
      error: null,
      setPokemons: (pokemons) => set({ pokemons }),
      setLoading: (isLoading) => set({ isLoading }),
      setFullyLoaded: (isFullyLoaded) => set({ isFullyLoaded }),
      setError: (error) => set({ error }),
      updatePokemon: (id, data) => 
        set((state) => ({
          pokemons: state.pokemons.map(pokemon => 
            pokemon.id === id ? { ...pokemon, ...data } : pokemon
          )
        }))
    }),
    { name: 'pokemon-list-storage' }
  )
) 