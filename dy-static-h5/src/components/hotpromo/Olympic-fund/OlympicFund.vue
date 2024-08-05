<template>
  <div class="olympic-fund-wrapper">
    <div class="switch-wrapper">
      <div class="switch-container">
        <div :class="['switch-option', { active: selected === 'gift' }]" @click="selectOption('gift')">助力金</div>
        <div :class="['switch-option', { active: selected === 'guide' }]" @click="selectOption('guide')">突破奖</div>
      </div>
    </div>

    <div class="olympic-fund-block bonus-block">
      <div class="olympic-fund-block-title">
        <img src="./img/gift.svg" />
        <span v-if="isGiftSelected">助力金</span>
        <span v-else>突破奖</span>
      </div>

      <div class="description-block-event-content">
        <div class="description-block-event-content-title">活动日期</div>
        <span>2024年7月25日—2024年8月11日</span>
      </div>

      <div class="bonus-block-content">
        <img v-if="isGiftSelected" src="./img/deposit.svg" />
        <img v-else src="./img/switch.svg" />
        <span class="detail-block-content__label">
          {{ isGiftSelected ? "当日首存金额：" : "昨日有效流水：" }}
        </span>
        <span v-if="isGiftSelected" class="detail-block-content__suffix">
          {{ depositData.todayFirstDepositAmount }}元
        </span>
        <span v-else class="detail-block-content__suffix">{{ depositData.ytdSportBetAmount }}元</span>
      </div>

      <div class="bonus-block-content">
        <img src="./img/fund.svg" />
        <span class="detail-block-content__label">
          {{ isGiftSelected ? "可领助力金：" : "可领突破奖：" }}
        </span>
        <span v-if="isGiftSelected" class="detail-block-content__suffix">{{ depositData.helpBonus }}元</span>
        <span v-else class="detail-block-content__suffix">{{ depositData.breakthroughBonus }}元</span>
      </div>
      <div class="bonus-block-btn-wrapper" :class="selected">
        <div class="bonus-block-btn" @click="handleClick"></div>
      </div>
    </div>

    <div class="olympic-fund-block description-block">
      <div class="olympic-fund-block-title-ol">
        <!-- <img src="./img/exclamation.svg" />
        <span>活动说明</span> -->
        <img src="./img/info-title.png" />
      </div>
      <div class="description-block-event-content" v-if="isGiftSelected">
        <div class="description-block-event-content-title">活动会员</div>
        <span>VIP1及以上会员</span>
      </div>

      <div class="table-wrapper">
        <table v-if="isGiftSelected">
          <thead>
            <tr>
              <th>当日首存金额</th>
              <th>首存助力金</th>
              <th>流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥500</td>
              <td>8</td>
              <td rowspan="5">3倍/不限场馆</td>
            </tr>
            <tr>
              <td>≥3,000</td>
              <td>28</td>
            </tr>
            <tr>
              <td>≥8,000</td>
              <td>108</td>
            </tr>
            <tr>
              <td>≥20,000</td>
              <td>288</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>588</td>
            </tr>
          </tbody>
        </table>
        <table v-else>
          <thead>
            <tr>
              <th>日有效流水（仅限体育场馆）</th>
              <th>突破奖</th>
              <th>进阶奖</th>
              <th>彩金流水</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td width="15">≥38,888</td>
              <td width="15">88</td>
              <td width="60">日有效流水达成后每超过1万打码将获得28元进阶奖金</td>
              <td width="15">3倍/不限场馆</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="olympic-fund-block rule-block">
      <div class="olympic-fund-block-title-ol">
        <!-- <img src="./img/exclamation.svg" />
        <span>活动规则</span> -->
        <img src="./img/rule-title.png" />
      </div>
      <ol v-if="isGiftSelected" class="rules-content">
        <li>活动期间，每日的第一笔存款（存款≥500元）即可前往活动页面领取日首存助力金，首次存款金额越高助力金越高；</li>
        <li>本活动不予其他存款活动共享，每日仅可领取一次，彩金实时到账， 不限场馆，三倍流水即可提款；</li>
        <li>
          本活动需完善信息后即可点击参与，同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可使用一个账号参与，若有违规者，将不享受此活动红利；
        </li>
        <li>
          任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
        </li>
        <li>为避免文字理解差异，本站保留本活动最终解释权；</li>
      </ol>
      <ol v-else class="rules-content">
        <li>
          活动期间，每日有效流水≥38,888，次日即可前往活动页面领取突破奖，超额完成可获得进阶奖励；彩金不限场馆，三倍流水即可提款；
        </li>
        <li>
          <!-- eslint-disable-next-line vue/no-parsing-error -->
          本活动仅计算体育场馆的有效投注，流水赔率要求：亚洲盘赔率 < 0.70、欧洲盘 < 1.70、美洲盘 ≤ -133、马来盘 ≤ 0.70
          且 > 0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；
        </li>
        <li>本活动有效投注额以结算时间为准，仅对已结算并产生输赢结果的投注额进行计算；</li>
        <li>
          本活动需完善信息后即可点击参与，同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可使用一个账号参与，若有违规者，将不享受此活动红利；
        </li>
        <li>
          任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
        </li>
        <li>为避免文字理解差异，本站保留本活动最终解释权；</li>
      </ol>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { eventapi } from "src/boot/axios";
