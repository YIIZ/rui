Utils based on [Observable](https://github.com/tc39/proposal-observable)(babel-plugin-transform-runtime)


## Tips
[pipes](https://github.com/tc39/proposal-pipeline-operator)

```js
const result = Observable.from([1, 2, 3])
  |> take(2)

result.subscribe({ next(v) { console.log(v) } })
// 1
// 2
```

## TODO
Wait [partial application](https://github.com/tc39/proposal-partial-application)
and remove curry
```js
Observable.from([1, 2, 3]) |> take(?, 2)
```
