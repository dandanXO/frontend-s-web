<template>
  <el-form :model="form" label-width="200px" label-position="left" class="config_form">
    <el-form-item :label="t('fields.site')" size="mini" v-if="hasRole(['MANAGER','ADMIN'])">
      <el-select
        v-model="siteId"
        size="small"
        :placeholder="t('fields.site')"
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
    </el-form-item>
    <el-form-item :label="t('fields.defaultVip')" size="mini">
      <el-select
        v-model="defaultVip"
        size="small"
        :placeholder="t('fields.site')"
        style="width: 200px;"
        @focus="loadVip"
      >
        <el-option
          v-for="item in vips"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('fields.defaultFinancialLevel')" size="mini">
      <el-select
        v-model="defaultFinancial"
        size="small"
        :placeholder="t('fields.site')"
        style="width: 200px;"
        @focus="loadFinancialLevelInfos"
      >
        <el-option
          v-for="item in financialLevel"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('fields.defaultRiskLevel')" size="mini">
      <el-select
        v-model="defaultRisk"
        size="small"
        :placeholder="t('fields.site')"
        style="width: 200px;"
        @focus="loadRiskLevels"
      >
        <el-option
          v-for="item in risks"
          :key="item.id"
          :label="item.levelName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-divider />
    <el-form-item :label="t('fields.withdrawalFailureType')" size="mini">
      <div class="withdrawal_failure_type">
        <div v-for="(item,index) in withdrawFailType" :key="index">
          <el-input style="width: 400px " v-model="item.value" />
          <el-button v-if="index === 0" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                     @click="addWithdrawFailType()" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-else icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                     @click="delConfig(item.id)" plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </div>
    </el-form-item>
    <el-form-item :label="t('fields.withdrawalFailureCause')" size="mini">
      <div style="margin-bottom: 5px" v-for="(item,index) in withdrawFailCause" :key="index">
        <el-input style="width: 70% " v-model="item.value" />
        <el-button v-if="index === 0" icon="el-icon-plus" size="mini" type="primary" style="margin-left: 20px"
                   @click="addWithdrawFailCause()" plain
        >{{ t('fields.add') }}
        </el-button>
        <el-button v-else icon="el-icon-remove" size="mini" type="danger" style="margin-left: 20px"
                   @click="delConfig(item.id)" plain
        >{{ t('fields.delete') }}
        </el-button>
      </div>
    </el-form-item>
    <el-divider />
    <el-form-item :label="t('fields.adjustmentType')" size="mini">
      <div class="withdrawal_failure_type">
        <div class="adjust_type" style="margin-bottom: 5px" v-for="(item,index) in adjustType" :key="index">
          <el-input v-model="item.value" />
          <el-button v-if="index === 0" icon="el-icon-plus" type="primary" style="margin-left: 20px"
                     @click="addAdjustType()" plain
          >{{ t('fields.add') }}
          </el-button>
          <el-button v-else icon="el-icon-remove" type="danger" style="margin-left: 20px" @click="delConfig(item.id)"
                     plain
          >{{ t('fields.delete') }}
          </el-button>
        </div>
      </div>
    </el-form-item>
    <el-divider />
    <el-form-item :label="t('fields.platformFee')" size="mini">
      <div class="withdrawal_failure_type">
        <div style="margin-bottom: 5px" v-for="(item,index) in platformFee" :key="index">
          <el-input v-model="item.value"
                    style="width: 150px"
                    :placeholder="t('fields.platformFee')"
          />
        </div>
      </div>
    </el-form-item>
    <el-form-item :label="t('fields.paymentFee')" size="mini">
      <div class="withdrawal_failure_type">
        <div style="margin-bottom: 5px" v-for="(item,index) in paymentFee" :key="index">
          <el-input v-model="item.value"
                    style="width: 150px"
                    :placeholder="t('fields.paymentFee')"
          />
        </div>
      </div>
    </el-form-item>
    <el-divider />
    <el-form-item :label="t('fields.customerSupportAddress')" size="mini">
      <div class="withdrawal_failure_type">
        <div style="margin-bottom: 5px" v-for="(item,index) in csAddress" :key="index">
          <el-input v-model="item.value"
                    type="textarea"
                    :rows="10"
                    style="width: 350px; white-space: pre-line"
                    placeholder="{'abc':'xyz'}"
          />
        </div>
      </div>
    </el-form-item>
    <el-divider />
    <el-form-item size="mini">
      <el-button type="primary" @click="updateConfigs">{{ t('fields.confirm') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { getSiteListSimple } from "../../../api/site";
import uuidv1 from 'uuid/v1'
import { getVipList } from "../../../api/vip";
import { getFinancialLevels } from "../../../api/financial-level";
import { selectList } from "../../../api/risk-level";
import { deleteById, getConfigs, updateBatch } from "../../../api/config";
import { hasRole } from "../../../utils/util";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const siteId = ref();

const sites = reactive({
  list: []
})

const vips = ref([]);

const financialLevel = ref([]);

const risks = ref([]);

const configs = reactive({
  value: []
});

watch(() => configs.value, (newVal) => {
  console.log(configs.value)
}, { deep: true })

watch(() => siteId.value, async () => {
  configs.value.splice(0, configs.value.length);
  loadVip();
  loadFinancialLevelInfos();
  loadRiskLevels();
  loadConfigs();
})

const defaultVip = computed({
  get: () => Number(getter("default_vip", false).value),
  // eslint-disable-next-line no-return-assign
  set: (newVla) => configs.value.find(item => item.code === 'default_vip').value = newVla
})

const defaultFinancial = computed({
  get: () => Number(getter("default_financial", false).value),
  // eslint-disable-next-line no-return-assign
  set: (newVla) => configs.value.find(item => item.code === 'default_financial').value = newVla
})

const defaultRisk = computed({
  get: () => Number(getter("default_risk", false).value),
  // eslint-disable-next-line no-return-assign
  set: (newVla) => configs.value.find(item => item.code === 'default_risk').value = newVla
})

const withdrawFailType = computed(() => getter("cancel_type"))

const withdrawFailCause = computed(() => getter("cancel_cause"))

const adjustType = computed(() => getter("adjust_type"))

const platformFee = computed(() => getter("platform_fee"))

const paymentFee = computed(() => getter("payment_fee"))

const csAddress = computed(() => getter("cs_address"))

function getter(code, isArray = true) {
  let subArray = configs.value.filter(config => config.code === code)
  if (subArray.length === 0) {
    addConfigs(code);
    subArray = configs.value.filter(config => config.code === code)
  }
  if (isArray) {
    return subArray;
  } else {
    return subArray[0];
  }
}

function addWithdrawFailType() {
  addConfigs("cancel_type");
}

function addWithdrawFailCause() {
  addConfigs("cancel_cause");
}

function addAdjustType() {
  addConfigs("adjust_type");
}

function addConfigs(code) {
  configs.value.push({
    id: uuidv1(),
    siteId: siteId.value,
    name: null,
    code: code,
    value: null,
  })
}

function delConfig(id) {
  for (let index = 0; index < configs.value.length; index++) {
    if (configs.value[index].id === id) {
      configs.value.splice(index, 1);
      if (typeof id === 'number') {
        deleteById(id);
      }
      break;
    }
  }
}

async function loadSites() {
  const { data: ret } = await getSiteListSimple();
  sites.list = ret;
  siteId.value = ret[0].id;
}

async function loadVip() {
  const { data: ret } = await getVipList({ siteId: siteId.value });
  vips.value = ret;
}

async function loadFinancialLevelInfos() {
  const { data: ret } = await getFinancialLevels({ siteId: siteId.value })
  financialLevel.value = ret
}

async function loadRiskLevels() {
  const { data: risk } = await selectList({ siteId: siteId.value });
  risks.value = risk;
}

async function loadConfigs() {
  const { data: ret } = await getConfigs({ siteId: siteId.value });
  configs.value = ret;
}

async function updateConfigs() {
  const sub = configs.value.filter(item => item.value === null);
  if (sub.length > 0) {
    ElMessage({ message: t('message.validateNoNullValue'), type: "error" });
    return;
  }
  for (let index = 0; index < configs.value.length; index++) {
    if (typeof configs.value[index].id !== 'number') {
      delete configs.value[index].id;
    }
    if (configs.value[index].code === 'platform_fee') {
      if (configs.value[index].value < 0 || configs.value[index].value > 1) {
        ElMessage({ message: t('message.validatePlatformFeeFormat'), type: "error" });
        return;
      }
    }
    if (configs.value[index].code === 'payment_fee') {
      if (configs.value[index].value < 0 || configs.value[index].value > 1) {
        ElMessage({ message: t('message.validatePaymentFeeFormat'), type: "error" });
        return;
      }
    }
    if (configs.value[index].code === 'cs_address') {
      try {
        JSON.parse(configs.value[index].value);
      } catch (e) {
        ElMessage({ message: t('message.validateCustomerSupportAddressFormat'), type: "error" });
        return;
      }
    }
  }
  await updateBatch(configs.value);
  await loadConfigs();
  ElMessage({ message: t('message.updateSuccess'), type: "success" });
}

onMounted(() => {
  loadSites();
  loadFinancialLevelInfos();
  loadRiskLevels();
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.config_form {
  padding: 10px;

  ::v-deep .withdrawal_failure_type {
    display: grid;
    grid-template-columns: repeat(2, 500px);
    grid-row-gap: 5px;
    grid-column-gap: 40px;
  }

  ::v-deep .adjust_type {
    display: flex;

    .el-input {
      &:nth-child(1) {
        margin-right: 10px;
        width: 300px;
      }

      &:nth-child(2) {
        width: 500px;
      }
    }
  }

  ::v-deep label {
    font-weight: 900;
  }

  ::v-deep .el-input {
    width: 200px;
  }

}

</style>
