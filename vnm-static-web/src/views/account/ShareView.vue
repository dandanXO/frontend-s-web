<template>
  <div class="share-container">
      <div class="menu-title">{{ $t('menu.referFriend') }}</div>
    <div class="form-field">
      <div class="label">{{ $t('refer.specifiedLink') }}:</div>

      <div class="content">
        <input class="referral-link-input" @blur="blurCode" ref="copyinput" v-model="referralLink" />
          <el-button class="common-btn copy-btn" @blur="blurCode" @click="copyCode">
            {{ copybtntxt }}
          </el-button>
      </div>
    </div>
    <div class="friends">
      <div class="subtitle">
        {{ $t('refer.friendList') }}
      </div>
      <el-table :data="dataSource">
        <template #empty>
          <EmptyData />
        </template>
        <el-table-column prop="loginName" :label="$t('refer.accountId')"/>
        <el-table-column prop="regTime" :label="$t('refer.regTime')"  />
        <el-table-column prop="depositAmount" :label="$t('refer.depositAmount')"   />
      </el-table>
    </div>
  </div>
  <div class="share-container">
    <div class="terms-wrapper">
      <div class="menu-title">{{ $t('menu.referFriend') }}</div>

      <div class="terms-subtitle"><b>{{ $t('referTerms.receiveReward') }}</b></div>

      <p>
        <div><b>{{ $t('referTerms.promotionStart') }}</b></div>
        <div v-html="$t('referTerms.applicableTo')"></div>
      </p>

      <p>
        <div><b>{{ $t('referTerms.promotionDetailsLabel') }}</b></div>
        <div>{{ $t('referTerms.promotionDetails') }}</div>
      </p>

      <p>
        <div><b>{{ $t('referTerms.howToParticipateLabel') }}</b></div>
        <div>
          <ol>
            <li>{{ $t('referTerms.howToParticipate1') }}</li>
            <li>{{ $t('referTerms.howToParticipate2') }}</li>
            <li>{{ $t('referTerms.howToParticipate3') }}</li>
            <li>{{ $t('referTerms.howToParticipate4') }}</li>
            <li>{{ $t('referTerms.howToParticipate5') }}</li>
          </ol>
        </div>
      </p>

      <table border class="terms-table">
        <thead>
          <th>{{ $t('referTerms.numOfReferredFriends') }}</th>
          <th>{{ $t('referTerms.bonusPercentage') }}</th>
          <th>{{ $t('referTerms.minimumBonusAmt') }}</th>
          <th>{{ $t('referTerms.maximumBonusPerReferredPerson') }}</th>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>10%</td>
            <td>100</td>
            <td>800</td>
          </tr>
          <tr>
            <td rowspan="2">≥2</td>
            <td>20%</td>
            <td>200</td>
            <td>800</td>
          </tr>
          <tr>
            <td colspan="3">{{ $t('referTerms.additionalCommissionHint') }}</td>
          </tr>
        </tbody>
      </table>
      

      <p>
        <div><b>{{ $t('referTerms.termsCondition') }}</b></div>
        <ol>
          <li>{{ $t('referTerms.termsCondition1') }}</li>
          <li>{{ $t('referTerms.termsCondition2') }}</li>
          <li>{{ $t('referTerms.termsCondition3') }}</li>
          <li>{{ $t('referTerms.termsCondition4') }}</li>
          <li>{{ $t('referTerms.termsCondition5') }}</li>
          <li>{{ $t('referTerms.termsCondition6') }}</li>
          <li>{{ $t('referTerms.termsCondition7') }}</li>
          <li>{{ $t('referTerms.termsCondition8') }}</li>
          <li>{{ $t('referTerms.termsCondition9') }}</li>
          <li>{{ $t('referTerms.termsCondition10') }}</li>
        </ol>
      </p>
    </div>
  </div>
  
</template>

<script lang="js">
import { defineComponent, reactive, ref, watch, onMounted } from "vue";
import { getReferralLink, getInviteFriendListCount, getVNMReferred } from "@/api/personal/share"
import { UserFilled, Money } from "@element-plus/icons-vue";
import moment from 'moment'
import VueQRCodeComponent from 'vue-qrcode-component'
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import EmptyData from "@/components/emptyData.vue";

