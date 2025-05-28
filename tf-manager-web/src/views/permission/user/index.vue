<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.username')"
        />
        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="siteChange"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-select
          clearable
          v-model="request.enable"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.userSate"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.role"
          size="small"
          :placeholder="t('fields.role')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @focus="loadRoles(request.defaultSiteIds)"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadUser"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:user:create']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:user:delete']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:user:update:state']"
          @click="removeUser()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="userForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.username')" prop="loginName">
          <el-input
            :disabled="uiControl.dialogType !== 'CREATE'"
            v-model="form.loginName"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item
          v-if="
            uiControl.dialogType === 'CREATE' ||
              uiControl.dialogType === 'CHANGE_PASSWORD'
          "
          :label="t('fields.password')"
          prop="password"
        >
          <el-input
            type="password"
            v-model="form.password"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item
          v-if="
            uiControl.dialogType === 'CREATE' ||
              uiControl.dialogType === 'CHANGE_PASSWORD'
          "
          :label="t('fields.confirmPassword')"
          prop="confirm"
        >
          <el-input
            type="password"
            v-model="form.confirm"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item
          v-if="
            uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'
          "
          :label="t('fields.userType')"
          prop="userType"
        >
          <el-select
            v-model="form.userType"
            size="small"
            class="filter-item"
            style="width: 350px"
            :placeholder="t('fields.pleaseChoose')"
            default-first-option
            @change="onUserTypeChange"
          >
            <el-option
              v-for="item in userTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="uiControl.siteSelectVisible && form.userType === 'TENANT'"
          :label="t('fields.site')"
          prop="siteId"
        >
          <el-select
            v-model="form.siteId"
            size="small"
            class="filter-item"
            style="width: 350px"
            default-first-option
            :placeholder="t('fields.pleaseChoose')"
            @focus="loadSites"
            @change="onSiteChange"
          >
            <el-option
              v-for="item in formSiteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            uiControl.siteSelectVisible &&
              (form.userType === 'MANAGER' || form.userType === 'ADMIN')
          "
          :label="t('fields.site')"
          prop="siteIds"
        >
          <el-select
            v-model="form.siteIdArray"
            size="small"
            class="filter-item"
            style="width: 350px"
            :placeholder="t('fields.pleaseChoose')"
            multiple
            filterable
            @change="setSiteIdArray"
          >
            <el-option
              v-for="item in formSiteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'
          "
          :label="t('fields.role')"
          prop="roles"
        >
          <el-select
            v-model="form.roles"
            multiple
            :placeholder="t('fields.pleaseChoose')"
            style="width: 350px"
            filterable
            @focus="
              loadRoles(
                form.siteIdArray && form.siteIdArray !== null
                  ? `0,${form.siteIdArray}`
                  : form.siteId
              )
            "
            :disabled="uiControl.rolesSelect"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'
          "
          :label="t('fields.queryRestriction')"
          prop="queryRestriction"
        >
          <el-select
            v-model="form.queryRestriction"
            size="small"
            class="filter-item"
            style="width: 350px"
            :disabled="uiControl.queryRestrictionSelect"
            :placeholder="t('fields.pleaseChoose')"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.queryRestriction"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'
          "
          :label="t('fields.queryNumber')" prop="queryNumber"
        >
          <el-input
            v-model="form.queryNumber"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item
          v-if="
            uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'
          "
          :label="t('fields.vcallName')"
          prop="vcallId"
        >
          <el-select
            v-model="form.vcallId"
            size="small"
            class="filter-item"
            style="width: 350px"
            :placeholder="t('fields.pleaseChoose')"
            clearable
          >
            <el-option
              v-for="item in netPhone.list"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="cancel">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="mini"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column :label="t('fields.site')" :formatter="toSiteName" width="100" />
      <el-table-column prop="loginName" :label="t('fields.username')" width="200">
        <template #default="scope">
          {{ scope.row.loginName }}
          <el-tag
            size="small"
            v-if="scope.row.loginName === LOGIN_USER_NAME"
            style="margin-left: 5px"
          >
            {{ t('fields.itsYou') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="queryRestriction" :label="t('fields.queryRestriction')" width="150" />
      <el-table-column prop="queryNumber" :label="t('fields.queryNumber')" width="150" />
      <el-table-column prop="status" :label="t('fields.state')" width="100">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeUserState(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="lockStatus" :label="t('fields.lockStatus')" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.attempt === 3 && scope.row.lastAttemptDate === today" type="danger">{{ scope.row.lockStatus = 'LOCKED' }}</el-tag>
          <el-tag v-else type="success">{{ scope.row.lockStatus = 'NORMAL' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="vcallName" :label="t('fields.vcallName')" width="200">
        <template #default="scope">
          {{ scope.row.vcallName }}
        </template>
      </el-table-column>
      <el-table-column prop="roles" :label="t('fields.role')" width="200">
        <template #default="scope">
          {{ getRolesTxt(scope.row.roles) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{data: scope.row.createTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="100" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" width="200">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{data: scope.row.updateTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" width="100" />
      <el-table-column :label="t('fields.operate')" align="center" fixed="right" min-width="500"
                       v-if="hasPermission(['sys:user:update:password'])||hasPermission(['sys:user:update'])||hasPermission(['sys:user:delete'])"
      >
        <template #default="scope">
          <div v-if="scope.row.loginName !== LOGIN_USER_NAME">
            <el-button
              icon="el-icon-lock"
              size="mini"
              type="info"
              v-permission="['sys:user:update:password']"
              @click="showChangePassword(scope.row)"
            >
              {{ t('fields.updatePassword') }}
            </el-button>
            <el-button
              icon="el-icon-unlock"
              size="mini"
              type="warning"
              v-permission="['sys:user:unlock']"
              @click="unlock(scope.row.id)"
              :disabled="scope.row.lockStatus !== 'LOCKED'"
            >
              {{ t('fields.unlockUser') }}
            </el-button>
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="success"
              v-permission="['sys:user:update']"
              @click="showEdit(scope.row)"
            />
            <el-button icon="el-icon-remove"
                       size="mini"
                       type="danger"
                       v-permission="['sys:user:delete']"
                       @click="removeUser(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { numericOnly, required, size } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  updateUserPassword,
  updateUserState,
  unlockUser
} from '../../../api/user'
import { getSimpleRoles } from '../../../api/roles'
import { getNetPhone } from '../../../api/vcall'
import { getSiteListSimple } from '../../../api/site'
import { useStore } from '../../../store'
import {
  ADMIN,
  MANAGER,
  TENANT,
} from '../../../store/modules/user/action-types'
import { hasPermission } from '../../../utils/util'
import moment from 'moment'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const LOGIN_USER_NAME = computed(() => store.state.user.name)
const site = ref(null)
const userTypeList = computed(() => {
  if (
    store.state.user.userType === MANAGER.value ||
    store.state.user.userType === ADMIN.value
  ) {
    return [MANAGER, TENANT]
  } else {
    return [TENANT]
  }
})
const today = moment(new Date()).format('YYYY-MM-DD');
const siteList = reactive({ list: [] })
const formSiteList = reactive({ list: [] })
const netPhone = reactive({ list: [] })
const userForm = ref(null)
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  rolesSelect: true,
  siteSelectVisible: false,
  userTypeSelect: false,
  userSate: [
    { key: 1, displayName: 'active', value: true },
    { key: 2, displayName: 'disable', value: false },
  ],
  queryRestriction: [
    { key: 1, displayName: 'No Limit', value: 'NO_LIMIT' },
    { key: 2, displayName: 'At Least One', value: 'AT_LEAST_ONE' }
  ]
})
const page = reactive({
  pages: 0,
  records: [],
})
const request = reactive({
  size: 30,
  current: 1,
  name: null,
  enable: null,
  siteId: null,
  role: null,
  defaultSiteIds: null
})
const options = ref([])

const form = reactive({
  id: null,
  loginName: null,
  password: null,
  confirm: null,
  roles: null,
  siteId: null,
  userType:
    LOGIN_USER_TYPE.value === TENANT.value ? LOGIN_USER_TYPE.value : null,
  queryRestriction: null,
  queryNumber: 10,
  vcallId: null,
  siteIdArray: null,
})

const validateconfirm = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  } else {
    callback()
  }
}
const formRules = reactive({
  loginName: [
    required(t('message.validateUsernameRequired')),
    size(6, 12, t('message.validateUsernameSize')),
  ],
  password: [
    required(t('message.validatePasswordRequired')),
    size(6, 12, t('message.validatePasswordSize')),
  ],
  confirm: [
    required(t('message.validateConfirmPasswordRequired')),
    size(6, 12, t('message.validateConfirmPasswordSize')),
    {
      validator: validateconfirm,
      trigger: 'blur',
    },
  ],
  roles: [required(t('message.validateRoleRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  userType: [required(t('message.validateUserTypeRequired'))],
  queryRestriction: [required(t('message.validateQueryRestrictionRequired'))],
  queryNumber: [required(t('message.validateQueryNumberRequired')), numericOnly(t('message.validateNumberOnly'))],
  siteIds: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (form.userType === 'MANAGER' && (!form.siteIdArray || form.siteIdArray.length === 0)) {
          callback(new Error(t('message.validateSiteRequired')));
        } else {
          callback();
        }
      },
      trigger: 'change',
    }
  ],
})

let chooseUser = []

function resetQuery() {
  request.name = null
  request.enable = null
  request.siteId = store.state.user.siteId
  request.role = null
  request.defaultSiteIds = LOGIN_USER_TYPE.value !== TENANT.value ? `0,${store.state.user.sites.map(site => site.id).join(',')}` : store.state.user.sites.map(site => site.id).join(',')
}

function handleSelectionChange(val) {
  chooseUser = val
  if (chooseUser.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (chooseUser.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

async function loadUser() {
  const { data: ret } = await getUsers(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.id === data.siteId) !== undefined
        ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
        : null
    if (data.siteIds !== null && data.siteIds !== undefined) {
      data.siteIdArray = data.siteIds
        .split(',')
        .filter(Boolean)
        .map(str => {
          return Number(str)
        })
    }
  })

  page.records = ret.records
}

async function loadRoles(siteId) {
  if (siteId !== undefined && siteId !== null) {
    siteId = String(siteId)
    if (form.userType !== "TENANT" && !siteId.includes('0')) {
      siteId = `0,${siteId}`
    }
  }
  const { data: roles } = await getSimpleRoles(siteId)

  // 拼接 name
  const newRoles = roles.map(role => ({
    ...role,
    name: `${role.name} ${getSiteName(role.siteId)}`
  }))
  options.value = newRoles
}

function changePage(page) {
  request.current = page
  loadUser()
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (userForm.value) {
      userForm.value.resetFields()
    }
    form.id = null
    form.password = null
    form.confirm = null
    form.roles = null
    form.siteIdArray = null
    form.siteId = null
    form.userType =
      LOGIN_USER_TYPE.value === TENANT.value ? LOGIN_USER_TYPE.value : null
    form.queryRestriction = null
    form.queryNumber = 10
    form.vcallId = null;
    uiControl.dialogTitle = t('fields.addUser')
    uiControl.userTypeSelect = false
    uiControl.siteSelectVisible = true
    uiControl.rolesSelect = false
  } else if (type === 'EDIT') {
    form.siteId = null
    form.siteIdArray = null
    uiControl.siteSelectVisible = true
    uiControl.rolesSelect = false
    uiControl.dialogTitle = t('fields.editUser')
  } else {
    uiControl.dialogTitle = t('fields.updatePassword')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true

  if (form.userType && form.userType === 'TENANT') {
    form.siteId = store.state.user.siteId
  }
}

function showEdit(user) {
  showDialog('EDIT')
  if (!user) {
    user = chooseUser[0]
  }
  nextTick(async() => {
    for (const key in user) {
      if (Object.keys(form).find(k => k === key)) {
        if (key === 'vcallId' && user[key] === 0) {
          form[key] = null
        } else {
          form[key] = user[key]
        }
      }
    }
    form.id = user.id;

    await loadRoles(
      form.siteIdArray && form.siteIdArray !== null
        ? form.siteIdArray
        : form.siteId
    )
  })
}

function showChangePassword(user) {
  showDialog('CHANGE_PASSWORD')
  nextTick(() => {
    form.id = user.id
    form.loginName = user.loginName
  })
}

function resetFields() {
  if (userForm.value) {
    userForm.value.resetFields()
  }
  form.id = null
  form.password = null
  form.confirm = null
  form.roles = null
  form.siteId = null
  form.userType =
    LOGIN_USER_TYPE.value === TENANT.value ? LOGIN_USER_TYPE.value : null
  form.queryRestriction = null
  form.queryNumber = 10
  form.vcallId = null;
  uiControl.dialogTitle = t('fields.addUser')
  uiControl.userTypeSelect = false
  uiControl.siteSelectVisible = false
  uiControl.rolesSelect = true
}

/**
 * 新增用户
 */
function create() {
  userForm.value.validate(async valid => {
    if (valid) {
      await createUser(form)
      uiControl.dialogVisible = false;
      await loadUser()
      ElMessage({ message: t('message.addSuccess'), type: 'success' });
      resetFields();
      // setTimeout(() => {
      //   window.location.reload()
      // }, 250)
    }
  })
}

/**
 * 编辑用户
 */
function edit() {
  userForm.value.validate(async valid => {
    if (valid) {
      if (form.siteId === 0 && (form.siteIdArray !== null || form.siteIdArray !== 0)) {
        form.siteId = form.siteIdArray[0]
      }
      await updateUser(form)
      uiControl.dialogVisible = false
      await loadUser()
      ElMessage({ message: t('message.editSuccess'), type: 'success' });
      resetFields();
    }
  })
}

function updatePassword() {
  userForm.value.validate(async valid => {
    if (valid) {
      await updateUserPassword(form)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.updatePasswordSuccess'), type: 'success' })
    }
  })
}

async function unlock(id) {
  await unlockUser(id);
  ElMessage({ message: t('message.unlockUserSuccess'), type: 'success' })
  await loadUser();
}

async function changeUserState(id, state) {
  await updateUserState(id, state)
}

async function removeUser(user) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: 'warning',
    }
  ).then(async () => {
    if (user) {
      await deleteUser([user.id])
    } else {
      await deleteUser(chooseUser.map(u => u.id))
    }
    await loadUser()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function cancel() {
  uiControl.dialogVisible = false;
  resetFields();
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  } else {
    updatePassword()
  }
}

async function loadSites() {
  const response = await getSiteListSimple()
  // if (store.state.user.userType === "ADMIN") {
  // response = await getSiteListSimpleOri()
  // } else {
  //   response = await getSiteListSimple()
  // }
  siteList.list = response.data
}

async function loadDefaultSites() {
  formSiteList.list = store.state.user.sites
}

async function loadNetPhone() {
  const { data: ret } = await getNetPhone()
  netPhone.list = ret
}

function toSiteName(row, column, cellValue, index) {
  if (row.siteIds !== null && row.siteIds !== "") {
    if (LOGIN_USER_TYPE.value === TENANT.value) {
      return store.state.user.siteName
    } else {
      const siteIdsArray = row.siteIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      const siteNames = siteIdsArray
        .map(siteId => siteList.list.find(site => site.id === siteId)?.siteName)
        .filter(Boolean)
      return siteNames.join(', ');
    }
  } else {
    if (row.siteId) {
      if (row.siteId === 0) {
        return '-'
      } else {
        return siteList.list.find(site => site.id === row.siteId).siteName
      }
    } else {
      return '-'
    }
  }
}

function getSiteName(siteId) {
  if (siteId) {
    if (siteId === 0) {
      return ''
    } else {
      const site = store.state.user.sites.find(site => site.id === siteId)
      return site ? `(${site.siteName})` : ''
      // return "(" + store.state.user.sites.find(site => site.id === siteId).siteName + ")" //  siteList.list.find(site => site.id === siteId).siteName
    }
  } else {
    return ''
  }
}

function getRolesTxt(roleIds) {
  return roleIds.map(rid => roleTxt(rid)).join(',')
}

function roleTxt(roleId) {
  for (const r of options.value) {
    if (r.id === roleId) {
      return r.name;
    }
  }
}

function setSiteIdArray() {
  form.siteId = form.siteIdArray[0]
  onSiteChange()
}

function selectable(row) {
  return row.loginName !== LOGIN_USER_NAME.value
}

// async function siteChange() {
//   await loadRoles(request.siteId)
// }

async function onSiteChange() {
  // 先保存当前已选的 role id
  const oldRoles = Array.isArray(form.roles) ? [...form.roles] : []

  await loadRoles(
    form.siteIdArray && form.siteIdArray !== null
      ? form.siteIdArray
      : form.siteId
  )

  // 取出新 options 里的所有 id
  const validRoleIds = options.value.map(r => r.id)
  // 只保留还在 options 里的 role
  form.roles = oldRoles.filter(id => validRoleIds.includes(id))

  // form.roles = null
  uiControl.rolesSelect = false
}

function onUserTypeChange() {
  uiControl.siteSelectVisible = true
  uiControl.rolesSelect = true
  form.roles = null
  if (form.userType && form.userType === 'MANAGER') {
    form.siteId = 0
  } else if (form.userType && form.userType === 'TENANT') {
    if (form.siteId === 0) {
      form.siteId = null
    }
    form.siteIdArray = null
  }

  if (form.siteId && form.siteId !== 0) {
    uiControl.rolesSelect = false
  }
}

// watch(
//   () => form.siteIdArray || form.siteId,
//   async (value, oldValue) => {
//     console.log('site id array' + form.siteIdArray)
//     console.log('site id' + form.siteId)
//     await loadRoles(
//       form.siteIdArray && form.siteIdArray !== null
//         ? form.siteIdArray
//         : form.siteId
//     )
//     if (uiControl.dialogType === 'CREATE') {
//       form.roles = null
//       if (value) {
//         uiControl.rolesSelect = false
//       }
//     } else if (uiControl.dialogType === 'EDIT') {
//       if (oldValue && value && value !== oldValue) {
//         form.roles = null
//       }
//       uiControl.rolesSelect = false
//     }
//   }
// )
// watch(
//   () => form.userType,
//   async () => {
//     if (form.userType && form.userType === 'MANAGER') {
//       uiControl.userTypeSelect = true
//       uiControl.siteSelectVisible = true
//       uiControl.rolesSelect = true
//       form.siteId = 0
//     } else if (form.userType && form.userType === 'TENANT') {
//       uiControl.userTypeSelect = true
//       uiControl.siteSelectVisible = true
//       uiControl.rolesSelect = true
//       if (form.siteId === 0) {
//         form.siteId = null
//       }
//       form.siteIdArray = null
//     }
//   }
// )

onMounted(async () => {
  await loadSites()
  await loadDefaultSites()
  request.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    uiControl.userTypeSelect = true
    uiControl.siteSelectVisible = false
    uiControl.rolesSelect = false
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    // request.siteId = site.value.id
  }

  const defaultSiteIds = store.state.user.sites.map(site => site.id)
  if (LOGIN_USER_TYPE.value !== TENANT.value) {
    request.defaultSiteIds = `0,${defaultSiteIds.join(',')}`
  } else {
    request.defaultSiteIds = defaultSiteIds.join(',')
  }

  await loadRoles(request.defaultSiteIds)
  await loadUser()
  await loadNetPhone()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
