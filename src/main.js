import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
// 导入全局样式
import "./assets/global.css";

//导入axios
import axios from "axios";
//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1";
axios.interceptors.request.use((config) => {
  // console.log(config);
  config.headers.Authorization = sessionStorage.getItem("token");
  //最后必须return config
  return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
