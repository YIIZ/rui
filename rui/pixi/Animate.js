// @jsx h
import { h, value, compute, replace, hook, watch } from 'rui'
import { Container, Sprite, Text } from 'lib/rui/pixi'

import { tween } from 'popmotion'

// TODO
// https://codesandbox.io/s/framer-motion-keyframes-ekks8?fontsize=14&module=%2Fsrc%2FExample.tsx
// TODO direct props and animating it?
export default function Animate({ N: Node, animate, duration, ease, loop, yoyo, ...props }, children) {
  const node = <Node {...props}>{...children}</Node>

  function apply(props) {
    // TODO? cache keys
    for (const [key, value] of Object.entries(props)) {
      node.applyProp(key, value)
    }
  }

  let lastStyle = null
  let lastAction = null
  watch(animate, (style) => {
    if (!lastStyle) {
      lastStyle = style
      return
    }
    if (lastAction) lastAction.stop()
    const action = tween({
      from: lastStyle,
      to: style,
      duration,
      yoyo,
      loop,
      ease,
    }).start(apply)
    lastStyle = style
    lastAction = action
  })
  return node
}
