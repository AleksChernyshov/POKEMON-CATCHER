import React from "react";
import holoSphereImg from "../../assets/holo-sphere.png";

interface PokedexHologramProps {
  power: boolean;
  showEvo: boolean;
}

export const PokedexHologram: React.FC<PokedexHologramProps> = ({ power, showEvo }) => {
  if (!power || !showEvo) return null;

  return (
    <>
      <div
        className="absolute left-[48px] top-[51px] w-[60px] h-[60px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle,rgba(34,211,238,0.05)0%,rgba(34,211,238,0)70%),url(${holoSphereImg})center/contain no-repeat`,
        }}
      />
      <div className="beam absolute left-[60px] top-[66px] w-[60px] h-px origin-left rotate-[12deg]" />
      <div className="beam absolute left-[90px] top-[60px] w-[400px] h-px origin-left rotate-[2deg]" />
      <div className="beam absolute left-[54px] top-[80px] w-[200px] h-px origin-left rotate-[79deg]" />
      <div className="beam absolute left-[96px] top-[100px] w-[460px] h-px origin-left rotate-[26deg]" />
    </>
  );
}; 