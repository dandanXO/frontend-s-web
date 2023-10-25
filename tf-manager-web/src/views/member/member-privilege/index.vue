<template>
  <div class="roles-main">
    <el-form ref="formRef" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
      <el-row>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 100px;"
            default-first-option
            @focus="loadSites"
            @change="changeSite"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.privilegeName')" prop="privilegeId">
          <el-select
            v-model="form.privilegeId"
            size="small"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadPrivilegeInfos"
            @change="selectPrivilege"
          >
            <el-option
              v-for="item in privilegeInfoList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.amount')" prop="amount">
          <el-input v-model="form.amount" style="width: 350px;" :disabled="uiControl.promoAmountInput" />
          <span style="margin-left: 10px" v-if="selectedPrivilege !== null && selectedPrivilege.bonusMax !== null && selectedPrivilege.bonusMax !== 0 && selectedPrivilege.bonusType !== 'FIXED'">
            {{ t('fields.maxBonus') }} : $ <span v-formatter="{data: selectedPrivilege.bonusMax,type: 'money'}" /></span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.turnoverMultiple')" prop="rollover">
          <el-input v-model="form.rollover" style="width: 350px;" disabled />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.loginName')" prop="loginName">
          <el-input type="textarea" v-model="form.loginName" :rows="6" style="width: 400px; margin-top: 5px;" :placeholder="t('fields.loginNameSeparateComma')" />
        </el-form-item>
      </el-row>
      <el-button type="primary" @click="distributePromo">{{ t('fields.confirm') }}</el-button>
    </el-form>
  </div>
</template>

<script setup>

import { computed, reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { required } from "../../../utils/validate";
import { getActivePrivilegeInfoBySiteId } from "../../../api/privilege-info";
import { distributePrivilege } from "../../../api/member-privilege";
import { getSiteListSimple } from "../../../api/site";
import { useStore } from '../../../store';
import { TENANT } from "../../../store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const formRef = ref(null);
const privilegeInfoList = reactive({
  list: []
});
const siteList = reactive({
  list: []
});
const selectedPrivilege = ref(null);

const uiControl = reactive({
  promoAmountInput: true
});

const form = reactive({
  siteId: null,
  privilegeId: null,
  amount: null,
  rollover: null,
  loginName: []
})

const formRules = reactive({
  privilegeId: [required(t('message.validatePrivilegeRequired'))],
  amount: [required(t('message.validateAmountRequired'))],
  loginName: [required(t('message.validateLoginNameRequired'))]
});

function selectPrivilege(val) {
  privilegeInfoList.list.forEach(privilege => {
    if (privilege.id === val) {
      form.rollover = privilege.rollover;
      if (privilege.bonusType === "FIXED") {
        form.amount = privilege.bonusAmount;
        uiControl.promoAmountInput = true;
      } else {
        form.amount = null;
        uiControl.promoAmountInput = false;
      }
      selectedPrivilege.value = privilege;
    }
  })
}

function distributePromo() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await distributePrivilege(form);
      form.loginName = [];
      form.privilegeId = privilegeInfoList.list[0].id;
      selectPrivilege(privilegeInfoList.list[0].id);
      ElMessage({ message: t('message.promoDistributionSuccess'), type: "success" });
    }
  });
}

async function loadPrivilegeInfos() {
  const { data: privilegeInfo } = await getActivePrivilegeInfoBySiteId(form.siteId);
  privilegeInfoList.list = privilegeInfo;
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

async function changeSite(siteId) {
  await loadPrivilegeInfos(siteId);
  form.privilegeId = privilegeInfoList.list[0].id;
  selectPrivilege(privilegeInfoList.list[0].id);
}

onMounted(async() => {
  form.loginName = [];
  await loadSites();
  form.siteId = siteList.list[0].id
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    form.siteId = site.value.id;
  }
  await changeSite(form.siteId);
});
</script>
