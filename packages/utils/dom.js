/**
 * @program: loquat-form-design
 *
 * @description: dom操作元素工具类
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-19
 */

/** 转换css字符串解析成对应的class样式规则  */
export function parseCss (val) {
  if (!val) return []
  return val.split(/}\s+./).filter(v => v).map(item => {
    (item = item.trim())[0] !== '.' && (item = '.' + item)
    item[item.length - 1] !== '}' && (item += '}')
    return item
  })
}

/** 新增样式:借助ace编辑器的autocompletion.css */
export function insertCss (css, formId) {
  // 获取一个嵌入样式,注意需要设置head[0]为嵌入样式
  const styleSheets = document.styleSheets[0]
  // 删除已经添加上的样式
  for (let i = 0; i < styleSheets.cssRules.length;) {
    (styleSheets.cssRules[i].selectorText && styleSheets.cssRules[i].selectorText.indexOf(formId) === 0)
      ? styleSheets.deleteRule(i)
      : i++
  }
  // 添加样式
  for (let i = 0; i < css.length; i++) styleSheets.insertRule(`.${formId} ${css[i]}`, 0)
}

/** 获取自定义css样式所有类名 */
export function classCss (css) {
  return css.map(item => {
    const space = item.indexOf(' ')
    const leftBrackets = item.indexOf('{')
    let i = leftBrackets
    space > 0 && space < leftBrackets && (i = space)
    return item.substring(1, i)
  })
}
