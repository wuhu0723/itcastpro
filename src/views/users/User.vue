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
      <el-button type="success" plain>添加用户</el-button>
    </div>
    <!-- 数据展示区域 -->
    <el-table :data="userList" border style="width: 100%">
      <!-- 索引列 -->
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 数据展示列 -->
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 操作列--修改状态 -->
      <el-table-column label="状态">
        <!-- slot-scope：数据插槽，就是将来可以通过这个插槽获取到这一行所展示数据对象
        这个数据对象就可以在模板的任意位置使用-->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change='changeStatu($event,scope.row.id)'></el-switch>
        </template>
      </el-table-column>
      <!-- 操作列-编辑删除 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="warning" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, editUser, delUserById, updateUserStatuById } from '@/api/users_index.js'
export default {
  data () {
    return {
      // 编辑操作验证规则
      rules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      // 设置编辑对话框是否显示，默认隐藏
      editDialogFormVisible: false,
      // 设置表单元素对应的lable的宽度
      formLabelWidth: '120px',
      // 编辑操作所对应的双向绑定数据对象
      // editTemp: {},
      editForm: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
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
    // 修改用户状态
    changeStatu (type, id) {
      console.log(type, id)
      updateUserStatuById(id, type)
        .then((result) => {
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: result.meta.msg
            })
          }
        })
    },
    // 根据id删除用户
    del (id) {
      this.$confirm(`此操作将永久删除id号为${id}的用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 如果单击确定就会触发then中的回调
        .then(() => {
          // 确认之后再进行删除操作
          delUserById(id).then(result => {
            if (result.meta.status === 200) {
              // 给出提示
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // 刷新
              this.init()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        })
        // 单击取消会触发catch中的回调
        .catch(() => {})
    },
    // 实现编辑提交
    editSubmit () {
      // 实现数据的再次验证
      // validate:可以实现指定表单的数据验证
      // 这个方法验证完毕之后，会调用回调函数，这个回调有一个参数valid,它就是是否通过验证的标识
      // 如果通过验证，就返回true,否则返回 False
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // 实现编辑提交请求
          editUser(this.editForm).then(result => {
            // 将这一行数据的数据源对象重置，就可以更新这一行数据的展示
            // 这种有一个好处就是没有必要将当前页的数据重新加载，避免反复的向后台发送请求
            // this.editTemp = result.data
            // 这里最终我们为了解决用户修改数据后又单击取消的bug,还是将刷新封装为一个单独的函数
            this.init()
            // 隐藏编辑对话框
            this.editDialogFormVisible = false
          })
          // 实现数据刷新
        } else {
          this.$message({
            message: '用户输入不合法',
            type: 'warning'
          })
        }
      })
      // 数据可以通过this.editForm来获取，所以不用传递参数
    },
    // 显示编辑对话框,并且展示默认数据
    showEditDialog (data) {
      // 让对话框显示
      this.editDialogFormVisible = true
      // 为表单元素的双向数据绑定赋值
      this.editForm.id = data.id
      this.editForm.username = data.username
      this.editForm.email = data.email
      this.editForm.mobile = data.mobile
    },
    // 初始化数据加载方法
    init () {
      getUserList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(result => {
        console.log(result)
        this.userList = result.data.users
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.searchBox {
  width: 300px;
  margin-right: 10px;
}
</style>
