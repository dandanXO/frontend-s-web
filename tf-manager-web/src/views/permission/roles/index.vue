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
      width="800px"
    >
      <el-tabs
        v-model="createType"
        type="card"
        @tab-change="handleTabChange"
        v-if="uiControl.dialogType === 'CREATE'"
      >
        <!-- Normal Create Tab -->
        <el-tab-pane :label="t('fields.normalCreate')" name="normal">
          <div v-if="uiControl.dialogType === 'CREATE'">
            <el-steps
              class="steps"
              :space="200"
              :active="active"
              finish-status="success"
              align-center
            >
              <el-step :title="t('fields.roleDetails')" />
              <el-step
                v-if="hasPermission(['sys:roles:update:permission'])"
                :title="t('fields.permissionAssignment')"
              />
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
                <el-button
                  v-if="hasPermission(['sys:roles:update:permission'])"
                  type="primary"
                  @click="next"
                >
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
                      <span
                        v-if="data.remark"
                        class="tree-node"
                        >{{ data.remark }}</span
                      >
                    </div>
                  </template>
                </el-tree>
              </el-card>
              <div class="dialog-footer">
                <el-button @click="active = 0">
                  {{ t('fields.back') }}
                </el-button>
                <el-button
                  type="primary"
                  @click="submit"
                  :loading="uiControl.createLoading"
                >
                  {{ t('fields.confirm') }}
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="t('fields.import')" name="import-json">
          <el-steps
            class="steps"
            :space="200"
            :active="jsonImportControl.activeStep"
            finish-status="success"
            align-center
          >
            <el-step :title="t('fields.import')" />
            <el-step :title="t('fields.permissionAssignment')" />
          </el-steps>

          <!-- Step 1: Upload File -->
          <div v-if="jsonImportControl.activeStep === 0">
            <el-upload
              ref="jsonUpload"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleJSONUpload"
              accept=".json"
              style="text-align: center; margin-top: 20px"
            >
              <el-button type="primary">
                {{ t('fields.upload') }}
              </el-button>
            </el-upload>
          </div>

          <!-- Step 2: Permission Assignment -->
          <div v-if="jsonImportControl.activeStep === 1">
            <el-card style="margin-top: 20px">
              <el-tree
                ref="jsonImportTree"
                show-checkbox
                accordion
                node-key="id"
                :data="menus.alllist"
                highlight-current
                :default-checked-keys="jsonImportControl.selectedMenuIds"
              >
                <template #default="{node, data}">
                  <div>
                    <span 
                      class="json-menu" 
                      :data-menu-id="data.id" 
                      :data-parent-id="data.parentId"
                      :class="getNodeClass(data)"
                    >
                      {{ data.name }}
                    </span>
                    <span
                      v-if="data.remark"
                      class="tree-node"
                    >{{ data.remark }}</span>
                  </div>
                </template>
              </el-tree>
            </el-card>
          </div>

          <div class="dialog-footer" style="margin-top: 20px">
            <el-button
              v-if="jsonImportControl.activeStep > 0"
              @click="jsonImportControl.activeStep--"
            >
              {{ t('fields.back') }}
            </el-button>
            <el-button
              v-if="jsonImportControl.activeStep === 1"
              type="primary"
              :disabled="!canJsonImportProceed"
              @click="submitJsonImport"
            >
              {{ t('fields.confirm') }}
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div v-else-if="uiControl.dialogType === 'EDIT'">
        <el-form
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
      </div>
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
          <el-button
            @click="uiControl.dialogVisible = false"
            :disabled="uiControl.copyLoading"
          >
            {{ t('fields.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="submit"
            :loading="uiControl.copyLoading"
          >
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <div
        v-else-if="uiControl.dialogType === 'PERMISSION'"
        v-loading="uiControl.treeLoading"
      >
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
              <span
                v-if="data.remark"
                class="tree-node"
                >{{ data.remark }}</span
              >
            </div>
          </template>
        </el-tree>
        <div class="dialog-footer">
          <el-button
            @click="uiControl.dialogVisible = false"
            :disabled="uiControl.permissionLoading"
          >
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
            width="200"
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
            width="180"
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
            width="180"
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
            width="550"
          >
            <template #default="scope">
              <el-button
                icon="el-icon-download"
                size="mini"
                type="info"
                @click="exportToJSON(scope.row)"
              >
              </el-button>
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
import { nextTick, onMounted, reactive, ref, computed, watch } from 'vue'
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
  permissionLoading: false,
  treeLoading: false,
  messageVisible: false
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
  alllist: []
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

    // 重置 createType 为 normal
    createType.value = 'normal'

    // 重置导入json菜单数据
    allMenus.value = []
    allMenusData.value = []
    userAccessibleMenus.value = []
    inaccessibleMenuIds.value = []
    jsonImportControl.dialogVisible = false
    jsonImportControl.activeStep = 0
    jsonImportControl.selectedMenuIds = []
    jsonImportControl.fileLoaded = false
    jsonImportControl.isImportMode = false

    // 2. 重置树型组件状态
    if (jsonImportTree.value) {
      jsonImportTree.value.setCheckedKeys([]) // 清空所有勾选
      jsonImportTree.value.store.nodesMap = {} // 清空节点数据
    }
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
  let requestSiteId = request.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    requestSiteId = store.state.user.siteId
  }
  const { data: children } = await fetchSimpleMenu(requestSiteId)
  menus.list = children
  menus.cloneList = [...menus.list]
}

async function selectRoles(roles) {
  uiControl.treeLoading = true
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
  uiControl.treeLoading = false
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

// 添加 tab 切换
const createType = ref('normal')

// 导出角色权限 - json 格式
const exportToJSON = (row) => {
  // 1. 获取需要导出的数据
  const dataToExport = {
    name: row.name,
    remark: row.remark,
    menuIds: row.menus,
  }
  // 2. 调用下载方法
  downloadJSON(dataToExport, `role-${row.name}-permissions.json`)
}

const downloadJSON = (data, filename = 'data.json') => {
  // 1. 将数据转换为 JSON 字符串
  const jsonString = JSON.stringify(data, null, 2) // 第二个参数为 null，第三个参数为缩进空格数

  // 2. 创建 Blob 对象
  const blob = new Blob([jsonString], { type: 'application/json' })

  // 3. 创建下载链接
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename

  // 4. 触发下载
  document.body.appendChild(a) // 将链接添加到 DOM 中
  a.click() // 模拟点击下载
  document.body.removeChild(a) // 下载完成后移除链接

  // 5. 释放 Blob URL
  URL.revokeObjectURL(url)
}

// 1. 定义状态存储菜单数据
const allMenus = ref([]) // 所有菜单
const allMenusData = ref([])
const userAccessibleMenus = ref([]) // 用户可访问的菜单
const inaccessibleMenuIds = ref([]) // 没有权限的菜单 ID 列表
const isMenuDataLoaded = ref(false) // 菜单数据是否已加载
const jsonImportControl = reactive({
  dialogVisible: false,
  activeStep: 0,
  selectedMenuIds: [],
  fileLoaded: false,
  isImportMode: false
})

// 在进入权限导入页面时调用
const handleTabChange = (tabName) => {
  if (tabName === 'import-json') {
    jsonImportControl.loadMenuData()
  }
}

const jsonImportTree = ref(null)

const canJsonImportProceed = computed(() => {
  switch (jsonImportControl.activeStep) {
    case 0: // 第一步：文件加载
      return jsonImportControl.fileLoaded
    case 1: // 第二步：Permission Assignment
      return (
        form.name &&
        form.siteId &&
        inaccessibleMenuIds.value.length === 0 // 确保没有权限错误
      )
    case 2: // 第三步：提交
      return true
    default:
      return false
  }
})

const handleJSONUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const jsonData = JSON.parse(event.target.result) // 解析 JSON 文件

      // 1. 验证 JSON 数据结构
      if (!jsonData.name || !jsonData.menuIds) {
        ElMessage.error(t('message.invalidJSONStructure'))
        return
      }

      // 2. 直接跳转到 Permission Assignment 步骤
      jsonImportControl.activeStep = 1 // Permission Assignment

      // 3. 调用 processJSONData 进行权限检查
      processJSONData(jsonData)
    } catch (error) {
      ElMessage.error(t('message.invalidJSONFile'))
    }
  }
  reader.readAsText(file.raw) // 读取文件内容
}

