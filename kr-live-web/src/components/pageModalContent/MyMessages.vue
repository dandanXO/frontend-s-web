<template>
    <div class="" style="">
      <CustomerService/>
    </div>
  </template>
  
  <script setup id="NotifyComponent">
  import { ref, onMounted } from "vue";
  import { api } from "boot/axios";
  import { SessionStorage } from "quasar";
  import CustomerService from 'components/pageModalContent/CustomerService.vue';
  
  //TODO
  const articleData = ref([]);
  
  const getNoticeData = () => {
    api
      .get("/session/inbox", {
        TOKEN: SessionStorage.getItem("TOKEN")
      })
      .then((res) => {
        articleData.value = res.data.data.records;
      });
  };
  
  onMounted(() => {
    getNoticeData();
  });
  </script>
  
  <style lang="scss" scoped>
  .table-row-head {
    padding: 5px 10px 0 10px;
    display: grid;
    grid-template-columns: 50px 1fr 100px;
    .q-item__label {
      margin: auto;
      padding-bottom: 12px;
      &:nth-child(2) {
        text-align: left;
        margin-left: unset;
        margin-right: unset;
      }
    }
  }
  .table-row {
    padding: 0 10px 0 10px;
    display: grid;
    grid-template-columns: 50px 1fr 100px;
    .q-item__label {
      margin-top: auto;
      margin-bottom: auto;
      padding: unset;
      &:nth-child(2) {
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
        &:nth-child(2) {
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
  