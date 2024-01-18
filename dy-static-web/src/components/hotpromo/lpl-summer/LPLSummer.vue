<template>
  <div class="lpl-body">
    <div class="lpl-container">
      <div class="lpl-tabs">
        <div :class="`tab tab-1 ${isTabOne ? 'active' : ''}`" @click="onTabClick(true)">
          <span class="grad-txt">呐喊助威</span>
        </div>
        <div :class="`tab tab-2 ${!isTabOne ? 'active' : ''}`" @click="onTabClick(false)">
          <span class="grad-txt">倍投赠礼</span>
        </div>
      </div>

      <div class="lpl-claim-btns">
        <div :class="`claim-btn-div ${isTabOne ? 'active' : ''}`">
          <img class="claim-img" src="../../../assets/promo/lpl-s13/btn2-claim.png" />
          <div class="claim-rgt">
            <span class="claim-title">LPL呐喊助威</span>
            <span
              :class="`claim-btn ${claimBtnStatus.btnOne ? 'disable-pointer' : ''}`"
              @click="onClaimBtnClicked(true)"
            >
              <div>立即申請</div>
            </span>
          </div>
        </div>

        <div :class="`claim-btn-div ${!isTabOne ? 'active' : ''}`">
          <img class="claim-img" src="../../../assets/promo/lpl-s13/btn2-claim.png" />
          <div class="claim-rgt">
            <span class="claim-title">LPL倍投赠礼</span>
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
          <img src="../../../assets/promo/lpl-s13/actv-details.png" alt="content-title" />
        </div>
        <div class="lpl-actives">
          <p>
            活动期间，2024年1月15日至LPL春季赛开赛前需满足累积存款≥5000且电竞场馆有效流水≥30000，开赛日时可派发58元，LPL春季赛开赛当日可点击申请按钮，次日24点前免费派发8元
          </p>
        </div>

        <table class="lpl-table-div">
          <thead>
            <tr>
              <th style="width: 300px">达成条件</th>
              <th style="width: 300px">开赛祝贺礼</th>
              <th style="width: 300px">奖金派发时间</th>
              <th style="width: 300px">奖金派发形式</th>
              <th style="width: 300px">奖金流水</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                LPL春季赛开赛日前 累积存款≥5000 且
                <br />
                全电竞场馆有效流水≥30000
              </td>
              <td>58</td>
              <td>LPL春季赛开赛日</td>
              <td>无需申请 派发至会员钱包</td>
              <td>3倍</td>
            </tr>
            <tr>
              <td>
                LPL春季赛开赛当日
                <br />
                点击开赛日申请按钮
              </td>
              <td>8</td>
              <td>LPL春季赛开赛次日</td>
              <td>需自助申请 派发至会员钱包</td>
              <td>3倍</td>
            </tr>
          </tbody>
        </table>

        <div class="lpl-title"><img src="../../../assets/promo/lpl-s13/actv-rules.png" alt="content-rule" /></div>

        <div class="lpl-ruler">
          <p>1. LPL春季赛赛前与开赛日均有祝贺礼，以上述条件及奖金派发为准；</p>
          <p>
            2.
            参与本活动会员需在LPL春季赛开赛当日23:59:59前登录该页面并点击【立即申请】，逾事不予补偿，申请成功后系统将于次日24小时内自动派发至会员钱包，彩金仅需3倍流水即可取款
          </p>
          <p>
            3.
            仅计算已结算并产生输赢结果的注单，任何平局、串关、取消的注单不予计算，任何低于欧洲盘1.7、香港盘0.7赔率以下的注单以及在同一赛事中同时投注对等盘口将不予计算；
          </p>
          <p>
            4.
            每位有效会员、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑以及其他登录设备只能享受一次活动优惠，如有任何违规者或任何团体以不正常的方式进行套取活动优惠，我站保留在不通知的情况下冻结或关 
            闭相关账户的权利，并不退还款项，且用户列入黑名单。
          </p>
          <p>5. 为避免文字理解差异，本站保留最终解释权。</p>
        </div>
      </div>

      <div :class="`lpl-section-content ${!isTabOne ? 'active' : ''}`">
        <div class="lpl-title">
          <img src="../../../assets/promo/lpl-s13/actv-details.png" alt="content-title" />
        </div>
        <div class="lpl-actives">
          <p>活动期间，当日投注LPL+LCK赛事总有效投注≥1000即可根据对应倍投彩金，每日最高可获1088元。</p>
        </div>

        <table class="lpl-table-div">
          <thead>
            <tr>
              <th style="width: 400px">基础</th>
              <th style="width: 400px">倍投彩金</th>
              <th style="width: 400px">VIP等级</th>
              <th style="width: 400px">VIP彩金上限</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="6">≥1000元=8元</td>
              <td rowspan="6">当日LPL+LCK春季赛有效投注/1000*8</td>
              <td>VIP0~VIP1</td>
              <td>8</td>
            </tr>
            <tr>
              <td>VIP2~VIP3</td>
              <td>88</td>
            </tr>
            <tr>
              <td>VIP4~VIP5</td>
              <td>188</td>
            </tr>
            <tr>
              <td>VIP6~VIP7</td>
              <td>388</td>
            </tr>
            <tr>
              <td>VIP8~VIP9</td>
              <td>888</td>
            </tr>
            <tr>
              <td>VIP10~VIP12</td>
              <td>1288</td>
            </tr>
          </tbody>
        </table>

        <p>
          例：用户小雷VIP3在
          2024年01月25日LPL春季赛总有效投注20000元，LCK春季赛总有效投注500元，用户小雷符合（20500/1000）*8=164元，由于小雷为VIP3用户达到88元上限，小雷1月26日可获88元彩金。
        </p>

        <div class="lpl-ruler">
          <p>1.活动期间LPL春季赛与LCK春季赛赛事累计有效投注≥1000元即可获得对应彩金；</p>
          <p>
            2.活动期间每位会员需手动申请，每日可申请一次，活动计算当日LPL春季赛与LCK春季赛总有效投注，次日清零重新计算LPL春季赛与LCK春节赛赛事总有效投注，逾期未申请则视为放弃；
          </p>
          <p>
            3.活动期间彩金计算方式为：当日LPL春季赛与LCK春季赛总有效投注/1000*8=（彩金金额），每VIP等级达到彩金上限按最高上限派发，彩金次日24小时内统一派发，彩金3倍流水即可提款；
          </p>
          <p>4.同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</p>
          <p>
            5.任何会员或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且会员会被列入黑名单；
          </p>
          <p>6.为避免文字理解差异，本站保留本活动最终解释权；</p>
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
    param.promoCode = "lpl-summer-A";
    param.promoTitle = "呐喊助威";
  } else {
    param.promoCode = "lpl-summer-B";
    param.promoTitle = "倍投赠礼";
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
  border: 1px solid #2f7cf7;
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
