<template>
  <div class="checkin-wrapper">
   <div class="checkin-header">
     <div class="checkin-header__icon"><img src="./images/giftbox.png" alt="giftbox icon"></div>
     <div>
     <div class="checkin-header__title">累计签到 登陆领彩</div>
     <div class="checkin-header__date">(2024年07月14日~2024年07月24日)</div>
     </div>
   </div>
   <div class="checkin-content">
    活动期间，当日任意存款一笔即可参与打卡一次，打次数越高对应档位彩金越高；
   </div>
   <div class="checkin-section">
     <div class="items">
      <div class="item start active">
        <img src="./images/start-icon.png">
      </div>
       <div class="item" @click="checkInToday(i)" v-for="(item, i) in 10" :key="i" :class="{active: i + 1 < todayCheckInDay || ((i + 1 > 3 && (i + 1 < 8)) && i + 1 <= todayCheckInDay) || ((i + 1 > 8) && i < todayCheckInDay), todayActive: i + 1 === todayCheckInDay}">
        <div class="item-bg"> 
          <img style="width: 28%; z-index: 1; position: absolute; top: 25%;" v-if="i <= 1" :src="require(`./images/money-01.png`)">
          <img style="width: 40%; z-index: 1; position: absolute; top: 22%;" v-else-if="i <= 3" :src="require(`./images/money-02.png`)">
          <img style="width: 40%; z-index: 1; position: absolute; top: 26%;" v-else-if="i <= 5" :src="require(`./images/money-03.png`)">
          <img style="width: 40%; z-index: 1; position: absolute; top: 24%;" v-else-if="i <= 7" :src="require(`./images/money-04.png`)">
          <img style="width: 40%; z-index: 1; position: absolute; top: 20%;" v-else-if="i <= 9" :src="require(`./images/money-05.png`)">
          <img src="./images/bg-badge.png" class="default-badge">
          <div class="button" :class="{ claimed: todayCheckInState === 'CLAIMED' }" v-if="(todayCheckInState !== 'CLAIMED' || todayCheckInState !== 'YES') && i + 1 === todayCheckInDay">{{ todayCheckInState !== 'CLAIMED' ? '立即签到' : '已签到' }}</div>
          <div class="button" v-else>第 {{ numberToChinese(i + 1) }} 天</div>
        </div>
       </div>
       
      <div class="item end" :class="{ active: todayCheckInDay === 10 }">
        <img src="./images/end-icon.png">
      </div>
     </div>
   </div>
   <div class="checkin-note">
    <div class="checkin-note__head">
      注意事项
    </div>
    <div class="checkin-note__content">
      每日仅可打卡一次，彩金每日仅派发一次。
    </div>
   </div>
  </div>
 </template>
 
 <script setup>
 import { onMounted, ref } from "vue";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { initUefaCheckin, claimUefaCheckin } from "../../../api/index/promo";

