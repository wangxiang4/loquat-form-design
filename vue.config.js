const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir)
}
const version = process.env.VERSION || require('./package.json').version;
const banner =
  ' loquat-form-designer v' + version +
  '\n' +
  ' (c) 2021-' +
  new Date().getFullYear() +
  ' entfrm开发团队-王翔\n' +
  ' Released under the MIT License.'

module.exports =  {

  productionSourceMap: false,

  chainWebpack: (config) => {

    config.externals({
      'vue': 'Vue',
      'element-ui': 'ELEMENT'
    })

    config.resolve.alias
      .set('@', resolve('packages'))
      .set('@components', resolve('packages/components'))
      .set('@utils', resolve('packages/utils'))
      .set('@mixins', resolve('packages/mixins'))

    config.plugin('banner')
      .use(require('webpack/lib/BannerPlugin'), [banner])
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
