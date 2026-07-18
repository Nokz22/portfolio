import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AmbientOrbs from '@/components/ui/AmbientOrbs'

// Real MacBook display ratio (~16:10.3). The screen box's height is derived
// from its measured width so it never looks stretched at any viewport size.
const SCREEN_ASPECT = 16 / 10.3

// Terminal lines shown when screen opens
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

export default function LaptopReveal() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const screenBoxRef = useRef<HTMLDivElement>(null)
  const [screenWidth, setScreenWidth] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Measure the screen box's actual rendered width so its target height can
  // be derived from a real aspect ratio instead of a fixed pixel value —
  // a fixed height looked badly stretched on narrow (mobile) viewports.
  useEffect(() => {
    const el = screenBoxRef.current
    if (!el) return
    const update = () => { setScreenWidth(el.offsetWidth) }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => { ro.disconnect() }
  }, [])

  // screenWidth is the housing's outer width; subtract its own 10px+10px
  // inner padding to get the actual screen box width the ratio applies to.
  const screenTargetHeight = Math.max(screenWidth - 20, 0) / SCREEN_ASPECT

  // Laptop fades in at the start
  const laptopOpacity  = useTransform(scrollYProgress, [0, 0.10], [0, 1])
  // Screen lid height: 0 → full (the "opening" motion)
  const screenH        = useTransform(scrollYProgress, [0.08, 0.78], [0, screenTargetHeight])
  // Perspective tilt while lid opens (creates 3D lid illusion)
  const screenTilt     = useTransform(scrollYProgress, [0.08, 0.78], [52, 0])
  // Terminal content appears only when screen is mostly open
  const contentOpacity = useTransform(scrollYProgress, [0.55, 0.78], [0, 1])
  // Ambient screen glow intensifies as screen opens
  const glowOpacity    = useTransform(scrollYProgress, [0.35, 0.78], [0, 0.9])
  // Label above laptop fades away as laptop opens
  const labelOpacity   = useTransform(scrollYProgress, [0, 0.15, 0.30, 0.40], [1, 1, 0.5, 0])
  const labelY         = useTransform(scrollYProgress, [0, 0.40], ['0px', '-36px'])
  // Scroll hint
  const hintOpacity    = useTransform(scrollYProgress, [0, 0.05, 0.88, 1.0], [0, 0.45, 0.45, 0])

  return (
    <div ref={containerRef} style={{ height: '290vh' }} className="relative">
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#0c0c10' }}
      >
        {/* ── Ambient orbs ── */}
        <AmbientOrbs intensity={0.7} />

        {/* ── Screen glow intensifies as lid opens ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: glowOpacity }}
          aria-hidden="true"
        >
          <div style={{
            position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
            width: '55%', height: '55%',
            background: 'radial-gradient(ellipse at 50% 70%, rgba(224,123,0,0.14) 0%, transparent 70%)',
          }} />
        </motion.div>

        {/* ── Label ── */}
        <motion.div
          className="absolute flex flex-col items-center gap-1.5 select-none pointer-events-none"
          style={{ opacity: labelOpacity, y: labelY, top: '10%' }}
          aria-hidden="true"
        >
          <p className="text-white/25 text-[10px] tracking-[0.35em] uppercase">{t('laptop.scroll_label')}</p>
          <p className="text-white/50 text-base font-display font-medium tracking-tight">{t('laptop.open_env')}</p>
        </motion.div>

        {/* ── MacBook ── */}
        <motion.div style={{ opacity: laptopOpacity }} className="flex flex-col items-center w-full px-4">
          <div style={{ width: 'min(92vw, 640px)' }}>

            {/* Screen housing — light aluminum, like a real MacBook lid */}
            <div ref={screenBoxRef} style={{ paddingLeft: '3%', paddingRight: '3%' }}>
              <div style={{
                background: 'linear-gradient(180deg, #eef0f3 0%, #d8dbe0 100%)',
                borderRadius: '16px 16px 0 0',
                padding: '9px 9px 0',
                boxShadow: '0 -4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.06)',
              }}>
                {/* Camera notch */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 3,
                }}>
                  <div style={{ width: '14%', minWidth: 28, height: 7, borderRadius: 999, background: '#101012' }} />
                </div>

                {/* Screen — height animated for lid-opening effect */}
                <motion.div
                  style={{
                    height: screenH,
                    overflow: 'hidden',
                    background: '#08080d',
                    borderRadius: '6px 6px 0 0',
                    perspective: '700px',
                  }}
                >
                  {/* Inner content with tilt for 3D illusion */}
                  <motion.div
                    style={{
                      rotateX: screenTilt,
                      transformOrigin: 'bottom center',
                      height: screenTargetHeight || undefined,
                      padding: '14px 18px',
                    }}
                  >
                    {/* macOS traffic lights */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center' }}>
                      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                        <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                      ))}
                      <span style={{
                        marginLeft: 8,
                        color: 'rgba(255,255,255,0.22)',
                        fontSize: 'clamp(8px, 1.1vw, 11px)',
                        fontFamily: 'ui-monospace,"Cascadia Code","Fira Code",Menlo,monospace',
                      }}>
                        zsh — 80×24
                      </span>
                    </div>

                    {/* Terminal text */}
                    <motion.div
                      style={{
                        opacity: contentOpacity,
                        fontFamily: 'ui-monospace,"Cascadia Code","Fira Code",Menlo,monospace',
                        fontSize: 'clamp(8.5px, 1.35vw, 12.5px)',
                        lineHeight: 1.75,
                        color: 'rgba(255,255,255,0.78)',
                      }}
                    >
                      {LINES.map((line, i) => (
                        <div key={i} className={line.cls}>
                          {line.txt || ' '}
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>

              </div>
            </div>

            {/* Hinge — thin recessed line where lid meets the deck */}
            <div style={{
              height: 4,
              background: 'linear-gradient(180deg, #9a9da3 0%, #6b6e73 50%, #babdc2 100%)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }} />

            {/* Keyboard base — light aluminum deck */}
            <div style={{
              background: 'linear-gradient(180deg, #e8eaed 0%, #d2d5da 100%)',
              borderRadius: '0 0 16px 16px',
              padding: '12px 18px 8px',
              boxShadow: '0 14px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.7)',
            }}>
              {/* Function row */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
                {Array.from({ length: 14 }).map((_, i) => <Key key={i} />)}
              </div>
              {/* 4 typing rows */}
              {[14, 14, 13, 11].map((count, row) => (
                <div key={row} style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
                  {Array.from({ length: count }).map((_, i) => (
                    <Key key={i} flex={row === 3 && (i === 0 || i === count - 1) ? 1.8 : 1} />
                  ))}
                </div>
              ))}
              {/* Spacebar row */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                {[1, 1, 4, 1, 1].map((flex, i) => <Key key={i} flex={flex} />)}
              </div>
              {/* Trackpad */}
              <div style={{
                width: '36%',
                height: 'clamp(34px, 4.5vw, 56px)',
                background: '#dde0e4',
                borderRadius: 6,
                margin: '0 auto 4px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.6)',
                border: '1px solid rgba(0,0,0,0.08)',
              }} />
            </div>

            {/* Bottom rim */}
            <div style={{
              height: 5,
              background: 'linear-gradient(180deg, #d2d5da 0%, #b8bbc1 100%)',
              borderRadius: '0 0 6px 6px',
              boxShadow: '0 10px 28px rgba(0,0,0,0.55)',
            }} />

            {/* Ground shadow — sells the laptop as sitting in the scene */}
            <motion.div
              aria-hidden="true"
              style={{
                opacity: laptopOpacity,
                width: '70%',
                height: 'clamp(14px, 2.5vw, 24px)',
                margin: '10px auto 0',
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 72%)',
              }}
            />

          </div>
        </motion.div>

        {/* ── Scroll hint ── */}
        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ opacity: hintOpacity }}
          aria-hidden="true"
        >
          <motion.svg
            className="w-5 h-5 text-white/30"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
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
