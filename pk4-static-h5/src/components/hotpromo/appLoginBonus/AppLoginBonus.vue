<template>
  <div>
    <img
      class="promo-banner-img"
      src="./../../../assets/images/promotion/hotpromo/app-login-bonus/promo-banner.png"
    />
    <div class="app-login-bonus">
      <div class="link-to-phone-container">
        <div class="link-to-phone">
          <div class="link-to-phone__left">
            <img class="icon" src="./../../../assets/images/promotion/hotpromo/app-login-bonus/link-phone-icon.png" />
            Bind phone
            <img class="tick" :src="require(`./../../../assets/images/promotion/hotpromo/app-login-bonus/tick-${ hasBindPhone ? 'active' : 'inactive'}.png`)" />
          </div>
          <div class="link-to-phone__rgt"><q-btn class="btn-primary" @click="handleClaimBtnClick()">{{ hasBindPhone ? 'Claim' : 'Link' }}</q-btn></div>
        </div>
      </div>
      <!-- <div class="download-container">
        <span>
          {{ $t("hotPromo.appLoginBonus.newlyRegistered1") }}
          <span style="color: #faff00">{{ $t("hotPromo.appLoginBonus.b9") }}</span>
          {{ $t("hotPromo.appLoginBonus.newlyRegistered2") }}
          <span style="color: #00ffc3">{{ $t("hotPromo.appLoginBonus.bdt888") }}</span>
          {{ $t("hotPromo.appLoginBonus.newlyRegistered5") }}
        </span>
        <div v-if="!hadClaim && isAppLogin" class="claim-btn" @click="handleClaimBtnClick">
          <span>{{ $t("hotPromo.appLoginBonus.claimNow") }}</span>
        </div>
        <a v-else-if="!hadClaim && !isAppLogin" :href="ui.downloadAppUrl" style="text-decoration: none">
          <div class="download-btn">
            <span>{{ $t("hotPromo.appLoginBonus.downloadApp") }}</span>
          </div>
        </a>

        <div v-else class="claim-btn disabled">
          <span>{{ $t("hotPromo.appLoginBonus.claimed") }}</span>
        </div>
      </div>

      

      <div class="things-to-note-container">
        <img
          v-if="languageVal === 'en'"
          src="../../../assets/images/promotion/hotpromo/app-login-bonus/things-to-note-title.png"
        />
        <img v-else src="../../../assets/images/promotion/hotpromo/app-login-bonus/thinktonote.png" />

        <span>
          <br />
          {{ $t("hotPromo.appLoginBonus.thingsToNote1") }}
          <br />
          <br />
          {{ $t("hotPromo.appLoginBonus.thingsToNote2") }}
          <span style="color: #00ff80cc">{{ $t("hotPromo.appLoginBonus.thingsToNote3") }}</span>
          {{ $t("hotPromo.appLoginBonus.thingsToNote4") }}
          <span style="color: #00ff80cc">{{ $t("hotPromo.appLoginBonus.thingsToNote5") }}</span>
          {{ $t("hotPromo.appLoginBonus.thingsToNote6") }}
        </span>
      </div>

      <div class="get-bonus-info-container">
        <img
          v-if="languageVal === 'en'"
          src="../../../assets/images/promotion/hotpromo/app-login-bonus/get-bonus-info-title.png"
        />
        <img v-else src="../../../assets/images/promotion/hotpromo/app-login-bonus/getapp.png" />

        <span>
          <br />
          {{ $t("hotPromo.appLoginBonus.downloadAndInstall1") }}
          <span style="color: #00ff80cc">{{ $t("hotPromo.appLoginBonus.b9game") }}</span>
          {{ $t("hotPromo.appLoginBonus.downloadAndInstall2") }}
          <br />
          <br />
          {{ $t("hotPromo.appLoginBonus.downloadAndInstall3") }}
          <span style="color: #00ff80cc">{{ $t("hotPromo.appLoginBonus.b9game") }}</span>
          {{ $t("hotPromo.appLoginBonus.downloadAndInstall4") }}
          <br />
          <br />
          {{ $t("hotPromo.appLoginBonus.downloadAndInstall5") }}
          <span style="color: #00ff80cc">{{ $t("hotPromo.appLoginBonus.b9game") }}</span>
          {{ $t("hotPromo.appLoginBonus.downloadAndInstall4") }}
          <br />
          <br />
          {{ $t("hotPromo.appLoginBonus.downloadAndInstall6") }}
          <br />
          <br />
          {{ $t("hotPromo.appLoginBonus.downloadAndInstall7") }}
          <br />
          <br />
          {{ $t("hotPromo.appLoginBonus.downloadAndInstall8") }}
          <span style="color: #00ff80cc">{{ $t("hotPromo.appLoginBonus.bdt888") }}</span>
          {{ $t("hotPromo.appLoginBonus.downloadAndInstall9") }}
        </span>
      </div> -->
      <div class="section event-details-container">
        <img class="section-title" :src="require(`../../../assets/images/promotion/hotpromo/app-login-bonus/event-details-${languageVal}.png`)">
        <template v-if="languageVal === 'en'">
          <p><span class="yellow">B9.game</span> Special Offer for New Members: First Deposit Bonus Up to <span class="red">119%</span>!</p>
          <p>Simply create a new member account at <span class="yellow">B9.game</span>, complete your first deposit, and you can claim your bonus. In addition, with a minimum deposit of <span class="red">100TK</span>, you can enjoy the first deposit bonus and an additional bonus of up to <span class="red">119%</span>, providing more fun.</p>
          <p>In addition, there are additional offers for users with higher top-ups. Top up more, enjoy more rewards, and participate in <span class="yellow">B9.game</span> activities with your friends to experience higher benefits and services.</p>
        </template>
        <template v-if="languageVal === 'ur'">
          <p><span class="yellow">B9.game</span> نئے ممبرز کے لیے خاص آفر: پہلے ڈپازٹ پر بونس <span class="red">119%</span> تک!</p>
          <p>بس <span class="yellow">B9.game</span> پر نیا اکاؤنٹ بنائیں، پہلا ڈپازٹ مکمل کریں، اور اپنا بونس حاصل کریں۔ اس کے علاوہ، صرف <span class="red">100TK</span> کے کم از کم ڈپازٹ پر، آپ نہ صرف پہلے ڈپازٹ کا بونس حاصل کر سکتے ہیں بلکہ <span class="red">119%</span> تک اضافی بونس سے مزید مزہ بھی حاصل کریں۔</p>
          <p>اس کے ساتھ ساتھ، زیادہ رقم ٹاپ اپ کرنے والے صارفین کے لیے مزید آفرز بھی موجود ہیں۔ جتنا زیادہ ٹاپ اپ کریں، اتنے زیادہ انعامات حاصل کریں، اور اپنے دوستوں کے ساتھ <span class="yellow">B9.game</span> کی سرگرمیوں میں حصہ لے کر مزید فوائد اور سروسز کا لطف اٹھائیں۔</p>
        </template>
        <div class="scrollable-table">
          <table class="content-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
            <thead>
              <tr>
                <th>{{ $t("hotPromo.appLoginBonus.depositAmt") }}</th>
                <th>{{ $t("hotPromo.appLoginBonus.giveawayBonus") }}</th>
                <th>{{ $t("hotPromo.appLoginBonus.turnoverRequirements") }}</th>
                <th>{{ $t("hotPromo.appLoginBonus.applicableGames") }}</th>
                <th>{{ $t("hotPromo.appLoginBonus.conditionsForReceiving") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span>100</span>
                </td>
                <td>
                  <span>119</span>
                </td>
                <td>
                  <span>10X</span>
                </td>
                <td rowspan="6">
                  <span>{{ $t("hotPromo.appLoginBonus.slotMachines") }}</span>
                </td>
                <td rowspan="6">
                  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                  <span style="color: #0385F0;">{{ $t("hotPromo.appLoginBonus.depositPayment") }}</span>
                  <span>↓</span>
                  <span style="color: #0385F0;">{{ $t("hotPromo.appLoginBonus.selectDepositChannel") }}</span>
                  <span>↓</span>
                  <span style="color: #0385F0;">{{ $t("hotPromo.appLoginBonus.checkDepositOffer") }}</span>
                  </div>
                </td>
                <!-- <td rowspan="2">
                  <span>
                    {{ $t("hotPromo.appLoginBonus.rewardDetailTxt1") }}
                    <span style="color: #ff9500">{{ $t("hotPromo.appLoginBonus.bdt888") }}</span>
                    {{ $t("hotPromo.appLoginBonus.rewardDetailTxt2") }}
                    <br />
                    <span style="color: #ff0000; display: block; margin-top: 10px">
                      {{ $t("hotPromo.appLoginBonus.rewardDetailTxt3") }}
                    </span>
                  </span>
                </td> -->
              </tr>
              
              <tr>
                <td>
                  <span>100</span>
                </td>
                <td>
                  <span>119</span>
                </td>
                <td>
                  <span>10X</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>100</span>
                </td>
                <td>
                  <span>119</span>
                </td>
                <td>
                  <span>10X</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>100</span>
                </td>
                <td>
                  <span>119</span>
                </td>
                <td>
                  <span>10X</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>100</span>
                </td>
                <td>
                  <span>119</span>
                </td>
                <td>
                  <span>10X</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>100</span>
                </td>
                <td>
                  <span>119</span>
                </td>
                <td>
                  <span>10X</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="section examples-container">
        <img class="section-title" :src="require(`../../../assets/images/promotion/hotpromo/app-login-bonus/examples-${languageVal}.png`)">
        <template v-if="languageVal === 'en'">
          <p>For example, member A tops up <span class="red">100TK</span> for the first time and gets <span class="red">119TK</span> as a reward. Before withdrawing, he needs to complete at least 10 times the turnover requirement, that is:</p>
          
          <span class="note">100 principal x 10 + 119 reward x 10 = 2190 turnover</span>
        </template>
        <template v-if="languageVal === 'ur'">
          <p>مثال کے طور پر، ممبر A پہلی بار <span class="red">100TK</span> ٹاپ اپ کرتا ہے اور اسے <span class="red">119TK</span> بطور انعام ملتے ہیں۔ رقم نکالنے سے پہلے، اسے کم از کم 10 گنا ٹرن اوور کی شرط پوری کرنی ہوگی، یعنی:</p>
          <span class="note">100 اصل رقم x 10 + 119 انعام x 10 = 2190 ٹرن اوور</span>
        </template>
      </div>
      
      <div class="section how-to-receive-container">
        <img class="section-title" :src="require(`../../../assets/images/promotion/hotpromo/app-login-bonus/how-to-receive-${languageVal}.png`)">
        <template v-if="languageVal === 'en'">
          <p>Before making your first deposit, members need to verify their email address and bind a valid withdrawal account (supports Nagad, Rocket, Bkash, Upay).</p>
          <span class="note">Go to the deposit page > Select a deposit channel > Select a promotion > Click to receive the 119% first deposit bonus</span>
        </template>
        <template v-if="languageVal === 'ur'">
          <p>اپنا پہلا ڈپازٹ کرنے سے پہلے، ممبرز کو اپنا ای میل ایڈریس تصدیق کرنا ہوگا اور ایک درست نکاسی اکاؤنٹ (Nagad، Rocket، Bkash، Upay کی سہولت موجود ہے) لنک کرنا ہوگا۔</p>
          <span class="note">ڈپازٹ پیج پر جائیں > ڈپازٹ چینل منتخب کریں > پروموشن منتخب کریں > 119% پہلے ڈپازٹ بونس حاصل کرنے کے لیے کلک کریں</span>
        </template>
      </div>
      <div class="section terms-and-conditions-container">
        <img class="section-title" :src="require(`../../../assets/images/promotion/hotpromo/app-login-bonus/terms-and-conditions-${languageVal}.png`)">
        <ul>
          <li>{{ $t("hotPromo.appLoginBonus.termsCondition1") }}</li>
          <li>
            {{ $t("hotPromo.appLoginBonus.termsCondition2") }}
          </li>
          <li>
            {{ $t("hotPromo.appLoginBonus.termsCondition3") }}
          </li>
          <li>
            {{ $t("hotPromo.appLoginBonus.termsCondition4") }}
          </li>
          <li>
            {{ $t("hotPromo.appLoginBonus.termsCondition5") }}
          </li>
          <li>
            {{ $t("hotPromo.appLoginBonus.termsCondition6") }}
          </li>
          <li>{{ $t("hotPromo.appLoginBonus.termsCondition7") }}</li>
          <li>{{ $t("hotPromo.appLoginBonus.termsCondition8") }}</li>
          <li>{{ $t("hotPromo.appLoginBonus.termsCondition9") }}</li>
        </ul>
      </div>
    </div>
  </div>
  <!-- <BindEmailModal :bindEmailDialog="bindEmailDialog" @update:bindEmailDialog="updateBindEvent($event)" /> -->
  <CongratsReuseableModal
    :isShowDialog="isShowReceiveDialog"
    :bonusAmount="bonusAmount"
    @handleBtnClick="handleReceiveBonus"
  />
</template>
<script setup>
import { storeToRefs } from "pinia";
import { i18nStore } from "src/router/language";
import { ref, onMounted } from "vue";
import { userStore } from "src/stores";
import { eventapi } from "src/boot/axios";
// import BindEmailModal from "src/components/modal/BindEmailModal.vue";
import { useUI } from "stores/ui";
import CongratsReuseableModal from "src/components/modal/CongratsReuseableModal.vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const props = defineProps(["promocode"]);
const store = userStore();
const ui = useUI();
const { languageVal } = storeToRefs(i18nStore());
const bindEmailDialog = ref(false);
const isShowReceiveDialog = ref(false);
const hasBindPhone = ref(false);
const hadClaim = ref(false);
const isAppLogin = ref(false);
const bonusAmount = ref(0);
const $q = useQuasar();
const router = useRouter();



const updateBindEvent = async (event) => {
  bindEmailDialog.value= event;
  getAppLoginBonusData();
}

const claimAppLoginBonus = () => {
  eventapi
    .post(`/session/app-login-bonus/claimBonus?promoCode=${props.promocode}`)
    .then((res) => {
      if (res.code === 0) {
        isShowReceiveDialog.value= true;
        bonusAmount.value = res.data;
      }
    })
    .catch(() => {});
};
const getAppLoginBonusData = () => {
  eventapi.get(`/session/app-login-bonus/init?promoCode=${props.promocode}`).then((res) => {
    if (res.code === 0) {
      // hasBindEmail.value = res.data.hadBindEmail;
      hasBindPhone.value = res.data.hadBindPhone;
      hadClaim.value = res.data.hadClaim;
      isAppLogin.value = res.data.isAppLogin;

    }
  });
};

const handleClaimBtnClick = () => {
  if (hasBindPhone.value === true) {
    claimAppLoginBonus();
  } else {
    router.push("/account/profile");
  }
};

const handleReceiveBonus = () => {
  store.getBalance();
  isShowReceiveDialog.value = false;

  getAppLoginBonusData();
};

onMounted(() => {
  getAppLoginBonusData();
});
</script>
<style lang="scss" scoped>
.app-login-bonus {
  padding: 0px 20px;
  .link-to-phone-container {
    border: 1px solid #252A3A;
    border-radius: 10px;
    background: #121829;
    padding: 8px;
    .link-to-phone {
      background: #FFFFFF14;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 10px;
      padding: 10px;
      &__left {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        img {
          &.icon {
            max-width: 30px;
          }
          &.tick {
            max-width: 25px;
          }
        }
      }
    }
  }
  .section {
    margin-top: 20px;
    img.section-title {
      height: 31px;
      width: unset;
      margin: 0 auto 10px;
    }
    
    p {
      font-weight: 700;
      font-size: 12px !important;
      line-height: 15px;
      margin-bottom: 10px;
      span {
        &.yellow {
          color:#FFF96F;
        }
        &.red {
          color: #FF0000;
        }
      }
    }
    span.note {
      color: #CCFF00;
      font-weight: 700;
      font-size: 12px;
      line-height: 15px;
      margin-bottom: 10px;
    }
  }
}
// .download-container {
//   padding: 14px;
//   background-color: #1d241b;
//   border: 2px solid #575d53;
//   border-radius: 8px;
//   .claim-btn,
//   .download-btn {
//     width: 100%;
//     height: 48px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 5px;
//     background: url(../../../assets/images/index/btn-bg-green-large.png) no-repeat center center;
//     background-size: contain;
//     color: #000;
//     font-weight: 700;
//     font-family: Poppins;
//     font-size: 14px;
//     margin-top: 10px;
//     &.disabled {
//       filter: grayscale(90%);
//       cursor: not-allowed;
//       pointer-events: none;
//       color: gray;
//     }
//   }
// }
.scrollable-table {
  width: 100%;
  overflow: auto;
}
.content-table {
  margin-top: 20px;
  white-space: break-spaces !important;
  thead {
    background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);

    th {
      background: unset !important;
      font-weight: 700;
      font-size: 7px;
    }
  }
  tbody {
    tr {
      background: none !important;
      
        td {
          background-color: #121829 !important;
        }
    }
  }
}

// .get-bonus-info-container,
// .things-to-note-container {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-top: 30px;
//   img {
//     width: 90% !important;
//   }
// }

// .terms-and-conditions-container {
//   margin-top: 40px;
//   img {
//     margin-bottom: 20px !important;
//   }
//   li {
//     margin-bottom: 6px !important;
//   }
// }
</style>
