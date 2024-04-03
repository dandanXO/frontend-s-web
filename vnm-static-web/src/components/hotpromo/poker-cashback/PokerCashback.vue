<template>
    <div class="row">
        <img src="../../../assets/images/promotion/hotpromo/poker-cashback/poker-cashback-cards.png" />
        <div class="col">
            <div class="row">
                <div>{{ t('promo.net_work_bonus') }}</div>
                <el-input />
            </div>
            <div class="btn-color-blue standard-button action-btn" @click="onClickClaimNow">{{ t('promo.btn_claim_now') }}</div>
        </div>
    </div>
</template>

<script setup>
import { bonusClaimSlotsRefund } from '../../../api/index/promo';
import { useI18n } from "vue-i18n";


const { t } = useI18n();
const onClickClaimNow = () => {
    bonusClaimSlotsRefund().then((res) => {

    })
}
</script>

<style lang="scss" scoped>
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
</style>