import React, { useEffect, useState, useRef } from 'react'
import { useApolloClient } from '@apollo/client'
import { GET_POKEMON_BY_NAME, GET_EVOLUTION_CHAIN } from '../graphql/queries'
import evoLoading from '../assets/evo-loading.gif'

interface Props {
  name: string
  onClose: () => void
}

export const EvolutionModal: React.FC<Props> = ({ name, onClose }) => {
  const client = useApolloClient()
  const [loading, setLoading] = useState(true)
  const [chain, setChain] = useState<{ sprite: string; name: string }[]>([])
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (wrapRef.current && e.target === wrapRef.current) onClose()
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [onClose])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const p = await client.query({
        query: GET_POKEMON_BY_NAME,
        variables: { name },
        fetchPolicy: 'network-only',
      })
      const speciesUrl: string = p.data.pokemon.species.url
      const evoId = speciesUrl.match(/\/(\d+)\/$/)?.[1]
      if (!evoId) return
      const evo = await client.query({
        query: GET_EVOLUTION_CHAIN,
        variables: { id: evoId },
        fetchPolicy: 'network-only',
      })
      const parsed = typeof evo.data.evolutionChain.response === 'string'
        ? JSON.parse(evo.data.evolutionChain.response)
        : evo.data.evolutionChain.response
      const names: string[] = []
      let n = parsed.chain
      while (n) {
        names.push(n.species.name)
        n = n.evolves_to?.[0]
      }
      const list: { sprite: string; name: string }[] = []
      for (const nm of names) {
        const r = await client.query({
          query: GET_POKEMON_BY_NAME,
          variables: { name: nm },
          fetchPolicy: 'network-only',
        })
        list.push({
          name: r.data.pokemon.name,
          sprite: r.data.pokemon.sprites.front_default,
        })
      }
      if (mounted) {
        setChain(list)
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [name, client])

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
    >
      <div
        className={`relative mx-auto w-full max-w-md min-h-[240px] rounded-2xl p-6 overflow-auto ${
          loading ? '' : 'bg-bg-secondary'
        }`}
        style={
          loading
            ? { background: `url(${evoLoading}) center/cover no-repeat` }
            : {}
        }
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 flex h-7 w-7 items-start justify-center rounded-full text-xl text-red-600 transition hover:bg-red-600 hover:text-white pt-[2px]"
        >
          ×
        </button>

        <h2 className="mb-6 text-center text-2xl text-accent-yellow">
          Evolution Chain
        </h2>

        {!loading && (
          <div className="flex items-center justify-center gap-4">
            {chain.map((p, i) => (
              <React.Fragment key={p.name}>
                <div className="flex flex-col items-center gap-2 font-bold text-text-default">
                  <img
                    src={p.sprite}
                    alt={p.name}
                    className="h-24 w-24 object-contain"
                  />
                  {p.name}
                </div>
                {i < chain.length - 1 && (
                  <span className="text-3xl text-accent-yellow">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
