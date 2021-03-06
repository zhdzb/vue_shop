import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login";
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import Users from "../components/Users/Users";
import Rights from "../components/power/Rights";
import Roles from "../components/power/Roles";
import Cate from "../components/goods/Cate";
import Params from "../components/goods/Params";
Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: Welcome },
      { path: "/users", component: Users },
      { path: "/rights", component: Rights },
      { path: "/roles", component: Roles },
      { path: "/categories", component: Cate },
      { path: "/params", component: Params },
    ],
  },
];

const router = new VueRouter({
  routes,
});

//路由导航守卫控制访问权限
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    return next();
  }
  const token = sessionStorage.getItem("token");
  if (!token) {
    return next("/login");
  }
  next();
});

export default router;
