<template>
    <div class="spin-lucky-wheel-promo-popup-wrapper">
        <img class="banner" src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/home-popup.png" />
        <div class="do-not-show-again-wrapper">
            <q-checkbox v-model="isDoNotShowAgain">
                Do not show again
            </q-checkbox>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
const isDoNotShowAgain = ref(false);

defineExpose({
    isDoNotShowAgain
})
</script>
<style lang="scss" scoped>
.spin-lucky-wheel-promo-popup-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;
    
    .banner {
        max-width: 90%;
        width: 100%;
    }

    .do-not-show-again-wrapper {
        background-color: #1E1F24;
        border: 1px solid rgb(255 255 255 / 10%);
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: 10px;
        border-radius: 4px;
    }
}
</style>