/**
 * @program: loquat-form-design
 *
 * @description: 内置变量
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-15
 */
export const KEY_COMPONENT_NAME = 'loquat-'
export const KEY_COMPONENT_CONFIG_NAME = KEY_COMPONENT_NAME.concat('config-')
export const MULTIPLE_FEATURE_TYPES = ['cascader', 'select']
export const RANGE_FEATURE_TYPES = ['slider', 'time']
export const ARRAY_VALUE_TYPES = ['upload', 'checkbox', 'cascader', 'monthrange', 'daterange', 'datetimerange', 'dates', 'childForm']
export const NUMBER_VALUE_TYPES = ['inputNumber', 'rate', 'slider']
export const BOOLEAN_VALUE_TYPES = ['switch']
export const SELECT_TYPES = ['date', 'select', 'checkbox', 'radio', 'cascader', 'inputColor', 'time']
export const REMOTE_REQUEST_TYPES = ['upload', 'select', 'radio', 'checkbox', 'cascader']
export const CHILD_FORM_DRAGGABLE_EXCLUDE_TYPES = ['coralLayout', 'childForm']
/** 文件类型定义 todo:目前这种方式存在一定的限制,后期会拔除 */
export const TYPE_LIST = {
  img: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)/,
  video: /\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|ogg|mp4)/
}
/** 默认的表单配置选项 */
export const DEFAULT_CONFIG_INSIDE_FORM = {
  size: 'small',
  labelPosition: 'left',
  labelWidth: 90,
  labelSuffix: ':'
}
/** 默认的子表单配置选项 */
export const DEFAULT_CONFIG_INSIDE_CHILD_FORM = {
  size: 'small',
  indexExecuteWidth: 50,
  indexExecuteLabel: '#'
}
export const UPLOAD_CONFIG_PROPS = {
  home: '',
  res: '',
  name: 'name',
  url: 'url',
  resUrl: 'data',
  fileName: 'file'
}
/** 通用参数键配置 */
export const DIC_PROPS = {
  label: 'label',
  value: 'value',
  desc: 'desc',
  groups: 'groups',
  children: 'children',
  disabled: 'disabled'
}
/** 带发音符号的拉丁字母映射表(unicode带发音符号的拉丁字母映射到基本拉丁字母) */
export const BASIC_LATIN_MAPPING = {
  // Latin-1 补充块.
  '\xc0': 'A', '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a', '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C', '\xe7': 'c',
  '\xd0': 'D', '\xf0': 'd',
  '\xc8': 'E', '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e', '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I', '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i', '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N', '\xf1': 'n',
  '\xd2': 'O', '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o', '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U', '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u', '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y', '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // 拉丁语扩展 A 块.
  '\u0100': 'A', '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a', '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C', '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c', '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D', '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E', '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e', '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G', '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g', '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H', '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I', '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i', '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J', '\u0135': 'j',
  '\u0136': 'K', '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L', '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l', '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N', '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n', '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O', '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o', '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R', '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r', '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S', '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's', '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T', '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't', '\u0165': 't', '\u0167': 't',
  '\u0168': 'U', '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u', '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W', '\u0175': 'w',
  '\u0176': 'Y', '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z', '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z', '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 's'
}

