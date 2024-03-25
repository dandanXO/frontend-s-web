<template>
    <div class="row">
        <img src="../../../assets/images/promotion/hotpromo/poker-cashback/poker-cashback-cards.png" />
        <div class="col">
            <div class="row">
                <div>Net loss bonus</div>
                <el-input />
            </div>
            <div class="btn-color-blue standard-button action-btn" @click="onClickClaimNow">Claim Now</div>
        </div>
    </div>
</template>

<script setup>
import { bonusClaimSlotsRefund } from '../../../api/index/promo';

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