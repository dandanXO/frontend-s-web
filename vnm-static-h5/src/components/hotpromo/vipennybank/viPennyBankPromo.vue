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
        :loading="newLossBonusBtnLoading"
        @click="chooseNewLossBonus()"
        :label="$t('lang.vipenny_lottery_now')"
      />
    </div>
  </div>

  <div class="negativeprofit">
    <div class="coin">
      <img src="../../../assets/images/promo/hotpromo/vipennybank/penny-pig.png" />

      <div class="piggy-amount">0 VNDP</div>
    </div>
    <div class="input">
      <q-btn
        color="brightbtn"
        style="width: 100%; max-width: 200px"
        no-caps
        :loading="newLossBonusBtnLoading"
        @click="chooseNewLossBonus()"
        :label="$t('lang.vipenny_claim_now')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { submitNewLossBonus } from "../../../api/index/promo";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const newLossBonus = ref(null);
const newLossBonusBtnLoading = ref(false);

function chooseNewLossBonus() {
  newLossBonusBtnLoading.value = true;

  submitNewLossBonus(newLossBonus.value)
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          type: "positive",
          position: "top",
          message: t("lang.vipoker_submit_successfully"),
          icon: "check_circle_outline"
        });
        newLossBonus.value = null;
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });
      }
    })
    .catch(() => {})
    .then(() => {
      newLossBonusBtnLoading.value = false;
    });
}
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
      bottom: 10px;
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
