// @jsx h
import { useState, useCompute } from './core'
import h from './html'

const [name, setName] = useState('bill')

const fullName = useCompute(() => `${name} gates`)

window.setName = setName

const node = <div title={fullName}>hello {fullName}!</div>
document.body.appendChild(node.el)
