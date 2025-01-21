<template>
  <div>
    <div class="download-container">
      <span>
        {{ $t("hotPromo.appLoginBonus.newlyRegistered1") }}
        <span style="color: #faff00">{{ $t("hotPromo.appLoginBonus.win7") }}</span>
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

    <table class="content-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
      <thead>
        <tr>
          <th>{{ $t("hotPromo.appLoginBonus.beginnersGuide") }}</th>
          <th>R{{ $t("hotPromo.appLoginBonus.rewardDetails") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span>
              {{ $t("hotPromo.appLoginBonus.beginnersGuideTxt1_1") }}
              <span style="color: #00ff80">{{ $t("hotPromo.appLoginBonus.win7game") }}</span>
              {{ $t("hotPromo.appLoginBonus.beginnersGuideTxt1_2") }}
            </span>
          </td>
          <td rowspan="2">
            <span>
              {{ $t("hotPromo.appLoginBonus.rewardDetailTxt1") }}
              <span style="color: #ff9500">{{ $t("hotPromo.appLoginBonus.bdt888") }}</span>
              {{ $t("hotPromo.appLoginBonus.rewardDetailTxt2") }}
              <br />
              <span style="color: #ff0000; display: block; margin-top: 10px">
                {{ $t("hotPromo.appLoginBonus.rewardDetailTxt3") }}
              </span>
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span>{{ $t("hotPromo.appLoginBonus.beginnersGuideTxt2") }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="things-to-note-container">
      <img src="../../../assets/images/promotion/hotpromo/app-login-bonus/things-to-note-title.png" />
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
      <img src="../../../assets/images/promotion/hotpromo/app-login-bonus/get-bonus-info-title.png" />
      <span>
        <br />
        {{ $t("hotPromo.appLoginBonus.downloadAndInstall1") }}
        <span style="color: #00ff80cc">{{ $t("hotPromo.appLoginBonus.win7game") }}</span>
        {{ $t("hotPromo.appLoginBonus.downloadAndInstall2") }}
        <br />
        <br />
        {{ $t("hotPromo.appLoginBonus.downloadAndInstall3") }}
        <span style="color: #00ff80cc">{{ $t("hotPromo.appLoginBonus.win7game") }}</span>
        {{ $t("hotPromo.appLoginBonus.downloadAndInstall4") }}
        <br />
        <br />
        {{ $t("hotPromo.appLoginBonus.downloadAndInstall5") }}
        <span style="color: #00ff80cc">{{ $t("hotPromo.appLoginBonus.win7game") }}</span>
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
    </div>
    <div class="terms-and-conditions-container">
      <img src="../../../assets/images/promotion/hotpromo/app-login-bonus/terms-and-conditions-title.png" />
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
      </ul>
    </div>
  </div>
  <BindEmailModal :bindEmailDialog="bindEmailDialog" @update:bindEmailDialog="bindEmailDialog = $event" />
  <CongratsReuseableModal
    :isShowDialog="isShowReceiveDialog"
    :bonusAmount="bonusAmount"
    @handleBtnClick="handleReceiveBonus"
  />
</template>
<script setup>
import { ref, onMounted } from "vue";
import { userStore } from "src/stores";
import { eventapi } from "src/boot/axios";
import BindEmailModal from "src/components/modal/BindEmailModal.vue";
import { useUI } from "stores/ui";
import CongratsReuseableModal from "src/components/modal/CongratsReuseableModal.vue";

const props = defineProps(["promocode"]);
const store = userStore();
const ui = useUI();

const bindEmailDialog = ref(false);
const isShowReceiveDialog = ref(false);
const hasBindEmail = ref(false);
const hadClaim = ref(false);
const isAppLogin = ref(false);
const bonusAmount = ref(0);

const handleClaimBtnClick = () => {
  if (hasBindEmail.value) {
    claimAppLoginBonus();
  } else {
    // bind email
    bindEmailDialog.value = true;
  }
};

const claimAppLoginBonus = () => {
  eventapi
    .post(`/session/app-login-bonus/claimBonus?promoCode=${props.promocode}`)
    .then((res) => {
      if (res.code === 0) {
        bonusAmount.value = res.data;
      }
    })
    .catch(() => {});
};
const getAppLoginBonusData = () => {
  eventapi.get(`/session/app-login-bonus/init?promoCode=${props.promocode}`).then((res) => {
    if (res.code === 0) {
      hasBindEmail.value = res.data.hasBindEmail;
      hadClaim.value = res.data.hadClaim;
      isAppLogin.value = res.data.isAppLogin;
    }
  });
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
.download-container {
  padding: 14px;
  background-color: #1d241b;
  border: 2px solid #575d53;
  border-radius: 8px;
  .claim-btn,
  .download-btn {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background: url(../../../assets/images/index/btn-bg-green-large.png) no-repeat center center;
    background-size: contain;
    color: #000;
    font-weight: 700;
    font-family: Poppins;
    font-size: 14px;
    margin-top: 10px;
    &.disabled {
      filter: grayscale(90%);
      cursor: not-allowed;
      pointer-events: none;
      color: gray;
    }
  }
}

.content-table {
  margin-top: 20px;
  thead {
    th {
      font-weight: 700;
      font-size: 12px;
    }
  }
  tbody {
    tr {
      background: none !important;
      &:nth-child(even) {
        td {
          background-color: #70bc621a !important;
        }
      }
      &:nth-child(odd) {
        td {
          background-color: transparent !important;
        }
      }
    }
  }
}

.get-bonus-info-container,
.things-to-note-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  img {
    width: 90% !important;
  }
}

.terms-and-conditions-container {
  margin-top: 40px;
  img {
    margin-bottom: 20px !important;
  }
  li {
    margin-bottom: 6px !important;
  }
}
</style>
