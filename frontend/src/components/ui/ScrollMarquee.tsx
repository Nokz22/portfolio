import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface ScrollMarqueeProps {
  line1?: string
  line2?: string
  className?: string
}

export default function ScrollMarquee({
  line1 = 'Java · React · TypeScript · Spring Boot · Docker · Git · HTML · CSS · JavaScript · MySQL',
  line2 = 'Clean Code · OOP · MVC · REST APIs · Agile · WordPress · WooCommerce · Linux · Bash',
  className = '',
}: ScrollMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Line 1 drifts left, line 2 drifts right — speed linked to scroll position
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['-18%', '0%'])

  const repeat1 = `${line1} · `.repeat(6)
  const repeat2 = `${line2} · `.repeat(6)

  return (
    <div
      ref={ref}
      className={`overflow-hidden bg-ink-950 py-10 select-none ${className}`}
      aria-hidden="true"
    >
      <motion.p
        style={reduced ? {} : { x: x1 }}
        className="whitespace-nowrap font-display font-bold text-[clamp(1.4rem,2.8vw,2.2rem)] text-ink-700 leading-none mb-4"
      >
        {repeat1}
      </motion.p>
      <motion.p
        style={reduced ? {} : { x: x2 }}
        className="whitespace-nowrap font-display font-bold text-[clamp(1.4rem,2.8vw,2.2rem)] text-ink-700 leading-none"
      >
        <span className="text-accent/40">{repeat2}</span>
      </motion.p>
    </div>
  )
}
