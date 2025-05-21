import React from "react";
import pokeball from "../../assets/pokeball.png";
import particles from "../../assets/particles_bg.png";

interface SearchAnimationProps {
  isFocused: boolean;
  ballX: number;
  enableT: boolean;
  duration: number;
  onTransitionEnd: () => void;
}

export const SearchAnimation: React.FC<SearchAnimationProps> = ({
  isFocused,
  ballX,
  enableT,
  duration,
  onTransitionEnd,
}) => {
  return (
    <>
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
          transition: enableT ? `transform ${duration}ms ease-out` : "none",
        }}
        onTransitionEnd={onTransitionEnd}
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
    </>
  );
}; 