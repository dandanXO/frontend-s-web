<template>
  <div class="checkin-wrapper">
   <div class="checkin-header">
     <div class="checkin-header__icon"><img src="./images/giftbox.png" alt="giftbox icon"></div>
     <div class="checkin-header__title">累计签到 登陆领彩</div>
     <div class="checkin-header__date">(2024年07月14日~2024年07月24日)</div>
   </div>
   <div class="checkin-content">
     活动期间，登录期间即可免费打卡一次打次数越高对应档位彩金越高；
   </div>
   <div class="checkin-section">
     <div class="items">
      <div class="item start active">
        <img src="./images/start-icon.png">
      </div>
       <div class="item" @click="checkInToday(i)" v-for="(item, i) in 10" :key="i" :class="{active: i < continuousCheckedIn || (i > 5 && i <= continuousCheckedIn), todayActive: todayCheckInState !== 'NO' && i === continuousCheckedIn}">
        <div class="item-bg"> 
          <img style="width: 28%; z-index: 1; position: absolute; top: 30%;" v-if="i <= 1" :src="require(`./images/money-01.png`)">
          <img style="width: 40%; z-index: 1; position: absolute; top: 22%;" v-else-if="i <= 3" :src="require(`./images/money-02.png`)">
          <img style="width: 40%; z-index: 1; position: absolute; top: 26%;" v-else-if="i <= 5" :src="require(`./images/money-03.png`)">
          <img style="width: 40%; z-index: 1; position: absolute; top: 24%;" v-else-if="i <= 7" :src="require(`./images/money-04.png`)">
          <img style="width: 40%; z-index: 1; position: absolute; top: 20%;" v-else-if="i <= 9" :src="require(`./images/money-05.png`)">
          <img src="./images/bg-badge.png" class="default-badge">
          <div class="button" :class="{ claimed: todayCheckInState === 'CLAIMED' }" v-if="(todayCheckInState !== 'CLAIMED' || todayCheckInState !== 'YES') && i === continuousCheckedIn">{{ todayCheckInState !== 'CLAIMED' ? '立即签到' : '已签到' }}</div>
          <div class="button" v-else>第 {{ numberToChinese(i + 1) }} 天</div>
        </div>
       </div>
       
      <div class="item end" :class="{ active: continuousCheckedIn === 10 }">
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
 const numberToChinese = (num) => {
    const chineseNums = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    return chineseNums[num - 1] || num;
}
 const todayCheckInState = ref('');
 const continuousCheckedIn = ref(0);
 
 const init = () => {
   const res = {
    "code": 0,
    "data": {
          "continuousCheckedIn": 0,
          "todayCheckInState": "YES",
      }
  };
 
   todayCheckInState.value = res.data.todayCheckInState;
   continuousCheckedIn.value = res.data.continuousCheckedIn;
 };

 const checkInToday = (i) => {
  if (i === continuousCheckedIn.value) {
    todayCheckInState.value = 'CLAIMED';
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
   margin: 30px auto;
   border: 1px solid #ACD4F6;
   background: #F2F8FE;
   border-radius: 10px;
   padding: 15px 30px;
   
   .checkin-header {
     display: flex;
     gap: 10px;
     justify-content: flex-start;
     align-items: center;
     margin-bottom: 10px;
 
     &__icon {
       img {
         width: 24px;
       }
     }
 
     &__title {
       font-size: 24px;
       font-weight: 600;
       line-height: 33.6px;
     }
 
     &__date {
       font-size: 20px;
       font-weight: 400;
       line-height: 28px;
       color: #707070;
     }
   }
 
   .checkin-content {
     font-size: 16px;
     font-weight: 400;
     line-height: 22px;
     letter-spacing: -0.02em;
     margin-bottom: 10px;
     color: #000000;
   }
 
   .checkin-section {
     border: 1px solid #ACD4F6;
     border-radius: 10px;
 
     .items {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
      padding: 20px;
      border-radius: 10px;
      width: 98%;
      margin-left: -2%;
       .item {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding-right: 30px;
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
            height: 15px;
            width: 100%;
            position: absolute;
            background: #D9D9D9;
            left: 50px;
            top: 36%;
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
            &:nth-child(6) {
              &:before {
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
              font-size: 14.58px;
              font-weight: 600;
              line-height: 20.41px;
              border-radius: 20px;
              padding: 3px 20px;
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
          &:nth-child(6) {
            &:before {
            left: 50px;
            border-radius: 50%;
            border: 15px solid #d9d9d9;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            width: 150px;
            height: 115%;
            background: unset;
            top: 36%;
            border-left: unset;
            }
          }
          &:nth-child(7) { order: 12;
          &:before {
            content: unset;
          } }
          &:nth-child(8) { order: 11; }
          &:nth-child(9) { order: 10; }
          &:nth-child(10) { order: 9; }
          &:nth-child(11) { order: 8; }
          &:nth-child(12) { order: 7; }

       }
     }
   }
   
   .checkin-note {
    margin: 10px 0;
    display: flex;
    gap: 5px;
    flex-direction: column;
    &__head {
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      color: #0085E8;
      display: flex;
      align-items: center;
      gap: 5px;
     
      &:before {
        content: "";
        width: 4px;
        height: 16px;
        background: #0085E8;
      }

    }
    &__content {
     font-size: 16px;
     font-weight: 400;
     line-height: 22px;
     letter-spacing: -0.02em;
     color: #000000;
    }
   }
 }
 </style>
 