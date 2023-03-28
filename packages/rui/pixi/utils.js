import * as PIXI from 'pixi.js'
import { value, compute } from 'rui'
import { useElapsed } from '../motion'


export const onPointerEnd = (target, handler) => {
  target.on('pointerup', handler)
  target.on('pointerupoutside', handler)
  target.on('pointercancel', handler)
}
export const oncePointerEnd = (target, handler) => {
  const end = (...args) => {
    target.off('pointerup', end)
    target.off('pointerupoutside', end)
    target.off('pointercancel', end)
    handler(...args)
  }
  onPointerEnd(target, end)
}
export const oncePointerDrag = (target, handler, endHandler) => {
  target.on('pointermove', handler)
  oncePointerEnd(target, (...args) => {
    target.off('pointermove', handler)
    endHandler(...args)
  })
}

// export const awaitTween = playback =>


async function doload(list, onProgress) {
  const loader = PIXI.Loader.shared

  for (const [id, image, metadata, loadType ] of list) {
    loader.add(`${id}`, image, { metadata, loadType })
  }

  await new Promise((resolve) => {
    const onProgress2 = () => onProgress(loader.progress/100)
    const binding = loader.onProgress.add(onProgress2)
    loader.onComplete.once(() => {
      binding.detach()
      resolve()
    })
    loader.load()
  })
  return loader.resources
}
export function load(items, { minDuration=0 } = {}) {
  const [ready, setReady] = value(false)
  const [loadProgress, setLoadProgress] = value(0)
  const realLoad = doload(items, setLoadProgress).then(() => setReady(true))

  if (minDuration > 0) {
    const elapsed = useElapsed()
    const fakeProgress = compute(() => Math.min(1, elapsed()/minDuration))
    realLoad.ready = compute(() => ready() && fakeProgress() >= 1)
    realLoad.progress = compute(() => loadProgress() * fakeProgress())
  } else {
    realLoad.ready = ready
    realLoad.progress = loadProgress
  }
  return realLoad
}



let sharedRenderer
let sharedRenderTexture
export function capture(
  displayObject,
  { format = 'image/png', quality = 1 } = {}
) {
  const { x, y, width, height } = displayObject.getBounds()
  const container = new PIXI.Container()
  container.addChild(displayObject)

  // max texture size
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#understand_system_limits
  const MAX_SIZE = 4096
  const scale = Math.min(1, MAX_SIZE/width, MAX_SIZE/height)
  const w = Math.round(scale*width)
  const h = Math.round(scale*height)
  container.width = Math.round(scale*width)
  container.height = Math.round(scale*height)
  container.x = -Math.round(scale*x)
  container.y = -Math.round(scale*y)

  // cache
  const renderer = sharedRenderer = sharedRenderer || PIXI.autoDetectRenderer()
  const rt = sharedRenderTexture = sharedRenderTexture || PIXI.RenderTexture.create({ width: 100, height: 100 })
  rt.resize(container.width, container.height)
  renderer.render(container, { renderTexture: rt })
  const dataURL = renderer.plugins.extract.canvas(rt).toDataURL(format, quality)
  return dataURL
}


// TODO better
export function resetEventTarget(app, getRatio) {
  // set event target to support event behind capture img
  const { renderer } = app
  const { interaction } = renderer.plugins
  // TODO like #app container? prevent dom overlay like login events?
  const target = document.body
  interaction.setTargetElement(target, renderer.resolution)
  // window.interaction = interaction
  const { mapPositionToPoint, normalizeToPointerData } = interaction

  interaction.autoPreventDefault = false
  interaction.normalizeToPointerData = function (event) {
    // fix: prevent pointerupoutside
    // https://github.com/pixijs/pixi.js/blob/902d0029617091a1e67a189b245b5bcd39499974/src/interaction/InteractionManager.js#L1249
    this.interactionDOMElement = event.target
    return normalizeToPointerData.call(this, event)
  }

  interaction.mapPositionToPoint = function (point, x, y) {
    // FIXME?
    // const { devicePixelRatio } = director
    // mapPositionToPoint.call(this, point, x, y)
    // const { resolution, interactionDOMElement } = this
    // interactionDOMElement.width / interactionDOMElement.clientWidth * resolution
    // const { ratio } = app
    point.x = x * getRatio()
    point.y = y * getRatio()
  }

  // FIX PIXI
  // browsers that not support pointer but support touch&mouse
  // when not prevent default, will trigger twice
  // https://github.com/pixijs/pixi.js/blob/902d0029617091a1e67a189b245b5bcd39499974/src/interaction/InteractionManager.js#L737-L755
  // https://github.com/pixijs/pixi.js/blob/902d0029617091a1e67a189b245b5bcd39499974/src/interaction/InteractionManager.js#L1144
  if (!interaction.supportsPointerEvents && interaction.supportsTouchEvents) {
    // https://github.com/pixijs/pixi.js/blob/902d0029617091a1e67a189b245b5bcd39499974/src/interaction/InteractionManager.js#L795-L799
    window.document.removeEventListener('mousemove', interaction.onPointerMove, true)
    interaction.interactionDOMElement.removeEventListener('mousedown', interaction.onPointerDown, true)
    interaction.interactionDOMElement.removeEventListener('mouseout', interaction.onPointerOut, true)
    interaction.interactionDOMElement.removeEventListener('mouseover', interaction.onPointerOver, true)
    window.removeEventListener('mouseup', interaction.onPointerUp, true)
  }
}
