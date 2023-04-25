<template>
  <div class="roles-main">
    <div style="width: 500px">
      <el-form
        ref="tipsForm"
        :model="form"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId" v-if="hasRole(['TENANT','ADMIN'])">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 500px;"
            @change="loadTips"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.tips')" prop="tips">
          <el-input type="textarea" :rows="6" v-model="form.tips" style="width: 500px" :disabled="!uiControl.editState" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button
            v-if="!uiControl.editState && !hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw-tips:update'])"
            v-permission="['sys:withdraw-tips:update']"
            type="success"
            @click="uiControl.editState = true"
            style="margin-left: 10px"
          >
            {{ t('fields.edit') }}
          </el-button>
          <el-button
            v-if="uiControl.editState && !hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw-tips:update'])"
            v-permission="['sys:withdraw-tips:update']"
            @click="cancel"
            style="margin-left: 10px"
          >
            {{ t('fields.cancel') }}
          </el-button>
          <el-button
            v-if="uiControl.editState && !hasRole(['SUB_TENANT']) && hasPermission(['sys:withdraw-tips:update'])"
            v-permission="['sys:withdraw-tips:update']"
            type="primary"
            @click="submit"
            style="margin-left: 10px"
          >
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { getSiteListSimple } from "../../../api/site";
import { getWithdrawTips, updateWithdrawTips } from "../../../api/withdraw-tips";
import { hasRole, hasPermission } from "../../../utils/util";
import { onMounted } from "@vue/runtime-core";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);

const tipsForm = ref(null);
const sites = reactive({
  list: []
});

const uiControl = reactive({
  editState: false,
  loading: false
});

const form = reactive({
  id: null,
  siteId: null,
  tips: null
});

async function loadTips() {
  uiControl.loading = true;
  const { data: ret } = await getWithdrawTips(form.siteId);
  form.tips = ret == null ? "" : ret;
  uiControl.loading = false;
}

function submit() {
  tipsForm.value.validate(async (valid) => {
    if (valid) {
      await updateWithdrawTips(form);
      uiControl.editState = false;
      await loadTips();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
}

async function cancel() {
  uiControl.editState = false;
  await loadTips();
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
  form.siteId = site[0].id;
}

onMounted(async () => {
  if (hasRole(['TENANT', 'ADMIN'])) {
    await loadSites();
    if (LOGIN_USER_TYPE.value === TENANT.value) {
      site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
      form.siteId = site.value.id;
    }
  }
  await loadTips();
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
  justify-content: flex-start;
  margin-left: 140px;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>
