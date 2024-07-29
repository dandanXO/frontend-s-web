<template>
  <div class="row">
    <img src="../../../assets/images/promotion/hotpromo/hongbaoyu2024/red-packet.png" width="250" />
    <div class="col">
      <div class="btn-color-blue standard-button action-btn" @click="onClickClaimNow">
        {{ t("promo.btn_claim_now") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { ElMessage } from "element-plus";
import { claimBonusItem } from "../../../api/index/promo";
import { useI18n } from "vue-i18n";
const props = defineProps(["promoCode"]);
const { t } = useI18n();
const onClickClaimNow = () => {
  claimBonusItem(props.promoCode).then((res) => {
    if (res.code === 0) {
      ElMessage.success(t("common.claimedSuccess"));
    } else {
      ElMessage.error(res.message);
    }
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
