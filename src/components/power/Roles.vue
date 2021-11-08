<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" style="margin-bottom:15px"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格部分 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" width="50px">
          <template slot-scope="scope">
            <!-- 行 -->
            <el-row
              :class="['levelOneRow', i1 == 0 ? 'levelOneRowFirst' : '']"
              v-for="(level1, i1) in scope.row.children"
              :key="level1.id"
            >
              <!-- 第一级 -->
              <el-col :span="5"
                ><el-tag
                  type="success"
                  closable
                  @close="deleteRightById(scope.row, level1.id)"
                  >{{ level1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二级 -->
              <el-col :span="19">
                <el-row
                  class="levelTwoRow"
                  v-for="(level2, i2) in level1.children"
                  :key="level2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="deleteRightById(scope.row, level2.id)"
                      >{{ level2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第三级 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="level3 in level2.children"
                      :key="level3.id"
                      type="warning"
                      closable
                      @close="deleteRightById(scope.row, level3.id)"
                      >{{ level3.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary">编辑</el-button>
            <el-button type="danger">删除</el-button>
            <el-button type="warning" @click="getUserRightTree(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="userRightDialogVisible"
      @close="setRigthDialogClose"
      width="30%"
    >
      <!-- 树 -->
      <el-tree
        :data="rightList"
        :props="props"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultKey"
        ref="rightRreeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    //自定义表单规则

    return {
      rolesList: [],
      //弹窗控制
      userRightDialogVisible: false,
      //权限列表
      rightList: [],
      //树
      props: {
        label: "authName",
        children: "children",
      },
      //当前弹窗的用户id
      curUserId: "",
      //默认勾选已有权限
      defaultKey: [105, 116],
    };
  },
  created() {
    this.getRolesListData();
  },
  methods: {
    //获取信息
    async getRolesListData() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolesList = res.data;
      // console.log(this.rolesList);
    },
    //删除权限
    async deleteRightById(role, rightId) {
      const confirmResult = await this.$confirm("是否确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelBuuttonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      //直接赋给table中的数据，避免重新刷新
      role.children = res.data;
      console.log(role == this.rolesList[0]);
    },
    //权限分配
    async getUserRightTree(curUser) {
      this.curUserId = curUser.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限树失败！");
      }
      this.rightList = res.data;
      // console.log(cur);
      this.getUserRightId(curUser, this.defaultKey);
      this.userRightDialogVisible = true;
    },
    //获得当前角色已有权限的id
    getUserRightId(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((element) => {
        this.getUserRightId(element, arr);
      });
    },
    //监听分配权限对话框的关闭
    setRigthDialogClose() {
      //清空默认值数组
      this.defaultKey = [];
      //清空当前用户id
      this.curUserId = "";
    },
    //关闭分配权限对话框操作
    async allotRights() {
      //获取勾选的数据
      const checkedRightsId = [
        ...this.$refs.rightRreeRef.getCheckedKeys(),
        ...this.$refs.rightRreeRef.getHalfCheckedKeys(),
      ];
      // console.log(checkedRightsId);
      //将数组转为字符串
      const strCheckedRightsId = checkedRightsId.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.curUserId}/rights`,
        {
          rids: strCheckedRightsId,
        }
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }
      //刷新列表
      this.getRolesListData();
      this.$message.success("分配权限成功");
      this.userRightDialogVisible = false;
    },
  },
};
</script>
<style scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
.levelOneRowFirst {
  padding: 0 20px 15px 20px;
  border-top: 1px solid #ebeef5;
}
.levelOneRow {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}
.levelTwoRow {
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}
</style>
