<template>
  <div class="row" style="display: flex; flex-direction: column; align-items: center">
    <img src="../../../assets/promo/hongbaoyu2024/red-packet.png" style="width: 66%" />
    <div class="col">
      <q-btn
        color="brightbtn"
        style="width: 100%; max-width: 200px"
        no-caps
        :loading="newLossBonusBtnLoading"
        @click="onClickClaimNow()"
        :label="$t('lang.vipoker_claim_now')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { claimBonusItem } from "../../../api/index/promo";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
const props = defineProps(["promoCode"]);
const { t } = useI18n();
const $q = useQuasar();
const newLossBonusBtnLoading = ref(false);
const onClickClaimNow = () => {
  newLossBonusBtnLoading.value = true;
  claimBonusItem(props.promoCode)
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
};
onMounted(() => {});
</script>

<style lang="scss" scoped>
.el-input__inner {
  text-align: center;
}
.row {
  display: flex;
  justify-content: center;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.action-btn {
  width: 250px;
  height: 45px;
}
.disabled-btn {
  background: #cccccc !important;
  color: #666666;
  border: 1px solid #999999;
  box-shadow: unset;
}
</style>
