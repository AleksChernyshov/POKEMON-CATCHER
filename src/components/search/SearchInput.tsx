import React, {
  KeyboardEvent,
  ChangeEvent,
  useRef,
  useEffect,
  useState,
} from "react";
import { Howl } from "howler";
import { useCaughtSet } from "../../store/selectors";
import { SuggestionCard } from "./SuggestionCard";
import { SearchAnimation } from "./SearchAnimation";

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
  const caughtSet = useCaughtSet();

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
        <SearchAnimation
          isFocused={isFocused}
          ballX={ballX}
          enableT={enableT}
          duration={duration}
          onTransitionEnd={handleTransitionEnd}
        />

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
                  pokemon={p}
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
