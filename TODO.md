## 关于 Node 和原始数据的关系
```jsx
const A = () => <div></div>
const B = () => <A></A>
const C = () => <B></B>

const c = <C></C>
```

三种方案
1. c是div
2. c是A Node(div)，也就是 B C 只当作函数运行
3. c是C Node，即使他是 pure function



### 3
```jsx
const C = () => <B></B>
```


## 关于 useEffect 实现
```jsx
<div onAttached={fn}></div>

//vs

useEffect(fn)
```

可以使用类似 compute(fn) 的方式来实现和 useEffect 一样的自动检测组件 life hook?
