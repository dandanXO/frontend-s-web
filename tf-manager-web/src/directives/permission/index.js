import { useStore } from "../../store";
import { ADMIN } from "../../store/modules/user/action-types";

function checkPermission(el, binding) {
  if (useStore().state.user.userType !== ADMIN.value) {
    const { value } = binding
    const roles = useStore().state.user.permissions

    if (value && value instanceof Array) {
      if (value.length > 0) {
        const permissionRoles = value

        const hasPermission = roles.some(role => {
          return permissionRoles.includes(role)
        })

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}

/**
 * 权限检查指令，在el-tabs,el-table-column等控件中无效，此类控件使用 util.js中 hasRole 和 hasPermission
 * @type {Store<unknown>}
 */
export const permission = {
  beforeMount(el, binding) {
    checkPermission(el, binding)
  },
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  updated(el, binding) {
    checkPermission(el, binding)
  }
}
