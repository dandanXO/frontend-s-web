<template>
    <div class="table-record">
        <RecordComponent :loading="visible" :list="tableData" :headers="tableHeaders" />
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue"
import RecordComponent from "../../components/RecordComponent.vue"
components: {
    RecordComponent
}
const visible = ref(true);
const tableData = ref([]);
const loadDepositTable = () => {
    visible.value = false
    tableData.value = [{
        amount: 50,
        commitTime: null,
        feedbackTime: "2021-11-01 22:33:15",
        financeRemark: "test",
        id: 21,
        loginName: null,
        memberId: 804,
        memberRemark: "oyoyoyoy",
        operaterName: null,
        orderNo: "XF560320211004163950615",
        photos: "944202d1-42a6-4daa-a221-76d001dc9046",
        photosUrl: ["944202d1-42a6-4daa-a221-76d001dc9046"],
        status: 2,
        statusText: "已核实",
        type: 1,
        typeText: "存款",
        updateBy: 0,
        updateTime: null
        
    },]
}
const tableHeaders = ([
    {
        key: 'orderNo',
        label: '单号'
    },
    {
        key: 'statusText',
        label: '状态'
    },
    {
        key: 'typeText',
        label: '类型'
    },
    {
        key: 'feedbackTime',
        label: '催单时间',
    },
    {
        key: 'financeRemark',
        label: '回复'
    }
])
onMounted(() => {
    loadDepositTable()
})

</script>
<style scoped lang="scss">
    .table-record {
        width: 100%;
        gap: 10px;
        .label {
            color: #B2BDBF;
        }
    }
</style>