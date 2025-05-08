import { useCallback } from 'react'
import { Pokemon } from '../store/pokemonStore'
import { findStage } from '../utils/evolution'

const CHANCE = [0.9, 0.5, 0.3]

const getStage = async (pokemon: Pokemon): Promise<0 | 1 | 2> => {
  try {
    const species = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`
    ).then(r => r.json())

    const evoUrl: string | undefined = species?.evolution_chain?.url
    if (!evoUrl) return 0

    const chain = await fetch(evoUrl).then(r => r.json())
    const st = findStage(chain.chain, pokemon.name.toLowerCase())
    return (st ?? 0) as 0 | 1 | 2
  } catch {
    return 0
  }
}

export function useCatchPokemon() {
  const attemptCatch = useCallback(async (pokemon: Pokemon) => {
    await new Promise(r => setTimeout(r, 1400))
    const stage = await getStage(pokemon)
    const success = Math.random() < CHANCE[stage]
    return { success, stage }
  }, [])

  return { attemptCatch }
}
