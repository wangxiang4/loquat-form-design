<template>
  <div>
    <loquat-upload v-model="list" action="http://localhost:8888/common/upload"/>
    <el-upload action="http://localhost:8888/common/upload"
               :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'LoquatUploadDemo',
  data () {
    return {
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      list: [{
        name: 'avue.jpeg',
        url: 'https://avuejs.com/images/logo-bg.jpg'
      }]
    }
  }
}
</script>

<style scoped>

</style>
