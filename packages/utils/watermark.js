/**
 * @program: loquat-form-design
 *
 * @description: 统一通用大水印
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-08-04
 **/

import { randomId, dataURLtoFile } from '@utils'

/**
 * 全局大水印
 * @param {String} text    水印文本，默认'商用通用大水印'
 * @param {String} font    水印字体，默认'30px 黑体'
 * @param {Int} canvasWidth    单个水印容器宽度，默认500
 * @param {Int} canvasHeight    单个水印容器高度，默认200
 * @param {String} textAlign    水印文本对齐方式，默认'center'
 * @param {String} textStyle    水印文本样式，默认'rgba(100,100,100,0.15)'
 * @param {Int} degree    水印文本旋转角度，默认 -20
 **/
export class waterMark {
  constructor (opt = {}) {
    this.CONTAINERID = randomId()
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

/** 图片加水印 **/
export function detailImg (file, option = {}) {
  const configDefault = {
    width: 200,
    height: 200
  }
  return new Promise(function (resolve, reject) {
    const { text, fontFamily, color, fontSize, opacity, bottom, right, ratio } = option
    initParams()
    fileToBase64(file, initImg)
    // 参数初始化
    function initParams () {
      this.text = text || '商用通用大水印' // 文字
      this.fontFamily = fontFamily || 'microsoft yahei' // 字体
      this.color = color || '#999' // 颜色
      this.fontSize = fontSize || 16 // 大小
      this.opacity = opacity || 100 // 透明度
      this.bottom = bottom || 10 // 下边位置
      this.right = right || 10 // 右边位置
      this.ratio = ratio || 1 // 压缩比
    }
    // 加载图片
    function initImg (data) {
      const img = new Image()
      img.src = data
      img.onload = function () {
        const width = img.width
        const height = img.height
        creteCanvas(width, height)
        this.ctx.drawImage(img, 0, 0, width, height)
        setText(width, height)
        resolve(dataURLtoFile(document.getElementById('canvas').toDataURL(file.type, this.ratio), file.name))
      }
    }
    // 创建画板
    function creteCanvas (width, height) {
      this.canvas = document.getElementById('canvas')
      if (this.canvas === null) {
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'canvas'
        this.canvas.className = 'loquat-canvas'
        document.body.appendChild(this.canvas)
      }
      this.ctx = this.canvas.getContext('2d')
      this.canvas.width = width
      this.canvas.height = height
    }
    // 添加水印
    function setText (width, height) {
      const txt = this.text
      const param = calcParam(txt, width, height)
      this.ctx.font = param.fontSize + 'px ' + this.fontFamily
      this.ctx.fillStyle = this.color
      this.ctx.globalAlpha = this.opacity / 100
      this.ctx.fillText(txt, param.x, param.y)
    }
    // 计算比例
    function calcParam (txt, width, height) {
      let x, y

      // 字体的比例
      const calcFontSize = this.fontSize / configDefault.width
      const fontSize = calcFontSize * width

      if (this.bottom) {
        y = configDefault.height - this.bottom
      } else {
        y = this.top
      }

      if (this.right) {
        x = configDefault.width - this.right
      } else {
        x = this.left
      }
      this.ctx.font = this.fontSize + 'px ' + this.fontFamily
      var txtWidth = Number(this.ctx.measureText(txt).width)

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
