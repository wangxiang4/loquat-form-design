/**
 * @program: loquat-form-design
 *
 * @description: 统一通用大水印
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-08-04
 */

import { randomId8, dataURLtoFile } from '@utils'

/**
 * 全局大水印
 * @param {String} text    水印文本，默认'商用通用大水印'
 * @param {String} font    水印字体，默认'30px 黑体'
 * @param {Int} canvasWidth    单个水印容器宽度，默认500
 * @param {Int} canvasHeight    单个水印容器高度，默认200
 * @param {String} textAlign    水印文本对齐方式，默认'center'
 * @param {String} textStyle    水印文本样式，默认'rgba(100,100,100,0.15)'
 * @param {Int} degree    水印文本旋转角度，默认 -20
 */
export class waterMark {
  constructor (opt = {}) {
    this.CONTAINERID = randomId8()
    this.drawCanvas = this.drawCanvas.bind(this)
    this.parentObserver = this.parentObserver.bind(this)
    this.Repaint = this.Repaint.bind(this)
    this.isOberserve = false
    this.init(opt)
    this.drawCanvas()
    this.parentObserver()
  }

  init (opt) {
    this.option = {}
    this.option.text = opt.text || '商用统一通用大水印'
    this.option.font = opt.font || '30px 黑体'
    this.option.canvasWidth = opt.canvasWidth || 500
    this.option.canvasHeight = opt.canvasHeight || 200
    this.option.textAlign = opt.textAlign || 'center'
    this.option.textStyle = opt.textStyle || 'rgba(100,100,100,0.15)'
    this.option.degree = opt.degree || -20
  }

  drawCanvas () {
    this.isOberserve = true
    const divContainer = document.createElement('div')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    divContainer.id = this.CONTAINERID

    canvas.width = this.option.canvasWidth
    canvas.height = this.option.canvasHeight
    context.font = this.option.font
    context.textAlign = this.option.textAlign
    context.fillStyle = this.option.textStyle
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(this.option.degree * Math.PI / 180)
    context.fillText(this.option.text, 0, 0)

    const backgroundUrl = canvas.toDataURL('image/png')
    this.styleStr = `
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            z-index:9999;
            pointer-events:none;
            background-repeat:repeat;
            background-image:url('${backgroundUrl}')`
    divContainer.setAttribute('style', this.styleStr)
    document.body.appendChild(divContainer)
    this.wmObserver(divContainer)
    this.isOberserve = false
  }

  wmObserver (divContainer) {
    const wmConf = { attributes: true, childList: true, characterData: true }
    const wmObserver = new MutationObserver((mo) => {
      if (!this.isOberserve) {
        const _obj = mo[0].target
        _obj.setAttribute('style', this.styleStr)
        _obj.setAttribute('id', this.CONTAINERID)
        wmObserver.takeRecords()
      }
    })
    wmObserver.observe(divContainer, wmConf)
  }

  parentObserver () {
    const bodyObserver = new MutationObserver(() => {
      if (!this.isOberserve) {
        const __wm = document.querySelector(`#${this.CONTAINERID}`)
        if (!__wm) {
          this.drawCanvas()
        } else if (__wm.getAttribute('style') !== this.styleStr) {
          __wm.setAttribute('style', this.styleStr)
        }
      }
    })
    bodyObserver.observe(document.querySelector(`#${this.CONTAINERID}`).parentNode, { childList: true })
  }

  Repaint (opt = {}) {
    this.remove()
    this.init(opt)
    this.drawCanvas()
  }

  remove () {
    this.isOberserve = true
    const _wm = document.querySelector(`#${this.CONTAINERID}`)
    _wm.parentNode.removeChild(_wm)
  }
}

/** 图片加水印 */
export function detailImg (file, option = {}) {
  const configDefault = {
    width: 200,
    height: 200
  }
  const config = {
    text: '商用通用大水印', // 文字
    fontFamily: 'microsoft yahei', // 字体
    color: '#999', // 颜色
    fontSize: 16, // 大小
    opacity: 100, // 透明度
    bottom: 10, // 下边位置
    right: 10, // 右边位置
    ratio: 1, // 压缩比
    left: 0, // 左边位置
    top: 0 // 上边位置
  }
  let canvas, ctx
  return new Promise(function (resolve, reject) {
    const { text, fontFamily, color, fontSize, opacity, bottom, right, ratio } = option
    initParams()
    fileToBase64(file, initImg)
    // 参数初始化
    function initParams () {
      config.text = text || config.text // 文字
      config.fontFamily = fontFamily || config.fontFamily // 字体
      config.color = color || config.color // 颜色
      config.fontSize = fontSize || config.fontSize // 大小
      config.opacity = opacity || config.opacity // 透明度
      config.bottom = bottom || config.bottom // 下边位置
      config.right = right || config.right // 右边位置
      config.ratio = ratio || config.ratio // 压缩比
    }
    // 加载图片
    function initImg (data) {
      const img = new Image()
      img.src = data
      img.onload = function () {
        const width = img.width
        const height = img.height
        creteCanvas(width, height)
        ctx.drawImage(img, 0, 0, width, height)
        setText(width, height)
        const files = dataURLtoFile(document.getElementById('canvas').toDataURL(file.type, config.ratio), file.name)
        document.getElementById('canvas').remove()
        resolve(Object.assign(files, file))
      }
    }
    // 创建画板
    function creteCanvas (width, height) {
      canvas = document.getElementById('canvas')
      if (canvas === null) {
        canvas = document.createElement('canvas')
        canvas.id = 'canvas'
        canvas.className = 'loquat-canvas'
        document.body.appendChild(canvas)
      }
      ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
    }
    // 添加水印
    function setText (width, height) {
      const txt = config.text
      const param = calcParam(txt, width, height)
      ctx.font = param.fontSize + 'px ' + config.fontFamily
      ctx.fillStyle = config.color
      ctx.globalAlpha = config.opacity / 100
      ctx.fillText(txt, param.x, param.y)
    }
    // 计算比例
    function calcParam (txt, width, height) {
      let x, y

      // 字体的比例
      const calcFontSize = config.fontSize / configDefault.width
      const fontSize = calcFontSize * width

      if (config.bottom) {
        y = configDefault.height - config.bottom
      } else {
        y = config.top
      }

      if (config.right) {
        x = configDefault.width - config.right
      } else {
        x = config.left
      }
      ctx.font = config.fontSize + 'px ' + config.fontFamily
      var txtWidth = Number(ctx.measureText(txt).width)

      x = x - txtWidth

      var calcPosX = x / configDefault.width
      var calcPosY = y / configDefault.height

      x = calcPosX * width
      y = calcPosY * height
      return {
        x: x,
        y: y,
        fontSize: fontSize
      }
    }
    // file转base64
    function fileToBase64 (file, callback) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        callback(e.target.result)
      }
    }
  })
}
