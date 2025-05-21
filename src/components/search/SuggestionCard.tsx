import React from "react";
import { usePokemonList } from "../../store/selectors";
import caughtBadge from "../../assets/CAUGHT.png";
import type { Suggestion } from "./SearchInput";

interface SuggestionCardProps {
  pokemon: Suggestion;
  caught: boolean;
  onSelect: (name: string) => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  pokemon,
  caught,
  onSelect,
}) => {
  // Store connections
  const pokemons = usePokemonList();
  const pokemonData = pokemons.find((p) => p.id === pokemon.id);

  // Pokemon data
  const catchChance = pokemonData?.catchChance ?? 0.9;
  const chanceLabel = `${Math.round(catchChance * 100)}%`;

  return (
    <div
      onClick={() => onSelect(pokemon.name)}
      className="relative group cursor-pointer bg-bg-secondary rounded-lg p-2 flex flex-col items-center
                 border-2 border-transparent transition duration-200
                 hover:border-accent-orange hover:shadow-[0_0_10px_rgba(251,191,36,0.9)]"
    >
      {/* Catch chance badge */}
      <span className="absolute top-1 right-1 bg-accent-yellow text-black text-xs font-bold px-2 pb-1 pt-2 rounded-full">
        {chanceLabel}
      </span>

      {/* Pokemon image */}
      <img
        src={pokemon.image}
        alt={pokemon.name}
        loading="lazy"
        className={`relative z-10 w-32 h-32 object-contain mb-1 transition-transform duration-200
                    group-hover:scale-[130%]`}
      />

      {/* Caught badge overlay */}
      {caught && (
        <img
          src={caughtBadge}
          alt="caught"
          className="absolute inset-0 z-20 w-full h-full object-contain pointer-events-none px-4
                     opacity-90 transition-opacity duration-150 group-hover:opacity-0"
        />
      )}

      {/* Pokemon name */}
      <span className="text-text-default group-hover:text-accent-yellow transition-colors duration-150">
        {pokemon.name}
      </span>
    </div>
  );
};
