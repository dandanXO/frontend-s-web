<template>
    <div class="acc-dialog-homelogo">
        <img src="../assets/home/auth/login-logo-left.png" height="45px" class="clover-logo" />
        <img v-if="languageVal === 'en'" src="../assets/home/auth/login-logo-right-en.svg" height="45px" />
        <img v-else src="../assets/home/auth/login-logo-right.svg" height="45px" />
    </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { i18nStore } from '@/store/language'

const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)
</script>
<style lang="scss" scoped>
.acc-dialog-homelogo {
    display: flex;
    gap: 5px;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

@keyframes cloverPulse {
    0% {
        transform: scale(1) rotate(0deg);
    }

    50% {
        transform: scale(1.05) rotate(2deg);
    }

    100% {
        transform: scale(1) rotate(0deg);
    }
}

.clover-logo {
    display: inline-block;
    animation: cloverPulse 3s ease-in-out infinite;
    transform-origin: center;
}
</style>