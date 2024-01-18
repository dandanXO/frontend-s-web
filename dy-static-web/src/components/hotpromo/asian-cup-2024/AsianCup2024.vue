<template>
  <div class="lpl-body">
    <div class="lpl-container">
      <div class="lpl-tabs">
        <div :class="`tab tab-1 ${isTabOne ? 'active' : ''}`" @click="onTabClick(true)">
          <span class="grad-txt">亚战指南</span>
        </div>
        <div :class="`tab tab-2 ${!isTabOne ? 'active' : ''}`" @click="onTabClick(false)">
          <span class="grad-txt">投注好礼</span>
        </div>
      </div>

      <div class="lpl-claim-btns">
        <div :class="`claim-btn-div ${isTabOne ? 'active' : ''}`">
          <img class="claim-img" src="../../../assets/promo/asian-cup-2024/btn1-claim.png" />
          <div class="claim-rgt">
            <span class="claim-title">2024亚战指南</span>
            <span
              :class="`claim-btn ${claimBtnStatus.btnOne ? 'disable-pointer' : ''}`"
              @click="onClaimBtnClicked(true)"
            >
              <div>立即申請</div>
            </span>
          </div>
        </div>

        <div :class="`claim-btn-div ${!isTabOne ? 'active' : ''}`">
          <img class="claim-img" src="../../../assets/promo/asian-cup-2024/btn2-claim.png" />
          <div class="claim-rgt">
            <span class="claim-title">2024投注好礼</span>
            <span
              :class="`claim-btn ${claimBtnStatus.btnTwo ? 'disable-pointer' : ''}`"
              @click="onClaimBtnClicked(false)"
            >
              <div>立即申請</div>
            </span>
          </div>
        </div>
      </div>

      <div :class="`lpl-section-content ${isTabOne ? 'active' : ''}`">
        <div class="lpl-title">
          <img src="../../../assets/promo/asian-cup-2024/actv-details.png" alt="content-title" />
        </div>
        <div class="lpl-actives">
          <p>
            赛事期间，投注亚洲杯赛事有效投注额≥500，若投注亚洲杯赛事中触发以下事件，即可获得彩金奖励，彩金奖励按触发事件奖励金额最高赛事派发彩金。每日最高可获388元！
          </p>
        </div>

        <table class="lpl-table-div">
          <thead>
            <tr>
              <th style="width: 400px">任意赛事早盘有效投注</th>
              <th style="width: 400px">首当其冲</th>
              <th style="width: 400px">梅开二度</th>
              <th style="width: 400px">势如破竹</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥500</td>
              <td>3</td>
              <td>5</td>
              <td>6</td>
            </tr>
            <tr>
              <td>≥1,000</td>
              <td>8</td>
              <td>10</td>
              <td>12</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>18</td>
              <td>36</td>
              <td>38</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>36</td>
              <td>58</td>
              <td>88</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>188</td>
              <td>288</td>
              <td>388</td>
            </tr>
          </tbody>
        </table>

        <div class="lpl-hint">
          <div class="hint-wrapper">
            <div class="hint-title">首当其冲</div>
            <p>15分钟内（含15分钟） 有进球</p>
          </div>
          <div class="hint-wrapper">
            <div class="hint-title">梅开二度</div>
            <p>任意方球员 进两个球</p>
          </div>
          <div class="hint-wrapper">
            <div class="hint-title">势如破竹</div>
            <p>胜方赢球3个 且零封对手</p>
          </div>
        </div>

        <div class="lpl-title">
          <img src="../../../assets/promo/asian-cup-2024/actv-rules.png" alt="content-rule" />
        </div>

        <div class="lpl-ruler">
          <p>1.活动期间，投注亚洲杯赛事有效投注≥500元且亚洲杯赛事触发事件即可申请对应彩金奖励。</p>
          <p>
            2.满足活动条件的会员需在当日的23:59:59前登录该页面并点击【立即申请】，逾事不予补偿，申请成功后系统将于次日24小时内自动派发至会员钱包，彩金仅需3倍流水即可取款。
          </p>
          <p>
            3.本活动限沙巴体育与IM体育场馆的早盘盘口参与，滚球盘有效投注不予计算该活动流水内，其他场馆不予本活动统计范围内。
          </p>
          <p>4.活动彩金不累计多场触发条件，彩金按当日触发金额最高条件派发金额。</p>
          <p>
            5.
            仅计算已结算并产生输赢结果的注单，任何平局、串关、取消的注单不予计算，任何低于欧洲盘1.5、香港盘0.5赔率以下的注单以及在同一赛事中同时投注对等盘口将不予计算。
          </p>
          <p>
            6.
            每位有效会员、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑以及其他登录设备只能享受一次活动优惠，如有任何违规者或任何团体以不正常的方式进行套取活动优惠，我站保留在不通知的情况下冻结或关
            闭相关账户的权利，并不退还款项，且用户列入黑名单。
          </p>
          <p>7. 为避免文字理解差异，本站保留最终解释权。</p>
        </div>
      </div>

      <div :class="`lpl-section-content ${!isTabOne ? 'active' : ''}`">
        <div class="lpl-title">
          <img src="../../../assets/promo/asian-cup-2024/actv-details.png" alt="content-title" />
        </div>
        <div class="lpl-actives">
          <p>赛事期间，用户投注亚洲杯联赛当日累计有效投注额≥2000元，即可获得对应层级彩金奖励，每日最高可获得1588元！</p>
        </div>

        <table class="lpl-table-div">
          <thead>
            <tr>
              <th style="width: 300px">有效投注</th>
              <th style="width: 300px">彩金奖金</th>
              <th style="width: 300px">流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥2,000</td>
              <td>8</td>
              <td rowspan="7">3倍流水</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>18</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>38</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>88</td>
            </tr>
            <tr>
              <td>≥80,000</td>
              <td>288</td>
            </tr>
            <tr>
              <td>≥200,000</td>
              <td>588</td>
            </tr>
            <tr>
              <td>≥500,000</td>
              <td>1588</td>
            </tr>
          </tbody>
        </table>

        <div class="lpl-title">
          <img src="../../../assets/promo/asian-cup-2024/actv-rules.png" alt="content-rule" />
        </div>

        <div class="lpl-ruler">
          <p>1. 活动期间，投注亚洲杯赛程赛事有效投注≥2000元即可申请彩金奖励。</p>
          <p>
            2.
            满足活动条件的会员需在当日的23:59:59前登录该页面并点击【立即申请】，逾事不予补偿，申请成功后系统将于次日24小时内自动派发至会员钱包，彩金仅需3倍流水即可取款。
          </p>
          <p>3. 本活动限沙巴体育与IM体育场馆，其他场馆不予本活动统计范围内。</p>
          <p>
            4.
            仅计算已结算并产生输赢结果的注单，任何平局、串关、取消的注单不予计算，任何低于欧洲盘1.5、香港盘0.5赔率以下的注单以及在同一赛事中同时投注对等盘口将不予计。
          </p>
          <p>
            5.
            每位有效会员、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑以及其他登录设备只能享受一次活动优惠，如有任何违规者或任何团体以不正常的方式进行套取活动优惠，我站保留在不通知的情况下冻结或关
            闭相关账户的权利，并不退还款项，且用户列入黑名单。
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
import { promoApply } from "@/api/index/promo";

