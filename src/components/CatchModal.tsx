import React, { useState, useEffect } from "react";
import { useCatchPokemon } from "../hooks/useCatchPokemon";
import { Pokemon } from "../store/pokemonStore";
import { usePokemonListStore } from "../store/pokemonListStore";
import { Howl } from "howler";

// Assets imports
import catch1 from "../assets/catching-1.gif";
import catch2 from "../assets/catching-2.gif";
import catch3 from "../assets/catching-3.gif";
import catch4 from "../assets/catching-4.gif";
import catch5 from "../assets/catching-5.png";

// Sound effects initialization
const wowSounds = [
  new Howl({ src: ["/POKEMON-CATCHER/assets/wow1.mp3"] }),
  new Howl({ src: ["/POKEMON-CATCHER/assets/wow2.mp3"] }),
  new Howl({ src: ["/POKEMON-CATCHER/assets/wow3.mp3"] }),
  new Howl({ src: ["/POKEMON-CATCHER/assets/wow4.mp3"] }),
];

const failSound = new Howl({
  src: ["/POKEMON-CATCHER/assets/ba-dum-tss.mp3"],
});

// Types and interfaces
interface CatchModalProps {
  name: string;
  onClose: () => void;
  onCaught: (pokemon: Pokemon, stage: number) => void;
}

type Phase = "initial" | "pending" | "post" | "preResult" | "result";

// Animation timing constants
const INITIAL_MS = 900;
const POST_MS = 1100;
const PRE_RES_MS = 3850;

export const CatchModal: React.FC<CatchModalProps> = ({
  name,
  onClose,
  onCaught,
}) => {
  // Store connections
  const { attemptCatch } = useCatchPokemon();
  const pokemonFromStore = usePokemonListStore((state) =>
    state.pokemons.find((p) => p.name.toLowerCase() === name.toLowerCase())
  );

  // State management
  const [phase, setPhase] = useState<Phase>("initial");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [outcome, setOutcome] = useState<{
    success: boolean;
    stage: number;
  } | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phase to background image mapping
  const bg = {
    initial: catch1,
    pending: catch2,
    post: catch3,
    preResult: catch4,
    result: catch5,
  }[phase];

  // Main catch sequence effect
  useEffect(() => {
    let mounted = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const run = async () => {
      try {
        // Initial phase - start animation
        setPhase("initial");
        await sleep(INITIAL_MS);
        if (!mounted) return;

        // Pending phase - get Pokemon data from store and attempt catch
        setPhase("pending");

        if (!pokemonFromStore) {
          throw new Error(`Pokemon ${name} not found in store`);
        }

        // Convert PokemonListItem to Pokemon
        const pokemonData: Pokemon = {
          id: pokemonFromStore.id,
          name: pokemonFromStore.name,
          sprites: pokemonFromStore.sprites || {
            front_default: pokemonFromStore.image,
          },
          species: pokemonFromStore.species || { url: "" },
        };

        setPokemon(pokemonData);

        // Add random delay between 1-2 seconds for animation
        await sleep(Math.random() * 1000 + 1000);

        const res = await attemptCatch(pokemonData);
        if (!mounted) return;
        setOutcome(res);

        // Post-throw animation
        setPhase("post");
        await sleep(POST_MS);
        if (!mounted) return;

        // Ball shaking animation
        setPhase("preResult");
        await sleep(PRE_RES_MS);
        if (!mounted) return;

        // Show final result
        setPhase("result");
        setShowOutcome(true);
      } catch (err) {
        console.error("Failed to catch pokemon:", err);
        setError(
          err instanceof Error ? err.message : "Failed to catch pokemon"
        );
        onClose();
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [name, pokemonFromStore, attemptCatch, onClose]);

  // Sound effects effect
  useEffect(() => {
    if (showOutcome && outcome) {
      if (outcome.success) {
        const randomWowSound =
          wowSounds[Math.floor(Math.random() * wowSounds.length)];
        randomWowSound.play();
      } else {
        failSound.play();
      }
    }
  }, [showOutcome, outcome]);

  if (error) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative">
        {/* Background animation */}
        <img src={bg} alt="" className="w-80 h-80 object-cover rounded-xl" />

        {/* Outcome display */}
        {showOutcome && outcome && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            {/* Caught Pokemon display */}
            {outcome.success && pokemon && (
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-48 h-48 mb-4 animate-scale-up"
              />
            )}
            {/* Action button */}
            <button
              onClick={() => {
                if (outcome.success && pokemon) {
                  onCaught(pokemon, outcome.stage);
                }
                onClose();
              }}
              className="mt-4 px-6 pt-3 pb-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition"
            >
              {outcome.success ? "Gotcha!" : "Oops, Pokémon ran away"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
