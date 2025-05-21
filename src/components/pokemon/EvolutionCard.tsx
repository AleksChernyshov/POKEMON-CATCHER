import React from "react";
import { Howl } from "howler";

// Sound effects initialization
const evoSound = new Howl({
  src: ["/POKEMON-CATCHER/assets/evo.mp3"],
  volume: 0.4,
});

interface EvolutionCardProps {
  pokemon: {
    id: number;
    name: string;
    sprite: string;
  };
  isCaught: boolean;
  pokemonCount: number;
  canEvolve: boolean;
  nextPokemonId: number | null;
  onCatch: (name: string) => void;
  onEvolve: (fromId: number, toId: number) => void;
}

export const EvolutionCard: React.FC<EvolutionCardProps> = ({
  pokemon,
  isCaught,
  pokemonCount,
  canEvolve,
  nextPokemonId,
  onCatch,
  onEvolve,
}) => {
  return (
    <div
      className={[
        "flex flex-col items-center gap-2 font-bold transition-all duration-300 group",
        isCaught
          ? "text-accent-yellow/80 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
          : "text-accent-yellow/40 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)] hover:text-accent-yellow/80 hover:drop-shadow-[0_0_6px_rgba(251,191,36,0.8)] cursor-pointer",
      ].join(" ")}
    >
      <div className="relative">
        {/* Pokemon image */}
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className={[
            "h-24 w-24 object-contain transition-opacity duration-300",
            isCaught ? "" : "opacity-40 group-hover:opacity-100",
          ].join(" ")}
        />

        {/* Evolution button */}
        {canEvolve && nextPokemonId && (
          <button
            onClick={() => {
              onEvolve(pokemon.id, nextPokemonId);
              evoSound.play();
            }}
            className="absolute inset-0 flex items-center justify-center bg-cyan-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
          >
            <span className="text-accent-yellow text-lg font-bold">Evolve</span>
          </button>
        )}

        {/* Count badge */}
        {isCaught && (
          <span
            className="absolute -top-2 -left-2 rounded-full bg-accent-yellow/80 px-2 pt-[8px] pb-[2px]
                     text-sm font-bold text-black shadow-lg rotate-[-8deg] 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            ×{pokemonCount}
          </span>
        )}

        {/* Catch button */}
        <button
          onClick={() => onCatch(pokemon.name)}
          className="absolute -top-2 -right-4 rounded-full bg-accent-yellow/80 px-2 pt-[8px] pb-[2px]
                   text-sm font-bold text-black shadow-lg rotate-[8deg]
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   hover:bg-accent-yellow"
        >
          Catch
        </button>
      </div>

      {/* Pokemon name */}
      <span className={isCaught ? "" : "group-hover:text-accent-yellow/80"}>
        {pokemon.name}
      </span>
    </div>
  );
};
