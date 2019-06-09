<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
          <img src="../assets/logo.png" alt="" class="logo">
        <el-menu
          :router="true"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+subitem.path" v-for='subitem in item.children' :key='subitem.id'>
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
            <span class="myicon myicon-menu toggle-btn"></span>
            <span class="system-title">电商后台管理系统</span>
            <div class="welcome">
                <span>你好：admin </span>
                <a href="javascript:;">退出</a>
            </div>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getLeftMenus } from '@/api/right_index.js'
export default {
  data () {
    return {
      menuList: []
    }
  },
  mounted () {
    getLeftMenus().then(result => {
      console.log(result)
      this.menuList = result.data.data
    })
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome{
    color: white;
  }
}
</style>
