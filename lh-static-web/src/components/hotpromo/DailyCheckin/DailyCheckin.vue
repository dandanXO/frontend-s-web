<template>
  <div class="container">
    <div class="seciont1">
      <div class="basic-info">
        <div>VIP 等级 <span style="color: rgba(238, 202, 24, 1);">{{ vipLevel }}</span></div>
        <div>连续签到天数<span style="color: rgba(24, 207, 238, 1);">{{ countiuneSign }}</span></div>
      </div> 
      <div class="first">
        <div v-for="(item, index) in sectionOneItems" :key="item.day" class="grid-item" :class="[item.claimState === 'CLAIMED'?`item${index}-finish` : `item${index}` ]">
          <div class="day-number">
            0{{ index+1 }}
          </div>
          <div class="status-img">
            <img v-if="item.claimState === 'CLAIMED' " :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/button-green.png')" />
            <img v-if="item.claimState === 'OPEN' " :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/button-blue.png')" />
            <img v-if="item.claimState === 'CLOSE' " :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/button-purple.png')" />
            <img v-if="item.claimState === 'RECHECKIN' " :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/button-blue.png')" />
            <div class="status-text" v-if="item.claimState !== 'CLAIMED'">
              {{ statusTextMap[item.claimState] }}
            </div>
          </div>
        </div>
      </div>
      <div class="secend">
        <div class="box-area">
          <div v-for="(box,index) in sectionOneBoxItems" :key="box.requiredActivePoint" >
            <template v-if="index === 0">
              <img  :src="box.claimState === 'OPEN' ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue.png') : box.claimState === 'CLOSE' ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue-lock.png') : require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue-gray.png') " />
            </template>
            <template v-if="index === 1">
              <img  :src="box.claimState === 'OPEN' ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue.png') : box.claimState === 'CLOSE' ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue-lock.png') : require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-blue-gray.png') " />
            </template>
            <template v-if="index === 2">
              <img  :src="box.claimState === 'OPEN' ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-purple.png') : box.claimState === 'CLOSE' ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-purple-lock.png') : require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-purple-gray.png') " />
            </template>
            <template v-if="index === 3">
              <img  :src="box.claimState === 'OPEN' ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-yellow.png') : box.claimState === 'CLOSE' ? require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-yellow-lock.png') : require('../../../assets/images/promotion/hotpromo/dailyCheckin/box-yellow-gray.png') " />
            </template>
          </div>
        </div>
        <div class="progressBar-area">
          <div class="progress-container">
              <div class="progress-bar" :style="{width: countPercent+'%'}"></div>
          </div>
        </div>
        <div class="number-area">
          <div v-for="(box) in sectionOneBoxItems" :key="box.requiredActivePoint" >
            {{ box.requiredActivePoint }}
          </div>
        </div>
      </div>
    </div>
    <div class="seciont2">
      <div class="first">
        <div class="title"></div>
        <div class="day-task">
          <div class="task-content">
            <div class="task-left">
              <div style="margin-right: 20px;">
                <img :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-task-1.png')">
              </div>
              <div>
                <div style="font-size: 24px;">今日签到任务</div>
                <div style="font-size: 20px;">
                  <img v-if="todayCheckInState === 'YES'" style="width: 20px; height: 20px;"  :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-done.png')">
                  <img v-else style="width: 20px; height: 20px;"  :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-cancel.png')">
                  <span style="color: rgba(153, 153, 153, 1);">充值金额≥500 元</span>
                </div>
              </div>
            </div>
            <div class="task-right">
              <button class="button">
                去充值
              </button>
            </div>
          </div>
          <div class="task-content">
            <div class="task-left">
              <div style="margin-right: 20px;">
                <img :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-task-2.png')">
              </div>
              <div>
                <div style="font-size: 24px;">获得补签卡</div>
                <div  style="font-size: 20px;">
                  <!-- reCheckInState  TODO 圖片判斷需要另外寫--> 
                  <img v-if="todayCheckInState === 'YES'" style="width: 20px; height: 20px;"  :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-done.png')">
                  <img v-else style="width: 20px; height: 20px;"  :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/icon-cancel.png')">
                  <span style="color: rgba(153, 153, 153, 1);">充值金额≥100 元，补签卡 +1</span>
                </div>
              </div>
            </div>
            <div class="task-right">
              <div style="margin-top: -20px;">
                剩余补签卡：1/2
              </div>
              <button class="button-finish">
                已完成
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="secend">
        <div class="title"></div>
        <div style="width: 100%;">
          <img style="width: 160px; height: 42px;" :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/rule-time.png')">
          <div class="text">
            {{ promoInfo.activity_date }}
          </div>
        </div>
        <div style="width: 100%;">
          <img style="width: 160px; height: 42px;" :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/rule-content.png')">
          <div class="text" style="margin-left: -20px;">
            <ul>
              <li>所有雷火电竞会员存款达到相应 VIP 等级要求即可享有特定免费奖金、存送奖金或其他奖励，存送奖金只需完成（存款 + 奖金）*相应流水倍数即可提款。</li>
              <li>各等级所对应的优惠所要求的流水有所不同，会员需要达到相应流水方可申请提款。</li>
              <li>此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址﹑电话号码﹑支付方式（相同借记卡/信用卡/银行账户号码）IP 地址，同一网络环境等将可以作为判定是否独立玩家的条件。对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。</li>
              <li>各等级所对应的优惠所要求的流水有所不同，会员需要达到相应流水方可申请提款。</li>
              <li>所有雷火电竞会员存款达到相应 VIP 等级要求即可享有特定免费奖金、存送奖金或其他奖励，存送奖金只需完成（存款 + 奖金）*相应流水倍数即可提款。</li>
            </ul>
          </div>
        </div>
      </div>
    </div> 
  </div>
  <el-dialog v-model="showSuccessDialog" width="600" style="background: transparent;">
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog-header">
        <img style="width: 210px; height: 56px;" :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/success-1.png')">
        <img style="width: 240px; height: 42px;" :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/success-2.png')">
        <img style="width: 150px; height: 150px;" :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/success-3.png')">
        <img @click="showSuccessDialog = false" style="width: 232px; height: 82px;" :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/success-4.png')">
      </div>
    </template>
    <template #default v-if="false">

    </template>
  </el-dialog>
  <el-dialog v-model="showErrorDialog" width="600" style="background: transparent;">
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog-header">
        <img style="width: 210px; height: 56px;" :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/failure-1.png')">
        <img style="width: 240px; height: 42px;" :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/failure-2.png')">
        <img style="width: 150px; height: 150px;" :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/failure-3.png')">
        <img @click="showErrorDialog = false" style="width: 232px; height: 82px;" :src="require('../../../assets/images/promotion/hotpromo/dailyCheckin/failure-4.png')">
      </div>
    </template>
    <template #default v-if="false">

    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, defineProps, computed , ref } from "vue";
