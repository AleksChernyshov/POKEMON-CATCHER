import React, { useState, KeyboardEvent, ChangeEvent, useEffect, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GET_POKEMON_LIST } from '../graphql/queries'
import { SearchInput, Suggestion } from '../components/SearchInput'
import { CatchModal } from '../components/CatchModal'
import { usePokemonStore } from '../store/pokemonStore'
import { PokedexViewer } from '../components/PokedexViewer'
import pikaGif from '../assets/pika.gif';

interface PokemonListData {
  pokemons: { results: Suggestion[] }
}
interface PokemonListVars {
  limit: number
  offset: number
}

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selected, setSelected] = useState<Suggestion | null>(null)

  const { data: listData, loading: listLoading } = useQuery<
    PokemonListData,
    PokemonListVars
  >(GET_POKEMON_LIST, { variables: { limit: 251, offset: 0 } })

  const addPokemon = usePokemonStore(s => s.addPokemon)

  const lower = searchTerm.trim().toLowerCase()
  const suggestions =
    listData?.pokemons.results.filter(
      p => p.name.toLowerCase().includes(lower) && p.name.toLowerCase() !== lower
    ) ?? []

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowSuggestions(true)
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && lower) setShowSuggestions(false)
  }
  const handleSelect = (p: Suggestion) => {
    setSelected(p)
    setShowSuggestions(false)
    setSearchTerm('')
  }

  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setShowSuggestions(false)
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  return (
    <div className="flex h-full items-start justify-center pt-20 px-4">
      <div ref={containerRef} className="container mx-auto text-center max-w-3xl">
        <h1 className="text-5xl font-bold text-accent-yellow mb-12">Pokémon Catcher</h1>

        <div className="mx-auto max-w-md">
          <SearchInput
            searchTerm={searchTerm}
            isFocused={isFocused}
            showSuggestions={showSuggestions}
            listLoading={listLoading}
            suggestions={suggestions}
            loading={false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onSelect={name => {
              const picked = suggestions.find(p => p.name === name)
              if (picked) handleSelect(picked)
            }}
          />
        </div>

        {selected && (
          <CatchModal
            name={selected.name}
            onClose={() => setSelected(null)}
            onCaught={addPokemon}
          />
        )}

        <img
          src={pikaGif}
          alt="Pikachu"
          className="absolute bottom-0 left-0 w-[200px]"
        />

        <PokedexViewer />
      </div>
    </div>
  )
}

export default Home
