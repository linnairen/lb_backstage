<!-- <script src="routes.js"></script> -->
<template>
  <div id="app">
    <router-view></router-view>
    <normal-map></normal-map>
    <full-screen-photo></full-screen-photo>
  </div>
</template>

<script>
  import normalMap from '@c/map/map.vue'
  import fullScreenPhoto from '@c/fullScreenPhoto/fullScreenPhoto.vue'
  export default {
    name: 'app',
    components: {
      normalMap,
      fullScreenPhoto
    }
  }
</script>

<style>
  body {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    background: #666;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }

  #app {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
  }

  .el-form-item{
    margin-bottom: 12px;
  }

  .el-table{
    font-size: 12px;
  }
</style>
