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
      <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    </div>
    <!-- 展开行效果的表格 -->
    <el-table :data="roleList" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-top:15px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-tag closable :type="'success'">{{first.authName}}</el-tag>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple-light">
                <el-row
                  v-for="second in first.children"
                  :key="second.id"
                  style="margin-bottom:15px"
                >
                  <el-col :span="6">
                    <div class="grid-content bg-purple">
                      <el-tag closable :type="'info'">{{second.authName}}</el-tag>
                    </div>
                  </el-col>
                  <el-col :span="18">
                    <div class="grid-content bg-purple">
                      <el-tag
                        closable
                        :type="'warning'"
                        v-for="third in second.children"
                        :key="third.id"
                        style="margin-right:5px;margin-bottom:15px"
                        @close="removeSingleRight(scope.row,third.id)"
                      >{{third.authName}}</el-tag>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">没有任何的权限，请先分配</el-col>
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
            <el-button type="success" icon="el-icon-share" @click='showGrantDialog(scope.row)'></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" ref="addForm" :label-width="'120px'">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 角色授权对话框 -->
    <el-dialog title="角色授权" :visible.sync="grantDialogFormVisible">
      <div class="rightListBox">
      <el-tree
          ref='rightTree'
          :data="rightList"
          show-checkbox
          node-key="id"
          :default-expand-all='true'
          :default-checked-keys="selectedKeys"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='grantRoleSubmit'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/right_index.js'
import {
  getAllRoleList,
  removeRightByUserId,
  addRole,
  grantRoleSubmit
} from '@/api/role_index.js'
export default {
  data () {
    return {
      roleId: '',
      // 当前树形控件中默认被选择节点数组，这个数组中的每一个值都是对应的权限id
      selectedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rightList: [],
      // 授权对话框显示隐藏标记
      grantDialogFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogFormVisible: false,
      // 角色数据
      roleList: []
    }
  },
  mounted () {
    this.getRoleList()
  },
  methods: {
    // 实现角色授权提交
    async grantRoleSubmit () {
      // console.log(this.$refs.rightTree.getCheckedKeys())
      // console.log(this.$refs.rightTree.getCheckedNodes())
      // 1.通过getCheckedNodes获取当前所有被选中的节点对象
      var allNodes = this.$refs.rightTree.getCheckedNodes()
      // 2.遍历，获取每一个对象中的id和pid
      // map可以将回调函数的操作结果存储到一个数组中并返回
      var arr = allNodes.map(value => {
        return value.id + ',' + value.pid
      })
      // 我们以选择两个权限为例，现在获取的结果是：["109,107,102", "154,107,102"]
      console.log(arr)
      // 3.将Arr拼接成字符串:   109,107,102,154,107,102
      var ids = arr.join(',')
      console.log(ids)
      // 4.数组去除重复--先将字符串转换为数组：[109,107,102,154,107,102]
      var temp = ids.split(',')
      console.log(temp)
      // 5.实现数组去重  Set(4){"109", "107", "102", "154"}
      // var obj = [...new Set(temp)]
      // ["109", "107", "102", "154"]
      var finalIds = Array.from(new Set(temp))
      console.log(finalIds)
      let result = await grantRoleSubmit(this.roleId, finalIds.join(','))
      console.log(result)
      if (result.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.grantDialogFormVisible = false
        this.getRoleList()
      }
    },
    // 打开授权角色对话框
    async showGrantDialog (row) {
      // 1.显示对话框
      this.grantDialogFormVisible = true
      // 2.获取并加载树形控件的数据
      var result = await getAllRightList('tree')
      console.log(result)
      this.rightList = result.data.data
      // 将当前角色id存储到data属性
      this.roleId = row.id

      // 我们还需要获取这个角色所对应的权限id
      // 我们要获取的其实是三级权限所对应的id,树有一个特点，如果子节点被选择，父节点默认就会被展开
      // 我们这里所要获取的权限id是这个角色所拥有的权限，而不能直接通过Result进行获取
      // row:就是当前这一行数据所对应的数据对象，这个数据对象中就包含着这个角色所拥有的权限数据
      console.log(row)
      // 在新的角色权限获取之前，将上一个角色的权限数据清除
      this.selectedKeys = []
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  this.selectedKeys.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    // 打开添加角色对话框
    showAddDialog () {
      this.addDialogFormVisible = true
    },
    // 实现添加角色
    async addRole () {
      let result = await addRole(this.addForm)
      if (result.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.addDialogFormVisible = false
        this.getRoleList()
      }
    },
    //   删除角色权限
    async removeSingleRight (row, rightid) {
      // 写？--所有操作代码基于接口文档
      let result = await removeRightByUserId(row.id, rightid)
      // 刷新:只重置当前角色的对应权限数据---不会造成页面的整体刷新
      row.children = result.data.data
    },
    // 获取所有角色列表--角色的权限在这个返回数据中能够获取到
    async getRoleList () {
      let result = await getAllRoleList()
      this.roleList = result.data
    }
  }
}
</script>
<style lang="less" scoped>
.rightListBox{
  height: 400px;
  overflow: scroll;
}
</style>
