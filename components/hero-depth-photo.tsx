"use client";

import { useEffect, useRef, useState } from "react";
import { createDepthScene } from "@/lib/depth-photo-scene";

type HeroDepthPhotoProps = {
  /** Same URL as the visible <img> beneath, so the browser reuses the download. */
  src: string;
  /** Grayscale depth map for the photograph, lighter = closer. */
  depthSrc: string;
};

/**
 * Draws the hero photograph with fixed depth over the ordinary image. The
 * image keeps the alternative text and remains the fallback whenever the scene
 * cannot run, so nothing is lost for assistive technology or older devices.
 */
export function HeroDepthPhoto({ src, depthSrc }: HeroDepthPhotoProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    setReady(false);
    const scene = createDepthScene(element, {
      src,
      depthSrc,
      onReady: () => setReady(true),
      onUnavailable: () => setReady(false),
    });
    return () => scene.stop();
  }, [src, depthSrc]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        opacity: ready ? 1 : 0,
        pointerEvents: "none",
      }}
    />
  );
}
