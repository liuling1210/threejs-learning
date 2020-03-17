import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import router from 'vue-router'
// import store from 'vuex'

Vue.use(ElementUI,{size:'small'})
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
