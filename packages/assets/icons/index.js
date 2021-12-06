/**
 * @program: loquat-form-design
 *
 * @description: 导出所有svg图片
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-10-4
 **/

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
