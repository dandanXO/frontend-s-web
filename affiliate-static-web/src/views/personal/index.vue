<template>
  <div class="roles-main">
    <el-card>
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ $t('fields.accountInfo') }}</span>
        </div>
      </template>
      <el-row v-if="uiControl.dialogType === 'ACCOUNT'" class="affiliate-info">
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#db1f55">
            <Icon :icon="person20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.account') }}</div>
            <span class="card-panel-num">
              {{ store.state.user.name }}
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#db1f55">
            <Icon :icon="personInfo20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.realName') }}</div>
            <span v-if="store.state.user.realName !== 'null' && store.state.user.realName !== 'undefined' && store.state.user.realName" class="card-panel-num">
              {{ store.state.user.realName }}
            </span>
            <span v-if="store.state.user.realName === 'null' || store.state.user.realName === 'undefined' || !store.state.user.realName" class="card-panel-num">
              <!-- <el-form style="display: flex; gap: 10px;">
                <el-input v-model="updateInfo.realName" />
                <el-button type="primary" @click="editRealName()">Update</el-button>
              </el-form> -->
              <el-form ref="editForm" :model="eForm" :rules="eFormRules" :inline="true" size="small">
                <el-form-item style="margin-right: 0; text-align: right;" prop="realName">
                  <el-input v-model="eForm.realName" maxlength="50" />
                  <el-button type="primary" @click="editRealName()">{{ $t('fields.confirm') }}</el-button>
                </el-form-item>
              </el-form>
            </span>
          </div>
        </el-card>
        <!-- <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1fa8db">
            <Icon :icon="personBoard20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.realName') }}</div>
            <span v-if="realName" class="card-panel-num">
              {{ realName }}
            </span>
            <el-button v-else icon="el-icon-edit" size="mini" type="success" @click="showDialog('EDIT')" />
          </div>
        </el-card> -->
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1fdbb0">
            <Icon :icon="bookCoins24Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.balance') }}</div>
            <span class="card-panel-num">
              {{ balance }}
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#6639b5">
            <Icon :icon="documentPercent20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.commission') }}</div>
            <span class="card-panel-num">
              {{ affInfo.commission * 100 }} %
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#db1f55">
            <Icon :icon="peopleTeam20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.downlineAffiliate') }}</div>
            <span class="card-panel-num">
              {{ affInfo.downlineAffiliate }}
            </span>
          </div>
        </el-card>
        <el-card
          body-style="gap:20px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
        >
          <el-icon color="#1fa8db">
            <Icon :icon="peopleList20Filled" class="stats-icon" />
          </el-icon>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ $t('fields.downlineMember') }}</div>
            <span class="card-panel-num">
              {{ affInfo.downlineMember }}
            </span>
          </div>
        </el-card>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { Icon } from '@iconify/vue'
import person20Filled from '@iconify-icons/fluent/person-20-filled'
import personInfo20Filled from '@iconify-icons/fluent/person-info-20-filled'
import bookCoins24Filled from '@iconify-icons/fluent/book-coins-24-filled'
import documentPercent20Filled from '@iconify-icons/fluent/document-percent-20-filled'
import peopleTeam20Filled from '@iconify-icons/fluent/people-team-20-filled'
import peopleList20Filled from '@iconify-icons/fluent/people-list-20-filled'
import { onMounted, reactive, ref } from '@vue/runtime-core'
import { getAffiliateBalance, getAffiliateInfo } from "../../api/affiliate";
import { required } from "../../utils/validate";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router"
import { UserActionTypes } from "@/store/modules/user/action-types";
// import { UserMutationTypes } from "@/store/modules/user/mutation-types";
// import { UserMutationTypes } from "../../store/modules/user/mutation-types";
// import { UserMutationTypes } from "../../store/modules/user/mutation-types";
const store = useStore();
// eslint-disable-next-line
const { t } = useI18n();
const editForm = ref(null);
const route = useRoute();
const uiControl = reactive({
  dialogTitle: 'My Account',
  dialogType: 'ACCOUNT',
  dialogVisible: false,
  editDialogTitle: 'Update Real Name',
  editDialogVisible: false,
  loading: false,
});
const balance = ref(0);
const affInfo = reactive({
  affiliateCode: null,
  affiliateLevel: null,
  downlineAffiliate: 0,
  downlineMember: 0,
  commission: 0,
  revenueShare: 0
});

const eForm = reactive({
  realName: null
});

const eFormRules = reactive({
  realName: [required(t('message.requiredRealName')), { pattern: '^([\u4e00-\u9fa5]*)$', message: '请输入中文字符', trigger: 'change' }]
});

async function loadAffiliateInfo() {
  const { data: aff } = await getAffiliateInfo(store.state.user.id);
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field];
  });
  await loadAffiliateBalance();
}

async function loadAffiliateBalance() {
  const { data: bal } = await getAffiliateBalance(store.state.user.id);
  balance.value = bal;
}

async function editRealName() {
  editForm.value.validate(async valid => {
    if (valid) {
      // await updateRealName(eForm.realName);
      // uiControl.editDialogVisible = false;
      // ElMessage({ message: t('message.editSuccess'), type: 'success' });
      // commit(UserMutationTypes.SET_REAL_NAME, eForm.realName);
      // loadAffiliateInfo();
      try {
        await store.dispatch(UserActionTypes.ACTION_UPDATE_REAL_NAME, eForm);
      } catch (e) {
        // console.error(e);
        // return;
      }
    }
  });
}

onMounted(async() => {
  if (route.query && route.query.name === 'realname') {
    ElMessage({ message: t('message.inputRealName'), type: "error", customClass: "toTop" });
  }
  await loadAffiliateInfo();
})
</script>

<style scoped>
.affiliate-info {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.affiliate-info .box-card {
  flex: 1;
  flex-wrap: wrap;
}

.referral-link {
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.box-card i {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  border-radius: 5px;
  padding: 10px;
  width: 80px;
  height: 80px;
}

.card-panel-description {
  font-weight: 700;
  margin-left: 0;
}

.card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
  text-align: right;
}

.card-panel-description .card-panel-link-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}

.card-panel-description .card-panel-num {
  font-size: 20px;
  float: right;
}

.btn-group {
  margin-top: 15px;
  display: flex;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1200px) {
  .affiliate-info {
    grid-template-columns: repeat(1, 1fr);
  }

  .column {
    margin-top: 20px;
  }
}
</style>
