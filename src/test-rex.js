const get = (value) => typeof value === 'function' ? value() : value


import { Element, State, when, each } from 'rex'
import compute from 'compute-js'


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

const Time = () => {
  const time = compute.value(new Date)
  const timeString = compute(() => time().toLocaleString())

  let t
  const update = () => {
    console.log('update time')
    time.set(new Date)
    t = setTimeout(update, 1000)
  }
  const stop = () => {
    console.log('stop time')
    clearTimeout(t)
  }

  return <State attached={update} detached={stop} time={time}>
    <Element tag="time">{timeString}</Element>
  </State>
}


const color = compute.value('f00')
const time = compute.value(new Date)
window.color = color
window.time = time

const isOk = compute.value(true)
const items = compute.value(['itemA', 'itemB'])
window.isOk = isOk
window.items = items

const t = <Time></Time>
const out =
  <Scene>
    <Album>
      <Photo size={400}></Photo>
      <Photo color={color}></Photo>
    </Album>
    <Element tag="div">Nice {t}</Element>
    <Element tag="div">{t.props.time}</Element>
    <Element tag="ul">
      <Element tag="li">first</Element>
      {each(items, (item) =>
        <Element tag="li">{item}</Element>
      )}
      <Element tag="li">last</Element>
    </Element>
  </Scene>

// or
// const root = <Root el={document.body}><Scene></Scene></Root>
// or scene? app? main? https://github.com/HeapsIO/heaps/wiki/H2D-Concepts
// /*root.attached = true*/
out.attach(document.body)
console.log(window.out = out)
