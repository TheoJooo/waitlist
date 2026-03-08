"use client"

import { useEffect, useRef, useState } from "react"
import { MeshGradient } from "@paper-design/shaders-react"
import { cn } from "@/lib/utils"

interface BackgroundPaperShadersProps {
  className?: string
  speed?: number
}

export default function BackgroundPaperShaders({
  className,
  speed = 0.6,
}: BackgroundPaperShadersProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setPrefersReducedMotion(mq.matches)
    onChange()
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.01 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const effectiveSpeed = prefersReducedMotion || !isVisible ? 0 : speed

  return (
    <div
      ref={rootRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 68%, rgba(0,0,0,0.92) 78%, rgba(0,0,0,0.72) 86%, rgba(0,0,0,0.45) 93%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, black 0%, black 68%, rgba(0,0,0,0.92) 78%, rgba(0,0,0,0.72) 86%, rgba(0,0,0,0.45) 93%, transparent 100%)",
      }}
    >
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={["#000000", "#171717", "#2f2f2f", "#f2f2f2"]}
        speed={effectiveSpeed}
        minPixelRatio={1}
        maxPixelCount={1600000}
      />
      <div className="absolute inset-0 bg-black/35" />
    </div>
  )
}
