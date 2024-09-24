const http = require('http');
const url = require('url');
const request = require('request');
const dns = require('dns');

// HTTP����������ĵ�ַ
const proxyServer = 'http://192.168.44.3:20171';

// ����� Referer �б�
const allowedReferers = [
  'https://www.00083.cn',
  'https://www.atby.cn'
];

// �����Ƿ��� Referer �ĳ���,����Y��N
const refererCheck = 'Y';

// ����һ�� HTTP ������
http.createServer((req, res) => {

  // ��ȡ����ͷ�е� Origin
  const origin = req.headers.origin;

  // ���� CORS ͷ����������� Origin ����Ƿ��������
  if (origin && allowedReferers.some(allowedReferer => origin.startsWith(allowedReferer))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'null'); // ��ֹ������� Origin
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ���������е� URL �Ͳ���
  const { pathname, query } = url.parse(req.url, true);
  // ��ȡҪ����� URL 
  const proxyUrl = query.url;
  // ��ȡ����ͷ�е� Referer
  const referer = req.headers.referer;
  
  // ����Ƿ�ʹ�ô���
  const useProxy = query.proxy === '1';

  // ���� refererCheck ��ֵ�����Ƿ��� Referer
  if (refererCheck === 'Y') {
    // ���Referer�Ƿ�Ϊ��
    if (!referer) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
  }

  // ��� Referer �Ƿ�������� Referer �б���
  if (referer && !allowedReferers.some(allowedReferer => referer.startsWith(allowedReferer))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // ����Ŀ��URL��������
  const targetHost = url.parse(proxyUrl).hostname;
  // ͨ��dns.lookup������������IP��ַ
  dns.lookup(targetHost, (err, address, family) => {
    if (err) {
      console.error('DNS lookup error:', err);
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }

	// ���ص�ַ������ʽ����ֹ����IP���������
	const localAddressRegex = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+)$/;
	// ���IP��ַ�Ƿ�Ϊ����IP��ַ
	function isLocalAddress(ip) {
	  return localAddressRegex.test(ip);
	}
    // ����������IP��ַ�Ƿ�Ϊ����IP��ַ
    if (isLocalAddress(address)) {
      res.writeHead(403);
      res.end('Forbidden: Local address access is not allowed');
      return;
    }

    // ��������ѡ��
    const requestOptions = {
      url: proxyUrl,
      encoding: null // ����Ϊnull�Ի�ȡԭʼ�Ķ���������
    };
	// ���� useProxy �������ô��������
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
        'Content-Type': contentType,
        'Cache-Control': 'max-age=2592000'
      });
      res.end(body);
    });
  });
}).listen(6006, '0.0.0.0', () => {
  console.log('Proxy server is running at http://localhost:6006/');
});
