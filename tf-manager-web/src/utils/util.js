import { useStore } from "../store";
import vueDefaultConfig from "../config/vue.custom.config";
import { ADMIN } from "../store/modules/user/action-types";

export const hasPermission = (permission) => {
  const permissions = useStore().state.user.permissions
  if (useStore().state.user.userType === ADMIN.value) {
    return true;
  } else {
    if (permission && permission instanceof Array) {
      if (permission.length > 0) {
        const permissionRoles = permission
        return permissions.some(role => {
          return permissionRoles.includes(role)
        })
      }
    }
  }
}

export const hasRole = (roles) => {
  const role = useStore().state.user.userType
  if (roles) {
    if (roles instanceof Array) {
      return roles.includes(role);
    } else {
      return roles === role;
    }
  }
}

export const showTips = (name) => {
  const menus = vueDefaultConfig.showTipsMenu;
  return menus.includes(name);
}
