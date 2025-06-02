<template>
  <div class="roles-main">
    <div class="header-container" v-if="hasRole(['TENANT','ADMIN'])">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px;"
          @focus="loadSites"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadVip">
          {{ t('fields.search') }}
        </el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button> -->
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" v-permission="['sys:site:vip:add']" @click="showDialog('CREATE')">{{ t('fields.add') }}</el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        ref="vipForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="170px"
      >
        <el-form-item :label="t('fields.name')" prop="name">
          <el-input v-model="form.name" style="width: 350px;" maxlength="20" />
        </el-form-item>
        <el-form-item :label="t('fields.level')" prop="level">
          <el-input-number
            type="number"
            v-model.number="form.level"
            :min="0"
            :controls="false"
            style="width: 350px;"
          />
        </el-form-item>

        <el-form-item :label="t('fields.category')" prop="category" v-if="form.siteId === 6 || form.siteId === 7">
          <el-select
            v-model="form.category"
            size="small"
            :placeholder="t('fields.category')"
            class="filter-item"
            style="width: 350px;"
            clearable
          >
            <el-option
              v-for="item in uiControl.category"
              :key="item.id"
              :label="t(`vipCategory.${item.value}`)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('fields.levelUpCredit')" prop="levelUpCredit">
          <el-input-number
            type="number"
            v-model.number="form.levelUpCredit"
            :min="0"
            :max="99999999999"
            :controls="false"
            style="width: 350px;"
          />
        </el-form-item>

        <el-form-item :label="t('fields.levelUpBet')" prop="levelUpBet">
          <el-input-number
            type="number"
            v-model.number="form.levelUpBet"
            :min="0"
            :max="99999999999"
            :controls="false"
            style="width: 350px;"
          />
        </el-form-item>

        <el-form-item :label="t('fields.retainLevelBet')" prop="retainLevelBet">
          <el-input-number
            type="number"
            v-model.number="form.retainLevelBet"
            :min="0"
            :max="99999999999"
            :controls="false"
            style="width: 350px;"
          />
        </el-form-item>

        <el-form-item :label="t('fields.retainLevelDays')" prop="retainLevelDays">
          <el-input-number
            type="number"
            v-model.number="form.retainLevelDays"
            :min="0"
            :max="99999999999"
            :controls="false"
            style="width: 350px;"
          />
        </el-form-item>

        <el-form-item :label="t('fields.previousLevel')" prop="previousLevel">
          <el-select
            v-model="form.previousLevel"
            size="small"
            :placeholder="t('fields.previousLevel')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            clearable
            @change="handleChangeLevel()"
            @clear="handleClearPreviousLevel()"
          >
            <el-option
              v-for="item in list.previousLevel"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId" v-if="!hasRole(['TENANT'])">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadSites"
            @change="handlePreviousLevelFilter()"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.exclusiveUrlWeb')" prop="web">
          <el-input v-model="form.web" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.exclusiveUrlWap')" prop="wap">
          <el-input v-model="form.wap" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.exclusiveUrlApp')" prop="app" style="display:none">
          <el-input v-model="form.app" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.exclusiveUrlCashier')" prop="cashier" style="display:none">
          <el-input v-model="form.cashier" style="width: 350px" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.levelUpReferFriendCount')" prop="retainLevelDays">
          <el-input-number
            type="number"
            v-model.number="form.levelUpReferFriendCount"
            :min="0"
            :max="99999999999"
            :controls="false"
            style="width: 350px;"
          />
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
      <el-table-column prop="id" :label="t('fields.id')" width="50" />
      <el-table-column prop="name" :label="t('fields.name')" width="100" />
      <el-table-column prop="level" :label="t('fields.level')" width="100" />
      <el-table-column prop="levelUpCredit" :label="t('fields.levelUpCredit')" width="160" />
      <el-table-column prop="levelUpBet" :label="t('fields.levelUpBet')" width="160" />
      <el-table-column prop="retainLevelBet" :label="t('fields.retainLevelBet')" width="160" />
      <el-table-column prop="retainLevelDays" :label="t('fields.retainLevelDays')" width="100" />
      <el-table-column prop="levelUpReferFriendCount" :label="t('fields.levelUpReferFriendCount')" width="100" />
      <el-table-column prop="previousLevelName" :label="t('fields.previousLevelName')" width="100" />
      <el-table-column :label="t('fields.checkExclusiveUrl')" width="150">
        <template #default="scope">
          <el-link type="primary" @click="show(scope.row)"> {{ t('fields.view') }} </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="siteName"
        :label="t('fields.site')"
        width="150"
        v-if="!hasRole(['SUB_TENANT']) && !hasRole(['TENANT'])"
      />
      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{data: scope.row.createTime, timeZone: timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column :label="t('fields.action')" align="right" v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:site:vip:update']) || hasPermission(['sys:vip:del']))">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:site:vip:update']" @click="showEdit(scope.row)" />
          <el-button icon="el-icon-remove" size="mini" type="danger" v-permission="['sys:vip:del']" @click="removeVip(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="t('fields.exclusiveUrl')"
      v-model="uiControl.checkDialogVisible"
      append-to-body
      width="580px"
    >

      <p>{{ t('fields.exclusiveUrlWeb') }} : {{ form.web }}</p>
      <p>{{ t('fields.exclusiveUrlWap') }} : {{ form.wap }}</p>
      <p style="display:none">{{ t('fields.exclusiveUrlApp') }} : {{ form.app }}</p>
      <p style="display:none">{{ t('fields.exclusiveUrlCashier') }} : {{ form.cashier }}</p>
    </el-dialog>

  </div>
