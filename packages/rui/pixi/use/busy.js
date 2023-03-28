import { useRoot } from 'rui'

export function useBusy() {
  const root = useRoot()
  return (...args) => root().busy(...args)
}

// not working, cant ref root outside constructing
// export function busy(...args) {
//   const root = useRoot()
//   return root().busy(...args)
// }
