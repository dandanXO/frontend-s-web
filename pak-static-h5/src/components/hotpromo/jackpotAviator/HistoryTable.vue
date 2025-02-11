<template>
    <div class="history-list" v-if="props?.historyList">
        <div class="item">
            <div>{{ $t('hotPromo.jackpotAviator.ranking') }}</div>
            <div>{{ $t('hotPromo.jackpotAviator.username') }}</div>
            <div>{{ $t('hotPromo.jackpotAviator.betVolume') }}</div>
        </div>

        <div class="item" v-for="historyListItem, historyListItemIndex in props?.historyList" :key="historyListItemIndex">
            <div>{{ historyListItemIndex + 1 }}</div>
            <div>{{ historyListItem.loginName }}</div>
            <div class="betVolume">{{ historyListItem.amount?.toFixed(2) }}</div>
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
</style>