<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input v-model="ip" size="small" style="width: 200px;" :placeholder="t('fields.ip')" />
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadIpLocation">
          {{ t('fields.search') }}
        </el-button>
      </div>
    </div>
    <div><el-card style="width: 480px" shadow="never">{{ location }}</el-card></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { getIpLocation } from "../../../api/util";

const { t } = useI18n();
const ip = ref(null);
const location = ref(null);

function loadIpLocation() {
  getIpLocation(ip.value).then((res) => {
    location.value = res.data;
  });
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-col {
  text-align: center;
  margin-left: 20px;
}

.list-group {
  padding: 15px;
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;
  min-height: 20px;
  font-size: 12px;
}

.list-group-item {
  margin-bottom: 5px;
  text-align: center;
  position: relative;
  cursor: move;
  display: block;
  padding: 0.75rem 1.25rem;
  color: #fff;
  border: 1px solid;
  border-radius: 0.25rem;
}
</style>
