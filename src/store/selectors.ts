import { usePokemonStore } from "./pokemonStore";
import { usePokemonListStore } from "./pokemonListStore";

// Direct store access
export const getPokemonStore = () => usePokemonStore.getState();

// Pokemon store selectors
export const useCaughtPokemon = () => usePokemonStore((s) => s.caught);
export const useLastCaughtId = () => usePokemonStore((s) => s.lastCaughtId);
export const useEvolvedPokemonId = () => usePokemonStore((s) => s.evolvedPokemonId);
export const useRemoveOne = () => usePokemonStore((s) => s.removeOne);
export const useAddPokemon = () => usePokemonStore((s) => s.addPokemon);
export const useRemoveThree = () => usePokemonStore((s) => s.removeThree);
export const useSetEvolutionTarget = () => usePokemonStore((s) => s.setEvolutionTarget);

// Pokemon list store selectors
export const usePokemonList = () => usePokemonListStore((s) => s.pokemons);
export const useIsListLoading = () => usePokemonListStore((s) => s.isLoading);
export const useIsListFullyLoaded = () => usePokemonListStore((s) => s.isFullyLoaded);

// Derived selectors
export const useCaughtSet = () => {
  const caught = useCaughtPokemon();
  return new Set(caught.map((c) => c.name.toLowerCase()));
}; 