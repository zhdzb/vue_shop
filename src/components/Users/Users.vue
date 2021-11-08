<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <!-- 搜索与添加区域 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryUsersData.query"
            :clearable="true"
            @clear="getUsersData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryUser"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserDalogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <template slot-scope="scope">
            <!-- scope.row是userList中的数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryUsersData.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryUsersData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户区域 -->
    <el-dialog
      title="添加"
      :visible.sync="addUserDalogVisible"
      width="50%"
      @close="addUserFormClose"
    >
      <el-form
        :model="addUserForm"
        status-icon
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" type="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="$refs.addUserFormRef.resetFields()">重 置</el-button>
        <el-button type="primary" @click="submitAddUserData">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户区域 -->
    <el-dialog
      title="修改数据"
      :visible.sync="editUserDalogVisible"
      width="50%"
      @close="editUserFormClose"
    >
      <el-form
        :model="userDataById"
        ref="editUserFormRef"
        :rules="editUserFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            type="text"
            disabled
            v-model="userDataById.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" type="email">
          <el-input v-model="userDataById.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userDataById.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editUserFormClose">取 消</el-button>
        <el-button type="primary" @click="submitEditUserData">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色区域 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleVisible"
      @close="setRoleDialogClosed"
      width="30%"
    >
      <p>当前用户：{{ curUserInfo.username }}</p>
      <p>当前角色：{{ curUserInfo.role_name }}</p>
      <p>分配新角色:</p>
      <!-- 角色列表 -->
      <el-select v-model="checkedRole" placeholder="请选择角色">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <!-- *** -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsersData();
  },
  data() {
    //自定义表单规则
    var validataPass = (rules, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
      }
    };
    var validataMobile = (rules, value, callback) => {
      if (value === "") {
        return callback();
      }
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      //查询用户数据对象
      queryUsersData: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      //根据ID查询用户数据的结果
      userDataById: {},
      //接收用户数据列表
      userList: [],
      //用户数据总数
      total: 0,
      //添加弹窗开关
      addUserDalogVisible: false,
      //修改弹窗开关
      editUserDalogVisible: false,
      //分配角色弹窗开关
      setRoleVisible: false,
      //添加用户
      addUserForm: {
        username: "test",
        password: "qweasdqaz",
        email: "591893517@qq.com",
        mobile: "13402804094",
      },
      //角色列表
      roleList: [],
      //已选择角色id
      checkedRole: "",
      //添加用户表单规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名在3到10位之间", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度在6到16位之间",
            trigger: "blur",
          },
        ],
        mobile: [
          { message: "请输入手机号", trigger: "blur" },
          { validator: validataMobile, triggle: ["blur", "change"] },
        ],
      },
      //编辑用户表单规则
      editUserFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { message: "请输入手机号", trigger: "blur" },
          { validator: validataMobile, triggle: ["blur", "change"] },
        ],
      },
      //当前编辑用户信息
      curUserInfo: {},
    };
  },
  methods: {
    async getUsersData() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryUsersData,
      });
      //   console.log(res);
      if (res.meta.status == 200) {
        this.userList = res.data.users;
      }
      //   console.log(res);
      this.total = res.data.total;
      //每次只加载一页的数据
      //   console.log(this.userList);
    },
    //改变每一页的大小
    handleSizeChange(newSize) {
      this.queryUsersData.pagesize = newSize;
      //改变完从第一页显示
      this.queryUsersData.pagenum = 1;
      this.getUsersData();
    },
    handleCurrentChange(newPage) {
      this.queryUsersData.pagenum = newPage;
      this.getUsersData();
    },
    async changeState(user) {
      //   console.log(user.mg_state);
      const { data: res } = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      return this.$message.success("更新用户状态成功");
    },
    queryUser() {
      this.getUsersData();
    },
    //关闭添加用户表单时清空数据
    addUserFormClose() {
      this.$refs.addUserFormRef.resetFields();
    },
    //关闭修改用户表单并清空数据
    editUserFormClose() {
      this.$refs.editUserFormRef.resetFields();
      this.editUserDalogVisible = false;
    },
    //提交添加用户数据
    submitAddUserData() {
      //预校验
      this.$refs.addUserFormRef.validate(async (valid) => {
        // console.log(this);
        if (valid) {
          const { data: res } = await this.$http.post(
            "users",
            this.addUserForm
          );
          //   console.log(res);
          if (res.meta.status !== 201) {
            return this.$message.error("添加用户失败！");
          }
          this.$message.success("添加用户成功！");
          this.addUserDalogVisible = false;
          this.getUsersData();
        }
      });
    },
    //提交修改用户数据
    submitEditUserData() {
      //预验证
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `users/${this.userDataById.id}`,
            {
              email: this.userDataById.email,
              mobile: this.userDataById.mobile,
            }
          );
          //   console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("更新失败");
          }
          this.$message.success("更新成功！");
          this.editUserDalogVisible = false;
          this.getUsersData();
        }
      });
    },
    //打开修改窗口
    async showEditDialog(id) {
      this.editUserDalogVisible = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      //   console.log(res);
      this.userDataById = res.data;
      //   console.log(this.userDataById);
    },
    //删除用户
    async removeUserById(deleteUserId) {
      //   console.log(deleteUserId);
      const confirmDelete = await this.$confirm("是否删除该用户？", "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      //如果用户确认删除，则返回值为字符串confirm
      //如果用户取消了删除，则返回值为字符串 cancel
      if (confirmDelete !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.delete(`users/${deleteUserId}`);
      //   console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败!");
      }
      this.$message.success("删除成功!");
      //改变完从第一页显示
      this.queryUsersData.pagenum = 1;
      this.getUsersData();
    },
    //分配角色
    async setRole(userInfo) {
      this.setRoleVisible = true;
      //记录当前用户信息
      this.curUserInfo = userInfo;
      //获取角色列表
      const { data: roleRes } = await this.$http.get("roles");
      this.roleList = roleRes.data;
    },
    //提交已分配角色数据
    async submitRoleData() {
      const { data: res } = await this.$http.put(
        `users/${this.curUserInfo.id}/role`,
        {
          rid: this.checkedRole,
        }
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("分配角色失败");
      }
      this.$message.success("分配角色成功");
      //关闭弹窗
      this.setRoleVisible = false;

      //刷新数据
      this.getUsersData();
    },
    //监听分配角色弹窗关闭
    setRoleDialogClosed() {
      //清空当前用户信息
      this.curUserInfo = {};
      //清空当前角色列表
      this.checkedRole = "";
    },
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>
