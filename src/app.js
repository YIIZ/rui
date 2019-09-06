// @jsx h
import { h, Node, useEffect } from './core'

// TODO html adapter
function Element({ tag }, children) {
  const el = document.createElement(tag) // dom
  return <Node el={el}>{...children}</Node>
}

function Container(props, children) {
  useEffect(() => console.log('container effect'))
  return <Element tag="div">
    {...children}
  </Element>
}

let c = 0
function Input() {
  const text = `input${c++} effect`
  useEffect(() => console.log(text))
  return <Element tag="input"></Element>
}

function App() {
  useEffect(() => console.log('app effect'))
  const i = <Input></Input>
  useEffect(() => console.log('app effect2'))

  const c = <Container></Container>

  useEffect(() => {
    setTimeout(() => {
      c.append(i)
    }, 2000)
  })

  return <Container>
    <Input></Input>
    {c}
    <Container>123</Container>
  </Container>
}

const app = <App/>
document.body.append(app.el)
app.attach()

