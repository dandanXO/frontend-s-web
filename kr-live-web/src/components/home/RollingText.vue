<template>
    <div class="rolling-text-container">
        <div class="rolling-text-wrapper">
            <div class="volume">
                <img src="../../assets/icon/icon-announcement.svg" />
                <div class="box">
                    <div class="text">{{ $t('lang.roll_text_withdrawal_status') }}</div>
                </div>
            </div>
            <div style="width:100%;text-align:center;" v-if="isLoading">
                <q-skeleton type="text" style="width:100%;" />
            </div>
            <marquee-text :repeat="financeRecords.length" :duration="financeRecords.length * 20"
                v-else-if="financeRecords.length > 0">
                <div>
                    <span style="color: #fff;" v-for="(a, i) in financeRecords" :key="i">
                        <span style="color:#03fff2;">{{ formatTransactionType(a.transactionType) }}</span> {{
                            a.loginName
                        }}
                        환전
                        <span style="font-family: 'Nanum';">{{ `${a.amount} 원` }}</span>
                        <span class="text-caption text-grey">{{ getLocaleDateTime(a.transactionTime, true) }}</span>
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
import { ref, watch, onMounted } from 'vue';
import MarqueeText from "vue-marquee-text-component";
import moment from 'moment';
import { useI18n } from "vue-i18n";
import { userStore } from "stores/index";
import { useRoute } from 'vue-router';
import { getLocaleDateTime } from '../../boot/utils';

const { t } = useI18n();
const isLoading = ref(false);
const financeRecords = ref([]);
const store = userStore();
const route = useRoute();

const loadFinanceRecords = () => {
    isLoading.value = true;

    store.getFinanceRecords().then((records) => {
        financeRecords.value = records;
        isLoading.value = false;
    }).catch((err) => {
        console.log(err)
        isLoading.value = false;
    });
};

watch(() => route.query.page, () => {
    if (route.query.page) {
    } else {
        loadFinanceRecords();
    }
})

onMounted(() => {
    if (route.query.page) {
    } else {
        loadFinanceRecords();
    }
})

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
        max-width: 1400px;
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
            gap: 5px;

            @media (min-width: 769px) {
                height: 32px;
            }

            .box {
                color: #00FFFF;
                width: 100%;
                font-size: 16px;
                line-height: 22.4px;
                border-radius: 2px;
                display: flex;
                justify-content: center;
                white-space: nowrap;
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
