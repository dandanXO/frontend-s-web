<template>
    <div class="eurocup-page-bottom-banner" v-if="showEurocupPageBottomBanner">
        <img @click="closeEurocupPageBottomBanner" class="close-btn-img"
            src="@/assets/images/home/banner/close-btn.png" />
        <img class="eurocup-page-bottom-banner-img" src="@/assets/images/home/banner/eurocup-page-bottom-banner.png" />
    </div>
</template>

<script setup>
import { ref } from "vue";

const showEurocupPageBottomBanner = ref(sessionStorage.getItem('eurocupPageBottomBanner') === null);

const closeEurocupPageBottomBanner = () => {
    sessionStorage.setItem('eurocupPageBottomBanner', '1');
    showEurocupPageBottomBanner.value = false;
}

</script>

<style scoped lang="scss">
.eurocup-page-bottom-banner {
    position: fixed;
    bottom: 0;
    z-index: 9999999999;

    .close-btn-img {
        position: absolute;
        right: 10px;
        top: 5px;
        cursor: pointer;
    }

    .eurocup-page-bottom-banner-img {
        width: 100%;
    }
}
</style>