const store = userStore();

const isTabOne = ref(true);
const onTabClick = (flag) => {
  isTabOne.value = flag;
};

const claimBtnStatus = reactive({
  btnOne: false,
  btnTwo: false
});
const onClaimBtnClicked = (isBtnOne) => {
  if (!store.token) {
    ElMessage.error("请登入后操作");
    return;
  }

  const param = { promoCode: "", promoTitle: "" };
  if (isBtnOne) {
    param.promoCode = "asian-cup-A";
    param.promoTitle = "亚战指南";
  } else {
    param.promoCode = "asian-cup-B";
    param.promoTitle = "投注好礼";
  }

  promoApply(param)
    .then((res) => {
      if (res.code == 0) ElMessage.success("申请成功");
      else ElMessage.error(res);
    })
    .catch(() => {})
    .then(() => {
      if (isBtnOne) claimBtnStatus.btnOne = true;
      else claimBtnStatus.btnTwo = true;
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

.lpl-tabs .tab {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
  border-radius: 0.375rem;
  cursor: pointer;
  padding: 40px;
  font-family: Microsoft Yahei UI;
  font-size: 20px;
  font-weight: 700;
  padding: 20px 70px;
}

.lpl-tabs .tab:not(.active):hover {
  opacity: 0.9;
}

.lpl-tabs .tab.active {
  border: 1px solid #e5e7eb;
  background: linear-gradient(180deg, #2ca1fe 0%, #2f7cf7 100%);
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
}

.lpl-tabs .tab.active .grad-txt {
  color: white;
}
.claim-btn-div {
  display: none;

  &.active {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
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
  display: none;

  &.active {
    display: block;
  }
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
