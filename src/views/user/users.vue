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
      <el-button type="success" style="margin-left:10px" @click="addDialogFormVisible = true">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="userStatus(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
            <el-button
              type="success"
              icon="el-icon-s-check"
              circle
              @click="showAllotDialog(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" circle @click="delUser(scope.row)"></el-button>
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
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible" :close-on-click-modal="clickModal">
      <el-form :model="addForm" label-width="100px" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogFormVisible"
      :close-on-click-modal="clickModal"
    >
      <el-form :model="editForm" :label-width="'100px'" :rules="rules" ref="editForm">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" autocomplete="off" disabled style="width:80px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsers">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="allotDialogFormVisible">
      <el-form :model="allotForm">
        <el-form-item label="用户名">
          <span>{{allotForm.username}}</span>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="allotForm.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allotDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="allocateRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  getAddUsers,
  getEditUsers,
  getAllotRole,
  getDeluser,
  ChangeStatus
} from "@/api/user_index.js";
import { getRoleList } from "@/api/roles_index.js";

export default {
  data() {
    return {
      clickModal: false,
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      allotDialogFormVisible: false,
      // 用户列表
      userList: [],
      //  获取用户数据参数
      usersObj: {
        query: "",
        pagenum: 1,
        pagesize: 4
      },
      //  分页总条数
      total: 0,
      // 添加用户参数
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 编辑用户参数、
      editForm: {
        username: "",
        email: "",
        mobile: "",
        id: ""
      },
      // 验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: "请输入合法邮箱",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { pattern: /^1\d{10}$/, message: "请输入合法手机号", trigger: "blur" }
        ]
      },
      // 分配角色参数
      allotForm: {
        username: "",
        id: "",
        rid: ""
      },
      // 角色列表
      roleList: ""
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
      this.usersObj.pagenum = 1;
      this.getusersData();
    },
    handleCurrentChange(val) {
      this.usersObj.pagenum = val;
      this.getusersData();
    },
    // 添加用户+
    addUsers() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          getAddUsers(this.addForm).then(res => {
            this.$message.success("添加成功");
            // console.log(res);
            this.addDialogFormVisible = false;
            this.getusersData();
            this.$refs.addForm.resetFields();
          });
        } else {
          this.$message.warning("请填写完整数据");
        }
      });
    },
    // 弹出编辑对话框
    showEditDialog(row) {
      this.editDialogFormVisible = true;
      console.log(row);
      const { username, email, mobile, id } = this.editForm;
      this.editForm.username = row.username;
      this.editForm.email = row.email;
      this.editForm.id = row.id;
      this.editForm.mobile = row.mobile;
    },
    // 编辑用户
    editUsers() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          getEditUsers(this.editForm).then(res => {
            // console.log(res);
            this.getusersData();
            this.$message.success("编辑成功");
            this.editDialogFormVisible = false;
          });
        } else {
          this.$message.warning("请输入正确内容");
        }
      });
    },
    // 弹出分配角色对话框
    showAllotDialog(row) {
      this.allotDialogFormVisible = true;
      console.log(row);
      this.allotForm.username = row.username;
      this.allotForm.id = row.id;
      this.allotForm.rid = row.rid;
    },
    // 角色分配
    async allocateRoles() {
      if (this.allotForm.rid) {
        const res = await getAllotRole(this.allotForm);
        this.$message.success(res.data.meta.msg);
        this.getusersData();
        this.allotDialogFormVisible = false;
        console.log(res);
      } else {
        this.$message.warning("请设置角色");
      }
    },
    // 删除用户
    delUser(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getDeluser(row.id).then(res => {
            this.userList.splice(row.id, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.usersObj.pagenum =
              Math.ceil((this.total - 1) / this.usersObj.pagesize) <
              this.usersObj.pagenum
                ? --this.usersObj.pagenum
                : this.usersObj.pagenum;
            this.getusersData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改用户状态
    async userStatus(id, type) {
      const res = await ChangeStatus(id, type);
      console.log(res);
      this.$message.success(res.data.meta.msg);
    }
  },

  mounted() {
    this.getusersData();
    // 获取角色列表
    getRoleList().then(res => {
      // console.log(res);
      this.roleList = res.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
</style>