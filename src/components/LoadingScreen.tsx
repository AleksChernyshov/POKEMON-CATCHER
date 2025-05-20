import React, { useEffect, useState } from "react";

// Assets imports
import catchThePokemon from "../assets/catch-the-pokemon.png";

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
        <div className="-mt-[50px]">
          <div className="w-full bg-bg-secondary rounded-full h-4 mb-4">
            <div
              className="bg-accent-yellow h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <h2 className="text-2xl font-bold text-accent-yellow mb-2">
            Loading Pokédex...
          </h2>
          <p className="text-text-default">
            Please wait while we gather information about all Pokémon
          </p>
        </div>
      </div>
    </div>
  );
};
