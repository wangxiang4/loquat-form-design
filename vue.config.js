const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,

  chainWebpack: (config) => {
    config.externals({
      'vue': 'Vue',
      'element-ui': 'ELEMENT',
      'axios': 'axios'
    })
    config.resolve.alias
      .set('@', resolve('packages'))
      .set('@components', resolve('packages/components'))
      .set('@utils', resolve('packages/utils'))
      .set('@mixins', resolve('packages/mixins'))
  },

  devServer: {
    host: '0.0.0.0',
    port: 80,
    open: true,
    disableHostCheck: true
  },

  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: false
  }
}
