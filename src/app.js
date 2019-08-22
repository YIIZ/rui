// @jsx h
import { useState } from './core'
import h from './html'

const [name, setName] = useState('bill')

window.setName = setName

const node = <div>hello {name}!</div>
document.body.appendChild(node.el)
