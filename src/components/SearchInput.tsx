import React, {
   KeyboardEvent,
   ChangeEvent,
   useRef,
   useEffect,
   useState,
 } from 'react'
 import pokeball from '../assets/pokeball.png'
 import particles from '../assets/particles_bg.png'
 
 export interface Suggestion {
   id: number
   name: string
   image: string
 }
 
 interface SearchInputProps {
   searchTerm: string
   isFocused: boolean
   showSuggestions: boolean
   listLoading: boolean
   suggestions: Suggestion[]
   loading: boolean
   onFocus: () => void
   onBlur: () => void
   onChange: (e: ChangeEvent<HTMLInputElement>) => void
   onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
   onSelect: (name: string) => void
 }
 
 type Phase = 'left' | 'inside' | 'right'
 const ENTRY_MS = 300
 const EXIT_MS = 400
 const LEFT_X = -70
 const INSIDE_X = 10
 const RIGHT_X = 600
 
 const CHANCE_LABEL = ['90%', '50%', '30%']
 const stageById = (id: number): 0 | 1 | 2 => {
   const m = (id - 1) % 3
   return (m === 0 ? 0 : m === 1 ? 1 : 2) as 0 | 1 | 2
 }
 
 const SuggestionCard: React.FC<{ p: Suggestion; onSelect: (n: string) => void }> = ({
   p,
   onSelect,
 }) => {
   const stage = stageById(p.id)
   const chance = CHANCE_LABEL[stage]
 
   return (
     <div
       onClick={() => onSelect(p.name)}
       className="relative group cursor-pointer bg-bg-secondary rounded-lg p-2 flex flex-col items-center
                  border-2 border-transparent transition duration-200
                  hover:border-accent-orange hover:shadow-[0_0_10px_rgba(251,191,36,0.9)]"
     >
       <span className="absolute top-1 right-1 bg-accent-yellow text-black text-xs font-bold px-2 pb-1 pt-2 rounded-full">
         {chance}
       </span>
       <img
         src={p.image}
         alt={p.name}
         className="w-32 h-32 object-contain mb-1 transform transition-transform duration-200 group-hover:scale-[130%]"
       />
       <span className="text-text-default">{p.name}</span>
     </div>
   )
 }
 
 export const SearchInput: React.FC<SearchInputProps> = ({
   searchTerm,
   isFocused,
   showSuggestions,
   listLoading,
   suggestions,
   loading,
   onFocus,
   onBlur,
   onChange,
   onKeyDown,
   onSelect,
 }) => {
   const containerRef = useRef<HTMLDivElement>(null)
   const [phase, setPhase] = useState<Phase>('left')
   const [duration, setDuration] = useState(0)
   const [enableT, setEnableT] = useState(false)
 
   useEffect(() => {
     if (isFocused) {
       setEnableT(false)
       setDuration(0)
       setPhase('left')
       requestAnimationFrame(() => {
         setDuration(ENTRY_MS)
         setEnableT(true)
         setPhase('inside')
       })
     } else {
       setDuration(EXIT_MS)
       setEnableT(true)
       setPhase('right')
     }
   }, [isFocused])
 
   const handleTransitionEnd = () => {
     if (phase === 'right') {
       setEnableT(false)
       setDuration(0)
       setPhase('left')
     }
   }
 
   const ballX = phase === 'inside' ? INSIDE_X : phase === 'right' ? RIGHT_X : LEFT_X
 
   useEffect(() => {
     const outside = (e: MouseEvent) => {
       if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
         onBlur()
       }
     }
     document.addEventListener('mousedown', outside)
     return () => document.removeEventListener('mousedown', outside)
   }, [onBlur])
 
   return (
     <div ref={containerRef} className="relative">
       <div
         className={`relative overflow-hidden rounded-full transition-shadow duration-200 ${
           isFocused
             ? 'shadow-[0_0_16px_rgba(251,191,36,0.9)]'
             : 'shadow-[0_0_10px_rgba(251,191,36,0.5)]'
         }`}
       >
         {isFocused && (
           <svg
             viewBox="0 0 400 40"
             className="absolute inset-0 w-full h-full pointer-events-none z-30"
             preserveAspectRatio="none"
           >
             <defs>
               <clipPath id="clipCapsule">
                 <rect width="400" height="40" rx="20" ry="20" />
               </clipPath>
             </defs>
             <g clipPath="url(#clipCapsule)">
               <image href={particles} width="400" height="40">
                 <animateTransform
                   attributeName="transform"
                   type="translate"
                   from="0 0"
                   to="-400 0"
                   dur="0.4s"
                   repeatCount="indefinite"
                 />
               </image>
               <image href={particles} x="400" width="400" height="40">
                 <animateTransform
                   attributeName="transform"
                   type="translate"
                   from="0 0"
                   to="-400 0"
                   dur="0.4s"
                   repeatCount="indefinite"
                 />
               </image>
             </g>
           </svg>
         )}
 
         <div
           className="absolute top-1/2 pointer-events-none z-40"
           style={{
             transform: `translateY(-50%) translateX(${ballX}px)`,
             transition: enableT ? `transform ${duration}ms ease-out` : 'none',
           }}
           onTransitionEnd={handleTransitionEnd}
         >
           <svg width="64" height="64" viewBox="0 0 64 64">
             <image href={pokeball} width="64" height="64">
               <animateTransform
                 attributeName="transform"
                 type="rotate"
                 from="0 32 32"
                 to="360 32 32"
                 dur="0.3s"
                 repeatCount="indefinite"
               />
             </image>
           </svg>
         </div>
 
         <input
           type="text"
           value={searchTerm}
           onChange={onChange}
           onKeyDown={onKeyDown}
           onFocus={onFocus}
           onBlur={onBlur}
           placeholder="Who do you want to catch?"
           className={[
             'w-full pr-4 pt-4 pb-3 bg-bg-secondary text-text-default placeholder:text-gray-500',
             'rounded-full border-2 leading-none',
             isFocused ? 'border-accent-orange' : 'border-accent-yellow',
             'focus:outline-none transition-all duration-300 ease-out',
             isFocused ? 'pl-20' : 'pl-4',
             'relative z-20',
           ].join(' ')}
         />
       </div>
 
       {searchTerm.trim() !== '' &&
       showSuggestions &&
       !listLoading &&
       suggestions.length > 0 && (
         <div
           className={[
             'absolute inset-x-1 top-full mt-2 overflow-auto bg-bg-secondary rounded-2xl p-2',
             'shadow-[0_0_10px_rgba(251,191,36,0.5)] border-2 z-[60]',
             isFocused ? 'border-accent-orange' : 'border-accent-yellow',
             'max-h-[600px] scrollbar-thin',
           ].join(' ')}
         >
           <div className="grid grid-cols-2 gap-3">
             {suggestions.map((p) => (
               <SuggestionCard key={p.id} p={p} onSelect={onSelect} />
             ))}
           </div>
         </div>
       )}
 
       {searchTerm.trim() !== '' &&
       showSuggestions &&
       !listLoading &&
       suggestions.length === 0 && (
         <div className="absolute inset-x-1 top-full mt-2 border-2 border-red-600 text-red-600 bg-bg-secondary rounded-lg p-2 z-[60]">
           No pokémon found
         </div>
       )}
 
       {loading && <p className="mt-4 text-text-default">Loading details…</p>}
     </div>
   )
 }