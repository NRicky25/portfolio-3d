export type DeviceTier = 'low' | 'high'

// Touch devices and weak CPUs get a lighter 3D scene.
export function getDeviceTier(): DeviceTier {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency ?? 8
  return coarse || cores <= 4 ? 'low' : 'high'
}

export function useDeviceTier(): DeviceTier {
  return getDeviceTier()
}
