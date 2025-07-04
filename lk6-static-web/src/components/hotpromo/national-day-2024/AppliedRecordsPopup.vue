<template>
    <el-dialog v-model="appliedRecordsModalVisible" title="申请记录" width="800px" center align-center>
        <el-table :data="appliedRecords" stripe style="width: 100%">
        <el-table-column prop="amount" label="奖金金额" />
        <el-table-column prop="recordTime" label="领取时间" :formatter="recordTimeFormatter" />
      </el-table>
    </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import moment from 'moment';

import { getNationalDayRecords } from "@/api/index/promo";

const appliedRecordsModalVisible = ref(false);
const appliedRecords = ref([]);

const openPopup = () => {
  getRecords();
  appliedRecordsModalVisible.value = true;
};

const getRecords = () => {
  getNationalDayRecords().then((res) => {
    appliedRecordsModalVisible.value = true;
    appliedRecords.value = res.data;
  })
}

const recordTimeFormatter = ({ recordTime = '' }) => {
  if(moment(recordTime).isValid()) {
    return moment(recordTime).format('YYYY-MM-DD HH:mm:ss');
  } else {
    return recordTime;
  }
}

defineExpose({
    openPopup
})
</script>