import { useCallback } from 'react'
import { useApolloClient } from '@apollo/client'
import { GET_POKEMON_BY_NAME } from '../graphql/queries'
import { usePokemonListStore, PokemonListItem } from '../store/pokemonListStore'
import { findStage } from '../utils/evolution'

const CATCH_CHANCES = [0.9, 0.5, 0.3] as const

export const useLoadPokemonDetails = () => {
  const client = useApolloClient()
  const updatePokemon = usePokemonListStore(state => state.updatePokemon)

  const loadPokemonDetails = useCallback(async (pokemon: PokemonListItem): Promise<void> => {
    if (pokemon.isLoaded) return

    try {
      // Get basic pokemon data
      const { data } = await client.query({
        query: GET_POKEMON_BY_NAME,
        variables: { name: pokemon.name.toLowerCase() },
        fetchPolicy: 'network-only',
      })

      if (!data?.pokemon) {
        throw new Error(`Pokemon ${pokemon.name} not found`)
      }

      const speciesUrl = data.pokemon.species?.url
      if (!speciesUrl) {
        updatePokemon(pokemon.id, {
          ...data.pokemon,
          stage: 0,
          catchChance: CATCH_CHANCES[0],
          isLoaded: true
        })
        return
      }

      // Get species data to find evolution chain
      const speciesResponse = await fetch(speciesUrl)
      if (!speciesResponse.ok) {
        throw new Error(`Failed to fetch species data for ${pokemon.name}`)
      }
      const speciesData = await speciesResponse.json()
      const evoUrl = speciesData?.evolution_chain?.url
      
      if (!evoUrl) {
        updatePokemon(pokemon.id, {
          ...data.pokemon,
          stage: 0,
          catchChance: CATCH_CHANCES[0],
          isLoaded: true
        })
        return
      }

      // Get evolution chain
      const evoResponse = await fetch(evoUrl)
      if (!evoResponse.ok) {
        throw new Error(`Failed to fetch evolution data for ${pokemon.name}`)
      }
      const evoData = await evoResponse.json()

      // Process evolution chain
      const evolutionChain: PokemonListItem['evolutionChain'] = []
      let node = evoData.chain
      
      while (node) {
        const { name, url } = node.species
        const id = parseInt(url.match(/\/(\d+)\/$/)?.[1] || '0')
        evolutionChain.push({
          id,
          name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        })
        node = node.evolves_to?.[0]
      }

      // Find stage
      const stage = findStage(evoData.chain, pokemon.name.toLowerCase()) || 0
      const catchChance = CATCH_CHANCES[stage]

      // Update pokemon with all data
      updatePokemon(pokemon.id, {
        ...data.pokemon,
        evolutionChain,
        stage,
        catchChance,
        isLoaded: true
      })
    } catch (error) {
      console.error('Failed to load pokemon details:', error)
      updatePokemon(pokemon.id, {
        ...pokemon,
        isLoaded: true,
        stage: 0,
        catchChance: CATCH_CHANCES[0]
      })
    }
  }, [client, updatePokemon])

  return { loadPokemonDetails }
} 