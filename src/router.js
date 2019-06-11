import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
import User from '@/views/users/User.vue'
import Rights from '@/views/right/rights.vue'
import Roles from '@/views/right/roles.vue'
import Goods from '@/views/goods/goods.vue'
import List from '@/views/goods/list.vue'
import Add from '@/views/goods/add.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      //   添加重定向
      redirect: { name: 'Login' }
    },
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/home',
      component: Home,
      redirect: { name: 'Welcome' },
      children: [
        {
          name: 'Welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'User',
          path: 'users',
          component: User
        },
        // 权限列表
        {
          name: 'Rights',
          path: 'rights',
          component: Rights
        },
        // 角色列表
        {
          name: 'Roles',
          path: 'roles',
          component: Roles
        },
        // 商品列表
        {
          name: 'Goods',
          path: 'goods',
          component: Goods,
          // 添加重定向
          redirect: { name: 'List' },
          children: [
            {
              name: 'List',
              path: 'list',
              component: List
            },
            {
              name: 'Add',
              path: 'add',
              component: Add
            }
          ]
        }
      ]
    }
  ]
})
