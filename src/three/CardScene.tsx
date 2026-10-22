import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { SceneKind } from '../data/types'

type Props = { kind: SceneKind; color: string }

// FinanceFlow: bars rising and falling like a live chart
function Bars({ color }: { color: string }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  useFrame(({ clock }) => {
    refs.current.forEach((m, i) => {
      if (!m) return
      const h = 0.6 + (Math.sin(clock.elapsedTime * 1.6 + i * 0.8) + 1) * 0.9 + i * 0.15
      m.scale.y = h
      m.position.y = -1.2 + h / 2
    })
  })
  return (
    <group rotation={[0.25, -0.5, 0]} scale={0.62} position={[0, -0.1, 0]}>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m }} position={[(i - 3) * 0.55, 0, 0]}>
          <boxGeometry args={[0.38, 1, 0.38]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35 + i * 0.05} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// Invoice SaaS: documents fanning out and restacking
function Documents({ color }: { color: string }) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = (Math.sin(clock.elapsedTime * 1.2) + 1) / 2
    g.current?.children.forEach((c, i) => {
      c.rotation.z = (i - 2) * 0.22 * t
      c.position.x = (i - 2) * 0.55 * t
      c.position.y = Math.sin(clock.elapsedTime * 2 + i) * 0.05
      c.position.z = i * 0.06
    })
  })
  return (
    <group ref={g} rotation={[-0.3, 0.3, 0]}>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i}>
          <boxGeometry args={[1.3, 1.7, 0.03]} />
          <meshStandardMaterial color={i === 4 ? '#f5f3ff' : color} emissive={color} emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

// Particles travelling along a path; used for the data pipeline and the gateway
function Flow({ color, nodes, count, spread }: { color: string; nodes: boolean; count: number; spread: number }) {
  const pts = useRef<THREE.Points>(null)
  const seeds = useMemo(() => Array.from({ length: count }, () => [Math.random(), Math.random() * 2 - 1, Math.random() * 2 - 1, 0.3 + Math.random() * 0.7]), [count])
  const pos = useMemo(() => new Float32Array(count * 3), [count])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    seeds.forEach(([p, a, b, s], i) => {
      const u = (p + t * 0.25 * s) % 1
      const x = -3 + u * 6
      pos[i * 3] = x
      pos[i * 3 + 1] = Math.sin(x * 1.3 + t) * 0.35 + a * spread
      pos[i * 3 + 2] = b * spread
    })
    if (pts.current) pts.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <group rotation={[0.2, -0.35, 0]}>
      <points ref={pts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.07} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      {nodes &&
        [-2.2, 0, 2.2].map((x, i) => (
          <mesh key={i} position={[x, Math.sin(x * 1.3) * 0.35, 0]}>
            <icosahedronGeometry args={[0.32, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} wireframe />
          </mesh>
        ))}
    </group>
  )
}

// MONOGATE: capital flowing through a glowing gateway ring
function Gateway({ color }: { color: string }) {
  const ring = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ring.current) return
    ring.current.rotation.z = clock.elapsedTime * 0.4
    ring.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2) * 0.03)
  })
  return (
    <group rotation={[0, -0.9, 0]}>
      <group ref={ring}>
        <mesh>
          <torusGeometry args={[1.1, 0.07, 16, 64]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.35, 0.015, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      </group>
      <Flow color={color} nodes={false} count={260} spread={0.45} />
    </group>
  )
}

// E-commerce: floating product boxes
function Boxes({ color }: { color: string }) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    g.current?.children.forEach((c, i) => {
      c.rotation.x = clock.elapsedTime * (0.4 + i * 0.1)
      c.rotation.y = clock.elapsedTime * (0.6 + i * 0.07)
      c.position.y = Math.sin(clock.elapsedTime * 1.5 + i * 1.3) * 0.3 + ((i % 2) - 0.5) * 0.6
    })
  })
  return (
    <group ref={g}>
      {[-1.9, -0.6, 0.7, 2].map((x, i) => (
        <mesh key={i} position={[x, 0, (i % 2) * -0.5]} scale={0.55 + (i % 3) * 0.12}>
          <boxGeometry />
          <meshStandardMaterial color={i % 2 ? '#fef3c7' : color} emissive={color} emissiveIntensity={0.3} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

// Anomaly detection: a normal cluster with one pulsing red outlier
function Outlier({ color }: { color: string }) {
  const red = useRef<THREE.Mesh>(null)
  const ring = useRef<THREE.Mesh>(null)
  const cluster = useMemo(() => {
    const a = new Float32Array(160 * 3)
    for (let i = 0; i < 160; i++) {
      const r = Math.abs(THREE.MathUtils.randFloatSpread(1.6)) + 0.05
      const th = Math.random() * Math.PI * 2
      a.set([Math.cos(th) * r - 0.6, Math.sin(th) * r * 0.7, THREE.MathUtils.randFloatSpread(0.6)], i * 3)
    }
    return a
  }, [])
  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.elapsedTime * 4) * 0.25
    red.current?.scale.setScalar(s)
    if (ring.current) {
      const k = (clock.elapsedTime * 0.8) % 1
      ring.current.scale.setScalar(1 + k * 3)
      ;(ring.current.material as THREE.MeshBasicMaterial).opacity = 1 - k
    }
  })
  return (
    <group rotation={[0, 0, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cluster, 3]} />
        </bufferGeometry>
        <pointsMaterial color={'#c4b5fd'} size={0.06} transparent opacity={0.85} />
      </points>
      <mesh ref={red} position={[2, 0.9, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ring} position={[2, 0.9, 0]}>
        <ringGeometry args={[0.18, 0.22, 32]} />
        <meshBasicMaterial color={color} transparent />
      </mesh>
    </group>
  )
}

function SceneFor({ kind, color }: Props) {
  switch (kind) {
    case 'bars':
      return <Bars color={color} />
    case 'documents':
      return <Documents color={color} />
    case 'pipeline':
      return <Flow color={color} nodes count={140} spread={0.12} />
    case 'gateway':
      return <Gateway color={color} />
    case 'boxes':
      return <Boxes color={color} />
    case 'outlier':
      return <Outlier color={color} />
  }
}

export default function CardScene({ kind, color }: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} aria-hidden>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 4]} intensity={40} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={20} color={color} />
      <SceneFor kind={kind} color={color} />
    </Canvas>
  )
}
