"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type GlowTiltCardProps = {
  className?: string
  children: React.ReactNode
}

export default function GlowTiltCard({ className, children }: GlowTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const nextRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const flushFrame = () => {
    const card = cardRef.current
    if (!card) return
    const { x, y } = nextRotation.current
    card.style.transform = `perspective(1100px) rotateX(${x}deg) rotateY(${y}deg)`
    frameRef.current = null
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const px = (x / rect.width) * 100
    const py = (y / rect.height) * 100

    card.style.setProperty("--mx", `${px}%`)
    card.style.setProperty("--my", `${py}%`)

    nextRotation.current = {
      x: (0.5 - y / rect.height) * 6,
      y: (x / rect.width - 0.5) * 6,
    }

    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(flushFrame)
    }
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty("--mx", "50%")
    card.style.setProperty("--my", "50%")
    card.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)"
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
      className={cn(
        "group relative rounded-none border border-white/20 bg-[rgba(6,6,10,0.66)] backdrop-blur-md transition-transform duration-300 ease-out will-change-transform",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx) var(--my), rgba(255,255,255,0.2), rgba(255,255,255,0.06) 36%, transparent 66%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-none overflow-hidden">
        <div className="absolute inset-0 border border-white/25 transition-colors duration-300 group-hover:border-white/70" />
        <span
          className="absolute top-0 left-[-55%] h-[2px] w-[50%] bg-gradient-to-r from-transparent via-white/95 to-transparent opacity-55 blur-[0.8px]"
          style={{ animation: "card-beam-top 6.4s ease-in-out infinite" }}
        />
        <span
          className="absolute top-[-55%] right-0 h-[50%] w-[2px] bg-gradient-to-b from-transparent via-white/95 to-transparent opacity-55 blur-[0.8px]"
          style={{ animation: "card-beam-right 6.4s ease-in-out infinite 1.6s" }}
        />
        <span
          className="absolute bottom-0 right-[-55%] h-[2px] w-[50%] bg-gradient-to-r from-transparent via-white/95 to-transparent opacity-55 blur-[0.8px]"
          style={{ animation: "card-beam-bottom 6.4s ease-in-out infinite 3.2s" }}
        />
        <span
          className="absolute bottom-[-55%] left-0 h-[50%] w-[2px] bg-gradient-to-b from-transparent via-white/95 to-transparent opacity-55 blur-[0.8px]"
          style={{ animation: "card-beam-left 6.4s ease-in-out infinite 4.8s" }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-none p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx) var(--my), rgba(255,255,255,0.7), rgba(255,255,255,0.22) 45%, transparent 75%)",
        }}
      >
        <div className="h-full w-full rounded-none bg-[rgba(6,6,10,0.66)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-none border border-white/20 transition-colors duration-300 group-hover:border-white/60" />
      <div className="relative z-10">{children}</div>
      <style jsx>{`
        @keyframes card-beam-top {
          0% { transform: translateX(0); opacity: 0.2; }
          35% { opacity: 0.9; }
          100% { transform: translateX(320%); opacity: 0.2; }
        }
        @keyframes card-beam-right {
          0% { transform: translateY(0); opacity: 0.2; }
          35% { opacity: 0.9; }
          100% { transform: translateY(320%); opacity: 0.2; }
        }
        @keyframes card-beam-bottom {
          0% { transform: translateX(0); opacity: 0.2; }
          35% { opacity: 0.9; }
          100% { transform: translateX(-320%); opacity: 0.2; }
        }
        @keyframes card-beam-left {
          0% { transform: translateY(0); opacity: 0.2; }
          35% { opacity: 0.9; }
          100% { transform: translateY(-320%); opacity: 0.2; }
        }
      `}</style>
    </div>
  )
}
