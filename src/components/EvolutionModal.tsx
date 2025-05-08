import React, { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { GET_POKEMON_BY_NAME } from '../graphql/queries'
import evoLoading from '../assets/evo-loading.gif'

interface Props {
  name: string
}

export const EvolutionModal: React.FC<Props> = ({ name }) => {
  const client = useApolloClient()
  const [loading, setLoading] = useState(true)
  const [chain, setChain] = useState<{ sprite: string; name: string }[]>([])

  useEffect(() => {
    let mounted = true

    const spriteUrl = (id: string | number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

    const load = async () => {
      try {
        const p = await client.query({
          query: GET_POKEMON_BY_NAME,
          variables: { name },
          fetchPolicy: 'network-only'
        })

        const speciesUrl: string | undefined = p.data?.pokemon?.species?.url
        if (!speciesUrl) throw new Error('species url not found')

        const speciesRes = await fetch(speciesUrl).then(r => r.json())
        const evoUrl: string | undefined = speciesRes?.evolution_chain?.url
        if (!evoUrl) {
          if (mounted) {
            setChain([])
            setLoading(false)
          }
          return
        }

        const evoRes = await fetch(evoUrl).then(r => r.json())

        const list: { sprite: string; name: string }[] = []
        let node = evoRes.chain
        while (node) {
          const spName = node.species.name
          const spId = node.species.url.match(/\/(\d+)\/$/)?.[1]
          list.push({
            name: spName,
            sprite: spId ? spriteUrl(spId) : '',
          })
          node = node.evolves_to?.[0]
        }

        if (mounted) {
          setChain(list)
          setLoading(false)
        }
      } catch {
        if (mounted) {
          setChain([])
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [name, client])

  return (
    <div
      className={`relative mx-auto w-full max-w-md min-h-[240px] rounded-2xl p-6 overflow-auto ${
        loading ? '' : 'bg-bg-secondary'
      }`}
      style={loading ? { background: `url(${evoLoading}) center/cover no-repeat` } : {}}
    >
      <h2 className="mb-6 text-center text-2xl text-accent-yellow">Evolution Chain</h2>
      {!loading && chain.length === 0 && (
        <p className="text-center text-text-default">No evolution data</p>
      )}
      {!loading && chain.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          {chain.map((p, i) => (
            <React.Fragment key={p.name}>
              <div className="flex flex-col items-center gap-2 font-bold text-text-default">
                <img src={p.sprite} alt={p.name} className="h-24 w-24 object-contain" />
                {p.name}
              </div>
              {i < chain.length - 1 && <span className="text-3xl text-accent-yellow">→</span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
