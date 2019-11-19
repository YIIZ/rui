import { value, compute } from 'rui'

export const useWindowSize = () => {
  const [dep, change] = value(true)
  window.addEventListener('resize', () => change(!dep()))
  return compute(() => {
    dep()
    const { clientWidth, clientHeight } = document.documentElement
    return [clientWidth, clientHeight]
  })
}

export const useRotateSize = (landscape=true) => {
  const portrait = !landscape
  const size = useWindowSize()
  return compute(() => {
    const [clientWidth, clientHeight] = size()
    const rotation = landscape && clientWidth < clientHeight ? Math.PI * 0.5
                   : portrait && clientWidth > clientHeight ? Math.PI * -0.5
                   : 0
    return rotation !== 0
      ? { width: clientHeight, height: clientWidth, rotate: true, rotation }
      : { width: clientWidth, height: clientHeight, rotate: false, rotation }
  })
}

// TODO cover?
export const useAppSize = (designWidth=750, designHeight=1500) => {
  const size = useRotateSize(designWidth >= designHeight)
  return compute(() => {
    const { width, height, rotate, rotation } = size()
    const parentWidth = designWidth
    const parentHeight = designHeight

    // contain
    const ratio = Math.min(parentWidth/width, parentHeight/height)
    return {
      height: Math.ceil(ratio * height),
      width: Math.ceil(ratio * width),
      rotate,
      rotation,
      ratio,
    }
  })
}
