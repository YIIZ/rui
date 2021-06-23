// @jsx h
import { h, take, value, compute, peek, if as _if } from 'rui'
import { join, normalize as normalize_ } from 'path-browserify'

export const normalize = p => normalize_(`/${p}`).slice(1) // remove leading `/`

export const parse = (path) => {
  // TODO shared current?
  const normalized = compute(() => normalize(path()))
  const sepIndex = compute(() => normalized().indexOf('/'))
  const sepExists = compute(() => sepIndex() >= 0)
  const current = compute(() => sepExists() ? normalized().slice(0, sepIndex()) : normalized())
  return {
    normalized,
    current,
    sepIndex,
    sepExists,
  }
}

export const slice = (path, name) => {
  const { current, sepExists, sepIndex, normalized } = parse(path)

  const match = compute(() => current() === name)
  // persist while transition
  // TODO elegant solution?
  let restCache
  const rest = compute(() => {
    if (match()) restCache = sepExists() ? normalized().slice(sepIndex()) : ''
    return restCache
  })
  return [match, rest]
}

export const route = (path) => {
  const { current, sepExists, sepIndex, normalized } = parse(path)

  const sub = (name) => {
    const match = compute(() => current() === name)
    let restCache
    const rest = compute(() => {
      if (match()) restCache = sepExists() ? normalized().slice(sepIndex()) : ''
      return restCache
    })
    return route(rest)
  }
  return [current, sub]
}