import { userStore } from "../../../stores/index";
import { useRouter } from "vue-router";
const router = useRouter();

const store = userStore();

const $q = useQuasar();

const selected = ref("gift");
const depositData = ref({
  todayFirstDepositAmount: 0,
  helpBonus: 0,
  ytdSportBetAmount: 0,
  breakthroughBonus: 0
});

const isGiftSelected = computed(() => selected.value === "gift");

const selectOption = (value) => (selected.value = value);

const claimOlympicFirstDeposit = () => {
  return eventapi.put("/lhOlympicDailyFirstDeposit/claim");
};

const claimOlympicDailySportBet = () => {
  return eventapi.put("/lhOlympicDailySportBet/claim");
};

const handleClick = () => {
  if (!store.token) {
    $q.dialog({
        class: "q-px-md q-pt-md",
        title: "系统提示",
        message: "请登录后再操作",
        ok: {
          push: true,
          color: 'dyblue',
          label: "去登录",
          tabindex: 1
        },
        cancel: {
          push: true,
          color: 'warning',
          label: "取消",
          tabindex: 0
        },
        persistent: true,
      }).onOk(() => {
        router.push('/login');
      })
      return
  }
  const api = isGiftSelected.value ? claimOlympicFirstDeposit : claimOlympicDailySportBet;
  api().then((res) => {
    if (res.code === 0) {
      $q.notify({
        color: "positive",
        position: "top",
        message: "领取成功",
        icon: "check_circle_outline"
      });
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });
    }
  });
};

onMounted(() => {
  if (!store.token) {
    return;
  }
  eventapi.get("/lhOlympicDailyFirstDeposit/init").then((res) => {
    if (res.code === 0) {
      const { todayFirstDepositAmount, claimableAmount } = res.data;
      depositData.value.todayFirstDepositAmount = todayFirstDepositAmount;
      depositData.value.helpBonus = claimableAmount;
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });
    }
  });
  eventapi.get("/lhOlympicDailySportBet/init").then((res) => {
    if (res.code === 0) {
      const { claimableAmount, ytdSportBetAmount } = res.data;
      depositData.value.ytdSportBetAmount = ytdSportBetAmount;
      depositData.value.breakthroughBonus = claimableAmount;
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });
    }
  });
});
</script>
<style lang="scss">
.olympic-fund-wrapper {
  color: #000;
  > :not(:last-child) {
    margin-bottom: 12px;
  }

  img {
    margin-bottom: 0 !important;
  }

  .olympic-fund-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: #f2f8fe;
    border: 1px solid #acd4f6;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    .olympic-fund-block-title {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.375rem;
      &-ol {
        display: flex;
        align-items: center;
        img {
          width: 100%;
          margin: 0 auto;
        }
      }
      img {
        max-width: 20px;
      }
    }
  }
}

