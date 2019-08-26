
## 无法区分底层
比如 Photo 理想情况可用于 html 也可用于 canvas，
但一旦 Photo 继承自 Element 就失去了这个能力


### 思路？

利用 render，但理论上在初始化的时候就应该构建好 DOM，而不是 attach(render) 时
```js
HTML.render(<Photo/>)
Canvas.render(<Photo/>)
```

使用构建器，而不是直接调用 function
ps. 应该也不行, 因为 Photo 中的 `<div></div>` 会根据 Photo 中指定的 @jsx 提前编译成相应的构建代码
```js
// @jsx HTML.h
const htmlPhoto = <Photo></Photo>
// @jsx canvas.h
const canvasPhoto = <Photo></Photo>
```

使用传参构建
```js
// @jsx h
function App(h, props, ...children) {
  return <div>123</div>
}

const h = html
const app = <App></App>
```


### Attributes vs Props
canvas 下要怎么做？
```js
<time datetime={time}></time>
```



## 不创建额外实体, Pure Functional?
感觉不可行，毕竟要添加接口和生命周期

有一个优势，无缝接入现有的元素
```js
const video = document.createElement('video')
function Player() {
  return <div>{video}</div>
}
```

### 新方案，使用代理？

```js
function h(Component, { onAttached, onDetached, ...props }, ...children) {
  const c = new Component()
  // assign props
  c.append(...children)
  cache.set(c, {
    attached: false,
    onAttached,
    onDetached,
    children,
  })
  return c
}

function attach(c, target) {
  cache.set(target, { attached: false, children: [c] })
  setAttached(target)
}

function setAttached(c) {
  const data = cache.get(c)
  data.attached = true
  for (const child of children) setAttached(child)
}
```



## Array
普通 Array 和 ReactiveArray 都需要支持
ReactiveArray 性能更好
普通 Array 可以自己缓存内容？

```js
let lastItems = []
const list = compute(() => {
  const cache = new Map(lastItems)
  lastItems = normalArray.map((value) => [value, cache.has(value) ? cache.get(value) : <li>{value}</li>])
  return lastItems.map(([key, li]) => li)
})

<ul>{list}</ul>
```

spread? 理想情况应该统一，不需要判断 child 是不是 array
```js
<ul>
  <li></li>
  {...compute(() => array.map(() => <li></li>))}
  <li></li>
</ul>
```

