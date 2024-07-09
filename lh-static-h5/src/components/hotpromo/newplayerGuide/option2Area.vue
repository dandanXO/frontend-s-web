<template>
  <div class="promotion-container">
    <div class="switch-bar">
      <div class="switch-option" :class="{ active: selectedTab === 'sports' }" @click="selectTab('sports')">
        <i class="icon sports-icon" :class="{ 'sports-icon-active': selectedTab === 'sports' }"></i>
        体育首存
      </div>
      <div class="switch-option" :class="{ active: selectedTab === 'esports' }" @click="selectTab('esports')">
        <i class="icon esports-icon" :class="{ 'esports-icon-active': selectedTab === 'esports' }"></i>
        电竞首存
      </div>
      <div class="switch-option" :class="{ active: selectedTab === 'live' }" @click="selectTab('live')">
        <i class="icon live-icon" :class="{ 'live-icon-active': selectedTab === 'live' }"></i>
        真人首存
      </div>
      <div class="switch-option" :class="{ active: selectedTab === 'cards' }" @click="selectTab('cards')">
        <i class="icon cards-icon" :class="{ 'cards-icon-active': selectedTab === 'cards' }"></i>
        棋牌首存
      </div>
      <div class="switch-option" :class="{ active: selectedTab === 'slots' }" @click="selectTab('slots')">
        <i class="icon slots-icon" :class="{ 'slots-icon-active': selectedTab === 'slots' }"></i>
        电子首存
      </div>
      <div class="switch-option" :class="{ active: selectedTab === 'fishing' }" @click="selectTab('fishing')">
        <i class="icon fishing-icon" :class="{ 'fishing-icon-active': selectedTab === 'fishing' }"></i>
        捕鱼首存
      </div>
    </div>

    <div v-if="selectedTab === 'sports'" class="promotion-block">
      <div class="first-title">
        <img class="big-icon" src="../../../assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px">活动期间新会员首次存款时可申请一次体育首存优惠</p>
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
        <div style="display: flex">
          <div
            style="
              width: 2px;
              height: 12px;
              margin-top: 4px;
              margin-right: 5px;
              background-color: rgba(65, 185, 255, 1);
            "
          ></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>

    <div v-if="selectedTab === 'esports'" class="promotion-block">
      <div class="first-title">
        <img class="big-icon" src="../../../assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px">活动期间新会员首次存款时可申请一次体育首存优惠</p>
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
        <div style="display: flex">
          <div
            style="
              width: 2px;
              height: 12px;
              margin-top: 4px;
              margin-right: 5px;
              background-color: rgba(65, 185, 255, 1);
            "
          ></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>

    <div v-if="selectedTab === 'live'" class="promotion-block">
      <div class="first-title">
        <img class="big-icon" src="../../../assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px">活动期间新会员首次存款时可申请一次体育首存优惠</p>
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
        <div style="display: flex">
          <div
            style="
              width: 2px;
              height: 12px;
              margin-top: 4px;
              margin-right: 5px;
              background-color: rgba(65, 185, 255, 1);
            "
          ></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>

    <div v-if="selectedTab === 'cards'" class="promotion-block">
      <div class="first-title">
        <img class="big-icon" src="../../../assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px">活动期间新会员首次存款时可申请一次体育首存优惠</p>
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
        <div style="display: flex">
          <div
            style="
              width: 2px;
              height: 12px;
              margin-top: 4px;
              margin-right: 5px;
              background-color: rgba(65, 185, 255, 1);
            "
          ></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>

    <div v-if="selectedTab === 'slots'" class="promotion-block">
      <div class="first-title">
        <img class="big-icon" src="../../../assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px">活动期间新会员首次存款时可申请一次体育首存优惠</p>
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
        <div style="display: flex">
          <div
            style="
              width: 2px;
              height: 40px;
              margin-top: 4px;
              margin-right: 5px;
              background-color: rgba(65, 185, 255, 1);
            "
          ></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>

    <div v-if="selectedTab === 'fishing'" class="promotion-block">
      <div class="first-title">
        <img class="big-icon" src="../../../assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
        <div class="title">新人首存</div>
      </div>
      <p style="font-size: 16px">活动期间新会员首次存款时可申请一次体育首存优惠</p>
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
        <div style="display: flex">
          <div
            style="
              width: 2px;
              height: 12px;
              margin-top: 4px;
              margin-right: 5px;
              background-color: rgba(65, 185, 255, 1);
            "
          ></div>
          <h3>奖励说明</h3>
        </div>
        <p>自注册日起，仅需完善个人资料、绑定手机号及银行卡即可参与</p>
      </div>
    </div>
  </div>
  <div class="promotion-container">
    <div class="growth-strategy">
      <div class="title-area">
        <div style="display: flex; justify-content: start; align-items: center">
          <img class="big-icon" src="../../../assets/images/promotion/hotpromo/newplayerguide/gift.png" alt="Gift" />
          <div class="title">成长攻略</div>
        </div>
        <div class="title">
          已累计充值：
          <span style="color: rgba(0, 136, 215, 1)">0</span>
          元
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div>18 元獎金</div>
        <div>
          距 28 元奖金，还需充值
          <span style="color: rgba(0, 136, 215, 1)">2271</span>
          元
        </div>
      </div>

      <div class="rewards">
        <div class="reward" v-for="(reward, index) in rewards1" :key="index">
          <img
            :src="require(`../../../assets/images/promotion/hotpromo/newplayerguide/bonus-${reward.ruleAmount}.png`)"
            alt=""
            width="100%"
          />
          <button class="YES" v-if="reward.state === 'YES'" @click="handleRecieve(reward)">領取</button>
          <button class="NO" v-if="reward.state === 'NO'" @click="handleRedirect">立即前往</button>
          <button class="CLAIMED" v-if="reward.state === 'CLAIMED'">已领取</button>
        </div>
      </div>
    </div>
  </div>

  <div class="promotion-container">
    <div class="growth-strategy">
      <div class="title-area">
        <div style="display: flex; justify-content: start; align-items: center">
          <img class="big-icon" src="../../../assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
          <div class="title">钱包冲刺</div>
        </div>
        <div class="title">
          已累计充值：
          <span style="color: rgba(0, 136, 215, 1)">0</span>
          元
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div>18 元獎金</div>
        <div>
          距 28 元奖金，还需充值
          <span style="color: rgba(0, 136, 215, 1)">2271</span>
          元
        </div>
      </div>

      <div class="rewards">
        <div class="reward" v-for="(reward, index) in rewards2" :key="index">
          <img
            :src="require(`../../../assets/images/promotion/hotpromo/newplayerguide/bonus-${reward.ruleAmount}.png`)"
            alt=""
            width="100%"
          />
          <button class="YES" v-if="reward.state === 'YES'" @click="handleRecieve(reward)">領取</button>
          <button class="NO" v-if="reward.state === 'NO'" @click="handleRedirect">立即前往</button>
          <button class="CLAIMED" v-if="reward.state === 'CLAIMED'">已领取</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getNewUserAccumulateDepositInit, putNewUserAccumulateDepositClaim } from "../../../api/index/promo";

