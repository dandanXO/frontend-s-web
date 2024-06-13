<template>
    <q-intersection @visibility="(a) => {
        console.log('here')
    }">
        <div class="news-section">
            <div class="news-title news-title__sub">
                <div class="title-text">출금현황</div>
            </div>

            <div class="news-item-box" v-for="d, index in props.depositRecordList" :key="index">
                <div class="news-item-left">
                    <div class="news-item-title">
                        {{ formatTransactionType(d.transactionType) }}
                        {{ d.loginName }}
                        <span style="color: #01e1ff">{{ d.amount }}원</span>
                    </div>
                </div>
                <div class="news-item-right">
                    <div class="news-item-date">{{ moment(d.transationTime).format('YYYY-MM-DD hh:mm A') }}</div>
                </div>
            </div>
        </div>
    </q-intersection>
</template>

<script setup>
import moment from 'moment';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps(['depositRecordList']);

const formatTransactionType = (transactionType) => {
    if (transactionType === 'DEPOSIT') {
        return `[${t('lang.menu_deposit')}]`;
    }

    if (transactionType === 'WITHDRAW') {
        return `[${t('lang.menu_withdraw')}]`;
    }

    return '';
}

</script>

<style lang="scss">
.news-section {
    margin-top: 20px;
    padding: 0 16px;
}

.news-split {
    display: flex;
    flex-wrap: wrap;

    @media (min-width: 769px) {
        gap: 10px;
    }

    .news-section {
        width: 100%;

        @media (min-width: 769px) {
            width: calc(50% - 5px);
        }
    }

    .news-item-left {
        width: 100% !important;
    }
}

.news-title {
    // background: linear-gradient(#3f4146, #202226);
    background: linear-gradient(180deg, #384a70 0%, #121c31 100%);

    height: 61px;
    border: 1px #454545 solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px;

    &__sub {
        background: linear-gradient(180deg, #385f70 0%, #122931 100%);
    }

    @media (min-width: 769px) {
        padding: 0px 40x;
    }

    .title-text {
        font-size: 14px;
        line-height: 19.6px;

        @media (min-width: 769px) {
            font-size: 20px;
            line-height: 28px;
        }
    }

    .more-text {
        font-size: 14px;
        line-height: 19.6px;
        color: #ff3c3c;
        cursor: pointer;

        @media (min-width: 769px) {
            font-size: 20px;
            line-height: 28px;
        }
    }
}

.news-item-box {
    width: 100%;
    height: 60px;
    background-color: #192235;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 25px;
    font-size: 12px;
    line-height: 16.8px;
    border-bottom: 1px solid #3f3f3f;

    display: grid;
    grid-template-columns: minmax(calc(90% - 100px), 90%) minmax(120px, 10%);

    @media (min-width: 769px) {
        grid-template-columns: minmax(calc(80% - 100px), 90%) minmax(200px, 20%);
    }

    &:hover {

        .news-item-title,
        .news-item-date {
            transform: scale(1.02);
            color: #01e1ff !important;
        }
    }

    @media (min-width: 769px) {
        padding: 0px 40x;
        font-size: 16px;
        line-height: 22px;
    }

    .news-item-left {
        width: 100%;

        @media (min-width: 769px) {
            width: 60%;
        }

        .news-item-sort {
            padding-right: 8px;
        }

        .news-item-title {
            transition: 0.3s all;
            padding-right: 8px;
            padding-left: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            @media (max-width: 769px) {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .news-item-box {
        @media (min-width: 769px) {
            width: 100%;
        }
    }

    .news-item-right {
        .news-item-date {
            transition: 0.3s all;
            color: #92959f;
            text-align: right;
        }
    }
}
</style>