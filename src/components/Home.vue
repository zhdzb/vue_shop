<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "home",
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped></style>
