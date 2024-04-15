<template>
    <div class="apphongbao-container">
        <div class="stage-wrapper">
            <img class="stage" src="../../../assets/images/promotion/hotpromo/apphongbao/stage.png" />

            <div class="button-wrapper" @click="getPromotion">
                <img :class="`button ${bonusOpened ? 'disabled' : ''}`"
                    src="../../../assets/images/promotion/hotpromo/apphongbao/button.png" />
            </div>
        </div>

        <div class="table-wrapper">
            <img class="table" src="../../../assets/images/promotion/hotpromo/apphongbao/table.png" />
            <div class="table-data">
                <div class="row">
                    <div class="header">活动对象</div>
                    <div class="header">抽奖时段</div>
                    <div class="header">抽奖资格</div>
                    <div class="header">红包</div>
                </div>
                <div class="row">
                    <div class="content" style="width:370px">{{ params.sub }}</div>
                    <div class="content" style="width:285px">{{ params.gametime }}</div>
                    <div class="content" style="width:360px">{{ params.requirement }}</div>
                    <div class="content" style="width:290px">{{ params.hongbao }}</div>
                </div>
            </div>
        </div>

        <a class="download-button-wrapper" target="_blank" :href="downloadUrl" :title="downloadUrl">
            <img class="button" src="../../../assets/images/promotion/hotpromo/apphongbao/download-button.png" />
        </a>

        <div class="notes">
            <p>
                注：每场红包限量，抢完为止，若您抢到【谢谢惠顾】，则代表该场次限量包数已全部抽完。
            </p>
            <p>
                注：限量红包不错过，下载APP开启推播通知&优惠通知，红包雨开始前3分钟，每分钟推送提醒一次。
            </p>
        </div>

        <div class="rules-header">
            <img class="rules-header-img" src="../../../assets/images/promotion/hotpromo/apphongbao/rules-header.png" />
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import { claimDailyRainItem } from "@/api/index/promo";
import { ElMessage } from "element-plus";
import { getAppDownloadUrlFromServer } from "@/api/index/site";

const props = defineProps(["promoCode", "params"]);
const params = JSON.parse(props.params || '{}');
const promoCode = ref(props.promoCode);
const loadingClaim = ref(false);
const downloadUrl = ref("");
const bonusOpened = ref(false);

const getAppDownloadUrl = () => {
    getAppDownloadUrlFromServer().then((res) => {
        if (res.downloadPageUrl) {
            downloadUrl.value = res.downloadPageUrl
        } else {
            ElMessage.error(res.message);
        }
    })
        .catch((err) => {
            console.log(err);
        });
};

const getPromotion = () => {
    if(bonusOpened.value !== false) {
        return;
    }

    loadingClaim.value = true;
    
    claimDailyRainItem(promoCode.value)
        .then((res) => {
            loadingClaim.value = false;

            if (res.code === 0) {
                const claimedAmt = res.data.lastDigitAmount + res.data.vipAmount;
                ElMessage.success(`恭喜中奖！获得：${claimedAmt}`);

                store.getBalance();

                bonusOpened.value = true;
            } else {
                ElMessage.error(res.message);
                loadingClaim.value = false;
            }
        })
        .catch((err) => {
            loadingClaim.value = false;
            console.log(err.message);
        });
};

onMounted(() => {
    getAppDownloadUrl();
});

</script>

<style lang="scss" scoped>
.apphongbao-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;

    .stage-wrapper {
        position: relative;
        width: 778px;
        height: 566px;
    }

    img.stage {
        aspect-ratio: 778 / 566;
    }

    .button-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, 0%);
        cursor: pointer;

        img.button {
            aspect-ratio: 368 / 160;

            &:hover {
                filter: brightness(1.1);
            }

            &:active {
                transform: translateY(2px);
            }

            &.disabled {
                cursor: not-allowed;
                filter: brightness(0.5);
            }
        }
    }

    .table-wrapper {
        position: relative;
        width: 1653px;
        height: 454px;

        img.table {
            aspect-ratio: 1653 / 454;
        }

        .table-data {
            position: absolute;
            top: 0%;
            left: 50%;
            transform: translate(-50%, 0%);
            width: 80%;
            display: table;

            .row {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                align-items: center;
                justify-content: center;
                display: table-row;

                .header {
                    font-size: 1.8rem;
                    color: #FFFFFFB2;
                    text-align: center;
                    display: table-cell;
                    padding: 20px;
                    padding-top: 135px;
                }

                .content {
                    font-size: 1.5rem;
                    color: #B5A0F1;
                    text-align: center;
                    display: table-cell;
                    padding: 20px;
                    overflow: auto;
                    height: 200px;
                }
            }
        }
    }

    .download-button-wrapper {
        cursor: pointer;

        img.button {
            aspect-ratio: 314 / 113;

            &:hover {
                filter: brightness(1.1);
            }

            &:active {
                transform: translateY(2px);
            }
        }
    }

    .notes {
        margin: 0 auto;
        max-width: 1400px;
        width: 95%;
        text-align: left;
        padding: 20px;
        color: #7a8eb9;
        font-size: 20px;
    }

    .rules-header {
        margin: 0 auto;
        max-width: 1400px;
        width: 95%;
        padding: 20px;

        .rules-header-img {
            width: 100%;
        }
    }
}
</style>