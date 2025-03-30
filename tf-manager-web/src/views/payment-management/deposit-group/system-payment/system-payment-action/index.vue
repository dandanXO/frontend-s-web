<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span>{{ route.name==="Add Payment" ? $t('menu.Add Payment') : route.name==="Edit Payment" ? $t('menu.Edit Payment') : $t('menu.Copy Payment') }}</span>
      </div>
    </template>
    <el-form
      ref="paymentForm"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="180px"
    >
      <el-row>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="form-input"
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
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.paymentName')" prop="paymentName">
          <el-input
            :disabled="uiControl.titleDisable"
            v-model="form.paymentName"
            class="form-input"
          />
        </el-form-item>
        <el-form-item :label="t('fields.currency')" prop="currencyId">
          <el-select
            v-model="form.currencyId"
            size="small"
            :placeholder="t('fields.currency')"
            class="form-input"
          >
            <el-option
              v-for="item in list.currencies"
              :key="item.id"
              :label="item.currencyName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.mallName')" prop="mallName">
          <el-input v-model="form.mallName" class="form-input" @blur="form.mallName = form.mallName.trim()" />
        </el-form-item>
        <el-form-item :label="t('fields.mallCode')" prop="mallCode">
          <el-input v-model="form.mallCode" class="form-input" @blur="form.mallCode = form.mallCode.trim()" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.paymentType')" prop="payType">
          <el-select
            v-model="form.payType"
            size="small"
            :placeholder="t('fields.payType')"
            class="form-input"
          >
            <el-option
              v-for="item in list.paymentType"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.supportType')" prop="supportWay">
          <el-checkbox-group
            v-model="selected.supportTypeChecked"
            @change="handleCheckedChangeSupportType"
            class="form-input"
          >
            <el-checkbox
              v-for="s in supportWayTypes"
              :label="s.value"
              :key="s.typeName"
            >{{ s.typeName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.mallKey')" prop="mallKey">
          <el-input
            v-model="form.mallKey"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            class="form-input"
            @blur="form.mallKey = form.mallKey.trim()"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.mallExtraKey')" prop="mallExtraKey">
          <el-input
            v-model="form.mallExtraKey"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            class="form-input"
            @blur="form.mallExtraKey = form.mallExtraKey.trim()"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.additionalKey')" prop="additionalKey">
          <el-input
            v-model="form.additionalKey"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            class="form-input"
            @blur="form.additionalKey = form.additionalKey.trim()"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.className')" prop="className">
          <el-input v-model="form.className" class="form-input" />
        </el-form-item>
        <el-form-item :label="t('fields.extraParam')" prop="extraParam">
          <el-input v-model="form.extraParam" class="form-input" @blur="form.extraParam = form.extraParam.trim()" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.ruleType')" prop="ruleType">
          <el-input v-model="form.ruleType" class="form-input" />
        </el-form-item>

        <el-form-item :label="t('fields.ruleParam')" prop="ruleParam">
          <el-input v-model="form.ruleParam" class="form-input" @blur="form.ruleParam = form.ruleParam.trim()" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.feeRate')" prop="feeRate">
          <el-input-number
            v-model="form.feeRate"
            :precision="3"
            :step="0.10"
            :min="0"
            :max="1"
            :controls="false"
            class="form-input"
          />
        </el-form-item>
        <el-form-item :label="t('fields.payResultType')" prop="payResultType">
          <el-select
            v-model="form.payResultType"
            size="small"
            :placeholder="t('fields.payResultType')"
            class="form-input"
          >
            <el-option
              v-for="item in payResultTypes"
              :key="item.key"
              :label="item.typeName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.requestUrl')" prop="requestUrl">
          <el-input v-model="form.requestUrl" class="form-input" @blur="form.requestUrl = form.requestUrl.trim()" />
        </el-form-item>
        <el-form-item :label="t('fields.callbackUrl')" prop="callbackUrl">
          <el-input v-model="form.callbackUrl" class="form-input" @blur="form.callbackUrl = form.callbackUrl.trim()" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.minDeposit')" prop="depositMin">
          <el-input-number v-model="form.depositMin" :min="0" class="form-input" :controls="false" />
        </el-form-item>

        <el-form-item :label="t('fields.maxDeposit')" prop="depositMax">
          <el-input-number
            v-model="form.depositMax"
            :min="form.depositMin"
            class="form-input"
            :controls="false"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.payMessage')" prop="tipsWeb">
          <el-input
            v-model="form.tipsWeb"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            class="form-input"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="t('fields.payMessageMobile')" prop="tipsMobile">
          <el-input
            v-model="form.tipsMobile"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            class="form-input"
          />
        </el-form-item>
      </el-row>
      <el-row v-if="uiControl.titleDisable">
        <el-form-item :label="t('fields.createTime')" prop="createTime">
          <span
            v-if="form.createTime !== null"
            class="form-input"
          >{{ getDateString(form.createTime) }}</span>
          <span v-if="form.createTime === null">-</span>
          <!-- eslint-disable -->
        </el-form-item>

        <el-form-item :label="t('fields.createBy')" prop="createBy">
          <span v-if="form.createBy === null">-</span>
          <span class="form-input">{{ form.createBy }}</span>
        </el-form-item>
      </el-row>
      <el-row v-if="uiControl.titleDisable">
        <span v-if="form.updateTime === null">-</span>
        <el-form-item :label="t('fields.updateTime')" prop="updateTime">
          <span v-if="form.updateTime === null">-</span>
          <span
            v-if="form.createTime !== null"
            class="form-input"
          >{{ getDateString(form.updateTime) }}</span>
        </el-form-item>

        <el-form-item :label="t('fields.updateBy')" prop="updateBy">
          <span v-if="form.updateBy === null">-</span>
          <span class="form-input">{{ form.updateBy }}</span>
        </el-form-item>
      </el-row>
      <div class="form-footer">
        <span v-if="route.name.includes('Copy')"><el-button type="primary" @click="create()">{{ t('fields.saveAsNewPayment') }}</el-button></span>
        <span v-if="!route.name.includes('Copy')"><el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button></span>
        <el-button style="margin-left: 8em" @click="back">{{ t('fields.cancel') }}</el-button>
      </div>
    </el-form>
  </el-card>
</template>
<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { numericOnly, required } from '../../../../../utils/validate';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getCurrencyNames } from '../../../../../api/currency';
import { getActivePaymentTypes } from '../../../../../api/payment-type';
import { createSystemPayment, getSystemPaymentById, updateSystemPayment } from '../../../../../api/system-payment';
import { getSiteListSimple } from '../../../../../api/site';
import { useStore } from '@/store';
import { TENANT, ADMIN } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const route = useRoute();

const paymentForm = ref(null);
const site = ref(null);

const siteList = reactive({
  list: []
});

const form = reactive({
  id: null,
  siteId: null,
  paymentName: null,
  status: null,
  payType: null,
  mallName: null,
  mallCode: null,
  mallKey: null,
  mallExtraKey: null,
  className: null,
  requestUrl: null,
  callbackUrl: null,
  ruleType: null,
  ruleParam: null,
  currencyId: null,
  supportWay: null,
  tipsWeb: null,
  tipsMobile: null,
  extraParam: null,
  payResultType: null,
  feeRate: 0,
  depositMin: null,
  depositMax: null,
  createBy: null,
  createTime: null,
  updateBy: null,
  updateTime: null,
  additionalKey: null,
});

const uiControl = reactive({
  titleDisable: false,
});

const selected = reactive({
  country: null,
  supportTypeChecked: [],
});

const validateDepositMin = (rule, value, callback) => {
  if (value > form.depositMax) {
    callback(new Error(t('message.validateMinDepositLesser')));
  } else {
    callback();
  }
};

const validateDepositMax = (rule, value, callback) => {
  if (form.depositMin > 0 && form.depositMax === 0) {
    callback(new Error(t('message.validateMaxDepositGreater')));
  }
  if (value < form.depositMin) {
    callback(new Error(t('message.validateMaxDepositGreater')));
  } else {
    callback();
  }
};

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  paymentName: [required(t('message.validatePaymentNameRequired'))],
  mallName: [required(t('message.validateMallNameRequired'))],
  mallCode: [required(t('message.validateMallCodeRequired'))],
  supportWay: [required(t('message.validateSupportTypeRequired'))],
  payType: [required(t('message.validatePayTypeRequired'))],
  currencyId: [required(t('message.validateCurrencyRequired'))],
  className: [required(t('message.validateClassNameRequired'))],
  feeRate: [required(t('message.validateFeeRateRequired'))],
  payResultType: [required(t('message.validatePayResultTypeRequired'))],
  depositMin: [numericOnly(t('message.validateNumberOnly')), { validator: validateDepositMin, trigger: "blur" }],
  depositMax: [numericOnly(t('message.validateNumberOnly')), { validator: validateDepositMax, trigger: "blur" }],
});

