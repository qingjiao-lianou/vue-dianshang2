<template>
  <div class="rightList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightList" border style="width: 60%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope"> <span>{{scope.row.level | levelTier}}</span></template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRightList } from "@/api/right_index.js";
export default {
  data() {
    return {
      // 权限列表
      rightList: []
    };
  },
  //   过滤器
  filters: {
    levelTier(level) {
      if (level === "0") {
        return "一级";
      } else if (level === "1") {
        return "二级";
      } else {
        return "三级";
      }
    }
  },
  mounted() {
    getRightList("list").then(res => {
      console.log(res);
      this.rightList = res.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
</style>