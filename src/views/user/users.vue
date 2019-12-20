<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索和添加按钮 -->
    <div style="margin-top:5px;margin-bottom:10px">
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        style="width:300px"
        v-model="usersObj.query"
        @keypress.enter.native="getusersData"
      >
        <el-button slot="append" icon="el-icon-search" @click="getusersData"></el-button>
      </el-input>
      <el-button type="success" style="margin-left:10px">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top-start">
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
      :current-page="usersObj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="usersObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { getUserList } from "@/api/user_index.js";

export default {
  data() {
    return {
      // 用户列表
      userList: [],
      //  获取用户数据参数
      usersObj: {
        query: "",
        pagenum: 1,
        pagesize: 4
      },
      //  分页总条数
      total: 0
    };
  },

  methods: {
    // 获取用户数据
    async getusersData() {
      const res = await getUserList(this.usersObj);
      // console.log(res);
      this.userList = res.data.data.users;
      this.total = res.data.data.total;
    },
    handleSizeChange(val) {
      this.usersObj.pagesize = val;
      this.usersObj.pagenum = 1
      this.getusersData();
    },
    handleCurrentChange(val) {
      this.usersObj.pagenum = val;
      this.getusersData();
    }
  },

  mounted() {
    this.getusersData();
  }
};
</script>

<style lang="less" scoped>
</style>