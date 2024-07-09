<template>
    <table cellpadding="0" cellspacing="0" border class="custom-table">
        <thead>
            <tr>
                <th scope="col">{{ t('fields.date') }}</th>
                <th scope="col">{{ t('fields.secondCol') }}</th>
                <th scope="col">{{ t('fields.thirdCol') }}</th>
                <th scope="col">{{ t('fields.fourthCol') }}</th>
            </tr>
        </thead>
        <tbody v-if="page.loading || page.records.length === 0">
            <tr>
                <td colspan="11">
                    <Loading v-if="page.loading" />
                    <emptyComp v-else-if="page.records.length === 0" />
                </td>
            </tr>
        </tbody>
        <tbody v-else-if="page.records.length > 0">
            <tr v-for="item in page.records" :key="item.id">
                <td :data-label="t('fields.date')">
                    {{ item.date }}
                </td>
                <td class="bgGreen textGreen" :data-label="t('fields.secondCol')">
                    {{ formatMoney(item.secondCol) }}
                </td>
                <td class="bgRed textRed" :data-label="t('fields.thirdCol')">
                    {{ formatMoney(item.thirdCol) }}
                </td>
                <td class="bgYellow textRed" :data-label="t('fields.fourthCol')">
                    {{ formatMoney(item.fourthCol) }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n'
import Loading from '@/components/loading/Loading.vue';
import { formatMoney } from "@/utils/format-money";

const { t } = useI18n();

const page = reactive({
    pages: 0,
    records: [{
        date: '2024-07-02 (Tue)',
        secondCol: 100000,
        thirdCol: -50000,
        fourthCol: 50000
    }],
    loading: false,
});
</script>

<style lang="scss" scoped></style>