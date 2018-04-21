/** @jsx x */
import compute from 'compute-js'
window.compute = compute

const toNode = (value) => {
  if (value instanceof Node) return value
  if (typeof value === 'undefined') return document.createComment('')
  // if (Array.isArray(value))
  return document.createTextNode(`${value}`)
}

const x = (name, attributes, ...children) => {
  const el = document.createElement(name)

  if (attributes !== null)
  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, value)
    // TODO events
    // TODO boolean attributes
    // TODO props
    // TODO reactive
  }
  console.log(children)
  for (const child of children) {
    console.log(child)
    if (typeof child === 'function') {
      // reactive
      let node
      child.onChange(() => {
        const newValue = child()
        const newNode = toNode(newValue)
        // TODO? update textNode by textNode.data
        el.replaceChild(newNode, node)
        node = newNode
      })

      // watch first to prevent repeat compute() bug
      const value = child()
      node = toNode(value)
      el.appendChild(node)
    } else {
      el.appendChild(toNode(child))
    }
  }

  return el
}

// TODO normal value
const noop = () => {}
x.if = (value, truthy, falsy=noop) => compute(() => value() ? truthy() : falsy())
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
const isOk = compute.value(true)
const items = compute.value(['itemA', 'itemB'])

window.firstName = firstName
window.isOk = isOk
window.items = items

const out = <div>
  <h1>{firstName}</h1>
  {x.if(isOk, () =>
    <div>ok</div>
  )}
  <ul>
  {x.each(items, (item) =>
    <li>{item}</li>
  )}
  </ul>
</div>

document.body.appendChild(out)
