<template>
    <div class="page-container">
        <div class="panel-item">
            <div>
                <el-form @submit.prevent>
                    <el-row :gutter="20">
                        <el-col :xl="8" :lg="8" :md="6" :sm="6">
                            <el-form-item :label="t('fields.vendorName') + ' :'">
                                <el-input v-model="request.vendorName" maxlength="11" />
                            </el-form-item>
                        </el-col>
                        <el-col :xl="8" :lg="8" :md="10" :sm="8">
                            <el-form-item :label="t('fields.date') + ' :'">
                                <el-date-picker v-model="request.date" format="DD/MM/YYYY HH:mm:ss"
                                    value-format="YYYY-MM-DD HH:mm:ss" size="normal" type="datetimerange"
                                    range-separator=":" :start-placeholder="t('fields.startDate')"
                                    :end-placeholder="t('fields.endDate')" :shortcuts="shortcuts"
                                    :disabled-date="disabledDate" :editable="false" :clearable="false"
                                    :default-time="defaultTime" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div style="overflow:scroll">
                <table cellpadding="0" cellspacing="0" border class="custom-table">
                    <thead>
                        <tr>
                            <th scope="col">{{ t('fields.topId') }}</th>
                            <th scope="col">{{ t('fields.id') }}</th>
                            <th scope="col">{{ t('fields.charge') }}</th>
                            <th scope="col">{{ t('fields.exchange') }}</th>
                            <th scope="col">{{ t('fields.bet') }}</th>
                            <th scope="col">{{ t('fields.winner') }}</th>
                            <th scope="col">{{ t('fields.rolling') }}</th>
                            <th scope="col">{{ t('fields.bettingProfitLoss') }}</th>
                            <th scope="col">{{ t('fields.reserves') }}</th>
                            <th scope="col">{{ t('fields.point') }}</th>
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
                        <tr>
                            <td class="textCenter" colspan="2">
                                total
                            </td>
                            <td v-formatter="{ data: totals.thirdCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: totals.fourthCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: totals.fifthCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: totals.sixthCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: totals.seventhCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: totals.eightCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: totals.ninethCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: totals.tenthCol, type: 'p&l' }">
                            </td>
                        </tr>
                        <tr v-for="item in page.records" :key="item.id">
                            <td :data-label="t('fields.firstCol')">
                                {{ item.firstCol }}
                            </td>
                            <td :data-label="t('fields.secondCol')">
                                <strong>{{ item.secondCol }}</strong>
                            </td>
                            <td v-formatter="{ data: item.thirdCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: item.fourthCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: item.fifthCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: item.sixthCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: item.seventhCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: item.eightCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: item.ninethCol, type: 'p&l' }">
                            </td>
                            <td v-formatter="{ data: item.tenthCol, type: 'p&l' }">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n'
import Loading from '@/components/loading/Loading.vue';
import { formatMoney } from "@/utils/format-money";
import moment from 'moment';

const { t } = useI18n();

const request = reactive({
    memberId: '',
    date: [convertStartDate(new Date()), convertDate(new Date())],
})

function convertStartDate(date) {
    return moment(date)
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
}

function convertDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 1, 1, 23, 59, 59),
]
const shortcuts = [
    {
        text: t('fields.today'),
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(
                moment(start)
                    .startOf('day')
                    .format('x')
            )
            return [start, end]
        },
    },
    {
        text: t('fields.yesterday'),
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(
                moment(start)
                    .subtract(1, 'days')
                    .startOf('day')
                    .format('x')
            )
            end.setTime(
                moment(end)
                    .subtract(1, 'days')
                    .endOf('day')
                    .format('x')
            )
            return [start, end]
        },
    },
    {
        text: t('fields.thisWeek'),
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(
                moment(start)
                    .startOf('isoWeek')
                    .format('x')
            )
            return [start, end]
        },
    },
    {
        text: t('fields.lastWeek'),
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(
                moment(start)
                    .subtract(1, 'weeks')
                    .startOf('isoWeek')
                    .format('x')
            )
            end.setTime(
                moment(end)
                    .subtract(1, 'weeks')
                    .endOf('isoWeek')
                    .format('x')
            )
            return [start, end]
        },
    },
    {
        text: t('fields.thisMonth'),
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(
                moment(start)
                    .startOf('month')
                    .format('x')
            )
            return [start, end]
        },
    },
    {
        text: t('fields.lastMonth'),
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(
                moment(start)
                    .subtract(1, 'months')
                    .startOf('month')
                    .format('x')
            )
            end.setTime(
                moment(end)
                    .subtract(1, 'months')
                    .endOf('month')
                    .format('x')
            )
            return [start, end]
        },
    },
]


const page = reactive({
    pages: 0,
    records: [
        {
            firstCol: 'bentley',
            secondCol: 'bthcuser01',
            thirdCol: 20150000,
            fourthCol: -50000,
            fifthCol: 2288794,
            sixthCol: 1754567,
            seventhCol: -79407,
            eightCol: 454820,
            ninethCol: 2110285,
            tenthCol: 1936
        },
        {
            firstCol: 'bentley',
            secondCol: 'bthcuser01',
            thirdCol: 20150000,
            fourthCol: -50000,
            fifthCol: 2288794,
            sixthCol: 1754567,
            seventhCol: -79407,
            eightCol: 454820,
            ninethCol: 2110285,
            tenthCol: 1936
        },
        {
            firstCol: 'bentley',
            secondCol: 'bthcuser01',
            thirdCol: 20150000,
            fourthCol: -50000,
            fifthCol: 2288794,
            sixthCol: 1754567,
            seventhCol: -79407,
            eightCol: 454820,
            ninethCol: 2110285,
            tenthCol: 1936
        },
        {
            firstCol: 'bentley',
            secondCol: 'bthcuser01',
            thirdCol: 20150000,
            fourthCol: -50000,
            fifthCol: 2288794,
            sixthCol: 1754567,
            seventhCol: -79407,
            eightCol: 454820,
            ninethCol: 2110285,
            tenthCol: 1936
        }
    ],
    loading: false,
});

const totals = page.records.reduce((acc, curr) => {
    acc.secondCol += curr.secondCol;
    acc.thirdCol += curr.thirdCol;
    acc.fourthCol += curr.fourthCol;
    acc.fifthCol += curr.fifthCol;
    acc.sixthCol += curr.sixthCol;
    acc.seventhCol += curr.seventhCol;
    acc.eightCol += curr.eightCol;
    acc.ninethCol += curr.ninethCol;
    acc.tenthCol += curr.tenthCol;

    return acc;
}, {
    secondCol: 0,
    thirdCol: 0,
    fourthCol: 0,
    fifthCol: 0,
    sixthCol: 0,
    seventhCol: 0,
    eightCol: 0,
    ninethCol: 0,
    tenthCol: 0
})

</script>

<style lang="scss" scoped>
.custom-table {
    tbody tr {
        &:first-child {
            border-bottom-style: double;
            border-color: #cfd8dc;
        }
    }
}
</style>