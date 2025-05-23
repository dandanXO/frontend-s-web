<template>
    <div class="wrapper">
        <div class="container">
            <div class="section">
                <div class="section-left">
                    <div class="section-title">
                        <div><img class="icon-img" src="@/assets/promo/lh-livepoker-rebate/section-title-img.png" />
                        </div>
                        任务选择
                    </div>
                </div>
                <div class="treasures">
                    <div v-for="item, index in Array.from(Array(5).keys())" class="chest-item"
                        :style="`filter:${claimedProgressData.mission === index + 1 || claimedProgressData.mission === null ? 'grayscale(0)' : 'grayscale(1)'}`">
                        <img class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/treasure-chest.png" />
                        <img v-if="claimedProgressData.mission === index + 1" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-claimed-btn.svg" />
                        <img v-else class="icon-img claim-chest-btn"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-unclaimed-btn.svg"
                            @click="onClickSelectMission" />
                    </div>
                </div>
            </div>

            <div class="section" style="gap: 20px;">
                <div class="section-left">
                    <div class="section-title">
                        <div><img class="icon-img" src="@/assets/promo/lh-livepoker-rebate/section-title-img.png" />
                        </div>
                        开启宝箱
                    </div>
                </div>
                <div class="inner-section">
                    <div class="inner-section-title">冠冕任务：</div>
                    <div class="inner-sub-section">
                        <div class="label">
                            <img class="icon-img"
                                src="@/assets/images/promotion/hotpromo/blast-austin/mission-icon.svg" />
                            <span>冠冕任务：</span>
                        </div>
                        <div class="status"><img class="icon-img"
                                src="@/assets/images/promotion/hotpromo/blast-austin/green-check-icon.svg" />
                            <div>已完成{{ claimedProgressData.bet.consecutiveDays }}天</div>
                        </div>
                    </div>
                    <div class="inner-sub-section">
                        <div class="label">
                            <img class="icon-img"
                                src="@/assets/images/promotion/hotpromo/blast-austin/money-icon.svg" />
                            <span>冠冕金：</span>
                        </div>
                        <div class="amt">
                            <div>{{ claimedProgressData.bet.bonus }}元</div>
                        </div>
                    </div>
                </div>
                <div class="treasures">
                    <div v-for="item in [1, 5, 10, 15, 20]" class="chest-item"
                        :style="`filter:${claimedProgressData.bet.expiredDays.includes(item) ? 'grayscale(1)' : 'grayscale(0)'}`">
                        <img v-if="item === 1" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-day-1.png" />
                        <img v-if="item === 5" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-day-5.png" />
                        <img v-if="item === 10" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-day-10.png" />
                        <img v-if="item === 15" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-day-15.png" />
                        <img v-if="item === 20" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-day-20.png" />
                        <img v-if="claimedProgressData.bet.claimedDays.includes(item)" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-claimed-btn.svg" />
                        <img v-else-if="claimedProgressData.bet.expiredDays.includes(item)" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-expired-btn.svg" />
                        <img v-else-if="claimedProgressData.bet.consecutiveDays >= item && claimedProgressData.bet.bonus > 0"
                            class="icon-img claim-chest-btn" width="143px" height="48px"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-claim-now-btn.png"
                            @click="onClickClaimChest('bet')" />
                        <img style="filter:grayscale(1)" v-else class="icon-img" width="143px" height="48px"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-claim-now-btn.png" />
                    </div>
                </div>
                <div class="inner-section">
                    <div class="inner-section-title">加冕任务：</div>
                    <div class="inner-sub-section">
                        <div class="label">
                            <img class="icon-img"
                                src="@/assets/images/promotion/hotpromo/blast-austin/mission-icon.svg" />
                            <span>加冕任务：</span>
                        </div>
                        <div class="status"><img class="icon-img"
                                src="@/assets/images/promotion/hotpromo/blast-austin/green-check-icon.svg" />
                            <div>已完成{{ claimedProgressData.deposit.consecutiveDays }}天</div>
                        </div>
                    </div>
                    <div class="inner-sub-section">
                        <div class="label">
                            <img class="icon-img"
                                src="@/assets/images/promotion/hotpromo/blast-austin/money-icon.svg" />
                            <span>加冕金：</span>
                        </div>
                        <div class="amt">
                            <div>{{ claimedProgressData.deposit.bonus }}元</div>
                        </div>
                    </div>
                </div>
                <div class="treasures">
                    <div v-for="item in [1, 5, 10, 15, 20]" class="chest-item"
                        :style="`filter:${claimedProgressData.deposit.expiredDays.includes(item) ? 'grayscale(1)' : 'grayscale(0)'}`">
                        <img v-if="item === 1" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-day-1.png" />
                        <img v-if="item === 5" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-day-5.png" />
                        <img v-if="item === 10" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-day-10.png" />
                        <img v-if="item === 15" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-day-15.png" />
                        <img v-if="item === 20" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-day-20.png" />
                        <img v-if="claimedProgressData.deposit.claimedDays.includes(item)" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-claimed-btn.svg" />
                        <img v-else-if="claimedProgressData.deposit.expiredDays.includes(item)" class="icon-img"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-expired-btn.svg" />
                        <img v-else-if="claimedProgressData.deposit.consecutiveDays >= item && claimedProgressData.deposit.bonus > 0"
                            class="icon-img claim-chest-btn" width="143px" height="48px"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-claim-now-btn.png"
                            @click="onClickClaimChest('deposit')" />
                        <img style="filter:grayscale(1)" v-else class="icon-img" width="143px" height="48px"
                            src="@/assets/images/promotion/hotpromo/blast-austin/chest-claim-now-btn.png" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import {
    initBlastAustin, claimChestBlastAustin, selectMissionBlastAustin
} from "@/api/index/promo";
import { useNotify } from "@/hooks/notify";

