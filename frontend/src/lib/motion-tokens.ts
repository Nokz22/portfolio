// Motion constants — single source of truth for all animations.
// Mirror of CSS custom properties in globals.css and tailwind.config.ts.
// Pass these to GSAP, Framer Motion, and CSS-in-JS rather than hardcoding.

export const easings = {
  outExpo:  [0.16, 1, 0.3, 1],
  outCubic: [0.33, 1, 0.68, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inCubic:  [0.32, 0, 0.67, 0],
} as const satisfies Record<string, readonly [number, number, number, number]>

export const durations = {
  instant:  0.15,  // seconds (GSAP convention)
  fast:     0.30,
  moderate: 0.50,
  slow:     0.70,
} as const

// Framer Motion variants for common patterns
export const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.moderate, ease: easings.outExpo },
  },
} as const

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.fast, ease: easings.outCubic },
  },
} as const

export type EasingName = keyof typeof easings
export type DurationName = keyof typeof durations
