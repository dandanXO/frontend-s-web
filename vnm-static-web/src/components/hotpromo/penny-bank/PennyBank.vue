<template>
  <div class="row">
    <div class="col">
      <img
        width="300"
        height="280"
        src="../../../assets/images/promotion/hotpromo/penny-bank/penny-bank-redpacket.png"
      />
      <div class="btn-color-blue standard-button action-btn" @click="onClickLotteryNow">
        {{ t("promo.btn_lottery_now") }}
      </div>
    </div>
    <div class="col">
      <img width="300" height="280" src="../../../assets/images/promotion/hotpromo/penny-bank/penny-bank-pig.png" />
      <div class="buttons" style="display: flex; width: 100%; gap: 12px">
        <div class="btn-color-blue standard-button action-btn" @click="onClickClaimNowSport">
          {{ t("promo.btn_claim_now_sport") }}
        </div>
        <div class="btn-color-blue standard-button action-btn" @click="onClickClaimNow">
          {{ t("promo.btn_claim_now_other") }}
        </div>
      </div>
      <div class="claimAmt">{{ claimAmt }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  piggyBankGetLottery,
  getBonusPiggyCashback,
  piggyBankClaimSport,
  piggyBankClaimOther
} from "../../../api/index/promo";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";

const { t } = useI18n();
const claimAmt = ref(0);

const getAmount = () => {
  getBonusPiggyCashback().then((res) => {
    if (res.code === 0) {
      claimAmt.value = res.data;
    } else {
      ElMessage.error(res.message);
    }
  });
};
const onClickLotteryNow = () => {
  piggyBankGetLottery().then((res) => {
    if (res.code === 0) {
      ElMessage.success(t("common.updateSuccess"));
      claimAmt.value += res.data;
    } else {
      ElMessage.error(res.message);
    }
  });
};

const onClickClaimNow = () => {
  piggyBankClaimOther().then((res) => {
    if (res.code === 0) {
      ElMessage.success(t("common.claimedSuccess"));
    } else {
      ElMessage.error(res.message);
    }
  });
};
const onClickClaimNowSport = () => {
  piggyBankClaimSport().then((res) => {
    if (res.code === 0) {
      ElMessage.success(t("common.claimedSuccess"));
    } else {
      ElMessage.error(res.message);
    }
  });
};

onMounted(() => {
  getAmount();
});
</script>
<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-evenly;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  position: relative;
}

.claimAmt {
  position: absolute;
  top: 188px;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 25px;
  text-align: center;
}

.action-btn {
  width: 250px;
  height: 45px;
}
</style>
