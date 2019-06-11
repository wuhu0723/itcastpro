<template>
  <div class="list">
    <!-- 路径导航--面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 嵌套路由的展示区域 -->
      <router-view></router-view>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      query: ''
    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>

</style>
