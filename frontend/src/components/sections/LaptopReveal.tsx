import { useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  cubicBezier,
  type MotionValue,
} from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AmbientOrbs from '@/components/ui/AmbientOrbs'

// ─── True-3D construction ────────────────────────────────────────────────
// The laptop is built like a CSS 3D object, not a flat mockup: one
// perspective "camera", one rig (pitch / yaw / scale, all scroll-driven),
// and a hinge box the size of the screen. Deck and lid are two planes
// hinged on the box's bottom edge:
//   - deck: static rotateX(-90) lies flat toward the viewer; an inner
//     rotateX(180) flip turns its visible face up without mirroring
//   - lid: scroll-scrubbed rotateX from -90 (closed, flat on the deck,
//     aluminum shell facing up) to slightly past vertical (open)
// Each lid side is its own face with backface-visibility:hidden, so the
// shell shows while closed and the display shows while open — exactly
// like a real object turning in space.

const SCREEN_ASPECT = '16 / 10.3'
const PERSPECTIVE = 1500
// -90 exactly is a degenerate case for Safari's 3D compositor: a plane
// rotated to dead-perpendicular inside nested preserve-3d gets silently
// culled (this is what made the whole deck vanish in Safari/iOS — every
// wall of the extruded body hinges on a "-90"). Every cardinal rotation
// below is nudged a fraction of a degree off-axis so WebKit keeps a
// non-degenerate transform matrix; the offset is invisible.
const SAFARI_EPSILON = 25

// Safari's 3D compositor doesn't reliably resolve `translateZ() rotateX()`
// composed in a CSS transform list at a near-90deg fold (the deck ends up
// silently culled — see the deck's render comment below). A raw matrix3d
// sidesteps whatever Safari does internally to decompose/recompose chained
// transform functions. This is the standard "translate after rotate, both
// about the same origin" matrix: rotateX(deg) with a Z-translate of depthPx
// baked into row 3 (see the deck comment for the derivation).
function deckFoldMatrix(deg: number, depthPx: number): string {
  const rad = (deg * Math.PI) / 180
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  return `matrix3d(1,0,0,0, 0,${String(c)},${String(s)},0, 0,${String(-s)},${String(c)},0, 0,0,${String(depthPx)},1)`
}

// Same Safari near-90deg reasoning applies to the extruded walls — a plain
// matrix3d for a pure rotateX/rotateY, no translate term needed.
function rotateXMatrix(deg: number): string {
  const rad = (deg * Math.PI) / 180
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  return `matrix3d(1,0,0,0, 0,${String(c)},${String(s)},0, 0,${String(-s)},${String(c)},0, 0,0,0,1)`
}
function rotateYMatrix(deg: number): string {
  const rad = (deg * Math.PI) / 180
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  return `matrix3d(${String(c)},0,${String(-s)},0, 0,1,0,0, ${String(s)},0,${String(c)},0, 0,0,0,1)`
}
const LID_CLOSED = -90 + SAFARI_EPSILON // folded flat onto the deck
const LID_OPEN = 8 // a touch past vertical — natural recline
const DECK_THICKNESS = 12 // px, extruded body height

const ALU_TOP = 'linear-gradient(180deg, #3c3d41 0%, #2b2c2f 55%, #1d1e20 100%)'
const ALU_SHELL = 'linear-gradient(160deg, #38393d 0%, #28292c 60%, #191a1c 100%)'
const ALU_EDGE = 'linear-gradient(180deg, #2e2f32 0%, #1e1f21 55%, #121213 100%)'

// Weighted hinge: slow to unstick, free through the middle, soft settle.
const hingeEase = cubicBezier(0.65, 0, 0.35, 1)

