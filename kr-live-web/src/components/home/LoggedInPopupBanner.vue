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

    @media (max-width: 600px) {
        padding: 60px;
    }

    @media (max-width: 450px) {
        padding: 50px;
    }

    .corner-logo-img {
        position: absolute;
        top: -50px;
        right: -50px;
        width: 150px;

        @media (max-width: 600px) {
            top: -50px;
            right: -40px;
            width: 130px;
        }

        @media (max-width: 450px) {
            top: -45px;
            right: -35px;
            width: 120px;
        }
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
        width: 350px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        justify-content: center;
        align-items: center;

        @media (max-width: 600px) {
            width: 300px;
        }

        @media (max-width: 450px) {
            width: 250px;
        }
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

        @media (max-width: 600px) {
            font-size: 10px;
        }

        @media (max-width: 450px) {
            font-size: 9px;
        }
    }

    .agree-checkbox {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: calc(80% + 25px);

        @media (max-width: 600px) {
            font-size: 10px;
        }

        @media (max-width: 450px) {
            font-size: 9px;
        }
    }

    .primary-button {
        margin: 0;

        @media (max-width: 600px) {
            min-width: 100px;
            width: 100px;
            height: 35px;
            font-size: 10px;
        }

        @media (max-width: 450px) {
            font-size: 9px;
            height: 30px;
        }
    }
}

.login-popup-banner-2-container {
    padding: 70px;

    @media (max-width: 600px) {
        padding: 60px;
    }

    @media (max-width: 450px) {
        padding: 50px;
    }

    .corner-logo-img {
        position: absolute;
        top: -50px;
        right: -50px;
        width: 150px;

        @media (max-width: 600px) {
            top: -50px;
            right: -40px;
            width: 130px;
        }

        @media (max-width: 450px) {
            top: -45px;
            right: -35px;
            width: 120px;
        }
    }

    .banner-title-img {
        aspect-ratio: 324 / 353;
        width: 50%;

        @media (max-width: 600px) {
            width: 45%;
        }

        @media (max-width: 450px) {
            width: 40%;
        }
    }

    .content {
        position: relative;
        background: url('../../assets/home/loginPopup/popup-2-bg.png') no-repeat center center;
        background-size: 100% 100%;
        background-position: center center;
        aspect-ratio: 600 / 1000;
        width: 350px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: center;
        align-items: center;

        @media (max-width: 600px) {
            width: 300px;
        }

        @media (max-width: 450px) {
            width: 250px;
        }
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

        @media (max-width: 600px) {
            font-size: 10px;
        }

        @media (max-width: 450px) {
            font-size: 9px;
        }
    }

    .agree-checkbox {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: calc(80% + 25px);

        @media (max-width: 600px) {
            font-size: 10px;
        }

        @media (max-width: 450px) {
            font-size: 9px;
        }
    }

    .primary-button {
        margin: 0;

        @media (max-width: 600px) {
            min-width: 100px;
            width: 100px;
            height: 35px;
            font-size: 10px;
        }

        @media (max-width: 450px) {
            font-size: 9px;
            height: 30px;
        }
    }
}
</style>