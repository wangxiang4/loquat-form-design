/**
 * @program: loquat-form-design
 *
 * @description: 全局配置
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-11-25
 */

export const GlobalConfig = {
  axiosInstance: () => {},
  fields: require('@components/fields').default,
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
    uploadRemove: '移除',
    'row-add': '子表单添加行',
    'row-del': '子表单添加行'
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
  /** 更多配置详情参考地址:https://github.com/beautify-web/js-beautify **/
  beautifierDefaultsConf: {
    // 此配置可以通用(html,js,css),需要额外参数可以合并默认配置或者遗迹默认配置
    'indent_size': 2, // 缩进大小
    'indent_char': ' ', // 缩进字符
    'max_preserve_newlines': 0, // 一个块中要保留的换行符数
    'preserve_newlines': false, // 是否保留元素前的现有换行符
    'keep_array_indentation': false, // 保留数组缩进
    'break_chained_methods': false, // 跨后续行中断链式方法调用
    'brace_style': 'end-expand', // 设置大括号的位置,end-expand在自己的直线上尾部放置
    'space_before_conditional': true, // if(true)与if(true)之间是否需要加空格
    'unescape_strings': false, // 解码用xNN表示法编码的可打印字符
    'jslint_happy': false, // 启用 eslint-strict 模式
    'end_with_newline': true, // 用换行符结束输出
    'wrap_line_length': 110, // 超过N个字符换行
    'indent_inner_html': true, // 缩进html身体和头部部分
    'comma_first': false, // 将逗号放在新行的开头而不是结尾
    'e4x': true, // 通过原样传递 E4X xml 文字
    'indent_empty_lines': true // 在空行上保持缩进
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
      const packages = require('@utils/packages').default
      const getToken = require('@utils/qiniuOss').default
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