import { userStore } from "@/store";
const store = userStore()
const props = defineProps(["promoInfo"]);
const promoInfo = reactive(JSON.parse(props.promoInfo.param))

const showSuccessDialog = ref(false)
const showErrorDialog = ref(false)
const vipLevel = ref(store.vip.split('VIP')[1])
const countiuneSign = ref(0)
// 是 "YES", 就是“已完成” + 打勾，
// 是 "NO" 则是 "去充值“和 打 X
const todayCheckInState = ref('YES')
// 第一區塊
// 七箱子的，
// CLAIMED: 已领取
// OPEN：签到
// CLOSE:   待签到
// RECHECKIN: 补签
const sectionOneItems = reactive([
  {
    day: 1,
    dateStr: "2024-07-21",
    claimState: "CLAIMED"
  },
  {
    day: 2,
    dateStr: "2024-07-22",
    claimState: "CLAIMED"
  },
  {
    day: 3,
    dateStr: "2024-07-23",
    claimState: "CLAIMED"
  },
  {
    day: 4,
    dateStr: "2024-07-24",
    claimState: "RECHECKIN"
  },
  {
    day: 5,
    dateStr: "2024-07-25",
    claimState: "OPEN"
  },
  {
    day: 6,
    dateStr: "2024-07-26",
    claimState: "CLOSE"
  },
  {
    day: 7,
    dateStr: "2024-07-27",
    claimState: "CLOSE"
  }
]);
// 第二區塊
// claimState
//CLOSE 锁着
//OPEN  没有锁着箱子
// CLAIMED 灰色箱子圖片
// 算有幾個 算有幾個 決定是 0 25 50 75 100 progress bar 的趴數

const sectionOneBoxItems = reactive([
  {
  "requiredActivePoint": 25,
  "claimState": "CLAIMED"      
  },
  {
      "requiredActivePoint": 50,
      "claimState": "CLAIMED"
  },
  {
      "requiredActivePoint": 75,
      "claimState": "OPEN"
  },
  {
      "requiredActivePoint": 100,
      "claimState": "CLOSE"
  }
])
const countPercent = computed(()=>{
  let times = 0
  sectionOneBoxItems.forEach(item=>{
    if(item.claimState === 'CLAIMED'){
      times ++
    }
  })
  return times * 25
})
const statusTextMap= reactive({
  CLAIMED: '已领取',
  OPEN:'签到',
  CLOSE:   '待签到',
  RECHECKIN: '补签',
})
</script>

