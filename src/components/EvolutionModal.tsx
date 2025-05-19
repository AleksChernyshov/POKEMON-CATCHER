import React, { useEffect, useState } from "react";
import pokeball from "../assets/pokeball.png";
import { usePokemonStore, Pokemon } from "../store/pokemonStore";
import { usePokemonListStore } from "../store/pokemonListStore";
import { Howl } from "howler";

const evoSound = new Howl({
  src: ["/POKEMON-CATCHER/assets/evo.mp3"],
  volume: 0.4,
});

interface Props {
  name: string;
  onCatch: (name: string) => void;
}

export const EvolutionModal: React.FC<Props> = ({ name, onCatch }) => {
  const [loading, setLoading] = useState(true);
  const caught = usePokemonStore((s) => s.caught);
  const addPokemon = usePokemonStore((s) => s.addPokemon);
  const removeThree = usePokemonStore((s) => s.removeThree);
  const setEvolutionTarget = usePokemonStore((s) => s.setEvolutionTarget);

  const pokemonList = usePokemonListStore((s) => s.pokemons);
  const currentPokemon = pokemonList.find((p) => p.name === name);
  const evolutionChain = currentPokemon?.evolutionChain || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleEvolution = (fromId: number, toId: number) => {
    const toPokemon = pokemonList.find((p) => p.id === toId);
    if (toPokemon) {
      const pokemon: Pokemon = {
        id: toPokemon.id,
        name: toPokemon.name,
        sprites: toPokemon.sprites || { front_default: toPokemon.image },
        species: toPokemon.species || { url: "" },
      };
      setEvolutionTarget(toId);
      addPokemon(
        pokemon,
        evolutionChain.findIndex((p) => p.id === toId)
      );
      removeThree(fromId, toId);
      setEvolutionTarget(null);
    }
  };

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
      ) : evolutionChain.length === 0 ? (
        <p className="text-center text-text-default/90">No evolution data</p>
      ) : (
        <div className="flex items-center justify-center gap-4">
          {evolutionChain.map((p, i) => {
            const isCaught = caught.some((c) => c.name === p.name);
            const pokemonCount = caught.find((c) => c.id === p.id)?.count || 0;
            const nextPokemon = evolutionChain[i + 1];
            const canEvolve = pokemonCount >= 3 && nextPokemon;

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
                  <div className="relative">
                    <img
                      src={p.sprite}
                      alt={p.name}
                      className={[
                        "h-24 w-24 object-contain transition-opacity duration-300",
                        isCaught ? "" : "opacity-40 group-hover:opacity-100",
                      ].join(" ")}
                    />
                    {canEvolve && (
                      <button
                        onClick={() => {
                          handleEvolution(p.id, nextPokemon.id);
                          evoSound.play();
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-cyan-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                      >
                        <span className="text-accent-yellow text-lg font-bold">
                          Evolve
                        </span>
                      </button>
                    )}
                    {isCaught && (
                      <span
                        className="absolute -top-2 -left-2 rounded-full bg-accent-yellow/80 px-2 pt-[8px] pb-[2px]
                                 text-sm font-bold text-black shadow-lg rotate-[-8deg] 
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        ×{pokemonCount}
                      </span>
                    )}
                    <button
                      onClick={() => onCatch(p.name)}
                      className="absolute -top-2 -right-4 rounded-full bg-accent-yellow/80 px-2 pt-[8px] pb-[2px]
                               text-sm font-bold text-black shadow-lg rotate-[8deg]
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300
                               hover:bg-accent-yellow"
                    >
                      Catch
                    </button>
                  </div>
                  <span
                    className={
                      isCaught ? "" : "group-hover:text-accent-yellow/80"
                    }
                  >
                    {p.name}
                  </span>
                </div>
                {i < evolutionChain.length - 1 && (
                  <span className="text-3xl text-accent-yellow/80 drop-shadow-[0_0_10px_rgba(251,191,36,1)]">
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
