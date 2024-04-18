<template>
    <div class="action-button-wrapper">
        <router-link to="/center/deposit" class="action-button">
            点击{{ props.tab }}
        </router-link>
        <div class="action-button" @click="claimBonus">
            领取奖金
        </div>
    </div>
</template>

<script setup>
import './styles.css';
import { ElMessage } from "element-plus";
import { fdtPromoFirstDepositClaimBonus } from "@/api/index/promo";


const claimBonus = () => {
    const params = {}

    if(props.type === '体育') {
        params.promoCode = 'lh1-sport-ftd';
    } else if(props.type === '电竞') {
        params.promoCode = 'lh1-esport-ftd';
    } else if(props.type === '真人' && props.tab === '首存') {
        params.promoCode = 'lh1-live-ftd';
    } else if(props.type === '真人' && props.tab === '复存') {
        params.promoCode = 'lh1-live-ftd-2';
    } else if(props.type === '电子' && props.tab === '首存') {
        params.promoCode = 'lh1-slot-ftd';
    } else if(props.type === '电子' && props.tab === '复存') {
        params.promoCode = 'lh1-slot-ftd-2';
    } else if(props.type === '棋牌' && props.tab === '首存') {
        params.promoCode = 'lh1-poker-ftd';
    } else if(props.type === '棋牌' && props.tab === '复存') {
        params.promoCode = 'lh1-poker-ftd-2';
    } else if(props.type === '捕鱼' && props.tab === '首存') {
        params.promoCode = 'lh1-fishing-ftd';
    } else if(props.type === '捕鱼' && props.tab === '复存') {
        params.promoCode = 'lh1-fishing-ftd-2';
    }

    if(params.promoCode) {
        fdtPromoFirstDepositClaimBonus(params.promoCode).then((res) => {
            const { code, data, message } = res;
            if (code === 0) {
                ElMessage.success(data);
            } else {
                ElMessage.error(message);
            }
        }).catch((err) => {
            ElMessage.error(err.message);
        });
    }
}

const props = defineProps(['tab', 'type']);
</script>