import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
export default defineComponent({
  name: "ShareView",
  components: {
    VueQRCodeComponent, UserFilled, Money, EmptyData
  },
  setup() {
    const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
    const { t } = useI18n();
    const router = useRouter()
    const searchForm = reactive({
      date: moment('2022-03-03', 'YYYY-MM-DD'),
    });
    const referralLink = ref('');
    const referredMember = ref(0);
    const depositMember = ref(0);
    const copybtntxt = ref(t('common.copy'));
    const copyinput = ref(null);
    const copyCode = () => {
      const copyText = copyinput.value
      copyText.select()
      document.execCommand("copy")
      copybtntxt.value = t('common.copied')
    };
    const blurCode = () => {
      copybtntxt.value = t('common.copy')
    };

    const getReferral = () => {
      getReferralLink().then((res) => {
        if (res.code === 0) {
          referralLink.value = 'https://' + location.hostname + `/refer/${res.data}`;
        } else {
          ElMessage.error(res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    };

    const getInviteCount = () => {
      getInviteFriendListCount().then((res) => {
        if (res.code === 0) {
          referredMember.value = res.data.referredMember;
          depositMember.value = res.data.depositMember;
        } else {
          ElMessage.error(res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    };
    onMounted(() => {
      getReferral()
      getInviteCount()
      getReferralList()
    })
    watch(languageVal, (value, oldValue) => {
      copybtntxt.value = t('common.copy')
    })
    const dataSource = ref([])
    const getReferralList = () => {
      getVNMReferred().then((res) => {
        if (res.code === 0) {
          dataSource.value = res.data
      }
    })
    }
    
    const getStatusType = (statusType) => {
      if (!statusType) {
        return "";
      }
      if (statusType === "PENDING") {
        return t('status.pending'); // PENDING
      } else if (statusType === "CLAIMED") {
        return t('status.claimed'); // CLAIMED
      } else {
        return depositType;
      }
    };
    return {
      searchForm,
      copybtntxt,
      copyinput,
      copyCode,
      blurCode,
      referralLink,
      VueQRCodeComponent,
      router,
      referredMember,
      depositMember,
      dataSource,
      getVNMReferred,
      getStatusType
    };
  },
});
</script>

<style scoped lang="scss">
.share-container {
  background-color: #fff;
  box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
  border-radius: 15px;
  padding: 20px 40px;
  height: 100%;

  .terms-wrapper {
    line-height: 2em;
    color: #9AA8CB;

    .menu-title,
    .terms-subtitle {
      text-align: center;
    }

    .terms-table {
      th, td {
        text-align: center;
        padding: 2px 5px;
        border: 1px solid #9AA8CB;
      }
    }
  }

  .terms {
    color: #9AA8CB;
    font-size: 16px;
    margin: 20px 0 0 15px;
    padding: 0;
    li {
      margin-bottom: 10px;
    }
  }
  .menu-title {
    color: #424F72;
    font-weight: 700;
    font-size: 24px;
  }
  .form-field {
    display: flex;
    align-items: center;
    gap: 10px;

    .label {
      display: flex;
      gap: 20px;
      font-size: 14px;
      min-width: 110px;
    }

    .content {
      display: flex;
      gap: 20px;

      input.referral-link-input {
        height: 100%;
        width: 400px;
        border: none;
        padding: 10px;
        background: #F7F8FB;
        box-shadow: 0px 0px 8px 0px #A9C9EA inset;
        border-radius: 20px;
    outline: none;
        color: #7A80A1;

      }

      .qr-code-and-stats-wrapper {
        display: flex;
        flex-direction: column;
      }
    }
  }
}

.friends {
  .subtitle {
      color: #424F72;
  font-weight: 700;
  margin-bottom: 10px;

  }
    }
.divider-style {
  margin-top: 30px;
  margin-bottom: 30px;
}

.share-info-div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 22px;
  gap: 15px;

  .el-icon {
    border-radius: 50%;
    width: 70px;
    min-height: 70px;
    background: #466aeb;
    color: #638bf0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 10px;

    svg {
      font-size: 40px;
      color: #638bf0;
    }
  }
}

.share-info-box {
  width: 155px;
  height: 100px;
  background-image: linear-gradient(-37deg, #597ceb 0, #83bcfe 100%), linear-gradient(#fff, #fff);
  background-blend-mode: normal, normal;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: flex-end;
  padding-bottom: 10px;
  padding-left: 14px;
  padding-top: 6px;

  .total-info-div {
    font-size: 14px;
    color: #fff;
  }

  .label {
    position: absolute;
    top: 14px;
    z-index: 3;
    color: #fff;
    font-size: 18px;
  }
  
  .total-span {
    font-size: 24px;
    color: #fff;
    padding-right: 4px;
    font-weight: 700;
  }
}

.copy-btn{
  background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
  border-radius: 30px;
}
</style>
