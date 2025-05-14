import React, { useState, useRef, useEffect } from "react"
import { Transition } from "@headlessui/react"
import pokedexImg from "../assets/pokedex.png"
import onOffIcon from "../assets/on-off.png"
import holoSphereImg from "../assets/holo-sphere.png"
import pallet from "../assets/pallet.png"
import { usePokemonStore, CaughtEntry } from "../store/pokemonStore"
import { CaughtList } from "./CaughtList"
import { EvolutionModal } from "./EvolutionModal"
import { Howl } from "howler"

export const PokedexViewer: React.FC = () => {
  const caught = usePokemonStore((s) => s.caught)
  const removeOne = usePokemonStore((s) => s.removeOne)

  const [idx, setIdx] = useState(0)
  const [power, setPower] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [showEvo, setShowEvo] = useState(false)
  const [hint, setHint] = useState("")
  const [isDragging, setDragging] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const modalRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const prevLen = useRef(0)

  const powerOnSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/power-on.mp3"],
  })
  const powerOffSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/power-off.mp3"],
  })
  const buttonClickSound = new Howl({
    src: ["/POKEMON-CATCHER/assets/button.mp3"],
  })

  useEffect(() => {
    if (!showAll) return
    const outside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        setShowAll(false)
    }
    document.addEventListener("mousedown", outside)
    return () => document.removeEventListener("mousedown", outside)
  }, [showAll])

  useEffect(() => {
    if (caught.length > prevLen.current) {
      setIdx(caught.length - 1)
    } else if (idx >= caught.length && caught.length > 0) {
      setIdx(caught.length - 1)
    } else if (caught.length === 0) {
      setIdx(0)
    }
    prevLen.current = caught.length
  }, [caught.length, idx])

  const has = caught.length > 0
  const cur: CaughtEntry | null = has ? caught[idx] : null

  const prev = () => {
    if (power && has) {
      setIdx((i) => (i ? i - 1 : caught.length - 1))
      buttonClickSound.play()
    }
  }
  const next = () => {
    if (power && has) {
      setIdx((i) => (i === caught.length - 1 ? 0 : i + 1))
      buttonClickSound.play()
    }
  }
  const disabled = power && has ? "" : "pointer-events-none opacity-40"

  const hintIn = (t: string) => () => setHint(t)
  const hintOut = () => setHint("")

  const toggleEvo = () => {
    if (power && has) {
      setShowEvo((v) => !v)
      setHint(() => (showEvo ? "" : "SHOW EVO"))
      buttonClickSound.play()
    }
  }

  const togglePower = () => {
    setPower((p) => {
      const n = !p
      if (n) powerOnSound.play()
      else powerOffSound.play()
      return n
    })
  }

  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    const cX = "touches" in e ? e.touches[0].clientX : e.clientX
    const cY = "touches" in e ? e.touches[0].clientY : e.clientY
    setDragging(true)
    dragStartRef.current = { x: cX - pos.x, y: cY - pos.y }
  }
  const stopDragging = () => setDragging(false)
  const drag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const cX = "touches" in e ? e.touches[0].clientX : e.clientX
    const cY = "touches" in e ? e.touches[0].clientY : e.clientY
    setPos({ x: cX - dragStartRef.current.x, y: cY - dragStartRef.current.y })
  }

  return (
    <>
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
        {power && showEvo && (
          <div
            className="absolute left-[48px] top-[51px] w-[60px] h-[60px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle,rgba(34,211,238,0.05)0%,rgba(34,211,238,0)70%),url(${holoSphereImg})center/contain no-repeat`,
            }}
          />
        )}
        {power && showEvo && (
          <>
            <div className="beam absolute left-[60px] top-[66px] w-[60px] h-px origin-left rotate-[12deg]" />
            <div className="beam absolute left-[96px] top-[100px] w-[460px] h-px origin-left rotate-[26deg]" />
            <div className="beam absolute left-[90px] top-[60px] w-[400px] h-px origin-left rotate-[2deg]" />
            <div className="beam absolute left-[54px] top-[80px] w-[200px] h-px origin-left  rotate-[79deg]" />
          </>
        )}
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
            <span className="pointer-events-none absolute left-[68px] top-[150px] w-[152px] h-[124px] rounded bg-gradient-to-br from-white/25 to-transparent" />
            <span className="pointer-events-none absolute right-[63px] top-[150px] w-[153px] h-[66px] rounded bg-gradient-to-br from-white/20 to-transparent" />
          </>
        )}

        <button
          onClick={prev}
          onMouseEnter={hintIn("PREVIOUS")}
          onMouseLeave={hintOut}
          className={`group absolute left-[72px] bottom-[132px] w-[36px] h-[24px] cursor-pointer ${disabled}`}
        >
          <span
            className={`absolute inset-0 border-l-2 border-t-2 border-b-2 border-transparent rounded-tl-md rounded-bl-md transition-colors duration-75 ${
              power &&
              has &&
              "group-hover:border-t-white/60 group-hover:border-l-white/60 group-active:border-b-accent-yellow group-active:border-l-accent-yellow group-active:border-t-transparent"
            }`}
          />
        </button>

        <button
          onClick={next}
          onMouseEnter={hintIn("NEXT")}
          onMouseLeave={hintOut}
          className={`group absolute left-[112px] bottom-[132px] w-[36px] h-[24px] cursor-pointer ${disabled}`}
        >
          <span
            className={`absolute inset-0 border-r-2 border-t-2 border-b-2 border-transparent rounded-tr-md rounded-br-md transition-colors duration-75 ${
              power &&
              has &&
              "group-hover:border-b-white/60 group-hover:border-r-white/60 group-active:border-t-accent-yellow group-active:border-r-accent-yellow group-active:border-b-transparent"
            }`}
          />
        </button>

        <div className="absolute left-[95px] bottom-[168px] flex flex-col items-center gap-1 w-[60px] h-[45px]">
          <button
            onClick={() => {
              if (power && has) {
                setShowAll(true)
                buttonClickSound.play()
              }
            }}
            onMouseEnter={hintIn("SHOW ALL")}
            onMouseLeave={hintOut}
            className={`group relative w-[46px] h-[10px] cursor-pointer ${disabled}`}
          >
            <span
              className={`absolute inset-0 rounded-md border-2 border-transparent transition-colors duration-50 ${
                power &&
                has &&
                "group-hover:shadow-[0_0_6px_2px_rgba(0,128,255,0.8)] group-active:border-blue-500"
              }`}
            />
          </button>
          <span className="text-[12px] font-bold text-gray-800 select-none">
            all
          </span>
        </div>

        <div className="absolute left-[155px] bottom-[168px] flex flex-col items-center gap-1 w-[60px] h-[45px]">
          <button
            onClick={() => {
              if (power && has) {
                removeOne(cur!.id)
                buttonClickSound.play()
              }
            }}
            onMouseEnter={hintIn("DELETE")}
            onMouseLeave={hintOut}
            className={`group relative w-[46px] h-[10px] cursor-pointer ${disabled}`}
          >
            <span
              className={`absolute inset-0 rounded-md border-2 border-transparent transition-colors duration-50 ${
                power &&
                has &&
                "group-hover:shadow-[0_0_6px_2px_rgba(255,0,0,0.8)] group-active:border-red-500"
              }`}
            />
          </button>
          <span className="text-[12px] font-bold text-gray-800 select-none">
            delete
          </span>
        </div>

        <div className="absolute left-[191px] bottom-[108px] flex flex-col items-center gap-1 w-[30px] h-[45px]">
          <button
            onClick={toggleEvo}
            onMouseEnter={hintIn(showEvo ? "HIDE EVO" : "SHOW EVO")}
            onMouseLeave={hintOut}
            className={`group relative w-[34px] h-[18px] rounded-lg cursor-pointer ${disabled}`}
          >
            <span
              className={`absolute inset-0 rounded-lg border-2 border-transparent transition-colors duration-50 ${
                power &&
                has &&
                (showEvo
                  ? "shadow-[0_0_6px_2px_rgba(255,255,0,0.8)] border-yellow-400"
                  : "group-hover:shadow-[0_0_6px_2px_rgba(255,255,0,0.4)] group-active:shadow-[0_0_6px_2px_rgba(255,255,0,0.8)] group-active:border-yellow-400")
              }`}
            />
          </button>
          <span className="text-[12px] font-bold text-gray-800 select-none">
            evo
          </span>
        </div>

        <div className="absolute left-[62px] bottom-[189px] w-[26px] h-[26px]">
          <button
            onClick={togglePower}
            onMouseEnter={hintIn(power ? "POWER OFF" : "POWER ON")}
            onMouseLeave={hintOut}
            className="group relative w-full h-full rounded-full cursor-pointer"
          >
            <span
              className={`absolute inset-0 rounded-full border-2 transition-colors duration-50 ${
                power
                  ? "border-green-500 shadow-[0_0_6px_2px_rgba(0,255,0,0.8)]"
                  : "border-transparent group-hover:shadow-[0_0_4px_1px_rgba(0,255,0,0.4)]"
              }`}
            />
            <img
              src={onOffIcon}
              alt="Power"
              className="absolute left-1/2 top-1/2 w-[16px] h-[16px] -translate-x-1/2 -translate-y-1/2 object-contain"
            />
          </button>
        </div>

        <div className="pointer-events-none absolute left-[152px] -translate-x-1/2 bottom-[83px] text-center font-press-start text-[7px] text-accent-yellow uppercase">
          {hint}
        </div>

        {showEvo && power && has && (
          <div className="absolute left-[80px] top-[80px] ml-4 z-50 pointer-events-auto">
            <EvolutionModal name={cur!.name} />
          </div>
        )}
      </div>

      <Transition
        show={showAll && has}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-700 delay-[200ms]"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
          onClick={() => setShowAll(false)}
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
                className="absolute inset-0 h-full w-full  select-none pointer-events-none
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
                  onClick={() => setShowAll(false)}
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
    </>
  )
}
