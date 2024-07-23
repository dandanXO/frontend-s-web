<template>
    <q-dialog v-model="redeemDialogVisible" no-route-dismiss persistent>
        <div class="redeem-point-dialog-container" style="width:700px;max-width:700px;">
            <div class="header">
                <div style="text-align: right;">
                    <img class="header-close-btn" @click="props.closeDialog"
                        src="../../assets/images/index/modal-close-btn.svg" />
                </div>
            </div>
            <q-card style="padding: 20px;background-color: #212632;box-shadow: none;">
                <div class="title">{{ $t('lang.redeem_point_pending_list') }}</div>
                <DataTable :loading="isLoading" :pagination="pagination" :tableColumns="tableColumns"
                    :dataState="tableData" @onChangePage="(currentPage) => {
                        pagination.current = currentPage;
                        recordPage(pagination)
                    }">
                    <template #body-cell-recordTime="props">
                        <q-td class="text-center">
                            x{{ props?.props?.row.recordTime }}
                        </q-td>
                    </template>
                    <template #body-cell-rollover="props">
                        <q-td class="text-center">
                            x{{ props?.props?.row.rollover }}
                        </q-td>
                    </template>
                    <template #body-cell-operation="props">
                        <q-td>
                            <div style="display:flex;justify-content: flex-end;">
                                <q-button style="min-width:60px;width:60px;height:30px;"
                                    class="primary-button blue-square"
                                    @click="redeemPoint(props?.props?.row.privilegeId)">
                                    {{ $t('lang.redeem_point_redeem') }}
                                </q-button>
                            </div>
                        </q-td>
                    </template>
                </DataTable>
            </q-card>
        </div>
    </q-dialog>
</template>

<script setup>
import { watch, ref } from 'vue';
import DataTable from 'components/transaction/DataTable';
import { eventapi } from 'src/boot/axios';
import { useI18n } from "vue-i18n";
import { userStore } from 'src/stores';
import { useQuasar } from 'quasar';

const isLoading = ref(false);
const { t } = useI18n();
const props = defineProps(['redeemDialogVisible', 'closeDialog']);
const redeemDialogVisible = ref(props.redeemDialogVisible);
const store = userStore();
const $q = useQuasar();

watch(() => props.redeemDialogVisible, () => {
    redeemDialogVisible.value = props.redeemDialogVisible;
})

const redeemPoint = (privilegeId) => {
    eventapi.post("/member-point/redeem-point/" + privilegeId + "?_method=PUT").then((res) => {
        const { code, data } = res.data;

        if (code === 0) {
            $q.notify({
                message: t('lang.redeem_point_redeemed'),
                type: "positive",
                position: "top",
                icon: "check_circle_outline"
            });

            store.getPendingRebateAmt();
        }
    })
}

const tableColumns = [
    {
        label: t('lang.redeem_point_points'),
        field: "amount",
        name: "amount",
        align: 'center'
    },
    {
        label: t('lang.redeem_point_date'),
        field: "recordTime",
        name: "recordTime",
        align: 'center'
    },
    {
        label: t('lang.redeem_point_source'),
        field: "privilege",
        name: "privilege",
        align: 'center'
    },
    {
        label: t('lang.redeem_point_condition'),
        field: "rollover",
        name: "rollover",
        align: 'center'
    },
    {
        label: t('lang.redeem_point_actions'),
        field: "operation",
        name: "operation",
        align: 'center'
    },
];
const tableData = ref([]);

const getTableData = () => {
    isLoading.value = true;
    eventapi.get("/member-point/pending-list").then((ret) => {
        isLoading.value = false;

        const res = ret.data;
        if (res.code === 0) {
            tableData.value = res.data;
        }

    }).catch(() => {
        isLoading.value = false;
    });
}

watch(() => props.redeemDialogVisible, () => {
    if (props.redeemDialogVisible) {
        getTableData();
    }
});

</script>

<style lang="scss" scoped>
.redeem-point-dialog-container {
    display: flex;
    flex-direction: column;

    .title {
        font-size: large;
        padding: 5px 0;
    }

    .header-close-btn {
        width: 40px;
        cursor: pointer;

        &:hover {
            filter: brightness(0.9);
        }
    }
}
</style>