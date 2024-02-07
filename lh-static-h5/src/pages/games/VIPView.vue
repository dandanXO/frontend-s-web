<template>
  <div class="vip-container">
    <q-carousel
      v-model="slide"
      transition-next="slide-left"
      transition-prev="slide-right"
      swipeable
      animated
      padding
      arrows
      infinite
      control-color="black"
      class="bg-transparent"
    >
      <q-carousel-slide
        v-for="(vip, vipIndex) in vipItems"
        :key="`${vip}-${vipIndex}`"
        :name="vipIndex"
        class="column no-wrap flex-center"
      >
        <div class="vip-card-container">
          <img class="card-img" :src="require(`../../assets/images/vip/vip${vip.level}.png`)" alt="" />
          <div class="status">
            <img
              :src="
                require(`../../assets/images/vip/status-${vip.progressBarVal === 0 ? 'achieved' : 'inachieved'}.png`)
              "
              alt=""
            />
            <span class="vip-card-common-text">{{ vip.progressBarVal === 0 ? "已达到" : "未达到" }}</span>
          </div>
          <div class="vip-card-info">
            <div class="level">
              <div class="vip-level">VIP{{ vipIndex + 1 }}</div>
              <div class="vip-card-common-text">{{ vip.title }}</div>
            </div>
            <div class="amount">
              <div class="vip-card-common-text">累计存款：</div>
              <div class="vip-card-common-text amount-text">{{ vip.amount }}</div>
            </div>
            <div class="progress">
              <q-linear-progress
                reverse
                rounded
                size="5px"
                :value="vip.progressBarVal"
                class="progress-bar"
              ></q-linear-progress>
              <div class="start-end">
                <div class="vip-card-common-text">V{{ vipIndex }}</div>
                <div class="vip-card-common-text">V{{ vipIndex + 1 }}</div>
              </div>
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>

    <q-card class="level-promo-container">
      <q-card-section class="level-promo-header">
        <div class="level-promo-title">等级优惠</div>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-section class="level-promo-body">
        <div class="promo">
          <div class="common-text">{{ `VIP${claimDesc.vip}优惠` }}</div>
          <div class="common-text">{{ claimDesc.benefit }}</div>
        </div>
        <div class="turnover">
          <div class="common-text">流水要求</div>
          <div class="common-text">{{ claimDesc.turnover }}</div>
        </div>

        <div class="claim-btn-container" :class="vipRedeemData > 0 ? '' : 'disabled'" @click="claim()">
          <img class="claim-btn" src="../../assets/images/vip/claim-btn.png" alt="" />
          <span class="common-text">{{ vipRedeemData > 0 ? "立即领取" : "待领取" }}</span>
        </div>
      </q-card-section>
    </q-card>

    <div class="vip-detail-container">
      <!-- cannot flip cuz the border design will be upside down -->
      <q-tabs v-model="tab" dense align="center" narrow-indicator active-class="active-tab" class="vip-detail-tab">
        <q-tab name="rules" :ripple="false">
          <div class="vip-rules-btn-container">
            <img
              class="vip-rules-btn"
              :src="require(`../../assets/images/vip/left-vip-${tab === 'rules' ? 'active' : 'inactive'}-btn.png`)"
              alt=""
            />
            <span class="common-text">升级规则</span>
          </div>
        </q-tab>
        <q-tab name="privileges" :ripple="false">
          <div class="vip-privileges-btn-container">
            <img
              class="vip-privileges-btn"
              :src="
                require(`../../assets/images/vip/right-vip-${tab === 'privileges' ? 'active' : 'inactive'}-btn.png`)
              "
              alt=""
            />
            <span class="common-text">VIP特权</span>
          </div>
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="tab" class="rules-content">
        <q-tab-panel name="rules">
          <q-table
            flat
            :hide-pagination="true"
            :columns="columns"
            :rows="rows"
            row-key="name"
            :rows-per-page-options="[0]"
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th
                  v-for="(col, colIndex) in props.cols"
                  :key="col.name"
                  :props="props"
                  :colspan="`${colIndex === 0 ? 3 : 1}`"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  v-if="props.row.threshold"
                  auto-width
                  :rowspan="props.row.rowspan"
                  class="common-text text-center"
                >
                  {{ props.row.threshold }}
                </q-td>

                <q-td
                  v-for="(col, colIndex) in props.cols"
                  :key="col.name"
                  :props="props"
                  :colspan="`${colIndex === 0 ? 2 : 1}`"
                  class="common-text"
                >
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="privileges">
          <q-table
            flat
            :hide-pagination="true"
            :columns="columns2"
            :rows="rows2"
            row-key="name"
            :rows-per-page-options="[0]"
          ></q-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div class="tnc-container">
      <div class="tnc-title">
        <img class="tnc-img" src="../../assets/images/vip/title-bg.png" alt="" />
        <span class="common-text">规则与条款</span>
      </div>

      <div class="tnc-note">
        <ul class="common-text">
          <li>
            所有雷火电竞会员存款达到一定额度即可享受特定免费奖金、存款奖金或其他奖励相应的VIP等级要求。
            要存款和接收奖金，您只需完成（存款+奖金）*相应的成交倍数即可提款。
          </li>
          <li>满足相应等级要求的会员可点击“待领取”领取免费奖金 或存款并选择相应的存款折扣。</li>
          <li>每个级别对应的折扣所需的流水是不同的。 会员需满足相应的流水 方可申请提款。</li>
          <li>
            此促销活动仅适用于拥有独立帐户的玩家。 地址、电子邮件地址、
            电话号码、付款方式（相同的借记卡/信用卡/银行帐号） IP
            地址、相同网络环境等将作为判断是否独立的条件。对于任何被发现有违反、欺骗、利用规则行为的会员以及赚取非法利润的条款，雷火电竞保留停止或取消福利的权利或随时索回所有已支付的福利。
          </li>
          <li>
            若某些未知因素超出可控范围，雷火电竞保留单方面作出决定的权利
            发生此类紧急问题时向客户解释原因并听取客户意见的决定和承诺 反馈并与客户沟通协商解决。
          </li>
          <li>雷火电竞保留对本次活动的修改、终止和最终解释权。 雷火电竞 对本网站无法控制的技术错误不承担任何责任。</li>
          <li>雷火电竞有权延长、缩短、终止、修改本次活动！ 最终解释权 本次赛事归属雷火电竞所有。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";

