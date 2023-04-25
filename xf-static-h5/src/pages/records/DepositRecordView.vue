<template>
    <div class="table-record">
        <RecordComponent recordType='deposit' :loading="visible" :list="tableData" :headers="tableHeaders" />
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
        id: '1',
        code: '金额',
        depositAmount: '200',
        depositType: 'KDPay',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',
        
    },
    {
        id: '2',
        code: '存款类型',
        depositAmount: '200',
        depositType: 'QQ_CODE',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',

    },
    {
        id: '3',
        code: '存款类型',
        depositAmount: '200',
        depositType: 'WECHAT_CODE2',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',

    },
    {
        id: '4',
        code: '存款类型',
        depositAmount: '200',
        depositType: 'QQ_CODE',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',

    },
    {
        id: '5',
        code: '存款类型',
        depositAmount: '200',
        depositType: 'QQ_CODE',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',

    },
    {
        id: '6',
        code: '存款类型',
        depositAmount: '200',
        depositType: 'QQ_CODE',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',

    },{
        code: '金额',
        depositAmount: '200',
        depositType: 'KDPay',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',
        
    },
    {
        code: '存款类型',
        depositAmount: '200',
        depositType: 'QQ_CODE',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',

    },
    {
        code: '存款类型',
        depositAmount: '200',
        depositType: 'QQ_CODE',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',

    },
    {
        code: '存款类型',
        depositAmount: '200',
        depositType: 'QQ_CODE',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',

    },
    {
        code: '存款类型',
        depositAmount: '200',
        depositType: 'QQ_CODE',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',

    },
    {
        id: 'last',
        code: '存款类型',
        depositAmount: '200',
        depositType: 'QQ_CODE',
        depositStatus: '支付中',
        commitDate: 1672486214000,
        serialNumber: 'XFI617020221231193013594',

    },]
}
const tableHeaders = ([
    {
        key: 'depositAmount',
        label: '金额'
    },
    {
        key: 'depositType',
        label: '存款类型'
    },
    {
        key: 'depositStatus',
        label: '存款状态'
    },
    {
        key: 'commitDate',
        label: '到账时间'
    },
    {
        key: 'serialNumber',
        label: '存款编码'
    },
    {
        key: 'id',
        label: 'code'
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
            color: #bacef1;
        }
    }
</style>