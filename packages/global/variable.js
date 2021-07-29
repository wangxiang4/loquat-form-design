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
  span: 12,
  size: 'small',
  labelPosition: 'left',
  labelWidth: 90,
  labelSuffix: ':',
  gutter: 20,
  offset: 0,
  readonly: false,
  disabled: false
}
export const JS_EXECUTE_INCLUDE = ['mounted']
export const EVENT_DICT = {
  change: '值发生变化',
  focus: '获取焦点',
  blur: '失去焦点'
}

