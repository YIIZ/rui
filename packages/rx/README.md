Utils based on [Observable](https://github.com/tc39/proposal-observable)

require: [babel-plugin-transform-runtime](https://github.com/babel/babel/blob/9f4e2f/packages/babel-plugin-transform-runtime/src/definitions.js#L9)


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
