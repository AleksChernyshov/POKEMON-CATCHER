import { useCallback } from 'react'
import { Pokemon } from '../store/pokemonStore'
import { usePokemonListStore } from '../store/pokemonListStore'

const CATCH_CHANCES = [0.9, 0.5, 0.3] as const
const CATCH_ANIMATION_MS = 1400

export function useCatchPokemon() {
  const pokemons = usePokemonListStore(state => state.pokemons)

  const attemptCatch = useCallback(async (pokemon: Pokemon) => {
    try {
      await new Promise(r => setTimeout(r, CATCH_ANIMATION_MS));

      const pokemonFromStore = pokemons.find(p => p.id === pokemon.id)
      const stage = pokemonFromStore?.stage ?? 0
      const success = Math.random() < CATCH_CHANCES[stage]
      
      return { success, stage }
    } catch (error) {
      console.error('Failed to attempt catch:', error)
      return { success: false, stage: 0 }
    }
  }, [pokemons])

  return { attemptCatch }
}
