/**
 * @program: loquat-form-design
 *
 * @description: 全局配置
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-11-25
 */
import fields from '@components/fields'

export const GlobalConfig = {
  fields: fields,
  axios: () => {},
  qiniu: {
    up: 'https://upload.qiniup.com', // 存储地区，默认为华东，其他的如下表
    bucket: 'loquat', // 存储空间名称
    ak: 'z1KE2yt6JzO9zVxqPsnVo5m9AeI-dDTpia_qTb6X', // 七牛云相关密钥
    sk: 'outhjqeI2PiHZnKsQTZD5DGP3GLzEUf1-w5C0ak6', // 七牛云相关密钥
    deadline: 1 // token过期时间(单位:h)
  },
  eventsDic: {
    change: '值发生变化',
    focus: '获取焦点',
    blur: '失去焦点',
    uploadSuccess: '上传成功',
    uploadError: '上传失败',
    uploadRemove: '移除'
  },
  formExecuteCallbackHooks: ['mounted'],
  jsonOptionDefaultConfig: {
    space: 2,
    dropQuotesOnKeys: true,
    dropQuotesOnNumbers: false,
    inlineShortArrays: false,
    inlineShortArraysDepth: 1,
    quoteType: 'single',
    minify: false
  },
  widgetFormDefaultConfig: {
    column: [],
    labelPosition: 'right',
    labelWidth: 90,
    size: 'small',
    styleSheets: '',
    customClass: [],
    eventScript: [
      {
        'key': 'mounted',
        'name': 'mounted',
        'func': ''
      }
    ],
    dataSource: [
      {
        key: 'upload',
        name: 'Get Upload Token',
        url: 'http://tools-server.making.link/api/uptoken',
        method: 'GET',
        auto: true,
        thirdPartyAxios: false,
        headers: {},
        params: {},
        requestFunc: 'return config;',
        responseFunc: 'return res.uptoken;',
        errorFunc: ''
      },
      {
        key: 'options',
        name: 'Get Options',
        url: 'http://tools-server.making.link/api/new/options',
        method: 'GET',
        auto: true,
        thirdPartyAxios: false,
        headers: {},
        params: {},
        requestFunc: 'return config;',
        responseFunc: 'return res.data;',
        errorFunc: ''
      }
    ]
  },
  defaultRemoteOption: {
    optionDefault: [
      { value: '4399小游戏', label: '4399小游戏' },
      { value: '7k7k小游戏', label: '7k7k小游戏' },
      { value: '拇指玩小游戏', label: '拇指玩小游戏' }
    ]
  },
  defaultRemoteFunc: {
    funcDefault () {
      return [
        { value: '小白兔', label: '小白兔' },
        { value: '煎饼果子', label: '煎饼果子' },
        { value: '彩虹猫', label: '彩虹猫' }
      ]
    },
    funcGetToken () {
      const packages = require('@utils/packages')
      const getToken = require('@utils/qiniuOss')
      if (!window.CryptoJS) {
        packages.logs('CryptoJS')
        return
      }
      const oss = GlobalConfig.qiniu
      return getToken(oss.ak, oss.sk, {
        scope: oss.bucket,
        deadline: new Date().getTime() + (oss.deadline || 1) * 3600
      })
    }
  }
}

export default GlobalConfig
