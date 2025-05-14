import React, { useEffect, useState } from "react"
import { useApolloClient } from "@apollo/client"
import { GET_POKEMON_BY_NAME } from "../graphql/queries"
import pokeball from "../assets/pokeball.png"
import { usePokemonStore } from "../store/pokemonStore"

interface Props {
  name: string;
}

export const EvolutionModal: React.FC<Props> = ({ name }) => {
  const client = useApolloClient()
  const caught = usePokemonStore((s) => s.caught)
  const [loading, setLoading] = useState(true)
  const [chain, setChain] = useState<{ sprite: string; name: string }[]>([])

  useEffect(() => {
    let mounted = true
    const spriteUrl = (id: string | number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    (async () => {
      try {
        const { data } = await client.query({
          query: GET_POKEMON_BY_NAME,
          variables: { name },
          fetchPolicy: "network-only",
        })

        const speciesUrl: string | undefined = data?.pokemon?.species?.url
        if (!speciesUrl) throw new Error("species url not found")

        const species = await fetch(speciesUrl).then((r) => r.json())
        const evoUrl: string | undefined = species?.evolution_chain?.url
        if (!evoUrl) {
          if (mounted) {
            setChain([])
            setLoading(false)
          }
          return
        }

        const evoRes = await fetch(evoUrl).then((r) => r.json())

        const list: { sprite: string; name: string }[] = []
        let node = evoRes.chain
        while (node) {
          const { name: nm, url } = node.species
          const id = url.match(/\/(\d+)\/$/)?.[1]
          list.push({ name: nm, sprite: id ? spriteUrl(id) : "" })
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
    })()

    return () => {
      mounted = false
    }
  }, [name, client])

  return (
    <div
      className={[
        "relative mx-auto w-[448px] h-[240px] rounded-3xl p-6",
        "bg-cyan-600/60 backdrop-blur-[4px]",
        "border-2 border-cyan-100/10 ring-2 ring-cyan-200/15",
        "shadow-[0_0_60px_20px_rgba(34,211,238,0.8)]",
        loading ? "overflow-hidden" : "overflow-auto",
        "animate-scale-in-left",
      ].join(" ")}
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg  , rgba(34,211,238,0.03) 0 1px , transparent 2px 16px),
          repeating-linear-gradient(90deg , rgba(34,211,238,0.03) 0 1px , transparent 2px 16px)
        `,
      }}
    >
      <h2 className="mb-6 text-center text-2xl text-accent-yellow/80 uppercase tracking-wide drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
        Evolution Chain
      </h2>

      {loading ? (
        <div className="flex h-[140px] items-center justify-center">
          <svg width="96" height="96" viewBox="0 0 64 64">
            <image href={pokeball} width="64" height="64">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 32 32"
                to="360 32 32"
                dur="0.6s"
                repeatCount="indefinite"
              />
            </image>
          </svg>
        </div>
      ) : chain.length === 0 ? (
        <p className="text-center text-text-default/90">No evolution data</p>
      ) : (
        <div className="flex items-center justify-center gap-4">
          {chain.map((p, i) => {
            const isCaught = caught.some((c) => c.name === p.name)
            return (
              <React.Fragment key={p.name}>
                <div
                  className={[
                    "flex flex-col items-center gap-2 font-bold transition-all duration-300 group",
                    isCaught
                      ? "text-accent-yellow/80 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                      : "text-accent-yellow/40 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)] hover:text-accent-yellow/80 hover:drop-shadow-[0_0_6px_rgba(251,191,36,0.8)] cursor-pointer",
                  ].join(" ")}
                >
                  <img
                    src={p.sprite}
                    alt={p.name}
                    className={[
                      "h-24 w-24 object-contain transition-opacity duration-300",
                      isCaught ? "" : "opacity-40 group-hover:opacity-100",
                    ].join(" ")}
                  />
                  <span
                    className={
                      isCaught ? "" : "group-hover:text-accent-yellow/80"
                    }
                  >
                    {p.name}
                  </span>
                </div>
                {i < chain.length - 1 && (
                  <span className="text-3xl text-accent-yellow/80 drop-shadow-[0_0_10px_rgba(251,191,36,1)]">
                    →
                  </span>
                )}
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}
