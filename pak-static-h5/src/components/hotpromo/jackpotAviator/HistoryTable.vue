<template>
    <div class="history-list" v-if="props?.historyList">
        <div class="item firstheader">
            <div class="header">{{ $t('hotPromo.jackpotAviator.ranking') }}</div>
            <div class="header">{{ $t('hotPromo.jackpotAviator.username') }}</div>
            <div class="header">{{ $t('hotPromo.jackpotAviator.betVolume') }}</div>
        </div>

        <div class="scrollable">
            <div class="item" v-for="historyListItem, historyListItemIndex in props?.historyList?.slice(3)" :key="historyListItemIndex" :class="{ isOwn: historyListItem?.currentMember }">
                <div class="rank">
                    <!-- <img class="crown-icon" v-if="historyListItemIndex + 1 === 1" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/1st-place-crown.png" />
                    <img class="crown-icon" v-else-if="historyListItemIndex + 1 === 2"  src="../../../assets/images/promotion/hotpromo/jackpot-aviator/2nd-place-crown.png" />
                    <img class="crown-icon" v-else-if="historyListItemIndex + 1 === 3" src="../../../assets/images/promotion/hotpromo/jackpot-aviator/3rd-place-crown.png" /> -->
                    <span>{{ historyListItemIndex + 4 }}</span>
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
        // margin: 0 0 70px;
    margin: 0;
        
    max-height: calc(100vh - 600px);
    // padding-bottom: 0px;
        // padding-bottom: 15px;
    .item {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        justify-content: center;
        align-items: center;
        font-family: Poppins;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        text-align: center;
        color: #FFFFFF80;
        height: 30px;
        &.firstheader {
            color: #FFFFFF;
            height: 22px;
            font-size: 12px;
            background-color: #730319 !important;
            &:hover {
                    color: unset;
                .betVolume {
                    color: unset;
                }
            }
        }
        .header {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            text-align: center;
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
            background-color: #1c1716;
            
        }

        &:nth-child(even) {
            background: #332e2d;
        }
        &:hover {
            background: linear-gradient(180deg, #730319 0%, #DA093A 100%);
            
                color: #3c0e10;
            background: #CBA46B;
            .betVolume {
                color: #3c0e10;
            }
        }
        .betVolume {
            color: #DAC385;
        }
    }
}

.scrollable {
    max-height: 500px;
    overflow: auto;
}

@media (max-width: 400px) {
    .history-list {       
        margin: 0;
        
        max-height: calc(100vh - 570px);
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

@supports (-webkit-overflow-scrolling: touch) and (not (overflow: -webkit-marquee)) {
  .history-list {
    max-height: calc(100dvh - 460px);
  }
}
</style>