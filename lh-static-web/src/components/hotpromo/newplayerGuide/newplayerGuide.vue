<template>
  <div style="max-width: 1200px; margin: 0 auto">
    <div class="switch-wrapper">
      <div class="switch-container">
        <div :class="['switch-option', { active: selected === 'option1' }]" @click="selectOption('option1')">
          新手礼包
        </div>
        <div :class="['switch-option', { active: selected === 'option2' }]" @click="selectOption('option2')">
          新人指路
        </div>
      </div>
    </div>
    <div class="option1" v-if="selected === 'option1'">
      <div class="container">
        <div class="left-panel">
          <div style="display: flex; align-items: center">
            <img class="big-icon" src="@/assets/images/promotion/hotpromo/newplayerguide/gift.png" alt="Gift" />
            <div class="title">
              新手礼包
              <span v-if="store.token" style="font-size: 16px; font-weight: 400">
                ({{ isValidUser ? "进行中" : "已结束" }})
              </span>
            </div>
          </div>
          <div v-if="store.token">
            <span v-if="isValidUser" style="font-size: 14px; font-weight: bold; color: #15c201">
              (注册时间：{{ moment(memberRegTime).format("YYYY-MM-DD HH:mm:ss") }} 您是新用户，可参与新手活动)
            </span>
            <span v-else style="font-size: 14px; font-weight: bold; color: #ff0000">
              (注册时间：{{ moment(memberRegTime).format("YYYY-MM-DD HH:mm:ss") }} 您是老用户，不符合新手活动要求)
            </span>
          </div>
          <div v-else style="font-size: 12px; font-weight: 400; color: #00000099">您还未登录，请登录后参与活动</div>
          <div class="section">
            <div style="display: flex">
              <div style="width: 2px; margin-right: 5px; background-color: rgba(65, 185, 255, 1)"></div>
              <div class="subtitle">奖励说明</div>
            </div>
            <p>
              注册后，绑定手机号码、银行账户或 USDT 地址，并完成任意一笔存款即可立即领取新手礼包。
              每绑定一项新的信息，均可获得额外奖励！
            </p>
          </div>
          <div class="section2">
            <div style="display: flex">
              <div style="width: 2px; margin-right: 5px; background-color: rgba(65, 185, 255, 1)"></div>
              <div class="subtitle">领奖期限</div>
            </div>
            <p>自注册日起，限时第 30 日 23:59:59 前领取完毕</p>
          </div>
          <div class="steps">
            <div class="step" :class="{ incomplete: telephoneBindState === 'NO' }">
              <div class="step-number">1</div>
              <div class="step-content">
                绑定手机号
                <span
                  class="status"
                  :class="getStatus(telephoneBindState).class"
                  @click="handleClickStatusButton(telephoneBindState, '-new-user-setup-bonus-telephone')"
                >
                  <img
                    style="width: 16px; height: 16px; vertical-align: sub; margin-right: 4px"
                    src="@/assets/images/promotion/hotpromo/newplayerguide/green-check.png"
                    v-if="telephoneBindState === 'CLAIMED'"
                  />
                  {{ getStatus(telephoneBindState).text }}
                </span>
              </div>
            </div>
            <div class="step" :class="{ incomplete: bankCardBindState === 'NO' }">
              <div class="step-number">2</div>
              <div class="step-content">
                绑定银行卡
                <span
                  class="status"
                  :class="getStatus(bankCardBindState).class"
                  @click="handleClickStatusButton(bankCardBindState, '-new-user-setup-bonus-bankcard')"
                >
                  <img
                    style="width: 16px; height: 16px; vertical-align: sub; margin-right: 4px"
                    src="@/assets/images/promotion/hotpromo/newplayerguide/green-check.png"
                    v-if="bankCardBindState === 'CLAIMED'"
                  />
                  {{ getStatus(bankCardBindState).text }}
                </span>
              </div>
            </div>
            <div class="step" :class="{ incomplete: usdtAddrBindState === 'NO' }">
              <div class="step-number">3</div>
              <div class="step-content">
                绑定 USDT 地址
                <span
                  class="status"
                  :class="getStatus(usdtAddrBindState).class"
                  @click="handleClickStatusButton(usdtAddrBindState, '-new-user-setup-bonus-usdt-addr')"
                >
                  <img
                    style="width: 16px; height: 16px; vertical-align: sub; margin-right: 4px"
                    src="@/assets/images/promotion/hotpromo/newplayerguide/green-check.png"
                    v-if="usdtAddrBindState === 'CLAIMED'"
                  />
                  {{ getStatus(usdtAddrBindState).text }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-panel">
          <img src="@/assets/images/promotion/hotpromo/newplayerguide/bigGift.png" alt="Gift" />
        </div>
      </div>
      <div class="container2">
        <div class="left-panel">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex; align-items: center">
              <img class="big-icon" src="@/assets/images/promotion/hotpromo/newplayerguide/vector.png" alt="Gift" />
              <div class="title">首次提款</div>
            </div>
            <div v-if="isValidUser" class="go-btn status" :class="{ complete: firstWithdrawalState === 'CLAIMED' }">
              <div @click="handleClickStatusButton(firstWithdrawalState, '-new-user-setup-bonus-first-withdrawal')">
                <img
                  v-if="firstWithdrawalState === 'CLAIMED'"
                  style="width: 16px; height: 16px; vertical-align: sub; margin-right: 4px"
                  src="@/assets/images/promotion/hotpromo/newplayerguide/green-check.png"
                />
                <span>{{ getStatus2(firstWithdrawalState)?.text || "" }}</span>
              </div>
            </div>
            <span v-else class="status" :class="getStatus(usdtAddrBindState).class">无法领取</span>
          </div>
          <div class="section">
            <span>完成以下任务领取礼金 {{ minFirstWithdrawalBonus }} - {{ maxFirstWithdrawalBonus }} 元</span>
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
              </div>
              <div class="progress-info">
                <span>完成一次提款</span>
                <!-- <span>{{ progressText }}</span> -->
                <span>USDT/钱包提款 ≥100 元</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-panel">
          <img
            style="height: 130px"
            src="@/assets/images/promotion/hotpromo/newplayerguide/blueEnvelope.png"
            alt="Gift"
          />
        </div>
      </div>
    </div>
    <div class="option2" v-if="selected === 'option2'">
      <option2Area></option2Area>
    </div>
    <div class="container">
      <div class="left-panel">
        <div style="display: flex; align-items: center; margin-bottom: 12px">
          <img
            class="big-icon"
            src="@/assets/images/promotion/hotpromo/newplayerguide/mark.png"
            alt="Gift"
            width="32px"
          />
          <div class="title">活动规则</div>
        </div>
        <div v-if="selected === 'option1'">
          <ol class="rules-content">
            <li>
              <span class="step-number">1</span>
              <div class="content">
                自注册日起算 30
                天内任意存款一次的新会员可以领取新手礼包，此活动第一阶段包括绑定有礼和首次提款，让新手会员进行注册体验。
              </div>
            </li>
            <li>
              <span class="step-number">2</span>
              <div class="content">
                新注册会员可以进入【个人信息】-【个人资料】-【提款银行卡】完成个人信息的绑定领取新手礼包；
              </div>
            </li>
            <li>
              <span class="step-number">3</span>
              <div class="content">
                每位新用户仅可领取一次新手礼包，绑定完成后点击领取即可到账，绑定有礼彩金 5 倍水即可提款，首次提款彩金为
                2 倍流水；
              </div>
            </li>
            <li>
              <span class="step-number">4</span>
              <div class="content">完成新手礼包任务，即可进入下一阶段【新人指路】，继续进行您的游戏之旅；</div>
            </li>
            <li>
              <span class="step-number">5</span>
              <div class="content">
                此活动不与任何存款活动共享，所有存款活动要求的存款金额与本活动无关，每个账户仅限申请一次。活动奖金比例以第一笔存款金额为准；
              </div>
            </li>
            <li>
              <span class="step-number">6</span>
              <div class="content">
                每位有效玩家、每个手机号码、电子邮箱、银行卡、IP
                地址、设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利以及所产生的利润权利；
              </div>
            </li>
            <li>
              <span class="step-number">7</span>
              <div class="content">此活动最终解释权归雷火所有；</div>
            </li>
          </ol>
        </div>
        <div v-else>
          <ol class="rules-content">
            <li>
              <span class="step-number">1</span>
              <div class="content">
                自注册日起算 90 天内的新会员可以参加新手指路活动，此活动包括新人首存、成长攻略和钱包冲刺 3
                个优惠，让新手会员进行游戏体验。
              </div>
            </li>
            <li>
              <span class="step-number">2</span>
              <div class="content">
                每位新用户会员可选择各场馆参与 1
                次首存奖励，在本活动页面选择好首存场馆后，点击【点击首存】按钮跳转至存款页面后，核实优惠一栏是否是您申请的优惠按钮，确认无误后进行存款即可；
              </div>
            </li>
            <li>
              <span class="step-number">3</span>
              <div class="content">
                新人指路任务完成后点击领取即可获得，首存活动（本 + 彩）15 倍流水，成长攻略以及钱包冲刺彩金均为 5
                倍流水。
              </div>
            </li>
            <li>
              <span class="step-number">4</span>
              <div class="content">
                成长攻略与钱包冲刺活动仅计算虚拟货币与电子钱包存款，支付类型为：（ERC20，TRC20，K豆，数字人民币，EBPay，OKPay，808钱包）。
              </div>
            </li>
            <li>
              <span class="step-number">5</span>
              <div class="content">
                此活动不与任何存款活动共享，所有存款活动要求的存款金额与本活动无关，每个账户仅限申请一次。活动奖金比例以第一笔存款金额为准；
              </div>
            </li>
            <li>
              <span class="step-number">6</span>
              <div class="content">
                每位有效玩家、每个手机号码、电子邮箱、银行卡、IP
                地址、设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利以及所产生的利润权利；
              </div>
            </li>
            <li>
              <span class="step-number">7</span>
              <div class="content">此活动最终解释权归雷火所有；</div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getNewUserSetupBonusInit, putNewUserSetupBonusClaim } from "@/api/index/promo";
