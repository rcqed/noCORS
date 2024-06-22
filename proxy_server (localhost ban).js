const http = require('http');
const url = require('url');
const request = require('request');
const fs = require('fs');
const dns = require('dns');
const cors = require('cors'); // 引入cors模块

// HTTP代理服务器的地址
const proxyServer = 'http://192.168.1.2:20171';

// 允许的 Referer 列表
const allowedReferers = [
  'https://www.test.cn',
  'https://www.test.com'
];

// 本地地址正则表达式
const localAddressRegex = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+)$/;

// 检查IP地址是否为本地IP地址
function isLocalAddress(ip) {
  return localAddressRegex.test(ip);
}

// 创建一个 HTTP 服务器
http.createServer((req, res) => {
  // 设置跨域头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 解析请求中的 URL 和参数
  const { pathname, query } = url.parse(req.url, true);

  // 获取要代理的 URL 和 Referer
  const proxyUrl = query.url;
  const referer = req.headers.referer;
  
  // 检查是否使用代理
  const useProxy = query.proxy === '1';

  // 检查Referer是否为空
  if (!referer) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // 检查 Referer 是否在允许的 Referer 列表中
  if (referer && !allowedReferers.some(allowedReferer => referer.startsWith(allowedReferer))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // 解析目标URL的主机名
  const targetHost = url.parse(proxyUrl).hostname;

  // 通过dns.lookup解析主机名到IP地址
  dns.lookup(targetHost, (err, address, family) => {
    if (err) {
      console.error('DNS lookup error:', err);
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }

    // 检查解析出的IP地址是否为本地IP地址
    if (isLocalAddress(address)) {
      res.writeHead(403);
      res.end('Forbidden: Local address access is not allowed');
      return;
    }

    // 设置请求选项
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

      // 设置正确的 Content-Type
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'max-age=2592000'
      });
      res.end(body);
    });
  });
}).listen(6006, '0.0.0.0', () => {
  console.log('Proxy server is running at http://0.0.0.0:6006/');
});
