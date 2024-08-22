<template>
    <div class="action-button-wrapper">
        <div class="action-button" @click="goToDeposit">
            点击{{ props.tab }}
        </div>
    </div>
</template>

<script setup>
import './styles.scss';
import { useRouter } from "vue-router";

const router = useRouter();

const goToDeposit = () => {
    const promoCode = getPromoCode();
    
    router.push(`/center/deposit?privilegeCode=${promoCode}`);
}

const getPromoCode = () => {
    if(props.type === '体育') {
        return 'lh1-sport-ftd';
    } else if(props.type === '电竞') {
        return 'lh1-esport-ftd';
    } else if(props.type === '真人' && props.tab === '首存') {
        return 'lh1-live-ftd';
    } else if(props.type === '真人' && props.tab === '复存') {
        return 'lh1-live-ftd-2';
    } else if(props.type === '电子' && props.tab === '首存') {
        return 'lh1-slot-ftd';
    } else if(props.type === '电子' && props.tab === '复存') {
        return 'lh1-slot-ftd-2';
    } else if(props.type === '棋牌' && props.tab === '首存') {
        return 'lh1-poker-ftd';
    } else if(props.type === '棋牌' && props.tab === '复存') {
        return 'lh1-poker-ftd-2';
    } else if(props.type === '捕鱼' && props.tab === '首存') {
        return 'lh1-fishing-ftd';
    } else if(props.type === '捕鱼' && props.tab === '复存') {
        return 'lh1-fishing-ftd-2';
    }

    return '';
}

const props = defineProps(['tab', 'type']);
</script>

<style lang="scss">
.action-button-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 10px;

    .action-button {
        width: 220px;
        aspect-ratio: 290 / 93;
        margin: 0 auto;
        background: url('../../../assets/images/promotion/hotpromo/ftd/first-deposit-btn.png') no-repeat center center;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        font-family: 'FZHanZhenGuangBiaoS-GB';
        font-size: 24px;
        font-weight: bold;
        line-height: 42.75px;
        color: #2E1900;
        cursor: pointer;

        &:hover {
            filter: brightness(1.1);
        }

        &:active {
            transform: translateY(2px);
        }
    }
}
</style>