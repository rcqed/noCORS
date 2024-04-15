const http = require('http');
const url = require('url');
const request = require('request');
const fs = require('fs');

// HTTP代理服务器的地址
const proxyServer = 'http://192.168.44.2:10811';

// 创建一个 HTTP 服务器
http.createServer((req, res) => {
  // 解析请求中的 URL 和参数
  const { pathname, query } = url.parse(req.url, true);

  // 获取要代理的 URL 和是否使用代理的参数
  const proxyUrl = query.url;
  const useProxy = query.proxy === '1';

  // 根据是否使用代理来设置请求选项
  const requestOptions = {
    url: proxyUrl,
    encoding: null // 设置为null以获取原始的二进制数据
  };
  if (useProxy) {
    requestOptions.proxy = proxyServer;
  }

  // 使用 request 模块发起请求
  request(requestOptions, (error, response, body) => {
    if (error) {
      console.error('Error:', error);
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }

    // 将文件内容作为响应返回给客户端
    const filename = proxyUrl.substring(proxyUrl.lastIndexOf('/') + 1);
    const contentType = response.headers['content-type'];
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    res.end(body);
  });
}).listen(6006, '192.168.44.3', () => {
  console.log('Proxy server is running at http://192.168.44.3:6006/');
});
