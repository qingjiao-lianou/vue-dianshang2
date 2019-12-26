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
              <el-tag
                closable
                type="success"
                @close="sign=0,delRight(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="two in first.children" :key="two.id" style="margin-bottom:10px">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="info"
                    @close="sign=0,delRight(scope.row,two.id)"
                  >{{two.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="last in two.children"
                    :key="last.id"
                    style="margin-right:5px;margin-bottom:5px"
                    @close="sign=0,delRight(scope.row,last.id)"
                  >{{last.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="24"
              v-show="scope.row.children.length === 0"
            >------------------ 空空如也 -------------------</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top-start">
            <el-button
              type="success"
              icon="el-icon-wind-power"
              circle
              @click="treeRight(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 树形控件对话框 -->
    <el-dialog :visible.sync="rightDialogVisible" width="50%" title="权限分配">
      <el-tree
        :data="rightList"
        ref="tree"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="chkedArr"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleAuthID">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRoleRight, roleAuth } from "@/api/roles_index.js";
import { getRightList } from "@/api/right_index.js";
export default {
  data() {
    return {
      roleId: "",
      sign: 0,
      rightDialogVisible: false,
      rolesList: [],
      rightList: [],
      // 选中的id（默认权限）
      chkedArr: [],
      defaultProps: {
        label: "authName",
        children: "children"
      }
    };
  },
  methods: {
    refresh() {
      //   获取角色列表
      getRoleList().then(res => {
        console.log(res);
        this.rolesList = res.data.data;
      });
    },
    //   删除权限
    async delRight(row, rightId) {
      const res = await delRoleRight(row.id, rightId);
      console.log(res);
      row.children = res.data.data;
      if (this.sign === 0) {
        this.$message.success(res.data.meta.msg);
        this.sign++;
      }

      row.children.forEach(v1 => {
        if (v1.children.length === 0) {
          this.delRight(row, v1.id);
        } else {
          v1.children.forEach(v2 => {
            if (v2.children.length === 0) {
              this.delRight(row, v2.id);
            }
          });
        }
      });
    },

    // 树形权限组件
    treeRight(row) {
      this.roleId = row.id;
      this.rightDialogVisible = true;
      // 获取权限列表
      getRightList("tree").then(res => {
        console.log(res);
        this.rightList = res.data.data;
      });
      this.chkedArr.length = 0;
      row.children.forEach(first => {
        if (first.children.length > 0) {
          first.children.forEach(two => {
            if (two.children.length > 0) {
              two.children.forEach(three => {
                this.chkedArr.push(three.id);
              });
            }
          });
        }
      });
    },
    // 授权
    async roleAuthID() {
      let arr = this.$refs.tree.getCheckedNodes();
      console.log(arr);

      let temp = [];
      //  遍历数组，进行数据的拼接
      for (let i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + "," + arr[i].pid);
      }
      // 拼接数组元素再转换为数组
      temp = temp.join(",").split(",");
      // 数组去重set，返回值是一个对象
      temp = [...new Set(temp)];

      const res = await roleAuth(this.roleId, temp.join(","));
      // console.log(res);
      this.$message.success("授权成功");
      this.rightDialogVisible = false;
      this.refresh()
    }
  },
  mounted() {
    this.refresh()
  }
};
</script>

<style lang="less" scoped>
</style>