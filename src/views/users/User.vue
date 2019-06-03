<template>
  <div class="user">
    <!-- 路径导航--面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select searchBox">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain>成功按钮</el-button>
    </div>
    <!-- 数据展示区域 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
      <template slot-scope="scope">
        <el-switch
        v-model="scope.row.mg_state"
        active-color="#13ce66"
        inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click='edit(scope.row)'
          >编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          >删除</el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getUserList } from '@/api/index.js'
export default {
  data () {
    return {
      // 用户状态
      userstatu: true,
      // 用户搜索关键字
      query: '',
      //   当前页码
      pagenum: 1,
      // 每页显示的记录数
      pagesize: 10,
      // 表格数据源
      userList: []
    }
  },
  methods: {
    edit (v) {
      console.log(v)
    }
  },
  mounted () {
    getUserList({ query: this.query, pagenum: this.pagenum, pagesize: this.pagesize }).then((result) => {
      console.log(result)
      this.userList = result.data.users
    })
  }
}
</script>
<style lang="less" scoped>
.searchBox {
  width: 300px;
  margin-right: 10px;
}
</style>
