<template>
    <div class="rules-container">
        <img class="back-btn" @click="props.onClickBackBtn" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/back-btn.png" />

        <img v-if="langVal === 'ur'" class="title-img" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/rules-title-ur.png" />
        <img v-else class="title-img" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/rules-title.png" />

        <div class="rule-item">{{ $t('hotPromo.jackpotAviator.rules1') }}</div><br/>
        <div class="rule-item">{{ $t('hotPromo.jackpotAviator.rules2') }}</div><br/>
        <div style="text-align: center;" class="rule-item">{{ $t('hotPromo.jackpotAviator.rankingBonusRatio') }}</div>
        <div class="ranking">
            <div class="item">
                <div>{{ $t('hotPromo.jackpotAviator.rank') }}</div>
                <div>{{ $t('hotPromo.jackpotAviator.dailyOrWeekly') }}</div>
            </div>

            <div class="item" v-for="rnp in ranksAndPercentages" :key="rnp.rank">
                <div class="rank">
                    <img v-if="rnp.rank === '1'" style="width:35px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/1st-place-crown.png" />
                    <img v-else-if="rnp.rank === '2'" style="width:35px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/2nd-place-crown.png" />
                    <img v-else-if="rnp.rank === '3'" style="width:35px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/3rd-place-crown.png" />
                    <span v-else>{{ rnp.rank }}</span>
                </div>
                <div>{{ rnp.percent }}</div>
            </div>
        </div>

        <br/>
        <br/>

        <img v-if="langVal === 'ur'" class="title-img" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/activity-rules-title-ur.png" />
        <img v-else class="title-img" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/activity-rules-title.png" />

        <ol class="rules">
            <li class="rule-item">{{ $t('hotPromo.jackpotAviator.activityRules1') }}</li>
            <li class="rule-item">{{ $t('hotPromo.jackpotAviator.activityRules2') }}</li>
            <li class="rule-item">{{ $t('hotPromo.jackpotAviator.activityRules3') }}</li>
            <li class="rule-item">{{ $t('hotPromo.jackpotAviator.activityRules4') }}</li>
        </ol>

        <br/>

        <img v-if="langVal === 'ur'" class="title-img" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/terms-conditions-title-ur.png" />
        <img v-else class="title-img" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/terms-conditions-title.png" />
        
        <ol class="rules">
            <li class="rule-item">{{ $t('hotPromo.jackpotAviator.termsCondition1') }}</li>
            <li class="rule-item">{{ $t('hotPromo.jackpotAviator.termsCondition2') }}</li>
            <li class="rule-item">{{ $t('hotPromo.jackpotAviator.termsCondition3') }}</li>
        </ol>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { i18nStore } from "src/router/language";

const props = defineProps(['onClickBackBtn']);

const i18nStoreLanguage = i18nStore();

const langVal = computed(() => i18nStoreLanguage.languageVal);

