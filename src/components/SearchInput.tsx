import React, {
  KeyboardEvent,
  ChangeEvent,
  useRef,
  useEffect,
  useState,
} from "react";
import { usePokemonStore } from "../store/pokemonStore";
import { usePokemonListStore } from "../store/pokemonListStore";
import { Howl } from "howler";

// Assets imports
import pokeball from "../assets/pokeball.png";
import particles from "../assets/particles_bg.png";
import caughtBadge from "../assets/CAUGHT.png";

// Types and interfaces
export interface Suggestion {
  id: number;
  name: string;
  image: string;
}

interface SearchInputProps {
  searchTerm: string;
  isFocused: boolean;
  showSuggestions: boolean;
  listLoading: boolean;
  suggestions: Suggestion[];
  onFocus: () => void;
  onBlur: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (name: string) => void;
}

type Phase = "left" | "inside" | "right";

// Animation constants
const ENTRY_MS = 300;
const EXIT_MS = 400;
const LEFT_X = -70;
const INSIDE_X = 10;
const RIGHT_X = 600;

// Suggestion card component
const SuggestionCard: React.FC<{
  p: Suggestion;
  caught: boolean;
  onSelect: (n: string) => void;
}> = ({ p, caught, onSelect }) => {
  // Store connections
  const pokemon = usePokemonListStore((state) =>
    state.pokemons.find((pok) => pok.id === p.id)
  );

  // Pokemon data
  const catchChance = pokemon?.catchChance ?? 0.9;
  const chanceLabel = `${Math.round(catchChance * 100)}%`;

  return (
    <div
      onClick={() => onSelect(p.name)}
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
        src={p.image}
        alt={p.name}
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
        {p.name}
      </span>
    </div>
  );
};

export const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  isFocused,
  showSuggestions,
  listLoading,
  suggestions,
  onFocus,
  onBlur,
  onChange,
  onKeyDown,
  onSelect,
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const windSoundRef = useRef<Howl | null>(null);
  const selectWindSoundRef = useRef<Howl | null>(null);

  // State management
  const [phase, setPhase] = useState<Phase>("left");
  const [duration, setDuration] = useState(0);
  const [enableT, setEnableT] = useState(false);

  // Store connections
  const caught = usePokemonStore((s) => s.caught);
  const caughtSet = new Set(caught.map((c) => c.name.toLowerCase()));

  // Sound effects initialization
  useEffect(() => {
    windSoundRef.current = new Howl({
      src: ["/POKEMON-CATCHER/assets/wind.mp3"],
      loop: true,
      volume: 0.4,
    });

    selectWindSoundRef.current = new Howl({
      src: ["/POKEMON-CATCHER/assets/wind2.mp3"],
      volume: 0.4,
    });

    return () => {
      if (windSoundRef.current) {
        windSoundRef.current.stop();
      }
      if (selectWindSoundRef.current) {
        selectWindSoundRef.current.stop();
      }
    };
  }, []);

  // Focus effect
  useEffect(() => {
    if (isFocused) {
      setEnableT(false);
      setDuration(0);
      setPhase("left");
      requestAnimationFrame(() => {
        setDuration(ENTRY_MS);
        setEnableT(true);
        setPhase("inside");
      });
      if (windSoundRef.current) {
        windSoundRef.current.stop();
        windSoundRef.current.volume(0.4);
        windSoundRef.current.play();
      }
    } else {
      setDuration(EXIT_MS);
      setEnableT(true);
      setPhase("right");
      if (windSoundRef.current) {
        windSoundRef.current.stop();
      }
    }
  }, [isFocused]);

  // Event handlers
  const handleTransitionEnd = () => {
    if (phase === "right") {
      setEnableT(false);
      setDuration(0);
      setPhase("left");
    }
  };

  const handleSelect = (name: string) => {
    if (selectWindSoundRef.current) {
      selectWindSoundRef.current.play();
    }
    onSelect(name);
  };

  // Animation calculations
  const ballX =
    phase === "inside" ? INSIDE_X : phase === "right" ? RIGHT_X : LEFT_X;

  return (
    <div ref={containerRef} className="relative">
      {/* Search input container */}
      <div
        className={`relative overflow-hidden rounded-full transition-shadow duration-200 ${
          isFocused
            ? "shadow-[0_0_16px_rgba(251,191,36,0.9)]"
            : "shadow-[0_0_10px_rgba(251,191,36,0.5)]"
        }`}
      >
        {isFocused && (
          <svg
            viewBox="0 0 400 40"
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
            preserveAspectRatio="none"
          >
            <defs>
              <clipPath id="clipCapsule">
                <rect width="400" height="40" rx="20" ry="20" />
              </clipPath>
            </defs>
            <g clipPath="url(#clipCapsule)">
              <image href={particles} width="400" height="40">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 0"
                  to="-400 0"
                  dur="0.4s"
                  repeatCount="indefinite"
                />
              </image>
              <image href={particles} x="400" width="400" height="40">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 0"
                  to="-400 0"
                  dur="0.4s"
                  repeatCount="indefinite"
                />
              </image>
            </g>
          </svg>
        )}

        <div
          className="absolute top-1/2 pointer-events-none z-40"
          style={{
            transform: `translateY(-50%) translateX(${ballX}px)`,
            transition: enableT ? `transform ${duration}ms ease-out` : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <svg width="64" height="64" viewBox="0 0 64 64">
            <image href={pokeball} width="64" height="64">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 32 32"
                to="360 32 32"
                dur="0.3s"
                repeatCount="indefinite"
              />
            </image>
          </svg>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Who do you want to catch?"
          className={[
            "w-full pr-4 pt-4 pb-3 bg-bg-secondary text-text-default placeholder:text-gray-500",
            "rounded-full border-2 leading-none",
            isFocused ? "border-accent-orange" : "border-accent-yellow",
            "focus:outline-none transition-all duration-300 ease-out",
            isFocused ? "pl-20" : "pl-4",
            "relative z-20",
          ].join(" ")}
        />
      </div>

      {/* Suggestions container */}
      {searchTerm.trim() !== "" &&
        showSuggestions &&
        !listLoading &&
        suggestions.length > 0 && (
          <div
            className={[
              "absolute inset-x-1 top-full mt-2 overflow-auto bg-bg-secondary rounded-2xl p-2",
              "shadow-[0_0_10px_rgba(251,191,36,0.5)] border-2 z-[60]",
              isFocused ? "border-accent-orange" : "border-accent-yellow",
              "max-h-[600px] scrollbar-thin",
            ].join(" ")}
          >
            <div className="grid grid-cols-2 gap-3">
              {suggestions.map((p) => (
                <SuggestionCard
                  key={p.id}
                  p={p}
                  caught={caughtSet.has(p.name.toLowerCase())}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        )}

      {/* No results message */}
      {searchTerm.trim() !== "" &&
        showSuggestions &&
        !listLoading &&
        suggestions.length === 0 && (
          <div className="absolute inset-x-1 top-full mt-2 border-2 border-red-600 text-red-600 bg-bg-secondary rounded-lg p-2 z-[60]">
            No pokémon found
          </div>
        )}
    </div>
  );
};