const router = useRouter();
const selectedTab = ref("sports");

function selectTab(tab) {
  console.log("123");
  selectedTab.value = tab;
}

const progressPercentage = ref(30);
const rewards1 = ref([]);

const rewards2 = ref([]);

const handleRecieve = async (reward) => {
  try {
    const apiRes = await putNewUserAccumulateDepositClaim(reward.amount);
    console.log(apiRes);
  } catch (error) {
    console.log(error);
  }
};

const handleRedirect = () => {
  router.push({ path: "/home" });
};

onMounted(async () => {
  const apiRes1 =await getNewUserAccumulateDepositInit();
  console.log(apiRes1);
  const apiRes = [
    { ruleAmount: 188, state: "CLAIMED" },
    { ruleAmount: 888, state: "CLAIMED" },
    { ruleAmount: 1000, state: "CLAIMED" },
    { ruleAmount: 1988, state: "YES" },
    { ruleAmount: 3088, state: "NO" },
    { ruleAmount: 3588, state: "NO" },
    { ruleAmount: 5088, state: "NO" },
    { ruleAmount: 6888, state: "NO" },
    { ruleAmount: 8888, state: "NO" },
    { ruleAmount: 28888, state: "NO" },
    { ruleAmount: 35888, state: "NO" },
    { ruleAmount: 88888, state: "NO" }
  ];
  const earnData = [
    { amount: 1000, earn: 5 },
    { amount: 1988, earn: 8 },
    { amount: 3088, earn: 18 },
    { amount: 5088, earn: 28 },
    { amount: 8888, earn: 38 },
    { amount: 28888, earn: 58 },
    { amount: 188, earn: 5 },
    { amount: 888, earn: 8 },
    { amount: 3588, earn: 18 },
    { amount: 6888, earn: 28 },
    { amount: 35888, earn: 38 },
    { amount: 88888, earn: 58 }
  ];
  const updatedApiRes = apiRes.map((item) => {
    const matchingItem = earnData.find((newItem) => newItem.amount === item.ruleAmount);
    if (matchingItem) {
      return {
        ...item,
        earn: matchingItem.earn
      };
    } else {
      return item;
    }
  });

  const targetRuleAmounts = [1000, 1988, 3088, 5088, 8888, 28888];
  updatedApiRes.forEach((item) => {
    if (targetRuleAmounts.includes(item.ruleAmount)) {
      rewards1.value.push(item);
    } else {
      rewards2.value.push(item);
    }
  });
});
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
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.switch-option {
  padding: 10px 20px;
  text-align: center;
  cursor: pointer;

  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: background-color 0.3s, color 0.3s;
}

