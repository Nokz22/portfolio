import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'

export default function CustomCursor() {
  const reduced = useReducedMotion()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // Also check native media query for initial render
  const prefersReduced =
    reduced ??
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (prefersReduced) return

    // Check for touch device
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    document.body.style.cursor = 'none'

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Current ring position for lerp
    let ringX = window.innerWidth / 2
    let ringY = window.innerHeight / 2
    let mouseX = ringX
    let mouseY = ringY
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.set(dot, { x: mouseX, y: mouseY })
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      gsap.set(ring, { x: ringX, y: ringY })
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    window.addEventListener('mousemove', onMove)

    // Scale ring on interactive elements
    const onEnter = (e: Event) => {
      const target = e.target as Element
      if (
        target.closest('[data-cursor="pointer"]') ||
        target.closest('a') ||
        target.closest('button')
      ) {
        gsap.to(ring, { scale: 1.5, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { opacity: 0, duration: 0.2 })
      }
    }

    const onLeave = (e: Event) => {
      const target = e.target as Element
      if (
        target.closest('[data-cursor="pointer"]') ||
        target.closest('a') ||
        target.closest('button')
      ) {
        gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { opacity: 1, duration: 0.2 })
      }
    }

    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      document.body.style.cursor = ''
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
    }
  }, [prefersReduced])

  if (prefersReduced) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
        aria-hidden="true"
      >
        <div className="w-2 h-2 rounded-full bg-accent" />
      </div>
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
        aria-hidden="true"
      >
        <div className="w-8 h-8 rounded-full border-2 border-accent opacity-70" />
      </div>
    </>
  )
}
