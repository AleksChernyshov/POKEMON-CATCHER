import React from "react";
import { Transition } from "@headlessui/react";
import pallet from "../../assets/pallet.png";
import { CaughtList } from "../pokemon/CaughtList";

interface PokedexModalProps {
  show: boolean;
  hasPokemon: boolean;
  onClose: () => void;
}

export const PokedexModal: React.FC<PokedexModalProps> = ({
  show,
  hasPokemon,
  onClose,
}) => {
  return (
    <Transition
      show={show && hasPokemon}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-700 delay-[200ms]"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
        onClick={onClose}
      >
        <Transition.Child
          enter="transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition-all duration-700 ease-in-out"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo="translate-x-full opacity-0"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[720px] h-[640px] rounded-2xl transform"
          >
            <img
              src={pallet}
              alt=""
              className="absolute inset-0 h-full w-full select-none pointer-events-none
               [clip-path:inset(0_100px_0_100px)]"
            />
            <img
              src={pallet}
              alt=""
              className="absolute inset-y-0 left-0 w-[150px] h-full object-cover select-none pointer-events-none"
              style={{ objectPosition: "left top" }}
            />
            <img
              src={pallet}
              alt=""
              className="absolute inset-y-0 right-0 w-[150px] h-full object-cover select-none pointer-events-none"
              style={{ objectPosition: "right top" }}
            />

            <div className="flex justify-center items-center -mt-4 mb-7">
              <button
                onClick={onClose}
                className="absolute -top-4 right-0 flex h-8 w-8 pt-1.5 items-center justify-center
                        rounded-full bg-red-600/80 text-xl leading-none text-white hover:bg-red-600 transition"
              >
                x
              </button>

              <h2 className="text-center text-3xl font-bold text-accent-yellow text-wrap">
                All Caught Pokémon
              </h2>
            </div>
            <div className="relative z-10 px-[66px] max-h-[548px] rounded-3xl overflow-auto">
              <CaughtList />
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};
