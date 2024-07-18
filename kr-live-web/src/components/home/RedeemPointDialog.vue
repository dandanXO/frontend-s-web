<template>
    <q-dialog v-model="props.redeemDialogVisible" no-route-dismiss persistent>
        <q-card style="padding: 20px">
            <p>Your current point : <b>100</b></p>
            <p>Do you want to redeem?</p>

            <div style="display:flex;justify-content: flex-end;margin-bottom:20px;">
                <q-button class="primary-button yellow-square" @click="redeemDialogVisible = false">
                    {{ $t('lang.cancel') }}
                </q-button>
                <q-button class="primary-button blue-square" @click="() => { }">
                    {{ $t('lang.confirm') }}
                </q-button>
            </div>

            <DataTable :pagination="pagination" :loading="loading" :tableColumns="tableColumns" :dataState="tableData"
                @onChangePage="(currentPage) => {
                    pagination.current = currentPage;
                    recordPage(pagination)
                }">
                <template #body-cell-operation="props">
                    <q-td>
                        <div style="display:flex;justify-content: flex-end;">
                            <q-button style="min-width:60px;width:60px;height:30px;"
                                class="primary-button yellow-square" @click="redeemDialogVisible = false">
                                {{ $t('lang.cancel') }}
                            </q-button>
                            <q-button style="min-width:60px;width:60px;height:30px;" class="primary-button blue-square"
                                @click="() => { }">
                                {{ $t('lang.redeem') }}
                            </q-button>
                        </div>
                    </q-td>
                </template>
            </DataTable>
        </q-card>
    </q-dialog>
</template>

<script setup>
import DataTable from 'components/transaction/DataTable';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps(['redeemDialogVisible']);
const tableColumns = [
    {
        label: 'point金额',
        field: "point",
        name: "point",
        align: 'center'
    },
    {
        label: '日期',
        field: "date",
        name: "date",
        align: 'center'
    },
    {
        label: '来源',
        field: "source",
        name: "source",
        align: 'center'
    },
    {
        label: '提款条件',
        field: "condition",
        name: "condition",
        align: 'center'
    },
    {
        label: '操作按钮',
        field: "operation",
        name: "operation",
        align: 'center'
    },
];
const tableData = [
    {
        point: 10000,
        date: Date.now(),
        source: '首存奖金',
        condition: 'x5',
        action: null,
    },
    {
        point: 20000,
        date: Date.now(),
        source: '15分更新一次返水',
        condition: 'x10',
        action: null,
    },
    {
        point: 30000,
        date: Date.now(),
        source: '代理转账',
        condition: 'x15',
        action: null,
    },
]

</script>

<style lang="scss" scoped></style>