const proxy = require("http-proxy-middleware")
module.exports = function(app) {
  app.use(
    "/api",
    proxy({
      target: "https://testapp.offery.ch/",
      changeOrigin: true,
    })
  )
}
