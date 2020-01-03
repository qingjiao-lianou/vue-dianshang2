<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索和添加按钮 -->
    <div style="margin-top:5px;margin-bottom:10px">
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        style="width:300px"
        v-model="goodsObj.query"
        @keypress.enter.native="GoodsList"
      >
        <el-button slot="append" icon="el-icon-search" @click="GoodsList"></el-button>
      </el-input>
      <el-button type="success" style="margin-left:10px" @click="$router.push({ name: 'add'})">添加商品</el-button>
    </div>
    <!-- 商品列表 -->
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="700"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="80"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="180">
        <template slot-scope="scope">{{scope.row.add_time | timeFilters}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
            <el-button type="success" icon="el-icon-s-check" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=" goodsObj.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="goodsObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { getGoodsList } from "@/api/goods_index.js";
import { timeFilters } from "../../utils/mymoment";
export default {
  data() {
    return {
      total: 0,
      goodsObj: {
        query: "",
        pagenum: 1,
        pagesize: 20
      },
      goodsList: []
    };
  },
  methods: {
    //   获取商品列表
    GoodsList() {
      getGoodsList(this.goodsObj).then(res => {
        console.log(res);
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    // 改变显示条数时触发
    handleSizeChange(val) {
      //   console.log(val);
      this.goodsObj.pagesize = val;
      this.goodsObj.pagenum = 1;
      this.GoodsList();
    },
    // 改变页面数时触发
    handleCurrentChange(val) {
      this.goodsObj.pagenum = val;
      this.GoodsList();
    }
  },

  mounted() {
    this.GoodsList();
  },

  // 事件过滤
  filters: {
    timeFilters
  }
};
</script>
<style lang="less" scoped>
</style>