const processJSONData = (jsonData) => {
  // 1. 验证 JSON 数据结构
  if (!jsonData.name || !jsonData.menuIds) {
    ElMessage.error(t('message.invalidJSONStructure'))
    return
  }
  // 2. 更新表单数据
  form.name = jsonData.name
  form.remark = jsonData.remark !== null ? jsonData.remark : ""

  // 3. 比较菜单权限
  inaccessibleMenuIds.value = jsonData.menuIds.filter(menuId => {
    // 如果菜单不在用户可访问的菜单列表中，但存在于所有菜单列表中
    return (
      !userAccessibleMenus.value.some(menu => menu === menuId) &&
      allMenus.value.some(menu => menu === menuId)
    )
  })
  // 4. 如果有没权限的菜单，显示错误信息
  if (inaccessibleMenuIds.value.length > 0) {
    const inaccessibleMenuNames = mapMenuIdsToNames(inaccessibleMenuIds.value)
    ElMessage.error(`No Permission To Menu - ${inaccessibleMenuNames}`)
    // ElMessage.error(t('message.inaccessibleMenus', { menuIds: inaccessibleMenuIds.value.join(', ') }))
  }

  // 5. 手动处理 jsonImportTree.value 的数据
  nextTick(() => {
    if (jsonImportTree.value) {
      // // 清空所有已勾选的节点
      jsonImportTree.value.setCheckedKeys([])

      // 只勾选用户有权限的菜单
      const accessibleMenuIds = jsonData.menuIds.filter(menuId =>
        userAccessibleMenus.value.includes(menuId)
      )

      // 遍历所有节点，处理父节点和子节点的勾选逻辑
      const nodes = jsonImportTree.value.store.nodesMap
      for (const node of Object.values(nodes)) {
        if (node.children && node.children.length > 0) {
          // 父节点：检查子节点的勾选情况
          const checkedChildren = node.children.filter(child =>
            accessibleMenuIds.includes(child.data.id))
          if (checkedChildren.length === 1) {
            // 如果只有一个子节点被勾选，则只勾选该子节点
            jsonImportTree.value.setChecked(checkedChildren[0].data.id, true)
          } else if (checkedChildren.length > 1) {
            // 如果有多个子节点被勾选，则勾选父节点
            jsonImportTree.value.setChecked(node.data.id, true)
          }
        } else {
          // 叶子节点：直接勾选
          if (accessibleMenuIds.includes(node.data.id)) {
            jsonImportTree.value.setChecked(node.data.id, true)
          }
        }
      }

      // 将选中的菜单 ID 存储到 form.menuIds
      const checkedKeys = jsonImportTree.value.getCheckedKeys()
      form.menuIds = checkedKeys.join(',')
    }
  })

  // 6. 直接跳转到 Permission Assignment 步骤
  jsonImportControl.activeStep = 1
}

