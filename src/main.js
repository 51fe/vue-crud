import Vue from "vue";
import App from "./App.vue";

import "element-ui/lib/theme-chalk/index.css";
import Element from "element-ui";

Vue.config.productionTip = false;

Vue.use(Element, { size: "small" });


new Vue({
  render: h => h(App)
}).$mount('#app')
