/**
 * @program: loquat-form-design
 *
 * @description: loquat工具类
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-15
 **/
import {
  WIDGET_FORM_DEFAULT_CONFIG, BASIC_LATIN_MAPPING,
  JSON_OPTION_DEFAULT_CONFIG } from '@/global/variable'
import {
  RE_PROP_NAME, RE_LATIN, RE_COMBO_RANGE, RE_APOS,
  RE_HAS_UNICODE_WORD, RE_UNICODE_WORD, RE_ASCII_WORD
} from '@/global/regex'
import random from '@utils/random'

/** 设置px像素 **/
export function setPx (val, defval = '') {
  if (validateNull(val)) val = defval
  if (validateNull(val)) return ''
  val = val + ''
  if (val.indexOf('%') === -1) {
    val = val + 'px'
  }
  return val
}

/** 对象深拷贝 **/
export function deepClone (data) {
  const type = getObjType(data)
  let obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i++) {
      data[i] = (() => {
        if (data[i] === 0) {
          return data[i]
        }
        return data[i]
      })()
      if (data[i]) {
        delete data[i].$parent
      }
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (const key in data) {
      if (data) {
        delete data.$parent
      }
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

/** 获取对象类型 **/
export function getObjType (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

/** 判断是否为空 **/
export function validateNull (val) {
  // 特殊判断
  if (val && parseInt(val) === 0) return false
  const list = ['$parent']
  if (val instanceof Date || typeof val === 'boolean' || typeof val === 'number') return false
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    val = deepClone(val)
    list.forEach(ele => {
      delete val[ele]
    })
    for (const o in val) {
      return false
    }
    return true
  } else {
    if (
      val === 'null' ||
      val == null ||
      val === 'undefined' ||
      val === undefined ||
      val === ''
    ) {
      return true
    }
    return false
  }
  return false
}

/** 路径string格式转换为数组格式 **/
export function pathFormat (val) {
  const result = []
  if (val.charCodeAt(0) === 46) {
    result.push('')
  }
  val.replace(RE_PROP_NAME, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(/\\(\\)?/g, '$1') : (number || match))
  })
  return result
}

/** 获取对象值 **/
export function get (object, path, defaultValue) {
  if (!path || typeof path !== 'string') return object
  path = RegExp('^\w*$').test(path) ? [path] : pathFormat(path)
  let index = 0
  const length = path.length
  while (object != null && index < length) {
    object = object[path[index++]]
  }
  return object == null ? defaultValue : object
}

/** 生成随机8位ID **/
export function randomId8 () {
  return random(8)
}

/** 字符串数据类型转化 **/
export function detailDataType (value, type) {
  if (type === 'number') {
    return Number(value)
  } else if (type === 'string') {
    return value + ''
  } else {
    return value
  }
}

/** 将base64地址转换为文件 **/
export function dataURLtoFile (dataUrl, filename) {
  const arr = dataUrl.split(',')
  // 获取Base64类型
  const mime = arr[0].match(/:(.*?);/)[1]
  // 解码Base64
  const buffStr = atob(arr[1])
  let n = buffStr.length
  // 将二进制数据转换为utf-8
  const utf8Arr = new Uint8Array(n)
  while (n--) {
    utf8Arr[n] = buffStr.charCodeAt(n)
  }
  return new File([utf8Arr], filename, {
    type: mime
  })
}

/** 文件上传判断是否拼接根地址加子地址 **/
export function getFileUrl (home, uri) {
  return getObjType(uri) === 'string'
    ? uri.match(/(^http:\/\/|^https:\/\/|^\/\/|data:image\/)/) ? uri : urlJoin(home, uri)
    : ''
}

/** 处理字节容量计算 **/
export function byteCapacityCompute (fileSize, unit) {
  switch (unit) {
    case 'KB':
      return fileSize / 1024
    case 'MB':
      return fileSize / 1024 / 1024
    case 'GB':
      return fileSize / 1024 / 1024 / 1024
  }
}

/** 处理url路径拼接是否自动加斜杠 **/
export function urlJoin (base, url) {
  return (getObjType(base) === 'string' && getObjType(url) === 'string')
    ? `${base.replace(/([\w\W]+)\/$/, '$1')}/${url.replace(/^\/([\w\W]+)$/, '$1')}`
    : url
}

