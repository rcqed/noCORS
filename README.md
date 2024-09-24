# noCORS

代理访问资源，避开CORS~

同时支持二次http代理，避免资源无法访问~

支持防盗链~

---

**使用说明：**

1. 克隆代码 git clone git@github.com:rcqed/noCORS.git
2. cd到目录，npm install
3. npm start
4. 愉快使用吧~

> 其它修改项：
>
> 1. 修改proxyServer为http代理服务器（如不用二次http代理也可以不改）
> 2. 修改listen的6006和ip地址为自己的~
> 3. 修改allowedReferers为允许的域名~
> 4. 修改refererCheck来允许空referer访问

---

- 访问链接(不使用二级http代理服务)：https://127.0.0.1:6006/?url=https://test.com/test.jpg
- 访问链接(使用二级http代理服务)：https://127.0.0.1:6006/?proxy=1&url=https://test.com/test.jpg

