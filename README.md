# contenteditable
vue中div模拟输入框插入表情以及光标问题的解决

```
<pre class="input-box" contenteditable id="input-box" @keyup.enter="send" @input="inputContent"></pre>
```
在vue中用有两个问题

1.光标跑偏

2.无法双向绑定数据

contenteditableHandle.js 解决光标问题

chat.vue 里实现手工双向绑定

