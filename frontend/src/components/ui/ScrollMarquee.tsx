import { motion } from 'framer-motion'

interface ScrollMarqueeProps {
  line1?: string
  line2?: string
  className?: string
}

const DEFAULT_L1 = 'Java · React · TypeScript · Spring Boot · Docker · Git · HTML · CSS · JavaScript · MySQL'
const DEFAULT_L2 = 'Clean Code · OOP · MVC · REST APIs · Agile · WordPress · WooCommerce · Linux · Bash'

// A single sweeping beam that travels left → right
function LightBeam({ delay = 0, opacity = 1 }: { delay?: number; opacity?: number }) {
  return (
    <motion.div
      className="absolute inset-y-0 left-0 pointer-events-none"
      style={{
        width: '26%',
        background:
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 28%, rgba(255,255,255,0.82) 50%, rgba(255,255,255,0.04) 72%, transparent 100%)',
        mixBlendMode: 'color-dodge',
        opacity,
        zIndex: 10,
      }}
      animate={{ x: ['-100%', '485%'] }}
      transition={{ duration: 5, ease: 'linear', repeat: Infinity, delay }}
      aria-hidden="true"
    />
  )
}

export default function ScrollMarquee({
  line1 = DEFAULT_L1,
  line2 = DEFAULT_L2,
  className = '',
}: ScrollMarqueeProps) {
  const block1 = `${line1}  ·  `.repeat(5)
  const block2 = `${line2}  ·  `.repeat(5)

  const trackBase =
    'font-display font-bold leading-none whitespace-nowrap text-[clamp(1.4rem,2.8vw,2.2rem)]'

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      aria-hidden="true"
      style={{
        backgroundColor: '#0b0b0f',
        // Lightbox frame — amber glow on top and bottom edges
        boxShadow:
          'inset 0 1px 0 rgba(224,123,0,0.35), inset 0 -1px 0 rgba(224,123,0,0.35)',
        paddingTop: '2.5rem',
        paddingBottom: '2.5rem',
      }}
    >
      {/* Primary beam — main sweep */}
      <LightBeam delay={0} opacity={1} />
      {/* Secondary beam — follows at half period for continuous feel */}
      <LightBeam delay={2.5} opacity={0.55} />

      {/* Row 1 — drifts left */}
      <div className="relative mb-4" style={{ zIndex: 1 }}>
        <div
          className="flex"
          style={{
            width: 'max-content',
            animation: 'marquee-left 38s linear infinite',
          }}
        >
          <span className={`${trackBase} text-accent/55`}>{block1}</span>
          <span className={`${trackBase} text-accent/55`}>{block1}</span>
        </div>
      </div>

      {/* Row 2 — drifts right */}
      <div className="relative" style={{ zIndex: 1 }}>
        <div
          className="flex"
          style={{
            width: 'max-content',
            animation: 'marquee-right 44s linear infinite',
          }}
        >
          <span className={`${trackBase} text-white/20`}>{block2}</span>
          <span className={`${trackBase} text-white/20`}>{block2}</span>
        </div>
      </div>

      {/* Edge vignettes — darken the sides so the beam "enters" from darkness */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: '8%',
          background: 'linear-gradient(90deg, #0b0b0f 0%, transparent 100%)',
          zIndex: 20,
        }}
      />
      <div
        className="absolute inset-y-0 right-0 pointer-events-none"
        style={{
          width: '8%',
          background: 'linear-gradient(270deg, #0b0b0f 0%, transparent 100%)',
          zIndex: 20,
        }}
      />
    </div>
  )
}
