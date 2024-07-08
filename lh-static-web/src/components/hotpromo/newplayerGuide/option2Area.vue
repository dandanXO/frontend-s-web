<template>
  <div class="promotion-container">
    <div class="switch-bar">
      <div 
        class="switch-option" 
        :class="{ active: selectedTab === 'sports' }" 
        @click="selectTab('sports')"
      >
        <i class="icon sports-icon"></i>
        体育首存
      </div>
      <div 
        class="switch-option" 
        :class="{ active: selectedTab === 'esports' }" 
        @click="selectTab('esports')"
      >
        <i class="icon esports-icon"></i>
        电竞首存
      </div>
      <div 
        class="switch-option" 
        :class="{ active: selectedTab === 'live' }" 
        @click="selectTab('live')"
      >
        <i class="icon live-icon"></i>
        真人首存
      </div>
      <div 
        class="switch-option" 
        :class="{ active: selectedTab === 'cards' }" 
        @click="selectTab('cards')"
      >
        <i class="icon cards-icon"></i>
        棋牌首存
      </div>
      <div 
        class="switch-option" 
        :class="{ active: selectedTab === 'slots' }" 
        @click="selectTab('slots')"
      >
        <i class="icon slots-icon"></i>
        电子首存
      </div>
      <div 
        class="switch-option" 
        :class="{ active: selectedTab === 'fishing' }" 
        @click="selectTab('fishing')"
      >
        <i class="icon fishing-icon"></i>
        捕鱼首存
      </div>
    </div>

    <div v-if="selectedTab === 'sports'" class="promotion-block">
      <div class="first-title">
        <img  class="big-icon" src="@/assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px;">活动期间新会员首次存款时可申请一次体育首存优惠</p>
      <table>
        <thead>
          <tr>
            <th>首存金额</th>
            <th>红利比例</th>
            <th rowspan="3">红利上限</th>
            <th rowspan="3">流水倍数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>≥500 元</td>
            <td>55%</td>
            <td rowspan="3">688 元</td>
            <td rowspan="3">15 倍</td>
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>28%</td>
            
            
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>12%</td>
            
          </tr>
        </tbody>
      </table>
      <div class="reward-description">
        <div style="display: flex;">
          <div style="width: 2px; height:12px; margin-top:4px; margin-right: 5px; background-color: rgba(65, 185, 255, 1);"></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>

    <div v-if="selectedTab === 'esports'" class="promotion-block">
      <div class="first-title">
        <img  class="big-icon" src="@/assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px;">活动期间新会员首次存款时可申请一次体育首存优惠</p>
      <table>
        <thead>
          <tr>
            <th>首存金额</th>
            <th>红利比例</th>
            <th>红利上限</th>
            <th>流水倍数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>≥500 元</td>
            <td>55%</td>
            <td rowspan="3">688 元</td>
            <td rowspan="3">15 倍</td>
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>28%</td>
           
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>12%</td>
           
          </tr>
        </tbody>
      </table>
      <div class="reward-description">
        <div style="display: flex;">
          <div style="width: 2px; height:12px; margin-top:4px; margin-right: 5px; background-color: rgba(65, 185, 255, 1);"></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>

    <div v-if="selectedTab === 'live'" class="promotion-block">
      <div class="first-title">
        <img  class="big-icon" src="@/assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px;">活动期间新会员首次存款时可申请一次体育首存优惠</p>
      <table>
        <thead>
          <tr>
            <th>首存金额</th>
            <th>红利比例</th>
            <th>红利上限</th>
            <th>流水倍数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>≥500 元</td>
            <td>55%</td>
            <td rowspan="3">688 元</td>
            <td rowspan="3">15 倍</td>
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>28%</td>
           
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>12%</td>
           
          </tr>
        </tbody>
      </table>
      <div class="reward-description">
        <div style="display: flex;">
          <div style="width: 2px; height:12px; margin-top:4px; margin-right: 5px; background-color: rgba(65, 185, 255, 1);"></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>

    <div v-if="selectedTab === 'cards'" class="promotion-block">
      <div class="first-title">
        <img  class="big-icon" src="@/assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px;">活动期间新会员首次存款时可申请一次体育首存优惠</p>
      <table>
        <thead>
          <tr>
            <th>首存金额</th>
            <th>红利比例</th>
            <th>红利上限</th>
            <th>流水倍数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>≥500 元</td>
            <td>55%</td>
            <td rowspan="3">688 元</td>
            <td rowspan="3">15 倍</td>
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>28%</td>
           
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>12%</td>
           
          </tr>
        </tbody>
      </table>
      <div class="reward-description">
        <div style="display: flex;">
          <div style="width: 2px; height:12px; margin-top:4px; margin-right: 5px; background-color: rgba(65, 185, 255, 1);"></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>

    <div v-if="selectedTab === 'slots'" class="promotion-block">
      <div class="first-title">
        <img  class="big-icon" src="@/assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px;">活动期间新会员首次存款时可申请一次体育首存优惠</p>
      <table>
        <thead>
          <tr>
            <th>首存金额</th>
            <th>红利比例</th>
            <th>红利上限</th>
            <th>流水倍数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>≥500 元</td>
            <td>55%</td>
            <td rowspan="3">688 元</td>
            <td rowspan="3">15 倍</td>
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>28%</td>
           
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>12%</td>
           
          </tr>
        </tbody>
      </table>
      <div class="reward-description">
        <div style="display: flex;">
          <div style="width: 2px; height:12px; margin-top:4px; margin-right: 5px; background-color: rgba(65, 185, 255, 1);"></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>

    <div v-if="selectedTab === 'fishing'" class="promotion-block">
      <div class="first-title">
        <img  class="big-icon" src="@/assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px;">活动期间新会员首次存款时可申请一次体育首存优惠</p>
      <table>
        <thead>
          <tr>
            <th>首存金额</th>
            <th>红利比例</th>
            <th>红利上限</th>
            <th>流水倍数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>≥500 元</td>
            <td>55%</td>
            <td rowspan="3">688 元</td>
            <td rowspan="3">15 倍</td>
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>28%</td>
           
          </tr>
          <tr>
            <td>≥500 元</td>
            <td>12%</td>
           
          </tr>
        </tbody>
      </table>
      <div class="reward-description">
        <div style="display: flex;">
          <div style="width: 2px; height:12px; margin-top:4px; margin-right: 5px; background-color: rgba(65, 185, 255, 1);"></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>
  </div>
  <div class="promotion-container">
    <div class="growth-strategy">
      <div class="title-area">
        <div style="display: flex; justify-content: start; align-items: center;">
          <img  class="big-icon" src="@/assets/images/promotion/hotpromo/newplayerguide/gift.png" alt="Gift" />
          <div class="title">成长攻略</div>
        </div>
        <div class="title">已累计充值：<span style="color: rgba(0, 136, 215, 1);" >0</span> 元</div>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>18 元獎金</div>
        <div>距 28 元奖金，还需充值 <span style="color: rgba(0, 136, 215, 1);"> 2271</span> 元</div>
      </div>
      

      <div class="rewards">
        <div class="reward" v-for="(reward, index) in rewards1" :key="index">
          <img :src="require(`@/assets/images/promotion/hotpromo/newplayerguide/bonus-${reward.amount}.png`)" alt="" width="100%" />
          <button class="YES" v-if="reward.state === 'YES' " @click="handleRecieve(reward)"> 領取</button>
          <button class="NO" v-if="reward.state === 'NO' " @click="handleRedirect"> 立即前往</button>
          <button class="CLAIMED" v-if="reward.state === 'CLAIMED' ">已领取</button>
        </div>
      </div>
    </div>

  </div>

  <div class="promotion-container">
    <div class="growth-strategy">
      <div class="title-area">
        <div style="display: flex; justify-content: start; align-items: center;">
          <img  class="big-icon" src="@/assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
          <div class="title">钱包冲刺</div>
        </div>
        <div class="title">已累计充值：<span style="color: rgba(0, 136, 215, 1);" >0</span> 元</div>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>18 元獎金</div>
        <div>距 28 元奖金，还需充值 <span style="color: rgba(0, 136, 215, 1);"> 2271</span> 元</div>
      </div>
      

      <div class="rewards">
        <div class="reward" v-for="(reward, index) in rewards2" :key="index">
          <img :src="require(`@/assets/images/promotion/hotpromo/newplayerguide/bonus-${reward.amount}.png`)" alt="" width="100%" />
          <button class="YES" v-if="reward.state === 'YES' " @click="handleRecieve(reward)"> 領取</button>
          <button class="NO" v-if="reward.state === 'NO' " @click="handleRedirect"> 立即前往</button>
          <button class="CLAIMED" v-if="reward.state === 'CLAIMED' ">已领取</button>
        </div>
      </div>
    </div>
  </div>
 
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getNewUserAccumulateDepositInit, putNewUserAccumulateDepositClaim } from "@/api/index/promo";

