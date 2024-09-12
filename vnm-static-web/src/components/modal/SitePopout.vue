<template>
    <div class="container">
      <div class="header">{{ $t('sitePopout.sitePopout') }}</div>
      <div class="content">
        <div class="left">
          <div class="left-item" :class="selectedItem?.title === popoutListItem.title ? 'active' : ''" v-for="popoutListItem in popoutList" v-html="popoutListItem.title" @click="selectedItem = popoutListItem" />
        </div>
        <div class="right">
          <div v-if="selectedItem?.desktopImgUrl">
            <img :src="`${imgURL}${selectedItem.desktopImgUrl}`" />
            <router-link :to="`/promotion?name=${selectedItem.path}`" class="check-details-btn">{{ $t('sitePopout.checkDetails') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { getSitePopoutList } from "@/api/personal/common";
  import { useLocalStorage } from "@vueuse/core";
  
  const popoutList = ref([]);
  const selectedItem = ref();
  const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
  
  onMounted(() => {
    getSitePopoutList().then((res) => {
      if(res.code === 0) {
        popoutList.value = res.data;
      }
    })
  });
  </script>
  
  <style lang="scss">
  .announcement-modal {
    .el-dialog__body {
      padding: 0 !important;
    }
  }
  </style>
  
  <style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    background-color: white;
    align-items: center;
    font-family: "PingFang SC";
  
    .header {
      border-bottom: 1px solid black;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: black;
      font-size: 2rem;
      font-weight: 700;
      line-height: 4rem;
    }
  
    .content {
      display: grid;
      grid-template-columns: 0.5fr 1fr;
      width: 100%;
      height: 100%;
      min-height: 300px;
      background-color: white;
  
      .left {
        display: flex;
        flex-direction: column;
        border-right: 1px solid black;
        cursor: pointer;
        height: 300px;
        overflow-y: auto;
        height: 100%;

        &::-webkit-scrollbar {
          -webkit-appearance: none;
          width: 8px;
          background-color: #ededed;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background-color: #D1D1D1;
          border: 1px solid #808080;
          box-shadow: 0 0 1px rgba(255, 255, 255, .5);
        }
  
        .left-item {
          font-size: 1rem;
          display: flex;
          align-items: center;
          padding: 5% 10%;
          color: black;
          font-weight: 700;
          border-bottom: 1px solid black;
          
  
          &.active, &:hover {
            background-color: #D1D1D1;
          }
        }
      }
  
      .right {
        position: relative;
        height: 100%;

        .check-details-btn {
          position: absolute;
          right: 5%;
          bottom: 5%;
          color: black;
          border: 1px solid black;
          padding: 1% 3%;
          border-radius: 5px;
          cursor: pointer;
          background-color: #e7e7e7;

          &:hover {
            background-color: #f2f2f2;
          }

          &:active {
            transform: translateY(2px);
          }
        }
        
        img {
          width: 100%;
        }
      }
    }
  }
  </style>
  