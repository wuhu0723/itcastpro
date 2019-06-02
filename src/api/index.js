import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 实现登陆验证
export const login = (obj, callback) => {
  // axios.post是一个promise对象
  //  .then返回的还是一个promise对象
  return axios.post('login', obj)
    .then((result) => {
      // then的回调函数中的返回值最终会返回到这个对象的then方法中
      return result.data
    })
}