const router = useRouter();
const selectedTab = ref('sports');

function selectTab(tab) {
  selectedTab.value = tab;
}

const progressPercentage = ref(30);
const rewards1 = ref([
  { amount: 1000, threshold: 1000, earn: 5, state: 'CLAIMED' },
  { amount: 1988, threshold: 1988, earn: 8, state: 'CLAIMED' },
  { amount: 3088, threshold: 3088, earn: 18, state: 'YES' },
  { amount: 5088, threshold: 5088, earn: 28, state: 'NO' },
  { amount: 8888, threshold: 8888, earn: 38, state: 'CLAIMED' },
  { amount: 28888, threshold: 28888,earn: 58, state: 'CLAIMED' },
]);

const rewards2 = ref([
  { amount: 188, threshold: 1000, earn: 5, state: 'CLAIMED' },
  { amount: 888, threshold: 1988, earn: 8, state: 'CLAIMED' },
  { amount: 3588, threshold: 3088, earn: 18, state: 'YES' },
  { amount: 6888, threshold: 5088, earn: 28, state: 'NO' },
  { amount: 35888, threshold: 8888, earn: 38, state: 'CLAIMED' },
  { amount: 88888, threshold: 28888,earn: 58, state: 'CLAIMED' },
]);

const handleRecieve = async (reward) => {
  try {
    const apiRes = await putNewUserAccumulateDepositClaim(reward.amount);
    console.log(apiRes)
  } catch (error) {
    console.log(error)
  }
}

