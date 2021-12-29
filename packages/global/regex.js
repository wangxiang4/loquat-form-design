/**
 * @program: loquat-form-design
 *
 * @description: 正则表达式全局变量
 * 需要正则表达式帮助请参考: https://regexr.com/
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-10-22
 */

/**
 * 用于组合unicode字符类,前缀请使用rs全名RecordSplit(记录分割符)
 * 更多帮助请参考:
 * https://unicode-table.com/cn/blocks/
 * https://unicode-table.com/cn/blocks/combining-diacritical-marks/
 * https://zh.wikipedia.org/wiki/Unicode%E5%AD%97%E7%AC%A6%E5%B9%B3%E9%9D%A2%E6%98%A0%E5%B0%84
 */
// 结合附加符号
const RS_COMBO_MARKS_RANGE = '\\u0300-\\u036f'
// 组合用半符号
const RS_COMBO_HALF_MARKS_RANGE = '\\ufe20-\\ufe2f'
// 组合用记号
const RS_COMBO_SYMBOLS_RANGE = '\\u20d0-\\u20ff'
// 匹配大写字母包含拉丁
const RS_UPPER_RANGE = 'A-Z\\xc0-\\xd6\\xd8-\\xde'
// 匹配小写字母包含拉丁
const RS_LOWER_RANGE = 'a-z\\xdf-\\xf6\\xf8-\\xff'
// 匹配数学运算符
const RS_MATH_OP_RANGE = '\\xac\\xb1\\xd7\\xf7'
// 匹配除了字母数字外的符号: https://www.ascii-code.com/
const RS_NON_CHAR_RANGE = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf'
// 匹配常用标点符号
const RS_PUNCTUATION_RANGE = '\\u2000-\\u206f'
// 匹配空白
const RS_SPACE_RANGE = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000'
// 定义分割字符,可以使用(数学运算符,除了字母数字外的符号,常用标点符号,空白)分割
const RS_BREAK_RANGE = RS_MATH_OP_RANGE + RS_NON_CHAR_RANGE + RS_PUNCTUATION_RANGE + RS_SPACE_RANGE
// 匹配代理对(高半区): https://cloud.tencent.com/developer/article/1641938
const RS_ASTRAL_RANGE = '\\ud800-\\udfff'
// 匹配印刷符号
const RS_DINGBAT_RANGE = '\\u2700-\\u27bf'
// 匹配表情符号变种字体: https://www.emojidaquan.com/emoji-variation-selector-16
const RS_VAR_RANGE = '\\ufe0e\\ufe0f'
// 匹配组合符号
const RS_COMBO_RANGE = RS_COMBO_MARKS_RANGE + RS_COMBO_HALF_MARKS_RANGE + RS_COMBO_SYMBOLS_RANGE

/** 用于组成unicode捕获组 */
const RS_DIGITS = '\\d+'
// 匹配单引号跟右单引号('’)
const RS_APOS = "['\u2019]"
const RS_UPPER = '[' + RS_UPPER_RANGE + ']'
const RS_LOWER = '[' + RS_LOWER_RANGE + ']'
const RS_BREAK = '[' + RS_BREAK_RANGE + ']'
const RS_DINGBAT = '[' + RS_DINGBAT_RANGE + ']'
const RS_COMBO = '[' + RS_COMBO_RANGE + ']'
const RS_NON_ASTRAL = '[^' + RS_ASTRAL_RANGE + ']'
// 不匹配除了字母外的字符的一些杂项符号比如一些表情符号等等
const RS_MISC = '[^' + RS_ASTRAL_RANGE + RS_BREAK_RANGE + RS_DIGITS + RS_DINGBAT_RANGE + RS_LOWER_RANGE + RS_UPPER_RANGE + ']'
// 匹配代理区域ud83c高半区中低半区为udde6-uddff的表情字符
const RS_REGIONAL = '(?:\\ud83c[\\udde6-\\uddff]){2}'
// 匹配高半区跟低半区一对,总共四个字节,例如占用4个字节的表情符号
const RS_SURR_PAIR = '[\\ud800-\\udbff][\\udc00-\\udfff]'
// 匹配ud83c高半区中低半区为udffb-udfff的表情字符
const RS_FITZ = '\\ud83c[\\udffb-\\udfff]'
// 匹配表情代理对时的渲染修改字符: http://www.ruanyifeng.com/blog/2017/04/emoji.html
const RS_MODIFIER = '(?:' + RS_COMBO + '|' + RS_FITZ + ')'
// 匹配零宽度连接符: https://www.emojiall.com/zh-hans/help-emoji-zwj-sequences
const RS_ZWJ = '\\u200d'

