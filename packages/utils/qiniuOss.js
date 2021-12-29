/**
 * @program: loquat-form-design
 *
 * @description: 签名加密七牛云OSS令牌
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-08-04
 */

export function getToken (accessKey, secretKey, putPolicy) {
  // SETP 1 : json格式化上传策略,https://developer.qiniu.com/kodo/1206/put-policy
  const _putPolicy = JSON.stringify(putPolicy)
  process.env.NODE_ENV === 'development' && console && console.log('put_policy = ', _putPolicy)

  // SETP 2 : 使用base64编码上传策略
  const encoded = base64encode(utf16to8(_putPolicy))
  process.env.NODE_ENV === 'development' && console && console.log('encoded = ', encoded)

  // SETP 3 : 使用加密JS-HmacSHA1签名认证加密
  const hash = window.CryptoJS.HmacSHA1(encoded, secretKey)
  const encodedSigned = hash.toString(window.CryptoJS.enc.Base64)
  process.env.NODE_ENV === 'development' && console && console.log('encoded_signed=', encodedSigned)

  // SETP 5 : 访问密钥拼接base64访问七牛云
  const uploadToken = accessKey + ':' + safe64(encodedSigned) + ':' + encoded
  process.env.NODE_ENV === 'development' && console && console.log('upload_token=', uploadToken)

  return uploadToken
}

export default getToken

/** UTF16转换UTF8 */
function utf16to8 (str) {
  let out, i, c
  out = ''
  const len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}

/** UTF8转换UTF16 */
// eslint-disable-next-line no-unused-vars
function utf8to16 (str) {
  let out, i, c
  let char2, char3
  out = ''
  const len = str.length
  i = 0
  while (i < len) {
    c = str.charCodeAt(i++)
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1)
        break
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = str.charCodeAt(i++)
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
        break
      case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
        char2 = str.charCodeAt(i++)
        char3 = str.charCodeAt(i++)
        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0))
        break
    }
  }
  return out
}

/*
 * Interfaces:
 * b64 = base64encode(data);
 * data = base64decode(b64);
 */
const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
const base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1]

/** base64编码 */
function base64encode (str) {
  let out, i
  let c1, c2, c3
  const len = str.length
  i = 0
  out = ''
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt((c1 & 0x3) << 4)
      out += '=='
      break
    }
    c2 = str.charCodeAt(i++)
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
      out += base64EncodeChars.charAt((c2 & 0xF) << 2)
      out += '='
      break
    }
    c3 = str.charCodeAt(i++)
    out += base64EncodeChars.charAt(c1 >> 2)
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
    out += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return out
}

/** base64解码 */
// eslint-disable-next-line no-unused-vars
function base64decode (str) {
  let c1, c2, c3, c4
  let i, out
  const len = str.length
  i = 0
  out = ''
  while (i < len) {
    /* c1 */
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c1 == -1)
    if (c1 == -1) break
    /* c2 */
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c2 == -1)
    if (c2 == -1) break
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))
    /* c3 */
    do {
      c3 = str.charCodeAt(i++) & 0xff
      if (c3 == 61) return out
      c3 = base64DecodeChars[c3]
    } while (i < len && c3 == -1)
    if (c3 == -1) break
    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))
    /* c4 */
    do {
      c4 = str.charCodeAt(i++) & 0xff
      if (c4 == 61) return out
      c4 = base64DecodeChars[c4]
    } while (i < len && c4 == -1)
    if (c4 == -1) break
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
  }
  return out
}

/** 去除base64不安全的字符 */
const safe64 = function (base64) {
  base64 = base64.replace(/\+/g, '-')
  base64 = base64.replace(/\//g, '_')
  return base64
}
