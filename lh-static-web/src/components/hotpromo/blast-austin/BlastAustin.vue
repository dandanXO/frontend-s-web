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

    <div class="section-bg" style="
    border: 1px solid rgba(172, 212, 246, 1);
    background: #F2F8FE;
    border-radius: 12px;
    padding: 30px;
" bis_skin_checked="1">
        <div class="title-img" bis_skin_checked="1">活动内容</div>
        <br>
        <div style="display:flex;margin-bottom: 10px;justify-content:flex-start;gap:5px;" bis_skin_checked="1">
            <div class="ribbon" bis_skin_checked="1">活动详情</div>
            <span style="font-size: 1rem;">2025年6月3日至2025年6月22日</span>
        </div>
        <div style="display:flex;flex-direction:column;justify-content:flex-start;gap:5px;" bis_skin_checked="1">
            <div class="ribbon" bis_skin_checked="1">活动内容</div>
            <span style="font-size: 1rem;">活动分为五个任务，当日BLAST 奥斯汀 Major
                2025有效投注≥2,000元即可获得冠冕金，若当日存款金额≥500元，即可获得加冕金，连续冲关，连续加冕，最高可获5,330元~</span>
        </div>
        <table class="section-table" style="
    width: 100%;
">
            <tbody>
                <tr style="
    height: 56px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    white-space: pre-wrap;
">
                    <th style="background-color:transparent" rowspan="2">任务</th>
                    <th style="background-color:transparent" rowspan="2">当日有效投注</th>
                    <th style="/* background-color:transparent; */background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 100%) !important;border-bottom: 1px solid #dcdce8;"
                        colspan="5">冠冕金</th>
                    <th style="background-color:transparent" rowspan="2">当日存款金额</th>
                    <th style="/* background-color:transparent; */background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 100%) !important;border-bottom: 1px solid #dcdce8;"
                        colspan="5">冠冕金</th>
                </tr>
                <tr style="
    height: 56px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    white-space: pre-wrap;
">
                    <th
                        style="border-radius: 0px;background: linear-gradient(180deg, #4aa4ff 0%, #5db6fe 100%) !important;">
                        连续1天</th>
                    <th style="background: linear-gradient(180deg, #4aa4ff 0%, #5db6fe 100%) !important;">连续5天</th>
                    <th style="background: linear-gradient(180deg, #4aa4ff 0%, #5db6fe 100%) !important;">连续10天</th>
                    <th style="background: linear-gradient(180deg, #4aa4ff 0%, #5db6fe 100%) !important;">连续15天</th>
                    <th style="background: linear-gradient(180deg, #4aa4ff 0%, #5db6fe 100%) !important;">连续20天</th>
                    <th style="background: linear-gradient(180deg, #4aa4ff 0%, #5db6fe 100%) !important;">连续1天</th>
                    <th style="background: linear-gradient(180deg, #4aa4ff 0%, #5db6fe 100%) !important;">连续5天</th>
                    <th style="background: linear-gradient(180deg, #4aa4ff 0%, #5db6fe 100%) !important;">连续10天</th>
                    <th style="background: linear-gradient(180deg, #4aa4ff 0%, #5db6fe 100%) !important;">连续15天</th>
                    <th
                        style="border-radius: 0px;background: linear-gradient(180deg, #4aa4ff 0%, #5db6fe 100%) !important;">
                        连续20天</th>
                </tr>
                <tr>
                    <td>任务一</td>
                    <td>≥2,000</td>
                    <td>18</td>
                    <td>28</td>
                    <td>58</td>
                    <td>88</td>
                    <td>128</td>
                    <td>≥500</td>
                    <td>28</td>
                    <td>58</td>
                    <td>88</td>
                    <td>128</td>
                    <td>188</td>
                </tr>
                <tr>
                    <td>任务二</td>
                    <td>≥5,000</td>
                    <td>28</td>
                    <td>58</td>
                    <td>88</td>
                    <td>128</td>
                    <td>168</td>
                    <td>≥1,000</td>
                    <td>58</td>
                    <td>88</td>
                    <td>128</td>
                    <td>188</td>
                    <td>288</td>
                </tr>
                <tr>
                    <td>任务三</td>
                    <td>≥10,000</td>
                    <td>58</td>
                    <td>88</td>
                    <td>128</td>
                    <td>188</td>
                    <td>228</td>
                    <td>≥5,000</td>
                    <td>88</td>
                    <td>128</td>
                    <td>188</td>
                    <td>288</td>
                    <td>588</td>
                </tr>
                <tr>
                    <td>任务四</td>
                    <td>≥30,000</td>
                    <td>88</td>
                    <td>128</td>
                    <td>188</td>
                    <td>228</td>
                    <td>358</td>
                    <td>≥10,000</td>
                    <td>128</td>
                    <td>188</td>
                    <td>288</td>
                    <td>588</td>
                    <td>888</td>
                </tr>
                <tr>
                    <td>任务五</td>
                    <td>≥100,000</td>
                    <td>128</td>
                    <td>188</td>
                    <td>228</td>
                    <td>358</td>
                    <td>588</td>
                    <td>≥50,000</td>
                    <td>188</td>
                    <td>288</td>
                    <td>588</td>
                    <td>888</td>
                    <td>1888</td>
                </tr>
            </tbody>
        </table>
        <div bis_skin_checked="1">
            <div style="
    display: flex;
    align-items: center;
    gap: 5px;
    color: #ff3a3a;
