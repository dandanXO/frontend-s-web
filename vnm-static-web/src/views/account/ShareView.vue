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
        <el-table-column prop="loginName" :label="$t('refer.accountId')" width="300" />
        <el-table-column prop="regTime" :label="$t('refer.regTime')"  width="300" />
        <el-table-column prop="totalBet" :label="$t('refer.bet')"  width="250"   />
        <el-table-column prop="status" :label="$t('refer.status')" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              {{ getStatusType(scope.row.status) }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="share-container">
      <div class="menu-title">{{ $t('menu.referFriend') }}</div>
      
      <ul class="terms" style="list-style-type:decimal;">
            <li>
               {{ $t('referTerms.promotionStart')}}
            </li>
            <li> {{ $t('referTerms.referralBonus')}}</li>
            <li>
              {{ $t('referTerms.eligibilityConditions') }}
            <ul style="list-style-type: lower-alpha">
            <li> {{ $t('referTerms.referrerConditions')}}
              <ul>
                <li style="list-style:lower-roman;">
                  {{ $t('referTerms.referrerConditions1')}}
                </li>
                <li style="list-style:lower-roman;">
                  {{ $t('referTerms.referrerConditions2')}}
                </li>
              </ul>
            </li>
            <li> {{ $t('referTerms.presenteeConditions')}}
              <ul>
                <li style="list-style:lower-roman;">
                  {{ $t('referTerms.presenteeConditions1')}}
                </li>
                <li style="list-style:lower-roman;">
                  {{ $t('referTerms.presenteeConditions2')}}
                </li>
                <li style="list-style:lower-roman;">
                  {{ $t('referTerms.presenteeConditions3')}}
                </li>
              </ul></li>
            </ul>
            </li>
            
            <li> {{ $t('referTerms.specifiedLink')}}</li>
            <li> {{ $t('referTerms.promotionReview')}}</li>
            <li> {{ $t('referTerms.withdrawalConditions')}}</li>
            <li> {{ $t('referTerms.notApplied')}}</li>
            <li> {{ $t('referTerms.rightsReserved')}}</li>
            <li> {{ $t('referTerms.concurrentPromotions')}}</li>
            <li> {{ $t('referTerms.generalTerms')}}</li>
        </ul>
    </div>
  
</template>

<script lang="js">
import { defineComponent, reactive, ref, watch, onMounted } from "vue";
import { getReferralLink, getInviteFriendListCount, getVNMReferred } from "@/api/personal/share"
import {
  RiFacebookCircleLine, RiWhatsappLine, RiTelegramLine, RiTwitterLine, RiInstagramLine,
} from "vue-remix-icons"
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
    RiFacebookCircleLine, RiWhatsappLine, RiTelegramLine, RiTwitterLine, RiInstagramLine, VueQRCodeComponent, UserFilled, Money, EmptyData
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
