
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
```js
// @jsx HTML.h
const htmlPhoto = <Photo></Photo>
// @jsx canvas.h
const canvasPhoto = <Photo></Photo>
```

### Attributes vs Props
canvas 下要怎么做？
```js
<time datetime={time}></time>
```



## 不创建额外实体, Pure Functional?
感觉不可行，毕竟要添加接口和生命周期


## Array
普通 Array 和 ReactiveArray 都需要支持
ReactiveArray 性能更好
普通 Array 可以自己缓存内容？

```js
let lastItems = []
const list = compute(normalArray, (values) => {
  const cache = new Map(lastItems)
  lastItems = values.map((value) => [value, cache.has(value) ? cache.get(value) : <li>{value}</li>])
  return lastItems.map(([key, li]) => li)
})

<ul>{list}</ul>
```
