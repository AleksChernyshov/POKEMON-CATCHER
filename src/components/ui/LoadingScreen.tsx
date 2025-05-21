import React, { useEffect, useState } from "react";
import { ProgressBar } from "./ProgressBar";

// Assets imports
import catchThePokemon from "../../assets/catch-the-pokemon.png";

// Constants
const LOADING_TEXT = {
  title: "Loading Pokédex...",
  description: "Please wait while we gather information about all Pokémon",
} as const;

export const LoadingScreen: React.FC = () => {
  // State management
  const [progress, setProgress] = useState(0);

  // Progress event listener effect
  useEffect(() => {
    const handleProgress = (event: CustomEvent<number>) => {
      setProgress(event.detail);
    };

    window.addEventListener(
      "pokemon-loading-progress",
      handleProgress as EventListener
    );

    return () => {
      window.removeEventListener(
        "pokemon-loading-progress",
        handleProgress as EventListener
      );
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-bg-default flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {/* Loading animation */}
        <div className="relative w-64 h-64 mx-auto">
          <img
            src={catchThePokemon}
            alt="Loading..."
            className="w-full h-full object-contain animate-breathing"
          />
        </div>

        {/* Progress bar */}
        <ProgressBar
          progress={progress}
          title={LOADING_TEXT.title}
          description={LOADING_TEXT.description}
        />
      </div>
    </div>
  );
};
