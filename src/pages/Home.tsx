import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { SearchInput, Suggestion } from "../components/search/SearchInput";

import { usePokemonStore } from "../store/pokemonStore";
import { usePokemonListStore } from "../store/pokemonListStore";

// Assets imports
import pikaGif from "../assets/pika.gif";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { CatchModal } from "../components/pokemon/CatchModal";
import { PokedexViewer } from "../components/pokedex/PokedexViewer";

const Home: React.FC = () => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState<Suggestion | null>(null);

  // Store connections
  const {
    pokemons,
    isLoading: listLoading,
    isFullyLoaded,
  } = usePokemonListStore();
  const addPokemon = usePokemonStore((s) => s.addPokemon);

  // Filtered suggestions
  const suggestions = useMemo(() => {
    const lower = searchTerm?.trim()?.toLowerCase() || "";
    return pokemons
      .filter(
        (p) =>
          p?.name?.toLowerCase()?.includes(lower) &&
          p?.name?.toLowerCase() !== lower
      )
      .map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
      }));
  }, [pokemons, searchTerm]);

  // Event handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() !== "") {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      e.preventDefault();
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleSelect = (p: Suggestion) => {
    setSelected(p);
    setShowSuggestions(false);
    setIsFocused(false);
    setSearchTerm("");
  };

  // Click outside effect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        requestAnimationFrame(() => {
          setShowSuggestions(false);
          setIsFocused(false);
        });
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSuggestions]);

  // Loading app
  if (listLoading || !isFullyLoaded || !pokemons?.length) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-full items-start justify-center pt-20 px-4">
      <div
        ref={containerRef}
        className="container mx-auto text-center max-w-3xl"
      >
        <h1 className="text-5xl font-bold text-accent-yellow mb-12">
          Pokémon Catcher
        </h1>

        {/* Search section */}
        <div className="mx-auto max-w-md">
          <SearchInput
            searchTerm={searchTerm}
            isFocused={isFocused}
            showSuggestions={showSuggestions}
            listLoading={listLoading}
            suggestions={suggestions}
            onFocus={() => {
              if (searchTerm.trim() !== "") {
                setShowSuggestions(true);
              }
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onSelect={(name) => {
              const picked = suggestions.find((p) => p.name === name);
              if (picked) handleSelect(picked);
            }}
          />
        </div>

        {/* Catch modal */}
        {selected && (
          <CatchModal
            name={selected.name}
            onClose={() => setSelected(null)}
            onCaught={addPokemon}
          />
        )}

        <img
          src={pikaGif}
          alt="Pikachu"
          className="absolute bottom-0 left-0 w-[200px]"
        />

        {/* Pokedex viewer */}
        <PokedexViewer />
      </div>
    </div>
  );
};

export default Home;
