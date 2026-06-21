import { motion } from 'framer-motion'

interface Props {
  intensity?: number
}

// All orbs use calc(X% - half-size) so their CENTRE lands at X% of the container.
// This makes them visible in both tall sections (hero, scrollstory) and short ones (stats).
export default function AmbientOrbs({ intensity = 1 }: Props) {
  const o = intensity
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

      {/* Orb 1 — centre at (25% top, 20% left) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '60vw', height: '60vw',
          top: 'calc(25% - 30vw)', left: 'calc(20% - 30vw)',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(224,123,0,${0.35 * o}) 0%, rgba(180,80,0,${0.12 * o}) 45%, transparent 70%)`,
          filter: 'blur(68px)',
        }}
        animate={{
          x: ['0%', '15%', '-8%', '10%', '0%'],
          y: ['0%', '20%', '6%', '-8%', '0%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orb 2 — centre at (75% top, 80% left) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '50vw', height: '50vw',
          top: 'calc(75% - 25vw)', left: 'calc(80% - 25vw)',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(200,100,0,${0.28 * o}) 0%, rgba(224,123,0,${0.08 * o}) 50%, transparent 70%)`,
          filter: 'blur(85px)',
        }}
        animate={{
          x: ['0%', '-20%', '10%', '-6%', '0%'],
          y: ['0%', '-18%', '25%', '5%', '0%'],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Orb 3 — centre at (50% top, 55% left) */}
      <motion.div
        style={{
          position: 'absolute',
          width: '32vw', height: '32vw',
          top: 'calc(50% - 16vw)', left: 'calc(55% - 16vw)',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,145,10,${0.20 * o}) 0%, transparent 70%)`,
          filter: 'blur(52px)',
        }}
        animate={{
          x: ['0%', '28%', '-15%', '12%', '0%'],
          y: ['0%', '-14%', '22%', '-6%', '0%'],
        }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
      />

      {/* Side-only vignette — keeps left/right edges clean without hiding orbs */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(10,10,14,0.50) 0%, transparent 20%, transparent 80%, rgba(10,10,14,0.50) 100%)',
      }} />
    </div>
  )
}
