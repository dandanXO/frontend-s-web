<template>
    <div class="action-button-wrapper">
        <div class="action-button" @click="goToDeposit">
            点击{{ props.tab }}
        </div>
    </div>
</template>

<script setup>
import './styles.css';
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();

const goToDeposit = () => {
    const promoCode = getPromoCode();

  if(window.location.pathname === "/promotion"){
    document.location.href = `app://deposit?privilegeCode=${promoCode}`;
  }else{
    router.push(`/finance/deposit?privilegeCode=${promoCode}`);
  }
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