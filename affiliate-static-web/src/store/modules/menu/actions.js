import { MenuActionType } from "./action-types";
// import Layout from "../../../layout/Index.vue";
// import { loadAuthMenu } from "../../../api/user";
import { MenuMutationType } from "./mutations";

// const filterChildren = (childrenMenu, parentMenu = false) => {
//   let children = [];
//   childrenMenu.forEach(menu => {
//     if (menu.children && menu.children.length) {
//       if (menu.component === "ParentView") {
//         menu.children.forEach((c) => {
//           c.path = `${menu.path}${c.path}`;
//           if (c.children && c.children.length) {
//             children = children.concat(filterChildren(c.children, c));
//             return;
//           }
//           children.push(c);
//         });
//         return;
//       }
//     }
//     if (parentMenu) {
//       menu.path = `${parentMenu.path}${menu.path}`;
//     }
//     children = children.concat(menu);
//   });
//   return children;
// };

export const loadView = (view) => {
  return () => Promise.resolve(require(`@/views/${view}/index.vue`).default);
};

// const menu2Router = (menus) => {
//   return menus.map((menu) => {
//     if (menu.children) {
//       menu.children = filterChildren(menu.children, menu);
//     }
//     if (menu.component) {
//       if (menu.component === "Layout") { // Layout组件特殊处理
//         menu.component = Layout;
//       } else {
//         const component = menu.component;
//         menu.component = loadView(component);
//       }
//     }
//     if (menu.children != null && menu.children && menu.children.length) {
//       menu.children = menu2Router(menu.children);
//     } else {
//       delete menu.children;
//     }
//     return menu;
//   });
// };

export const actions = {
  async [MenuActionType.ACTION_SET_ROUTES](
    { commit }) {
    // let { data: menus } = await loadAuthMenu();
    // menus = menu2Router(menus);
    commit(MenuMutationType.SET_ROUTES, []);
  }
};
