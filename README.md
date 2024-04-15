# noCORS
代理访问资源，避开CORS~
同时支持二次http代理，避免资源无法访问~

- 如果公开访问，可以用proxy_server.js

1. 克隆代码 git clone git@github.com:rcqed/noCORS.git
2. 修改proxyServer为http代理服务器（如不用二次http代理也可以不改）
3. 修改listen的6006和ip地址为自己的~
4. cd到目录，npm install
5. npm start
6. 愉快使用吧~

- 如果需要防盗链，可以用proxy_server(valid_referers).js，改名为proxy_server

1. 修改allowedReferers为允许的域名~
2. 和上面一样，愉快使用吧~
