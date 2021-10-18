/**
 * @program: loquat-form-design
 *
 * @description: 全局变量
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-15
 **/
export const KEY_COMPONENT_NAME = 'Loquat'
export const KEY_COMPONENT_NAME_LINE = 'loquat-'
export const KEY_COMPONENT_CONFIG_NAME = 'LoquatConfig'
export const KEY_COMPONENT_CONFIG_NAME_LINE = 'loquat-config-'
/** 查找参数路径表达式,比如a[0].b.c对应匹配(a,0,b,c) **/
export const PROP_PATH_EXPRESSION = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g
export const INPUT_FEATURE_TYPES = ['number', 'color']
export const MULTIPLE_FEATURE_TYPES = ['cascader', 'select']
export const RANGE_FEATURE_TYPES = ['slider', 'time']
export const ARRAY_VALUE_TYPES = ['upload', 'checkbox', 'cascader', 'monthrange', 'daterange', 'datetimerange', 'dates']
export const NUMBER_VALUE_TYPES = ['number', 'rate', 'slider']
export const SELECT_TYPES = ['date', 'select', 'checkbox', 'radio', 'cascader', 'color', 'time']
export const REMOTE_REQUEST_TYPES = ['upload', 'select', 'radio', 'checkbox', 'cascader']
export const IMPORT_JSON_TEMPLATE = `{
  "column": [],
  "labelPosition": "left",
  "labelWidth": 120,
  "size": "small"
}`
export const FORM_DEFAULT_PROP = {
  size: 'small',
  labelPosition: 'left',
  labelWidth: 90,
  labelSuffix: ':',
  readonly: false,
  disabled: false
}
export const JS_EXECUTE_INCLUDE = ['mounted']
export const EVENT_DICT = {
  change: '值发生变化',
  focus: '获取焦点',
  blur: '失去焦点',
  uploadSuccess: '上传成功',
  uploadError: '上传失败',
  uploadRemove: '移除'
}
export const DIC_PROPS = {
  label: 'label',
  value: 'value',
  desc: 'desc',
  groups: 'groups',
  children: 'children',
  disabled: 'disabled'
}
export const UPLOAD_CONFIG_PROPS = {
  home: '',
  res: '',
  name: 'name',
  url: 'file',
  resUrl: 'data',
  fileName: 'file'
}
/** 更多配置详情参考地址:https://github.com/beautify-web/js-beautify **/
export const BEAUTIFIER_DEFAULTS_CONF = {
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
}

