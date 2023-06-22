<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px;margin-left:10px"
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
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadBalance()">
          {{ t('fields.search') }}
        </el-button>
      </div>
    </div>

    <el-table :data="page.records" v-loading="page.loading" stripe ref="table" row-key="id" size="small"
              style="width: 100%" highlight-current-row :empty-text="t('fields.noData')"
    >
      <el-table-column prop="mallName" :label="t('fields.mallName')" width="300" />
      <el-table-column prop="balance" :label="t('fields.balance')" width="200" />
    </el-table>

  </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref } from "vue";
import { getBalance } from '../../../api/balance'
import { getSiteListSimple } from "../../../api/site";
import { useI18n } from "vue-i18n";
import { useStore } from "../../../store";
import { TENANT } from "../../../store/modules/user/action-types";

// eslint-disable-next-line
const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const siteList = reactive({
  list: []
});

const page = reactive({
  records: [],
  loading: false
});

const request = reactive({
  siteId: null,
});

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

async function loadBalance() {
  page.loading = true;
  const { data: ret } = await getBalance(request.siteId);
  page.records = ret;
  page.loading = false;
}

onMounted(async() => {
  await loadSites();
  request.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  }
  await loadBalance();
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
