<template>
  <div class="rolesList">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button type="success">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolesList" border style="width: 100%;margin-top:15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:15px;border-bottom: 1px dashed #000;"
          >
            <el-col :span="4">
              <el-tag closable type="success">{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="two in first.children" :key="two.id" style="margin-bottom:10px">
                <el-col :span="4">
                  <el-tag closable type="info">{{two.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="last in two.children"
                    :key="last.id"
                    style="margin-right:5px;margin-bottom:5px"
                    @close="delRight(scope.row,last.id)"
                  >{{last.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length === 0">
                ------------------  空空如也  -------------------
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top-start">
            <el-button type="success" icon="el-icon-wind-power" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRoleList, delRoleRight } from "@/api/roles_index.js";
export default {
  data() {
    return {
      rolesList: []
    };
  },
  methods: {
    async delRight(row, rightId) {
      const res = await delRoleRight(row.id, rightId);
      console.log(res);
      row.children = res.data.data;
      this.$message.success(res.data.meta.msg);
    }
  },
  mounted() {
    //   获取角色列表
    getRoleList().then(res => {
      console.log(res);
      this.rolesList = res.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
</style>