import option2Area from "./option2Area.vue";
import { userStore } from "@/store";
import moment from "moment";
import { useNotify } from "@/hooks/notify";
import { useLocalStorage } from "@vueuse/core";
import { ResponseCode } from "@/api/response";

const notify = useNotify();

const store = userStore();
const router = useRouter();

const selected = ref("option1");
const bankCardBindState = ref("NO");
const firstWithdrawalState = ref("NO");
const telephoneBindState = ref("NO");
const usdtAddrBindState = ref("NO");
const memberRegTime = ref(0);
const depositState = ref("NO");

const progress = ref(0);

const progressPercentage = computed(() => progress.value * 100);
const progressText = computed(() => `${progress.value}/1`);
const isValidUser = computed(
  () =>
    bankCardBindState.value !== "NOT_ELIGIBLE" &&
    firstWithdrawalState.value !== "NOT_ELIGIBLE" &&
    telephoneBindState.value !== "NOT_ELIGIBLE" &&
    usdtAddrBindState.value !== "NOT_ELIGIBLE"
);

function selectOption(option) {
  selected.value = option;
}

const getStatus = (status) => {
  var realStatus = status;
  if (status === "YES" && depositState.value === "NO") {
    realStatus = "OK";
  }

  const statusTextMap = {
    NO: {
      text: "去完成",
      class: "incomplete"
    },
    OK: {
      text: "绑定成功",
      class: "incomplete"
    },
    YES: {
      text: "点击领取",
      class: "incomplete"
    },
    CLAIMED: {
      text: "完成",
      class: "complete"
    },
    NOT_ELIGIBLE: {
      text: "无法领取",
      class: "not-eligible"
    }
  };
  return statusTextMap[realStatus];
};

