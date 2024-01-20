<template>
  <div class="lpl-body">
    <div class="lpl-container">
      <div class="lpl-claim-btns">
        <div :class="`claim-btn-div`">
          <img class="claim-img" src="../../../assets/promo/asian-cup-2024/btn1-claim.png" />
          <div class="claim-rgt">
            <span class="claim-title">热血迎蓝 战火延续</span>
            <span :class="`claim-btn`" @click="onClaimBtnClicked(true)">
              <div>立即申請</div>
            </span>
          </div>
        </div>
      </div>

      <div :class="`lpl-section-content`">
        <div class="lpl-title">
          <img src="../../../assets/promo/asian-cup-2024/actv-details.png" alt="content-title" />
        </div>
        <div class="lpl-actives">
          <p>
            活动期间，会员每天投注体育场馆的NBA赛事与CBA赛事，总有效投注额≥3,000元，即可点击【立即申请】按钮申请彩金，每日最高888元流水彩金！彩金仅需5倍流水即可取款！
          </p>
        </div>

        <table class="lpl-table-div">
          <thead>
            <tr>
              <th style="width: 400px">有效投注</th>
              <th style="width: 400px">流水彩金</th>
              <th style="width: 400px">流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥3000</td>
              <td>8</td>
              <td rowspan="9">5倍有效流水</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>28</td>
            </tr>
            <tr>
              <td>≥15,000</td>
              <td>38</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>68</td>
            </tr>
            <tr>
              <td>≥60,000</td>
              <td>88</td>
            </tr>
            <tr>
              <td>≥100,000</td>
              <td>188</td>
            </tr>
            <tr>
              <td>≥300,000</td>
              <td>388</td>
            </tr>
            <tr>
              <td>≥500,000</td>
              <td>588</td>
            </tr>
            <tr>
              <td>≥1,000,000</td>
              <td>888</td>
            </tr>
          </tbody>
        </table>

        <div class="lpl-title">
          <img src="../../../assets/promo/asian-cup-2024/actv-rules.png" alt="content-rule" />
        </div>

        <div class="lpl-ruler">
          <p>1. 本活动计算沙巴体育与IM体育的NBA&CBA当日全部赛事有效投注，每日达到对应有效投注即可领取对应流水彩金。</p>
          <p>
            2.
            满足活动条件的会员需在当日的23:59:59前登录该页面并点击【立即申请】按钮进行活动申请，逾事不予补偿，申请成功后系统将于次日24小时内自动派发至会员钱包，彩金仅需5倍流水即可取款。
          </p>
          <p>3. 流水仅计算当天下注且结算的注单，若提前兑现、注单未结算、取消或走盘皆不及不计算为有效投注。</p>
          <p>
            4.
            任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内。
          </p>
          <p>
            5.
            每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消全部优惠的权利。
          </p>
          <p>6. 为避免文字理解差异，本站保留最终解释权。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { userStore } from "@/store";
import { ElMessage } from "element-plus";
import { promoApplyWithGameType } from "@/api/index/promo";

const store = userStore();

const claimBtnStatus = reactive({
  btn: false
});
const onClaimBtnClicked = () => {
  if (!store.token) {
    ElMessage.error("请登入后操作");
    return;
  }

  const param = { promoCode: "", promoTitle: "", gameType: "" };
  param.promoCode = "basketball-hot";
  param.promoTitle = "热血迎蓝";
  param.gameType = "NBA";

  promoApplyWithGameType(param)
    .then((res) => {
      if (res.code == 0) ElMessage.success("申请成功");
      else ElMessage.error(res);
    })
    .catch(() => {})
    .then(() => {
      claimBtnStatus.btn = true;
    });
};
</script>

<style scoped lang="scss">
.lpl-container {
  min-height: calc(100vh - 290px);
  width: 100%;
}

.lpl-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 25px auto 20px;
  color: black;
}

.lpl-claim-btns {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 10px auto;
}

.claim-btn-div {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.claim-img {
  flex: 1;
}
.claim-img img {
  width: 100%;
}
.claim-rgt {
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.claim-rgt .claim-title {
  color: black;
  font-family: "YouSheBiaoTiHei";
  font-weight: bold;
  font-size: 40px;
  font-style: italic;
  line-height: 78px;
}

.claim-btn {
  cursor: pointer;
  border-radius: 6.25rem;
  background: linear-gradient(180deg, #2ca1fe 0%, #c481fe 100%);
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.15);
  padding: 15px 75px;
  color: white;
  font-weight: bold;

  &.disable-pointer {
    pointer-events: none;
  }
}
.claim-btn:hover {
  opacity: 0.9;
}
.claim-btn:active {
  filter: brightness(0.85);
}

.lpl-banner {
  width: 100%;
  height: 500px;
}

.lpl-ruler {
  width: 1200px;
  margin: 0 auto;
  color: black;
}

.lpl-ruler > p {
  margin: 30px 0 20px;
  font-size: 16px;
  color: black;
}

.lpl-section-content {
  display: block;
}

.lpl-title {
  width: 100%;
  margin: 32px auto;
  text-align: center;
}

.lpl-actives {
  margin: 30px auto 60px auto;
  width: 1150px;
  text-align: center;
}

.lpl-actives p {
  line-height: 24px;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: black;
}

.lpl-table-div {
  margin: 20px auto 10px;
  text-align: center;
  color: white;
  width: 1200px;
  border-collapse: collapse;
}

.lpl-actives td:first-child,
.lpl-actives th:first-child {
  width: fit-content;
  padding: 16px 30px;
}

.lpl-table-div thead {
  background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%), linear-gradient(#d0d1d3, #d0d1d3);
  color: white;
}

.lpl-table-div tr {
  table-layout: fixed;
}

.lpl-table-div td,
.lpl-table-div th {
  text-align: center;
  padding: 16px 30px;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  height: 52px;
  border: 1px solid #dcdce8;
}

.lpl-table-div td {
  color: black;
  font-size: 18px;
}

.lpl-table-div thead th {
  width: 80px;
}

.lpl-hint {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  width: 1200px;
  margin: 0 auto;
}

.lpl-hint .hint-wrapper {
  text-align: center;
  padding: 5px;
  width: 250px;
  border-radius: 0.375rem;
  background-image: linear-gradient(0deg, #0494fc 0, #15bdfc 100%), linear-gradient(#d0d1d3, #d0d1d3);
  aspect-ratio: 168/54;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lpl-hint .hint-wrapper .hint-title {
  font-size: 18px;
  color: white;
}

.lpl-hint .hint-wrapper p {
  color: white;
  font-size: 14px;
  width: unset;
  margin: 0 auto;
}
</style>
