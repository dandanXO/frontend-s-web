import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import Antd from "ant-design-vue";
import {createPinia} from "pinia";
import ElementPlus from 'element-plus'
import AOS from "aos";

import "aos/dist/aos.css";
import "@/scss/common.scss";
import "ant-design-vue/dist/antd.css";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App);

app
    .use(createPinia())
    .use(AOS.init())
    .use(router)
    .use(Antd)
    .use(ElementPlus, {
        locale: zhCn
    })
    .mount("#app");