const LINES = [
  { txt: 'nuno@portfolio:~$ cat about.json', cls: 'text-amber-400' },
  { txt: '', cls: '' },
  { txt: '{', cls: 'text-white/40' },
  { txt: '  "name":     "Nuno Ferreira",', cls: 'text-white/80' },
  { txt: '  "role":     "Junior Developer",', cls: 'text-white/80' },
  { txt: '  "location": "Porto, Portugal",', cls: 'text-white/80' },
  { txt: '  "stack":    ["React","Spring Boot","Docker"],', cls: 'text-sky-300' },
  { txt: '  "available": true', cls: 'text-emerald-400' },
  { txt: '}', cls: 'text-white/40' },
  { txt: '', cls: '' },
  { txt: 'nuno@portfolio:~$ npm run dev', cls: 'text-amber-400' },
  { txt: '', cls: '' },
  { txt: '  VITE v5.4  ready in 187ms', cls: 'text-emerald-400' },
  { txt: '  ➜  Local:  http://localhost:3000/', cls: 'text-sky-400' },
  { txt: '', cls: '' },
]

function Key({ flex = 1 }: { flex?: number }) {
  return (
    <div
      style={{
        flex,
        background: 'linear-gradient(150deg, #4c4d52 0%, #35363a 55%, #222327 100%)',
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.35)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.14)',
      }}
    />
  )
}

// Terminal lines reveal one by one as the scroll advances — the screen
// "types itself" while the user scrolls instead of fading in as a block.
function TerminalLine({
  progress,
  index,
  total,
  txt,
  cls,
}: {
  progress: MotionValue<number>
  index: number
  total: number
  txt: string
  cls: string
}) {
  const start = index / total
  const opacity = useTransform(progress, [start, Math.min(start + 0.06, 1)], [0, 1])
  return (
    <motion.div style={{ opacity }} className={cls}>
      {txt || ' '}
    </motion.div>
  )
}

function TerminalContent({ progress }: { progress: MotionValue<number> }) {
  const total = LINES.length + 1
  const promptOpacity = useTransform(progress, [LINES.length / total, 1], [0, 1])
  return (
    <>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <span
          style={{
            marginLeft: 8,
            color: 'rgba(255,255,255,0.22)',
            fontSize: 'clamp(8px, 1.1vw, 11px)',
            fontFamily: 'ui-monospace,"Cascadia Code","Fira Code",Menlo,monospace',
          }}
        >
          zsh — 80×24
        </span>
      </div>
      <div
        style={{
          fontFamily: 'ui-monospace,"Cascadia Code","Fira Code",Menlo,monospace',
          fontSize: 'clamp(8.5px, 1.3vw, 12px)',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.78)',
        }}
      >
        {LINES.map((line, i) => (
          <TerminalLine key={i} progress={progress} index={i} total={total} txt={line.txt} cls={line.cls} />
        ))}
        <motion.div style={{ opacity: promptOpacity }} className="text-amber-400">
          nuno@portfolio:~${' '}
          <span style={{ animation: 'lr-blink 1.1s steps(2, start) infinite' }}>█</span>
        </motion.div>
      </div>
    </>
  )
}

