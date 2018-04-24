const babel = require('babel-core')

const presetEnv = require('babel-preset-env')
const jsx = require('./jsx')


const src = `
<div a="1" {...ok} c="d">a{...list}b</div>

fn(a, ...b, c)
`


const out = babel.transform(src, {
  presets: [presetEnv],
  plugins: [jsx],
})

console.log(out.code)
