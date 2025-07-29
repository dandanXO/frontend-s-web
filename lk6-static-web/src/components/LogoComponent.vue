<template>
    <div class="acc-dialog-homelogo">
        <img src="../assets/lucky-6-logo.svg" height="45px" class="clover-logo" />
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
    // display: inline-block;
    // animation: cloverPulse 3s ease-in-out infinite;
    // transform-origin: center;
}
</style>