var qs = require("qs");
const $q = useQuasar();
const store = userStore();

const tab = ref("rules");

const slide = ref(0);
const vipItems = ref([
  { level: "1", title: "青铜2", amount: "一笔存款" },
  {
    level: "1",
    title: "青铜1",
    amount: "3,000"
  },
  {
    level: "2",
    title: "白银3",
    amount: "30,000"
  },
  { level: "2", title: "白银2", amount: "80,000" },
  { level: "3", title: "白银1", amount: "200,000" },
  { level: "3", title: "黄金3", amount: "400,000" },
  { level: "4", title: "黄金2", amount: "600,000" },
  { level: "4", title: "黄金1", amount: "1,000,000" },
  { level: "5", title: "铂金2", amount: "2,000,000" },
  { level: "5", title: "铂金1", amount: "4,000,000" },
  { level: "6", title: "钻石", amount: "8,000,000" },
  { level: "7", title: "王者", amount: "12,000,000" }
]);

const vipClaimItems = [
  { benefit: "网站首存优惠", turnover: "无" },
  { benefit: "存款最少20元可申请一次晋级奖金88元", turnover: "电竞/体育10倍 老虎机12倍 真人18倍" },
  { benefit: "存款最少100元可申请一次再存20% 最高奖金1888元", turnover: "电竞/体育15倍 老虎机12倍 真人18倍" },
  { benefit: "未符合", turnover: "未符合" },
  { benefit: "未符合", turnover: "未符合" },
  { benefit: "未符合", turnover: "未符合" },
  { benefit: "未符合", turnover: "未符合" },
  { benefit: "未符合", turnover: "未符合" },
  { benefit: "未符合", turnover: "未符合" },
  { benefit: "未符合", turnover: "未符合" },
  { benefit: "未符合", turnover: "未符合" },
  { benefit: "未符合", turnover: "未符合" }
];

const claimDesc = ref();
const currentAmount = 100000;
for (let i = 0, l = vipItems.value.length; i < l; i++) {
  const vipItem = vipItems.value[i];
  let _amount = vipItem.amount.replaceAll(",", "");

  const maxReversedVal = 1 - 1;
  if (i === 0) {
    vipItem.progressBarVal = maxReversedVal;
  } else {
    const progressBarVal = currentAmount / _amount;
    if (progressBarVal >= 1) {
      vipItem.progressBarVal = maxReversedVal;
    } else {
      vipItem.progressBarVal = 1 - progressBarVal;
      if (!claimDesc.value) {
        vipClaimItems[i].vip = i;
        claimDesc.value = vipClaimItems[i];
      }
    }
  }
}

