<template>
    <div class="blast-austin-wrapper">
        <div class="container">

            <Carousel v-bind="carouselConfig" ref="missionCarousel">
                <Slide v-for="item, index in Array.from(Array(5).keys())" :key="index">
                    <template v-if="isInitLoading">
                        <img style="display:flex;margin:0 auto !important;width:100px;height:auto;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/loader.gif" />
                    </template>
                    <div class="chest-item" v-else
                        :style="`filter:${claimedProgressData.mission === index + 1 || claimedProgressData.mission === null ? 'grayscale(0)' : 'grayscale(1)'}`">
                        <div class="section-title">
                            <img style="width:18px;height:18px;border-radius: 0px;"
                                src="../../../assets/images/promo/hotpromo/blast-austin/gift-icon.svg" />
                            <span>
                                任务选择
                            </span>
                        </div>
                        <img class="icon-img" style="width:120px !important;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/treasure-chest.png" />
                        <div style="font-size: 15px;">任务{{ index + 1 }}</div>
                        <img v-if="claimedProgressData.mission === index + 1"
                            style="width:105px !important;height: auto !important;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-claimed-btn.svg" />
                        <img v-else class="icon-img claim-chest-btn"
                            style="width:105px !important;height: auto !important;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-unclaimed-btn.svg"
                            @click="onClickSelectMission(index + 1)" />
                    </div>
                </Slide>

                <template #addons>
                    <Navigation />
                </template>
            </Carousel>


            <Carousel v-bind="carouselConfig" ref="betCarousel">
                <Slide v-for="item, index in [1, 5, 10, 15, 20]" :key="index">
                    <template v-if="isInitLoading">
                        <img style="display:flex;margin:0 auto !important;width:100px;height:auto;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/loader.gif" />
                    </template>
                    <div class="chest-item" v-else
                        :style="`filter:${claimedProgressData.bet.expiredDays.includes(item) ? 'grayscale(1)' : 'grayscale(0)'}`">
                        <div class="section-title">
                            <img style="width:18px;height:18px;border-radius: 0px;"
                                src="../../../assets/images/promo/hotpromo/blast-austin/gift-icon.svg" />
                            <span>
                                开启宝箱
                            </span>
                        </div>

                        <div class="inner-section">
                            <!-- <div class="inner-section-title">冠冕任务：</div> -->
                            <div class="inner-sub-section">
                                <div class="label">
                                    <img class="icon-img" width="20px" height="20px"
                                        src="../../../assets/images/promo/hotpromo/blast-austin/mission-icon.svg" />
                                    <span>冠冕任务：</span>
                                </div>
                                <div class="status"><img class="icon-img" width="20px" height="20px"
                                        src="../../../assets/images/promo/hotpromo/blast-austin/green-check-icon.svg" />
                                    <div>已完成{{ claimedProgressData.bet.consecutiveDays }}天</div>
                                </div>
                            </div>
                            <div class="inner-sub-section">
                                <div class="label">
                                    <img class="icon-img" width="20px" height="20px"
                                        src="../../../assets/images/promo/hotpromo/blast-austin/money-icon.svg" />
                                    <span>冠冕金：</span>
                                </div>
                                <div class="amt">
                                    <div>{{ claimedProgressData.bet.bonus }}元</div>
                                </div>
                            </div>
                        </div>

                        <img v-if="item === 1" class="claim-chest-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-day-1.png" />
                        <img v-if="item === 5" class="claim-chest-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-day-5.png" />
                        <img v-if="item === 10" class="claim-chest-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-day-10.png" />
                        <img v-if="item === 15" class="claim-chest-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-day-15.png" />
                        <img v-if="item === 20" class="claim-chest-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-day-20.png" />
                        <div style="font-size: 15px;">连续{{ item }}天</div>
                        <img v-if="claimedProgressData.bet.claimedDays.includes(item)" class="icon-img"
                            style="width:105px !important;height: auto !important;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-claimed-btn.svg" />
                        <img v-else-if="claimedProgressData.bet.expiredDays.includes(item)" class="icon-img"
                            style="width:105px !important;height: auto !important;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-expired-btn.svg" />
                        <img v-else-if="claimedProgressData.bet.consecutiveDays >= item && claimedProgressData.bet.bonus > 0"
                            class="icon-img claim-chest-btn" style="width:105px !important;height: auto !important;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-claim-now-btn.png"
                            @click="onClickClaimChest('bet')" />
                        <img style="filter:grayscale(1);width:105px !important;height: auto !important;" v-else
                            class="icon-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-claim-now-btn.png" />
                    </div>
                </Slide>

                <template #addons>
                    <Navigation />
                </template>
            </Carousel>


            <Carousel v-bind="carouselConfig" ref="depositCarousel">
                <Slide v-for="item, index in [1, 5, 10, 15, 20]" :key="index">
                    <template v-if="isInitLoading">
                        <img style="display:flex;margin:0 auto !important;width:100px;height:auto;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/loader.gif" />
                    </template>
                    <div class="chest-item" v-else
                        :style="`filter:${claimedProgressData.deposit.expiredDays.includes(item) ? 'grayscale(1)' : 'grayscale(0)'}`">
                        <div class="section-title">
                            <img style="width:18px;height:18px;border-radius: 0px;"
                                src="../../../assets/images/promo/hotpromo/blast-austin/gift-icon.svg" />
                            <span>
                                开启宝箱
                            </span>
                        </div>

                        <div class="inner-section">
                            <!-- <div class="inner-section-title">冠冕任务：</div> -->
                            <div class="inner-sub-section">
                                <div class="label">
                                    <img class="icon-img" width="20px" height="20px"
                                        src="../../../assets/images/promo/hotpromo/blast-austin/mission-icon.svg" />
                                    <span>加冕任务：</span>
                                </div>
                                <div class="status"><img class="icon-img" width="20px" height="20px"
                                        src="../../../assets/images/promo/hotpromo/blast-austin/green-check-icon.svg" />
                                    <div>已完成{{ claimedProgressData.deposit.consecutiveDays }}天</div>
                                </div>
                            </div>
                            <div class="inner-sub-section">
                                <div class="label">
                                    <img class="icon-img" width="20px" height="20px"
                                        src="../../../assets/images/promo/hotpromo/blast-austin/money-icon.svg" />
                                    <span>加冕金：</span>
                                </div>
                                <div class="amt">
                                    <div>{{ claimedProgressData.deposit.bonus }}元</div>
                                </div>
                            </div>
                        </div>

                        <img v-if="item === 1" class="claim-chest-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-day-1.png" />
                        <img v-if="item === 5" class="claim-chest-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-day-5.png" />
                        <img v-if="item === 10" class="claim-chest-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-day-10.png" />
                        <img v-if="item === 15" class="claim-chest-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-day-15.png" />
                        <img v-if="item === 20" class="claim-chest-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-day-20.png" />
                        <div style="font-size: 15px;">连续{{ item }}天</div>
                        <img v-if="claimedProgressData.deposit.claimedDays.includes(item)" class="icon-img"
                            style="width:105px !important;height: auto !important;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-claimed-btn.svg" />
                        <img v-else-if="claimedProgressData.deposit.expiredDays.includes(item)" class="icon-img"
                            style="width:105px !important;height: auto !important;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-expired-btn.svg" />
                        <img v-else-if="claimedProgressData.deposit.consecutiveDays >= item && claimedProgressData.deposit.bonus > 0"
                            class="icon-img claim-chest-btn" style="width:105px !important;height: auto !important;"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-claim-now-btn.png"
                            @click="onClickClaimChest('deposit')" />
                        <img style="filter:grayscale(1);width:105px !important;height: auto !important;" v-else
                            class="icon-img"
                            src="../../../assets/images/promo/hotpromo/blast-austin/chest-claim-now-btn.png" />
                    </div>
                </Slide>

                <template #addons>
                    <Navigation />
                </template>
            </Carousel>
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
            <tbody style="letter-spacing: -1px;font-size:12px;line-height:12px;">
                <tr style="
    height: 56px;
    font-weight: 400;
    line-height: 12px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    white-space: pre-wrap;
