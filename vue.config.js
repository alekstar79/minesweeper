module.exports = {
  publicPath: '',
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Minesweeper'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },
  // https://stackoverflow.com/a/66646320
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          ...options.compilerOptions,
          isCustomElement: tag => tag.startsWith('ion-')
        }

        return options
      })
  }
}
