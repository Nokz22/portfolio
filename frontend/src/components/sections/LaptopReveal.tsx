import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AmbientOrbs from '@/components/ui/AmbientOrbs'

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

// Small key block for the keyboard grid
function Key({ flex = 1 }: { flex?: number }) {
  return (
    <div
      style={{
        flex,
        height: 'clamp(10px, 1.8vw, 18px)',
        background: '#252532',
        borderRadius: 3,
        boxShadow: '0 1px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    />
  )
}

export default function LaptopReveal() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Laptop fades in at the start
  const laptopOpacity  = useTransform(scrollYProgress, [0, 0.10], [0, 1])
  // Screen lid height: 0 → full (the "opening" motion)
  const screenH        = useTransform(scrollYProgress, [0.08, 0.78], [0, 370])
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

            {/* Screen housing */}
            <div style={{ paddingLeft: '3%', paddingRight: '3%' }}>
              <div style={{
                background: 'linear-gradient(180deg, #242432 0%, #1e1e2a 100%)',
                borderRadius: '14px 14px 0 0',
                padding: '10px 10px 0',
                boxShadow: '0 -6px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}>
                {/* Camera notch */}
                <div style={{
                  height: 10,
                  background: '#14141c',
                  borderRadius: '5px 5px 0 0',
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0a0a12' }} />
                </div>

                {/* Screen — height animated for lid-opening effect */}
                <motion.div
                  style={{
                    height: screenH,
                    overflow: 'hidden',
                    background: '#08080d',
                    borderRadius: '3px 3px 0 0',
                    perspective: '700px',
                  }}
                >
                  {/* Inner content with tilt for 3D illusion */}
                  <motion.div
                    style={{
                      rotateX: screenTilt,
                      transformOrigin: 'bottom center',
                      height: 370,
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

            {/* Hinge */}
            <div style={{
              height: 12,
              background: 'linear-gradient(180deg, #0e0e16 0%, #181820 100%)',
              boxShadow: '0 3px 12px rgba(0,0,0,0.9)',
            }} />

            {/* Keyboard base */}
            <div style={{
              background: 'linear-gradient(180deg, #1e1e2a 0%, #1c1c26 100%)',
              borderRadius: '0 0 10px 10px',
              padding: '12px 18px 8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.65), inset 0 -1px 0 rgba(255,255,255,0.03)',
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
                background: '#1a1a24',
                borderRadius: 6,
                margin: '0 auto 4px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.04)',
              }} />
            </div>

            {/* Bottom rim */}
            <div style={{
              height: 6,
              background: '#111118',
              borderRadius: '0 0 4px 4px',
              boxShadow: '0 6px 24px rgba(0,0,0,0.95)',
            }} />

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