">
                    <th style="background-color:transparent" rowspan="2" width="70px">任务</th>
                    <th style="background-color:transparent" rowspan="2">当日有效投注</th>
                    <th style="background-color:transparent;border-bottom: 1px solid #dcdce8;" colspan="5">冠冕金</th>
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
                    <th style="border-radius: 0px;">
                        连续1天</th>
                    <th style="">连续5天</th>
                    <th style="">连续10天</th>
                    <th style="">连续15天</th>
                    <th style="">连续20天</th>
                </tr>
                <tr>
                    <td>任务一</td>
                    <td>≥2,000</td>
                    <td>18</td>
                    <td>28</td>
                    <td>58</td>
                    <td>88</td>
                    <td>128</td>
                </tr>
                <tr>
                    <td>任务二</td>
                    <td>≥5,000</td>
                    <td>28</td>
                    <td>58</td>
                    <td>88</td>
                    <td>128</td>
                    <td>168</td>
                </tr>
                <tr>
                    <td>任务三</td>
                    <td>≥10,000</td>
                    <td>58</td>
                    <td>88</td>
                    <td>128</td>
                    <td>188</td>
                    <td>228</td>
                </tr>
                <tr>
                    <td>任务四</td>
                    <td>≥30,000</td>
                    <td>88</td>
                    <td>128</td>
                    <td>188</td>
                    <td>228</td>
                    <td>358</td>
                </tr>
                <tr>
                    <td>任务五</td>
                    <td>≥100,000</td>
                    <td>128</td>
                    <td>188</td>
                    <td>228</td>
                    <td>358</td>
                    <td>588</td>
                </tr>
            </tbody>
        </table>
        <br />
        <table class="section-table" style="
    width: 100%;
