import myaxios from './baseaxios.js'

// 获取所有权限列表数据
/**
 *
 * @param {params} 是一个对象，里面有三个属性：query(查询字符串) pageNum pageSize
 */
export const getAllGoodsList = (params) => {
  return myaxios({
    method: 'get',
    url: `goods`,
    // url参数对应着的传递方法为params
    params
  })
}

// 获取所有分类数据
export const getAllCategoriesList = (type) => {
  return myaxios({
    method: 'get',
    url: `categories`,
    // url参数对应着的传递方法为params
    params: { type: [type] }
  })
}

// 添加商品信息
export const addGoodInfo = (data) => {
  return myaxios({
    method: 'post',
    url: `goods`,
    data
  })
}
