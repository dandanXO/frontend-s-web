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
          <img class="big-icon" src="@/components/hotpromo/newplayerguide/images/vector.png" alt="Gift" />
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
              <td>≥300 元</td>
              <td>28%</td>
            </tr>
            <tr>
              <td>≥100 元</td>
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
          <img class="big-icon" src="@/components/hotpromo/newplayerguide/images/vector.png" alt="Gift" />
          <div class="title">新人首存</div>
        </div>
        <p style="font-size: 16px">活动期间新会员首次存款时可申请一次电竞首存优惠</p>
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
              <td>≥300 元</td>
              <td>28%</td>
            </tr>
            <tr>
              <td>≥100 元</td>
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
          <img class="big-icon" src="@/components/hotpromo/newplayerguide/images/vector.png" alt="Gift" />
          <div class="title">新人首存</div>
        </div>
        <p style="font-size: 16px">活动期间新会员首次存款时可申请一次真人首存优惠</p>
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
              <td>≥100 元</td>
              <td>38%</td>
              <td>588 元</td>
              <td>（本金+红利）X15真人</td>
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
          <img class="big-icon" src="@/components/hotpromo/newplayerguide/images/vector.png" alt="Gift" />
          <div class="title">新人首存</div>
        </div>
        <p style="font-size: 16px">活动期间新会员首次存款时可申请一次棋牌首存优惠</p>
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
              <td>≥100 元</td>
              <td>38%</td>
              <td>588 元</td>
              <td>（本金+红利）X15棋牌</td>
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
          <img class="big-icon" src="@/components/hotpromo/newplayerguide/images/vector.png" alt="Gift" />
          <div class="title">新人首存</div>
        </div>
        <p style="font-size: 16px">活动期间新会员首次存款时可申请一次电子首存优惠</p>
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
              <td>≥100 元</td>
              <td>38%</td>
              <td>588 元</td>
              <td>（本金+红利）X15电子</td>
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
  
      <div v-if="selectedTab === 'fishing'" class="promotion-block">
        <div class="first-title">
          <img class="big-icon" src="@/components/hotpromo/newplayerguide/images/vector.png" alt="Gift" />
          <div class="title">新人首存</div>
        </div>
        <p style="font-size: 16px">活动期间新会员首次存款时可申请一次捕鱼首存优惠</p>
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
              <td>≥100 元</td>
              <td>38%</td>
              <td>588 元</td>
              <td>（本金+红利）X15捕鱼</td>
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
    <div class="promotion-container" v-if="isEligibleState">
      <div class="growth-strategy">
        <div class="title-area">
          <div style="display: flex; justify-content: start; align-items: center">
            <img class="big-icon" src="@/components/hotpromo/newplayerguide/images/gift.png" alt="Gift" />
            <div class="title">成长攻略</div>
          </div>
          <div class="title">
            已累计充值：
            <span style="color: rgba(0, 136, 215, 1)">{{ depositAmount }}</span>
            元
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressPercentage1 + '%' }"></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>{{ matchRewardItem1?.earn }} 元奖金</div>
          <div>
            距 {{ matchRewardItem1?.earn }} 元奖金，还需充值
            <span style="color: rgba(0, 136, 215, 1)">{{ matchRewardItem1?.ruleAmount - depositAmount }}</span>
            元
          </div>
        </div>
  
        <div class="rewards">
          <div class="reward" v-for="(reward, index) in rewards1" :key="index">
            <img
              :src="require(`@/components/hotpromo/newplayerguide/images/bonus-${reward.ruleAmount}.png`)"
              alt=""
              width="100%"
            />
            <button class="YES" v-if="reward.state === 'YES'" @click="handleRecieve(reward)">领取</button>
            <button class="NO" v-if="reward.state === 'NO'" @click="handleRedirect">立即前往</button>
            <button class="CLAIMED" v-if="reward.state === 'CLAIMED'">已领取</button>
          </div>
        </div>
      </div>
    </div>
  
    <div class="promotion-container" v-if="isEligibleState">
      <div class="growth-strategy">
        <div class="title-area">
          <div style="display: flex; justify-content: start; align-items: center">
            <img class="big-icon" src="@/components/hotpromo/newplayerguide/images/vector.png" alt="Gift" />
            <div class="title">钱包冲刺</div>
          </div>
          <div class="title">
            已累计充值：
            <span style="color: rgba(0, 136, 215, 1)">{{ depositAmount }}</span>
            元
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressPercentage2 + '%' }"></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>{{ matchRewardItem2?.earn }} 元奖金</div>
          <div>
            距 {{ matchRewardItem2?.earn }} 元奖金，还需充值
            <span style="color: rgba(0, 136, 215, 1)">{{ matchRewardItem2?.ruleAmount - depositAmount }}</span>
            元
          </div>
        </div>
  
        <div class="rewards">
          <div class="reward" v-for="(reward, index) in rewards2" :key="index">
            <img
              :src="require(`@/components/hotpromo/newplayerguide/images/bonus-${reward.ruleAmount}.png`)"
              alt=""
              width="100%"
            />
            <button class="YES" v-if="reward.state === 'YES'" @click="handleRecieve(reward)">领取</button>
            <button class="NO" v-if="reward.state === 'NO'" @click="handleRedirect">立即前往</button>
            <button class="CLAIMED" v-if="reward.state === 'CLAIMED'">已领取</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import { getNewUserAccumulateDepositInit, putNewUserAccumulateDepositClaim } from "@/api/index/promo";
  import { ElMessage } from "element-plus";
  
  const targetRuleAmount1 = [1000, 1988, 3088, 5088, 8888, 28888];
  const targetRuleAmount2 = [188, 888, 3588, 6888, 35888, 88888];
  
  const earnData = [
    { amount: 1000, earn: 5 },
    { amount: 1988, earn: 8 },
    { amount: 3088, earn: 18 },
    { amount: 5088, earn: 28 },
    { amount: 8888, earn: 38 },
    { amount: 28888, earn: 58 },
    { amount: 188, earn: 8 },
    { amount: 888, earn: 18 },
    { amount: 3588, earn: 28 },
    { amount: 6888, earn: 88 },
    { amount: 35888, earn: 238 },
    { amount: 88888, earn: 588 }
  ];
  
  const router = useRouter();
  const selectedTab = ref("sports");
  
  const depositAmount = ref(0);
  const updatedApiRes = ref([]);
  
  const rewards1 = computed(() => {
    return updatedApiRes.value.filter((item) => targetRuleAmount1.includes(item.ruleAmount));
  });
  const rewards2 = computed(() => {
    return updatedApiRes.value.filter((item) => targetRuleAmount2.includes(item.ruleAmount));
  });
  const matchRewardItem1 = computed(() => {
    return rewards1.value.find((item) => item.ruleAmount >= depositAmount.value);
  });
  const matchRewardItem2 = computed(() => {
    return rewards2.value.find((item) => item.ruleAmount >= depositAmount.value);
  });
  const progressPercentage1 = computed(() => {
    if (matchRewardItem1.value) {
      return (depositAmount.value / matchRewardItem1.value.ruleAmount) * 100;
    }
    return 100;
  });
  const progressPercentage2 = computed(() => {
    if (matchRewardItem2.value) {
      return (depositAmount.value / matchRewardItem2.value.ruleAmount) * 100;
    }
    return 100;
  });
  
  function selectTab(tab) {
    selectedTab.value = tab;
  }
  
  const isEligibleState = ref(true);
  
  const handleRecieve = async (reward) => {
    try {
      const apiRes = await putNewUserAccumulateDepositClaim(reward.ruleAmount);
  
      if (apiRes.code === 0) {
        ElMessage.success(`成功领取 ￥${apiRes.data}`);
  
        updatedApiRes.value = updatedApiRes.value.map((item) => {
          if (item.ruleAmount === reward.ruleAmount) {
            return {
              ...item,
              state: "CLAIMED"
            };
          }
          return item;
        });
      } else {
        ElMessage.error(apiRes.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleRedirect = () => {
    router.push({ path: "/center/deposit" });
  };
  
  const getData = async () => {
    try {
      const apiRes = await getNewUserAccumulateDepositInit();
      if (apiRes.data.state === "NOT_ELIGIBLE") {
        isEligibleState.value = false;
        ElMessage.error("此账号无法参与此优惠。");
        return;
      }
      depositAmount.value = apiRes.data.depositAmount || 0;
  
      const parseApiRes = JSON.parse(apiRes.data.state);
  
      updatedApiRes.value = parseApiRes.map((item) => {
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
    } catch (err) {
      console.error(err);
    }
  };
  
  onMounted(async () => {
    await getData();
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
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .switch-option {
    width: 144px;
    height: 44px;
    text-align: center;
    cursor: pointer;
  
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: #7a80a1;
    transition:
      background-color 0.3s,
      color 0.3s;
    font-size: 20px;
    border: 1px solid #7a80a1;
  }
  
  .switch-option.active {
    background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
    border: 0px;
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
    background: linear-gradient(180deg, #41b9ff -21.81%, #0085e8 95.54%);
  
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
  
    button {
      &:hover {
        opacity: 0.9;
      }
      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }
    }
  
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
    width: 24px;
    height: 24px;
  }
  
  .sports-icon {
    background: url("@/components/hotpromo/newplayerguide/images/sport.png") no-repeat center center;
    background-size: cover;
    &-active {
      background: url("@/components/hotpromo/newplayerguide/images/sport-active.png") no-repeat center center;
      background-size: cover;
    }
  }
  
  .esports-icon {
    background: url("@/components/hotpromo/newplayerguide/images/esport.png") no-repeat center center;
    background-size: cover;
    &-active {
      background: url("@/components/hotpromo/newplayerguide/images/esport-active.png") no-repeat center center;
      background-size: cover;
    }
  }
  
  .live-icon {
    background: url("@/components/hotpromo/newplayerguide/images/real.png") no-repeat center center;
    background-size: cover;
    &-active {
      background: url("@/components/hotpromo/newplayerguide/images/real-active.png") no-repeat center center;
      background-size: cover;
    }
  }
  
  .cards-icon {
    background: url("@/components/hotpromo/newplayerguide/images/card.png") no-repeat center center;
    background-size: cover;
    &-active {
      background: url("@/components/hotpromo/newplayerguide/images/card-active.png") no-repeat center center;
      background-size: cover;
    }
  }
  
  .slots-icon {
    background: url("@/components/hotpromo/newplayerguide/images/slot.png") no-repeat center center;
    background-size: cover;
    &-active {
      background: url("@/components/hotpromo/newplayerguide/images/slot-active.png") no-repeat center center;
      background-size: cover;
    }
  }
  
  .fishing-icon {
    background: url("@/components/hotpromo/newplayerguide/images/fish.png") no-repeat center center;
    background-size: cover;
    &-active {
      background: url("@/components/hotpromo/newplayerguide/images/fish-active.png") no-repeat center center;
      background-size: cover;
    }
  }
  </style>
  