">
            <tbody style="letter-spacing: -1px;font-size:12px;line-height:12px;">
                <tr style="
    height: 56px;
    font-weight: 400;
    line-height: 12px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    white-space: pre-wrap;
">
                    <th style="background-color:transparent" rowspan="2" width="70px">任务</th>
                    <th style="background-color:transparent" rowspan="2">当日存款金额</th>
                    <th style="background-color:transparent;border-bottom: 1px solid #dcdce8;" colspan="5">加冕金</th>
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
                    <th style="border-radius: 0px;">
                        连续1天</th>
                    <th style="">连续5天</th>
                    <th style="">连续10天</th>
                    <th style="">连续15天</th>
                    <th style="">连续20天</th>
                </tr>
                <tr>
                    <td>任务一</td>
                    <td>≥500</td>
                    <td>28</td>
                    <td>58</td>
                    <td>88</td>
                    <td>128</td>
                    <td>188</td>
                </tr>
                <tr>
                    <td>任务二</td>
                    <td>≥1,000</td>
                    <td>58</td>
                    <td>88</td>
                    <td>128</td>
                    <td>188</td>
                    <td>288</td>
                </tr>
                <tr>
                    <td>任务三</td>
                    <td>≥5,000</td>
                    <td>88</td>
                    <td>128</td>
                    <td>188</td>
                    <td>288</td>
                    <td>588</td>
                </tr>
                <tr>
                    <td>任务四</td>
                    <td>≥10,000</td>
                    <td>128</td>
                    <td>188</td>
                    <td>288</td>
                    <td>588</td>
                    <td>888</td>
                </tr>
                <tr>
                    <td>任务五</td>
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

    <q-dialog v-model="isOpenMissionDialogVisible">
        <div class="blast-austin-dialog">
            <div class="dialog-header">开启宝箱</div>
            <div class="dialog-body">
                <img src="../../../assets/images/promo/hotpromo/blast-austin/open-mission-decor.png" width="300px"
                    height="93px" />
                <img src="../../../assets/images/promo/hotpromo/blast-austin/dialog-success-icon.png" width="48px"
                    height="48px" />
                <div class="title">恭喜您任务领取成功</div>
                <div class="desc">任务一领取成功，请按照任务要求进行闯关，连续二十天完成当日有效投注≥2000元即可领取冠冕金128元，若连续二十天完成当日存款金额≥500元即可获得加冕金188元。
                </div>
                <div class="action-btn" @click="isOpenMissionDialogVisible = false">开始任务</div>
            </div>
        </div>
    </q-dialog>

    <q-dialog v-model="isClaimBetSuccessDialogVisible">
        <div class="blast-austin-dialog">
            <div class="dialog-header">冠冕任务</div>
            <div class="dialog-body">
                <img src="../../../assets/images/promo/hotpromo/blast-austin/claim-chest-decor.png" width="300px"
                    height="110px" />
                <img src="../../../assets/images/promo/hotpromo/blast-austin/dialog-success-icon.png" width="48px"
                    height="48px" />
                <div class="title">恭喜您开启冠冕任务宝箱成功</div>
                <div class="desc" style="display:flex;align-items: center;color: #43B202;">
                    获得加冕金{{ claimBetSuccessDialogBonus }}元<img
                        src="../../../assets/images/promo/hotpromo/blast-austin/dialog-success-icon.png" width="20px"
                        height="20px" /></div>
                <div class="action-btn" @click="isClaimBetSuccessDialogVisible = false">继续任务</div>
            </div>
        </div>
    </q-dialog>

    <q-dialog v-model="isClaimDepositSuccessDialogVisible">
        <div class="blast-austin-dialog">
            <div class="dialog-header">加冕任务</div>
            <div class="dialog-body">
                <img src="../../../assets/images/promo/hotpromo/blast-austin/claim-chest-decor.png" width="300px"
                    height="110px" />
                <img src="../../../assets/images/promo/hotpromo/blast-austin/dialog-success-icon.png" width="48px"
                    height="48px" />
                <div class="title">恭喜您开启加冕任务宝箱成功</div>
                <div class="desc" style="display:flex;align-items: center;color: #43B202;">
                    获得加冕金{{ claimDepositSuccessDialogBonus }}元<img
                        src="../../../assets/images/promo/hotpromo/blast-austin/dialog-success-icon.png" width="20px"
                        height="20px" /></div>
                <div class="action-btn" @click="isClaimDepositSuccessDialogVisible = false">继续任务</div>
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import {
    initBlastAustin, claimChestBlastAustin, selectMissionBlastAustin
} from "../../../api/index/promo";
import { useNotify } from "src/hooks/notify";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

