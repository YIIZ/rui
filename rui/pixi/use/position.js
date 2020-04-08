import { compute, useRoot, isCompute } from 'rui'

export function usePosition({ left, right, top, bottom }, useAnchor=true) {
  const root = useRoot()
  // TODO relative to parent?
  const size = compute(() => root()?.size?.())
  const halfWidth = compute(() => size() ? size().width * 0.5 : 0)
  const halfHeight = compute(() => size() ? size().height * 0.5 : 0)

  const val = v => isCompute(v) ? v() : v

  const [anchorX, x] = left != null ? [0, compute(() => -halfWidth() + val(left))]
    : right != null ? [1, compute(() => halfWidth() - val(right))]
    : [0.5, 0]
  const [anchorY, y] = top != null ? [0, compute(() => -halfHeight() + val(top))]
    : bottom != null ? [1, compute(() => halfHeight() - val(bottom))]
    : [0.5, 0]

  return useAnchor ? {
    anchor: [anchorX, anchorY],
    x,
    y,
  } : {
    x, y,
  }
}
