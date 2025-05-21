import React from "react";

interface PokedexHintProps {
  hint: string;
}

export const PokedexHint: React.FC<PokedexHintProps> = ({ hint }) => {
  return (
    <div className="pointer-events-none absolute left-[152px] -translate-x-1/2 bottom-[83px] text-center font-press-start text-[7px] text-accent-yellow uppercase">
      {hint}
    </div>
  );
};