const list = reactive({
  currencies: [],
  paymentType: []
});

const supportWayTypes = [{ typeName: "Web", value: "WEB" }, { typeName: "Mobile", value: "MOBILE" }]
/* eslint-disable */
const payResultTypes = [{ key: 1, typeName: "Image Base64", value: "IMAGE_BASE64" },
{ key: 2, typeName: "Generation QR Code", value: "GENERATION_QR_CODE" },
{ key: 3, typeName: "Render HTML", value: "RENDER_HTML" },
{ key: 4, typeName: "Post Submit", value: "POST_SUBMIT" },
{ key: 5, typeName: "Get Submit", value: "GET_SUBMIT" },
{ key: 6, typeName: "Offline", value: "OFFLINE" }]

function handleCheckedChangeSupportType() {
  form.supportWay = selected.supportTypeChecked.join(",");
}

function create() {
  paymentForm.value.validate(async (valid) => {
    if (valid) {
      await createSystemPayment(form);
      // redirect to systemPayment list page
      back();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  paymentForm.value.validate(async (valid) => {
    if (valid) {
      await updateSystemPayment(form);
      // redirect to systemPayment list page
      back();
      ElMessage({ message: t('message.editSuccess'), type: "success" });

    }
  });
}

function submit() {
  if (route.name.includes("Add")) {
    create();
  } else {
    edit();
  }
}
const router = useRouter()
function back() {
  router.push({
    name: "Payment",
    query: { current: route.query.current }
  })
}

function getDateString(timestamp) {
  if (timestamp) {
    var timeNum = new Number(timestamp)
    var date = new Date(timeNum);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds;
  }
}

async function loadSystemPaymentById(id) {
  const { data: ret } = await getSystemPaymentById(id);
  nextTick(() => {
    for (const key in ret) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = ret[key];
      }
    }

    const supportWayArr = form.supportWay.split(",")
    supportWayArr.forEach(element => {
      selected.supportTypeChecked.push(element);
    })
  });
}

function getCurrencyNameById(currencyId) {
  console.log(list.currencies)
}

async function loadCurrency() {
  const { data: ret } = await getCurrencyNames();
  list.currencies = ret;
}

async function loadPaymentType() {
  const { data: ret } = await getActivePaymentTypes();
  list.paymentType = ret;
}

async function loadSites() {
  if (LOGIN_USER_TYPE.value === ADMIN.value) {
    siteList.list = store.state.user.sites
  } else {
    const { data: site } = await getSiteListSimple();
    siteList.list = site;
  }
}

onMounted(async() => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    form.siteId = site.value.id;
  } else {
    form.siteId = siteList.list[0].id;
  }
  await loadCurrency();
  await loadPaymentType();
  if (route.name.includes("Edit")) {
    uiControl.titleDisable = true;
    await loadSystemPaymentById(route.params.id);
  } else if(route.name.includes("Copy")){
    await loadSystemPaymentById(route.params.id);
    form.paymentName = form.paymentName + "-1";
  }
});
</script>

<style scoped>
.form-footer {
  display: flex;
  margin-left: 28em;
  justify-content: flex-start;
}

.form-input {
  width: 320px;
}
</style>
