import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface NeuralNetworkProps {
  /** pause rendering when off-screen */
  active?: boolean
  /** fewer nodes, no pointer warp, lower DPR */
  low?: boolean
  /** render a single static frame */
  still?: boolean
}

// Window-level pointer so the HTML overlay above the canvas doesn't block interaction.
const pointer = { x: 0, y: 0, has: false }
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    pointer.has = true
  })
}

function makeDotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.85)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

interface Graph {
  base: Float32Array
  phase: Float32Array
  edges: [number, number][]
  neighbours: number[][]
  colors: Float32Array
}

function buildGraph(count: number): Graph {
  const base = new Float32Array(count * 3)
  const phase = new Float32Array(count)
  const colors = new Float32Array(count * 3)
  const violet = new THREE.Color('#8b5cf6')
  const cyan = new THREE.Color('#22d3ee')
  const pink = new THREE.Color('#f0abfc')
  const tmp = new THREE.Color()

  for (let i = 0; i < count; i++) {
    // points inside a wide, flattened ellipsoid with denser core
    const u = Math.random() * Math.PI * 2
    const v = Math.acos(2 * Math.random() - 1)
    const r = Math.pow(Math.random(), 0.6) * 5.2
    base[i * 3] = Math.sin(v) * Math.cos(u) * r * 1.7
    base[i * 3 + 1] = Math.sin(v) * Math.sin(u) * r * 0.85
    base[i * 3 + 2] = Math.cos(v) * r * 0.9
    phase[i] = Math.random() * Math.PI * 2
    const t = (base[i * 3] / 9 + 1) / 2
    tmp.copy(violet).lerp(cyan, THREE.MathUtils.clamp(t, 0, 1))
    if (Math.random() < 0.08) tmp.copy(pink)
    colors.set([tmp.r, tmp.g, tmp.b], i * 3)
  }

  // connect each node to its nearest neighbours
  const edges: [number, number][] = []
  const seen = new Set<string>()
  const neighbours: number[][] = Array.from({ length: count }, () => [])
  for (let i = 0; i < count; i++) {
    const d: [number, number][] = []
    for (let j = 0; j < count; j++) {
      if (i === j) continue
      const dx = base[i * 3] - base[j * 3]
      const dy = base[i * 3 + 1] - base[j * 3 + 1]
      const dz = base[i * 3 + 2] - base[j * 3 + 2]
      d.push([dx * dx + dy * dy + dz * dz, j])
    }
    d.sort((a, b) => a[0] - b[0])
    for (const [dist, j] of d.slice(0, 3)) {
      if (dist > 9) continue
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push([i, j])
      neighbours[i].push(j)
      neighbours[j].push(i)
    }
  }
  return { base, phase, edges, neighbours, colors }
}

interface Pulse {
  from: number
  to: number
  t: number
  speed: number
}

