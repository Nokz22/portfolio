const NOISE = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>` +
  `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/></filter>` +
  `<rect width='200' height='200' filter='url(#n)'/></svg>`
)

export default function Grain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: '-150%',
        width: '400%',
        height: '400%',
        backgroundImage: `url("data:image/svg+xml;charset=utf-8,${NOISE}")`,
        backgroundRepeat: 'repeat',
        opacity: 0.038,
        pointerEvents: 'none',
        zIndex: 9999,
        animation: 'grain 0.75s steps(1) infinite',
        mixBlendMode: 'soft-light',
      }}
    />
  )
}
