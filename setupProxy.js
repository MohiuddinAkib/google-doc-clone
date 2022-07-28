const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://jotey-api.happihub.com",
      changeOrigin: true,
    })
  );
};
