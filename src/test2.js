/** @jsx x */
import compute from 'compute-js'


const getAndWatch = (value, callback) => {
  if (typeof value !== 'function') return callback(value)
  const handle = () => callback(value())
  // TODO watch first to prevent repeat compute() bug
  value.onChange(handle)
  handle()
  return () => value.offChange(handle)
}
const get = (value) => typeof value === 'function' ? value() : value

const x = (Component, props, ...children) => Component(props === null ? undefined : props, ...children)

// internal components
const Element = ({ tag, ...props }, ...children) => {
  const el = document.createElement(tag)

  if (props !== null)
  for (const [key, prop] of Object.entries(props)) {
    getAndWatch(prop, value => {
      el.setAttribute(key, value)
    })
  }

  for (const child of children) {
    if (child instanceof Node) {
      el.appendChild(child)
    } else {
      const textNode = document.createTextNode('')
      getAndWatch(child, value => {
        textNode.data = value
      })
      el.appendChild(textNode)
    }
  }
  return el
}

// TODO children spread
const Image = (props) => <Element {...props} tag="img"></Element>
const Scene = (props, ...children) =>
  <Element {...props} tag="div">{...children}</Element>


// custom components
const Album = (props, ...children) => <Scene>{...children}</Scene>
const Photo = ({ size=300, color='DDD' }={}) => {
  const src = compute(() => `//via.placeholder.com/${get(size)}/${get(color)}`)
  return <Image src={src}></Image>
}


const color = compute.value('f00')
window.color = color

const out =
  <Scene>
    <Album>
      <Photo size={400}></Photo>
      <Photo color={color}></Photo>
    </Album>
    Nice
  </Scene>

document.body.appendChild(out)
console.log(out)