const getStatus2 = (status) => {
  const statusTextMap = {
    NO: {
      text: "立即前往"
    },
    YES: {
      text: "立即领取"
    },
    CLAIMED: {
      text: "已领取"
    }
  };
  return statusTextMap[status];
};

const handleClickStatusButton = (status, promoCode) => {
  if (status === "CLAIMED") return;

  if (status === "NO") {
    // need add "gopack here"
    useLocalStorage("need-go-back-newplayer", true);
    if (promoCode === "-new-user-setup-bonus-first-withdrawal") {
      router.push({ path: "/center/withdraw" });
    } else {
      router.push({ path: "/center/personal" });
    }
  } else if (status === "YES") {
    if (promoCode !== "-new-user-setup-bonus-first-withdrawal" && depositState.value === "NO") {
      notify({
        type: "warning",
        message: "请先完成任意存款一笔即可领取。"
      });
      return;
    }

    getBonus(promoCode);
  }
};

const getBonus = async (promoCode) => {
  try {
    const apiRes = await putNewUserSetupBonusClaim(promoCode);

    if (apiRes.code === 0) {
      if (promoCode === "-new-user-setup-bonus-first-withdrawal") {
        firstWithdrawalState.value = "CLAIMED";
        progress.value = 1;
      } else if (promoCode === "-new-user-setup-bonus-telephone") {
        telephoneBindState.value = "CLAIMED";
      } else if (promoCode === "-new-user-setup-bonus-bankcard") {
        bankCardBindState.value = "CLAIMED";
      } else if (promoCode === "-new-user-setup-bonus-usdt-addr") {
        usdtAddrBindState.value = "CLAIMED";
      }

      notify({
        type: "success",
        message: `成功领取 ￥${apiRes.data}`
      });
    } else if (
      !(
        apiRes.code === ResponseCode.ERROR_USER_TOO_FAST ||
        apiRes.code === ResponseCode.ERROR_PROMO_NOT_STARTED ||
        apiRes.code === ResponseCode.ERROR_PROMO_USER_NOT_MEET_REQUIREMENT ||
        apiRes.code === ResponseCode.ERROR_PROMO_CLAIMED ||
        apiRes.code === ResponseCode.ERROR_SYSTEM
      )
    ) {
      notify({
        type: "error",
        message: apiRes.message
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const minFirstWithdrawalBonus = ref();
const maxFirstWithdrawalBonus = ref();

const getData = async () => {
  try {
    const apiRes = await getNewUserSetupBonusInit();

    depositState.value = apiRes.data.depositState;
    bankCardBindState.value = apiRes.data.bankCardBindState;
    firstWithdrawalState.value = apiRes.data.firstWithdrawalState;
    telephoneBindState.value = apiRes.data.telephoneBindState;
    usdtAddrBindState.value = apiRes.data.usdtAddrBindState;
    memberRegTime.value = apiRes.data.memberRegTime;
    minFirstWithdrawalBonus.value = apiRes.data.minFirstWithdrawalBonus;
    maxFirstWithdrawalBonus.value = apiRes.data.maxFirstWithdrawalBonus;

    progress.value = apiRes.data.firstWithdrawalState === "NO" ? 0 : 1;
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  if (!store.token) {
    return;
  }
  await getData();
});
</script>

<style scoped lang="scss">
.dark {
  .switch-wrapper {
    display: flex;
    justify-content: center;
  }
  .switch-container {
    box-shadow: 0px 2px 4.58px 0px rgba(154, 206, 255, 1) inset;

    box-shadow: 0px -1px 3.66px 0px rgba(106, 184, 255, 1) inset;

    display: flex;
    border: 1px solid rgba(154, 206, 255, 1);
    border-radius: 30px;
    overflow: hidden;
    width: 400px;
    background: transparent;
  }

  .switch-option {
    flex: 1;
    padding: 10px;
    text-align: center;
    font-size: 24px;
    white-space: nowrap;
    font-weight: 600;
    border-radius: 25px;
    cursor: pointer;
    background-color: transparent;
    color: #7a80a1;
  }

  .switch-option.active {
    background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) !important;
    color: white;
    box-shadow: 0px 8px 9px 0px #ffffff40 inset, 0px 4px 4px 0px #ffffff40 inset, 0px -4px 4px 0px #ffffff40 inset;
  }
  .go-btn {
    background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
    color: #fff;
    padding: 5px 28px;
    font-size: 16px;
    border-radius: 8px;

    &.status {
      color: #fff;
    }

    &.complete {
      border: 1px solid rgba(0, 133, 232, 1);
      background: white;
      color: rgba(0, 133, 232, 1);
    }
  }
  .container {
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    display: flex;
    border: 1px solid rgba(172, 212, 246, 1);
    border-radius: 10px;
    padding: 20px;
    align-items: flex-start;
    margin-top: 20px;
    .left-panel {
      flex: 4;
      .big-icon {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }

      .title {
        margin-top: 4px;
        color: white;
        font-weight: 600;
        font-size: 24px;
      }
    }

    .right-panel {
      flex: 3;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .container2 {
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    display: flex;
    border: 1px solid rgba(172, 212, 246, 1);
    border-radius: 10px;
    padding: 20px;
    align-items: flex-start;
    margin-top: 20px;
    .left-panel {
      flex: 2;

      .big-icon {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }

      .title {
        margin-top: 4px;
        color: white;
        font-weight: 600;
        font-size: 24px;
      }
    }

    .right-panel {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .container3 {
    background-color: #f9fbfe;
    display: flex;
    border: 1px solid rgba(172, 212, 246, 1);
    border-radius: 10px;
    padding: 20px;
    align-items: flex-start;
    margin-top: 20px;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .section {
    margin-top: 18px;
    .subtitle {
      color: rgba(65, 185, 255, 1);
      font-size: 16px;
      font-weight: 500;
    }
  }
  .section2 {
    margin-top: 12px;
    .subtitle {
      color: rgba(65, 185, 255, 1);
      font-size: 16px;
      font-weight: 500;
    }
  }

  .steps {
    margin-top: 20px;
  }

  .step {
    border: 1px solid rgba(215, 235, 255, 1);
    padding: 8px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    &.incomplete {
      background: #d7ebff;
    }
  }

  .step-number {
    width: 30px;
    height: 30px;
    background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .step-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: white;
  }

  .status {
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 14px;
    text-align: center;
    width: 100px;
    border: 1px solid rgba(0, 133, 232, 1);

    cursor: pointer;
    color: rgba(0, 133, 232, 1);

    &:hover {
      filter: brightness(0.9);
    }
  }

  .complete {
    background-color: transparent;
  }

  .incomplete {
    background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
    border: unset;
    color: #fff;
  }

  .not-eligible {
    background: #d9d9d9;
    border: none;
    color: #000;
  }

  .progress-bar-container {
    width: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .progress-bar {
    width: 100%;
    background: rgba(215, 235, 255, 1);
    border-radius: 10px;
    overflow: hidden;
    height: 10px;
    margin: 10px 0;
  }

  .progress {
    height: 100%;
    background-color: #3498db;
    border-radius: 10px 0 0 10px;
  }

  .progress-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: white;
  }
  .rules-content {
    color: white;
    padding: 0;

    .step-number {
      width: 100%;
      max-width: 20px;
      height: 20px;
      font-size: 14px;
    }

    li {
      font-family: PingFang TC;
      font-size: 18px;
      font-weight: 400;
      line-height: 28.8px;
      text-align: left;
      list-style-type: none;
      display: flex;
      margin-bottom: 4px;
    }
  }
}
.switch-wrapper {
  display: flex;
  justify-content: center;
}
.switch-container {
  box-shadow: 0px 2px 4.58px 0px rgba(154, 206, 255, 1) inset;

  box-shadow: 0px -1px 3.66px 0px rgba(106, 184, 255, 1) inset;

  display: flex;
  border: 1px solid rgba(154, 206, 255, 1);
  border-radius: 30px;
  overflow: hidden;
  width: 400px;
}

.switch-option {
  flex: 1;
  padding: 10px;
  text-align: center;
  font-size: 24px;
  white-space: nowrap;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  background-color: transparent;
  color: #7a80a1;
}

.switch-option.active {
  background: linear-gradient(180deg, rgba(253, 137, 126, 0) 0%, rgba(253, 49, 38, 0) 100%),
    linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
  color: white;
}
.go-btn {
  background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
  color: #fff;
  padding: 5px 28px;
  font-size: 16px;
  border-radius: 8px;

  &.status {
    color: #fff;
  }

  &.complete {
    border: 1px solid rgba(0, 133, 232, 1);
    background: white;
    color: rgba(0, 133, 232, 1);
  }
}
.container {
  background-color: #f9fbfe;
  display: flex;
  border: 1px solid rgba(172, 212, 246, 1);
  border-radius: 10px;
  padding: 20px;
  align-items: flex-start;
  margin-top: 20px;
  .left-panel {
    flex: 4;
    .big-icon {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    .title {
      margin-top: 4px;
      color: #000;
      font-weight: 600;
      font-size: 24px;
    }
  }

  .right-panel {
    flex: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.container2 {
  background-color: #f9fbfe;
  display: flex;
  border: 1px solid rgba(172, 212, 246, 1);
  border-radius: 10px;
  padding: 20px;
  align-items: flex-start;
  margin-top: 20px;
  .left-panel {
    flex: 2;

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

  .right-panel {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.container3 {
  background-color: #f9fbfe;
  display: flex;
  border: 1px solid rgba(172, 212, 246, 1);
  border-radius: 10px;
  padding: 20px;
  align-items: flex-start;
  margin-top: 20px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.section {
  margin-top: 18px;
  .subtitle {
    color: rgba(65, 185, 255, 1);
    font-size: 16px;
    font-weight: 500;
  }
}
.section2 {
  margin-top: 12px;
  .subtitle {
    color: rgba(65, 185, 255, 1);
    font-size: 16px;
    font-weight: 500;
  }
}

.steps {
  margin-top: 20px;
}

.step {
  border: 1px solid rgba(215, 235, 255, 1);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  &.incomplete {
    background: #d7ebff;
  }
}

.step-number {
  width: 30px;
  height: 30px;
  background: linear-gradient(90deg, #89d3ff 8.15%, #0085e8 92.42%);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

.step-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: black;
}

.status {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  width: 100px;
  border: 1px solid rgba(0, 133, 232, 1);

  cursor: pointer;
  color: rgba(0, 133, 232, 1);

  &:hover {
    filter: brightness(0.9);
  }
}

.complete {
  background-color: #fff;
}

.incomplete {
  background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
  border: unset;
  color: #fff;
}

.not-eligible {
  background: #d9d9d9;
  border: none;
  color: #000;
}

.progress-bar-container {
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-bar {
  width: 100%;
  background: rgba(215, 235, 255, 1);
  border-radius: 10px;
  overflow: hidden;
  height: 10px;
  margin: 10px 0;
}

.progress {
  height: 100%;
  background-color: #3498db;
  border-radius: 10px 0 0 10px;
}

.progress-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
}
.rules-content {
  color: #000;
  padding: 0;

  .step-number {
    width: 100%;
    max-width: 20px;
    height: 20px;
    font-size: 14px;
  }

  li {
    font-family: PingFang TC;
    font-size: 18px;
    font-weight: 400;
    line-height: 28.8px;
    text-align: left;
    list-style-type: none;
    display: flex;
    margin-bottom: 4px;
  }
}
</style>
