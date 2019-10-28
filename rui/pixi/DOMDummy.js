// @jsx h
import { h, value, compute, hook } from 'rui'
import { Element } from 'rui/src/html'

function computeWorldTransform(transform, ratio) {
  const [worldId, setWorldId] = value(transform._worldID)
  // inject
  // TODO clean?
  // https://github.com/pixijs/pixi.js/blob/0d830d9ab3b7a45853c5fa0fee60be5edf5d4650/packages/math/src/Transform.js#L225
  const { updateTransform } = transform
  transform.updateTransform = (...args) => {
    updateTransform.apply(transform, args)
    setWorldId(transform._worldID)
  }

  return compute(() => {
    worldId()
    const scale = 1/ratio()
    return transform.worldTransform.clone().scale(scale, scale)
  })
}

// TODO use ratio by useAppSize?
export default function DOMDummy({ fixedWidth, visible, style:_style='', ratio, ...props }, [node]) {
  const target = node.el
  const matrix = computeWorldTransform(target.transform, ratio)
  // TODO compute?
  const { width, height, x, y } = target.getLocalBounds()

  const style = compute(() => {
    const m = matrix()
    const transform = `matrix(${m.a}, ${m.b}, ${m.c}, ${m.d}, ${m.tx}, ${m.ty}) translate(${x}px, ${y}px)`
    const transformOrigin = '0 0 0'

    return `
      position: absolute;
      top: 0;
      left: 0;
      ${visible ? '' : 'opacity: 0.0001;'}
      width: ${width}px;
      height: ${height}px;
      -webkit-transform: ${transform};
      -webkit-transform-origin: ${transformOrigin};
      transform: ${transform};
      transform-origin: ${transformOrigin};
      ${_style}
    `
  })

  const domNode = <Element {...props} style={style}></Element>
  hook(() => {
    domNode.attach()
    document.body.appendChild(domNode.el)
    return () => {
      domNode.detach()
      document.body.removeChild(domNode.el)
    }
  })

  node.dom = domNode.el
  return node
}
