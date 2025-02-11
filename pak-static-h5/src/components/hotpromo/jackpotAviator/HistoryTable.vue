<template>
    <div class="history-list" v-if="props?.historyList">
        <div class="item">
            <div>{{ $t('hotPromo.jackpotAviator.ranking') }}</div>
            <div>{{ $t('hotPromo.jackpotAviator.username') }}</div>
            <div>{{ $t('hotPromo.jackpotAviator.betVolume') }}</div>
        </div>

        <div class="scrollable">
            <div class="item" v-for="historyListItem, historyListItemIndex in props?.historyList" :key="historyListItemIndex">
                <div class="rank">
                    <img v-if="historyListItemIndex + 1 === 1" style="width:40px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/1st-place-crown.png" />
                    <img v-else-if="historyListItemIndex + 1 === 2" style="width:40px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/2nd-place-crown.png" />
                    <img v-else-if="historyListItemIndex + 1 === 3" style="width:40px;margin:0;" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/3rd-place-crown.png" />
                    <span v-else>{{ historyListItemIndex + 1 }}</span>
                </div>
                <div>{{ historyListItem.loginName }}</div>
                <div class="betVolume">{{ historyListItem.amount?.toFixed(2) }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps(['historyList'])
</script>
<style lang="scss" scoped>

.history-list {
    display: flex;
    flex-direction: column;
    margin: 0 10px;
    border-radius: 5px;
    overflow: hidden;
    padding-bottom: 0px;

    .item {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        justify-content: center;
        align-items: center;
        text-align: center;
        height: 40px;

        .rank {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        &:first-child {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 600;
            line-height: 40px;
            text-align: center;

        }

        &:not(:first-child) {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 600;
            line-height: 40px;
            text-align: center;
            color: #FFFFFF80;
        }

        &:nth-child(odd) {
            background-color: #032503;
        }

        &:nth-child(even) {
            background-color: #113810;
        }
    }
}

.scrollable {
    max-height: 500px;
    overflow: auto;
}
</style>