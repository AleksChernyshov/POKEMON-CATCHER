import React from "react";
import { CaughtEntry } from "../../store/pokemonStore";

interface PokedexDisplayProps {
  pokemon: CaughtEntry | null;
}

export const PokedexDisplay: React.FC<PokedexDisplayProps> = ({ pokemon }) => {
  if (!pokemon) return null;

  return (
    <>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="absolute left-[68px] top-[150px] w-[152px] h-[124px] rounded object-contain"
      />
      <div className="absolute right-[63px] top-[150px] w-[153px] h-[66px] flex items-center justify-center text-lg font-bold text-accent-yellow/80">
        {pokemon.name}
      </div>
      <div className="absolute right-[162px] bottom-[107px] w-[57px] h-[40px] flex items-center justify-center text-white font-bold text-lg">
        ×{pokemon.count}
      </div>
      <div className="absolute right-[53px] bottom-[108px] w-[90px] h-[38px] flex items-center justify-center font-bold text-lg text-accent-yellow/80">
        Stage {pokemon.stage + 1}
      </div>
      <span className="pointer-events-none absolute left-[68px] top-[150px] w-[152px] h-[124px] rounded bg-gradient-to-br from-white/25 to-transparent" />
      <span className="pointer-events-none absolute right-[63px] top-[150px] w-[153px] h-[66px] rounded bg-gradient-to-br from-white/20 to-transparent" />
    </>
  );
};
