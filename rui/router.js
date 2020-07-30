// @jsx h
import { h, take, value, compute, peek, if as _if } from 'rui'
import { join, normalize } from 'path'

const val = v => typeof v === 'function' ? v() : v

// TODO
// history?
// go(path, state)?
const make = (segments, onRoute, Container, dir='/') => {
  // base, ext?
  // https://nodejs.org/api/path.html#path_path_parse_path
  const name = compute(() => segments()[0])
  // const path = compute(() => join(dir, `${name()}`))

  // TODO class
  const pathOf = (...paths) => join(dir, ...paths)

  // TODO go Component/0
  const go = (...paths) => onRoute(pathOf(...paths))

  let currentIndex = 0
  const matches = []
  const noMatches = compute(() => matches.every(m => !m()))

  // TODO redesign: elegant solution for `default/lock/alive`
  // TODO remove Container?
  const Route = ({ component: Component, alias, default: default_=false, lock, transit, ...props }) => {
    const index = `${currentIndex}`
    currentIndex += 1
    const myKeys = alias ? [].concat(alias, index) : [index]
    // first as main key
    const mainKey = myKeys[0]

    const matchNoDefault = compute(() => {
      if (lock && lock()) return true
      return myKeys.includes(name())
    })
    matches.push(matchNoDefault)
    const match = compute(() => matchNoDefault() || (noMatches() && val(default_)))

    // persist while transition
    let restCache
    const rest = compute(() => {
      if (match()) restCache = segments().slice(1)
      return restCache
    })

    const router = make(rest, onRoute, Container, join(dir, mainKey))

    if (transit) {
      const [animating, transitions] = transit(match)
      return <Container {...transitions}>
        {_if(() => match() || animating(), () => <Component router={router} {...props} />)}
      </Container>
    } else {
      return <Container>
        {_if(match, () => <Component router={router} {...props} />)}
      </Container>
    }
  }

  const router = { name, dir, go, pathOf, Route }
  return router
}

export function useRouter(path_, onRoute_, Container) {
  const [path, onRoute] = typeof path_ === 'undefined'
    ? value('/')
    : [path_, onRoute_]
  const segments = compute(() => normalize(`/${path()}/`).split('/').slice(1, -1))
  return make(segments, onRoute, Container)
}
export default useRouter
