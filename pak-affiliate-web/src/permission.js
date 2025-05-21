import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router from "@/router";
import { useStore } from "./store";
import { MenuActionType } from "@/store/modules/menu/action-types";

const whiteList = ['/403', '/login', '/poster', '/pak/login', '/pak/register']
NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, _, next) => {
  NProgress.start();
  const store = useStore();
  // Determine whether the user has logged in, if logged in can visit any page
  if (store.state.user.token) {
    await store.dispatch(MenuActionType.ACTION_SET_ROUTES, undefined);
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      next();
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next();
    } else {
      const currentHost = window.location.host
      const siteCode = currentHost.substring(0, 3)
      console.log("IS this")
      console.log(siteCode)
      next(`/pak/login?redirect=${to.path}`);
      // Other pages that do not have menu to access are redirected to the login page.
    }
  }
})

router.afterEach((/* to: RouteLocationNormalized */) => {
// Finish progress bar
// hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done();
// set page title
// document.title = to.name
});
