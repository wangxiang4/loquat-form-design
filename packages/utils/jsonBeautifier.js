/**
 * @program: loquat-form-design
 *
 * @description: json美化,可以根据配置进行格式化
 *
 * 参数说明:
 * space:
 *   * description: 指定缩进
 *   * default: 2
 *   * type: Number
 *
 * dropQuotesOnKeys:
 *   * description: 是否删除对象key上的引号
 *   * default: false
 *   * type: Boolean
 *
 * dropQuotesOnNumbers:
 *   * description: 是否删除对象值是数字里的引号
 *   * default: false
 *   * type: Boolean
 *
 * inlineShortArrays:
 *   * description: 是否开启折叠对象中的数组
 *   * default: false
 *   * type: Boolean
 *
 * inlineShortArraysDepth:
 *   * description: 折叠对象中的数组,折叠深度
 *   * default: 1
 *   * type: Number
 *
 * quoteType:
 *   * description: 引号类型(single,double)
 *   * default: double
 *   * type: String
 *
 * minify:
 *   * description: 缩小json,去掉一切的格式
 *   * default: false
 *   * type: Boolean
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-7-9
 */
/* eslint-disable no-misleading-character-class */
const escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
const keyable = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
let gap
let indent
// 字符替换表
const meta = {
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  '"': '\\"',
  "'": "\\'",
  '\\': '\\\\'
}
let rep

export default function convert (object, options = {}) {
  const space = options.space || 2
  const dropQuotesOnKeys = options.dropQuotesOnKeys || false
  const dropQuotesOnNumbers = options.dropQuotesOnNumbers || false
  const inlineShortArrays = options.inlineShortArrays || false
  const inlineShortArraysDepth = options.inlineShortArraysDepth || 1
  const quoteType = options.quoteType || 'double'
  const minify = options.minify || false

  if (dropQuotesOnNumbers) walkObjectAndDropQuotesOnNumbers(object)

  let result = stringify(object, null, minify ? undefined : space, dropQuotesOnKeys, quoteType)

  if (inlineShortArrays && !minify) {
    let newResult = inlineShortArraysInResult(result)
    // 深度递归折叠,默认深度折叠为1
    if (inlineShortArraysDepth > 1) {
      for (let i = 1; i < inlineShortArraysDepth; i++) {
        result = newResult
        newResult = inlineShortArraysInResult(result)
        if (newResult == result) break
      }
    }
    result = newResult
  }

  return result
}

// 删除对象值是数字里的引号
function walkObjectAndDropQuotesOnNumbers (object) {
  if (!isObject(object)) return
  const keys = Object.keys(object)
  if (!keys) return

  keys.forEach(function (key) {
    const value = object[key]
    if (typeof value === 'string') {
      const number = value - 0
      object[key] = isNaN(number) ? value : number
    } else if (isObject(value) || Array.isArray(value)) {
      walkObjectAndDropQuotesOnNumbers(value)
    }
  })
}

function isObject (o) {
  return o && typeof o === 'object'
}

// 当数组长度不超过指定宽度时折叠数组,就是变成一行,字符（包括缩进）
function inlineShortArraysInResult (result, width) {
  width || (width = 80)
  if (typeof width !== 'number' || width < 20) {
    throw "Invalid width '" + width + "'. Expecting number equal or larger than 20."
  }
  const list = result.split('\n')
  let i = 0
  let start = null
  let content = []
  while (i < list.length) {
    const startMatch = !!list[i].match(/\[/)
    const endMatch = !!list[i].match(/\],?/)

    if (startMatch && !endMatch) {
      content = [list[i]]
      start = i
    } else if (endMatch && !startMatch && start) {
      content.push((list[i] || '').trim())
      const inline = content.join(' ')
      if (inline.length < width) {
        list.splice(start, i - start + 1, inline)
        i = start
      }
      start = null
      content = []
    } else {
      if (start) content.push((list[i] || '').trim())
    }
    i += 1
  }
  return list.join('\n')
}

