// src/hooks/useCatchPokemon.ts
import { useCallback } from 'react'
import { Pokemon } from '../store/pokemonStore'

const CHANCE = [0.9, 0.5, 0.3]

const stageFromId = (id: number): 0 | 1 | 2 => {
  const mod = (id - 1) % 3
  return (mod === 0 ? 0 : mod === 1 ? 1 : 2) as 0 | 1 | 2
}

export function useCatchPokemon() {
  const attemptCatch = useCallback(async (pokemon: Pokemon) => {
    await new Promise((r) => setTimeout(r, 1400))
    const stage = stageFromId(pokemon.id)
    const success = Math.random() < CHANCE[stage]
    return { success, stage }
  }, [])

  return { attemptCatch }
}