const $q = useQuasar();
const store = userStore();


 const numberToChinese = (num) => {
    const chineseNums = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    return chineseNums[num - 1] || num;
}
 const todayCheckInState = ref('');
 const todayCheckInDay = ref(0);
 
 const init = () => {
  initUefaCheckin().then((res) => {
    todayCheckInState.value = res.data.todayCheckInState;
    todayCheckInDay.value = res.data.todayCheckInDay;
  })
 };
 
 const checkInToday = (i) => {
  if (todayCheckInState.value === 'CLAIMED') {
    return;
  }
  if (i + 1 === todayCheckInDay.value) {
    claimUefaCheckin()
    .then((res) => {
      if (res.code === 0) {
        store.getBalance();
        $q.notify({
          color: "positive",
          position: "top",
          message: `成功领取 ${res.data} 元`,
          icon: "check_circle_outline"
        });
        init();
      }
    })
    .catch((err) => {
      console.log(err.message);
      // message.error(err.message, 4);
    });
  }
 }
 onMounted(() => {
   init();
 });
 </script>
 
 <style lang="scss">
 .checkin-wrapper {
   font-family: PingFang TC;
   max-width: 1200px;
   margin: 0px auto;
   border: 1px solid #ACD4F6;
   background: #F2F8FE;
   border-radius: 10px;
   padding: 10px;
   
   .checkin-header {
     display: flex;
     gap: 10px;
     justify-content: flex-start;
     align-items: flex-start;
     margin-bottom: 10px;
 
     &__icon {
      padding-top: 2px;
      width: 20px;
       img {
        width: 100%;
       }
     }
 
     &__title {
       font-size: 20px;
       font-weight: 600;
       line-height: 23px;
     }
 
     &__date {
       font-size: 14px;
       font-weight: 400;
       line-height: 28px;
       color: #707070;

     }
   }
 
   .checkin-content {
     font-size: 14px;
     font-weight: 400;
     line-height: 17px;
     letter-spacing: -0.02em;
     margin-bottom: 10px;
     color: #000000;
   }
 
   .checkin-section {
     border: 1px solid #ACD4F6;
     border-radius: 10px;
 
     .items {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      padding: 20px;
      border-radius: 10px;
      width: 95%;
      margin-left: 5%;
       .item {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          z-index: 2;
          &.start, &.end {
            img {
              width: 50%;
              margin-top: -25%;
            }
          }
          &:before {
            z-index: -1;
            content: "";
            height: 10px;
            width: 100%;
            position: absolute;
            background: #D9D9D9;
            left: 50px;
            top: 31%;
          }
          img {
            width: 80%;
            &.default-badge {
              filter: grayscale(1);
            }
          }
  
          &.active {
            &:before {
              background: linear-gradient(180deg, #9FC4FF 0%, #3690FF 100%);
            }
            img {
              &.default-badge {
                filter: unset;
              }
            }
            .item-bg {
              .button {
                background: linear-gradient(180deg, #9FC4FF 0%, #3690FF 100%);
              }
            }
            &:nth-child(3),&:nth-child(9) {
              &:before {
                border-color: #6ca8f3;
              }
            }
            &:nth-child(6) {
              &:after {
                border-color: #6ca8f3;
              }
            }
          }
          .item-bg {
            position: relative;
            cursor: unset;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 10px;
            .button {
              background: #E0E0E0;
              color: #ffffff;
              font-size: 10px;
              font-weight: 600;
              line-height: 12.41px;
              padding: 3px 5px;
              border-radius: 20px;
            }
          }
          &.todayActive {
            img {
              &.default-badge {
                filter: unset;
              }
            }
            .item-bg {
              border: 0.97px solid #85B6FF;
              background: linear-gradient(180deg, #9FC4FF 0%, #3690FF 100%);
              border-radius: 10px;
              .button {
                background: #FFFFFF;
                color: #4899FF;
                cursor: pointer;
                &.claimed {
                  cursor: unset;
                  background: #2f75d2;
                  color: #ffffff;
                }
              }
            }
           
          }
          &:nth-child(3),
          &:nth-child(9), {
            &:before {
            border-radius: 50%;
            border: 10px solid #d9d9d9;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            height: 115%;
            background: unset;
            top: 36%;
            border-left: unset;
            left: 30px;
            top: 36%;
            width: 70px;
            }
          }
          
          &:nth-child(6) {
            &:after {
            z-index: -1;
            content: "";
            height: 10px;
            width: 100%;
            position: absolute;
            background: #D9D9D9;
            left: 50px;
            border-radius: 50%;
            border: 10px solid #d9d9d9;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            height: 125%;
            left: -20px;
            top: 30%;
            width: 70px;
            background: unset;
            border-right: unset;
          }
          }
          &:nth-child(4),
          &:nth-child(10) {
            &:before {
              content: unset;
            }
          }
            &:nth-child(4) { order: 6; }
            &:nth-child(5) { order: 5; }
            &:nth-child(6) { order: 4; }
            &:nth-child(7) { order: 7; }
            &:nth-child(8) { order: 8; }
            &:nth-child(9) { order: 9; }
            &:nth-child(10) { order: 12; }
            &:nth-child(11) { order: 11; }
            &:nth-child(12) { order: 10; }

       }
     }
   }
   .checkin-note {
    margin: 10px 0;
    display: flex;
    gap: 5px;
    flex-direction: column;
    &__head {
      color: #0085E8;
      font-size: 14px;
      font-weight: 700;
      line-height: 17px;
      display: flex;
      align-items: center;
      gap: 5px;
     
      &:before {
        content: "";
        width: 4px;
        height: 15px;
        background: #0085E8;
      }

    }
    &__content {
      font-size: 14px;
     font-weight: 400;
     line-height: 17px;
     letter-spacing: -0.02em;
     color: #000000;
    }
   }
 }
 </style>
 