// Top face of the deck — keyboard well, keys, trackpad, and a screen-light
// wash that switches on with the display.
function DeckFace({ backlight }: { backlight: MotionValue<number> }) {
  const glowOpacity = useTransform(backlight, [0, 1], [0, 0.38])
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 16,
        overflow: 'hidden',
        background: ALU_TOP,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -2px 8px rgba(0,0,0,0.45)',
      }}
    >
      {/* Diagonal light across the anodized deck */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 55%, rgba(255,255,255,0.14) 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* Keyboard well — slightly recessed */}
      <div
        style={{
          position: 'absolute',
          top: '7%',
          left: '10%',
          right: '10%',
          height: '54%',
          borderRadius: 10,
          background: 'linear-gradient(180deg, #191a1c 0%, #101112 100%)',
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.5)',
          padding: '1.4%',
          display: 'flex',
          flexDirection: 'column',
          gap: '3.5%',
        }}
      >
        <div style={{ display: 'flex', gap: '0.9%', flex: 0.62 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <Key key={i} />
          ))}
        </div>
        {[14, 14, 13, 11].map((count, row) => (
          <div key={row} style={{ display: 'flex', gap: '0.9%', flex: 1 }}>
            {Array.from({ length: count }).map((_, i) => (
              <Key key={i} flex={row === 3 && (i === 0 || i === count - 1) ? 1.8 : 1} />
            ))}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '0.9%', flex: 1 }}>
          {[1, 1, 4, 1, 1].map((flex, i) => (
            <Key key={i} flex={flex} />
          ))}
        </div>
      </div>
      {/* Trackpad */}
      <div
        style={{
          position: 'absolute',
          top: '67%',
          left: '32%',
          right: '32%',
          height: '27%',
          borderRadius: 10,
          background: 'linear-gradient(160deg, #2c2d31 0%, #1a1b1d 100%)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      />
      {/* Screen light falling on the deck once the display powers on */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: glowOpacity,
          background:
            'linear-gradient(180deg, rgba(255,190,90,0.30) 0%, rgba(255,190,90,0.06) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default function LaptopReveal() {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const hingeBoxRef = useRef<HTMLDivElement>(null)

  // The deck's fold is expressed as a single rotateX + a translateZ measured
  // to exactly match the hinge box's own rendered depth (see the deck's
  // comment below for why it's built this way instead of nesting a second
  // preserve-3d "flip" div). Measured live since the box is fluid-width.
  const [deckDepth, setDeckDepth] = useState(0)
  useLayoutEffect(() => {
    const el = hingeBoxRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setDeckDepth(entry.contentRect.height)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Pointer parallax — the object subtly follows the cursor, which is a big
  // part of the "alive" lusion.co feel. Springed so it glides, never snaps.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 55, damping: 16 })
  const springY = useSpring(pointerY, { stiffness: 55, damping: 16 })
  const parallax = reduced ? 0 : 1

  const appear = useTransform(scrollYProgress, [0, 0.04], [0, 1])

  // The hinge scrub — the heart of the section.
  const rawOpen = useTransform(scrollYProgress, [0.05, 0.62], [0, 1])
  const eased = useTransform(rawOpen, hingeEase)
  const lidAngle = useTransform(eased, [0, 1], [LID_CLOSED, LID_OPEN])

  // Camera choreography: constant slow yaw drift across the whole section
  // (so the object never sits still), and a pitch that starts top-down on
  // the closed slab and lowers as the screen rises.
  const yawBase = useTransform(scrollYProgress, [0.02, 0.98], [-16, 6])
  const pitchBase = useTransform(scrollYProgress, [0.05, 0.62, 1], [-31, -24, -22])
  const rigYaw = useTransform([yawBase, springX], (v: number[]) => (v[0] ?? 0) + (v[1] ?? 0) * 4.5 * parallax)
  const rigPitch = useTransform([pitchBase, springY], (v: number[]) => (v[0] ?? 0) + (v[1] ?? 0) * 3 * parallax)
  const rigScale = useTransform(scrollYProgress, [0, 0.62, 1], [0.88, 0.97, 1.0])
  const rigY = useTransform(eased, [0, 1], [30, -4])

  // Glass reflection sweeping the display as the lid turns through the light
  const sheenX = useTransform(eased, [0, 1], ['-80%', '180%'])
  const sheenOpacity = useTransform(eased, [0, 0.5, 1], [0, 0.45, 0.06])

  // Power-on beat once the lid is up: flash, then backlight, then the
  // terminal types itself line by line.
  const powerOn = useTransform(scrollYProgress, [0.6, 0.645, 0.7], [0, 1, 0])
  const backlight = useTransform(scrollYProgress, [0.6, 0.7], [0, 1])
  const contentProgress = useTransform(scrollYProgress, [0.64, 0.88], [0, 1])

  const glowOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 0.9])
  const shadowScaleX = useTransform(eased, [0, 1], [1.06, 0.94])
  const shadowOpacity = useTransform(eased, [0, 1], [0.6, 0.42])

  const labelOpacity = useTransform(scrollYProgress, [0, 0.04, 0.1, 0.16], [1, 1, 0.5, 0])
  const labelY = useTransform(scrollYProgress, [0, 0.16], ['0px', '-36px'])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0, 0.45, 0.45, 0])

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced) return
    pointerX.set((e.clientX / window.innerWidth) * 2 - 1)
    pointerY.set((e.clientY / window.innerHeight) * 2 - 1)
  }
  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div ref={containerRef} style={{ height: '320vh' }} className="relative">
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#0c0c10' }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <style>{`
          @keyframes lr-float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
          @keyframes lr-blink { 0%, 55% { opacity: 1 } 56%, 100% { opacity: 0 } }
        `}</style>
        <AmbientOrbs intensity={0.7} />

        {/* Ambient screen glow — intensifies once the display powers on */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: glowOpacity }} aria-hidden="true">
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '55%',
              height: '55%',
              background: 'radial-gradient(ellipse at 50% 70%, rgba(224,123,0,0.14) 0%, transparent 70%)',
            }}
          />
        </motion.div>

        <motion.div
          className="absolute flex flex-col items-center gap-1.5 select-none pointer-events-none"
          style={{ opacity: labelOpacity, y: labelY, top: '9%' }}
          aria-hidden="true"
        >
          <p className="text-white/25 text-[10px] tracking-[0.35em] uppercase">{t('laptop.scroll_label')}</p>
          <p className="text-white/50 text-base font-display font-medium tracking-tight">{t('laptop.open_env')}</p>
        </motion.div>

        {/* ── MacBook: 3D scene ── */}
        <motion.div
          style={{
            opacity: appear,
            animation: reduced ? undefined : 'lr-float 7s ease-in-out infinite',
          }}
          aria-hidden="true"
        >
          {/* Camera */}
          <div style={{ perspective: PERSPECTIVE, width: 'min(78vw, 620px)', marginTop: '-12vh', position: 'relative' }}>
            {/* Ground shadow — painted before (under) the laptop */}
            <motion.div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '10%',
                width: '80%',
                top: 'calc(100% + 150px)',
                height: 44,
                scaleX: shadowScaleX,
                opacity: shadowOpacity,
                background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.6) 0%, transparent 70%)',
                filter: 'blur(6px)',
              }}
            />
            {/* Rig — the whole body shares this pitch / yaw / scale */}
            <motion.div
              style={{
                transformStyle: 'preserve-3d',
                rotateX: rigPitch,
                rotateY: rigYaw,
                scale: rigScale,
                y: rigY,
                willChange: 'transform',
              }}
            >
              {/* Hinge box — the screen rect; both planes hinge on its bottom edge */}
              <div
                ref={hingeBoxRef}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: SCREEN_ASPECT,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* ── LID: scroll-scrubbed hinge rotation ──
                    Rendered BEFORE the deck on purpose (see the deck's
                    comment below the closing </motion.div> for why —
                    Safari paints preserve-3d siblings in DOM order rather
                    than true depth order, so whichever renders second wins
                    any overlap). */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transformOrigin: 'bottom center',
                    transformStyle: 'preserve-3d',
                    rotateX: lidAngle,
                    z: 1,
                    willChange: 'transform',
                  }}
                >
                  {/* Outer shell — what you see while it's closed */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transform: 'rotateX(180deg) translateZ(1.5px)',
                      backfaceVisibility: 'hidden',
                      borderRadius: 14,
                      background: ALU_SHELL,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -8px 18px rgba(0,0,0,0.35)',
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 14,
                        background:
                          'linear-gradient(135deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 55%, rgba(255,255,255,0.16) 100%)',
                      }}
                    />
                    {/* Logo — etched into the lid, glossy against the matte shell */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          fontSize: 'clamp(20px, 3vw, 34px)',
                          lineHeight: 1,
                          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5)) drop-shadow(0 -1px 0.5px rgba(255,255,255,0.15))',
                          opacity: 0.92,
                        }}
                      >
                        🍓
                      </span>
                    </div>
                  </div>

                  {/* Display side — aluminum rim, black bezel, screen */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transform: 'translateZ(1.5px)',
                      backfaceVisibility: 'hidden',
                      borderRadius: 14,
                      background: ALU_SHELL,
                      padding: 5,
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        borderRadius: 11,
                        background: '#08080d',
                        overflow: 'hidden',
                        padding: 'clamp(10px, 2.6%, 20px) clamp(12px, 3%, 24px)',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                      }}
                    >
                      {/* Notch */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '13%',
                          minWidth: 26,
                          height: 8,
                          borderRadius: '0 0 8px 8px',
                          background: '#101014',
                        }}
                      />

                      {/* Glass reflection sweep */}
                      <motion.div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: '-20%',
                          width: '45%',
                          x: sheenX,
                          opacity: sheenOpacity,
                          background:
                            'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
                          mixBlendMode: 'screen',
                          pointerEvents: 'none',
                        }}
                      />

                      {/* Backlight vignette once powered on */}
                      <motion.div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: backlight,
                          background: 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.06) 0%, transparent 60%)',
                          pointerEvents: 'none',
                        }}
                      />

                      <div style={{ position: 'relative', marginTop: 8 }}>
                        <TerminalContent progress={contentProgress} />
                      </div>

                      {/* Power-on flash */}
                      <motion.div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: powerOn,
                          background:
                            'radial-gradient(circle at 50% 45%, rgba(255,250,240,0.95) 0%, rgba(224,123,0,0.35) 35%, transparent 70%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* ── DECK: lies flat toward the viewer ──
                    Rendered AFTER the lid — see the lid's comment above.
                    Safari doesn't true-depth-sort preserve-3d siblings, it
                    paints them in DOM order, so the deck has to come last
                    to stay visible once the lid has rotated open and no
                    longer physically covers it (their screen-space boxes
                    still overlap at this camera angle even when open,
                    which is what made the deck vanish before this reorder).
                    A raw matrix3d (see deckFoldMatrix above), not a chained
                    `translateZ() rotateX()`, because Safari also doesn't
                    reliably resolve that composed near-90deg fold on its
                    own — a single literal matrix sidesteps whatever it does
                    internally to decompose/recompose chained functions;
                    deckFoldMatrix's translate term lines the fold up
                    exactly where an earlier two-div fold+flip version used
                    to land it (verified by tracking reference points
                    through both versions' matrices). */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transformOrigin: 'bottom center',
                    transform: deckFoldMatrix(90 - SAFARI_EPSILON, deckDepth),
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <DeckFace backlight={backlight} />
                  {/* Front edge wall — the visible body thickness */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 6,
                      right: 6,
                      height: DECK_THICKNESS,
                      transformOrigin: 'top center',
                      transform: rotateXMatrix(-90 + SAFARI_EPSILON),
                      background: ALU_EDGE,
                      borderRadius: '0 0 12px 12px',
                    }}
                  />
                  {/* Side walls */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      bottom: 6,
                      left: '100%',
                      width: DECK_THICKNESS,
                      transformOrigin: 'left center',
                      transform: rotateYMatrix(90 - SAFARI_EPSILON),
                      background: '#28292c',
                      borderRadius: '0 0 4px 4px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      bottom: 6,
                      right: '100%',
                      width: DECK_THICKNESS,
                      transformOrigin: 'right center',
                      transform: rotateYMatrix(-90 + SAFARI_EPSILON),
                      background: '#28292c',
                      borderRadius: '0 0 4px 4px',
                    }}
                  />
                  {/* Bottom plate */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 3,
                      transform: `translateZ(-${String(DECK_THICKNESS)}px)`,
                      borderRadius: 16,
                      background: '#141516',
                    }}
                  />
                </div>

                {/* Hinge bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: '18%',
                    right: '18%',
                    bottom: -3,
                    height: 6,
                    borderRadius: 3,
                    background: 'linear-gradient(180deg, #38393d 0%, #1a1b1d 100%)',
                    transform: 'translateZ(0.5px)',
                  }}
                />
              </div>
            </motion.div>

          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ opacity: hintOpacity }}
          aria-hidden="true"
        >
          <motion.svg
            className="w-5 h-5 text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  )
}
