import { value } from 'rui'

// TODO auto cleanup
// const hash = compute(() => location.hash.slice(1))
// hash.changeBy((change) => {
//   window.addEventListener('hashchange', change)
//   return () => window.removeEventListener('hashchange', change)
// })

export const useHash = () => {
  const [dep, change] = value(true)
  window.addEventListener('hashchange', () => change(!dep()))
  return compute(() => {
    dep()
    return location.hash.slice(1)
  })
}
