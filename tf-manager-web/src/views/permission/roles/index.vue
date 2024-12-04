<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.roleName')"
        />
        <el-select
          v-if="uiControl.siteVisible"
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          default-first-option
          @focus="loadSites"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadData()"
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
          v-permission="['sys:roles:create']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:roles:update']"
          @click="showEdit"
          :disabled="uiControl.editBtn"
        >
          {{ t('fields.edit') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:roles:delete']"
          @click="removeBatchRole"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      v-if="uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'"
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="600px"
    >
      <div v-if="uiControl.dialogType === 'CREATE'">
        <el-steps
          class="steps"
          :space="200"
          :active="active"
          finish-status="success"
          align-center
        >
          <el-step :title="t('fields.roleDetails')" />
          <el-step v-if="hasPermission(['sys:roles:update:permission'])" :title="t('fields.permissionAssignment')" />
        </el-steps>
        <el-form
          v-if="active === 0"
          ref="rolesForm"
          :model="form"
          :rules="formRules"
          :inline="true"
          size="small"
          label-width="100px"
        >
          <el-form-item :label="t('fields.roleName')" prop="name">
            <el-input v-model="form.name" style="width: 450px" />
          </el-form-item>
          <el-form-item
            v-if="uiControl.siteVisible"
            :label="t('fields.site')"
            prop="siteId"
          >
            <el-select
              v-model="form.siteId"
              size="small"
              :placeholder="t('fields.site')"
              class="filter-item"
              style="width: 450px"
              default-first-option
              @focus="loadSites"
            >
              <el-option
                v-for="item in siteList.list"
                :key="item.id"
                :label="item.siteName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('fields.describe')" prop="remark">
            <el-input
              type="textarea"
              :rows="5"
              v-model="form.remark"
              style="width: 450px"
              :placeholder="t('fields.describe')"
            />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="uiControl.dialogVisible = false">
              {{ t('fields.cancel') }}
            </el-button>
            <el-button v-if="hasPermission(['sys:roles:update:permission'])" type="primary" @click="next">
              {{ t('fields.nextStep') }}
            </el-button>
            <el-button v-else type="primary" @click="submit">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
        <div v-else-if="active === 1">
          <el-card style="margin-top: 20px; margin-bottom: 20px">
            <el-tree
              ref="tree"
              show-checkbox
              accordion
              node-key="id"
              :data="menus.list"
              highlight-current
              :filter-node-method="filterNode"
            >
              <!-- eslint-disable -->
              <template #default="{node, data}">
                <div>
                  <span>{{ data.name }}</span>
                  <span v-if="data.remark" class="tree-node">{{ data.remark }}</span>
                </div>
              </template>
            </el-tree>
          </el-card>
          <div class="dialog-footer">
            <el-button @click="active = 0">
              {{ t('fields.back') }}
            </el-button>
            <el-button type="primary" @click="submit" :loading="uiControl.createLoading">
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </div>
      </div>
      <el-form
        v-else-if="uiControl.dialogType === 'EDIT'"
        ref="rolesForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="100px"
      >
        <el-form-item :label="t('fields.roleName')" prop="name">
          <el-input v-model="form.name" style="width: 450px" />
        </el-form-item>
        <el-form-item
          v-if="uiControl.siteVisible"
          :label="t('fields.site')"
          prop="siteId"
        >
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 450px"
            default-first-option
            @focus="loadSites"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.describe')" prop="remark">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.remark"
            style="width: 450px"
            :placeholder="t('fields.describe')"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submit">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      v-else-if="uiControl.dialogType === 'PERMISSION' || uiControl.dialogType === 'COPY'"
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        v-if="uiControl.dialogType === 'COPY'"
        ref="rolesForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="100px"
      >
        <el-form-item :label="t('fields.roleToCopy')" prop="roleToCopy">
          <span style="width: 450px">{{ roleToCopy.name }}</span>
        </el-form-item>
        <el-form-item :label="t('fields.roleName')" prop="name">
          <el-input v-model="form.name" style="width: 450px" />
        </el-form-item>
        <el-form-item
          v-if="uiControl.siteVisible"
          :label="t('fields.site')"
          prop="siteId"
        >
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 450px"
            default-first-option
            disabled
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.describe')" prop="remark">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.remark"
            style="width: 450px"
            :placeholder="t('fields.describe')"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false" :disabled=uiControl.copyLoading>
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submit" :loading="uiControl.copyLoading">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <div v-else-if="uiControl.dialogType === 'PERMISSION'">
        <el-tree
          ref="tree"
          show-checkbox
          accordion
          node-key="id"
          :data="menus.list"
          highlight-current
          :filter-node-method="filterNode"
        >
          <!-- eslint-disable -->
          <template #default="{node, data}">
            <div>
              <span>{{ data.name }}</span>
              <span v-if="data.remark" class="tree-node">{{ data.remark }}</span>
            </div>
          </template>
        </el-tree>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false" :disabled=uiControl.permissionLoading>
            {{ t('fields.cancel') }}
          </el-button>
          <el-button
            type="primary"
            v-permission="['sys:roles:update:permission']"
            :loading="uiControl.permissionLoading"
            @click="updatePermission"
          >
            {{ t('fields.assignment') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <div class="body-container">
      <el-card class="roles" shadow="never">
        <template #header>
          <div class="card-header">
            <span>{{ t('fields.roleList') }}</span>
          </div>
        </template>
        <el-table
          :data="page.records"
          ref="rolesTable"
          row-key="id"
          size="small"
          highlight-current-row
          @selection-change="handleSelectionChange"
          :empty-text="t('fields.noData')"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            prop="name"
            :label="t('fields.roleName')"
            width="200"
          />
          <el-table-column
            prop="siteName"
            :label="t('fields.siteName')"
            width="120"
          />
          <el-table-column
            prop="remark"
            :label="t('fields.describe')"
            width="200"
          />
          <el-table-column
            prop="createTime"
            :label="t('fields.createTime')"
            width="180"
          >
            <template #default="scope">
              <span v-if="scope.row.createTime === null">-</span>
              <span
                v-if="scope.row.createTime !== null"
                v-formatter="{
                  data: scope.row.createTime,
                  timeZone: scope.row.timeZone,
                  type: 'date',
                }"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="createBy"
            :label="t('fields.createBy')"
            width="120"
          />
          <el-table-column
            prop="updateTime"
            :label="t('fields.updateTime')"
            width="180"
          >
            <template #default="scope">
              <span v-if="scope.row.updateTime === null">-</span>
              <span
                v-if="scope.row.updateTime !== null"
                v-formatter="{
                  data: scope.row.updateTime,
                  timeZone: scope.row.timeZone,
                  type: 'date',
                }"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="updateBy"
            :label="t('fields.updateBy')"
            width="120"
          />
          <el-table-column
            :label="t('fields.operate')"
            align="right"
            fixed="right"
            v-if="
              hasPermission(['sys:roles:copy']) ||
                hasPermission(['sys:roles:update']) ||
                hasPermission(['sys:roles:update:permission']) ||
                hasPermission(['sys:roles:delete'])
            "
            width="300"
          >
            <template #default="scope">
              <el-button
                icon="el-icon-copy-document"
                size="mini"
                type="primary"
                v-permission="['sys:roles:copy']"
                @click="showCopyDialog(scope.row)"
              />
              <el-button
                icon="el-icon-edit"
                size="mini"
                type="success"
                v-permission="['sys:roles:update']"
                @click="showEdit(scope.row)"
              />
              <el-button
                v-if="hasPermission(['sys:roles:update:permission'])"
                size="mini"
                type="warning"
                v-permission="['sys:roles:update:permission']"
                @click="showPermission(scope.row)"
              >{{ t('fields.permissionAssignment') }}
              </el-button>
              <el-button
                v-else
                size="mini"
                type="warning"
                @click="showPermission(scope.row)"
              >{{ t('fields.viewPermission') }}
              </el-button>
              <el-button
                icon="el-icon-remove"
                size="mini"
                type="danger"
                v-permission="['sys:roles:delete']"
                @click="remove(scope.row)"
              />
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
      </el-card>
      <!-- <el-card class="menu" shadow="never">
        <template #header>
          <div class="card-header">
            <span>{{ t('fields.permissionAssignment') }}</span>
            <el-button
              size="mini"
              :disabled="uiControl.updatePermissionBtn"
              type="primary"
              v-permission="['sys:roles:update:permission']"
              @click="updatePermission"
            >
              {{ t('fields.assignment') }}
            </el-button>
          </div>
        </template>
        <el-tree
          ref="tree"
          show-checkbox
          accordion
          node-key="id"
          :data="menus.list"
          :props="{
            id: 'id',
            label: 'name',
            children: 'children',
          }"
          highlight-current
          :filter-node-method="filterNode"
        />
      </el-card> -->
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import { required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  // createRole,
  createRoleWithPermission,
  copyRole,
  delBatchRoles,
  delRoles,
  getRoles,
  updateRole,
  updateRolePermission,
} from '../../../api/roles'
import { fetchSimpleMenu } from '../../../api/menus'
import { getSiteListSimple } from '../../../api/site'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { ADMIN, TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const active = ref(0)
const uiControl = reactive({
  dialogVisible: false,
  siteVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  updatePermissionBtn: true,
  editBtn: true,
  removeBtn: true,
  createLoading: false,
  copyLoading: false,
  permissionLoading: false
})
const roleToCopy = reactive({
  id: null,
  name: null
})

const siteList = reactive({ list: [] })
// const siteId = computed(() => store.state.user.siteId)
const rolesForm = ref(null)
const tree = ref(null)
const rolesTable = ref()
let selectRolesId = 0
let rolesID = []
const formRules = reactive({
  name: [required(t('message.validateRoleNameRequired'))],
})

const form = reactive({
  id: null,
  name: null,
  siteId: null,
  remark: null,
})

const page = reactive({
  pages: 0,
  records: [],
})

const request = reactive({
  size: 30,
  current: 1,
  name: null,
  siteId: null,
})

const menus = reactive({
  list: [],
  cloneList: [],
})

function showDialog(type) {
  uiControl.createLoading = false;
  uiControl.copyLoading = false;
  uiControl.permissionLoading = false;
  if (type === 'CREATE' || type === 'COPY') {
    active.value = 0;
    if (rolesForm.value) {
      rolesForm.value.resetFields()
    }
    form.id = null;
    form.name = null
    form.remark = null
    form.idToCopy = null
    uiControl.dialogTitle = t('fields.addRole')
  } else if (type === 'PERMISSION') {
    if (hasPermission(['sys:roles:update:permission'])) {
      uiControl.dialogTitle = t('fields.permissionAssignment')
    } else {
      uiControl.dialogTitle = t('fields.viewPermission')
    }
  } else {
    uiControl.dialogTitle = t('fields.editRole')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function loadData() {
  rolesTable.value.clearSelection();
  selectRolesId = 0;
  rolesID = [];
  const { data: ret } = await getRoles(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.siteName === data.siteName) !==
      undefined
        ? store.state.user.sites.find(e => e.siteName === data.siteName)
          .timeZone
        : null
  })
  page.records = ret.records
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  if (LOGIN_USER_TYPE.value === ADMIN.value) {
    site.splice(0, 0, { id: 0, siteName: 'System' })
  }
  siteList.list = site
}

function resetQuery() {
  request.name = null
  request.siteId = site.value ? site.value.id : null
}

/**
 * 新增校色
 */
async function create() {
  uiControl.createLoading = true;
  if (tree.value) {
    form.menuIds = tree.value.getCheckedNodes(false, true).map(c => c.id).join(",");
  }
  await createRoleWithPermission(form)
  uiControl.dialogVisible = false
  uiControl.createLoading = false;
  await loadData()
  ElMessage({ message: t('message.addSuccess'), type: 'success' })
}

function showEdit(roles) {
  showDialog('EDIT')
  if (!roles) {
    roles = rolesID[0]
  }
  nextTick(() => {
    for (const key in roles) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = roles[key]
      }
    }
  })
  form.siteId = siteList.list.find(s => s.siteName === roles.siteName).id
}

