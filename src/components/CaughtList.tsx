import React from "react";
import { usePokemonStore, CaughtEntry } from "../store/pokemonStore";
import { Howl } from "howler";

export const CaughtList: React.FC = () => {
  // Store connections
  const caught = usePokemonStore((s) => s.caught);
  const removeOne = usePokemonStore((s) => s.removeOne);

  // Sound effects initialization
  const deleteSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/delete.mp3"],
  });

  // Early return if no caught pokemon
  if (!caught.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-4">
      {caught.map((p: CaughtEntry) => (
        <div
          key={p.id}
          className="group relative w-full max-w-[300px] rounded-2xl border-4 border-accent-yellow/60
                     bg-gradient-to-br from-bg-secondary via-bg-secondary/80 to-bg-secondary/60
                     shadow-[0_4px_12px_rgba(0,0,0,.35)] transition
                     hover:-translate-y-1 hover:shadow-[0_8px_18px_rgba(251,191,36,.35)]"
        >
          {/* Count badge */}
          {p.count > 1 && (
            <span
              className="absolute -top-3 -left-3 rounded-full bg-accent-yellow px-3 pt-[10px] pb-[4px]
                         text-sm font-bold text-black shadow-lg rotate-[-8deg]"
            >
              ×{p.count}
            </span>
          )}

          {/* Delete button */}
          <button
            onClick={() => {
              removeOne(p.id);
              deleteSound.play();
            }}
            aria-label="Remove one"
            className="absolute -top-3 -right-3 flex h-8 w-8 pt-1.5 items-center justify-center rounded-full
                       bg-red-600 text-xl text-white shadow-lg transition
                       hover:bg-red-600 hover:scale-110"
          >
            ×
          </button>

          {/* Pokemon card content */}
          <div className="flex flex-col items-center px-6 py-8">
            {/* Pokemon image */}
            <div className="relative mb-4 w-24 h-24">
              <img
                src={p.sprites.front_default}
                alt={p.name}
                className="absolute inset-0 h-full w-full object-contain
                           transition-transform duration-200 group-hover:scale-110"
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-full
                           bg-gradient-to-br from-white/25 to-transparent"
              />
            </div>

            {/* Pokemon name and stage */}
            <div className="text-center font-bold text-text-default">
              {p.name}
              <span className="block text-sm text-accent-yellow">
                Stage&nbsp;{p.stage + 1}
              </span>
            </div>
          </div>


          <span
            className="pointer-events-none absolute inset-0 rounded-2xl ring-0 
                       ring-accent-yellow/30 group-hover:ring-2 transition"
          />
        </div>
      ))}
    </div>
  );
};
