import React from "react";
import { useCaughtPokemon, useRemoveOne } from "../../store/selectors";
import { PokemonCard } from "./PokemonCard";

export const CaughtList: React.FC = () => {
  // Store connections
  const caught = useCaughtPokemon();
  const removeOne = useRemoveOne();

  // Early return if no caught pokemon
  if (!caught.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-4">
      {caught.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onRemove={() => removeOne(pokemon.id)}
        />
      ))}
    </div>
  );
};
