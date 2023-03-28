// @jsx h
import { h, value, compute, hook } from 'rui'
import { Node } from './nodes'
import { Spine } from '!!val-loader!./spine.js.val'

// TODO tracks?
export default function ({
  data, animation, loop=false, animations,
  audios, skin, onAnimationEnd, onAudio,
  timeScale = 1,
  ...props
}, children) {
  const el = new Spine(data)
  const { slotContainers, skeleton, state, stateData } = el

  stateData.defaultMix = 0.1
  state.timeScale = timeScale

  if (animation) {
    state.setAnimation(0, animation, loop)
  }
  if (animations) {
    animations.forEach((a, i) => {
      const last = i === animations.length-1
      const loop = last
      state.addAnimation(0, a, loop, 0)
    })
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

  if (children) for (const { slot, node, clear, ...props } of children) {
    const container = slotContainers[skeleton.findSlotIndex(slot)].children[0]
    const containerNode = node
      ? <Node el={container} {...props}>{node}</Node>
      : <Node el={container} {...props}></Node>
    if (clear) {
      container.texture = null // clear texture if children exits
    }
    hook(() => {
      // dock lifecycle
      containerNode.attach()
      return () => containerNode.detach()
    })
  }

  const node = <Node el={el} {...props}></Node>

  node.play = (name, timeScale=1) => {
    const entry = el.state.setAnimation(0, name)
    entry.timeScale = timeScale
    return new Promise(complete => el.state.addListener({ complete }))
  }

  return node
}
