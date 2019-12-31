<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="activeName-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 表单(标签页) -->
    <el-card class="box-card" style="margin-top:10px">
      <el-form label-width="80px">
        <el-tabs
          v-model="activeName"
          tab-position="left"
          :before-leave="beforeLeave"
          @tab-click="handleClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                :options="goodsCate"
                change-on-select
                :props="cateProps"
                v-model="goodsForm.goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-checkbox-group
              v-model="item.attr_vals"
              v-for="item in goodsParams"
              :key="item.attr_id"
            >
              <el-checkbox
                :label="item2"
                v-for="(item2,index) in item.attr_vals"
                :key="index"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headerToken()"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :before-upload="handleBefore"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quillEditor v-model="goodsForm.goods_introduce"></quillEditor>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-button type="success" @click="addGoods">添加商品</el-button>
    </el-card>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { getGoodsCate } from "@/api/cate_index.js";
import { getGoodsParams } from "@/api/params_index.js";
import { addGoods } from "@/api/goods_index.js";
export default {
  data() {
    return {
      checkList: [],
      goodsParams: [],
      fileList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      activeName: "0",
      goodsForm: {
        attrs: [],
        pics: [],
        goods_introduce: "",
        goods_weight: 0,
        goods_number: 0,
        goods_price: 0,
        goods_cat: "",
        goods_name: ""
      },
      goodsCate: []
    };
  },
  methods: {
    // 上傳文件之前觸發的函數
    handleBefore(file) {
      console.log(file);
      if (file.type.indexOf("image/") !== 0) {
        this.$message.warning("请選擇正確格式");
        return false; //此時會觸發 handleRemove
      }
    },
    // 上传文件成功时触发的函数
    handleSuccess(res) {
      // console.log(res);
      this.goodsForm.pics.push({
        pic: res.data.tmp_path
      });
    },
    // 移出文件触发的函数
    handleRemove(file, fileList) {
      // console.log(file);
      // console.log(fileList);
      if (!file.response) {
        return;
      }
      for (let i = 0; i < this.goodsForm.pics.length; i++) {
        if (this.goodsForm.pics[i].pic === file.response.data.tmp_path) {
          this.goodsForm.pics.splice(i, 1);
        }
      }
    },
    // 设置请求头
    headerToken() {
      var myToken = localStorage.getItem("token");
      return {
        Authorization: myToken
      };
    },
    // 添加商品
    async addGoods() {
      for (let i = 0; i < this.goodsParams.length; i++) {
        let attr_id = this.goodsParams[i].attr_id;
        for (let j = 0; j < this.goodsParams[i].attr_vals.length; j++) {
          this.goodsForm.attrs.push({
            attr_id,
            attr_value: this.goodsParams[i].attr_vals[j]
          });
        }
      }
      this.goodsForm.goods_cat = this.goodsForm.goods_cat.join(",");
      console.log(this.goodsForm);
      const res = await addGoods(this.goodsForm);
      console.log(res);
      this.$message.warning("添加成功");
      this.$router.push({ name: "list" });
    },
    // 切换标签页之前的钩子
    beforeLeave(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName);
      if (activeName === "1" || activeName === "2") {
        if (this.goodsForm.goods_cat.length !== 3) {
          this.$message.warning("请选择商品分类");
          this.activeName = "0";
          return false;
        }
      }
    },
    async handleClick() {
      if (this.activeName == "1") {
        let res = await getGoodsParams(this.goodsForm.goods_cat[2], "many");
        console.log(res);
        this.goodsParams = res.data.data;
        for (let i = 0; i < this.goodsParams.length; i++) {
          this.goodsParams[i].attr_vals = this.goodsParams[i].attr_vals.split(
            ","
          );
        }
      } else if (this.activeName == "2") {
      }
    }
  },
  mounted() {
    getGoodsCate(3).then(res => {
      // console.log(res);
      this.goodsCate = res.data.data;
    });
  },
  components: {
    quillEditor
  }
};
</script>
<style lang="less" scoped>
</style>