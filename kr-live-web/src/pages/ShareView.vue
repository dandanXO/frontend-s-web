<template>
  <div class="main-section">

    <div class="share-wrapper">
      <div class="sharing-container">
        <div class="qr-container">
          <VueQRCodeComponent size="150" :text="referralLink"/>
          <!-- <qr-code :text="referralLink" error-level="L"></qr-code> -->
          <!-- <img src="../../assets/images/account/share/qr_code.png" /> -->
        </div>
        <div class="right-container">
          <div class="share-content">
            {{ $t('lang.receive_a_daily_bonus_share_qr_code_with_friends') }}
          </div>
          <div class="share-link-wrapper">
            <q-input style="width: 100%;" filled color="white"
                     ref="copyinput"
                     v-model="referralLink"
                     @blur="blurCode"
            />
            <q-btn color="brand" class="common-btn copy-btn"
                   @blur="blurCode" @click="copyCode">
              {{ copybtntxt }}
            </q-btn>
          </div>

          <div class="share-table-div">
            <div class="table-row first-row">{{ $t('lang.my_total_refer_friends_rebate') }}</div>
            <div class="table-row first-row">{{ referInfo.totalRebate }} baht</div>
            <div class="empty-row" style="grid-column: 3/-1;">&nbsp;</div>

            <div class="table-row">{{ $t('lang.my_a_line_refer_total') }}</div>
            <div class="table-row">{{ referInfo.alineCount }}</div>
            <div class="table-row">{{ $t('lang.total_bets') }}：</div>
            <div class="table-row">{{ referInfo.alineBet }}</div>
            <div class="table-row">{{ $t('lang.total_rebate_return') }} ({{ referInfo.alinePercentage }}%):</div>
            <div class="table-row row-a-last">{{ referInfo.alineRebate }} baht</div>


            <div class="table-row row-b-first">{{ $t('lang.my_b_line_refer_total') }}</div>
            <div class="table-row row-b-first">{{ referInfo.blineCount }}</div>
            <div class="table-row">{{ $t('lang.total_bets') }}：</div>
            <div class="table-row">{{ referInfo.blineBet }}</div>
            <div class="table-row">{{ $t('lang.total_rebate_return') }} ({{ referInfo.blinePercentage }}%):</div>
            <div class="table-row">{{ referInfo.blineRebate }} baht</div>


          </div>

        </div>
      </div>
      <div class="otherlinks">
        <span class="note">{{ $t('lang.your_referral_bonus_has_not_been_shared') }}</span>

        <div class="links">
          <RiFacebookCircleLine/>
          <RiWhatsappLine/>
          <RiTelegramLine/>
          <RiTwitterLine/>
          <RiInstagramLine/>
        </div>
      </div>
    </div>
    <div>
      <!-- <div class="account-title-container">
        <span class="account-title">ข้อมูลอ้างอิง</span>
      </div>
      <div class="account-content last">
        <div class="preferred">
          <div class="account-tip-text query-tip">
            <RiSpamLine /> คำถามประจำเดือน
          </div>
          <div class="txt-center">
            <a-date-picker
              v-model:value="searchForm.date"
              :inputReadOnly="true"
            />
          </div>
        </div>
        <div class="share-tab-wrapper">
          <a-table :columns="columns" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted} from "vue";
import {
  RiFacebookCircleLine, RiWhatsappLine, RiTelegramLine, RiTwitterLine, RiInstagramLine
} from "vue-remix-icons"
import moment from 'moment'
import {api} from "boot/axios";
import VueQRCodeComponent from 'vue-qrcode-component'
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: "ShareView",
  components: {
    RiFacebookCircleLine, RiWhatsappLine, RiTelegramLine, RiTwitterLine, RiInstagramLine, VueQRCodeComponent
  },
  setup() {
    const {t} = useI18n()
    const searchForm = reactive({
      date: moment('2022-03-03', 'YYYY-MM-DD'),
    });
    const referralLink = ref('');
    const copybtntxt = ref(t('lang.copy'));
    const copyinput = ref(null);
    const copyCode = () => {
      const copyText = copyinput.value
      copyText.select()
      document.execCommand("copy")
      copybtntxt.value = t('lang.copied')
    };
    const blurCode = () => {
      copybtntxt.value = t('lang.copy')
    };

    const referInfo = ref({});
    const getReferLists = () => {
      api.get('/session/member/referRebate').then((ret) => {
        const res = ret.data;
        referInfo.value = res.data;
        console.log(referInfo.value)
      });
    }
    const getReferral = () => {
      api.get('/session/member/referralCode').then((ret) => {
        const res = ret.data
        if (res.code === 0) {
          //TODO:: ADd Url After That.
          const url = 'https://jolly88.com/';
          referralLink.value = url + `refer/${res.data}`;
        }
      }).catch((err) => {

      })
    };
    onMounted(() => {
      getReferral()
      getReferLists();
    })
    return {
      searchForm,
      copybtntxt,
      copyinput,
      copyCode,
      blurCode,
      referralLink,
      VueQRCodeComponent,
      referInfo
    };
  },
});
</script>

<style scoped lang="scss">
.share-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
  width: 90%;
  margin: 10px auto 0px;
  gap: 20px;

  .sharing-container {
    flex-direction: column;
    box-shadow: 0px 0px 20px 1px #10101c;
    width: 100%;
    margin: 10px auto;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    overflow: hidden;
    flex: 2;

    .qr-container {
      background: #ffffff;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
        width: 120px;
        margin: 0 auto;
      }
    }

    .right-container {
      background: #23263c;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #ffffff;

      .share-content {
        padding: 10px 30px;
      }

      .share-link-wrapper {
        padding: 10px 30px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 20px;

        input {
          width: 100%;
          border: none;
          background-color: #2b2b4b;
          padding: 10px;
        }
      }
    }
  }

  .otherlinks {
    display: flex;
    gap: 10px;
    flex-direction: column;

    .links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;

      svg {
        width: 30px;
        fill: #ffffff;
      }
    }

    .note {
      font-size: 12px;
    }
  }
}

.copy-btn {
  min-width: 90px;
}

.share-table-div {
  margin: 25px auto 45px;
  width: calc(100% - 50px);
  display: grid;
  font-size: 16px;
  gap: 3px;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;

  .first-row {
    color: $warning;
  }

  .table-row {
    white-space: nowrap;;
    height: 40px;
    line-height: 32px;
    background: $secondary;
    padding: 8px 8px;
  }

}

.preferred {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
<style scoped lang="scss">
@media (max-width: 991px) {
  .share-table-div {
    grid-template-columns:  1fr 1fr;

    .empty-row {
      display: none;
    }

    .first-row {
      margin-bottom: 8px;
    }

    .row-b-first {
      margin-top: 8px;
    }
  }

}

@media (max-width: 768px) {
  .share-wrapper {
    flex-direction: column;
    margin-bottom: 50px;
    align-items: center;

    .sharing-container {
      flex-direction: column;

      .share-link-wrapper {
        flex-direction: column;
      }
    }
  }
}

@media (max-width: 500px) {
  .share-table-div {
    width: calc(100% - 20px);
    grid-template-columns:  1fr;
    gap: 0px;


    .first-row {
      margin-bottom: 0px;

      &:nth-child(2) {
        margin-bottom: 10px;
      }
    }

    .row-a-last{
      margin-bottom: 10px;
    }
    .row-b-first {
      margin-top: 0px;
    }
  }
}
</style>
