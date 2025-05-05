import React, { useState, useRef, useEffect } from 'react';
import pokedexImg from '../assets/pokedex.png';
import onOffIcon from '../assets/on-off.png';
import { usePokemonStore, CaughtEntry } from '../store/pokemonStore';
import { CaughtList } from './CaughtList';
import { EvolutionModal } from './EvolutionModal';
import { Howl } from 'howler';

export const PokedexViewer: React.FC = () => {
  const caught = usePokemonStore(s => s.caught);
  const removeOne = usePokemonStore(s => s.removeOne);

  const [idx, setIdx] = useState(0);
  const [power, setPower] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showEvo, setShowEvo] = useState(false);
  const [hint, setHint] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  const powerOnSound = new Howl({ src: ['/POKEMON-CATCHER/assets/power-on.mp3'] });
  const powerOffSound = new Howl({ src: ['/POKEMON-CATCHER/assets/power-off.mp3'] });
  const buttonClickSound = new Howl({ src: ['/POKEMON-CATCHER/assets/button.mp3'] });

  useEffect(() => {
    if (!showAll) return;
    const outside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) setShowAll(false);
    };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [showAll]);

  const has = caught.length > 0;
  const cur: CaughtEntry | null = has ? caught[idx] : null;

  const prev = () => { if (power && has) { setIdx(i => (i ? i - 1 : caught.length - 1)); buttonClickSound.play(); } };
  const next = () => { if (power && has) { setIdx(i => (i === caught.length - 1 ? 0 : i + 1)); buttonClickSound.play(); } };
  const disabled = power && has ? '' : 'pointer-events-none opacity-40';

  const hintIn = (t: string) => () => setHint(t);
  const hintOut = () => setHint('');

  const evoDown = () => { if (power && has) { setShowEvo(true); setHint('SHOW EVO'); buttonClickSound.play(); } };
  const evoUp = () => { setShowEvo(false); setHint(''); };

  const togglePower = () => {
    setPower(p => {
      const newPower = !p;
      if (newPower) {
        powerOnSound.play();
      } else {
        powerOffSound.play();
      }
      return newPower;
    });
  };

  return (
    <>
      <div
        className="relative mx-auto mt-12 w-[512px] h-[512px] select-none"
        style={{ backgroundImage: `url(${pokedexImg})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
      >
        {power && (
          <>
            {cur && (
              <>
                <img
                  src={cur.sprites.front_default}
                  alt={cur.name}
                  className="absolute left-[68px] top-[150px] w-[152px] h-[124px] rounded object-contain"
                />
                <div className="absolute right-[63px] top-[150px] w-[153px] h-[66px] flex items-center justify-center text-accent-yellow text-lg font-bold">
                  {cur.name}
                </div>
                <div className="absolute right-[162px] bottom-[107px] w-[57px] h-[40px] flex items-center justify-center text-white font-bold text-lg">
                  ×{cur.count}
                </div>
                <div className="absolute right-[53px] bottom-[108px] w-[90px] h-[38px] flex items-center justify-center text-accent-yellow font-bold text-lg">
                  Stage {cur.stage + 1}
                </div>
              </>
            )}
            <span className="pointer-events-none absolute left-[68px]  top-[150px] w-[152px] h-[124px] rounded bg-gradient-to-br from-white/25 to-transparent" />
            <span className="pointer-events-none absolute right-[63px] top-[150px] w-[153px] h-[66px]  rounded bg-gradient-to-br from-white/20 to-transparent" />
          </>
        )}

        <button
          onClick={prev}
          onMouseEnter={hintIn('PREVIOUS')}
          onMouseLeave={hintOut}
          className={`group absolute left-[72px] bottom-[132px] w-[36px] h-[24px] cursor-pointer ${disabled}`}
        >
          <span className={`absolute inset-0 border-l-2 border-t-2 border-b-2 border-transparent rounded-tl-md rounded-bl-md transition-colors duration-75 ${power && has && 'group-hover:border-t-white/60 group-hover:border-l-white/60 group-active:border-b-accent-yellow group-active:border-l-accent-yellow group-active:border-t-transparent'}`} />
        </button>

        <button
          onClick={next}
          onMouseEnter={hintIn('NEXT')}
          onMouseLeave={hintOut}
          className={`group absolute left-[112px] bottom-[132px] w-[36px] h-[24px] cursor-pointer ${disabled}`}
        >
          <span className={`absolute inset-0 border-r-2 border-t-2 border-b-2 border-transparent rounded-tr-md rounded-br-md transition-colors duration-75 ${power && has && 'group-hover:border-b-white/60 group-hover:border-r-white/60 group-active:border-t-accent-yellow group-active:border-r-accent-yellow group-active:border-b-transparent'}`} />
        </button>

        <div className="absolute left-[95px] bottom-[168px] flex flex-col items-center gap-1 w-[60px] h-[45px]">
          <button
            onClick={() => {
              if (power && has) {
                setShowAll(true);
                buttonClickSound.play();
              }
            }}
            onMouseEnter={hintIn('SHOW ALL')}
            onMouseLeave={hintOut}
            className={`group relative w-[46px] h-[10px] cursor-pointer ${disabled}`}
          >
            <span className={`absolute inset-0 rounded-md border-2 border-transparent transition-colors duration-50 ${power && has && 'group-hover:shadow-[0_0_6px_2px_rgba(0,128,255,0.8)] group-active:border-blue-500'}`} />
          </button>
          <span className="text-[12px] font-bold text-gray-800 select-none">all</span>
        </div>

        <div className="absolute left-[155px] bottom-[168px] flex flex-col items-center gap-1 w-[60px] h-[45px]">
          <button
            onClick={() => {
              if (power && has) {
                removeOne(cur!.id);
                buttonClickSound.play();
              }
            }}
            onMouseEnter={hintIn('DELETE')}
            onMouseLeave={hintOut}
            className={`group relative w-[46px] h-[10px] cursor-pointer ${disabled}`}
          >
            <span className={`absolute inset-0 rounded-md border-2 border-transparent transition-colors duration-50 ${power && has && 'group-hover:shadow-[0_0_6px_2px_rgba(255,0,0,0.8)] group-active:border-red-500'}`} />
          </button>
          <span className="text-[12px] font-bold text-gray-800 select-none">delete</span>
        </div>

        <div className="absolute left-[191px] bottom-[108px] flex flex-col items-center gap-1 w-[30px] h-[45px]">
          <button
            onMouseDown={evoDown}
            onMouseUp={evoUp}
            onMouseLeave={evoUp}
            onMouseEnter={hintIn('SHOW EVO')}
            className={`group relative w-[34px] h-[18px] rounded-lg cursor-pointer ${disabled}`}
          >
            <span className={`absolute inset-0 rounded-lg border-2 border-transparent transition-colors duration-50 ${power && has && 'group-hover:shadow-[0_0_6px_2px_rgba(255,255,0,0.4)] group-active:shadow-[0_0_6px_2px_rgba(255,255,0,0.8)] group-active:border-yellow-400'}`} />
          </button>
          <span className="text-[12px] font-bold text-gray-800 select-none">evo</span>
        </div>

        <div className="absolute left-[62px] bottom-[189px] w-[26px] h-[26px]">
          <button
            onClick={togglePower}
            onMouseEnter={hintIn(power ? 'POWER OFF' : 'POWER ON')}
            onMouseLeave={hintOut}
            className="group relative w-full h-full rounded-full cursor-pointer"
          >
            <span className={`absolute inset-0 rounded-full border-2 transition-colors duration-50 ${power ? 'border-green-500 shadow-[0_0_6px_2px_rgba(0,255,0,0.8)]' : 'border-transparent group-hover:shadow-[0_0_4px_1px_rgba(0,255,0,0.4)]'}`} />
            <img src={onOffIcon} alt="Power" className="absolute left-1/2 top-1/2 w-[16px] h-[16px] -translate-x-1/2 -translate-y-1/2 object-contain" />
          </button>
        </div>

        <div className="pointer-events-none absolute left-[152px] -translate-x-1/2 bottom-[83px] text-center font-press-start text-[7px] text-accent-yellow uppercase">
          {hint}
        </div>
      </div>

      {showAll && has && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div
            ref={modalRef}
            className="relative container mx-auto max-w-3xl bg-bg-secondary p-6 rounded-2xl max-h-[80vh] overflow-auto"
          >
            <button
              onClick={() => setShowAll(false)}
              className="absolute top-2 right-2 flex h-7 w-7 items-start justify-center rounded-full text-xl text-red-600 transition hover:bg-red-600 hover:text-white pt-[2px]"
            >
              ×
            </button>
            <h2 className="mb-6 text-center text-2xl text-accent-yellow">All Caught Pokémon</h2>
            <CaughtList />
          </div>
        </div>
      )}

      {showEvo && has && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <EvolutionModal name={cur!.name} />
        </div>
      )}
    </>
  );
};
