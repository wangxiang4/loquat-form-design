/**
 * @program: loquat-form-design
 *
 * @description: 提示需要引入的包,否则对应的功能使用不了
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-15
 */

import $Log from './log'
const list = {
  'Sortable': {
    url: 'https://cdn.staticfile.org/Sortable/1.10.0-rc2/Sortable.min.js',
    title: '表格拖拽，需要引sortableJs',
    version: '1.10.0-rc2',
    github: 'https://github.com/SortableJS/Sortable'
  },
  'thirdPartyAxios': {
    title: '需要引入第三方axios发送数据包',
    url: 'https://cdn.staticfile.org/axios/0.21.1/axios.js',
    version: '0.21.1',
    github: 'https://github.com/axios/axios'
  },
  'CryptoJS': {
    url: 'http://qtestbucket.qiniudn.com/demo/CryptoJS.js',
    title: '七牛云图片上传，需要引入CryptoJS',
    version: '3.1.2'
  },
  'AliOSS': {
    url: 'https://cdn.bootcdn.net/ajax/libs/ali-oss/6.2.1/aliyun-oss-sdk.min.js',
    title: '阿里云云图片上传，需要引入OSS的sdk',
    version: '6.1.0',
    github: 'https://github.com/ali-sdk/ali-oss/'
  }
}

export default (() => {
  return {
    logs: function (name) {
      const obj = list[name]
      $Log.capsule(
        name,
        obj.title,
        'warning'
      )
      $Log.warning('版本:' + (obj.version || '-'))
      $Log.warning('CDN:' + (obj.url || '-'))
      $Log.warning('GITHUB:' + (obj.github || '-'))
    }
  }
})()
