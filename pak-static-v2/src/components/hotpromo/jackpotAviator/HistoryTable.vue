<template>
    <div class="history-list" v-if="props?.historyList">
        <div class="item">
            <div class="header">{{ $t('hotPromo.jackpotAviator.ranking') }}</div>
            <div class="header">{{ $t('hotPromo.jackpotAviator.username') }}</div>
            <div class="header">{{ $t('hotPromo.jackpotAviator.betVolume') }}</div>
        </div>

        <div class="scrollable">
            <div class="item" v-for="historyListItem, historyListItemIndex in props?.historyList" :key="historyListItemIndex" :class="{ isOwn: historyListItem?.currentMember }">
                <div class="rank">
                    <img class="crown-icon" v-if="historyListItemIndex + 1 === 1" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/1st-place-crown.png" />
                    <img class="crown-icon" v-else-if="historyListItemIndex + 1 === 2"  src="../../../assets/images/promotion/hotpromo/jackpot-aviator/2nd-place-crown.png" />
                    <img class="crown-icon" v-else-if="historyListItemIndex + 1 === 3" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/3rd-place-crown.png" />
                    <span v-else>{{ historyListItemIndex + 1 }}</span>
                </div>
                <div>{{ historyListItem.loginName }}</div>
                <div class="betVolume">{{ historyListItem.amount?.toFixed(2) }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps(['historyList']);

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
        font-family: Poppins;
        font-size: 14px;
        font-weight: 600;
        line-height: 40px;
        text-align: center;
        color: #424F72;

        .header {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 600;
            line-height: 40px;
            text-align: center;
            color: #FFFFFF;
            background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);

        }

        &.isOwn {
            background: linear-gradient(180deg, #1BAA99 0%, #8AC542 100%);
            color: #424F72;
        }

        .rank {
            display: flex;
            justify-content: center;
            align-items: center;

            .crown-icon {
                width:40px;
                margin:0;
            }
        }
        
        &:nth-child(odd) {
            background-color: #D7E9FF;
            
        }

        &:nth-child(even) {
            background: #E9F2FD;
        }
        &:hover {
            background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
            color: #ffffff;
            .betVolume {
                color: #ffffff;
            }
        }
        .betVolume {
            color: #3C83FF;
        }
    }
}

.scrollable {
    max-height: 500px;
    overflow: auto;
}

@media (max-width: 400px) {
    .history-list {
        margin: 0 5px;

        .item {
            height: 30px;

            .rank {
                .crown-icon {
                    width:30px;
                }
            }

            &:first-child {
                font-size: 12px;
                line-height: 30px;
                letter-spacing: -1px;

            }

            &:not(:first-child) {
                font-size: 12px;
                line-height: 30px;
                letter-spacing: -1px;
            }
        }
    }
}
</style>