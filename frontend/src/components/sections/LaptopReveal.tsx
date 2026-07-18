import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, cubicBezier } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AmbientOrbs from '@/components/ui/AmbientOrbs'

// Real MacBook display ratio (~16:10.3) — CSS aspect-ratio keeps the screen
// correctly proportioned at any width with no JS measurement needed.
const SCREEN_ASPECT = '16 / 10.3'

// A weighted, physical-feeling curve for the hinge: slow to start (as if
// overcoming resistance), swings freely through the middle, settles softly
// at fully open — never a linear scroll-locked rotation.
const hingeEase = cubicBezier(0.65, 0, 0.35, 1)

// Terminal lines shown once the screen powers on
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
  { txt: 'nuno@portfolio:~$ █', cls: 'text-amber-400' },
]

// Small key block for the keyboard grid — light aluminum keycap
function Key({ flex = 1 }: { flex?: number }) {
  return (
    <div
      style={{
        flex,
        height: 'clamp(10px, 1.8vw, 18px)',
        background: '#f2f3f5',
        borderRadius: 3,
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    />
  )
}

function TerminalContent() {
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
          fontSize: 'clamp(8.5px, 1.35vw, 12.5px)',
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.78)',
        }}
      >
        {LINES.map((line, i) => (
          <div key={i} className={line.cls}>
            {line.txt || ' '}
          </div>
        ))}
      </div>
    </>
  )
}

