<template>
    <div class="row">
        <div class="col">
            <img width="300" height="280" src="../../../assets/images/promotion/hotpromo/penny-bank/penny-bank-redpacket.png" />
            <div class="btn-color-blue standard-button action-btn" @click="onClickLotteryNow">{{ t('promo.btn_lottery_now') }}</div>
        </div>
        <div class="col">
            <img width="300" height="280" src="../../../assets/images/promotion/hotpromo/penny-bank/penny-bank-pig.png" />
            <div class="btn-color-blue standard-button action-btn" @click="onClickClaimNow">{{ t('promo.btn_claim_now') }}</div>
        </div>
    </div>
</template>

<script setup>
import { } from 'vue';
import { piggyBankGetLottery, piggyBankClaim } from '../../../api/index/promo';
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const onClickLotteryNow = () => {
    piggyBankGetLottery().then((res) => {
    })
}

const onClickClaimNow = () => {
    piggyBankClaim().then((res) => {
    })
}

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
}

.action-btn {
    width: 250px;
    height: 45px;
}
</style>