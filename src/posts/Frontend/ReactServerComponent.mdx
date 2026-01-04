---
title: React Server Component
---

## 什么是 RSC

react server component 是 react 推出的服务端组件，顾名思义，服务端组件是运行在服务端的 react 组件，所以要想开发并使用服务端组件，需要先启动一个 node 服务

### RSC 和 SSR 不是一个东西

服务端组件不能使用客户端的一切变量和方法、事件，因为没有 DOM 和 BOM，所以服务端组件在使用的时候要做融合和水合(Hydrate)

区分标识：

- 服务端组件：’use server’
- 客户端组件: ‘use client’

在服务端代码执行开始之前，先执行 React 提供的 register 方法，通过自定义的 NodeJS 的 Module.prototype.\_compile 方法在 NodeJS 每次 require 文件时检测头部是否有’use client’,有的话就做 client component 相关逻辑的处理

```jsx
const register = require("react-server-dom-webpack/node-register");
register();
```

`react-server-dom-webpack`是 react 针对 RSC 开发的`webpack`插件

## 为什么要有 RSC

一个 React 组件，可能包含两种类型的状态：

- 前端交互用的状态，比如加载按钮的显/隐状态
- 后端请求回的数据，比如下面代码中的 data 状态用于保存后端数据

```jsx
function App() {
  const [data, update] = useState(null);

  useEffect(() => {
    fetch(url).then((res) => update(res.json()));
  }, []);
  return <Button data={data} />;
}
```

前端交互状态放在前端最合适，单后端请求返回的数据放在前端则比较繁琐，整个链路如下：

1. 前端请求并加载 React 业务逻辑代码
2. 应用执行渲染流程
3. App 组件 mount，执行 useEffect，请求后端数据
4. 后端数据返回，App 组件的子组件消费数据

那么，我们根据状态类型将组件分类，比如：

- 「只包含交互相关状态」的组件，叫做客户端组件(React Client Component) RCC
- 「只从数据源获取数据」的组件，叫做服务端组件(React Server Component) RSC

RSC 的理念就是，一句话概括，根据状态类型，划分组件类型，RCC 在前端运行，RSC 在后端运行

## 与 SSR、SSG 的区别

这两者都是结合了客户端组件和服务端组件的方案，而 RSC 则是其中的组成部分

SSG 是后端编译时方案，使用 SSG 的业务，后端代码在编译时回生成 HTML，当前端发起请求时，后端始终会返回编译生成的 HTML

SSR 与 RSC 都是后端运行时方案，也就是说，他们都是前端发起请求后，后端对请求的实时响应，根据请求参数不同，可以作出不同响应。

同为后端运行时方案，RSC 和 SSR 的区别主要体现在输出产物：

- SSR 的输出产物都是 HTML，浏览器可以解析
- RSC 会流式输出一种「类 JSON」的数据结构（React Flight），由前端的 React 相关插件解析，即上文提到的`react-server-dom-webpack`

在应用上，需要考虑 SEO 时，SSR 和 SSG 都可以胜任，都是输出 HTML，而 RSC 不行，因为是流式输出

## 如何区分 RSC 和 RCC

- 带有`.server.tsx`后缀的文件导出的是 RSC
- 带有`.client.tsx`后缀的文件导出的是 RCC
- 没有带以上后缀的文件名是通用组件

## 用法注意

RCC 不允许 import 导入 RSC 组件，原因很简单，运行环境决定的，客户端组件要在前端运行，服务端组件要在服务端运行

需要交替使用的话，使用 children，即将 RSC 组件作为 RCC 组件的子组件

```jsx
// client.tsx
export default function Client(children) {
  return <main>{children}</main>;
}
```

```jsx
// server.tsx
import Client from "./client.tsx";
import Server from "./server.tsx";

export default function Outer() {
  return (
    <Client>
      <Server />
    </Client>
  );
}
```

上面说了 RSC 组件是以流的形式传输到前端的，那么这个流的格式是什么样的呢

```jsx
M1:{"id":"./src/ClientCpn.client.js","chunks":["client1"],"name":""}
J0:["$","div",null,{"className":"main","children":["$","@1",null,{"children":["$","div",null,{"children":"服务端组件"}]}]}]
```

RSC 是一种按行分隔的数据结构，方便流式传输，每行的格式为：

<aside>
<img src="/icons/code_yellow.svg" alt="/icons/code_yellow.svg" width="40px" /> [标记][id]: JSON数据

</aside>

标记：代表这行的数据类型，比如 J 代表组件树，M 代表「一个 RCC 的引用」，S 代表 Suspense

id：代表这行数据的 id

JSON 数据保存了这行具体的数据

RSC 的序列化和反序列化就是 JSON 的序列化和反序列化，反序列化后的数据再根据「标记」不同做不同处理

## 传输协议

RSC 数据以什么格式在前后端传递呢，不同于一些 rpc 协议会基于 TCP 或者 UDP 实现，「RSC 协议」基于「HTTP 协议」实现，其中的`Content-Type = text/x-component`
