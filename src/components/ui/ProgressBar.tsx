import React from "react";

interface ProgressBarProps {
  progress: number;
  title: string;
  description: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  title,
  description,
}) => {
  return (
    <div className="-mt-[50px]">
      <div className="w-full bg-bg-secondary rounded-full h-4 mb-4">
        <div
          className="bg-accent-yellow h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <h2 className="text-2xl font-bold text-accent-yellow mb-2">{title}</h2>
      <p className="text-text-default">{description}</p>
    </div>
  );
};
