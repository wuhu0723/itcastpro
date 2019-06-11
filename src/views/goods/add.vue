<template>
  <div class="add">
    <el-steps :active="activeName-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <el-form label-width="80px">
      <el-tabs
        v-model="activeName"
        tab-position="left"
        style="margin-top:30px"
        @tab-click="handleClick"
      >
        <el-tab-pane label="用户管理" name="0">
          <el-form-item label="商品名称">
            <el-input v-model="goodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateList"
              :props="cateProps"
              change-on-select="true"
              @change="cateChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="文件上传" name="1">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :file-list="fileList"
            list-type="picture"
            :headers="setToken()"
            :on-success="uploadSucess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品描述" name="2">
          <quill-editor v-model="goodsForm.goods_introduce" ref="myQuillEditor" :options="editorOption" style="height:400px"></quill-editor>
        </el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="3">定时任务补偿</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="4">定时任务补偿</el-tab-pane>
      </el-tabs>

      <el-button type="success" @click='addGoods'>添加商品</el-button>
    </el-form>
  </div>
</template>
<script>
import { getAllCategoriesList, addGoodInfo } from '@/api/goods_index.js'
export default {
  data () {
    return {
      fileList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      cateList: [],
      activeName: '0',
      goodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      //   富文本框的图标
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block']
          ]
        }
      }
    }
  },
  mounted () {
    getAllCategoriesList(3).then(res => {
      console.log(res)
      this.cateList = res.data.data
    })
  },
  methods: {
    //   添加商品
    async addGoods () {
      let result = await addGoodInfo(this.goodsForm)
      if (result.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        setTimeout(() => {
          this.$router.push({ name: 'Goods' })
        }, 1000)
      }
    },
    //  设置文件上传时的token设置
    setToken () {
      return { Authorization: localStorage.getItem('itcastpro_token') }
    },
    //   文件上传成功之后的钩子
    uploadSucess (response, file, fileList) {
      console.log(response)
      //   上传文件成功之后，需要将返回的临时 文件的全路径添加到pics属性中
      this.goodsForm.pics.push({ pic: response.data.tmp_path })
    },
    //   进行分类的选项切换
    cateChange (value) {
      console.log(value.join(','))
      this.goodsForm.goods_cat = value.join(',')
    },
    handleClick (obj) {
      //   console.log(this.activeName)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
