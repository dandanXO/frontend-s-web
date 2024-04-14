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
}
</style>