<template>
    <div class="nba-water-battle-bg" v-if="matchInfoArr">
        <div class="claim-btn" @click="isClaimHistoryDialogVisible = true">
            领取记录
        </div>
        <el-carousel>
            <el-carousel-item v-for="matchInfo in matchInfoArr" :key="matchInfo.id">
                <div class="match-info">
                    <div class="match-info-team">
                        <div class="team-img-wrapper"><img class="team-img"
                                :src="`${imageDir}${matchInfo.homeTeamIcon}`" />
                        </div>
                        <div>{{ matchInfo.homeTeam }}</div>
                    </div>
                    <div class="match-info-time">
                        <div class="time-text">{{ matchInfo.matchTime }}</div>
                    </div>
                    <div class="match-info-team">
                        <div class="team-img-wrapper"><img class="team-img"
                                :src="`${imageDir}${matchInfo.awayTeamIcon}`" />
                        </div>
                        <div>{{ matchInfo.awayTeam }}</div>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>

    <q-dialog v-model="isClaimHistoryDialogVisible">
        <div class="nba-water-battle-claim-history-dialog">
            <table class="nba-water-battle-claim-history-dialog-table">
                <tr class="nba-water-battle-claim-history-dialog-table-header">
                    <th>赛事</th>
                    <th>全场进10个三分球</th>
                    <th>任意球员砍下30分</th>
                    <th>任意球员拿到13个篮板</th>
                    <th>任意球员判罚离场</th>
                    <th>状态</th>
                    <th>获得彩金</th>
                </tr>

                <tr v-for="claimHistoryItem, in claimHistoryArr" :key="claimHistoryItem.id">
                    <td>{{ claimHistoryItem.title }}</td>
                    <td>{{ getStatusLabel(claimHistoryItem.threePointShots) }}</td>
                    <td>{{ getStatusLabel(claimHistoryItem.shotPoints) }}</td>
                    <td>{{ getStatusLabel(claimHistoryItem.scoringShots) }}</td>
                    <td>{{ getStatusLabel(claimHistoryItem.foulOut) }}</td>
                    <td>{{ claimHistoryItem.status }}</td>
                    <td>{{ claimHistoryItem.bonus }}</td>
                </tr>
            </table>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useLocalStorage } from "@vueuse/core";

import { getNBAUpcomingMatch, getNBAClaimHistory } from '../../../api/index/promo';

const matchInfoArr = ref([]);
const claimHistoryArr = ref([]);
const isClaimHistoryDialogVisible = ref(false);
const imageDir = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

const iniNBAUpcomingMatches = () => {
    getNBAUpcomingMatch().then((res) => {
        matchInfoArr.value = res.data;
    });
}

const getStatusLabel = (status) => {
    switch (status) {
        case true:
            return '✅';
        case false:
            return '❌';
        default:
            return '';
    }
}

watch(() => isClaimHistoryDialogVisible.value, () => {
    if (isClaimHistoryDialogVisible.value === true) {
        getNBAClaimHistory().then((res) => {
            claimHistoryArr.value = res.data;
        })
    }
})

onMounted(() => {
    iniNBAUpcomingMatches();
})
</script>

<style lang="scss">
.nba-water-battle-claim-history-dialog {
    font-family: 'PingFang';
    font-size: 15px;
    background-color: white;
    margin: 20px;

    .el-dialog__close {
        color: #000 !important;
    }

    .nba-water-battle-claim-history-dialog-table-header {
        height: 56px;
        font-size: 0.7rem;
        font-weight: 400;
        line-height: 28px;
        color: #fff;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);

        th {
            background: transparent !important;
            font-size: 14px;
        }
    }

    .nba-water-battle-claim-history-dialog-table {
        font-size: 12px;
        background-color: white;
        border-collapse: collapse;
        margin: 5%;

        td, th {
            border: 1px solid rgb(228, 228, 228);
            text-align: center;
        }
    }
}
</style>
<style lang="scss" scoped>
.nba-water-battle-bg {
    background: url("../../../assets/images/promo/hotpromo/nba-water-battle/nba-water-battle-widget-bg.png") no-repeat center center;
    background-size: 100% 100%;
    aspect-ratio: 702 / 280;
    position: relative;
    font-family: 'PingFang SC';
    font-weight: bold;
    margin-bottom: 30px;

    .claim-btn {
        background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
        position: absolute;
        top: 2%;
        right: 2%;
        padding: 5px 15px;
        color: #fff;
        border-radius: 100px;
        cursor: pointer;
        z-index: 1;

        &:hover {
            filter: brightness(1.1);
        }

        &:active {
            transform: translateY(2px);
        }
    }

    .match-info {
        gap: 30px;
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;

        .match-info-time {
            background-color: #edf4ff;
            padding: 5px 15px;
            border-radius: 100px;
            min-width: 120px;
            text-align: center;

            .time-text {
                color: #479af7;
            }
        }

        .match-info-team {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;

            .team-img-wrapper {
                height: 60px;
            }

            .team-img {
                height: 100%;
                width: auto;
            }
        }
    }
}
</style>
