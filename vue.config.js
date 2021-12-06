const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir)
}
/** 标准横幅 **/
const package = require('./package.json')
const banner = `${package.name} v${package.version}
(c) 2021-${new Date().getFullYear()} entfrm开发团队-王翔
Released under the MIT License`

module.exports =  {

  productionSourceMap: false,

  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },

  chainWebpack: config => {

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
      .use(require('webpack').BannerPlugin, [banner])

    config
      .plugin("limitChunkCountPlugin")
      .use(require("webpack").optimize.LimitChunkCountPlugin, [{ maxChunks: 1 }])

    // set svg-sprite-loader
    config.module
      .rule('svg')
      // 其他 svg loader 排除 icons 目录
      .exclude.add(resolve('packages/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('packages/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

  },

  devServer: {
    host: '0.0.0.0',
    port: 80,
    open: true,
    disableHostCheck: true
  }
}
