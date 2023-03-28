// @jsx h
import { h, value, compute, hook, apply, useRoot } from 'rui'
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

// TODO better?
export function domStyleFromNode(node, { visible, style:_style='' }) {
  const root = useRoot()
  // TODO no need to check root?
  const ratio = () => root()?.size().ratio

  const target = node.el
  const matrix = computeWorldTransform(target.transform, ratio)
  // TODO fix Text sizing, getBounds()?
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
  return style
}

export function attachDOM(domNode) {
  hook(() => {
    domNode.attach()

    const dom = domNode.el
    const domAttached = !!dom.parentNode
    if (!domAttached) document.body.appendChild(domNode.el)
    return () => {
      domNode.detach()
      if (!domAttached) document.body.removeChild(domNode.el)
    }
  })
}

export default function DOMDummy({ visible, style, ...props }, [node]) {
  const domNode = <Element {...props} style={domStyleFromNode(node, { visible, style })}></Element>
  attachDOM(domNode, node)
  node.dom = domNode.el
  return node
}
