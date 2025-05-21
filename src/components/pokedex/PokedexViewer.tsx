import React, { useState, useRef, useEffect } from "react";
import pokedexImg from "../../assets/pokedex.png";
import { CaughtEntry } from "../../store/pokemonStore";
import { EvolutionModal } from "../pokemon/EvolutionModal";
import { Howl } from "howler";
import { CatchModal } from "../pokemon/CatchModal";
import type { Suggestion } from "../search/SearchInput";
import {
  useCaughtPokemon,
  useLastCaughtId,
  useEvolvedPokemonId,
  useRemoveOne,
  useAddPokemon,
  getPokemonStore,
} from "../../store/selectors";
import { PokedexDisplay } from "./PokedexDisplay";
import { PokedexControls } from "./PokedexControls";
import { PokedexHologram } from "./PokedexHologram";
import { PokedexHint } from "./PokedexHint";
import { PokedexModal } from "./PokedexModal";

export const PokedexViewer: React.FC = () => {
  // Store connections for Pokemon management
  const caught = useCaughtPokemon();
  const lastCaughtId = useLastCaughtId();
  const evolvedPokemonId = useEvolvedPokemonId();
  const removeOne = useRemoveOne();
  const addPokemon = useAddPokemon();

  // State management for UI interactions
  const [idx, setIdx] = useState(0);
  const [power, setPower] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showEvo, setShowEvo] = useState(false);
  const [hint, setHint] = useState("");
  const [isDragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<Suggestion | null>(null);

  // DOM references for interactions
  const modalRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const prevLen = useRef(0);

  // Sound effect initialization
  const powerOnSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/power-on.mp3"],
  });
  const powerOffSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/power-off.mp3"],
    volume: 0.2,
  });
  const buttonClickSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/button.mp3"],
  });
  const holoScreenSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/holo-screan.mp3"],
    volume: 0.4,
  });
  const modalSlideSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/modal-slide.mp3"],
  });
  const deleteSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/delete.mp3"],
  });
  const windSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/wind2.mp3"],
    volume: 0.4,
  });

  // Modal click outside handler
  useEffect(() => {
    if (!showAll) return;
    const outside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        setShowAll(false);
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [showAll]);

  // Pokemon selection and list management
  const has = caught.length > 0;
  const cur: CaughtEntry | null = has ? caught[idx] : null;

  useEffect(() => {
    if (caught.length === 0) {
      setIdx(0);
      prevLen.current = 0;
      return;
    }

    // If we have an evolved pokemon, switch to it
    if (evolvedPokemonId !== null) {
      const evolvedIndex = caught.findIndex(
        (p: CaughtEntry) => p.id === evolvedPokemonId
      );
      if (evolvedIndex !== -1) {
        setIdx(evolvedIndex);
        // Reset evolvedPokemonId after switching
        const store = getPokemonStore();
        store.evolvedPokemonId = null;
        store.lastCaughtId = null;
        return;
      }
    }

    // If we caught a pokemon (new or copy)
    if (lastCaughtId !== null) {
      const newIdx = caught.findIndex(
        (p: CaughtEntry) => p.id === lastCaughtId
      );
      if (newIdx !== -1) {
        setIdx(newIdx);
        // Reset lastCaughtId after switching
        getPokemonStore().lastCaughtId = null;
        return;
      }
    }

    // If current index is out of bounds
    if (idx >= caught.length) {
      setIdx(caught.length - 1);
    }

    // If current pokemon was removed
    else if (caught.length < prevLen.current) {
      const currentPokemon = caught[idx];
      if (!currentPokemon) {
        const validIndex = Math.min(idx, caught.length - 1);
        setIdx(validIndex);
        return;
      }

      // Try to find the same pokemon in the new list
      const samePokemonIndex = caught.findIndex(
        (p: CaughtEntry) =>
          p.id === currentPokemon.id && p.stage === currentPokemon.stage
      );

      if (samePokemonIndex !== -1) {
        setIdx(samePokemonIndex);
      } else {
        const validIndex = Math.min(idx, caught.length - 1);
        setIdx(validIndex);
      }
    }

    prevLen.current = caught.length;
  }, [caught, idx, evolvedPokemonId, lastCaughtId]);

  // Navigation handlers
  const prev = () => {
    if (power && has) {
      setIdx((i) => (i ? i - 1 : caught.length - 1));
      buttonClickSound.play();
      const store = getPokemonStore();
      store.evolvedPokemonId = null;
      store.lastCaughtId = null;
    }
  };

  const next = () => {
    if (power && has) {
      setIdx((i) => (i === caught.length - 1 ? 0 : i + 1));
      buttonClickSound.play();
      const store = getPokemonStore();
      store.evolvedPokemonId = null;
      store.lastCaughtId = null;
    }
  };

  // UI interaction handlers
  const hintIn = (t: string) => () => setHint(t);
  const hintOut = () => setHint("");

  const toggleEvo = () => {
    if (power && has) {
      holoScreenSound.play();
      setShowEvo(!showEvo);
      setHint(() => (showEvo ? "" : "SHOW EVO"));
      buttonClickSound.play();
    }
  };

  const togglePower = () => {
    setPower((p: boolean) => {
      const n = !p;
      if (n) powerOnSound.play();
      else powerOffSound.play();
      return n;
    });
  };

  const closeModal = () => {
    setShowAll(false);
    modalSlideSound.play();
  };

  // Drag functionality handlers
  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    const cX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const cY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragging(true);
    dragStartRef.current = { x: cX - pos.x, y: cY - pos.y };
  };
  const stopDragging = () => setDragging(false);
  const drag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const cX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const cY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setPos({ x: cX - dragStartRef.current.x, y: cY - dragStartRef.current.y });
  };

  return (
    <>
      {/* Main Pokedex container with drag functionality */}
      <div
        className="relative mx-auto mt-12 w-[512px] h-[512px] select-none"
        style={{
          backgroundImage: `url(${pokedexImg})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          zIndex: 20,
        }}
        onMouseDown={startDragging}
        onMouseUp={stopDragging}
        onMouseMove={drag}
        onTouchStart={startDragging}
        onTouchEnd={stopDragging}
        onTouchMove={drag}
      >
        <PokedexHologram power={power} showEvo={showEvo} />
        {power && cur && <PokedexDisplay pokemon={cur} />}
        <PokedexControls
          power={power}
          hasPokemon={has}
          showEvo={showEvo}
          onPrev={prev}
          onNext={next}
          onShowAll={() => {
            if (power && has) {
              setShowAll(true);
              modalSlideSound.play();
              buttonClickSound.play();
            }
          }}
          onDelete={() => {
            if (power && has) {
              removeOne(cur!.id);
              deleteSound.play();
              buttonClickSound.play();
            }
          }}
          onToggleEvo={toggleEvo}
          onTogglePower={togglePower}
          onHintIn={hintIn}
          onHintOut={hintOut}
        />
        <PokedexHint hint={hint} />

        {/* Evolution modal */}
        {showEvo && power && has && cur && (
          <div className="absolute left-[80px] top-[80px] ml-4 z-50 pointer-events-auto">
            <EvolutionModal
              name={cur.name}
              onCatch={(name) => {
                setSelected({
                  name,
                  id: 0,
                  image: "",
                });
                windSound.play();
              }}
            />
          </div>
        )}
      </div>

      <PokedexModal show={showAll} hasPokemon={has} onClose={closeModal} />

      {/* Pokemon catch modal */}
      {selected && (
        <CatchModal
          name={selected.name}
          onClose={() => {
            setSelected(null);
          }}
          onCaught={(pokemon, stage) => {
            addPokemon(pokemon, stage);
            setSelected(null);
          }}
        />
      )}
    </>
  );
};
