import Vue from 'vue'
import App from './App.vue'

import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import Element from 'element-ui'

Vue.config.productionTip = false

Vue.use(Element, { size: 'medium' })

new Vue({
  render: h => h(App)
}).$mount('#app')
