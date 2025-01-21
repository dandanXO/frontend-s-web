<template>
  <div>
    <div class="download-container">
      <span>
        Newly registered
        <span style="color: #faff00">WIN7</span>
        members, download and install the application, and get random free bonuses, up to
        <span style="color: #00ffc3">888BDT</span>
        .
      </span>
      <div v-if="!hadClaim && isAppLogin" class="claim-btn" @click="handleClaimBtnClick">
        <span>CLAIM NOW</span>
      </div>
      <a v-else-if="!hadClaim && !isAppLogin" :href="ui.downloadAppUrl" style="text-decoration: none">
        <div class="download-btn">
          <span>DOWNLOAD APP</span>
        </div>
      </a>

      <div v-else class="claim-btn disabled">
        <span>CLAIMED</span>
      </div>
    </div>

    <table class="content-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
      <thead>
        <tr>
          <th>BEGINNER'S GUIDE</th>
          <th>REWARD DETAILS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span>
              1. Follow whatsapp and subscribe to
              <span style="color: #00ff80">win7.game</span>
              channel
            </span>
          </td>
          <td rowspan="2">
            <span>
              The maximum bonus can reach
              <span style="color: #ff9500">888BDT</span>
            </span>

            <br />
            <span style="color: #ff0000; line-height: 30px">New users only</span>
          </td>
        </tr>
        <tr>
          <td>2. Associate and verify email address</td>
        </tr>
      </tbody>
    </table>

    <div class="things-to-note-container">
      <img src="../../../assets/images/promotion/hotpromo/app-login-bonus/things-to-note-title.png" />

      <span>
        <br />
        Rewards can only be claimed after logging in through the APP and completing verification
        <br />
        <br />
        Application must be
        <span style="color: #00ff80cc">downloaded</span>
        and
        <span style="color: #00ff80cc">installed</span>
      </span>
    </div>

    <div class="get-bonus-info-container">
      <img src="../../../assets/images/promotion/hotpromo/app-login-bonus/get-bonus-info-title.png" />

      <span>
        <br />
        Download and install
        <span style="color: #00ff80cc">win7.game</span>
        official application.
        <br />
        <br />
        Subscribe to
        <span style="color: #00ff80cc">win7.game</span>
        official channel
        <br />
        <br />
        WhatsApp channel:
        <span style="color: #00ff80cc">win7.game</span>
        official channel
        <br />
        <br />
        Register a member account and enter your original name (must be consistent with the name of your associated
        withdrawal account)
        <br />
        <br />
        Linked withdrawal account
        <br />
        <br />
        Enter the [Discount Center] to check and collect, and you can get a random reward of up to
        <span style="color: #00ff80cc">888BDT</span>
        .
      </span>
    </div>
    <div class="terms-and-conditions-container">
      <img src="../../../assets/images/promotion/hotpromo/app-login-bonus/terms-and-conditions-title.png" />
      <ul>
        <li>After registering as a WIN7 member and completing tasks, you will receive corresponding rewards.</li>
        <li>
          Before withdrawing, you must complete the bonus X5 turnover requirements before you can withdraw the bonus!
        </li>
        <li>
          The bank account number and any information cannot be changed before the first withdrawal request. If
          correction is required, bonuses and profits will be deducted.
        </li>
        <li>
          Each player can only receive one promotional bonus. If the system detects duplicates involving the same IP
          address, bank card or phone number, bonuses and profits will be forfeited.
        </li>
        <li>
          This promotional bonus can only be used on slot games. Please note that small and large odd and even, two-way
          games are not applicable.
        </li>
        <li>
          If a player chooses to bet on other games, such as poker, sports, electronic games, live or exclusive games,
          WIN7 reserves the right to forfeit winnings and any resulting profits.
        </li>
        <li>WIN7.GAME reserves the right to modify, suspend or cancel this event at any time.</li>
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
      // hasBindEmail.value = true;
      // isAppLogin.value = true;
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