// 动态设置节点样式
const getNodeClass = (node) => {
  // 检查当前节点是否无权限
  if (inaccessibleMenuIds.value.includes(node.id)) {
    return 'inaccessible-node'
  }
  // 递归检查子节点
  if (node.children && node.children.length > 0) {
    const hasInaccessibleChild = node.children.some(child =>
      inaccessibleMenuIds.value.includes(child.id))
    if (hasInaccessibleChild) {
      console.log("hasInaccessibleChild : ", hasInaccessibleChild)
      return 'has-inaccessible-child'
    }
  }

  return ''
}

async function submitJsonImport() {
  try {
    jsonImportControl.loading = true

    // 1. 获取选中的节点（包括半选中的父节点）
    const checkedNodes = jsonImportTree.value.getCheckedNodes(false, true)
    const checkedKeys = checkedNodes.map(node => node.id)

    // 2. 检查是否有无权限的菜单
    const inaccessibleMenuIds = checkedKeys.filter(menuId => {
      return (
        !userAccessibleMenus.value.includes(menuId) &&
        allMenus.value.includes(menuId))
    })

    // 3. 如果有无权限的菜单，显示错误信息并阻止提交
    if (inaccessibleMenuIds.length > 0) {
      // 更新 inaccessibleMenuIds，以便 getNodeClass 能够正确应用样式
      inaccessibleMenuIds.value = inaccessibleMenuIds

      // 显示错误信息
      const inaccessibleMenuNames = mapMenuIdsToNames(inaccessibleMenuIds)
      ElMessage.error(`No Permission To Menu - ${inaccessibleMenuNames}`)

      const inaccessibleMenuIdsSet = new Set(inaccessibleMenuIds)

      // 找到所有带有 json-menu 类的元素
      const jsonMenuElements = document.querySelectorAll('.json-menu')
      jsonMenuElements.forEach(element => {
        const menuId = parseInt(element.dataset.menuId) // 获取当前元素的菜单 ID

        // 检查当前菜单是否无权限
        if (inaccessibleMenuIdsSet.has(menuId)) {
          element.classList.add('inaccessible-node') // 添加 inaccessible-node 类
        }

        // 检查子树型数据是否有无权限的菜单
        const hasInaccessibleChild = Array.from(jsonMenuElements).some(childElement => {
          return (
            childElement.dataset.parentId === menuId.toString() && // 是当前母树型数据的子树
      inaccessibleMenuIdsSet.has(parseInt(childElement.dataset.menuId)) // 子树无权限
          )
        })

        // 如果子树型数据有无权限的菜单，为母树型数据添加 has-inaccessible-node 类
        if (hasInaccessibleChild) {
          element.classList.add('has-inaccessible-child')
        }
      })

      return
    }
    // 4. 构建提交数据
    const roleData = {
      ...form,
      menuIds: checkedKeys.join(',')
    }

    // 5. 调用 API 提交数据
    await createRoleWithPermission(roleData)

    // 5. 处理成功响应
    ElMessage.success(t('message.importSuccess'))
    uiControl.dialogVisible = false
    jsonImportControl.dialogVisible = false
    await loadData() // 重新加载数据
  } catch (error) {
    console.error('提交数据失败:', error)
    ElMessage.error(t('message.importFailed'))
  } finally {
    uiControl.loading = false
    jsonImportControl.loading = false
  }
}

