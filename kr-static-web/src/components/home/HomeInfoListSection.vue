<template>
  <div class="info-section" data-aos="zoom-in-up">
    <div class="info-wrapper">
      <el-tabs v-model="activeTab" style="padding:20px;">
        <el-tab-pane :label="'공지사항'" name="announcement">
          <AnnouncementList />
        </el-tab-pane>
<!--        <el-tab-pane :label="'출금현황'" name="withdrawal-records">-->
<!--          <WithdrawalRecords />-->
<!--        </el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AnnouncementList from './info-list-section/AnnouncementList';
// import WithdrawalRecords from './info-list-section/WithdrawalRecords';

const activeTab = ref('announcement');
</script>

<style lang="scss" scoped>
.info-section {
  max-width: 1400px;
  width: 95%;
  margin: 20px auto;
  background-color: #EAF4FF;
  padding: 20px;
  box-shadow: 0px 0px 8px 0px #00000038;
  border-radius: 15px;
}

.info-wrapper {
  border: 1px solid #5C9FFF;
  border-radius: 15px;
}
</style>