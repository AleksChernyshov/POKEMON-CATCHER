import { useCallback, useRef } from 'react'
import { Pokemon } from '../store/pokemonStore'
import { findStage, EvoNode } from '../utils/evolution'

const CATCH_CHANCES = [0.9, 0.5, 0.3] as const
const CATCH_ANIMATION_MS = 1400

interface PokemonSpecies {
  evolution_chain: { url: string } | null
}

interface EvolutionChain {
  chain: EvoNode
}

const getStage = async (pokemon: Pokemon): Promise<0 | 1 | 2> => {
  try {
    const species = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`
    ).then<PokemonSpecies>(r => {
      if (!r.ok) throw new Error(`Failed to fetch species: ${r.status}`);
      return r.json();
    });

    const evoUrl = species?.evolution_chain?.url;
    if (!evoUrl) return 0;

    const chain = await fetch(evoUrl).then<EvolutionChain>(r => {
      if (!r.ok) throw new Error(`Failed to fetch evolution chain: ${r.status}`);
      return r.json();
    });

    const stage = findStage(chain.chain, pokemon.name.toLowerCase());
    return (stage ?? 0) as 0 | 1 | 2;
  } catch (error) {
    console.error('Failed to get Pokemon stage:', error);
    return 0;
  }
}

export function useCatchPokemon() {
  const stageCache = useRef<Map<number, 0 | 1 | 2>>(new Map());

  const attemptCatch = useCallback(async (pokemon: Pokemon) => {
    try {
      await new Promise(r => setTimeout(r, CATCH_ANIMATION_MS));

      let stage = stageCache.current.get(pokemon.id);
      if (stage === undefined) {
        stage = await getStage(pokemon);
        stageCache.current.set(pokemon.id, stage);
      }

      const success = Math.random() < CATCH_CHANCES[stage];
      return { success, stage };
    } catch (error) {
      console.error('Failed to attempt catch:', error);
      return { success: false, stage: 0 };
    }
  }, []);

  return { attemptCatch }
}
