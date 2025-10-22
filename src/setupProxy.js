const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8032',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '/api', // reescribe la ruta
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔁 [PROXY] Redirigiendo:', req.method, req.originalUrl, '->', 'http://localhost:8032' + req.originalUrl);
      }
    })
  );
};