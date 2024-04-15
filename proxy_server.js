const http = require('http');
const url = require('url');
const request = require('request');
const fs = require('fs');
const cors = require('cors'); // ����corsģ��

// HTTP����������ĵ�ַ
const proxyServer = 'http://192.168.44.2:10811';

// ����� Referer �б�
const allowedReferers = [
  'https://www.test.com/',
  'http://anotherwebsite.com/'
];

// ����һ�� HTTP ������
http.createServer((req, res) => {
  // ���ÿ���ͷ
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ���������е� URL �Ͳ���
  const { pathname, query } = url.parse(req.url, true);

  // ��ȡҪ����� URL �� Referer
  const proxyUrl = query.url;
  const referer = req.headers.referer;
  
  // ����Ƿ�ʹ�ô���
  const useProxy = query.proxy === '1';

  // ��� Referer �Ƿ�������� Referer �б���
  if (referer && !allowedReferers.some(allowedReferer => referer.startsWith(allowedReferer))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // ��������ѡ��
  const requestOptions = {
    url: proxyUrl,
    encoding: null // ����Ϊnull�Ի�ȡԭʼ�Ķ���������
  };
  if (useProxy) {
    requestOptions.proxy = proxyServer;
  }

  // ʹ�� request ģ�鷢������
  request(requestOptions, (error, response, body) => {
    if (error) {
      console.error('Error:', error);
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }

    // ���ļ�������Ϊ��Ӧ���ظ��ͻ���
    const filename = proxyUrl.substring(proxyUrl.lastIndexOf('/') + 1);
    const contentType = response.headers['content-type'];

    // ������ȷ�� Content-Type
    res.writeHead(200, {
      'Content-Type': contentType
    });
    res.end(body);
  });
}).listen(6006, '0.0.0.0', () => {
  console.log('Proxy server is running at http://0.0.0.0:6006/');
});
