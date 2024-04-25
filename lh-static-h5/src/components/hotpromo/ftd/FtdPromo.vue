<template>
    <div class="banner-wrapper">
        <div class="genie-wrapper">
            <div class="genie-ball-wrapper">
                <img class="genie-ball" src="../../../assets/images/promo/hotpromo/ftd/genie-ball.png" />
                <span class="genie-ball-text">{{ currentType }}</span>
            </div>
        </div>

        <div class="tab-wrapper">
            <div class="tab" :class="t === currentType ? 'active-tab' : ''" v-for="t, index in typesArr" :key="index" @click="switchType(index)">{{ t }}首存</div>
        </div>

        <div class="content-wrapper">
            <div class="second-tab-wrapper">
                <img style="width:50px;" src="../../../assets/images/promo/hotpromo/ftd/left-decor.png" />
                <div class="second-tab-content-wrapper" :class="tabArr.length === 1 ? 'mono-tab' : ''">
                    <div class="tab" v-for="t,index in tabArr" :key="index" :class="t === currentTab ? 'active-tab' : ''" @click="switchTab(index)">
                        <span class="tab-label">{{ t }}优惠</span>
                    </div>
                </div>
                <img style="width:50px" src="../../../assets/images/promo/hotpromo/ftd/right-decor.png" />
            </div>
            <div class="separator-wrapper">
                <img class="separator" v-if="currentTab === '首存'" src="../../../assets/images/promo/hotpromo/ftd/first-deposit-separator.png" />
                <img class="separator" v-else-if="currentTab === '复存'" src="../../../assets/images/promo/hotpromo/ftd/consecutive-deposit-separator.png" />
            </div>

            <ActionButtons :tab="currentTab" :type="currentType"/>

            <SportContent v-if="currentType === '体育'" :tab="currentTab" :type="currentType" />
            <EsportContent v-else-if="currentType === '电竞'" :tab="currentTab" :type="currentType" />
            <LiveContent v-else-if="currentType === '真人'" :tab="currentTab" :type="currentType" />
            <PokerContent v-else-if="currentType === '棋牌'" :tab="currentTab" :type="currentType" />
            <SlotContent v-else-if="currentType === '电子'" :tab="currentTab" :type="currentType" />
            <FishingContent v-else-if="currentType === '捕鱼'" :tab="currentTab" :type="currentType" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SportContent from './SportContent.vue';
import EsportContent from './EsportContent.vue';
import LiveContent from './LiveContent.vue';
import PokerContent from './PokerContent.vue';
import SlotContent from './SlotContent.vue';
import FishingContent from './FishingContent.vue';
import ActionButtons from './ActionButtons.vue';

const typesArr = ref(['体育', '电竞', '真人', '棋牌', '电子', '捕鱼']);
const typeIndex = ref(0);
const currentType = computed(() => {
    return typesArr.value[typeIndex.value];
});

const tabArr = computed(() => {
    if(currentType.value === '体育' || currentType.value === '电竞') {
        return ['首存'];
    }

    return ['首存', '复存'];
});
const tabIndex = ref(0);
const currentTab = computed(() => {
    return tabArr.value[tabIndex.value];
});

const switchType = (index) => {
    typeIndex.value = index;
    tabIndex.value = 0;
}

const switchTab = (index) => {
    tabIndex.value = index;
}
</script>

<style lang="scss" scoped>
    .banner-wrapper {
        width: 100%;
        min-height: 1151px;
        background: url('../../../assets/images/promo/hotpromo/ftd/bg.jpg') no-repeat top center;
        background-size: 100% 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .genie-wrapper {
            width: 100%;
            min-height: 300px;
            background: url('../../../assets/images/promo/hotpromo/ftd/genie.png') no-repeat top center;
            background-size: 100% 100%;
        }

        .genie-ball-wrapper {
            position: absolute;
            top: calc(0% + 180px);
            left: 51%;
            transform: translate(-50%, -50%);
            aspect-ratio: 321 / 319;
            width: 120px;
        }

        .genie-ball {
            aspect-ratio: 321 / 319;
            width: 120px;
	        animation: pulse 2s infinite;
        }

        .genie-ball-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            font-size: 15px;
            font-weight: bold;
            font-family: 'FZHanZhenGuangBiaoS-GB';
            background: -webkit-linear-gradient(180deg, #FFFFFF 0%, #D0ABFF 44%, #FFFFFF 100%);
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .tab-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;

            .tab {
                width: 100px;
                aspect-ratio: 184 / 63;
                background: url('../../../assets/images/promo/hotpromo/ftd/tab.png') no-repeat center center;
                background-size: 100% 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                color: #ffffff65;
                font-weight: bold;
                font-family: 'FZHanZhenGuangBiaoS-GB';
                cursor: pointer;

                &:hover {
                    filter: brightness(0.9);
                }

                &.active-tab {
                    background: url('../../../assets/images/promo/hotpromo/ftd/tab-active.png') no-repeat center center;
                    background-size: 100% 100%;
                    color: #fff;
                }
            }
        }

        .content-wrapper {
            width: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 20px;
            gap: 20px;

            .second-tab-wrapper {
                display: flex;
                align-items: center;

                .second-tab-content-wrapper {
                    width: 280px;
                    height: 39px;
                    background: url('../../../assets/images/promo/hotpromo/ftd/second-tab-bg.png') no-repeat center center;
                    background-size: 100% 100%;
                    display: flex;
                    position: relative;

                    &.mono-tab {
                        width: 150px;
                        background-size: 0% 0%;
                    }

                    .tab {
                        width: 150px;
                        height: 39px;
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-family: Microsoft YaHei UI;
                        font-size: 13px;
                        font-weight: 700;
                        line-height: 47.88px;
                        text-align: center;
                        color: #FFFFFF99;
                        position: absolute;

                        &:first-child {
                            left: 0%;
                        }

                        &:nth-child(2) {
                            right: 0%;
                        }

                        &.active-tab {
                            background: url('../../../assets/images/promo/hotpromo/ftd/second-tab-active.png') no-repeat center center;
                            background-size: 100% 100%;
                            color: #fff;
                        }

                        .tab-label {
                            position: absolute;
                        }
                    }
                }
            }

            .separator-wrapper {

                .separator {
                    aspect-ratio: 1232 / 76;
                    width: 400px;
                }
            }
        }
    }

    @keyframes pulse {
        0% {
            transform: scale(0.95);
        }

        70% {
            transform: scale(1);
        }

        100% {
            transform: scale(0.95);
        }
    }
</style>