const handleRedirect = () => {
  router.push({ path: '/home' })
}

onMounted(() => {
  const apiRes = getNewUserAccumulateDepositInit();
  console.log(apiRes)
})
</script>

<style scoped lang="scss">
.promotion-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f9fbfe;
  border: 1px solid #e3e8f0;
  border-radius: 10px;
  margin-top: 20px;
  border: 1px solid rgba(172, 212, 246, 1);
}

.switch-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.switch-option {
  padding: 10px 20px;
  text-align: center;
  cursor: pointer;
  
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.switch-option.active {
  background: linear-gradient(90deg, #41B9FF 8.15%, #0085E8 92.42%);

  color: white;
}

.promotion-block, .growth-strategy {
  background-color: transparent;
  padding: 20px;
  border-radius: 10px;
  
  .first-title{
    display:flex;
    font-size: 24px;
    justify-content: flex-start;
    align-items: center;
  }
  .big-icon{
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  .title{
      margin-top: 4px;
      color:#000;
      font-weight: 600;
      font-size: 24px;
    }
}
.title-area{
    display: flex;
    justify-content: space-between;
    .big-icon{
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  .title{
      margin-top: 4px;
      color:#000;
      font-weight: 600;
      font-size: 24px;
    }
  }
.reward-description{
  h3{
    color: rgba(65, 185, 255, 1);
    font-family: PingFang TC;
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    letter-spacing: -0.02em;
    text-align: left;
    align-items: center;
    display: flex;
    margin: 0;
  }
}
h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

p {
  font-size: 14px;
  margin: 5px 0;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 20px 0;
  border: 1px solid rgba(172, 212, 246, 1);
  border-radius: 10px;
  overflow: hidden;
}

th, td {
  border: 1px solid rgba(172, 212, 246, 1);
  padding: 10px;
  text-align: center;
}

thead {
  background: linear-gradient(180deg, #41B9FF -21.81%, #0085E8 95.54%);

  color: white;
}
thead th {
  border: none;
}
thead th:first-child {
  border-top-left-radius: 10px;
}

thead th:last-child {
  border-top-right-radius: 10px;
}

tbody tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}

tbody tr:last-child  {
  border-bottom-right-radius: 10px;
}

.progress-bar {
  width: 100%;
  background-color: #e3e8f0;
  border-radius: 10px;
  overflow: hidden;
  height: 10px;
  margin: 10px 0;
}

.progress {
  height: 100%;
  background-color: #3498db;
}

.rewards {
  display: flex;
  justify-content: space-between;
}

.reward {
  background-color: #f1f1f1;
  padding: 5px;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .CLAIMED{
    width: 120px;
    background: rgba(217, 217, 217, 1);
    color: #000;
  }
  .YES{
    width: 120px;
    background: linear-gradient(90deg, #F4D24C 0%, #F2A03A 100%);
    color: #fff;
  }
  .NO{
  width: 120px;
  background: linear-gradient(90deg, #41B9FF 8.15%, #0085E8 92.42%);
  color: #fff;
  }
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Icon styles */
.icon {
  width: 16px;
  height: 16px;
}

.sports-icon {
  // <img src="../../assets/images/home/sticky-sidebar/email-icon.svg" />
  color: red;
  fill: red;
  background: url('@/assets/images/promotion/hotpromo/newplayerguide/sport-active.png') no-repeat center center;
  background-size: cover;
}

.esports-icon {
  background: url('@/assets/images/promotion/hotpromo/newplayerguide/esport.png') no-repeat center center;
  background-size: cover;
}

.live-icon {
  background: url('@/assets/images/promotion/hotpromo/newplayerguide/real.png') no-repeat center center;
  background-size: cover;
}

.cards-icon {
  background: url('@/assets/images/promotion/hotpromo/newplayerguide/card.png') no-repeat center center;
  background-size: cover;
}

.slots-icon {
  background: url('@/assets/images/promotion/hotpromo/newplayerguide/slot.png') no-repeat center center;
  background-size: cover;
}

.fishing-icon {
  background: url('@/assets/images/promotion/hotpromo/newplayerguide/fish.png') no-repeat center center;
  background-size: cover;
}
</style>
