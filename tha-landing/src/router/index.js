import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import {useUI } from "../stores/ui"

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })


  Router.beforeEach((to, from, next) => {

    const ui = useUI();
    console.log(window.location.href);
  // || window.location.href.indexOf("http://localhost:") > -1
    if(window.location.href.indexOf("https://slot-win.cc") > -1 ){
      console.log("Is Slot Win");
      ui.isAffiliateA= true;

      fbq("init", "211810688532352");
      fbq("track", "PageView");
      fbq("track", "ViewContent");

      //For TESTING.
      // fbq("init", "6757510457678415");
      // fbq("track", "PageView");


       var isFirstTime =   sessionStorage.getItem("FIRST_TIME_LOG");
       if(!isFirstTime){
         fbq("track", "firstOpen");

         sessionStorage.setItem("FIRST_TIME_LOG", "1");
       }
    }

    next();
  });




  return Router
})
