import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router from "@/router";
import { useStore } from "./store";
import { UserActionTypes } from "@/store/modules/user/action-types";
import { MenuActionType } from "@/store/modules/menu/action-types";
import { ElMessage } from "element-plus";

const whiteList = ['/login', '/auth-redirect']
NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, _, next) => {
  NProgress.start();
  const store = useStore();
  // Determine whether the user has logged in, if logged in can visit any page
  if (store.state.user.token) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      if (!store.state.user.permissions) {
        try {
          await store.dispatch(UserActionTypes.ACTION_GET_USER_INFO, undefined);
          await store.dispatch(MenuActionType.ACTION_SET_ROUTES, undefined);
          next({ ...to, replace: true });
        } catch (err) {
          // Remove token and redirect to login page
          await store.dispatch(UserActionTypes.ACTION_RESET_TOKEN, undefined);
          ElMessage.error(err || "Has Error");
          next(`/login?redirect=${to.path}`);
        }
      } else {
        next();
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next();
    } else {
      // Other pages that do not have menu to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
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