const ranksAndPercentages = ref([
    { rank: "1", percent: "9.50%" },
    { rank: "2", percent: "6.00%" },
    { rank: "3", percent: "4.50%" },
    { rank: "4", percent: "2.97%" },
    { rank: "5", percent: "2.34%" },
    { rank: "6", percent: "1.92%" },
    { rank: "7", percent: "1.62%" },
    { rank: "8", percent: "1.42%" },
    { rank: "9", percent: "1.30%" },
    { rank: "10", percent: "1.23%" },
    { rank: "11", percent: "1.18%" },
    { rank: "12", percent: "1.15%" },
    { rank: "13", percent: "1.12%" },
    { rank: "14", percent: "1.09%" },
    { rank: "15", percent: "1.06%" },
    { rank: "16", percent: "1.03%" },
    { rank: "17", percent: "1.00%" },
    { rank: "18", percent: "0.97%" },
    { rank: "19", percent: "0.94%" },
    { rank: "20", percent: "0.91%" },
    { rank: "21", percent: "0.89%" },
    { rank: "22", percent: "0.87%" },
    { rank: "23", percent: "0.85%" },
    { rank: "24", percent: "0.83%" },
    { rank: "25", percent: "0.81%" },
    { rank: "26", percent: "0.79%" },
    { rank: "27", percent: "0.77%" },
    { rank: "28", percent: "0.75%" },
    { rank: "29", percent: "0.73%" },
    { rank: "30", percent: "0.71%" },
    { rank: "31", percent: "0.69%" },
    { rank: "32", percent: "0.67%" },
    { rank: "33", percent: "0.65%" },
    { rank: "34", percent: "0.63%" },
    { rank: "35", percent: "0.61%" },
    { rank: "36", percent: "0.59%" },
    { rank: "37", percent: "0.57%" },
    { rank: "38", percent: "0.55%" },
    { rank: "39", percent: "0.53%" },
    { rank: "40", percent: "0.51%" },
    { rank: "41", percent: "0.49%" },
    { rank: "42", percent: "0.47%" },
    { rank: "43", percent: "0.45%" },
    { rank: "44", percent: "0.43%" },
    { rank: "45", percent: "0.41%" },
    { rank: "46", percent: "0.39%" },
    { rank: "47", percent: "0.37%" },
    { rank: "48", percent: "0.35%" },
    { rank: "49", percent: "0.33%" },
    { rank: "50", percent: "0.31%" },
    { rank: "51-55", percent: "1.45%" },
    { rank: "56-60", percent: "1.40%" },
    { rank: "61-65", percent: "1.35%" },
    { rank: "66-70", percent: "1.30%" },
    { rank: "71-75", percent: "1.25%" },
    { rank: "76-80", percent: "1.20%" },
    { rank: "81-85", percent: "1.15%" },
    { rank: "86-90", percent: "1.10%" },
    { rank: "91-95", percent: "1.05%" },
    { rank: "96-100", percent: "1.00%" },
    { rank: "101-110", percent: "1.90%" },
    { rank: "111-120", percent: "1.80%" },
    { rank: "121-130", percent: "1.70%" },
    { rank: "131-140", percent: "1.60%" },
    { rank: "141-150", percent: "1.50%" },
    { rank: "151-160", percent: "1.40%" },
    { rank: "161-170", percent: "1.30%" },
    { rank: "171-180", percent: "1.20%" },
    { rank: "181-190", percent: "1.10%" },
    { rank: "191-200", percent: "1.00%" },
    { rank: "201-220", percent: "1.80%" },
    { rank: "221-240", percent: "1.60%" },
    { rank: "241-260", percent: "1.40%" },
    { rank: "261-280", percent: "1.20%" },
    { rank: "281-300", percent: "1.00%" },
    { rank: "301-350", percent: "2.00%" },
    { rank: "351-400", percent: "1.50%" },
    { rank: "401-450", percent: "1.00%" },
    { rank: "451-500", percent: "0.50%" }
]);
</script>

<style lang="scss" scoped>
.rules-container {
    position: relative;
    padding: 40px 20px 20px 20px;

    .title-img {
        display: flex;
        margin: 0 auto;
    }

    .back-btn {
        position: absolute;
        top: 0px;
        left: 20px;
        width: 33px !important;
        height: 33px !important;
        cursor: pointer;

        &:hover {
            filter: brightness(1.1);
        }
    }

    .rule-item {
        font-family: Poppins;
        font-size: 12px;
        font-weight: 400;
        line-height: 25px;
        text-align: left;
        color: #9F9F9F;
    }

    .ranking {
        display: flex;
        flex-direction: column;

        .item {
            display: grid;
            grid-template-columns: 1fr 1fr;
            justify-content: center;
            align-items: center;
            text-align: center;
            height: 30px;

            .rank {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            &:first-child {
                font-family: Manrope;
                font-size: 12px;
                font-weight: 700;
                line-height: 18px;
                text-align: center;
                background: linear-gradient(180deg, #70BC62 0%, #33562D 100%);
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }

            &:last-child {
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }

            &:not(:first-child) {
                font-family: Manrope;
                font-size: 14px;
                font-weight: 700;
                line-height: 14px;
                text-align: center;
            }

            &:nth-child(odd) {
                background-color: #032503;
            }

            &:nth-child(even) {
                background-color: #113810;
            }
        }
    }
}
</style>