const isInitLoading = ref(false);
const isOpenMissionDialogVisible = ref(false);
const isClaimBetSuccessDialogVisible = ref(false);
const claimBetSuccessDialogBonus = ref(0);
const isClaimDepositSuccessDialogVisible = ref(false);
const claimDepositSuccessDialogBonus = ref(0);
const betCarousel = ref(null);
const depositCarousel = ref(null);
const missionCarousel = ref(null);

const carouselConfig = {
    height: 450,
    itemsToShow: 2.25,
    wrapAround: true,
}

const goToBetCarouselSlide = (consecutiveDays) => {
    const chestDays = [1, 5, 10, 15, 20];
    // Find the closest value in the array
    const nearestValue = chestDays.reduce((prev, curr) =>
        Math.abs(curr - consecutiveDays) < Math.abs(prev - consecutiveDays) ? curr : prev
    );

    const index = chestDays.indexOf(nearestValue);
    if (index !== -1) {
        betCarousel.value.slideTo(index);
    }
};

const goToDepositCarouselSlide = (consecutiveDays) => {
    const chestDays = [1, 5, 10, 15, 20];
    // Find the closest value in the array
    const nearestValue = chestDays.reduce((prev, curr) =>
        Math.abs(curr - consecutiveDays) < Math.abs(prev - consecutiveDays) ? curr : prev
    );

    const index = chestDays.indexOf(nearestValue);
    if (index !== -1) {
        depositCarousel.value.slideTo(index);
    }
};

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

const onClickSelectMission = (missionNum) => {
    selectMissionBlastAustin(props.promoCode, missionNum).then((res) => {
        if (res.code === 0) {
            isOpenMissionDialogVisible.value = true;
            initData();
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
            claimDepositSuccessDialogBonus.value = res.data;
            isClaimDepositSuccessDialogVisible.value = true;
            initData();
        } else {
            notify({
                message: res.message,
                type: "error"
            });
        }
    })
}

const initData = () => {
    isInitLoading.value = true;

    initBlastAustin(props.promoCode).then((res) => {
        claimedProgressData.value = res.data;

        const betConsecutiveDays = res.data.bet.consecutiveDays;
        if (betConsecutiveDays) {
            goToBetCarouselSlide(consecutiveDays);
        }

        const depositConsecutiveDays = res.data.deposit.consecutiveDays;
        if (depositConsecutiveDays) {
            goToDepositCarouselSlide(depositConsecutiveDays);
        }

        const mission = res.data.mission;
        if (mission !== null) {
            missionCarousel.value.slideTo(mission - 1);
        }
    }).finally(() => {
        isInitLoading.value = false;
    })
}

onMounted(() => {
    initData()
})
</script>