/** 获取部件表单默认配置 **/
export function getWidgetFormDefaultConfig () {
  return deepClone(WIDGET_FORM_DEFAULT_CONFIG)
}

/** 获取json选项默认配置 **/
export function getJsonOptionDefaultConfig () {
  return deepClone(JSON_OPTION_DEFAULT_CONFIG)
}

/** 驼峰转下划线 **/
export function kebabCase (str) {
  return createCompounder(str, (result, word, index) =>
    result + (index ? '-' : '') + word.toLowerCase())
}

/** 下划线转驼峰 **/
export function camelCase (str) {
  return createCompounder(str, (result, word, index) => {
    word = word.toLowerCase()
    return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word)
  })
}

/**
 * 创建字符串单词复合器
 * 字符串先按特定字符串的写法分割
 * 根据组合每个单词的函数进行复合
 *
 * @private
 * @param {string} [string=''] 要检查的字符串.
 * @param {Function} callback 组合每个单词的函数。
 * @returns {Function} 返回新的复合函数。
 * @example
 *
 * (wang xiang)
 * // => ['wang','xiang']
 *
 * ('wangXiang')
 * // => ['wang','Xiang']
 *
 * ('__WANG_XIANG__')
 * // => ['WANG','XIANG']
 */
function createCompounder (string, callback) {
  return arrayReduce(words(deburr(string).replace(RE_APOS, '')), callback, '')
}

/**
 * 数组累加器
 * 使用迭代函数进行迭代累加处理
 * @private
 * @param {Array} [array] 要迭代的数组.
 * @param {Function} iteratee 每次迭代调用的函数.
 * @param {*} [accumulator] 初始值.
 * @param {boolean} [initAccum] 指定使用 `array` 的第一个元素作为初始值.
 * @returns {*} 返回累计值.
 */
function arrayReduce (array, iteratee, accumulator, initAccum) {
  let index = -1
  const length = array == null ? 0 : array.length

  if (initAccum && length) {
    accumulator = array[++index]
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array)
  }
  return accumulator
}

/**
 * 去除字符串中的一些毛刺
 * 带发音符号的拉丁字母,组合变音符号
 *
 * 替换说明:替换那些带发音符号的拉丁字母(á->a)
 * Latin-1补充块: https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table
 * 拉丁语扩展A块.: https://en.wikipedia.org/wiki/Latin_Extended-A
 * 删除说明:删除变音符号
 * 结合变音符号: https://en.wikipedia.org/wiki/Combining_Diacritical_Marks
 * @public
 * @param {string} [string='']  要去毛刺的字符串.
 * @returns {string} 返回去毛刺的字符串.
 * @example
 *
 * deburr('wángxiáng');
 * // => 'wangxiang'
 */
export function deburr (string) {
  string = String(string)
  return string && string.replace(RE_LATIN, (match) => BASIC_LATIN_MAPPING[match]).replace(RE_COMBO_RANGE, '')
}

/**
 * 将字符串拆分为其单词的数组
 *
 * @public
 * @param {string} [string=''] 要检查的字符串.
 * @param {RegExp|string} [pattern] 匹配单词的模式.
 * @returns {Array} 返回 `string` 的单词.
 * @example
 *
 * 分割规则:可以使用(数学运算符,除了字母数字外的符号,常用标点符号,空白,驼峰命名写法,表情符号)分割
 * 具体实现请参考: RE_UNICODE_WORD正则表达式
 * 具体正则分割逻辑:
 * (?=' + [RS_BREAK, RS_UPPER, '$'].join('|')
 * (?=' + [RS_BREAK, RS_UPPER + RS_MISC_LOWER, '$'].join('|')
 *
 * words('wangXiang')
 * // => ['wang', 'Xiang']
 *
 * words('wang&,&xiang')
 * // => ['wang', 'xiang']
 *
 * words('wang&,&xiang', /[^, ]+/g)
 * // => ["'wang&", '&xiang']
 */
export function words (string, pattern) {
  string = String(string)
  if (pattern === undefined) {
    return RE_HAS_UNICODE_WORD.test(string)
      ? string.match(RE_UNICODE_WORD) || []
      : string.match(RE_ASCII_WORD) || []
  }
  return string.match(pattern) || []
}

export function noop () {}
