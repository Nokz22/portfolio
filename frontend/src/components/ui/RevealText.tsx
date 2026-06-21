import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface RevealTextProps {
  text: string
  className?: string
  delay?: number
  by?: 'word' | 'char'
  /** 'mount' fires immediately on load (hero); 'view' fires when scrolled in */
  trigger?: 'mount' | 'view'
}

export default function RevealText({
  text,
  className = '',
  delay = 0,
  by = 'word',
  trigger = 'view',
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  const items = by === 'char' ? text.split('') : text.split(' ')
  const stagger = by === 'char' ? 0.03 : 0.08

  // For 'mount' trigger the animation fires immediately (hero is always in view)
  const isVisible = trigger === 'mount' ? true : inView

  return (
    <span ref={ref} className={className} aria-label={text} style={{ display: 'block' }}>
      {items.map((item, i) => {
        if (item === ' ') {
          return <span key={i} aria-hidden="true" style={{ display: 'inline-block', width: '0.32em' }} />
        }

        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              paddingBottom: '0.1em',
              marginBottom: '-0.1em',
              verticalAlign: 'top',
              ...(by === 'word' && i < items.length - 1 ? { marginRight: '0.3em' } : {}),
            }}
          >
            <motion.span
              style={{ display: 'inline-block' }}
              initial={{ y: '115%', opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
                delay: delay + i * stagger,
              }}
            >
              {item}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}
