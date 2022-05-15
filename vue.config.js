
const { defineConfig } = require('@vue/cli-service')

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  chainWebpack: config => {
    config.plugin('polyfills').use(NodePolyfillPlugin)
  },
  transpileDependencies: true,
  devServer: {
    port: 8081
  }
})