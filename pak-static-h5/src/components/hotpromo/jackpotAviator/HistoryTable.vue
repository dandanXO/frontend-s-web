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
    // margin: 0 10px;
    
    // margin: 20px auto 75px;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 30px;
    // padding-bottom: 0px;
        // padding-bottom: 15px;

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
        color: #FFFFFF80;

        .header {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 600;
            line-height: 40px;
            text-align: center;
            color: #FFFFFF;
        }

        &.isOwn {
            background: linear-gradient(180deg, #1BAA99 0%, #8AC542 100%);
            color: #fff;
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
            background-color: #323738;
            
        }

        &:nth-child(even) {
            background: #394142;
        }
        &:hover {
            background: linear-gradient(180deg, #FB4F77 0%, #DA093A 100%);
            color: #ffffff;
        }
        .betVolume {
            color: #DE4B48;
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