<template>
  <div class="noob-container">
    <div class="noob-content">
      <div class="noob-title">
        <img src="../../../assets/promo/welcometask/noob_text.png" alt="" />
      </div>
      <div class="noob-task game">
        <div class="message-title">
          <section>
            <h2>1</h2>
          </section>
          <section>
            <h3>游戏体验</h3>
            <p>领取限时：注册日期，7日内领取奖励</p>
          </section>
        </div>
        <div class="game-card">
          <section class="card-coupons">
            <div class="card-number">
              <span class="money-number">5</span>
              <span class="card-text">元</span>
            </div>
            <div class="card-content">
              <p>首充充值：</p>
              <p>累计充值100元奖励5元</p>
              <button
                v-show="welcomeState.stateDetails.firstDepositState != 'CLAIMED'"
                :disabled="welcomeState.stateDetails.firstDepositState != 'YES'"
                :class="[first - button, welcomeState.stateDetails.firstDepositState != 'YES' ? 'active-disabled' : '']"
                @click="claimBonus('xf-welcome-first-deposit')"
              >
                领取
              </button>
              <button
                v-show="welcomeState.stateDetails.firstDepositState == 'CLAIMED'"
                :disabled="welcomeState.stateDetails.firstDepositState != 'YES'"
                :class="[first - button, welcomeState.stateDetails.firstDepositState != 'YES' ? 'active-disabled' : '']"
              >
                领取成功
              </button>
            </div>
          </section>
          <section class="card-coupons">
            <div class="card-number">
              <span class="money-number">5</span>
              <span class="card-text">元</span>
            </div>
            <div class="card-content">
              <p>首充投注：</p>
              <p>累计投注500元奖励5元</p>
              <button
                v-show="welcomeState.stateDetails.firstBetState != 'CLAIMED'"
                :disabled="welcomeState.stateDetails.firstBetState != 'YES'"
                :class="[first - cast, welcomeState.stateDetails.firstBetState != 'YES' ? 'active-disabled' : '']"
                @click="claimBonus('xf-welcome-first-bet')"
              >
                领取
              </button>
              <button
                v-show="welcomeState.stateDetails.firstBetState == 'CLAIMED'"
                :disabled="welcomeState.stateDetails.firstBetState != 'YES'"
                :class="[first - cast, welcomeState.stateDetails.firstBetState != 'YES' ? 'active-disabled' : '']"
              >
                领取成功
              </button>
            </div>
          </section>
          <section class="card-coupons">
            <div class="card-number">
              <span class="money-number">18</span>
              <span class="card-text">元</span>
            </div>
            <div class="card-content special">
              <p>邀请好友一名：</p>
              <p>邀请好友累计充值200元奖励18元</p>
              <button
                v-show="welcomeState.stateDetails.firstFriendState != 'CLAIMED'"
                :disabled="welcomeState.stateDetails.firstDepositState != 'YES'"
                :class="[invite - button, welcomeState.stateDetails.firstFriendState != 'YES' ? 'active-disabled' : '']"
                @click="claimBonus('xf-welcome-friend')"
              >
                领取
              </button>
              <button
                v-show="welcomeState.stateDetails.firstFriendState == 'CLAIMED'"
                :disabled="welcomeState.stateDetails.firstDepositState != 'YES'"
                :class="[invite - button, welcomeState.stateDetails.firstFriendState != 'YES' ? 'active-disabled' : '']"
              >
                领取成功
              </button>
            </div>
          </section>
        </div>
      </div>
      <div class="noob-task">
        <div class="message-title">
          <section>
            <h2>2</h2>
          </section>
          <section>
            <h3>签到礼包</h3>
            <p>领取限时：注册日期，7日内领取奖励</p>
            <p>第一天奖励：无 第二天奖励：无 第三天奖励：无 第四天奖励：无 第五天奖励：88元</p>
          </section>
        </div>
        <hr class="sign-line" />
        <div class="sign-process" id="process">
          <div id="firstSign">
            <section>
              <span class="sign-day">第一天</span>
            </section>
            <section v-show="checkInRewardState.stateDetails.checkInDays < 1" class="sign-round">未签</section>
            <section v-show="checkInRewardState.stateDetails.checkInDays > 0" class="sign-round sign-shade">
              已签
            </section>
          </div>
          <div>
            <section>
              <span class="sign-day">第二天</span>
            </section>
            <section v-show="checkInRewardState.stateDetails.checkInDays < 2" class="sign-round">未签</section>
            <section v-show="checkInRewardState.stateDetails.checkInDays > 1" class="sign-round sign-shade">
              已签
            </section>
          </div>
          <div>
            <section>
              <span class="sign-day">第三天</span>
            </section>
            <section v-show="checkInRewardState.stateDetails.checkInDays < 3" class="sign-round">未签</section>
            <section v-show="checkInRewardState.stateDetails.checkInDays > 2" class="sign-round sign-shade">
              已签
            </section>
          </div>
          <div>
            <section>
              <span class="sign-day">第四天</span>
            </section>
            <section v-show="checkInRewardState.stateDetails.checkInDays < 4" class="sign-round">未签</section>
            <section v-show="checkInRewardState.stateDetails.checkInDays > 3" class="sign-round sign-shade">
              已签
            </section>
          </div>
          <div>
            <section>
              <span class="sign-day">第五天</span>
            </section>
            <section v-show="checkInRewardState.stateDetails.checkInDays < 5" class="sign-round sign-gift">
              <p>得88彩金</p>
              <span>大礼包</span>
            </section>
            <section v-show="checkInRewardState.stateDetails.checkInDays > 4" class="sign-round sign-gift sign-shade">
              <p>得88彩金</p>
              <span>大礼包</span>
            </section>
          </div>
          <div class="sign-in" v-show="welcomeState.stateDetails.checkInRewardState != 'NO'">
            <p>
              您已累计签到
              <span class="checkDay">{{ checkInRewardState.stateDetails.checkInDays }}</span>
              天
            </p>
            <button
              :disabled="checkInRewardState.stateDetails.todayCheckInState != 'YES'"
              :class="[
                check - sign,
                checkInRewardState.stateDetails.todayCheckInState != 'YES' ? 'active-disabled' : ''
              ]"
              @click="claimBonus('xf-welcome-check-in')"
            >
              点击签到
            </button>
          </div>
          <div class="sign-in" v-show="welcomeState.stateDetails.checkInRewardState == 'NO'">
            <p>你已经不能领取</p>
            <button
              :disabled="welcomeState.stateDetails.checkInRewardState == 'NO'"
              :class="[check - sign, welcomeState.stateDetails.checkInRewardState == 'NO' ? 'active-disabled' : '']"
            >
              点击签到
            </button>
          </div>
        </div>
        <div class="sign-button">
          <p>每日签到条件 : 每日累计存款≥100元且有效投注额≥500元</p>
          <button @click="gotoDepositPage()">去存款</button>
          <button @click="gotoMainPage()">去投注</button>
        </div>
      </div>
      <div class="noob-title">
        <img src="../../../assets/promo/welcometask/noob_ruler.png" alt="" />
      </div>
      <div class="noob-active">
        <p>1：两项新手任务完成后需在活动页面完成领取和签到。</p>
        <p>2：签到任务每日完成后，需在活动页面点击签到为有效，逾时不予补偿。</p>
        <p>3：新手任务领取奖金需完成三倍流水。即可提款，所获彩金不可与返水活动共享。</p>
        <p>4：此活动只针对新注册用户有效，活动期间只能享受一次，逾期视为自动放弃本活动资格。</p>
        <p>
          5：每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能享受一次活动，对违规的用户，保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
        </p>
        <p>6：凡参加活动用户，即表示接受且自愿遵守平台规定，平台保留最终解释权。</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { welcomeTaskClaimBonus, welcomeTaskInit } from "@/api/index/promo";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import { useNotify } from "@/hooks/notify";
