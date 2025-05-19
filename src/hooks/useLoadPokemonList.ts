import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_POKEMON_LIST } from '../graphql/queries'
import { usePokemonListStore, PokemonListItem } from '../store/pokemonListStore'
import { useLoadPokemonDetails } from './useLoadPokemonDetails'

export const useLoadPokemonList = () => {
  const { setPokemons, setLoading, setError, setFullyLoaded } = usePokemonListStore()
  const { loadPokemonDetails } = useLoadPokemonDetails()

  const { loading, error, data } = useQuery(GET_POKEMON_LIST, {
    variables: { limit: 251, offset: 0 },
    fetchPolicy: 'cache-and-network'
  })

  useEffect(() => {
    setLoading(true)
  }, [setLoading])

  // Handle errors
  useEffect(() => {
    if (error) {
      setError(error.message)
      setFullyLoaded(true)
    } else {
      setError(null)
    }
  }, [error, setError, setFullyLoaded])

  useEffect(() => {
    let isMounted = true

    const loadAllData = async () => {
      try {
        if (!data?.pokemons?.results) return

        const pokemons: PokemonListItem[] = data.pokemons.results.map((pokemon: { id: number; name: string; image: string }) => ({
          ...pokemon,
          isLoaded: false
        }))

        if (!isMounted) return
        setPokemons(pokemons)

        const total = pokemons.length
        let loaded = 0

        const promises = pokemons.map(async (pokemon) => {
          await loadPokemonDetails(pokemon)
          if (isMounted) {
            loaded++
            const progress = Math.min(90, Math.round((loaded / total) * 90))
            window.dispatchEvent(new CustomEvent('pokemon-loading-progress', { detail: progress }))
          }
        })

        await Promise.all(promises)

        if (!isMounted) return
        window.dispatchEvent(new CustomEvent('pokemon-loading-progress', { detail: 100 }))
        setFullyLoaded(true)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load all pokemon details:', error)
        if (isMounted) {
          setFullyLoaded(true)
          setLoading(false)
        }
      }
    }

    loadAllData()

    return () => {
      isMounted = false
    }
  }, [data, setPokemons, loadPokemonDetails, setFullyLoaded, setLoading])

  return { loading, error, data }
} 