<style lang="scss" scoped>
.seciont1 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  .basic-info{
    position: absolute;
    top: 30px;
    width: 1336px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 50px;
    color:#fff;
    font-size: 30px;
  }
  .first {
    padding-top: 30px;
    background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/bg-1.png");
    background-repeat: no-repeat;  
    width: 1336px;
    height: 860px;
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 四個等寬的列 */
    grid-gap: 10px; /* 格子間的間隙 */
    background-color: transparent; /* 背景顏色 */
    padding-top: 60px;
    .grid-item {
      position: relative;
      padding: 20px;
      font-size: 30px;
      text-align: center;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-repeat: no-repeat;
      background-size: auto;
      background-position: center;
    }
    .grid-item:nth-last-child(1){
      grid-column: span 2;
    }
    .item0{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-1-other.png");
    }
    .item0-finish{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-1-finish.png");
    }
    .item1{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-1-other.png");
    }
    .item1-finish{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-1-finish.png");
    }
    .item2{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-1-other.png");
    }
    .item2-finish{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-1-finish.png");
    }
    .item3{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-1-other.png");
    }
    .item3-finish{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-1-finish.png");
    }
    .item4{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-2-other.png");
    }
    .item4-finish{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-2-finish.png");
    }
    .item5{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-3-other.png");
    }
    .item5-finish{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-3-finish.png");
    }
    .item6{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-4-other.png");
    }
    .item6-finish{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/card-4-finish.png");
    }
    .day-number{
      position: absolute;
      top: 44px;
      left:52px;
      font-size: 35px;
    }
    .status-img{
      position: absolute;
      bottom:80px;
      img{
        width: 190px;
        height: 90px;
        border-radius: 0px !important;
      }
      cursor: pointer;
    }
    .status-text{
      position: absolute;
      bottom:20px;
      left: 50%; /* 将元素的左边界设置在父元素宽度的 50% 的位置 */
      transform: translateX(-50%); /* 然后通过 transform 向左偏移自身宽度的 50% */
    }
  }
  .secend{
    background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/bg-2.png");
    width: 1320px;
    height: 588px;
    display: flex;
    margin-top: 40px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .box-area{
      margin-bottom: 30px;
      padding-top: 90px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width:100%;
    }
    .progressBar-area{
      width: 100%;
      padding-left: 84px;
      padding-right: 84px;
      .progress-container {
      width: 100%;
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/bar-bg.png");
      border-radius: 30px;
      overflow: hidden;
      margin: 20px 0;
      }

    .progress-bar {
        width: 0%;
        height: 30px;
        background: linear-gradient(90deg, #23D2F0 0%, #9A7BFF 100%);
        text-align: center;
        line-height: 30px;
        color: white;
        border-radius: 5px;
    }
    }
    .number-area{
      margin-top: 25px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width:100%;
      font-size: 40px;
      color: #fff;
    }
  }
}
.seciont2{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .first{
    width: 1336px;
    .title{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/title1.png");
      width: 1060px;
      height: 60px;
      margin-top: 40px;
      margin-bottom: 40px;
    }
    .day-task{
      width:100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .task-content{
        color: #fff;
        background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/bg-3.png");
        width: 640px;
        height: 144px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        .task-left{
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
        }
        .task-right{
          .button{
            background: linear-gradient(90deg, #23D2F0 0%, #9A7BFF 100%);
            width: 150px;
            height: 50px;
            border-radius: 8px;
            font-size: 24px;
          }
          .button-finish{
            background: linear-gradient(90deg, #23D2F0 0%, #9A7BFF 100%);
            opacity: 0.6;
            width: 150px;
            height: 50px;
            border-radius: 8px;
            font-size: 24px;
          }
        }
      }
    }
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .secend{
    width: 1336px;
    .title{
      background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/title2.png");
      width: 1060px;
      height: 60px;
      margin-top: 60px;
      margin-bottom: 30px;
    }
    .text{
      color: #fff;
      font-size: 20px;
      margin-top :20px;
      margin-bottom :40px;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
.dialog-header{
  width: 600px;
  height: 460px;
  background: transparent;
  background-image: url("@/assets/images/promotion/hotpromo/dailyCheckin/bg-4.png");
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
:el-dialog(.el-dialog){
  background: transparent !important;
}
:global(.el-dialog__header){
  background: transparent !important;
}
:global(.el-dialog__body) {
    display: none;
  }
</style>
