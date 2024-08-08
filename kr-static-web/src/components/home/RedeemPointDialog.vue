<template>
    <el-dialog v-model="isRedeemDialogVisible">
        <div class="redeem-point-dialog-container">
            <div class="title">{{ $t('redeem_point.redeem_point_pending_list') }}</div>
            <el-table :loading="isLoading" :pagination="pagination" :tableColumns="tableColumns"
                :data="tableData" @onChangePage="(currentPage) => {
                    pagination.current = currentPage;
                    recordPage(pagination)
                }">
                <el-table-column fixed prop="amount" :label="t('redeem_point.redeem_point_points')" width="150">
                </el-table-column>
                <el-table-column fixed prop="recordTime" :label="t('redeem_point.redeem_point_date')" width="150">
                    <template #default="scope">
                        {{ dayjs(scope.row.recordTime).locale('ko').format('LLL') }}
                    </template>
                </el-table-column>
                <el-table-column fixed prop="privilege" :label="t('redeem_point.redeem_point_source')" width="150">
                </el-table-column>
                <el-table-column fixed prop="rollover" :label="t('redeem_point.redeem_point_condition')" width="150">
                    <template #default="scope">
                        {{ `x${scope.row.rollover}` }}
                    </template>
                </el-table-column>
                <el-table-column fixed prop="operation" :label="t('redeem_point.redeem_point_actions')" width="150">
                    <template #default="scope">
                        <div style="display:flex;justify-content: flex-end;">
                            <el-button type="primary" 
                                @click="redeemPoint(scope.row.privilegeId)">
                                {{ $t('redeem_point.redeem_point_redeem') }}
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script setup>
import { watch, ref } from 'vue';
import { useI18n } from "vue-i18n";
import { userStore } from '@/store';
import { server } from '@/utils/request';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';
import { storeToRefs } from "pinia";

const isLoading = ref(false);
const { t } = useI18n();
const store = userStore();
const { isRedeemDialogVisible } = storeToRefs(store);

const redeemPoint = (privilegeId) => {
    server.EVENT.post("/member-point/redeem-point/" + privilegeId + "?_method=PUT").then((res) => {
        const { code, data } = res;

        if (code === 0) {
            ElMessage.success(t('redeem_point.redeem_point_redeemed'));

            store.getPendingRebateAmt();
            store.getBalance();
        }
    })
}

const tableColumns = [
    {
        label: t('redeem_point.redeem_point_points'),
        field: "amount",
        name: "amount",
        align: 'center'
    },
    {
        label: t('redeem_point.redeem_point_date'),
        field: "recordTime",
        name: "recordTime",
        align: 'center'
    },
    {
        label: t('redeem_point.redeem_point_source'),
        field: "privilege",
        name: "privilege",
        align: 'center'
    },
    {
        label: t('redeem_point.redeem_point_condition'),
        field: "rollover",
        name: "rollover",
        align: 'center'
    },
    {
        label: t('redeem_point.redeem_point_actions'),
        field: "operation",
        name: "operation",
        align: 'center'
    },
];
const tableData = ref([]);

const getTableData = () => {
    isLoading.value = true;
    server.EVENT.get("/member-point/pending-list").then((res) => {
        isLoading.value = false;

        if (res.code === 0) {
            tableData.value = res.data;
        }

    }).catch(() => {
        isLoading.value = false;
    });
}

watch(() => isRedeemDialogVisible.value, () => {
    if (isRedeemDialogVisible.value) {
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