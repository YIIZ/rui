import { Node } from './nodes'
import { Spine } from 'val-loader!./spine.js.val'

export default function ({
  data, animation, loop=false,
  audios, skin, onAnimationEnd, onAudio,
  ...props
}, children) {
  const el = new Spine(data)
  const { slotContainers, skeleton, state } = el

  if (animation) {
    state.setAnimation(0, animation, loop)
  }
  if (onAnimationEnd) {
    state.addListener({ complete: onAnimationEnd })
  }

  if (onAudio) {
    let interrupt
    state.addListener({
      event: (_, { data: { audioPath } }) => {
        if (audioPath) interrupt = onAudio(audioPath)
      },
      interrupt: () => {
        interrupt?.()
      }
    })
    hook(() => {
      return () => interrupt?.()
    })
  }
  // TODO skin

  if (children) for (const { slot, node, ...props } of children) {
    const container = slotContainers[skeleton.findSlotIndex(slot)].children[0]
    const containerNode = node
      ? <Node el={container} {...props}>{node}</Node>
      : <Node el={container} {...props}></Node>
    if (node) {
      container.texture = null // clear texture if children exits
    }
    hook(() => {
      // dock lifecycle
      containerNode.attach()
      return () => containerNode.detach()
    })
  }
  return <Node el={el} {...props}></Node>
}
