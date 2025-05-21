import React, { useEffect, useState } from "react";
import { Pokemon } from "../../store/pokemonStore";
import {
  useCaughtPokemon,
  useAddPokemon,
  useRemoveThree,
  useSetEvolutionTarget,
  usePokemonList,
} from "../../store/selectors";
import { EvolutionCard } from "./EvolutionCard";

// Assets imports
import pokeball from "../../assets/pokeball.png";

// Types and interfaces
interface Props {
  name: string;
  onCatch: (name: string) => void;
}

export const EvolutionModal: React.FC<Props> = ({ name, onCatch }) => {
  // Store connections
  const caught = useCaughtPokemon();
  const addPokemon = useAddPokemon();
  const removeThree = useRemoveThree();
  const setEvolutionTarget = useSetEvolutionTarget();
  const pokemonList = usePokemonList();

  // State management
  const [loading, setLoading] = useState(true);

  // Pokemon data
  const currentPokemon = pokemonList.find((p) => p.name === name);
  const evolutionChain = currentPokemon?.evolutionChain || [];

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Evolution handler
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
      {/* Modal header */}
      <h2 className="mb-6 text-center text-2xl text-accent-yellow/80 uppercase tracking-wide drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
        Evolution Chain
      </h2>

      {/* Loading state */}
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
          {/* Evolution chain */}
          {evolutionChain.map((p, i) => {
            const isCaught = caught.some((c) => c.name === p.name);
            const pokemonCount = caught.find((c) => c.id === p.id)?.count || 0;
            const nextPokemon = evolutionChain[i + 1];
            const canEvolve = Boolean(pokemonCount >= 3 && nextPokemon);

            return (
              <React.Fragment key={p.name}>
                <EvolutionCard
                  pokemon={p}
                  isCaught={isCaught}
                  pokemonCount={pokemonCount}
                  canEvolve={canEvolve}
                  nextPokemonId={nextPokemon?.id || null}
                  onCatch={onCatch}
                  onEvolve={handleEvolution}
                />

                {/* Evolution arrow */}
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
