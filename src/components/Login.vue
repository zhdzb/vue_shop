<template>
  <div class="login-body">
    <div class="login-container">
      <!-- logo -->
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- form -->
      <div class="login-form">
        <el-form :model="userLoginInfo" :rules="userLoginRules" ref="loginForm">
          <!-- input -->
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user-solid"
              v-model="userLoginInfo.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              prefix-icon="el-icon-lock"
              v-model="userLoginInfo.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <!-- button -->
            <div class="btn">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="info" @click="formReset">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      userLoginInfo: {
        username: "admin",
        password: "123456",
      },
      userLoginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 9, message: "长度在3到9个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在6到16之间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    formReset() {
      //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.loginForm.resetFields();
    },
    login() {
      //对整个表单进行校验的方法，参数为一个回调函数。
      //传入两个参数：是否校验成功和未通过校验的字段。
      this.$refs.loginForm.validate(async (valid, error) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            "login",
            this.userLoginInfo
          );
          if (res.meta.status !== 200) {
            alert("登陆失败");
          } else {
            alert("登陆成功");
            window.sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home");
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.login-body {
  height: 100%;
  display: flex;
  background-color: #2b4b6b;
  justify-content: center;
  align-items: center;
}

.login-container {
  height: 450px;
  width: 300px;
  background-color: #fff;
}

.login-container .logo {
  background-color: #fff;
  height: 130px;
  width: 130px;
  border: 2px solid #dfd8d8;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  padding: 10px;
  margin: 0 auto;
  transform: translateY(-40%);
}

.login-container .logo img {
  height: 100%;
  width: 100%;
  background-color: #eee;
  border-radius: 50%;
}

.login-form {
  padding: 0 20px;
}

.login-form .btn {
  display: flex;
  justify-content: flex-end;
}
</style>