" bis_skin_checked="1">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAYAAACJfM0wAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHsSURBVHgBrVRLTtxAEK1qEbFkbhDnJFF2CDbDHglLSEiwmBxhhhtMsmKHO0JCYsWSXcxFYnOCBAmB5LRdvO52m7Y1fAamJPe36tV7VS3T/8lkaiaTPVqxKaqqazLm1BwdFebwcGUJ2A71wcEfIfqCjRDzDYlkSinNJyclvdOUAzbmJ1iTGMOYE6rrWV1VRb2/fyppmtA7zDFG8KgRKbDZwMzu0I/BMsWsOctyeqN10fXu7gwlmD7rKCK4v0ZAxufnmt4KLOPxSNbXCyw3AGAZx5TFYT8FlEg044sL/SqwY72zM2elvrcXtpGOaAwe7mxqjKVVQE2j+fKyfBYYrBOxtWYX2vK28dJL1AW1dy1Qhv1xSMBDCbK9/RvTV/HtE8dNKW7LEzmKV8ExultneFV6bQgMWTeOp6PWIjWNL0PTDF8Lu7vg55MnNGQsm5sJ2BXx0SJVfYkO7C/mX/jmfHVV2uM+Y6WmUYC0Zz54WAqf9BZnP+j+fs55/q8vJXihcfhvFPQCt84frwHjnB4e9BAw2BPjqtpbIFOi92wbk+M7htycXrG1CCT14ZHcsF4CsAcsW1spps8hBXnJVqJG17uGLGOB8TRieQt2CxuyFLAZj1OUMmHbELCjuzv9EcAOmEejBP/jb5/OznJaoT0C29AKyUB7edEAAAAASUVORK5CYII="
                    style="
    width: 22px;
    height: auto;
    margin: 0;
    padding: 0;
">
                <div style="
    font-size: 1rem;
" bis_skin_checked="1">示例</div>
            </div>
            <div style="
    color: #ff3a3a;
    font-size: 1rem;
" bis_skin_checked="1">例：会员A在6月3日投注BLAST 奥斯汀 Major 2025赛事，选择任务四，当日有效投注为 50,000 元，存款为30000元，在次日 24
                小时内可获得冠冕金88元和加冕金128元，若连续五天都达到任务四目标，在第六天即可领取128元冠冕金和188加冕金。</div>
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