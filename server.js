const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 获取本机 IP 地址
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  const en0 = interfaces['en0'];
  if (en0) {
    const ipv4 = en0.find(item => item.family === 'IPv4');
    return ipv4 ? ipv4.address : 'localhost';
  }
  return 'localhost';
};

const server = http.createServer((req, res) => {
  const pacFile = path.join(__dirname, 'proxy.pac');
  const clientIP = req.socket.remoteAddress;
  
  console.log(`\n[${new Date().toLocaleString()}] 新请求:`);
  console.log(`- 客户端IP: ${clientIP}`);
  console.log(`- 请求URL: ${req.url}`);
  console.log(`- User-Agent: ${req.headers['user-agent']}`);
  
  fs.readFile(pacFile, 'utf8', (err, data) => {
    if (err) {
      console.error('读取 PAC 文件失败:', err);
      res.writeHead(500);
      res.end('Error loading PAC file');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/x-ns-proxy-autoconfig',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(data);
    console.log('- PAC 文件已发送');
  });
});

const PORT = 8080;
const localIP = getLocalIP();
server.listen(PORT, () => {
  console.log(`PAC 文件服务器运行在: http://${localIP}:${PORT}`);
  console.log(`在手机上使用此地址配置代理: http://${localIP}:${PORT}/proxy.pac`);
});