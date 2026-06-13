import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Renderer, Triangle, Program, Mesh } from 'ogl'

const VERTEX = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT = /* glsl */ `
precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec3 col = vec3(0.059, 0.059, 0.071);

  float n = noise(uv * 3.0 + uTime * 0.05);
  col += vec3(n * 0.04);

  // Orbs gravitate toward cursor position
  vec2 orb1 = mix(
    vec2(0.2 + sin(uTime * 0.12) * 0.1, 0.6 + cos(uTime * 0.08) * 0.1),
    uMouse,
    0.25
  );
  vec2 orb2 = mix(
    vec2(0.8 + cos(uTime * 0.10) * 0.08, 0.3 + sin(uTime * 0.14) * 0.08),
    uMouse,
    0.12
  );
  vec2 orb3 = vec2(0.5 + sin(uTime * 0.07) * 0.15, 0.85 + cos(uTime * 0.06) * 0.05);

  float d1 = length(uv - orb1);
  float d2 = length(uv - orb2);
  float d3 = length(uv - orb3);

  vec3 amber = vec3(0.878, 0.482, 0.0);
  col += amber * (0.055 / (d1 * d1 + 0.07));
  col += amber * (0.035 / (d2 * d2 + 0.07));
  col += amber * (0.018 / (d3 * d3 + 0.12));

  float vignette = 1.0 - length(uv - 0.5) * 0.85;
  col *= vignette;

  gl_FragColor = vec4(col, 1.0);
}
`

export default function ForgeShader() {
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const prefersReduced =
    reduced ??
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (prefersReduced) return
    const canvas = canvasRef.current
    if (!canvas) return

    const width = window.innerWidth
    const height = window.innerHeight

    const renderer = new Renderer({ canvas, alpha: false, antialias: false, width, height })
    const gl = renderer.gl
    renderer.setSize(width, height)

    const uTime = { value: 0 }
    const uResolution = { value: [width, height] }
    const uMouse = { value: [0.5, 0.5] }

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: { uTime, uResolution, uMouse },
    })
    const mesh = new Mesh(gl, { geometry, program })

    // Lerped mouse position — smooth shader tracking
    let targetX = 0.5, targetY = 0.5
    let currentX = 0.5, currentY = 0.5

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth
      targetY = 1.0 - e.clientY / window.innerHeight
    }

    let rafId: number
    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop)
      currentX += (targetX - currentX) * 0.04
      currentY += (targetY - currentY) * 0.04
      uMouse.value = [currentX, currentY]
      uTime.value = t * 0.001
      renderer.render({ scene: mesh })
    }
    rafId = requestAnimationFrame(loop)

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      uResolution.value = [w, h]
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      renderer.gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [prefersReduced])

  if (prefersReduced) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  )
}
