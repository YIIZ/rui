/** @jsx x */

import compute from 'compute-js'
window.compute = compute

const toNode = (value) => {
  if (value instanceof Node) return value
  // if (typeof value === 'undefined') return document.createComment('')
  return document.createTextNode(`${value}`)
}
const toNodes = (value) => {
  const values = Array.isArray(value) ? value : [value]
  return values.map(toNode)
}

const getAndWatch = (value, callback) => {
  const handle = () => callback(value())
  // TODO watch first to prevent repeat compute() bug
  value.onChange(handle)
  handle()
  return () => value.offChange(handle)
}


const x = (name, attributes, ...children) => {
  if (typeof name === 'function') return name(attributes, children)
  const el = document.createElement(name)

  if (attributes !== null)
  for (const [key, value] of Object.entries(attributes)) {
    // TODO props(by adapter?)
    if (/^on/.test(key) && typeof value !== 'string') {
      // once?
      const eventName = key.slice(2)
      el.addEventListener(eventName, value, false)
    } else {
      const set = v => {
        if (typeof v === 'boolean') {
          if (v) el.setAttribute(key, '')
          else el.removeAttribute(key)
        } else {
          el.setAttribute(key, v)
        }
      }

      if (typeof value === 'function') {
        getAndWatch(value, set)
      } else {
        set(value)
      }
    }
  }

  for (const child of children) {
    console.log(child)
    if (typeof child === 'function') {

      const anchor = document.createComment('')
      el.appendChild(anchor)
      // startAnchor/endAnchor and update by remove items between them?

      let nodes = []
      // TODO offChange
      getAndWatch(child, v => {
        const newNodes = toNodes(v)
        // TODO? efficient update
        // textNode by textNode.data
        // node by replaceChild
        for (const node of nodes) {
          el.removeChild(node)
        }
        nodes = newNodes
        for (const node of nodes) {
          el.insertBefore(node, anchor)
        }
      })
    } else {
      for (const node of toNodes(child)) {
        el.appendChild(node)
      }
    }
  }

  return el
}

// TODO normal value
const noop = () => {}
x.if = (value, truthy, falsy=noop) => compute(() => value() ? truthy() : falsy())
// TODO cache and reuse
x.each = (items, mapper, empty=noop) => compute(() => items().map(mapper))


//================

// var count = compute.value(0)
// var count2 = compute.value(0)

// var totalCount = compute(function() {
//   return count.get() + count2.get()
// })
// totalCount() === "0"

// totalCount.onChange(function() {
//   $("#total").text(totalCount())
// })

// count.set(2)
// count2.set(3)

// $("#total").text() === "5"

const firstName = compute.value('Rick')
const lastName = compute.value('Nope')
const isOk = compute.value(true)
const items = compute.value(['itemA', 'itemB'])

window.firstName = firstName
window.lastName = lastName
window.isOk = isOk
window.items = items

const fullName = compute(() => `${firstName()} ${lastName()}`)

const clickCount = compute.value(0)


const Foo = ({ name }, children) =>
  <div>
    this is foo: {name}
  </div>

const out = <div>
  <h1 title={fullName}>{firstName}</h1>
  <h2>{fullName}</h2>
  {x.if(isOk, () =>
    <div>ok</div>
  )}
  <ul onclick="console.log(2)">
    {[<li>first</li>, <li>second</li>]}
    {x.each(items, (item) =>
      <li>{item}</li>
    )}
    {compute(() => items().map((item) => <li>{item} by compute</li>))}
    <li>last</li>
  </ul>
  <span hidden>s</span>
  <button type="button" onclick={() => clickCount.set(clickCount() + 1)}>Click Me! {clickCount}</button>
  <Foo name={fullName}></Foo>
</div>

document.body.appendChild(out)
