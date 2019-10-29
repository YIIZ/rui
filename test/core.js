import test from 'ava'
import { Node, h, hook } from '../src/core'

test('basic', t => {
  function App(props, children) {
    return new Node({ name: 'app' }, { ...props, key1: 'value1' }, children)
  }

  const app = h(App, { key2: 'value2' }, new Node())
  app.attach()

  t.is(app.el.name, 'app')
  t.is(app.children.length, 1)
  t.is(app.el.key1, 'value1')
  t.is(app.el.key2, 'value2')
  t.is(app.children[0].attached, true)
})

test('hook', t => {
  function App(props, children) {
    hook('hook1')
    return new Node()
  }

  const app = h(App)

  t.is(app.hooks[0], 'hook1')
})


test('lifecycle', t => {
  let attached = false
  function App(props, children) {
    hook(() => {
      attached = true
      return () => attached = false
    })
    return new Node()
  }

  const app = h(App)
  t.is(attached, false)
  app.attach()
  t.is(attached, true)
  app.detach()
  t.is(attached, false)
})


test('hook params', t => {
  let root, parent

  function Child() {
    hook((root1, parent1) => {
      console.log(parent1)
      root = root1
      parent = parent1
    })
    return new Node()
  }
  function App(props, children) {
    return new Node(null, null, [h(Child)])
  }
  const app = h(App)
  app.attach()

  t.is(root, app)
  t.is(parent, app)
})
