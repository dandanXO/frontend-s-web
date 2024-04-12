<template>
    <div class="row">
        <img src="../../../assets/images/promotion/hotpromo/poker-cashback/poker-cashback-cards.png" />
        <div class="col">
            <div class="row">
                <div>{{ t('promo.net_work_bonus') }}</div>
                <el-input style="text-align:center;" v-model="claimAmt" :readonly="true" />
            </div>
            <div class="btn-color-blue standard-button action-btn" @click="onClickClaimNow">{{ t('promo.btn_claim_now') }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { bonusClaimPokerRefund, getBonusPokerCashback } from '../../../api/index/promo';
import { useI18n } from "vue-i18n";


const { t } = useI18n();
const claimAmt = ref(0)
const getAmount = () => {
    getBonusPokerCashback().then((res) => {
        if (res.code === 0) {
            claimAmt.value = res.data;
        } else {
            ElMessage.error(res.message)
        }
    })
}
const onClickClaimNow = () => {
    bonusClaimPokerRefund().then((res) => {
        if (res.code === 0) {
          ElMessage.success(t('common.claimedSuccess'))
        } else {
            ElMessage.error(res.message)
        }
    })
}
onMounted(() => {
    getAmount();
})
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
</style>