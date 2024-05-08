<template>
  <div class="modal-body-wrap">
    <div class="">
        <q-item-section class="table-row-head">
          <q-item-label>제목</q-item-label>
          <q-item-label>날짜</q-item-label>
        </q-item-section>
        <template v-for="item in announcementData" :key="item.page">
          <q-expansion-item group="somegroup" class="table-row-title">
            <template v-slot:header>
              <q-item-section class="table-row table-row-title">
                <q-item-label>{{ item.title }}</q-item-label>
                <q-item-label>{{ formatDate(item.createTime) }}</q-item-label>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="table-row-article">
                <article v-html="item.content"></article>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </template>
      </div>
  </div>
</template>

<script setup id="FinanceDeposit">
import { ref } from "vue";
import { userStore } from "stores/index";
import moment from "moment";

const store = userStore();
const announcementData = store.announcementList;
const formatDate = (timestamp) => moment(timestamp).format("YYYY/MM/DD");

</script>

<style lang="scss" scoped>
.table-row-head {
    padding: 5px 10px 0 10px;
    display: grid;
    grid-template-columns: 1fr 100px;
    .q-item__label {
      margin: auto;
      padding-bottom: 12px;
      &:nth-child(1) {
        text-align: left;
        margin-left: unset;
        margin-right: unset;
      }
    }
  }
  .table-row {
    padding: 0 10px 0 10px;
    display: grid;
    grid-template-columns: 1fr 100px;
    .q-item__label {
      margin-top: auto;
      margin-bottom: auto;
      padding: unset;
      &:nth-child(1) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .table-row-title {
    background: #212121;
    margin-bottom: 5px;
  
    :deep(.q-icon) {
      display: none;
    }
  
    :deep(.q-expansion-item__container .q-item) {
      display: flex;
      width: 100%;
      padding: 0;
      .q-item__label {
        &:first-child {
          width: 100px;
          text-align: center;
        }
        &:nth-child(1) {
          flex: 1;
          text-align: left;
        }
        &:last-child {
          text-align: right;
          width: 100px;
        }
      }
    }
  }
  .table-row-article {
    padding: 10px 5px;
    max-height: 290px;
    overflow: scroll;
    :deep(.q-expansion-item__content) {
      background: #151515;
    }
  }
</style>