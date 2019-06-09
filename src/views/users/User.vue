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
      <el-input placeholder="请输入内容" @keyup.enter.native='serachUser' v-model="query" class="input-with-select searchBox" clearable>
        <el-button slot="append" icon="el-icon-search" @click='serachUser'></el-button>
      </el-input>
      <el-button type="success" plain @click='addDialogFormVisible = true'>添加用户</el-button>
    </div>
    <!-- 数据展示区域 -->
    <el-table :data="userList" border style="width: 100%;margin-top:10px">
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
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatu($event,scope.row.id)"
          ></el-switch>
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
            <el-button type="success" icon="el-icon-share" @click="showGrantRoleDialog(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm"  :label-width="'120px'">
        <el-form-item label="用户名" prop='username'>
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password'>
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
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
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible">
      <el-form :model="roleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="roleForm.username" auto-complete="off" style='width:122px' disabled=""></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- <option value="对应id">显示的内容</option> -->
          <el-select ref='roleS' v-model="roleForm.rid" placeholder="请选择" @change='selectRole'>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserList,
  editUser,
  delUserById,
  updateUserStatuById
} from '@/api/users_index.js'
import { getAllRoleList, grantRole, addUser } from '@/api/role_index.js'
export default {
  data () {
    return {
      // 分页所对应的数据
      total: 0,
      // 添加用户对应数据
      addDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      roleList: [],
      // 分配角色对话框可见标记
      roleDialogFormVisible: false,
      roleForm: {
        // 接口中所需要的参数 用户id
        id: '',
        // 弹出层中需要展示的用户名，但是不是接口所需要的参数
        username: '',
        // 接口中所需要的参数 角色id,因为数据表中存储的是id
        rid: ''
      },
      // 编辑操作验证规则
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
        ]
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
      pagesize: 1,
      // 表格数据源
      userList: []
    }
  },
  methods: {
    // 当用户修改每页显示的数量进触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.init()
    },
    // 当修改当前页码：单击页码
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    },
    // 实现用户的搜索功能
    serachUser () {
      this.init()
    },
    // 新增用户提交
    addSubmit () {
      addUser(this.addForm).then(result => {
        console.log(result)
        if (result.meta.status === 201) {
          this.$message({
            type: 'success',
            'message': result.meta.msg
          })
          this.init()
          this.addDialogFormVisible = false
          this.$refs['addForm'].resetFields()
        }
      })
    },
    // 授权角色提交
    grantRoleSubmit () {
      grantRole(this.roleForm.id, this.roleForm.rid)
        .then(result => {
          console.log(result)
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              'message': result.meta.msg
            })
            // 这里为什么需要刷新，因为你成功的修改的角色，页面中的数据列表并没有重新加载，会造成数据列表的中每一行数据所对应的scope.row没有变化，进而造成获取数据的时候数据源没有变化，所以进行刷新
            this.init()
            this.roleDialogFormVisible = false
          }
        })
    },
    // 显示分配角色对话框
    showGrantRoleDialog (row) {
      this.roleDialogFormVisible = true
      this.roleForm.id = row.id
      // 让下拉列表有默认选项
      // 我修改了后台接口代码，并且已经发给你们了
      // 设置v-model所绑定的数据，就会造成下拉列表选项的变化
      this.roleForm.username = row.username
      this.roleForm.rid = row.rid
    },
    // 选择用户角色
    selectRole (obj) {
      console.log(obj)
    },
    // 修改用户状态
    changeStatu (type, id) {
      console.log(type, id)
      updateUserStatuById(id, type).then(result => {
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
            console.log('------------------------')
            console.log(result)
            console.log('---------------------')
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
      // this.editForm = data
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
        this.total = result.data.total
      })
    }
  },
  mounted () {
    // 用户列表数据
    this.init()
    // 角色列表数据
    getAllRoleList()
      .then((result) => {
        console.log(result)
        this.roleList = result.data
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