/**
 * 编辑角色
 */
function edit() {
  rolesForm.value.validate(async valid => {
    if (valid) {
      await updateRole(form)
      uiControl.dialogVisible = false
      await loadData()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

/**
 * 删除校色
 * @param roles
 */
function remove(roles) {
  ElMessageBox.confirm(t('fields.deleteRole'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await delRoles(roles.id)
    await loadData()
    uiControl.updatePermissionBtn = true
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

function changePage(page) {
  request.current = page
  loadData()
}

function handleSelectionChange(val) {
  rolesID = val
  if (rolesID.length === 0) {
    uiControl.editBtn = true
    uiControl.removeBtn = true
  } else if (rolesID.length === 1) {
    uiControl.editBtn = false
    uiControl.removeBtn = false
  } else {
    uiControl.editBtn = true
    uiControl.removeBtn = false
  }
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'COPY') {
    createAndCopyRole()
  } else {
    edit()
  }
}

async function loadTreeMenu() {
  let requestSiteId = 0
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    requestSiteId = store.state.user.siteId
  }
  const { data: children } = await fetchSimpleMenu(requestSiteId)
  menus.list = children
  menus.cloneList = [...menus.list]
}

async function selectRoles(roles) {
  selectRolesId = roles.id
  const site = siteList.list.find(e => e.siteName === roles.siteName)
  let siteMenu;
  if (site) {
    const { data: children } = await fetchSimpleMenu(site.id)
    siteMenu = children
  } else {
    const { data: children } = await fetchSimpleMenu(0)
    siteMenu = children
  }
  tree.value.setCheckedKeys([], false)

  for (let i = 0; i < menus.cloneList.length; i++) {
    tree.value.remove(menus.cloneList[i])
  }

  for (let i = 0; i < siteMenu.length; i++) {
    tree.value.append(siteMenu[i])
  }

  roles.menus.forEach(e => {
    const node = tree.value.getNode(e)
    if (node && node.isLeaf) {
      tree.value.setChecked(e, true)
    }
  })
}

async function updatePermission() {
  uiControl.permissionLoading = true
  if (!selectRolesId) {
    ElMessage({ message: t('message.roleMustOnlyOne'), type: 'error' })
    return;
  }
  const selectedMenus = tree.value.getCheckedNodes(false, true).map(c => c.id)
  await updateRolePermission({ id: selectRolesId, menuIds: selectedMenus })
  uiControl.dialogVisible = false
  uiControl.permissionLoading = false
  await loadData()
  ElMessage({ message: t('message.updateSuccess'), type: 'success' })
}

function filterNode(value, data) {
  if (!value) return true
  return !value.includes(data.id)
}

async function removeBatchRole() {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await delBatchRoles(rolesID.map(r => r.id))
    await loadData()
    uiControl.updatePermissionBtn = true
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

// function menuChange(menu, checked, half) {
//   if (checked) {
//     const pid = menu.parentId;
//     if (pid) {
//       tree.value.setChecked(pid, checked, true)
//     }
//     if (menu.children) {
//       menu.children.map(c => c.id).forEach(id => tree.value.setChecked(id, checked, true));
//     }
//   } else {
//     menu.children.map(c => c.id).forEach(id => tree.value.setChecked(id, checked, true));
//   }
// }

// function setChildren(menu, checked) {
//
//
//
// }

/**
 * 新增角色并复制所选择角色的权限
 */
function showCopyDialog(roles) {
  showDialog('COPY')
  roleToCopy.id = roles.id
  roleToCopy.name = roles.name
  form.siteId = roles.siteId
}

function createAndCopyRole() {
  rolesForm.value.validate(async valid => {
    if (valid) {
      uiControl.copyLoading = true;
      form.idToCopy = roleToCopy.id
      await copyRole(form)
      uiControl.dialogVisible = false
      uiControl.copyLoading = false;
      await loadData()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

async function showPermission(roles) {
  showDialog('PERMISSION')
  await selectRoles(roles)
}

function next() {
  rolesForm.value.validate(async valid => {
    if (valid) {
      active.value = 1;
    }
  })
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    request.siteId = store.state.user.siteId
  } else {
    request.siteId = LOGIN_USER_TYPE.value === ADMIN.value ? siteList.list[1].id : siteList.list[0].id
    uiControl.siteVisible = true
  }
  form.siteId = request.siteId
  await loadData()
  await loadTreeMenu()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.btn-group {
  margin-top: 15px;
}

.body-container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;

  .roles {
    // width: 75%;

    .pagination {
      margin-top: 10px;
    }
  }

  .menu {
    width: 24%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.steps {
  margin-top: 20px;
  margin-bottom: 20px;
  justify-content: center;
}

.tree-node {
  position: absolute;
  right: 50px
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-card__header {
  padding-bottom: 13px;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
