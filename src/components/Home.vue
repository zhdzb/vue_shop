<template>
  <!-- 头部区域 -->
  <el-container>
    <el-header>
      <div class="header-left">
        <img src="../assets/logo.png" alt="" />
        <span>系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <button class="toggle-button-close" ref="openAside" @click="toggleAside">
        |||
      </button>
      <!-- 侧边栏 -->
      <el-aside :width="wth">
        <button class="toggle-button" @click="toggleAside" ref="toggleAside">
          |||
        </button>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          style="border-right: 0"
          :router="true"
          :default-active="activeItem"
        >
          <el-submenu
            :index="'/' + menu.path"
            v-for="menu in menuList"
            :key="menu.id"
          >
            <!-- 一级菜单 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + menuChild.path"
              v-for="menuChild in menu.children"
              :key="menuChild.id"
              @click="saveActiveItem('/' + menuChild.path)"
            >
              <i class="el-icon-location"></i>
              {{ menuChild.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view
      ></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  created() {
    this.loadMenuData();
    this.loadActiveItem();
  },
  destroyed() {},
  data() {
    return {
      menuList: [],
      wth: "200px",
      asideIsOpen: true,
      activeItem: "",
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    async loadMenuData() {
      //加载菜单数据
      const { data: res } = await this.$http.get("menus");
      //   console.log(res);
      if (res.meta.status == 200) {
        this.menuList = res.data;
      }
      //   console.log(this.menuList);
    },
    toggleAside() {
      const openbutton = this.$refs.openAside;
      if (this.asideIsOpen) {
        this.wth = "0";
        openbutton.classList.add("alive");
        this.asideIsOpen = !this.asideIsOpen;
      } else {
        this.wth = "200px";
        openbutton.classList.remove("alive");
        this.asideIsOpen = !this.asideIsOpen;
      }
    },
    saveActiveItem(activeItem) {
      sessionStorage.setItem("activeItem", activeItem);
      this.activeItem = activeItem;
    },
    loadActiveItem() {
      this.activeItem = sessionStorage.getItem("activeItem");
    },
  },
};
</script>

<style scoped>
.el-container {
  height: 100vh;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background-color: #333744;
  transition: all 0.5s ease;
  position: relative;
}
.el-main {
  background-color: #eaedf1;
}
.header-left {
  height: 100%;
  display: flex;
  align-items: center;
}
.header-left img {
  height: 95%;
  border: 1px solid #fff;
  border-radius: 50%;
}
.header-left span {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-left: 10px;
}
.toggle-button {
  width: 100%;
  height: 30px;
  background-color: #4a5064;
  color: white;
  border: 0;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-aside.close {
}

.toggle-button-close {
  display: block;
  width: 40px;
  height: 40px;
  background-color: #4a5064;
  color: white;
  border: 0;
  letter-spacing: 0.2em;
  cursor: pointer;
  position: absolute;
  top: 65px;
  opacity: 0;
}
.toggle-button-close.alive {
  opacity: 1;
}
</style>