const columns = [
  {
    name: "level",
    required: true,
    label: "等级",
    align: "center",
    field: (row) => row.name
  },
  { name: "amount", label: "升级要求累计存款", field: "amount", align: "center" }
];
const rows = [
  {
    name: "青铜 II",
    amount: "一笔存款",
    threshold: "青铜",
    rowspan: "2"
  },
  {
    name: "青铜 I",
    amount: "3,000"
  },
  {
    name: "白银 III",
    amount: "30,000",
    threshold: "白银",
    rowspan: "3"
  },
  {
    name: "白银 II",
    amount: "80,000"
  },
  {
    name: "白银 I",
    amount: "200,000"
  },
  {
    name: "黄金 III",
    amount: "400,000",
    threshold: "黄金",
    rowspan: "3"
  },
  {
    name: "黄金 II",
    amount: "600,000"
  },
  {
    name: "黄金 I",
    amount: "1,000,000"
  },
  {
    name: "铂金 II",
    amount: "2,000,000",
    threshold: "铂金",
    rowspan: "2"
  },
  {
    name: "铂金 I",
    amount: "4,000,000"
  },
  {
    name: "钻石",
    amount: "8,000,000",
    threshold: "钻石",
    rowspan: "1"
  },
  {
    name: "王者",
    amount: "12,000,000",
    threshold: "最强王者",
    rowspan: "1"
  }
];

const columns2 = [
  {
    name: "level",
    required: true,
    label: "等级",
    align: "center",
    field: (row) => row.name
  },
  { name: "bronze", label: "青铜", field: "bronze", align: "center" },
  { name: "silver", label: "白银", field: "silver", align: "center" },
  { name: "gold", label: "黄金", field: "gold", align: "center" },
  { name: "platinum", label: "铂金", field: "platinum", align: "center" },
  { name: "diamond", label: "钻石", field: "diamond", align: "center" },
  { name: "rank", label: "最强王者", field: "rank", align: "center" },
  { name: "limit", label: "反水限额", field: "limit", align: "center" }
];
const rows2 = [
  {
    name: "电竞",
    bronze: "0.4%",
    silver: "0.45%",
    gold: "0.5%",
    platinum: "0.55%",
    diamond: "0.6%",
    rank: "0.8%",
    limit: "无上限"
  },
  {
    name: "体育",
    bronze: "0.4%",
    silver: "0.45%",
    gold: "0.5%",
    platinum: "0.55%",
    diamond: "0.6%",
    rank: "0.8%",
    limit: "无上限"
  },
  {
    name: "真人",
    bronze: "0.4%",
    silver: "0.45%",
    gold: "0.5%",
    platinum: "0.55%",
    diamond: "0.6%",
    rank: "0.8%",
    limit: "88888元"
  },
  {
    name: "棋牌",
    bronze: "0.4%",
    silver: "0.45%",
    gold: "0.5%",
    platinum: "0.6%",
    diamond: "0.8%",
    rank: "1.0%",
    limit: "8888元"
  },
  {
    name: "老虎机",
    bronze: "0.6%",
    silver: "0.8%",
    gold: "1.0%",
    platinum: "1.2%",
    diamond: "1.6%",
    rank: "2.0%",
    limit: "无上限"
  }
];

const vipRedeemData = ref();