// Keyboard deck + trackpad — identical for both the animated and the
// reduced-motion static variant.
function KeyboardDeck() {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #e8eaed 0%, #d2d5da 100%)',
        borderRadius: '0 0 16px 16px',
        padding: '12px 18px 8px',
        boxShadow: '0 14px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.7)',
      }}
    >
      <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <Key key={i} />
        ))}
      </div>
      {[14, 14, 13, 11].map((count, row) => (
        <div key={row} style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
          {Array.from({ length: count }).map((_, i) => (
            <Key key={i} flex={row === 3 && (i === 0 || i === count - 1) ? 1.8 : 1} />
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
        {[1, 1, 4, 1, 1].map((flex, i) => (
          <Key key={i} flex={flex} />
        ))}
      </div>
      <div
        style={{
          width: '36%',
          height: 'clamp(34px, 4.5vw, 56px)',
          background: '#dde0e4',
          borderRadius: 6,
          margin: '0 auto 4px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.6)',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      />
    </div>
  )
}

// Reduced-motion fallback — a static, fully open, screen-on laptop with no
// scroll-jacking. Keeps the same visual language without forcing motion.
function StaticLaptop() {
  const { t } = useTranslation()
  return (
    <section className="relative bg-[#0c0c10] py-24 px-6 overflow-hidden" aria-label="MacBook">
      <AmbientOrbs intensity={0.5} />
      <div
        className="relative z-10 mx-auto flex flex-col items-center"
        style={{ width: 'min(92vw, 640px)' }}
        aria-hidden="true"
      >
        <div style={{ paddingLeft: '3%', paddingRight: '3%' }}>
          <div
            style={{
              background: 'linear-gradient(180deg, #eef0f3 0%, #d8dbe0 100%)',
              borderRadius: '16px 16px 0 0',
              padding: '9px 9px 0',
              boxShadow:
                '0 -4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 3 }}>
              <div style={{ width: '14%', minWidth: 28, height: 7, borderRadius: 999, background: '#101012' }} />
            </div>
            <div
              style={{
                aspectRatio: SCREEN_ASPECT,
                overflow: 'hidden',
                background: '#08080d',
                borderRadius: '6px 6px 0 0',
                padding: '14px 18px',
              }}
            >
              <TerminalContent />
            </div>
          </div>
        </div>
        <div
          style={{
            height: 4,
            width: '100%',
            background: 'linear-gradient(180deg, #9a9da3 0%, #6b6e73 50%, #babdc2 100%)',
          }}
        />
        <div style={{ width: '100%' }}>
          <KeyboardDeck />
        </div>
      </div>
      <p className="relative z-10 text-center text-white/40 text-sm mt-8">{t('laptop.open_env')}</p>
    </section>
  )
}

export default function LaptopReveal() {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Laptop fades in at the very start
  const laptopOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1])

  // Raw scroll fraction dedicated to the hinge, then eased for weight —
  // this is what makes it feel like a real lid rather than a value slider.
  const rawOpen = useTransform(scrollYProgress, [0.05, 0.6], [0, 1])
  const easedOpen = useTransform(rawOpen, hingeEase)
  const screenTilt = useTransform(easedOpen, [0, 1], [84, 0])

  // Glass reflection sweeping across the screen as it rotates — the cue
  // that reads as "real material catching light," not a flat shape turning.
  const sheenX = useTransform(easedOpen, [0, 1], ['-60%', '160%'])
  const sheenOpacity = useTransform(easedOpen, [0, 0.45, 1], [0, 0.5, 0.08])

  // Ambient occlusion in the hinge crease — deepest while closed, fading
  // as the lid lifts clear of the deck.
  const hingeShadowOpacity = useTransform(screenTilt, [84, 0], [0.85, 0.15])

  // The screen "powers on" as a distinct beat once the lid has finished
  // opening: a quick bright pulse, a lingering backlight, then — a moment
  // later — the terminal content fades up.
  const powerOnOpacity = useTransform(scrollYProgress, [0.58, 0.63, 0.68], [0, 1, 0])
  const backlightOpacity = useTransform(scrollYProgress, [0.58, 0.66], [0, 1])
  const contentOpacity = useTransform(scrollYProgress, [0.64, 0.78], [0, 1])
  const contentY = useTransform(scrollYProgress, [0.64, 0.78], [8, 0])

  const glowOpacity = useTransform(scrollYProgress, [0.4, 0.66], [0, 0.9])
  const groundShadowScale = useTransform(easedOpen, [0, 1], [0.85, 1])

  const labelOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12, 0.18], [1, 1, 0.5, 0])
  const labelY = useTransform(scrollYProgress, [0, 0.18], ['0px', '-36px'])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1.0], [0, 0.45, 0.45, 0])

  if (reduced) return <StaticLaptop />

  return (
    <div ref={containerRef} style={{ height: '290vh' }} className="relative">
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#0c0c10' }}
      >
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
          style={{ opacity: labelOpacity, y: labelY, top: '10%' }}
          aria-hidden="true"
        >
          <p className="text-white/25 text-[10px] tracking-[0.35em] uppercase">{t('laptop.scroll_label')}</p>
          <p className="text-white/50 text-base font-display font-medium tracking-tight">{t('laptop.open_env')}</p>
        </motion.div>

        {/* ── MacBook ── */}
        <motion.div
          style={{ opacity: laptopOpacity, perspective: 1400 }}
          className="flex flex-col items-center w-full px-4"
          aria-hidden="true"
        >
          {/* Slight fixed camera tilt — matches a laptop shot from just above eye level */}
          <div style={{ width: 'min(92vw, 640px)', transform: 'rotateX(8deg)', transformStyle: 'preserve-3d' }}>
            <div style={{ paddingLeft: '3%', paddingRight: '3%', position: 'relative', perspective: 900 }}>
              {/* The entire lid — bezel, notch and screen together — rotates
                  as one rigid unit on its bottom hinge. Only the screen
                  rotating (and not the bezel around it) was the earlier bug:
                  a "closed" laptop rendered as a full-height silver panel
                  with a tiny foreshortened screen floating inside it instead
                  of a thin closed lid. */}
              <motion.div
                style={{
                  background: 'linear-gradient(180deg, #eef0f3 0%, #d8dbe0 100%)',
                  borderRadius: '16px 16px 0 0',
                  padding: '9px 9px 0',
                  boxShadow:
                    '0 -4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.06)',
                  transformOrigin: 'bottom center',
                  rotateX: screenTilt,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 3 }}>
                  <div style={{ width: '14%', minWidth: 28, height: 7, borderRadius: 999, background: '#101012' }} />
                </div>

                {/* Screen surface — stays flat within the rotating lid */}
                <div
                  style={{
                    aspectRatio: SCREEN_ASPECT,
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#08080d',
                    borderRadius: '6px 6px 0 0',
                    padding: '14px 18px',
                  }}
                >
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
                      opacity: backlightOpacity,
                      background: 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.06) 0%, transparent 60%)',
                      pointerEvents: 'none',
                    }}
                  />

                  <motion.div style={{ opacity: contentOpacity, y: contentY, position: 'relative' }}>
                    <TerminalContent />
                  </motion.div>

                  {/* Power-on flash */}
                  <motion.div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: powerOnOpacity,
                      background:
                        'radial-gradient(circle at 50% 45%, rgba(255,250,240,0.95) 0%, rgba(224,123,0,0.35) 35%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </motion.div>

              {/* Hinge crease shadow — deepest while closed */}
              <motion.div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '3%',
                  right: '3%',
                  bottom: -2,
                  height: 12,
                  opacity: hingeShadowOpacity,
                  background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.55) 70%)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Hinge */}
            <div
              style={{
                height: 4,
                background: 'linear-gradient(180deg, #9a9da3 0%, #6b6e73 50%, #babdc2 100%)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}
            />

            <KeyboardDeck />

            {/* Bottom rim */}
            <div
              style={{
                height: 5,
                background: 'linear-gradient(180deg, #d2d5da 0%, #b8bbc1 100%)',
                borderRadius: '0 0 6px 6px',
                boxShadow: '0 10px 28px rgba(0,0,0,0.55)',
              }}
            />

            {/* Ground shadow — sells the laptop as sitting in the scene, and
                widens slightly as the lid opens for a subtle sense of weight */}
            <motion.div
              aria-hidden="true"
              style={{
                opacity: laptopOpacity,
                scaleX: groundShadowScale,
                width: '70%',
                height: 'clamp(14px, 2.5vw, 24px)',
                margin: '10px auto 0',
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 72%)',
              }}
            />
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
