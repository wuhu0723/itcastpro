<template>
  <div class="role">
    <!-- 路径导航--面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-button type="success" plain>添加角色</el-button>
    </div>
    <!-- 展开行效果的表格 -->
    <el-table :data="roleList" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="first in scope.row.children" :key="first.id" style='margin-top:15px;border-bottom:1px dashed #ccc'>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-tag closable :type="'success'">{{first.authName}}</el-tag>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple-light">
                  <el-row v-for="second in first.children" :key='second.id'  style='margin-bottom:15px'>
                      <el-col :span="6">
                          <div class="grid-content bg-purple">
                            <el-tag closable :type="'info'">{{second.authName}}</el-tag>
                          </div>
                      </el-col>
                      <el-col :span="18">
                          <div class="grid-content bg-purple">
                            <el-tag closable :type="'warning'" v-for="third in second.children" :key='third.id' style='margin-right:5px;margin-bottom:15px'>{{third.authName}}</el-tag>
                          </div>
                      </el-col>
                  </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row  v-if='scope.row.children.length === 0'>
              <el-col :span='24'>没有任何的权限，请先分配</el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top-end">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
// import { getAllRightList } from '@/api/right_index.js'
import { getAllRoleList } from '@/api/role_index.js'
export default {
  data () {
    return {
      // 角色数据
      roleList: []
    }
  },
  mounted () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      let result = await getAllRoleList()
      this.roleList = result.data
      console.log(this.roleList)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
