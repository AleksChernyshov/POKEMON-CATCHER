import React from "react";
import onOffIcon from "../../assets/on-off.png";

interface PokedexControlsProps {
  power: boolean;
  hasPokemon: boolean;
  showEvo: boolean;
  onPrev: () => void;
  onNext: () => void;
  onShowAll: () => void;
  onDelete: () => void;
  onToggleEvo: () => void;
  onTogglePower: () => void;
  onHintIn: (text: string) => () => void;
  onHintOut: () => void;
}

export const PokedexControls: React.FC<PokedexControlsProps> = ({
  power,
  hasPokemon,
  showEvo,
  onPrev,
  onNext,
  onShowAll,
  onDelete,
  onToggleEvo,
  onTogglePower,
  onHintIn,
  onHintOut,
}) => {
  const disabled = power && hasPokemon ? "" : "pointer-events-none opacity-40";

  return (
    <>
      {/* Navigation buttons */}
      <button
        onClick={onPrev}
        onMouseEnter={onHintIn("PREVIOUS")}
        onMouseLeave={onHintOut}
        className={`group absolute left-[72px] bottom-[132px] w-[36px] h-[24px] cursor-pointer ${disabled}`}
      >
        <span
          className={`absolute inset-0 border-l-2 border-t-2 border-b-2 border-transparent rounded-tl-md rounded-bl-md transition-colors duration-75 ${
            power &&
            hasPokemon &&
            "group-hover:border-t-white/60 group-hover:border-l-white/60 group-active:border-b-accent-yellow group-active:border-l-accent-yellow group-active:border-t-transparent"
          }`}
        />
      </button>

      <button
        onClick={onNext}
        onMouseEnter={onHintIn("NEXT")}
        onMouseLeave={onHintOut}
        className={`group absolute left-[112px] bottom-[132px] w-[36px] h-[24px] cursor-pointer ${disabled}`}
      >
        <span
          className={`absolute inset-0 border-r-2 border-t-2 border-b-2 border-transparent rounded-tr-md rounded-br-md transition-colors duration-75 ${
            power &&
            hasPokemon &&
            "group-hover:border-b-white/60 group-hover:border-r-white/60 group-active:border-t-accent-yellow group-active:border-r-accent-yellow group-active:border-b-transparent"
          }`}
        />
      </button>

      {/* Show all Pokemon button */}
      <div className="absolute left-[95px] bottom-[168px] flex flex-col items-center gap-1 w-[60px] h-[45px]">
        <button
          onClick={onShowAll}
          onMouseEnter={onHintIn("SHOW ALL")}
          onMouseLeave={onHintOut}
          className={`group relative w-[46px] h-[10px] cursor-pointer ${disabled}`}
        >
          <span
            className={`absolute inset-0 rounded-md border-2 border-transparent transition-colors duration-50 ${
              power &&
              hasPokemon &&
              "group-hover:shadow-button-blue group-active:border-blue-500"
            }`}
          />
        </button>
        <span className="text-[12px] font-bold text-gray-800 select-none">
          all
        </span>
      </div>

      {/* Delete Pokemon button */}
      <div className="absolute left-[155px] bottom-[168px] flex flex-col items-center gap-1 w-[60px] h-[45px]">
        <button
          onClick={onDelete}
          onMouseEnter={onHintIn("DELETE")}
          onMouseLeave={onHintOut}
          className={`group relative w-[46px] h-[10px] cursor-pointer ${disabled}`}
        >
          <span
            className={`absolute inset-0 rounded-md border-2 border-transparent transition-colors duration-50 ${
              power &&
              hasPokemon &&
              "group-hover:shadow-button-red group-active:border-red-500"
            }`}
          />
        </button>
        <span className="text-[12px] font-bold text-gray-800 select-none">
          delete
        </span>
      </div>

      {/* Evolution toggle button */}
      <div className="absolute left-[191px] bottom-[108px] flex flex-col items-center gap-1 w-[30px] h-[45px]">
        <button
          onClick={onToggleEvo}
          onMouseEnter={onHintIn(showEvo ? "HIDE EVO" : "SHOW EVO")}
          onMouseLeave={onHintOut}
          className={`group relative w-[34px] h-[18px] rounded-lg cursor-pointer ${disabled}`}
        >
          <span
            className={`absolute inset-0 rounded-lg border-2 border-transparent transition-colors duration-50 ${
              power &&
              hasPokemon &&
              (showEvo
                ? "shadow-button-yellow border-yellow-400"
                : "group-hover:shadow-button-yellow-hover group-active:shadow-button-yellow group-active:border-yellow-400")
            }`}
          />
        </button>
        <span className="text-[12px] font-bold text-gray-800 select-none">
          evo
        </span>
      </div>

      {/* Power button */}
      <div className="absolute left-[62px] bottom-[189px] w-[26px] h-[26px]">
        <button
          onClick={onTogglePower}
          onMouseEnter={onHintIn(power ? "POWER OFF" : "POWER ON")}
          onMouseLeave={onHintOut}
          className="group relative w-full h-full rounded-full cursor-pointer"
        >
          <span
            className={`absolute inset-0 rounded-full border-2 transition-colors duration-50 ${
              power
                ? "border-green-500 shadow-button-green"
                : "border-transparent group-hover:shadow-button-green-hover"
            }`}
          />
          <img
            src={onOffIcon}
            alt="Power"
            className="absolute left-1/2 top-1/2 w-[16px] h-[16px] -translate-x-1/2 -translate-y-1/2 object-contain"
          />
        </button>
      </div>
    </>
  );
};
