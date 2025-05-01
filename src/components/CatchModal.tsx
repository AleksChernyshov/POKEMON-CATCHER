// src/components/CatchModal.tsx
import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { GET_POKEMON_BY_NAME } from '../graphql/queries'
import { useCatchPokemon } from '../hooks/useCatchPokemon'
import { Pokemon } from '../store/pokemonStore'

import catch1 from '../assets/catching-1.gif'
import catch2 from '../assets/catching-2.gif'
import catch3 from '../assets/catching-3.gif'
import catch4 from '../assets/catching-4.gif'
import catch5 from '../assets/catching-5.png'

interface CatchModalProps {
  name: string
  onClose: () => void
  onCaught: (pokemon: Pokemon, stage: number) => void
}

const INITIAL_MS = 900
const POST_MS = 1100
const PRE_RES_MS = 3850

type Phase = 'initial' | 'pending' | 'post' | 'preResult' | 'result'

export const CatchModal: React.FC<CatchModalProps> = ({
  name,
  onClose,
  onCaught,
}) => {
  const client = useApolloClient()
  const { attemptCatch } = useCatchPokemon()

  const [phase, setPhase] = useState<Phase>('initial')
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [outcome, setOutcome] = useState<{ success: boolean; stage: number } | null>(null)
  const [showOutcome, setShowOutcome] = useState(false)

  useEffect(() => {
    let mounted = true
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

    const run = async () => {
      setPhase('initial')
      await sleep(INITIAL_MS)
      if (!mounted) return

      setPhase('pending')
      const { data } = await client.query<{ pokemon: Pokemon }>({
        query: GET_POKEMON_BY_NAME,
        variables: { name: name.toLowerCase() },
        fetchPolicy: 'network-only',
      })
      if (!mounted) return
      setPokemon(data.pokemon)

      const res = await attemptCatch(data.pokemon)
      if (!mounted) return
      setOutcome(res)

      setPhase('post')
      await sleep(POST_MS)
      if (!mounted) return

      setPhase('preResult')
      await sleep(PRE_RES_MS)
      if (!mounted) return

      setPhase('result')
      setShowOutcome(true)
    }

    run()
    return () => {
      mounted = false
    }
  }, [name, client, attemptCatch])

  const bg = {
    initial: catch1,
    pending: catch2,
    post: catch3,
    preResult: catch4,
    result: catch5,
  }[phase]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative">
        <img src={bg} alt="" className="w-80 h-80 object-cover rounded-xl" />

        {showOutcome && outcome && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            {outcome.success && pokemon && (
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-48 h-48 mb-4 animate-scale-up"
              />
            )}
            <button
              onClick={() => {
                if (outcome.success && pokemon) onCaught(pokemon, outcome.stage)
                onClose()
              }}
              className="mt-4 px-6 pt-3 pb-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition"
            >
              {outcome.success ? 'Gotcha!' : 'Oops, Pokémon ran away'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
