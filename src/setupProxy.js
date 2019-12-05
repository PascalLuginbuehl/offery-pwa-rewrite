const proxy = require("http-proxy-middleware")
module.exports = function(app) {
  app.use(
    "/api",
    proxy({
      target: "https://app.offery.ch/",
      changeOrigin: true,
    })
  )
}
