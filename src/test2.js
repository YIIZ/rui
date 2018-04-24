/** @jsx x */
import compute from 'compute-js'
const x = (Component, props, ...children) => Component(props === null ? undefined : props, ...children)


const Image = ({ src }={}) => {
  const img = new window.Image
  img.src = src
  return img
}
const Scene = (props, ...children) => {
  const div = document.createElement('div')
  for (const child of children) {
    div.appendChild(child)
  }
  return div
}

// TODO children spread
const Album = (props, ...children) =>
  <Scene>
    {children[0]}
    {children[1]}
  </Scene>
const Photo = ({ size=300, color='DDD' }={}) =>
  <Image src={`//via.placeholder.com/${size}/${color}`}></Image>

const out = <Album>
  <Photo size={400}></Photo>
  <Photo color="blue"></Photo>
</Album>

document.body.appendChild(out)
console.log(out)