<style lang="scss" scoped>
.chest-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    background: url("../../../assets/images/promo/hotpromo/blast-austin/chest-item-bg.png") no-repeat center center;
    background-size: 100% 100%;
    padding: 20px;
    min-width: 250px;

    .section-title {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        width: 100%;
        text-align: left;
        font-size: 20px;
        font-weight: 600;
        font-size: 14px;
        gap: 5px;
    }
}

.inner-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    width: 100%;

    .inner-section-title {
        color: #0085E8;
        width: 300px;
        display: flex;
        align-items: center;
    }

    .inner-sub-section {
        border: 1px solid #D7EBFF;
        background: #EEF7FF;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-radius: 8px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        font-size: 12px;
        height: 30px;
    }

    .label {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .status {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #00C224;
        font-weight: 600;
        justify-content: flex-end;
    }

    .amt {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        color: #00A1FF;
        font-weight: 600;
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
    //background: url("@/assets/promo/lh-livepoker-rebate/section-bg.png");
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
    width: fit-content !important;
    border-radius: 0px !important;
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

.claim-chest-img {
    width: 130px !important;
    height: 104px !important;
}

.body--dark {
    .container {
        background: transparent !important;
    }

    .chest-item {
        background: linear-gradient(178.46deg, #2d4065 2.36%, #2d4065 100%) !important;
        border: 1px solid #be9457 !important;
        border-radius: 12px;
        color: #fff;
    }

    .section-title {
        color: #fff;
    }

    .inner-section {
        background: transparent;
    }

    .inner-sub-section {
        background: #202C4A;
    }
}

.section-table {
    th {
        font-size: 14px !important;
    }

    td {
        font-size: 15px !important;
    }
}
</style>

<style lang="scss">
.blast-austin-wrapper {
    :root {
        --carousel-transition: 300ms;
        --carousel-opacity-inactive: 0.7;
        --carousel-opacity-active: 1;
        --carousel-opacity-near: 0.9;

        background-color: #242424;
    }

    .carousel {
        --vc-nav-background: rgba(255, 255, 255, 0.7);
        --vc-nav-border-radius: 100%;
    }

    img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .carousel__viewport {
        perspective: 2000px;
    }

    .carousel__track {
        transform-style: preserve-3d;
    }

    .carousel__slide--sliding {
        transition:
            opacity var(--carousel-transition),
            transform var(--carousel-transition);
    }

    .carousel.is-dragging .carousel__slide {
        transition:
            opacity var(--carousel-transition),
            transform var(--carousel-transition);
    }

    .carousel__slide {
        opacity: var(--carousel-opacity-inactive);
        transform: translateX(10px) rotateY(-12deg) scale(0.9);
    }

    .carousel__slide--prev {
        opacity: 0.5;
        transform: rotateY(30deg) scale(0.95);
    }

    .carousel__slide--active {
        opacity: var(--carousel-opacity-active);
        transform: rotateY(0) scale(1);
    }

    .carousel__slide--next {
        opacity: 0.5;
        transform: rotateY(-30deg) scale(0.95);
    }

    .carousel__slide--next~.carousel__slide {
        opacity: var(--carousel-opacity-inactive);
        transform: translateX(-10px) rotateY(12deg) scale(0.9);
    }
}

.blast-austin-dialog {
    &.el-dialog {
        background: transparent;
    }

    .el-dialog__close {
        background: #CECECE;
        border-radius: 100px;
        color: #7D7E80 !important;
    }

    .dialog-header {
        background: url("../../../assets/images/promo/hotpromo/blast-austin/dialog-header.png");
        background-size: 100% 100%;
        width: 100%;
        min-width: 350px;
        max-width: 400px;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        font-size: 28px;
        color: #fff;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .dialog-body {
        background: url("../../../assets/images/promo/hotpromo/blast-austin/dialog-body.png");
        background-size: 100% 100%;
        width: 100%;
        max-width: 400px;
        min-height: 450px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        font-weight: 600;
        font-size: 28px;
        color: #fff;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        padding: 20px;

        .title {
            font-weight: 600;
            font-size: 20px;
            color: #43B202;
        }

        .desc {
            font-weight: 500;
            font-size: 16px;
            text-align: center;
            color: #7A8EB9;
        }

        .action-btn {
            background: url("../../../assets/images/promo/hotpromo/blast-austin/action-btn.svg") center center;
            background-size: 100% 100%;
            width: 232px;
            height: 48px;
            border-radius: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-weight: 500;
            font-size: 16px;
            text-align: center;

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