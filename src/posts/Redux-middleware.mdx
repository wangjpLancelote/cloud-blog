---
title: Redux-Middleware
---

# Redux-Middleware 解析

<aside>
💡 It provides a third-party extension point between dispatching an action, and the moment it reaches the reducer.

</aside>

以上是 Dan Abramov 对 middleware 的描述，他提供了一个分类处理 action 的机会，在 middleware 中，你可以检阅每一个流过的 action，挑选出特定类型的 action 进行相应操作，给你一次改变 action 的机会，

看一下使用方法：

```jsx
import { Middleware } from "react";
export const logger: Middleware = (store) => (next) => (action) => {
  console.log(action);
  return next(action);
};
// 这里用了函数科里化的做法，将每个return的函数都改成一个参数的函数，为了解耦
```

Middleware 具体是如何实现的呢

```jsx
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer);
    var dispatch = store.dispatch;
    var chain = [];
    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action),
    };
    chain = middlewares.map((middleware) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);
    return {
      ...store,
      dispatch,
    };
  };
}
```

了解一下 compose 函数：

```jsx
let result = compose(f1, f2, f3, f4)(value) -> let result = f1(f2(f3(f4(value))))
```

其中

```jsx
chain = middlewares.map(middleware => middleware(middlewareAPI))
dispatch = compose(...chain)(store.dispatch)

// 可以变化为
fnMiddle = fn(middlewareAPI)
dispatch = fnMiddle(store.dispatch)

//也就是
dispatch = fn(middlewareAPI)(store.dispatch)

//接着
store.dispatch(action)
// 等价于
fn(middlewareAPI)(store.dispatch)(action)

// 那么
dispatch = compose(...chain)(store.dispatch) === dispatch = fn1Middle(fn2Middle(store.dispatch))

// 每一次fnMiddle执行之后，就会返回一个函数
(action) => {
	...
	next(action)
	...
}
// 到了下一个fnMiddle执行的时候，接受一个传入的action参数，方法体里执行的是next(action)
// 那么，什么事next方法呢，由第一个fnMiddleware执行的时候传入store.dispatch()
// store.dispatch 就作为next函数的方法体
// 也就是，每次的next(action)实际上就是执行的store.dispatch(action)
```

![redux.jpeg](https://prod-files-secure.s3.us-west-2.amazonaws.com/43b64f47-9fcc-42a0-ba9a-fbfb1e671f2c/8ad6a082-5e9c-4dc3-828a-a80fb97cd75d/redux.jpeg)

以上的图示表明，redux 的 middleware 是多层函数包裹结构，每个 middleware 执行完之后，就会将结果返回给下一个 middleware，其中 return 的函数参数为 action，函数体会执行 next(action)，而 next 正是第一次传入 store.dispatch，因为这里是用了 compose 编程思想，将不变的函数参数以科里化的形式作为参数传入，如 store，next，而变化的参数如 action 则作为最后一个参数传入，形如：

```jsx
middleware = (store) => (next) => (action) => {};
// store, next 都是不变的函数参数，action作为每个middleware需要处理的对象，最后一个传入
```