// 监听 createType 的变化
watch(createType, (newTabName) => {
  if (newTabName === 'import-json') {
    // 切换到 import-json 标签页时，加载菜单数据
    loadMenuDataForImport()
  }
})

// 假设 allMenuData 是一个包含所有菜单数据的数组，结构为 [{ id: 1, name: '菜单1' }, ...]
const mapMenuIdsToNames = (menuIds) => {
  return menuIds
    .map(menuId => {
      // 递归查找菜单名称
      const findMenuName = (menus, targetId) => {
        for (const menu of menus) {
          if (menu.id === targetId) {
            return menu.name
          }
          if (menu.children && menu.children.length > 0) {
            const found = findMenuName(menu.children, targetId)
            if (found) {
              return found
            }
          }
        }
        return null
      }

      // 查找菜单名称
      const menuName = findMenuName(allMenusData.value, menuId)
      return menuName || `未知菜单 (ID: ${menuId})`
    })
    .join(', ')
}

// 加载菜单数据的方法
const loadMenuDataForImport = async () => {
  try {
    const getAllMenuIds = []
    const getUserMenuIds = []

    // 获取所有菜单
    const { data: allMenuData } = await fetchSimpleMenu()
    menus.alllist = allMenuData

    // 递归收集所有菜单的 ID
    const collectMenuIds = (menus) => {
      menus.forEach(menu => {
        getAllMenuIds.push(menu.id) // 收集当前菜单的 ID
        if (menu.children && menu.children.length > 0) {
          collectMenuIds(menu.children) // 递归收集子菜单的 ID
        }
      })
    }

    // 调用递归函数，收集所有菜单的 ID
    if (allMenuData && allMenuData.length > 0) {
      collectMenuIds(allMenuData)
    }
    allMenus.value = getAllMenuIds
    allMenusData.value = allMenuData

    // 获取用户可访问的菜单
    const siteId = store.state.user.siteId // 当前用户的 siteId
    const { data: userMenuData } = await fetchSimpleMenu(siteId)
    // userAccessibleMenus.value = userMenuData

    // 递归收集所有菜单的 ID
    const collectUserMenuIds = (menus) => {
      menus.forEach(menu => {
        getUserMenuIds.push(menu.id) // 收集当前菜单的 ID
        if (menu.children && menu.children.length > 0) {
          collectUserMenuIds(menu.children) // 递归收集子菜单的 ID
        }
      })
    }

    // 调用递归函数，收集所有菜单的 ID
    if (userMenuData && userMenuData.length > 0) {
      collectUserMenuIds(userMenuData)
    }
    userAccessibleMenus.value = getUserMenuIds

    // 标记菜单数据已加载
    isMenuDataLoaded.value = true
  } catch (error) {
    ElMessage.error(t('message.fetchMenuDataError'))
  }
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
    width: 100%;

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
  right: 50px;
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

:deep(.inaccessible-node) {
  border: 1px solid red !important;
  padding: 2px !important;
  border-radius: 4px !important;
  background-color: #ffebee !important; // 浅红色背景
  color: #d32f2f !important; // 红色文字
}

:deep(.has-inaccessible-child) {
  border: 1px solid red !important;
  padding: 2px !important;
  border-radius: 4px !important;
  background-color: #ffebee !important; // 浅红色背景
  color: #d32f2f !important; // 红色文字
}
</style>
