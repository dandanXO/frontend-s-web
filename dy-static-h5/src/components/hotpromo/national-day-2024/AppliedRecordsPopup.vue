<template>
    <q-dialog v-model="appliedRecordsModalVisible" title="申请记录">
        <q-table
            title="申请记录"
            :rows="appliedRecords"
            :columns="columns"
            row-key="name"
        />
    </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import moment from 'moment';

import { getNationalDayRecords } from "../../../api/index/promo";

const appliedRecordsModalVisible = ref(false);
const appliedRecords = ref([]);

const columns = [
    { name: 'amount', align: 'center', label: '奖金金额', field: row => row.amount,
    format: val => `${val}`, },
    { name: 'recordTime', label: '领取时间', field: 'iron', field: row => row.recordTime,
    format: (recordTime = '') => {
            if(moment(recordTime).isValid()) {
                return moment(recordTime).format('YYYY-MM-DD HH:mm:ss');
            } else {
                return recordTime;
            }
        }
    }
]


const openPopup = () => {
  getRecords();
  appliedRecordsModalVisible.value = true;
};

const getRecords = () => {
  getNationalDayRecords().then((res) => {
    appliedRecordsModalVisible.value = true;
    appliedRecords.value = res.data.records;
  })
}

defineExpose({
    openPopup
})
</script>