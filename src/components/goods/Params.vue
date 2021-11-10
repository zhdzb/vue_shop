<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert
        title="注意：只允许选择三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="checkedGoods"
            expand-trigger="hover"
            :options="goodsCategoryList"
            :props="expandGoodsCategoryList"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 渲染表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="editButton(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParam(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 渲染表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="editButton(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParam(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的弹窗 -->
    <el-dialog
      :title="'添加' + dialogTextTitle"
      :visible.sync="addParamsDialogVisible"
      width="30%"
      @close="handleAddDialogClose"
    >
      <!-- 添加表单 -->
      <el-form
        ref="addParamsFormRef"
        :model="addOrEditParamsForm"
        label-width="80px"
        :rules="formRules"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="addOrEditParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddParamsForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的弹窗 -->
    <el-dialog
      :title="'修改' + dialogTextTitle"
      :visible.sync="editParamsDialogVisible"
      width="30%"
      @close="handleEditDialogClose"
    >
      <!-- 添加表单 -->
      <el-form
        ref="editParamsFormRef"
        :model="addOrEditParamsForm"
        label-width="80px"
        :rules="formRules"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="addOrEditParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditParamsForm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsCategoryData();
  },
  data() {
    return {
      //商品分类数据列表
      goodsCategoryList: [],
      //选择器双向绑定的数据
      checkedGoods: [],
      //级联选择器数据展示
      expandGoodsCategoryList: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //页签双向绑定数据,默认应为第一个页面，动态参数
      activeName: "many",
      //动态参数数据
      manyTableData: [],
      //静态属性数据
      onlyTableData: [],
      //控制添加参数弹窗是否可见
      addParamsDialogVisible: false,
      //控制修改参数弹窗是否可见
      editParamsDialogVisible: false,
      //添加和修改参数表单的双向绑定
      addOrEditParamsForm: {
        attr_name: "",
        attr_id: null,
      },
      //表单验证数据
      formRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //获取商品分类数据
    async getGoodsCategoryData() {
      const { data: res } = await this.$http.get("categories");
      //   console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.goodsCategoryList = res.data;
    },
    //选择器数据改变处理函数,选定数据时触发
    handleChange() {
      this.getParamsData();
    },
    //页签数据改变处理函数
    handleClick() {
      //   console.log(this.activeName);
      this.getParamsData();
    },
    //获取商品的数据
    async getParamsData() {
      //筛选数据是否为三级分类
      if (this.checkedGoods.length !== 3) {
        this.checkedGoods = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: [this.activeName] },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类参数失败！");
      }
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    //处理添加参数弹窗的确定方法
    submitAddParamsForm() {
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("提交失败");
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addOrEditParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.addParamsDialogVisible = false;
        this.getParamsData();
      });
    },
    //处理添加参数弹窗的关闭
    handleAddDialogClose() {
      this.$refs.addParamsFormRef.resetFields();
    },
    //修改按钮处理事件
    editButton(param) {
      this.editParamsDialogVisible = true;
      this.addOrEditParamsForm.attr_name = param.attr_name;
      this.addOrEditParamsForm.attr_id = param.attr_id;
    },
    //处理修改参数弹窗的确定方法
    submitEditParamsForm() {
      this.$refs.editParamsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("提交失败");
        }
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.addOrEditParamsForm.attr_id}`,
          {
            attr_name: this.addOrEditParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功");
        this.editParamsDialogVisible = false;
        this.getParamsData();
      });
    },
    //处理修改参数弹窗关闭
    handleEditDialogClose() {
      this.$refs.editParamsFormRef.resetFields();
    },
    //删除参数
    async deleteParam(param) {
      //弹窗确认
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${param.attr_id}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.$message.success("删除成功");
          this.getParamsData();
        })
        .catch(() => {
          this.$message.info("已取消删除");
          return;
        });
    },
  },
  computed: {
    //如果选择器双向绑定的数据的数组长度为3则添加参数的按钮可以选择
    isBtnDisabled() {
      if (this.checkedGoods.length === 3) {
        return false;
      }
      return true;
    },
    //得到选择器中的商品的id
    cateId() {
      if (this.checkedGoods.length === 3) {
        return this.checkedGoods[2];
      }
      return null;
    },
    //控制弹窗标题
    dialogTextTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
};
</script>
<style scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-row {
  margin-bottom: 15px;
}
</style>
