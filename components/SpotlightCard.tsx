'use client';

import React, { useRef, useState, useCallback } from "react";

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.25)"
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused || !rectRef.current) return;
    const rect = rectRef.current;
    divRef.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    divRef.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }, [isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    rectRef.current = divRef.current?.getBoundingClientRect() ?? null;
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative border border-neutral-800 bg-neutral-900 overflow-hidden p-8 ${className}`}
    >
    <div
    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
    style={{
        opacity,
        background: `radial-gradient(circle at var(--spot-x, 0px) var(--spot-y, 0px), ${spotlightColor}, transparent 80%)`,
    }}
    />
    {children}
    </div>
  );
};

export default SpotlightCard;
