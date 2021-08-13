/**
 * @program: loquat-form-design
 *
 * @description: 全局变量
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-15
 **/
export const KEY_COMPONENT_NAME_LINE = 'loquat-'
export const KEY_COMPONENT_CONFIG_NAME_LINE = 'loquat-config-'
export const KEY_COMPONENT_NAME = 'Loquat'
export const KEY_COMPONENT_CONFIG_NAME = 'LoquatConfig'
/** 查找参数路径表达式,比如a[0].b.c对应匹配(a,0,b,c) **/
export const PROP_PATH_EXPRESSION = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g
export const DATE_LIST = [
  'dates',
  'date',
  'datetime',
  'datetimerange',
  'daterange',
  'time',
  'timerange',
  'week',
  'month',
  'monthrange',
  'year'
]
export const INPUT_LIST = ['tree', 'number', 'icon', 'color', 'table', 'map']
export const ARRAY_LIST = ['img', 'array', 'url']
export const MULTIPLE_LIST = ['tree', 'select']
export const ARRAY_VALUE_LIST = ARRAY_LIST.concat(['upload', 'dynamic', 'map', 'checkbox', 'cascader', 'dynamic', 'timerange', 'monthrange', 'daterange', 'datetimerange', 'dates'])
export const SELECT_LIST = DATE_LIST.concat(['select', 'checkbox', 'radio', 'cascader', 'tree', 'color', 'icon', 'table', 'map'])
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
  readonly: false
}
export const JS_EXECUTE_INCLUDE = ['mounted']
export const EVENT_DICT = {
  change: '值发生变化',
  focus: '获取焦点',
  blur: '失去焦点'
}
export const DIC_PROPS = {
  nodeKey: 'id',
  label: 'label',
  value: 'value',
  desc: 'desc',
  groups: 'groups',
  title: 'title',
  leaf: 'leaf',
  children: 'children',
  labelText: '名称',
  disabled: 'disabled'
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

