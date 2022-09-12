const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  var query;
  var headers;

  app.use("/api", (req, _, next) => {
    console.log(req.query);
    query = req.query;
    headers = req.headers;
    next();
  });

  app.use(
    "/api",
    createProxyMiddleware({
      body: query,
      headers,
      target: "https://vy43n4fiyh.execute-api.ca-central-1.amazonaws.com",
      changeOrigin: true,
    })
  );
};
