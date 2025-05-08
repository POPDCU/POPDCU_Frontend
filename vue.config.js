const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  assetsDir: 'static',
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://port-0-popdcu-back-test-3yl7k2blopd9kw1.sel5.cloudtype.app',
        ws: true,
        changeOrigin: true
      },
    }
  }
})
