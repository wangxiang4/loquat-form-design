<template>
  <div>
    <loquat-upload v-model="list"
                   action="http://localhost:8888/common/upload"
                   list-type="picture-img"
    />
  </div>
</template>

<script>
export default {
  name: 'LoquatUploadDemo',
  data () {
    return {
      list: [{
        name: 'movie.ogg',
        url: 'https://www.w3school.com.cn/i/movie.ogg'
      }]
    }
  }
}
</script>

<style scoped>

</style>
