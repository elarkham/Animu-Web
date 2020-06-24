module.exports = {
  css: {
    //modules: true,
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        data: `@import "@/style/global/_settings.scss";`
      }
    }
  },
  configureWebpack: {
    devServer: {
      disableHostCheck: true
    }
  }
}
