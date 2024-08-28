<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="changeSiteSearch"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-if="uiControl.showSiteTypeSearch"
          v-model="request.siteType"
          size="small"
          class="filter-item"
          :placeholder="t('fields.siteType')"
          style="width: 120px;margin-left:5px"
        >
          <el-option
            v-for="item in siteType.list"
            :key="item.value"
            :label="t('siteType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('common.status.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadPromoType"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group" v-if="!hasRole(['SUB_TENANT'])">
        <el-button icon="el-icon-plus" size="mini" type="primary" v-permission="['sys:promo-type:add']" @click="showDialog('CREATE')">{{ t('fields.add') }}</el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:promo-type:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >{{ t('fields.edit') }}</el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:promo-type:del']"
          @click="removePromoType()"
          :disabled="uiControl.removeBtn"
        >{{ t('fields.delete') }}</el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="promoTypeForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @change="changeSite"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.siteType')" prop="siteType" v-if="uiControl.showSiteType">
          <el-select
            v-model="form.siteType"
            size="small"
            class="filter-item"
            :placeholder="t('fields.siteType')"
            style="width: 350px"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in siteType.list"
              :key="item.value"
              :label="t('siteType.' + item.displayName)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.name')" prop="name">
          <el-input v-model="form.name" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.value')" prop="value">
          <el-input v-model="form.value" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="uiControl.showSiteTypeColumn" prop="siteType" :label="t('fields.siteType')" width="200">
        <template #default="scope">
          {{ t('siteType.' + scope.row.siteType) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="t('fields.name')" width="200" />
      <el-table-column prop="value" :label="t('fields.value')" width="200" />
      <el-table-column prop="status" :label="t('fields.state')" width="200">
        <template #default="scope">
          <el-switch
            v-if="hasPermission(['sys:promo-type:update:state'])"
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changestatus(scope.row.id, scope.row.status)"
          />
          <el-switch
            v-else
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{data: scope.row.createTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column :label="t('fields.operate')" align="right" v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:promo-type:update'])|| hasPermission(['sys:promo-type:del']))">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:promo-type:update']" @click="showEdit(scope.row)" />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:promo-type:del']"
            @click="removePromoType(scope.row)"
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
  </div>
</template>

<script setup>

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { createPromoType, updatePromoType, getPromoType, updatestatus, deletePromoType } from "@/api/promo-type";
import { getSiteListSimple } from "@/api/site";
import { hasRole, hasPermission } from "@/utils/util";
import { useI18n } from "vue-i18n";
import { useStore } from '@/store';
import { isVnm } from '@/utils/site'
import { TENANT } from "@/store/modules/user/action-types";

const store = useStore();
const { t } = useI18n();
const promoTypeForm = ref(null);
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const siteList = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  status: [
    { key: 1, displayName: "OPEN", value: true },
    { key: 2, displayName: "CLOSE", value: false }
  ],
  showSiteType: false,
  showSiteTypeSearch: false,
  showSiteTypeColumn: false
});

const siteType = reactive({
  list: [
    { displayName: 'main', value: 'main' },
    { displayName: 'slot', value: 'slot' },
  ],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 30,
  current: 1,
  status: null,
  siteType: null,
  siteId: null,
});

const form = reactive({
  id: null,
  siteId: null,
  siteType: null,
  name: null,
  value: null
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  name: [required(t('message.validateNameRequired'))],
  value: [required(t('message.validateValueRequired'))]
});

let choosePromoType = [];

function resetQuery() {
  request.status = null;
  request.siteId = site.value ? site.value.id : siteList.list[0].id;
  request.siteType = 'main'
  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
  } else {
    uiControl.showSiteTypeSearch = false;
  }
}

async function changeSiteSearch() {
  request.siteType = 'main'
  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
  } else {
    uiControl.showSiteTypeSearch = false;
  }
}

async function changeSite() {
  form.siteType = 'main'
  if (isVnm(form.siteId)) {
    uiControl.showSiteType = true;
  } else {
    uiControl.showSiteType = false;
  }
}

function handleSelectionChange(val) {
  choosePromoType = val;
  if (choosePromoType.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (choosePromoType.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

async function loadPromoType() {
  page.loading = true;
  const { data: ret } = await getPromoType(request);
  page.pages = ret.pages;
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.records = ret.records;
  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeColumn = true
  } else {
    uiControl.showSiteTypeColumn = false
  }
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadPromoType();
}

function showDialog(type) {
  if (type === "CREATE") {
    if (promoTypeForm.value) {
      promoTypeForm.value.resetFields();
    }
    form.id = null;
    form.siteId = request.siteId;
    form.siteType = request.siteType
    if (isVnm(form.siteId)) {
      uiControl.showSiteType = true;
    } else {
      uiControl.showSiteType = false;
    }
    uiControl.dialogTitle = t('fields.addPromoType');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editPromoType');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(promoType) {
  showDialog("EDIT");
  if (!promoType) {
    promoType = choosePromoType[0];
  }
  nextTick(() => {
    for (const key in promoType) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = promoType[key];
      }
    }
    if (isVnm(form.siteId)) {
      uiControl.showSiteType = true;
    } else {
      uiControl.showSiteType = false;
    }
  });
}

/**
 * 新增公告类型
 */
function create() {
  promoTypeForm.value.validate(async (valid) => {
    if (valid) {
      await createPromoType(form);
      uiControl.dialogVisible = false;
      await loadPromoType();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

/**
 * 编辑公告类型
 */
function edit() {
  promoTypeForm.value.validate(async (valid) => {
    if (valid) {
      await updatePromoType(form.id, form);
      uiControl.dialogVisible = false;
      await loadPromoType();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function changestatus(id, state) {
  await updatestatus(id, state);
}

async function removePromoType(promoType) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (promoType) {
      await deletePromoType([promoType.id]);
    } else {
      await deletePromoType(choosePromoType.map(a => a.id));
    }
    await loadPromoType();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  } else if (uiControl.dialogType === "EDIT") {
    edit();
  }
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = siteList.list[0].id
  }

  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
    request.siteType = 'main'
  } else {
    uiControl.showSiteTypeSearch = false;
  }

  await loadPromoType();
});

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
