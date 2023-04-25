<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-form :inline="true" size="small" label-width="30px">
          <el-form-item :label="t('fields.site')">
            <el-select
              v-model="selected.siteName"
              size="small"
              :placeholder="t('fields.site')"
              class="filter-item"
              style="width: 120px;margin-left: 5px"
              @change="handleChangeSite()"
            >
              <el-option
                v-for="item in list.sites"
                :key="item.id"
                :label="item.siteName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="transfer-container">
      <el-transfer
        :filterable="selected.siteName === null ? false : true"
        v-model="value"
        :data="list.data"
        :titles="title"
        :filter-placeholder="t('fields.withdrawPlatformList')"
      >
        <template #right-footer>
          <el-button
            class="transfer-footer"
            type="primary"
            @click="submit()"
            :disabled="selected.siteName === null ? true : false"
            size="small"
          >{{ t('fields.confirm') }}</el-button>
        </template>
      </el-transfer>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { getSiteListSimple } from "../../../api/site";
import { getSiteWithdrawPlatform, insertSiteWithdrawPlatform } from "../../../api/site-withdraw-platform";
import { getWithdrawPlatforms } from "../../../api/withdraw-platform";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const selected = reactive({
  siteName: null
});
const value = ref([]);

const list = reactive({
  sites: [],
  platforms: [],
  data: []
});
const siteData = ref([]);

const title = ref(['withdraw platform list', 'withdraw platform list']);

function handleChangeSite() {
  if (selected.siteName !== null) {
    const site = list.sites.find(k => k.id === selected.siteName)
    title.value = [t('fields.withdrawPlatformList'), site.siteName + " " + t('fields.withdrawPlatformList')]
    resetPlatformData();
    renderPlatformData();
  }
}

function resetPlatformData() {
  list.data = [];
  value.value = [];
}

function renderPlatformData() {
  loadWithdrawPlatform();
  loadSiteWithdrawPlatform(selected.siteName)
}

function submit() {
  var arr = value.value;
  create(selected.siteName, arr.join(','));
  // hard reset
  // loadSiteWithdrawPlatform(selected.siteName);
}

async function create(siteId, sitePlatforms) {
  await insertSiteWithdrawPlatform(siteId, sitePlatforms);
  await loadSiteWithdrawPlatform(siteId);
  ElMessage({ message: t('message.addSuccess'), type: "success" });
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple();
  list.sites = ret;
}

async function loadWithdrawPlatform() {
  const { data: ret } = await getWithdrawPlatforms();
  const site = list.sites.find(k => k.id === selected.siteName);
  list.platforms = ret.records.filter(r => site.id === r.siteId && r.status === true);
  if (selected.siteName !== null) {
    list.platforms.forEach(platform => {
      list.data.push({
        label: platform.name,
        key: platform.id
      })
    });
  }
}

async function loadSiteWithdrawPlatform(siteId) {
  const { data: ret } = await getSiteWithdrawPlatform(siteId);
  siteData.value = ret;

  // hard reset
  value.value = [];

  if (siteId !== null) {
    siteData.value.forEach(x => {
      value.value.push(x.withdrawPlatformId)
    })
  }
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = list.sites.find(s => s.siteName === store.state.user.siteName);
    selected.siteName = site.value.siteName;
    await loadWithdrawPlatform();
    await loadSiteWithdrawPlatform();
  }
});

</script>
<style scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}
.transfer-container >>> .el-transfer-panel {
  width: 350px;
}
.transfer-footer {
  margin-left: 15px;
  padding: 6px 5px;
}
</style>
