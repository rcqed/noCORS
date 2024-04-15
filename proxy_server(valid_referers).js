const http = require('http');
const url = require('url');
const request = require('request');
const fs = require('fs');

// HTTP����������ĵ�ַ
const proxyServer = 'http://192.168.44.2:10810';

// ����� Referer �б�
const allowedReferers = [
  'https://www.test1.com/',
  'https://www.test2.com/'
];

// ����һ�� HTTP ������
http.createServer((req, res) => {
  // ���������е� URL �Ͳ���
  const { pathname, query } = url.parse(req.url, true);

  // ��ȡҪ����� URL �� Referer
  const proxyUrl = query.url;
  const referer = req.headers.referer;

  // ��� Referer �Ƿ�������� Referer �б���
  if (!referer || !allowedReferers.some(allowedReferer => referer.startsWith(allowedReferer))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // ʹ�� request ģ�鷢������
  request({
    url: proxyUrl,
    encoding: null // ����Ϊnull�Ի�ȡԭʼ�Ķ���������
  }, (error, response, body) => {
    if (error) {
      console.error('Error:', error);
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }

    // ���ļ�������Ϊ��Ӧ���ظ��ͻ���
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