const checkVipRedeem = () => {
  eventapi.get("/vip-upgrade/lh/canRedeem").then((res) => {
    if (res.code === 0) {
      vipRedeemData.value = res.data;
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

const vipNumber = ref(null);
const extractNumber = (str) => {
  const match = str.match(/\d+/);
  vipNumber.value = match ? parseInt(match[0], 10) : null;
};

const claim = async () => {
  extractNumber(store.vip);

  try {
    const res = await eventapi.post("/vip-upgrade/lh/claim", qs.stringify({ vipLevel: vipNumber.value }));
    if (res.code === 0) {
      $q.notify({
        color: "positive",
        position: "top",
        message: "领取成功",
        icon: "report_problem"
      });

      checkVipRedeem();
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });
    }
  } catch (error) {
    console.error("Error in VIP claim:", error);
  }
};

onMounted(() => {
  checkVipRedeem();
});
</script>

<style lang="scss">
.vip-container {
  padding: 1.5rem;
  background: $secondary;

  .q-carousel {
    height: unset;
  }

  .q-carousel__prev-arrow--horizontal {
    left: 0;
  }
  .q-carousel__next-arrow--horizontal {
    right: 0;
  }

  .q-panel {
    overflow: hidden;
  }

  .vip-card-container {
    position: relative;

    .card-img {
      width: 67.5vw;
    }

    .status {
      position: absolute;
      left: 0;
      top: 13%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 17vw;
      }

      span {
        position: absolute;
        color: white;
      }
    }

    .vip-card-info {
      position: absolute;
      left: 10%;
      top: 35%;

      .level {
        display: flex;
        align-items: center;
        gap: 1.5vw;

        .vip-level {
          //   font-size: 2.85rem;
          font-size: 8vw;
          font-weight: 700;
          line-height: 1;
        }
      }

      .amount {
        display: flex;
        gap: 3.5vw;

        .amount-text {
          color: $accent;
        }
      }

      .progress {
        margin: 2.5vw 0 0 0;
        width: 42.5vw;
        // width: 15rem;

        .progress-bar {
          background: linear-gradient(90deg, #e5cda5 0.87%, #b48f57 100%);
          color: #ccc;
        }

        .start-end {
          display: flex;
          justify-content: space-between;
          margin: 0px -0.5rem;

          div {
            color: $dark;
          }
        }
      }
    }
  }

  .level-promo-container {
    border-radius: 1.25rem;
    background: #fcfdfe;
    box-shadow: 0px -4px 8px 0px #c3d4e6 inset, 0px 4px 0px 0px #a7c2dd;

    .level-promo-header {
      background: $lightblue;

      .level-promo-title {
        font-size: 1.15rem;
        font-weight: 600;
        color: $accent;
        text-align: center;
        padding: 0.75rem 0;
      }
    }

    .level-promo-body {
      padding: 1rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .promo,
      .turnover {
        display: flex;
        gap: 2.5rem;
      }
    }

    .claim-btn-container {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1.145rem;

      .disabled {
        opacity: 0.6;
        filter: grayscale(0.6);
      }

      .claim-btn {
        width: 15rem;
        height: 2.5rem;
      }

      span {
        position: absolute;
        color: white;
      }
    }
  }

  .vip-detail-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .vip-detail-tab {
      margin: 2rem 0 1rem 0;
    }

    .q-tab {
      padding: 0;
    }

    .q-tab--active .q-tab__indicator {
      opacity: 0;
      background: transparent;
    }

    .q-tab-panel {
      padding: 0;
    }

    .active-tab {
      span {
        color: white;
      }
    }

    .vip-rules-btn-container,
    .vip-privileges-btn-container {
      display: flex;
      align-items: center;
      justify-content: center;

      .vip-rules-btn,
      .vip-privileges-btn {
        width: 100%;
        height: 2.5rem;
      }

      span {
        position: absolute;
      }
    }

    .rules-content {
      width: 100%;
      border-radius: 1.25rem;
      background: #fcfdfe;
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 1px 0px #a7c2dd;

      thead {
        th {
          font-size: 1.15rem;
          font-weight: 600;
          color: $font-2;
          border-bottom-width: 0;
        }
      }
      thead > :first-child {
        background: $lightblue;
      }

      td:not(:last-child) {
        border-right-width: 1px;
      }
    }
  }

  .tnc-container {
    .tnc-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2rem 0 1rem 0;

      .tnc-img {
        width: 95%;
      }

      span {
        position: absolute;
        color: white;
      }
    }

    .tnc-note {
      padding: 1rem 2rem;
      border-radius: 1.25rem;
      background: #fcfdfe;
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 1px 0px #a7c2dd;

      ul {
        list-style-type: decimal;
        padding-inline-start: 0;

        li {
          font-size: 0.85rem;
          margin: 1rem 0;
        }
      }
    }
  }

  .q-icon {
    font-size: 7vw;
    border-radius: 5.5rem;
    background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
    box-shadow: 0px 4.58px 4.58px 0px #bbdcff inset, 0px -3.664px 3.664px 0px #a2bff4 inset;
  }

  .common-text {
    font-size: 1rem;
    font-weight: 400;
    color: $font-1;
  }

  .vip-card-common-text {
    font-size: 3vw;
    font-weight: 400;
    color: $font-1;
  }
}

@media (min-width: 551px) {
  .vip-container {
    .vip-card-container {
      .card-img {
        width: 100%;
      }

      .status {
        img {
          width: 6rem;
        }

        span {
          position: absolute;
          color: white;
        }
      }

      .vip-card-info {
        .level {
          gap: 0.5rem;
          .vip-level {
            font-size: 2.85rem;
          }
        }

        .amount {
          gap: 1.5rem;
        }

        .progress {
          margin: 1rem 0 0 0;
          width: 15rem;
        }
      }
    }

    .q-icon {
      font-size: 2.5rem;
    }

    .vip-card-common-text {
      font-size: 1rem;
    }
  }
}
</style>