function stringify (value, replacer, space, dropQuotesOnKeys, quoteType) {
  // stringify 方法接受一个值和一个可选的替换器,以及一个可选的
  // space 参数,并返回一个 JSON 文本。替换器可以是一个函数
  // 可以替换值,或将选择键的字符串数组。
  // 可以提供默认的替换方法。空间参数的使用可以
  // 生成更易于阅读的文本。

  let i
  gap = ''
  indent = ''

  // 如果空格参数是一个数字,则制作一个包含该数字的缩进字符串
  if (typeof space === 'number') {
    for (i = 0; i < space; i += 1) {
      indent += ' '
    }
  // 如果空格参数是一个字符串,它将被用作缩进字符串。
  } else if (typeof space === 'string') {
    indent = space
  }

  // 如果有替换器,它必须是一个函数或一个数组,否则抛出错误。
  rep = replacer
  if (replacer && typeof replacer !== 'function' &&
    (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
    throw new Error('JSON.stringify')
  }

  // 返回字符串化值的结果,在''键下创建一个包含我们的值的假根对象。
  return str('', { '': value }, dropQuotesOnKeys, quoteType)
}

function str (key, holder, dropQuotesOnKeys, quoteType) {
  // 从 holder[key] 生成一个字符串。

  let i           // 循环计数器。
  let k           // 成员密钥。
  let v           // 值.
  let length
  const mind = gap
  let partial
  let value = holder[key]

  // 如果该值具有 toJson 方法,则调用它以获取替换值。
  if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }

  // 获得替代价值,如果我们被替换函数调用,那么调用替换函数
  if (typeof rep === 'function') {
    value = rep.call(holder, key, value)
  }

  // 接下来发生的事情取决于值的类型。
  switch (typeof value) {
    case 'string':
      return quote(value, quoteType)

    case 'number':
      // JSON数字必须是有限的,将非有限数编码为空。
      return isFinite(value) ? String(value) : 'undefined'

    // 如果类型是对象,我们可能正在处理一个对象或一个数组
    case 'object':

      // 由于ECMAScript中的规范错误,typeof null是'object',所以要注意这种情况。
      if (!value) return 'null'

      // 制作一个数组来保存字符串化这个对象值的部分结果。
      gap += indent
      partial = []

      // 该值是一个数组,字符串化每个元素对于非JSON值,使用null作为占位符。
      if (Object.prototype.toString.apply(value) === '[object Array]') {
        length = value.length
        for (i = 0; i < length; i += 1) {
          partial[i] = str(i, value, dropQuotesOnKeys, quoteType)
        }

        // 将所有元素连接在一起,用逗号分隔,并将它们包裹在大括号中。
        v = partial.length === 0
          ? '[]'
          : gap
            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
            : '[' + partial.join(',') + ']'
        gap = mind
        return v
      }

      // 如果替换器是一个数组,则使用它来选择要字符串化的成员。
      if (rep && typeof rep === 'object') {
        length = rep.length
        for (i = 0; i < length; i += 1) {
          if (typeof rep[i] === 'string') {
            k = rep[i]
            v = str(k, value, dropQuotesOnKeys, quoteType)
            partial.push((dropQuotesOnKeys ? condQuoteKey(k, quoteType) : quote(k, quoteType)) + (gap ? ': ' : ':') + v)
          }
        }
      } else {
        // 否则,遍历对象中的所有键。
        for (k in value) {
          if (Object.prototype.hasOwnProperty.call(value, k)) {
            v = str(k, value, dropQuotesOnKeys, quoteType)
            partial.push((dropQuotesOnKeys ? condQuoteKey(k, quoteType) : quote(k, quoteType)) + (gap ? ': ' : ':') + v)
          }
        }
      }

      // 将所有成员文本连接在一起,用逗号分隔,并将它们包裹在大括号中。
      v = partial.length === 0
        ? '{}'
        : gap
          ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
          : '{' + partial.join(',') + '}'
      gap = mind
      return v

    default:
      return String(value)
  }
}

function quote (string, quoteType) {
  // 如果字符串不包含控制字符、引号字符和不包含
  // 反斜杠字符，然后我们可以安全地在它周围加上一些引号。
  // 否则我们还必须用安全转义替换有问题的字符

  // 指定目标字符串的下一次搜索开始
  escapable.lastIndex = 0

  let surroundingQuote = '"'
  if (quoteType === 'single') {
    surroundingQuote = "'"
  }
  // 有问题的字符进行转义,匹配上方制定的字符替换表,如果字符替换表没有则生成对应unicode编码,匹配编码值最大数值4
  return escapable.test(string) ? surroundingQuote + string.replace(escapable, function (a) {
    const c = meta[a]
    return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
  }) + surroundingQuote : surroundingQuote + string + surroundingQuote
}

function condQuoteKey (string, quoteType) {
  return keyable.test(string) ? string : quote(string, quoteType)
}
