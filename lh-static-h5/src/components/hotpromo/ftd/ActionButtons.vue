<template>
    <div class="action-button-wrapper">
        <div class="action-button" @click="goToDeposit">
            点击{{ props.tab }}
        </div>
        <div class="action-button" @click="claimBonus">
            领取奖金
        </div>
    </div>
</template>

<script setup>
import { eventapi } from "boot/axios";
import './styles.css';
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const qs = require("qs");
const router = useRouter();

const goToDeposit = () => {
  if(window.location.pathname === "/promotion"){
    document.location.href = "app://deposit";
  }else{
    router.push("/finance/deposit");
  }
}

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
        eventapi.post('/first-deposit/claim',
            qs.stringify({
                promoCode: params.promoCode
            })
        ).then((res) => {
            const { code, data } = res;
            if (code === 0) {
                $q.notify({
                    message: data,
                    type: "positive",
                    position: "top",
                    icon: "check_circle_outline"
                });
            }
        });
    }
}

const props = defineProps(['tab', 'type']);
</script>