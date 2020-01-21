import { compute, useRoot } from 'rui'

export function usePosition({ left, right, top, bottom }, useAnchor=true) {
  const root = useRoot()
  // TODO relative to parent?
  const size = compute(() => root()?.size?.())
  const halfWidth = compute(() => size() ? size().width * 0.5 : 0)
  const halfHeight = compute(() => size() ? size().height * 0.5 : 0)

  const [anchorX, x] = typeof left === 'number' ? [0, compute(() => -halfWidth() + left)]
    : typeof right === 'number' ? [1, compute(() => halfWidth() - right)]
    : [0.5, 0]
  const [anchorY, y] = typeof top === 'number' ? [0, compute(() => -halfHeight() + top)]
    : typeof bottom === 'number' ? [1, compute(() => halfHeight() - bottom)]
    : [0.5, 0]

  return useAnchor ? {
    anchor: [anchorX, anchorY],
    x,
    y,
  } : {
    x, y,
  }
}
