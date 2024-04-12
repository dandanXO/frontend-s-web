<template>
    <div class="apphongbao-container">
        <div class="stage-wrapper">
            <img class="stage" src="../../../assets/images/promo/hotpromo/apphongbao/stage.png" />

            <div class="button-wrapper" @click="getPromotion">
                <img :class="`button ${bonusOpened ? 'disabled-btn' : ''}`"
                    src="../../../assets/images/promo/hotpromo/apphongbao/button.png" />
            </div>
        </div>

        <div class="table-wrapper">
            <img class="table" src="../../../assets/images/promo/hotpromo/apphongbao/table.png" />
            <div class="table-data">
                <div class="row">
                    <div class="header">活动对象</div>
                    <div class="header">抽奖时段</div>
                    <div class="header">抽奖资格</div>
                    <div class="header">红包</div>
                </div>
                <div class="row">
                    <div class="content" style="width:110px">{{ params.sub }}</div>
                    <div class="content" style="width:30px">{{ params.gametime }}</div>
                    <div class="content" style="width:90px">{{ params.requirement }}</div>
                    <div class="content">{{ params.hongbao }}</div>
                </div>
            </div>
        </div>

        <a class="download-button-wrapper" target="_blank" :href="downloadUrl" :title="downloadUrl">
            <img class="button" src="../../../assets/images/promo/hotpromo/apphongbao/download-button.png" />
        </a>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import { api, eventapi } from "boot/axios";
import { useQuasar } from "quasar";

const props = defineProps(["promoCode", "params"]);
const params = JSON.parse(props.params || '{}');
const promoCode = ref(props.promoCode);
const loadingClaim = ref(false);
const downloadUrl = ref("");
const bonusOpened = ref(false);
const $q = useQuasar();

const getAppDownloadUrl = () => {
    api.get("/app/getAppData?siteCode=lh1&appType=ALL_SITE").then((res) => {
        if (res.code === 0) {
            downloadUrl.value = res.data.downloadPageUrl
        } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: res.message,
              icon: "report_problem"
            });
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
    
    eventapi.get(`/redPacketVip/claim?promoCode=${promoCode.value}`)
        .then((res) => {
            loadingClaim.value = false;

            if (res.code === 0) {
                const claimedAmt = res.data.lastDigitAmount + res.data.vipAmount;
                $q.notify({
                    color: "positive",
                    position: "top",
                    message: `恭喜中奖！获得：${claimedAmt}`,
                    icon: "check_circle_outline"
                });

                store.getBalance();

                bonusOpened.value = true;
            } else {
                $q.notify({
                    color: "negative",
                    position: "top",
                    message: res.message,
                    icon: "report_problem"
                });
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
        width: 375px;
        height: 273px;
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

            &.disabled-btn {
                cursor: not-allowed;
                filter: brightness(0.5);
            }
        }
    }

    .table-wrapper {
        position: relative;
        width: 340px;
        height: 166px;
        display: flex;
        justify-content: center;
        align-items: center;

        img.table {
            aspect-ratio: 398 / 280;
        }

        .table-data {
            position: absolute;
            top: 0%;
            left: 50%;
            transform: translate(-50%, 0%);
            width: 80%;
            display: table;

            .row {
                align-items: center;
                justify-content: center;
                display: table-row;

                .header {
                    font-size: 0.9rem;
                    color: #FFFFFFB2;
                    text-align: center;
                    display: table-cell;
                    padding: 2px;
                    padding-top: 35px;
                    padding-bottom: 10px;
                }

                .content {
                    font-size: 0.8rem;
                    color: #B5A0F1;
                    text-align: center;
                    display: table-cell;
                    padding: 2px;
                    overflow: auto;
                    height: 100px;
                }
            }
        }
    }

    .download-button-wrapper {
        cursor: pointer;

        img.button {
            width: 220px;
            height: 79px;
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