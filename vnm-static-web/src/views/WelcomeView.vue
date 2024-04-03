<template>
    <div class="welcome-page-container">
        <div class="center">
            <div class="logo">
                {{ $t('welcome.congrats') }}
            </div>
            <div class="welcome-slides">
                <div class="welcome-slide card-bg">
                    <div class="slide-title">{{ $t('welcome.compatibleDevices') }}</div>
                    <img class="banner" src="../assets/home/auth/welcome-4-types-icon.png" />
                    <div>{{ $t('welcome.technologyLead') }}</div>
                    <img class="supported-platforms-img" src="../assets/home/auth/welcome-supported-platforms.png" />
                    <div class="qr-codes">
                        <template v-for="(det, idx) in platforms" :key="idx">
                            <div class="platform-qr-code">
                                <VueQRCodeComponent :size="100" :text="det.link" />
                                <div class="label-desc-wrapper">
                                    <span class="label">{{ det.name }}</span>
                                    <a v-if="det.mobile" :href="det.mobile" target="_blank">{{ det.mobile }}</a>
                                    <!-- <span v-else>{{ $t('welcome.mobileUsers') }}</span> -->
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="welcome-slide center-slide card-bg">
                    <!-- <img class="ribbon" src="../assets/home/auth/welcome-slide-ribbon.png" /> -->
                    <div class="slide-title">{{ $t('welcome.instantDeposit') }}</div>
                    <img class="banner" src="../assets/home/auth/welcome-84-percent-icon.png" />
                    <div class="grey-card-bg">
                        <div class="list">{{ $t('welcome.yourFirstDeposit') }}</div>
                        <div class="list white-space-nowrap"><img src="../assets/home/auth/welcome-slide-bullet-icon.png"/>{{ $t('welcome.firstDepositBonus') }}</div>
                        <div class="list white-space-nowrap"><img src="../assets/home/auth/welcome-slide-bullet-icon.png"/>{{ $t('welcome.completeBeginnerTasks') }}</div>
                        <div class="list white-space-nowrap"><img src="../assets/home/auth/welcome-slide-bullet-icon.png"/>{{ $t('welcome.dailyCashback') }}</div>
                        <div class="list white-space-nowrap"><img src="../assets/home/auth/welcome-slide-bullet-icon.png"/>{{ $t('welcome.dailyInsuranceBets') }}</div>
                    </div>
                    <router-link to="/center/deposit" class="blue-bg deposit-btn">{{ $t('welcome.depositNow') }}</router-link>
                </div>
                <div class="welcome-slide card-bg">
                    <div class="slide-title">{{ $t('welcome.popularEsportsEvents') }}</div>
                    <img class="banner" src="../assets/home/auth/welcome-17-types-icon.png" />
                    <img class="hot-games-img" src="../assets/home/auth/welcome-hot-games.png" />
                    <div style="margin:15px 10px 5px;">...{{ $t('welcome.moreGames') }}</div>
                    <router-link to="/esports"  class="blue-bg proceed-btn">{{ $t('welcome.proceedNow') }}</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import VueQRCodeComponent from 'vue-qrcode-component';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const platforms = ref([
    {
    code: "QZ",
    name: t('welcome.webapp'),
    link: "https://m.e8386.com",
    },
    {
    code: "DJ",
    name: t('welcome.esportapp'),
    link: "https://m.e8386.com",
    }
]);

</script>

<style lang="scss" scoped>

.white-space-nowrap{
    white-space: nowrap;
}

.supported-platforms-img {
    width: 100%;
    margin: 20px 0px;
}

.qr-codes {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 100%;

    .platform-qr-code {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        display: flex;

        .label-desc-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            margin: 10px 0px 0px;

            .label {
                color: #3F8CFF;
            }

            .desc {
                color: #7A80A1;
            }
        }

        .supported-mobile-os {
            display: flex;
            align-items: center;
            justify-content: center;

            span {
                line-height: 29px;
                padding: 0px 3px;
            }
        }
    }
}

.blue-bg {
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
    color: #fff;
    font-size: 14px;
    border-radius: 30px;
}

.deposit-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    min-height: 45px;
    margin: 30px 0px 10px;
}

.proceed-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin:15px 0px;
    min-width: 150px;
    min-height: 45px;
}

.welcome-slides {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 50px;
    align-items: center;
    font-family: 'PingFang SC';
    font-weight: bold;

    .welcome-slide {
        display: flex;
        flex-direction: column;
        width: 350px;
        justify-content: flex-start;
        align-items: center;
        color: #7A80A1;
        position: relative;
        padding: 25px;

        .slide-title {
            font-weight: 700;
            font-size: 18px;
        }

        .list {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 5px 0px;
            white-space: pre-wrap;
        }

        .banner {
            width: 140px;
        }

        .hot-games-img {
            width: 100%;
        }

        &.center-slide {
            width: 470px;

            .banner {
                width: 100%;
            }

            .ribbon {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 133px;
            }
        }

        .grey-card-bg {
            width: 100%;
            background-color: #F7F8FB;
            border-radius: 10px;
            padding: 20px;

            .highlighted {
                background: linear-gradient(180deg, #FFDC5F 0%, #EC0808 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }
}

.welcome-page-container {
    width: 100%;
    min-height: 100vh;
    height: 100%;
    background: url("@/assets/home/auth/login-page-bg.jpg") no-repeat center center;
    background-size: cover;
    display: flex;
    .logo {
        font-size: 30px;
        font-weight: bold;
    background: linear-gradient(#47a9ff 50%, #de62f9);
    -webkit-background-clip: text;
    color: transparent;
    }
}

.center {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;
    margin: 5% auto;
    width: 100%;
    max-width: 900px;
}

.logo img {
    width: 100%;
}

.card-bg {
    background-color: #FFFFFF;
    box-shadow: 0px 0px 10px 0px #0000001A;
    border-radius: 10px;
}
</style>