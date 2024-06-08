<template>
    <div class="rolling-text-container">
        <div class="rolling-text-wrapper">
            <div class="volume">
                <img src="../../assets/icon/icon-announcement.svg" />
                <div class="box">
                    <div class="text">출금현황</div>
                </div>
            </div>
            <div  style="width:100%;text-align:center;"  v-if="isLoadingDepositRecordList">
                <q-spinner-pie color="purple" size="20"/>
            </div>
            <marquee-text :repeat="props.depositRecordList.length" :duration="props.depositRecordList.length * 20"
                v-else-if="props.depositRecordList && props.depositRecordList.length > 0">
                <div>
                    <span style="color: #fff;" v-for="(a, i) in props.depositRecordList" :key="i">
                        {{ a.loginName }} 환전 {{ `${a.amount}원` }}  {{ moment(a.transactionTime).format('YYYY-MM-DD hh:mm A') }}
                    </span>
                </div>
            </marquee-text>
            <div v-else style="width:100%;text-align:center;">
                <span style="color: #fff;">
                    {{ $t('lang.roll_text_no_content') }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import MarqueeText from "vue-marquee-text-component";
import moment from 'moment';

const props = defineProps(['depositRecordList', 'isLoadingDepositRecordList']);

</script>

<style lang="scss" scoped>
.rolling-text-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;

    @media (min-width: 769px) {
        padding: 20px;
    }

    .rolling-text-wrapper {
        display: flex;
        border-radius: 8px;
        background-color: #151324;
        gap: 10px;
        padding: 6px;
        justify-content: center;
        align-items: center;
        width: 85%;
        flex: 1;
        border: 1px solid #24213f;

        @media (min-width: 769px) {
            padding: 8px 12px;
        }

        .volume {
            height: 24px;
            display: flex;
            align-items: center;

            @media (min-width: 769px) {
                height: 32px;
            }

            .box {
                color: #00FFFF;
                width: 48px;
                font-size: 16px;
                line-height: 22.4px;
                border-radius: 2px;
                display: flex;
                justify-content: center;

                @media (min-width: 769px) {
                    width: 60px;
                }
            }
        }

        span {
            margin-right: 10px;
            cursor: pointer;
        }
    }

    .share {
        background-image: $linear-bg-red;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        cursor: pointer;
        flex: 1;
    }
}
</style>