const props = defineProps(["promoCode"]);
const notify = useNotify();
const claimedProgressData = ref({
    mission: null,
    bet: {
        claimedDays: [],
        expiredDays: [],
        consecutiveDays: 0,
        bonus: 0
    },
    deposit: {
        claimedDays: [],
        expiredDays: [],
        consecutiveDays: 0,
        bonus: 0
    }
})

const onClickSelectMission = () => {
    selectMissionBlastAustin(props.promoCode).then((res) => {
        if (res.code === 0) {
            notify({
                message: "成功选择任务",
                type: "success"
            });
        } else {
            notify({
                message: res.message,
                type: "error"
            });
        }
    })
}

const onClickClaimChest = (type) => {
    claimChestBlastAustin(props.promoCode, type).then((res) => {
        if (res.code === 0) {
            notify({
                message: "成功选择任务",
                type: "success"
            });
        } else {
            notify({
                message: res.message,
                type: "error"
            });
        }
    })
}

onMounted(() => {
    initBlastAustin(props.promoCode).then((res) => {
        claimedProgressData.value = res.data;
    })
})
</script>

<style lang="scss" scoped>
.treasures {
    display: flex;
    justify-content: space-between;

    .chest-item {
        display: flex;
        flex-direction: column;
        gap: 15px;
        justify-content: center;
        align-items: center;
    }
}

.inner-section {
    display: flex;
    border: 1px solid #D7EBFF;
    background: #FFFFFF;
    justify-content: space-between;
    gap: 20px;
    padding: 20px;
    border-radius: 12px;

    .inner-section-title {
        color: #0085E8;
        width: 300px;
        display: flex;
        align-items: center;
        padding: 10px 0;
    }

    .inner-sub-section {
        border: 1px solid #D7EBFF;
        background: #EEF7FF;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 20px;
        border-radius: 12px;
        display: grid;
        grid-template-columns: 1fr 150px;
    }

    .label {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .status {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #00C224;
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        justify-content: flex-end;
    }

    .amt {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        color: #00A1FF;
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;

    }
}

.wrapper {
    display: flex;
    justify-content: center;
    font-family: 'PingFang SC';
}

.container {
    width: 100%;
    height: 100%;
}

.section {
    box-shadow: 0px 0px 4px 0px #01497b0f;
    padding: 30px 40px;
    border-radius: 12px;
    border: 1px solid #acd4f6;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: url("@/assets/promo/lh-livepoker-rebate/section-bg.png");
    background-size: 100% 100%;
    margin-bottom: 30px;

    .section-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .section-right {
        margin-top: auto;
        margin-bottom: auto;
        width: 254px;

        .bonus-image {
            cursor: pointer;
            width: 100%;

            &:hover {
                filter: brightness(0.9);
            }

            &:active {
                transform: translate(0px, 1px);
                opacity: 0.9;
            }

            &.disabled {
                cursor: not-allowed;
                pointer-events: none;
            }
        }
    }

    .section-title {
        color: #000000;
        font-size: 24px;
        line-height: 1;
        font-weight: 600;
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 20px;
    }
}

.icon-img {
    padding: 0 !important;
    margin: 0 !important;
}

.claim-chest-btn {
    cursor: pointer;

    &:hover {
        filter: brightness(1.1);
    }

    &:active {
        transform: translateY(2px);
    }
}
</style>