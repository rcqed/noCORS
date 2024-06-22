# noCORS

代理访问资源，避开CORS~

同时支持二次http代理，避免资源无法访问~

支持防盗链~

---

**使用说明：**

1. 克隆代码 git clone git@github.com:rcqed/noCORS.git
2. 修改proxyServer为http代理服务器（如不用二次http代理也可以不改）
3. 修改listen的6006和ip地址为自己的~
4. 修改allowedReferers和Access-Control-Allow-Origin为允许的域名~
5. cd到目录，npm install
6. npm start
7. 愉快使用吧~

---

- 访问链接(不使用二级http代理服务)：https://127.0.0.1:6006/?url=https://test.com/test.jpg
- 访问链接(使用二级http代理服务)：https://127.0.0.1:6006/?proxy=1&url=https://test.com/test.jpg

---

**补充说明：**

本项目已禁止空Referer访问，如果要直接用，请删除下面行：

```
  // 检查Referer是否为空
  if (!referer) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
```

安全考虑，你可以使用proxy_server (localhost ban).js替换原本的proxy_server.js
这个禁用了对本地localhost的代理请求