</template>

<script setup>

import { computed, nextTick, reactive, ref, watch } from "vue";
import { numericOnly, required } from "../../../utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { getSiteListSimple } from "../../../api/site";
import { createVip, deleteVip, getVips, updateVip } from "../../../api/vip";
import { hasRole, hasPermission } from "../../../utils/util";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const validateLevel = (rule, value, callback) => {
  if (value > 1 && form.previousLevel === null) {
    callback(new Error(t('message.selectPreviousLevel')));
  } else if (value === 0 && form.previousLevel !== null) {
    callback(new Error(t('message.removePreviousLevel')));
  } else {
    callback();
  }
};

const request = reactive({
  siteId: null
});

const vipForm = ref(null);
const sites = reactive({
  list: []
});
let timeZone = null;

const uiControl = reactive({
  dialogVisible: false,
  checkDialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  vipState: [
    { key: 1, displayName: "active", value: true },
    { key: 2, displayName: "disable", value: false }
  ],
  category: [
    { key: 1, value: "BRONZE" },
    { key: 2, value: "SILVER" },
    { key: 3, value: "GOLD" },
    { key: 4, value: "PLATINUM" },
    { key: 5, value: "DIAMOND" },
    { key: 6, value: "WANGZE" },
    { key: 7, value: "VIP1" },
    { key: 8, value: "VIP2" },
    { key: 9, value: "VIP3" },
    { key: 10, value: "VIP4" },
    { key: 11, value: "VIP5" },
    { key: 12, value: "VIP6" },
    { key: 13, value: "VIP7" },
    { key: 14, value: "VIP8" },
    { key: 15, value: "VIP9" },
    { key: 16, value: "VIP10" },
  ]
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const form = reactive({
  id: null,
  name: null,
  level: null,
  levelUpCredit: null,
  previousLevel: null,
  siteId: null,
  web: null,
  wap: null,
  app: null,
  cashier: null,
  levelUpBet: null,
  retainLevelBet: null,
  retainLevelDays: null,
  category: null,
  levelUpReferFriendCount: null,
});

const list = reactive({
  previousLevel: [],
});

const formRules = reactive({
  name: [required(t('message.validateNameRequired'))],
  level: [required(t('message.validateLevelRequired')), numericOnly(t('message.validateNumberOnly')), {
    validator: validateLevel,
    trigger: "blur"
  }],
  levelUpCredit: [required(t('message.validateLevelUpCreditRequired')), numericOnly(t('message.validateNumberOnly'))],
  siteId: [required(t('message.validateSiteRequired'))]
});

let chooseVip = [];

function handleSelectionChange(val) {
  chooseVip = val;
  if (chooseVip.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (chooseVip.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

function handleChangeLevel() {
  page.records.forEach(vip => {
    if (vip.id === form.previousLevel) {
      form.level = vip.level + 1;
      form.siteId = vip.siteId;
    }
  })
}

function handleClearPreviousLevel() {
  form.level = 0;
  form.previousLevel = null;
  list.previousLevel = page.records;
}

function handlePreviousLevelFilter() {
  if (!hasRole(['TENANT'])) {
    list.previousLevel = page.records;
    const newRecord = list.previousLevel.filter((element) => {
      return element.siteId === form.siteId
    });
    list.previousLevel = newRecord;
  }
}

function show(vip) {
  uiControl.checkDialogVisible = true;
  form.web = vip.web;
  form.wap = vip.wap;
  form.app = vip.app;
  form.cashier = vip.cashier;
}

async function loadVip() {
  page.loading = true;
  const { data: ret } = await getVips(request);
  page.records = ret;
  page.loading = false;

  timeZone = sites.list.find(e => e.id === request.siteId).timeZone;

  list.previousLevel = ret;
}

function showDialog(type) {
  if (vipForm.value) {
    vipForm.value.resetFields();
  }
  if (type === "CREATE") {
    form.id = null;
    form.status = "true";
    form.orderSequence = page.records.length + 1;
    uiControl.dialogTitle = t('fields.addVip');
    // grab latest previouslevel
    list.previousLevel = page.records;
    handlePreviousLevelFilter();
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editVip');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(vip) {
  showDialog("EDIT");
  list.previousLevel = page.records;
  nextTick(() => {
    for (const key in vip) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = vip[key];
      }
    }
    if (vip.previousLevel === 0) {
      form.previousLevel = null;
    }
    const newRecord = list.previousLevel.filter((element) => {
      return element.name !== form.name && element.siteId === form.siteId
    });
    list.previousLevel = newRecord;

    // update default level up credit value && level
    handleChangeLevel();
  });
}

function create() {
  vipForm.value.validate(async (valid) => {
    if (valid) {
      await createVip(form);
      uiControl.dialogVisible = false;
      await loadVip();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  vipForm.value.validate(async (valid) => {
    if (valid) {
      await updateVip(form);
      uiControl.dialogVisible = false;
      await loadVip();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function removeVip(vip) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (vip) {
      await deleteVip([vip.id]);
    } else {
      await deleteVip(chooseVip.map(a => a.id));
    }
    await loadVip();
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
  sites.list = site;
  request.siteId = site[0].id;
}

watch(() => request.siteId, () => {
  form.siteId = request.siteId
})
onMounted(async () => {
  if (hasRole(['TENANT', 'ADMIN'])) {
    await loadSites();
    if (LOGIN_USER_TYPE.value === TENANT.value) {
      site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
      request.siteId = site.value.id;
    }
  }
  await loadVip();
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
