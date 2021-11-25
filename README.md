



# 枇杷表单设计器 ![img.png](public/loquat.png)

![img.png](public/image/sample2.jpg)

## 简介
<hr/>

![img.png](public/image/sample1.gif)

<hr/>
<h4>枇杷的名字是怎么来的？</h4>
首先 枇杷 是一种可以吃的水果,由于我出生之时我家前面就有一棵枇杷树,直到现在还存在,其次我小时候也老是爬树上摘枇杷吃,一结合名字就诞生了。
<hr/>
<h3>本项目是一款轻量级,采用拔插式组件架构的表单设计器，拖拽式操作让你快速构建一个表单。
</h3>

## 1. 安装依赖 Installation

```shell
npm install
// or yarn install
```

## 2. 运行 Quick Start

```shell
npm run serve
// or yarn run serve
```

## 3. 详细介绍
>内置丰富的插件,
可以很方便的扩展项目左侧组件,
枇杷表单设计器总体架构采用可拔插式架构设计思路,
并且所有存在可配置的地方全部提取到全局变量中,
可以通过修改一些配置很容易实现一些功能,
并且插件配置面板的功能全部可以通过参数管控,
即参数化动态管理面板功能,做到有参即用。

## 4. 参数化动态管理面板共用规则
>尽量避免出现v-if || v-else,
因为设置参数化动态管理面板功能就是为了
插件配置面板不要出现这种逻辑判断,考虑代码后期很难维护,看起来很烦人,
如果出现两个插件共用配置面板功能一致或者少于时可以通过参数配置共用,
出现共用配置面板功能多于时推荐新加一个配置面板组件,不推荐使用共用。

## 5. 目前吸收了那些开源或者收费的主流表单设计器的优点
> 1.由阿里巴巴语雀推出的表单设计器(收费):http://form.making.link/sample/#/zh-CN/ <br/>
> 2.由avue推出表单设计器(开源): https://form.avuejs.com/ <br/>
> 3.由JakHuang推出的ElementUI表单设计(开源): https://mrhj.gitee.io/form-generator/#/ <br/>
> 4.以及表单设计器整体架构布局借鉴的vxe-table,后期会全部采用typescript进行重构项目(开源): https://github.com/x-extends/vxe-table
