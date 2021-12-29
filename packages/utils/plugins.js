/**
 * @program: loquat-form-design
 *
 * @description: 插件工具类
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-08-04
 */

/** 绑定组件弹出事件 */
export function bindEvent (safe, name, event) {
  typeof safe[name] === 'function' && safe[name]({ value: safe.value, column: safe.column })
  safe.$emit(name, safe.value, event)
}

