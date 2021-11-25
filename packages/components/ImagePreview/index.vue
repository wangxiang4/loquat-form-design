<template>
  <div v-if="isShow" class="image-preview">
    <div v-if="ops.modal"
         class="image-preview__mask"
         @click="close"
    />
    <span class="el-image-viewer__btn el-image-viewer__close" @click="close">
      <i class="el-icon-circle-close"/>
    </span>
    <span v-if="isArrow"
          class="el-image-viewer__btn el-image-viewer__prev"
          @click="handlePrev()"
    >
      <i class="el-icon-arrow-left"/>
    </span>
    <span v-if="isArrow"
          class="el-image-viewer__btn el-image-viewer__next"
          @click="handleNext()"
    >
      <i class="el-icon-arrow-right"/>
    </span>
    <div ref="box" class="image-preview__box">
      <el-carousel ref="carousel"
                   :show-indicators="false"
                   :initial-index="index"
                   :initial-swipe="index"
                   :interval="0"
                   arrow="never"
                   indicator-position="none"
                   @change="handleChange"
      >
        <el-carousel-item v-for="(item,indexs) in datas"
                          :key="indexs"
                          @click.native.self="ops.closeOnClickModal?close():''"
        >
          <slot/>
          <img v-if="typeList.img.test(item.url) || typeList.video.test(item.url)"
               ref="item"
               :src="item.url"
               :style="[styleName,styleBoxName]"
               controls="controls"
               v-bind="getIsVideo(item)"
               ondragstart="return false"
               @mousedown="move"
          >
          <div v-else class="image-preview__file">
            <a :href="item.url" target="_blank">
              <i class="el-icon-document"/>
              <p>{{ item.name }}</p>
            </a>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="el-image-viewer__btn el-image-viewer__actions">
      <div class="el-image-viewer__actions__inner">
        <i class="el-icon-zoom-out" @click="subScale"/>
        <i class="el-icon-zoom-in" @click="addScale"/>
        <i class="el-icon-refresh-left" @click="rotate=rotate-90"/>
        <i class="el-icon-refresh-right" @click="rotate=rotate+90"/>
      </div>
    </div>
  </div>
</template>
<script>
import { TYPE_LIST } from '@/global/variable'
import { setPx } from '@utils'
export default {
  name: 'ImagePreview',
  data () {
    return {
      typeList: TYPE_LIST,
      left: 0,
      top: 0,
      scale: 1,
      datas: [],
      rotate: 0,
      loading: false,
      isShow: false,
      index: 0,
      onClose: null
    }
  },
  computed: {
    styleBoxName () {
      return {
        marginLeft: setPx(this.left),
        marginTop: setPx(this.top)
      }
    },
    styleName () {
      return {
        transform: `scale(${this.scale}) rotate(${this.rotate}deg)`,
        maxWidth: '100%',
        maxHeight: '100%'
      }
    },
    // 是否显示切换箭头
    isArrow () {
      return this.imgLen != 1
    },
    imgLen () {
      return this.imgList.length
    },
    imgList () {
      return this.datas.map(ele => ele.url)
    }
  },
  mounted () {
    document.addEventListener('keydown', this.keydown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.keydown)
  },
  methods: {
    handlePrev () {
      this.$refs.carousel.prev()
      this.index = this.$refs.carousel.activeIndex
      this.stopItem()
    },
    handleNext () {
      this.$refs.carousel.next()
      this.index = this.$refs.carousel.activeIndex
      this.stopItem()
    },
    stopItem () {
      this.left = 0
      this.top = 0
      this.$refs.item.forEach(ele => {
        ele.pause && ele.pause()
      })
    },
    getIsVideo (item) {
      if (this.typeList.video.test(item.url) || item.type == 'video') {
        return { is: 'video' }
      }
      return {}
    },
    subScale () {
      if (this.scale != 0.2) {
        this.scale = parseFloat((this.scale - 0.2).toFixed(2))
      }
    },
    addScale () {
      this.scale = parseFloat((this.scale + 0.2).toFixed(2))
    },
    handleChange () {
      this.scale = 1
      this.rotate = 0
    },
    move (e) { // 获取目标元素e
      // 算出鼠标相对元素的位置
      let disX = e.clientX
      let disY = e.clientY
      // 移动像素步长,默认2
      const scale = 2
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const left = e.clientX - disX
        const top = e.clientY - disY
        disX = e.clientX
        disY = e.clientY
        // 移动当前元素
        this.left = this.left + (left * scale)
        this.top = this.top + (top * scale)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    close () {
      this.isShow = false
      if (typeof this.onClose === 'function') {
        this.onClose(this)
      }
    },
    keydown (e) {
      if (e.keyCode === 27) { // esc关闭消息
        if (this.isShow) this.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .image-preview{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height: 100%;
    transition: all 0.5s;
    z-index: 9998;

    .el-image-viewer__close{
      i{
        color:#fff;
      }
    }

    .el-image-viewer__btn{
      z-index: 1024;
    }

    img{
      transition: all 0.5s;
      cursor: pointer;
    }

    &__file{
      text-align: center;
      a{
        color:#fff;
      }
      i{
        font-size: 80px;
      }
    }

    &__mask{
      position: absolute;
      top:0;
      left:0;
      width:100%;
      height: 100%;
      background: rgba(0,0,0,.5);
    }

    &__box{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      ::v-deep .el-carousel{
        width: 90%;
        height: 100%;
      }

      ::v-deep .el-carousel__container{
        height: 100%;
      }

      ::v-deep .el-carousel__item{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

</style>
