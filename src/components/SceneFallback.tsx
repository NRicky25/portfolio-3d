// Static glow shown while 3D loads, or forever when WebGL is unavailable.
export default function SceneFallback() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(139,92,246,0.35),rgba(34,211,238,0.12)_45%,transparent_70%)] blur-3xl" />
    </div>
  )
}