function Network({ count, interactive, pulseCount }: { count: number; interactive: boolean; pulseCount: number }) {
  const group = useRef<THREE.Group>(null)
  const { viewport, camera } = useThree()
  const graph = useMemo(() => buildGraph(count), [count])
  const dot = useMemo(makeDotTexture, [])

  const pos = useMemo(() => new Float32Array(graph.base), [graph])
  const linePos = useMemo(() => new Float32Array(graph.edges.length * 6), [graph])
  const lineCol = useMemo(() => {
    const c = new Float32Array(graph.edges.length * 6)
    graph.edges.forEach(([a, b], k) => {
      c.set(graph.colors.subarray(a * 3, a * 3 + 3), k * 6)
      c.set(graph.colors.subarray(b * 3, b * 3 + 3), k * 6 + 3)
    })
    return c
  }, [graph])

  const pulses = useMemo<Pulse[]>(
    () =>
      Array.from({ length: pulseCount }, () => {
        const [from, to] = graph.edges[Math.floor(Math.random() * graph.edges.length)]
        return { from, to, t: Math.random(), speed: 0.35 + Math.random() * 0.6 }
      }),
    [graph, pulseCount],
  )
  const pulsePos = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount])

  const pointsGeo = useRef<THREE.BufferGeometry>(null)
  const linesGeo = useRef<THREE.BufferGeometry>(null)
  const pulseGeo = useRef<THREE.BufferGeometry>(null)

  const mouse = useMemo(() => new THREE.Vector3(), [])
  const smooth = useMemo(() => ({ x: 0, y: 0, strength: 0 }), [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const time = state.clock.elapsedTime
    const dt = Math.min(delta, 0.05)

    // gentle rotation + parallax tilt following pointer
    smooth.x += (pointer.x - smooth.x) * 0.05
    smooth.y += (pointer.y - smooth.y) * 0.05
    g.rotation.y += dt * 0.04
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -smooth.y * 0.18, 0.05)
    g.position.x = THREE.MathUtils.lerp(g.position.x, smooth.x * 0.4, 0.05)

    // pointer position in the group's local space (on the z=0 plane facing camera)
    smooth.strength += ((interactive && pointer.has ? 1 : 0) - smooth.strength) * 0.05
    mouse.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0)
    g.worldToLocal(mouse)

    const { base, phase } = graph
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      let x = base[ix] + Math.sin(time * 0.6 + phase[i]) * 0.12
      let y = base[ix + 1] + Math.cos(time * 0.5 + phase[i]) * 0.12
      let z = base[ix + 2] + Math.sin(time * 0.4 + phase[i] * 2) * 0.12
      if (smooth.strength > 0.01) {
        const dx = mouse.x - x
        const dy = mouse.y - y
        const dz = mouse.z - z
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const R = 3.2
        if (d < R) {
          // bend toward the cursor, strongest at mid-range so nodes don't collapse onto it
          const f = Math.sin((1 - d / R) * Math.PI) * 0.35 * smooth.strength
          x += dx * f
          y += dy * f
          z += dz * f
        }
      }
      pos[ix] = x
      pos[ix + 1] = y
      pos[ix + 2] = z
    }

    graph.edges.forEach(([a, b], k) => {
      linePos.set(pos.subarray(a * 3, a * 3 + 3), k * 6)
      linePos.set(pos.subarray(b * 3, b * 3 + 3), k * 6 + 3)
    })

    pulses.forEach((p, k) => {
      p.t += dt * p.speed
      if (p.t >= 1) {
        // hop to a neighbour of the destination, like a signal propagating
        const next = graph.neighbours[p.to].filter((n) => n !== p.from)
        p.from = p.to
        p.to = next.length ? next[Math.floor(Math.random() * next.length)] : graph.neighbours[p.to][0] ?? p.from
        p.t = 0
      }
      const a = p.from * 3
      const b = p.to * 3
      pulsePos[k * 3] = pos[a] + (pos[b] - pos[a]) * p.t
      pulsePos[k * 3 + 1] = pos[a + 1] + (pos[b + 1] - pos[a + 1]) * p.t
      pulsePos[k * 3 + 2] = pos[a + 2] + (pos[b + 2] - pos[a + 2]) * p.t
    })

    for (const geo of [pointsGeo.current, linesGeo.current, pulseGeo.current]) {
      if (geo) geo.attributes.position.needsUpdate = true
    }
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry ref={linesGeo}>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineCol, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points>
        <bufferGeometry ref={pointsGeo}>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[graph.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={dot}
          vertexColors
          size={0.28}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points>
        <bufferGeometry ref={pulseGeo}>
          <bufferAttribute attach="attributes-position" args={[pulsePos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={dot}
          color="#e0f2fe"
          size={0.42}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

function Invalidator({ still }: { still: boolean }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (still) invalidate()
  }, [still, invalidate])
  return null
}

export default function NeuralNetwork({ active = true, low = false, still = false }: NeuralNetworkProps) {
  const frameloop = still ? 'demand' : active ? 'always' : 'never'
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 11], fov: 50 }}
      dpr={[1, low ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={frameloop}
      aria-hidden
    >
      <Invalidator still={still} />
      <Network count={low ? 70 : 160} pulseCount={low ? 14 : 34} interactive={!low && !still} />
    </Canvas>
  )
}