.switch-option.active {
  background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);

  color: white;
}

.promotion-block,
.growth-strategy {
  background-color: transparent;
  padding: 20px;
  border-radius: 10px;

  .first-title {
    display: flex;
    font-size: 24px;
    justify-content: flex-start;
    align-items: center;
  }
  .big-icon {
    width: 24px !important;
    height: 24px;
    margin-right: 8px;
  }
  .title {
    margin-top: 4px;
    color: #000;
    font-weight: 600;
    font-size: 24px;
  }
}
.title-area {
  display: flex;
  justify-content: space-between;
  .big-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  .title {
    margin-top: 4px;
    color: #000;
    font-weight: 600;
    font-size: 24px;
  }
}
.reward-description {
  h3 {
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

th,
td {
  border: 1px solid rgba(172, 212, 246, 1);
  padding: 10px;
  text-align: center;
}

thead {
  background: linear-gradient(180deg, #41b9ff -21.81%, #0085e8 95.54%) !important;

  color: white;
}
thead th {
  border: none;
  background: linear-gradient(180deg, #41b9ff -21.81%, #0085e8 95.54%) !important;
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

tbody tr:last-child {
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
  justify-content: center;
  flex-wrap: wrap;
  row-gap: 5px;
  column-gap: 5px;
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

  .CLAIMED {
    width: 120px;
    background: rgba(217, 217, 217, 1);
    color: #000;
  }
  .YES {
    width: 120px;
    background: linear-gradient(90deg, #f4d24c 0%, #f2a03a 100%);
    color: #fff;
  }
  .NO {
    width: 120px;
    background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
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
  background: url("../../../assets/images/promotion/hotpromo/newplayerguide/sport.png") no-repeat center center;
  background-size: cover;
  &-active {
    background: url("../../../assets/images/promotion/hotpromo/newplayerguide/sport-active.png") no-repeat center center;
    background-size: cover;
  }
}

.esports-icon {
  background: url("../../../assets/images/promotion/hotpromo/newplayerguide/esport.png") no-repeat center center;
  background-size: cover;
  &-active {
    background: url("../../../assets/images/promotion/hotpromo/newplayerguide/esport-active.png") no-repeat center
      center;
    background-size: cover;
  }
}

.live-icon {
  background: url("../../../assets/images/promotion/hotpromo/newplayerguide/real.png") no-repeat center center;
  background-size: cover;
  &-active {
    background: url("../../../assets/images/promotion/hotpromo/newplayerguide/real-active.png") no-repeat center center;
    background-size: cover;
  }
}

.cards-icon {
  background: url("../../../assets/images/promotion/hotpromo/newplayerguide/card.png") no-repeat center center;
  background-size: cover;
  &-active {
    background: url("../../../assets/images/promotion/hotpromo/newplayerguide/card-active.png") no-repeat center center;
    background-size: cover;
  }
}

.slots-icon {
  background: url("../../../assets/images/promotion/hotpromo/newplayerguide/slot.png") no-repeat center center;
  background-size: cover;
  &-active {
    background: url("../../../assets/images/promotion/hotpromo/newplayerguide/slot-active.png") no-repeat center center;
    background-size: cover;
  }
}

.fishing-icon {
  background: url("../../../assets/images/promotion/hotpromo/newplayerguide/fish.png") no-repeat center center;
  background-size: cover;
  &-active {
    background: url("../../../assets/images/promotion/hotpromo/newplayerguide/fish-active.png") no-repeat center center;
    background-size: cover;
  }
}
</style>
