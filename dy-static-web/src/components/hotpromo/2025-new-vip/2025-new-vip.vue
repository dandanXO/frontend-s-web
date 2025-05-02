<template>
  <div class="livepoker-rebate-wrapper">
    <div class="livepoker-rebate-container">
      <div class="tab-wrapper">
        <div class="tab" :class="{ active: tabValue === 1 }" @click="tabValue = 1">VIP 权益</div>
        <div class="tab" :class="{ active: tabValue === 2 }" @click="tabValue = 2">VIP 返水</div>
      </div>

      <template v-if="tabValue === 1">
        <div>
          <div class="livepoker-rebate-game-info">
            <table class="livepoker-rebate-game-info-table">
              <thead>
                <tr>
                  <th>VIP等级</th>
                  <th>升级要求 / 流水</th>
                  <th>保级要求 90 天 / 流水</th>
                  <th>晋级礼金</th>
                  <th>首次保级彩金</th>
                  <th>年度保级彩金</th>
                  <th>生日彩金</th>
                  <th>每日额外返水红包</th>
                  <th>每月 15 号红包</th>
                  <th>充值赠送 20% 奖金</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>VIP1</td>
                  <td>3,000</td>
                  <td>500</td>
                  <td>18</td>
                  <td>58 元</td>
                  <td>588</td>
                  <td>-</td>
                  <td>0.30%</td>
                  <td>8</td>
                  <td>58</td>
                </tr>
                <tr>
                  <td>VIP2</td>
                  <td>10,000</td>
                  <td>2,000</td>
                  <td>28</td>
                  <td>58 元</td>
                  <td>588</td>
                  <td>38</td>
                  <td>0.50%</td>
                  <td>18</td>
                  <td>88</td>
                </tr>
                <tr>
                  <td>VIP3</td>
                  <td>50,000</td>
                  <td>10,000</td>
                  <td>38</td>
                  <td>58 元</td>
                  <td>588</td>
                  <td>58</td>
                  <td>0.60%</td>
                  <td>28</td>
                  <td>158</td>
                </tr>
                <tr>
                  <td>VIP4</td>
                  <td>240,000</td>
                  <td>30,000</td>
                  <td>58</td>
                  <td>288 元</td>
                  <td>1,088</td>
                  <td>88</td>
                  <td>0.80%</td>
                  <td>58</td>
                  <td>268</td>
                </tr>
                <tr>
                  <td>VIP5</td>
                  <td>1,000,000</td>
                  <td>50,000</td>
                  <td>88</td>
                  <td>288 元</td>
                  <td>1,088</td>
                  <td>188</td>
                  <td>1.00%</td>
                  <td>88</td>
                  <td>288</td>
                </tr>
                <tr>
                  <td>VIP6</td>
                  <td>5,000,000</td>
                  <td>100,000</td>
                  <td>188</td>
                  <td>288 元</td>
                  <td>1,088</td>
                  <td>288</td>
                  <td>1.20%</td>
                  <td>128</td>
                  <td>588</td>
                </tr>
                <tr>
                  <td>VIP7</td>
                  <td>7,500,000</td>
                  <td>300,000</td>
                  <td>288</td>
                  <td>588 元</td>
                  <td>1,888</td>
                  <td>388</td>
                  <td>1.30%</td>
                  <td>208</td>
                  <td>788</td>
                </tr>
                <tr>
                  <td>VIP8</td>
                  <td>10,000,000</td>
                  <td>1,000,000</td>
                  <td>588</td>
                  <td>588 元</td>
                  <td>1,888</td>
                  <td>588</td>
                  <td>1.50%</td>
                  <td>388</td>
                  <td>888</td>
                </tr>
                <tr>
                  <td>VIP9</td>
                  <td>15,000,000</td>
                  <td>3,000,000</td>
                  <td>888</td>
                  <td>888 元</td>
                  <td>2,888</td>
                  <td>888</td>
                  <td>1.80%</td>
                  <td>588</td>
                  <td>1,288</td>
                </tr>
                <tr>
                  <td>VIP10</td>
                  <td>25,000,000</td>
                  <td>10,000,000</td>
                  <td>1,888</td>
                  <td>1,888 元</td>
                  <td>8,888</td>
                  <td>1,888</td>
                  <td>2.00%</td>
                  <td>888</td>
                  <td>2,888</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title"></div>
            <div class="content">
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">1</div>
                    <span style="color:red;">会员晋级/保级/降级规则</span><br>
                </div>
                <div class="item2">
                  <div >1. 完成等级要求的累计有效流水后系统于次日北京时间早上10点自动更新，具体完成时间以系统为准，请耐心等待；</div>
                  <div >2. VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升；</div>
                  <div >3. 会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算；</div>
                  <div >4. 假设会员在一个季度（90天计算）内没有完成相应的保级要求流水，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级；</div>
                  <div >5. 每个级别的升级礼金每位会员仅能获得1次（升级礼金1倍流水即可提款）；</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">2</div>
                    <span style="color:red;">生日礼金</span><br>
                </div>
                <div class="item2">
                  <div >1. 生日符合资格的会员，每年生日当天及当天后7日内到在线客服提供相关资料申请生日礼金，逾期不补，彩金1倍流水即可提款；</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">3</div>
                    <span style="color:red;">首次保级彩金</span><br>
                </div>
                <div class="item2">
                  <div >1. 会员在90天保级期内达到保级要求时，第 91 天即可领取首次保级彩金，首次保级彩金1倍流水即可提款。</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">4</div>
                    <span style="color:red;">年度保级彩金</span><br>
                </div>
                <div class="item2">
                  <div >1. 首次保级成功后计算会员12个月内未降级（可晋级），彩金于第13个月首日进行派发；彩金1倍流水即可提款</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">5</div>
                    <span style="color:red;">每日额外返水红包</span><br>
                </div>
                <div class="item2">
                  <div >1. 统计每日返水金额，对应VIP等级返水加赠比例派发。次日可领取每日额外返水红包彩金，返水红包积累至10元即可领取（不足10元则不可领取），彩金1倍流水即可提款。</div>
                  <div><span style="color:red;">例：</span>VIP12会员当日的返水金额为1000元，则按照VIP12每日额外返水红包赠送比例2.0%计算：1000*2.0%=20元，返水红包为20元，会员可在页面上点击领取。</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">6</div>
                    <span style="color:red;">每月15号红包</span><br>
                </div>
                <div class="item2">
                  <div >1. 会员日为每月15号00:00起：雷火会员在上个月有任意一笔有效存款，即可在会员日15号00:00至21号23:59期间领取对应等级的会员日礼金（以领取时的等级为准）会员礼金仅需三倍流水即可出款，过期未领者则视为主动放弃：</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">7</div>
                    <span style="color:red;">充值赠送20%奖金</span><br>
                </div>
                <div class="item2">
                  <div >1. VIP1及以上会员在会员日当天至21号23:59可登录VIP活动页面领取专属充值加码券且加码券需在15日内在充值页面进行勾选优惠使用，成功使用后需要（本金+彩金）x8倍流水即可提款；</div>
                  <div>2. 加码券使用当日不可与其他存款优惠共享。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tabValue === 2">
        <div>
          <div class="livepoker-rebate-game-info">
            <table class="livepoker-rebate-game-info-table">
              <thead>
                <tr>
                  <th>VIP等级</th>
                  <th>电竞</th>
                  <th>体育</th>
                  <th>真人</th>
                  <th>棋牌</th>
                  <th>电子</th>
                  <th>返水上限</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>VIP1</td>
                  <td>0.45%</td>
                  <td>0.40%</td>
                  <td>0.45%</td>
                  <td>0.45%</td>
                  <td>0.60%</td>
                  <td>8,888</td>
                </tr>
                <tr>
                  <td>VIP2</td>
                  <td>0.48%</td>
                  <td>0.45%</td>
                  <td>0.45%</td>
                  <td>0.45%</td>
                  <td>0.60%</td>
                  <td>12,888</td>
                </tr>
                <tr>
                  <td>VIP3</td>
                  <td>0.48%</td>
                  <td>0.45%</td>
                  <td>0.45%</td>
                  <td>0.50%</td>
                  <td>0.80%</td>
                  <td>18,888</td>
                </tr>
                <tr>
                  <td>VIP4</td>
                  <td>0.48%</td>
                  <td>0.50%</td>
                  <td>0.48%</td>
                  <td>0.55%</td>
                  <td>0.80%</td>
                  <td>18,888</td>
                </tr>
                <tr>
                  <td>VIP5</td>
                  <td>0.50%</td>
                  <td>0.50%</td>
                  <td>0.50%</td>
                  <td>0.60%</td>
                  <td>0.80%</td>
                  <td>28,888</td>
                </tr>
                <tr>
                  <td>VIP6</td>
                  <td>0.50%</td>
                  <td>0.55%</td>
                  <td>0.55%</td>
                  <td>0.70%</td>
                  <td>0.85%</td>
                  <td>28,888</td>
                </tr>
                <tr>
                  <td>VIP7</td>
                  <td>0.55%</td>
                  <td>0.65%</td>
                  <td>0.68%</td>
                  <td>0.90%</td>
                  <td>1.00%</td>
                  <td>58,888</td>
                </tr>
                <tr>
                  <td>VIP8</td>
                  <td>0.60%</td>
                  <td>0.70%</td>
                  <td>0.70%</td>
                  <td>1.00%</td>
                  <td>1.05%</td>
                  <td>88,888</td>
                </tr>
                <tr>
                  <td>VIP9</td>
                  <td>0.70%</td>
                  <td>0.75%</td>
                  <td>0.75%</td>
                  <td>1.10%</td>
                  <td>1.10%</td>
                  <td>88,888</td>
                </tr>
                <tr>
                  <td>VIP10</td>
                  <td>0.80%</td>
                  <td>0.80%</td>
                  <td>0.80%</td>
                  <td>1.20%</td>
                  <td>1.20%</td>
                  <td>128,888</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="livepoker-rebate-game-bottom-rule">
            <div class="title"></div>
            <div class="content">
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">1</div>
                    <span style="color:red;">会员晋级/保级/降级规则</span><br>
                </div>
                <div class="item2">
                  <div >1. 完成等级要求的累计有效流水后系统于次日北京时间早上10点自动更新，具体完成时间以系统为准，请耐心等待；</div>
                  <div >2. VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升；</div>
                  <div >3. 会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算；</div>
                  <div >4. 假设会员在一个季度（90天计算）内没有完成相应的保级要求流水，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级；</div>
                  <div >5. 每个级别的升级礼金每位会员仅能获得1次（升级礼金1倍流水即可提款）；</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">2</div>
                    <span style="color:red;">生日礼金</span><br>
                </div>
                <div class="item2">
                  <div >1. 生日符合资格的会员，每年生日当天及当天后7日内到在线客服提供相关资料申请生日礼金，逾期不补，彩金1倍流水即可提款；</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">3</div>
                    <span style="color:red;">首次保级彩金</span><br>
                </div>
                <div class="item2">
                  <div >1. 会员在90天保级期内达到保级要求时，第 91 天即可领取首次保级彩金，首次保级彩金1倍流水即可提款。</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">4</div>
                    <span style="color:red;">年度保级彩金</span><br>
                </div>
                <div class="item2">
                  <div >1. 首次保级成功后计算会员12个月内未降级（可晋级），彩金于第13个月首日进行派发；彩金1倍流水即可提款</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">5</div>
                    <span style="color:red;">每日额外返水红包</span><br>
                </div>
                <div class="item2">
                  <div >1. 统计每日返水金额，对应VIP等级返水加赠比例派发。次日可领取每日额外返水红包彩金，返水红包积累至10元即可领取（不足10元则不可领取），彩金1倍流水即可提款。</div>
                  <div><span style="color:red;">例：</span>VIP12会员当日的返水金额为1000元，则按照VIP12每日额外返水红包赠送比例2.0%计算：1000*2.0%=20元，返水红包为20元，会员可在页面上点击领取。</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">6</div>
                    <span style="color:red;">每月15号红包</span><br>
                </div>
                <div class="item2">
                  <div >1. 会员日为每月15号00:00起：雷火会员在上个月有任意一笔有效存款，即可在会员日15号00:00至21号23:59期间领取对应等级的会员日礼金（以领取时的等级为准）会员礼金仅需三倍流水即可出款，过期未领者则视为主动放弃：</div>
                </div>
              </div>
              <div class="outitem">
                <div class="item" >
                  <div class="item-num">7</div>
                    <span style="color:red;">充值赠送20%奖金</span><br>
                </div>
                <div class="item2">
                  <div >1. VIP1及以上会员在会员日当天至21号23:59可登录VIP活动页面领取专属充值加码券且加码券需在15日内在充值页面进行勾选优惠使用，成功使用后需要（本金+彩金）x8倍流水即可提款；</div>
                  <div>2. 加码券使用当日不可与其他存款优惠共享。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { getCBAInit, claimCBADailyBonus, getCBAWeeklyInit, claimCBAWeeklyBonus } from "@/api/index/promo";
