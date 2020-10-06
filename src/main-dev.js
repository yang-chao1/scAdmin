import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import tree from 'vue-table-with-tree-grid'
import './plugins/element'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config=>{
    Nprogress.start()
    config.headers.Authorization=window.sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use(config => {
    Nprogress.done()
    return config
})
Vue.use(VueQuillEditor)
Vue.prototype.$http=axios
Vue.config.productionTip = false
Vue.component('tree-table',tree)

Vue.filter('dateFormat',function(originVal){
    const dt =new Date(originVal)
    const y =dt.getFullYear();
    const m=(dt.getMonth()+1+'').padStart(2,'0')
    const d=(dt.getDate()+'').padStart(2,'0')
    const hh=(dt.getHours()+'').padStart(2,'0')
    const mm=(dt.getMinutes()+'').padStart(2,'0')
    const ss=(dt.getSeconds()+'').padStart(2,'0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
