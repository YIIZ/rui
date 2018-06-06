const createElementByName = name => document.createElement(name)

export const Element = ({ el, ...props }, ...children) => {
  for (const [key, value] of Object.entries(props)) {
    if (/^on/.test(key) && typeof value !== 'string') {
      const eventName = key.slice(2)
      el.addEventListener(eventName, value, false)
    // } else if (key in el) { // prop TODO ok?
      // el[key] = value
    } else { // attribute
      if (typeof value === 'boolean') {
        el.setAttribute(key, '')
      } else {
        el.setAttribute(key, value)
      }
    }
  }
  el.append(...children.map(child =>
    typeof child === 'string' || child instanceof Node ? child : child.el
  ))
  return el
}

export const div = (props, ...children) => <Element {...props} el={createElementByName('div')}>{...children}</Element>
export const video = (props, ...children) => <Element {...props} el={createElementByName('video')}>{...children}</Element>
export const img = (props, ...children) => <Element {...props} el={createElementByName('img')}>{...children}</Element>
export const a = (props, ...children) => <Element {...props} el={createElementByName('a')}>{...children}</Element>
export const button = (props, ...children) => <Element {...props} el={createElementByName('button')}>{...children}</Element>
