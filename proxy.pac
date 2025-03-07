const os = require('os')

// const STEWARD_IP = os.networkInterfaces()['en0'].find(item => item.family === 'IPv4').address

function FindProxyForURL(url, host) {
  // 记录每次代理判断的详细信息
  console.log(`[代理请求] URL: ${url}, Host: ${host}`);
  if (shExpMatch(url, '*/steward/*')) {
    return `PROXY 10.33.158.4:9999;`
  }
  console.log(`[直连请求] URL: ${url}, Host: ${host}`);
  return 'DIRECT;'
}
