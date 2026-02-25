"use client";

import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  width = 640,
  height = 480,
  priority = false
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src || "/images/placeholder.svg");

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={() => {
        if (currentSrc !== "/images/placeholder.svg") {
          setCurrentSrc("/images/placeholder.svg");
        }
      }}
    />
  );
}