.bonus-block {
  background: url(./img/block-bg.png) no-repeat;
  background-size: cover;
  .bonus-block-content {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #acd4f6;
    font-size: 0.75rem;
    line-height: 1.125rem;

    img {
      max-width: 16px;
      margin-right: 10px;
    }

    .detail-block-content__label {
      flex-grow: 1;
    }

    .detail-block-content__suffix {
      font-weight: 600;
      color: #0092ff;
    }
  }
  .bonus-block-btn-wrapper {
    position: relative;
    align-self: center;
    width: 284px;
    background: url(./img/gift-button-bg.png) no-repeat;
    background-size: contain;
    aspect-ratio: 284 / 184;
    margin-bottom: 8px;
    min-height: 200px;

    &.guide {
      background-image: url(./img/guide-button-bg.png);
    }
    .bonus-block-btn {
      position: absolute;
      bottom: 10px;
      // left: 90px;
      left: 20px;
      right: 0;
      margin: auto;
      background: url(./img/button.png) no-repeat;
      border: none;
      width: 109px;
      aspect-ratio: 109 / 43;
      background-size: contain;
      &:hover {
        filter: brightness(1.2);
      }
    }
  }
}

.description-block-event-content {
  display: flex;
  align-items: center;
  gap: 12px;

  .description-block-event-content-title {
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    padding: 3px 28px;
    clip-path: polygon(0 50%, 12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%);
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1.125rem;
    color: #fff;
  }

  span {
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1rem;
  }
}

.rule-block {
  .rules-content {
    color: #000;
    padding: 0;
    counter-reset: list-counter;
    padding: 0 !important;
    padding-bottom: 0 !important;

    li {
      display: flex;
      counter-increment: list-counter;
      margin-bottom: 0 !important;
      list-style-type: none;
      font-weight: 400;
      font-size: 0.75rem;
      line-height: 1.125rem;
      &::before {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        content: counter(list-counter);
        width: 16px;
        height: 16px;
        margin-right: 10px;
        background: linear-gradient(90deg, #89d3ff 8.15%, #0085e8 92.42%);
        border-radius: 50%;
        font-family: Play;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1.125rem;
        color: white;
      }
    }
  }
}

.switch-wrapper {
  display: flex;
  justify-content: center;
  .switch-container {
    display: flex;
    background-color: $white;
    border: 1px solid rgba(154, 206, 255, 1);
    border-radius: 30px;
    overflow: hidden;
    width: 400px;
    box-shadow: 0px 2px 4.58px 0px rgba(154, 206, 255, 1) inset, 0px -1px 3.66px 0px rgba(106, 184, 255, 1) inset;
    .switch-option {
      flex: 1;
      padding: 10px;
      text-align: center;
      font-size: 0.875rem;
      white-space: nowrap;
      font-weight: 600;
      border-radius: 25px;
      cursor: pointer;
      background-color: transparent;
      color: #7a80a1;
      &.active {
        background: linear-gradient(180deg, rgba(253, 137, 126, 0) 0%, rgba(253, 49, 38, 0) 100%),
          linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
        color: white;
      }
    }
  }
}
.promo-container .selected-promo .selected-promo-wrapper .inner .table-wrapper table th {
  white-space: pre-wrap;
}
.table-wrapper {
  border: 1px solid #acd4f6;
  border-radius: 10px;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #acd4f6;
    padding: 10px;
    text-align: center;
  }

  thead {
    color: white;
  }
  thead th {
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    border: none;
  }

  tbody tr {
    > :first-child {
      border-left: none;
    }
    > :last-child {
      border-right: none;
    }
    &:last-child {
      td {
        border-bottom: none;
      }
    }
  }
}
</style>
