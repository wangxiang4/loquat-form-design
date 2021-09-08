/**
 * @program: loquat-form-design
 *
 * @description: 签名加密阿里云OSS令牌
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-09-06
 **/

export const getClient = (params) => {
  // oss 基本配置
  const client = new window.OSS(params)
  return client
}
