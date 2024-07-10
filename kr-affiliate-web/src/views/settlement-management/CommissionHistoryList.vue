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
                            <th scope="col">{{ t('fields.type') }}</th>
                            <th scope="col">{{ t('fields.id') }}</th>
                            <th scope="col">{{ t('fields.subId') }}</th>
                            <th scope="col">{{ t('fields.vendor') }}</th>
                            <th scope="col">{{ t('fields.game') }}</th>
                            <th scope="col">{{ t('fields.bet') }}</th>
                            <th scope="col">{{ t('fields.commissionPercentage') }}</th>
                            <th scope="col">{{ t('fields.commission') }}</th>
                            <th scope="col">{{ t('fields.viewDetails') }}</th>
                            <th scope="col">{{ t('fields.date') }}</th>
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
                            <td v-formatter="{ data: item.firstCol, type: 'gameType' }">
                            </td>
                            <td class="textCenter" :data-label="t('fields.secondCol')">
                                <strong>{{ item.secondCol }}</strong>
                            </td>
                            <td class="textCenter" :data-label="t('fields.thirdCol')">
                                <strong>{{ item.thirdCol }}</strong>
                            </td>
                            <td class="textCenter" :data-label="t('fields.fourthCol')">
                                {{ item.fourthCol }}
                            </td>
                            <td class="textCenter" :data-label="t('fields.fifthCol')">
                                {{ item.fifthCol }}
                            </td>
                            <td class="textRight" :data-label="t('fields.sixthCol')">
                                {{ item.sixthCol }}
                            </td>
                            <td class="textRight" :data-label="t('fields.seventhCol')"
                                v-formatter="{ data: item.seventhCol, type: 'decimal' }">
                            </td>
                            <td class="textRight" :data-label="t('fields.eightCol')"
                                v-formatter="{ data: item.eightCol, type: 'decimal' }">
                                {{ item.eightCol }}
                            </td>
                            <td :data-label="t('fields.ninethCol')">
                                <div class="colorBoxBlue" style="white-space: nowrap; cursor: pointer;">More Information
                                </div>
                            </td>
                            <td :data-label="t('fields.tenthCol')">
                                {{ item.tenthCol }}
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
            firstCol: 'SLOT',
            secondCol: 'bthcuser01',
            thirdCol: 'bthcuser01',
            fourthCol: 'Evoplay',
            fifthCol: 'Football',
            sixthCol: 200,
            seventhCol: 3.00,
            eightCol: 6.00,
            ninethCol: '',
            tenthCol: '2024-07-09 4:04:27 PM'
        },
        {
            firstCol: 'SLOT',
            secondCol: 'bthcuser01',
            thirdCol: 'bthcuser01',
            fourthCol: 'Evoplay',
            fifthCol: 'Football',
            sixthCol: 200,
            seventhCol: 3.00,
            eightCol: 6.00,
            ninethCol: '',
            tenthCol: '2024-07-09 4:04:27 PM'
        },
        {
            firstCol: 'SLOT',
            secondCol: 'bthcuser01',
            thirdCol: 'bthcuser01',
            fourthCol: 'Evoplay',
            fifthCol: 'Football',
            sixthCol: 200,
            seventhCol: 3.00,
            eightCol: 6.00,
            ninethCol: '',
            tenthCol: '2024-07-09 4:04:27 PM'
        },
        {
            firstCol: 'SLOT',
            secondCol: 'bthcuser01',
            thirdCol: 'bthcuser01',
            fourthCol: 'Evoplay',
            fifthCol: 'Football',
            sixthCol: 200,
            seventhCol: 3.00,
            eightCol: 6.00,
            ninethCol: '',
            tenthCol: '2024-07-09 4:04:27 PM'
        },
        {
            firstCol: 'SLOT',
            secondCol: 'bthcuser01',
            thirdCol: 'bthcuser01',
            fourthCol: 'Evoplay',
            fifthCol: 'Football',
            sixthCol: 200,
            seventhCol: 3.00,
            eightCol: 6.00,
            ninethCol: '',
            tenthCol: '2024-07-09 4:04:27 PM'
        }
    ],
    loading: false,
});
</script>

<style lang="scss" scoped></style>