/** 用于编写 unicode 正则表达式 */
const RS_MISC_UPPER = '(?:' + RS_UPPER + '|' + RS_MISC + ')'
const RS_MISC_LOWER = '(?:' + RS_LOWER + '|' + RS_MISC + ')'
// 反对以'(d|ll|m|re|s|t|ve)的字母出现0次或1次不被拆分(d'd=>["d'd"])
const RS_OPT_CONTR_LOWER = '(?:' + RS_APOS + '(?:d|ll|m|re|s|t|ve))?'
// 反对以'(D|LL|M|RE|S|T|VE)的字母出现0次或1次不被拆分(D'D=>["D'D"])
const RS_OPT_CONTR_UPPER = '(?:' + RS_APOS + '(?:D|LL|M|RE|S|T|VE))?'
// 支持特定的字母连接数字并且不会被拆分(1ST|2ND|3RD|4,5,6...TH)(123RD=>["123RD"])
const RS_ORD_UPPER = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])'
// 支持特定的字母连接数字并且不会被拆分(1st|2nd|3rd|4,5,6...th)(123rd=>["123rd"])
const RS_ORD_LOWER = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])'
const RS_OPT_VAR = '[' + RS_VAR_RANGE + ']?'
const RS_OPT_MOD = RS_MODIFIER + '?'
const RS_OPT_JOIN = '(?:' + RS_ZWJ + '(?:' + [RS_NON_ASTRAL, RS_REGIONAL, RS_SURR_PAIR].join('|') + ')' + RS_OPT_VAR + RS_OPT_MOD + ')*'
const RS_SEQ = RS_OPT_VAR + RS_OPT_MOD + RS_OPT_JOIN
const RS_EMOJI = '(?:' + [RS_DINGBAT, RS_REGIONAL, RS_SURR_PAIR].join('|') + ')' + RS_SEQ

/** 全局匹配prop参数路径,比如a[0].b.c对应匹配(a,0,b,c) */
export const RE_PROP_NAME = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g

/** 全局匹配Unicode拉丁字母(不包括数学运算符) */
export const RE_LATIN = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g

/** 全局匹配组合符号 */
export const RE_COMBO_RANGE = RegExp(`[${RS_COMBO_MARKS_RANGE}${RS_COMBO_HALF_MARKS_RANGE}${RS_COMBO_SYMBOLS_RANGE}]`, 'g')

/** 全局匹配引号 */
export const RE_APOS = RegExp(RS_APOS, 'g')

/** 用于匹配复杂的单词或复合词 */
export const RE_UNICODE_WORD = RegExp([
  RS_UPPER + '?' + RS_LOWER + '+' + RS_OPT_CONTR_LOWER + '(?=' + [RS_BREAK, RS_UPPER, '$'].join('|') + ')',
  RS_MISC_UPPER + '+' + RS_OPT_CONTR_UPPER + '(?=' + [RS_BREAK, RS_UPPER + RS_MISC_LOWER, '$'].join('|') + ')',
  RS_UPPER + '?' + RS_MISC_LOWER + '+' + RS_OPT_CONTR_LOWER,
  RS_UPPER + '+' + RS_OPT_CONTR_UPPER,
  RS_ORD_UPPER,
  RS_ORD_LOWER,
  RS_DIGITS,
  RS_EMOJI
].join('|'), 'g')

/** 判断是否需要更健壮的正则表达式来匹配单词的字符串 */
export const RE_HAS_UNICODE_WORD = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/

/** 用于匹配由字母数字字符组成的单词 */
export const RE_ASCII_WORD = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g