import { onMounted, ref, defineProps } from "vue";
// import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);

// const notify = useNotify();

const store = userStore();
const totalValidBet = ref(0);
const dailyBonus = ref(0);
const betCount = ref(0);

const weeklyBonus = ref(0);
const totalLoss = ref(0);
const claimedBonus = ref(0);

const tabValue = ref(1);

const handleClaimDailyBonus = () => {
  if (!store.hasToken()) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large",
      closeOnClickModal: true
    }).then(() => {
      store.loginPageVisible = true;
    });
    return;
  }

  claimCBADailyBonus()
    .then((res) => {
      if (res.code === 0) {
        // notify({
        //   type: "success",
        //   message: `成功领取${res.data}元`
        // });
        ElMessage.success(`成功领取${res.data}元`);
        fetchData();
      } else {
        // notify({
        //   type: "error",
        //   message: res.message
        // });
      }
    })
    .catch((err) => {
      console.log(err);
      // notify({
      //   type: "error",
      //   message: err.message
      // });
      ElMessage.error(err.message);
    });
};

const handleClaimWeeklyBonus = () => {
  if (!store.hasToken()) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large",
      closeOnClickModal: true
    }).then(() => {
      store.loginPageVisible = true;
    });
    return;
  }

  claimCBAWeeklyBonus()
    .then((res) => {
      if (res.code === 0) {
        // notify({
        //   type: "success",
        //   message: `成功领取${res.data}元`
        // });
        ElMessage.success(`成功领取${res.data}元`);
        fetchData();
      } else {
        // notify({
        //   type: "error",
        //   message: res.message
        // });
      }
    })
    .catch((err) => {
      console.log(err);
      // notify({
      //   type: "error",
      //   message: err.message
      // });
      ElMessage.error(err.message);
    });
};