const notify = useNotify()
const router = useRouter();
// const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(0);
const store = userStore();
// const checkInDays = ref(3);

const welcomeState = reactive({
  stateDetails: {}
});
const checkInRewardState = reactive({
  stateDetails: {}
});
onMounted(() => {
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
    
  pageInit();
});

const pageInit = () => {
  welcomeTaskInit().then((res) => {
    if (res.code === 0) {
      welcomeState.stateDetails = res.data;
      if (welcomeState.stateDetails.checkInRewardState !== "NO") {
        checkInRewardState.stateDetails = JSON.parse(welcomeState.stateDetails.checkInRewardState);
      }
    } else {
      notify.error(res.message);
    }
  });
};

const claimBonus = (promoCode) => {
  welcomeTaskClaimBonus(promoCode)
    .then((res) => {
      if (res.code === 0) {
        winAmount.value = res.data;

        // this.privilegeClaimedModalVisible = true;
        // this.loadingClaim = false;
        // this.store.getBalance();

        bonusOpened.value = true;
      } else {
        // notify.error(res.message)
        notify.error(res.message);
        bonusOpened.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
      // message.error(err.message, 4);
      bonusOpened.value = false;
    });
  // get latest init status
  pageInit();
};
const gotoDepositPage = () => {
  router.push({ name: "deposit" });
};
const gotoMainPage = () => {
  router.push({ name: "home" });
};
</script>
<style lang="scss">
.arrow,
.come,
.money-number,
.noob-title,
.process {
  text-align: center;
}

body .noob-container,
html .noob-container,
.noob-container p {
  margin: 0;
  padding: 0;
  font-family: MicrosoftYaHei;
}

.message-title > section > h2,
.message-title > section > h3,
.money-number {
  font-family: MicrosoftYaHei-Bold;
  font-style: italic;
}

button {
  outline: 0;
  cursor: pointer;
}

.noob-container {
  background-color: #090b19;
  font-size: 14px;
  color: #d0d1d3;
}

.noob-banner {
  width: 100%;
  height: 500px;
}

.noob-banner > img {
  width: 100%;
}

.noob-content {
  width: 1153px;
  margin: 0 auto;
}

.noob-title {
  margin-top: 25px;
  margin-bottom: 40px;
}

.noob-task {
  width: 1153px;
  height: 386px;
  margin-bottom: 50px;
  background-color: #151825;
  box-shadow: 0 5px 10px 0 rgba(12, 3, 7, 0.2);
  border-radius: 8px;
}

.message-title {
  display: flex;
  text-align: start;
}

.message-title > section > h2,
.message-title > section > h3 {
  display: inline-block;
  margin: 0;
}

.message-title > section {
  height: 65px;
  margin-top: 20px;
}

.message-title > section > h2 {
  font-size: 65px;
  color: #d0d1d3;
  width: 100px;
  height: 100px;
  padding-left: 18px;
  text-align: center;
}

.message-title > section > h3 {
  font-size: 24px;
  font-weight: 400;
  color: #33bcd4;
  margin-top: 15px;
}

.message-title > section > p {
  font-size: 14px;
  margin-top: 5px;
  color: #d0d1d3;
}

.message-text {
  margin: 50px 0 40px 240px;
}

.message-text > span {
  display: inline-block;
}

.card-coupons,
.game-card,
.message-icon {
  display: flex;
}

.line {
  width: 200px;
  height: 1px;
  background-color: #33bcd4;
}

.come {
  width: 140px;
  font-size: 18px;
  font-weight: 700;
  color: #33bcd4;
  position: relative;
  top: 5px;
}

.message-process {
  display: flex;
  margin-left: 135px;
}

.message-process button {
  width: 200px;
  height: 48px;
  font-size: 18px;
  background-image: linear-gradient(90deg, #0ca9bc 0, #0a5e89 100%), linear-gradient(#fff, #fff);
  background-blend-mode: normal, normal;
  box-shadow: 0 3px 4px 0 rgba(13, 110, 200, 0.29);
  border-radius: 6px;
  border: none;
  color: #fff;
}

.process {
  width: 210px;
}

.process p {
  font-size: 14px;
  color: #d0d1d3;
  margin-top: 15px;
}

.process p > img {
  vertical-align: middle;
  margin-left: 15px;
}

.arrow {
  width: 50px;
  line-height: 110px;
}

.button-receive {
  margin-left: 30px;
}

.active-disabled {
  background-image: none !important;
  background-color: gray;
}

.sign-day,
.sign-line {
  background-color: #454b62;
}

.game-card {
  margin-top: 70px;
}

.game-card section {
  width: 320px;
  height: 140px;
  margin-left: 50px;
  background-image: url(data:image/png;base64,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);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.card-number {
  width: 90px;
  line-height: 140px;
  position: relative;
}

.money-number {
  display: inline-block;
  width: 70px;
  font-size: 65px;
  font-stretch: normal;
  color: #d0d1d3;
}

.card-content > p,
.card-text {
  font-size: 14px;
  color: #d0d1d3;
}

.card-text {
  position: absolute;
  top: -42px;
}

.sign-button > p,
.sign-day,
.sign-line {
  position: relative;
}

.card-content {
  padding-top: 30px;
}

.card-content > p {
  padding-left: 40px;
}

.special > p {
  padding-left: 15px !important;
  font-size: 13px;
}

.card-content > button {
  width: 146px;
  height: 36px;
  font-size: 14px;
  margin: 15px 0 0 40px;
  background-image: linear-gradient(90deg, #0ca9bc 0, #0a5e89 100%), linear-gradient(#fff, #fff);
  background-blend-mode: normal, normal;
  border-radius: 6px;
  color: #fff;
  border: none;
}

.sign-process {
  display: flex;
  margin: 50px 0 0 115px;
}

.sign-button > button,
.sign-button > p,
.sign-day {
  display: inline-block;
}

.sign-line {
  width: 500px;
  height: 1px;
  top: 68px;
  left: 150px;
  color: #454b62;
  border: none;
}

.sign-day,
.sign-round {
  width: 92px;
  font-size: 14px;
  text-align: center;
}

.sign-day {
  height: 32px;
  line-height: 32px;
  color: #fff;
  border-radius: 16px;
  z-index: 1;
}

.sign-process > div {
  margin-right: 40px;
}

.sign-round {
  height: 92px;
  line-height: 92px;
  margin-top: 20px;
  border-radius: 50%;
  color: #73788f;
  background-color: #2e334c;
}

.sign-shade {
  color: #fff;
  background-image: linear-gradient(90deg, #0ca9bc 0, #0a5e89 100%), linear-gradient(#2e334c, #2e334c);
  background-blend-mode: normal, normal;
}

.sign-button > button,
.sign-in > button {
  width: 200px;
  height: 48px;
  background-image: linear-gradient(90deg, #0ca9bc 0, #0a5e89 100%), linear-gradient(#fff, #fff);
  background-blend-mode: normal, normal;
  box-shadow: 0 3px 4px 0 rgba(13, 110, 200, 0.29);
}

.sign-in {
  width: 200px;
  text-align: center;
  margin-left: 120px;
}

.sign-in > p {
  font-size: 14px;
  color: #33bcd4;
  margin-bottom: 20px;
}

.sign-in > button {
  font-size: 18px;
  color: #fff;
  border-radius: 6px;
  border: none;
}

.sign-gift {
  line-height: 20px;
}

.sign-gift > p {
  padding-top: 28px;
}

.sign-button {
  margin-top: 20px;
  vertical-align: bottom;
}

.sign-button > p {
  font-size: 14px;
  margin: 0 155px 0 117px;
  color: #d0d1d3;
  top: 20px;
}

.sign-button > button {
  line-height: 48px;
  font-size: 18px;
  margin-right: 22px;
  border-radius: 6px;
  border: none;
  text-align: center;
  color: #fff;
}
.noob-active {
  margin-bottom: 50px;
  text-align: start;
}

.noob-active > p {
  font-size: 14px;
  margin: 30px 0;
  color: #d0d1d3;
}
</style>
<style scoped lang="scss"></style>
