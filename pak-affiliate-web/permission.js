import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router from "@/router";
import { useStore } from "./store";
import { MenuActionType } from "@/store/modules/menu/action-types";

const whiteList = ['/login', '/my/login', '/my/register', '/kaka/login', '/kaka/register', '/ph/login', '/ph/register', '/th/login', '/th/register', '/xf/login', '/xf/register', '/dy/login', '/dy/register', '/ind/login', '/ind/register', '/lh/login', '/lh/register', '/vi/login', '/vi/register', '/ind2/login', '/ind2/register', '/kr/login', '/kr/register', '/pak/login', '/pak/register']
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
      const thaiHost = "affiliate-web.monemental.com"
      if (currentHost === thaiHost) {
        next(`/th/login?redirect=${to.path}`);
      } else {
        console.log("HERe")
        console.log(siteCode);
        if (siteCode === 'lh1') {
          next(`/lh/login?redirect=${to.path}`)
        } else if (siteCode === 'dy2') {
          next(`/dy/login?redirect=${to.path}`)
        } else if (siteCode === 'iw2') {
          next(`/ind2/login?redirect=${to.path}`)
        } else if (siteCode === 'ind') {
          next(`/ind/login?redirect=${to.path}`)
        } else if (siteCode === 'vnm') {
          next(`/vi/login?redirect=${to.path}`)
        } else if (siteCode === 'ka1') {
          next(`/kaka/login?redirect=${to.path}`)
        } else if (siteCode === 'krw') {
          next(`/kr/login?redirect=${to.path}`)
        } else if (siteCode === 'pak') {
          next(`/pak/login?redirect=${to.path}`)
        } else {
          next(`/login?redirect=${to.path}`);
        }
      }
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
