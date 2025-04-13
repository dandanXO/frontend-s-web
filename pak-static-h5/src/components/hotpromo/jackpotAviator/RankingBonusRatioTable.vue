<template>
    <div class="ranking">
        <div class="item">
            <div>{{ $t('hotPromo.jackpotAviator.rank') }}</div>
            <div>{{ $t('hotPromo.jackpotAviator.dailyOrWeekly') }}</div>
        </div>

        <template v-if="Array.isArray(props.rankingBonusRatioList)">
            <div class="item" v-for="rbrListItem, rank in props.rankingBonusRatioList" :key="rank">
                <div class="rank">
                    <img v-if="rbrListItem.rank === '1'" style="width:35px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/1st-place-crown.png" />
                    <img v-else-if="rbrListItem.rank === '2'" style="width:35px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/2nd-place-crown.png" />
                    <img v-else-if="rbrListItem.rank === '3'" style="width:35px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/3rd-place-crown.png" />
                    <span v-else>{{ rbrListItem.rank }}</span>
                </div>
                <div class="bonus">{{ rbrListItem.bonusPerc?.toFixed(2) }}%</div>
            </div>
        </template>
    </div>
</template>

<script setup>
const props = defineProps(['rankingBonusRatioList']);
</script>

<style lang="scss" scoped>
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
            background: linear-gradient(180deg, #FB4F77 0%, #DA093A 100%);
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
            background-color: #323738;
        }

        &:nth-child(even) {
            background-color: #394142;
        }
        .bonus {
            color: #DE4B48;
        }
        &:hover {
            background: linear-gradient(180deg, #FB4F77 0%, #DA093A 100%);
            color: #ffffff;
        }
    }
}
</style>