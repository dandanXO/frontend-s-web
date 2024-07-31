<template>
  <div class="negativeprofit">
    <div class="coin">
      <img src="../../../assets/promo/cash_back.png" />
    </div>
    <div class="input">
      <label>{{ $t("lang.vipoker_netlossbonus") }}</label>
      <q-form @submit="chooseNewLossBonus">
        <div class="insert-lucky-num">
          <q-input v-model="newLossBonus" placeholder="0" type="number" readonly outlined dense />
        </div>
      </q-form>
      <q-btn
        :disable="!canClaim"
        color="brightbtn"
        style="width: 100%; max-width: 200px"
        no-caps
        :loading="newLossBonusBtnLoading"
        @click="canClaim && chooseNewLossBonus()"
        :label="$t('lang.vipoker_claim_now')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineProps } from "vue";
import { submitSlotNewLossBonus, refundSlotBonus, gettT88Detail, claimT88Reward } from "../../../api/index/promo";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";

const $q = useQuasar();
const { t } = useI18n();
const newLossBonus = ref(null);
const newLossBonusBtnLoading = ref(false);
const props = defineProps(["promoCode", "params"]);
const canClaim = ref(false);
function chooseNewLossBonus() {
  newLossBonusBtnLoading.value = true;

  claimT88Reward(props.promoCode)
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          type: "positive",
          position: "top",
          message: t("lang.vipoker_submit_successfully"),
          icon: "check_circle_outline"
        });
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
    .finally(() => {
      newLossBonusBtnLoading.value = false;
    });
}

const getRefundSlotBonus = () => {
  gettT88Detail(props.promoCode).then((res) => {
    if (res.code === 0) {
      newLossBonus.value = res.data.betAmount;
      canClaim.value = res.data.canClaim;
    }
  });
};

onMounted(() => {
  getRefundSlotBonus();
});
</script>

<style lang="scss" scoped>
.negativeprofit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;

  .coin {
    img {
      display: block;
      max-width: 200px;
      margin: auto;
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
