<template>
  <div class="negativeprofit">
    <div class="coin">
      <img src="../../../assets/images/promo/hotpromo/vipennybank/penny-redpacket.png" />
    </div>
    <div class="input">
      <q-btn
        color="brightbtn"
        style="width: 100%; max-width: 200px"
        no-caps
        :loading="btnLoading"
        @click="postPiggyBankLottery()"
        :label="$t('lang.vipenny_lottery_now')"
      />
    </div>
  </div>

  <div class="negativeprofit">
    <div class="coin">
      <img src="../../../assets/images/promo/hotpromo/vipennybank/penny-pig.png" />

      <div class="piggy-amount" v-if="lotteryAmount > 0">{{ lotteryAmount }} VNDP</div>
    </div>
    <div class="input">
      <q-btn
        color="brightbtn"
        style="width: 100%; max-width: 200px"
        no-caps
        :loading="btnLoading"
        @click="putPiggyBankClaim()"
        :label="$t('lang.vipenny_claim_now')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { submitPiggyBankLottery, submitPiggyBankClaim, getPiggyBankAmt } from "../../../api/index/promo";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";

const { t } = useI18n();
const newLossBonus = ref(null);
const btnLoading = ref(false);
const lotteryAmount = ref(0);
const $q = useQuasar();

// piggy-bank/getLottery
const postPiggyBankLottery = () => {
  btnLoading.value = true;

  submitPiggyBankLottery()
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          type: "positive",
          position: "top",
          message: t("lang.vipoker_submit_successfully"),
          icon: "check_circle_outline"
        });

        lotteryAmount.value += res.data;
      }
    })
    .catch(() => {})
    .then(() => {
      btnLoading.value = false;
    });
};

// piggy-bank/claim
const putPiggyBankClaim = () => {
  btnLoading.value = true;

  submitPiggyBankClaim()
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          type: "positive",
          position: "top",
          message: t("lang.vipoker_submit_successfully"),
          icon: "check_circle_outline"
        });
      }
    })
    .catch(() => {})
    .then(() => {
      btnLoading.value = false;
    });
};

const loadPiggyBankAmt = () => {
  getPiggyBankAmt().then((res) => {
    if (res.code === 0) {
      lotteryAmount.value = res.data;
    }
  });
};

// /piggy-bank/amount
onMounted(() => {
  loadPiggyBankAmt();
});
</script>

<style lang="scss" scoped>
.negativeprofit {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  .coin {
    position: relative;

    img {
      display: block;
      max-width: 200px;
      margin: auto;
    }

    .piggy-amount {
      position: absolute;
      text-align: center;
      bottom: 45px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
    }
  }

  .input {
    display: flex;
    flex-direction: column;
    gap: 12px;

    label {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
