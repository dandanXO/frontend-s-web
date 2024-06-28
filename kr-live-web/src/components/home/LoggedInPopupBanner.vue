<template>
    <q-dialog v-model="isFirstBannerVisible" no-route-dismiss persistent :backdrop-filter="'blur(4px)'">
        <div class="login-popup-banner-1-container">
            <div class="content">
                <img class="corner-logo-img" :src="require('../../assets/home/loginPopup/kr-logo.png')" />
                <img class="banner-title-img" :src="require('/src/assets/home/loginPopup/banner-1-title.png')" />
                <div class="section">
                    공지 및 규정을 꼭 숙지하시기 바랍니다
                </div>
                <div class="agree-checkbox">
                    <q-checkbox v-model="isAgreeFirstBannerTermsConditions" color="primary" checked-icon="check_circle"
                        unchecked-icon="radio_button_unchecked" keep-color />
                    <span>사용자가 클릭하여 닫기에 동의합니다</span>
                </div>
                <q-btn class="primary-button yellow" :label="'나는 동의한다'" :disable="!isAgreeFirstBannerTermsConditions"
                    @click="closeFirstBanner" />
            </div>
        </div>
    </q-dialog>

    <q-dialog v-model="isSecondBannerVisible" no-route-dismiss persistent :backdrop-filter="'blur(4px)'">
        <div class="login-popup-banner-2-container">
            <div class="content">
                <img class="corner-logo-img" :src="require('../../assets/home/loginPopup/kr-logo.png')" />
                <img class="banner-title-img" :src="require('/src/assets/home/loginPopup/banner-2-title.png')" />
                <div class="section">
                    24시간 항시 상황실과 각 게임사가 공조하여, 입급내역 게임내역을 모니터링하고 있습니다.
                </div>
                <div class="section">
                    게임사 검토 결과 양방베팅으로 분류 될 시 당첨금은 물론 원금까지 전액 몰수됩니다.
                </div>
                <div class="section">
                    정상게임하시는 회원님들은 신경쓰지  않으셔도 되는 내용입니다
                </div>
                <div class="agree-checkbox">
                    <q-checkbox v-model="isAgreeSecondBannerTermsConditions" color="primary" checked-icon="check_circle"
                        unchecked-icon="radio_button_unchecked" keep-color />
                    <span>사용자가 클릭하여 닫기에 동의합니다</span>
                </div>
                <q-btn class="primary-button yellow" :label="'나는 동의한다'" :disable="!isAgreeSecondBannerTermsConditions"
                    @click="closeSecondBanner" />
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { userStore } from "stores/index";
import { storeToRefs } from "pinia";

const isFirstBannerVisible = ref(false);
const isSecondBannerVisible = ref(false);
const isAgreeFirstBannerTermsConditions = ref(false);
const isAgreeSecondBannerTermsConditions = ref(false);
const store = userStore();
const { token } = storeToRefs(store);

watch(() => token.value, () => {
    sessionStorage.setItem('showLoginPopupBanner', '1');
    isFirstBannerVisible.value = true;
})

onMounted(() => {
    if (token && sessionStorage.getItem('showLoginPopupBanner') === '1') {
        isFirstBannerVisible.value = true;
    } else if (token && sessionStorage.getItem('showLoginPopupBanner') === '2') {
        isSecondBannerVisible.value = true;
    }
})

const closeFirstBanner = () => {
    isFirstBannerVisible.value = false;
    sessionStorage.setItem('showLoginPopupBanner', '2');
    isSecondBannerVisible.value = true;
}

const closeSecondBanner = () => {
    isSecondBannerVisible.value = false;
    sessionStorage.removeItem('showLoginPopupBanner');
}
</script>

<style lang="scss" scoped>
.login-popup-banner-1-container {
    padding: 70px;

    .corner-logo-img {
        position: absolute;
        top: -50px;
        right: -50px;
        width: 150px;
    }

    .banner-title-img {
        aspect-ratio: 192 / 222;
        width: 45%;
        padding: 20px;
    }

    .content {
        position: relative;
        background: url('../../assets/home/loginPopup/popup-1-bg.png') no-repeat center center;
        background-size: 100% 100%;
        background-position: center center;
        aspect-ratio: 600 / 1000;
        height: 600px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        justify-content: center;
        align-items: center;
    }

    .section {
        background: url('../../assets/home/loginPopup/section-bg.png') no-repeat center center;
        background-size: 100% 100%;
        background-position: center center;
        aspect-ratio: 460 / 96;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80%;
        padding: 10px 25px;
        font-size: 12px;
        text-align: center;
    }

    .agree-checkbox {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: calc(80% + 25px);
    }

    .primary-button {
        margin: 0;
    }
}

.login-popup-banner-2-container {
    padding: 70px;

    .corner-logo-img {
        position: absolute;
        top: -50px;
        right: -50px;
        width: 150px;
    }

    .banner-title-img {
        aspect-ratio: 324 / 353;
        width: 50%;
    }

    .content {
        position: relative;
        background: url('../../assets/home/loginPopup/popup-2-bg.png') no-repeat center center;
        background-size: 100% 100%;
        background-position: center center;
        aspect-ratio: 600 / 1000;
        height: 600px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }

    .section {
        background: url('../../assets/home/loginPopup/section-bg.png') no-repeat center center;
        background-size: 100% 100%;
        background-position: center center;
        aspect-ratio: 460 / 96;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80%;
        padding: 10px 25px;
        font-size: 12px;
        text-align: center;
    }

    .agree-checkbox {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: calc(80% + 25px);
    }

    .primary-button {
        margin: 0;
    }
}
</style>