const fetchData = async () => {
  try {
    const res = await getCBAInit();
    const res1 = await getCBAWeeklyInit();

    totalValidBet.value = res.data.totalValidBet;
    betCount.value = res.data.betCount;
    dailyBonus.value = res.data.bonus;

    totalLoss.value = res1.data.totalLoss;
    weeklyBonus.value = res1.data.bonus;
    claimedBonus.value = res1.data.claimedBonus;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  fetchData();
});
</script>

<style scoped lang="scss">
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}
.livepoker-rebate-container {
  width: 1200px;
  height: 100%;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 30px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  background: url("../../../assets/promo/dy2-blast-premier/section-bg.png");
  background-size: 100% 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .livepoker-rebate-section-right {
    margin-top: auto;
    margin-bottom: auto;
    width: 254px;

    .bonus-image {
      cursor: pointer;
      width: 100%;

      &:hover {
        filter: brightness(0.9);
      }
      &:active {
        transform: translate(0px, 1px);
        opacity: 0.9;
      }

      &.disabled {
        filter: grayscale(100%);
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .livepoker-rebate-section-title {
    color: #000000;
    font-size: 24px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
  }
}

.livepoker-rebate-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.livepoker-rebate-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .livepoker-rebate-game-bottom-left-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff0000;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
}

.livepoker-rebate-game-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  // align-items: center;
  gap: 20px;

  .title {
    background-image: url("../../../assets/promo/dy2-blast-premier/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin: 0 auto 40px;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    .left {
      background-image: url("../../../assets/promo/dy2-blast-premier/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      min-width: 120px;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
    }
  }
}

.livepoker-rebate-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  text-align: center;
  vertical-align: middle;
  th {
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    &:first-child {
      border-top-left-radius: 12px;
    }
    &:last-child {
      border-top-right-radius: 12px;
    }
  }
  tr {
    &:last-child {
      td {
        &:first-child {
          // border-bottom-left-radius: 12px;
        }
      }
    }
    &:nth-child(2) {
      td {
        &:last-child {
          // border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    border: 1px solid #acd4f6;
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}

.livepoker-rebate-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("../../../assets/promo/dy2-blast-premier/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    color: #000000;
    .item2 {
      margin-left: 66px;;
    }
    .item {
      padding-left: 24px;
      display: flex;
      gap: 10px;

      .item-num {
        color: #ffffff;
        font-size: 20px;
        line-height: 1;
        border-radius: 50%;
        height: 28px !important;
        width: 28px !important;
        min-width: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      }

      .hint {
        font-size: 18px;
        font-weight: 400;
        line-height: 22.4px;
        color: #ff0000;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.reward-info {
  border: 1px solid rgba(215, 235, 255, 1);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.reward-info-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.reward-info-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: black;
  gap: 24px;

  .amount {
    color: #00a1ff;
    font-weight: 600;
  }
}

.tab-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  .tab {
    width: 300px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60px;
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    color: #818181;
    font-size: 36px;
    font-weight: bold;
    cursor: pointer;

    &.active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
    }
  }
}
</style>
