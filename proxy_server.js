const http = require('http');
const url = require('url');
const request = require('request');
const fs = require('fs');

// HTTP����������ĵ�ַ
const proxyServer = 'http://192.168.44.2:10811';

// ����һ�� HTTP ������
http.createServer((req, res) => {
  // ���������е� URL �Ͳ���
  const { pathname, query } = url.parse(req.url, true);

  // ��ȡҪ����� URL ���Ƿ�ʹ�ô���Ĳ���
  const proxyUrl = query.url;
  const useProxy = query.proxy === '1';

  // �����Ƿ�ʹ�ô�������������ѡ��
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
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    res.end(body);
  });
}).listen(6006, '192.168.44.3', () => {
  console.log('Proxy server is running at http://192.168.44.3:6006/');
});
