<template>
  <!-- <pre>vv{{vipItems}}</pre> -->
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
          <div class="card-img-wrap">
            <img loading="lazy" class="card-img" :src="require(`../../assets/images/vip/vip${vip.level}.png`)" alt="" />
          </div>

          <div class="status">
            <img
              loading="lazy"
              :src="
                require(`../../assets/images/vip/status-${
                  vip.progressBarVal === 100 || vipLevel >= vip.level ? 'achieved' : 'inachieved'
                }.png`)
              "
              alt=""
            />
            <span class="vip-card-common-text">
              {{ vip.progressBarVal === 100 || vipLevel >= vip.level ? "已达到" : "未达到" }}
            </span>
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
                instant-feedback
              ></q-linear-progress>
              <div class="start-end">
                <div class="vip-card-common-text">V{{ vipIndex }}</div>
                <div class="vip-card-current-num" v-if="vipLevel === vipIndex">{{ currentDeposit }}</div>
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
          <div class="common-text">{{ `VIP${claimDesc.vip + 1}优惠` }}</div>
          <div class="common-text">{{ claimDesc.benefit }}</div>
        </div>
        <div class="turnover">
          <div class="common-text">流水要求</div>
          <div class="common-text">{{ claimDesc.turnover }}（不包含彩票场馆）</div>
        </div>
        <div
          class="claim-btn-container"
          @click="claimDesc.availableBtn ? claim() : null"
          v-if="claimDesc.availableBtn || claimDesc.claimedBtn"
          :class="claimDesc.claimedBtn ? 'status-claimed' : ''"
        >
          <img loading="lazy" class="claim-btn" src="../../assets/images/vip/claim-btn.png" alt="" />
          <span class="common-text">
            {{ claimDesc.claimedBtn ? "已领取" : "立即领取" }}
          </span>
        </div>
        <!-- depositPromoBtn -->
        <div
          class="claim-btn-container"
          @click="router.push('/finance/deposit?from=vip')"
          v-if="claimDesc.depositPromoBtn"
        >
          <img loading="lazy" class="claim-btn" src="../../assets/images/vip/claim-btn.png" alt="" />
          <span class="common-text">前往存款</span>
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
              :src="require(`../../assets/images/vip/left-vip-${tab === 'rules' ? 'active' : 'inactive'}-btn${$q.dark.isActive ? '-dark' :''}.png`)"
              alt=""
            />
            <span class="common-text">升级规则</span>
          </div>
        </q-tab>
        <q-tab name="privileges" :ripple="false">
          <div class="vip-privileges-btn-container">
            <img
              loading="lazy"
              class="vip-privileges-btn"
              :src="
                require(`../../assets/images/vip/right-vip-${tab === 'privileges' ? 'active' : 'inactive'}-btn${$q.dark.isActive ? '-dark' :''}.png`)
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

    <div class="tnc-container" v-if="tab === 'rules'">
      <div class="tnc-title">
        <img loading="lazy" v-if="$q.dark.isActive" class="tnc-img" src="../../assets/images/vip/title-bg-dark.png" alt="" />
        <img loading="lazy" v-else class="tnc-img" src="../../assets/images/vip/title-bg.png" alt="" />
        <span class="common-text">规则与条款</span>
      </div>

      <div class="tnc-note">
        <ul class="common-text">
          <li>
            所有雷火电竞会员存款达到相应VIP等级要求即可享有特定免费奖金、存送奖金或其他奖励，存送奖金只需完成（存款+奖金）*相应流水倍数即可提款。
          </li>
          <li>达到相应等级要求的会员可以点击"待领取"，领取免费奖金或存款选择相对应的存送优惠即可。</li>
          <li>各等级所对应的优惠所要求的流水有所不同，会员需要达到相应流水方可申请提款。</li>
          <li>
            此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址﹑电话号码﹑支付方式（相同借记卡/信用卡/银行账户号码）IP地址，同一网络环境等将可以作为判定是否独立玩家的条件。对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
          </li>
          <li>
            在某些未知因素超出可控范围的情况下，雷火电竞保留可单方面执行的决定权，并承诺会在这类紧急问题发生时解释给客户原因并听取客户反馈与客户沟通协商解决。
          </li>
          <li>
            雷火电竞保留对本次活动的修订、终止和最终解释权，超出本网站控制外的技术错误，雷火电竞将不承担任何责任。
          </li>
          <li>雷火电竞有权延长，缩短，终止，或者修改此活动！此活动最终解释权归雷火电竞所有。</li>
        </ul>
      </div>
    </div>
    <div class="tnc-container" v-else>
      <div class="tnc-title">
        <img loading="lazy" class="tnc-img" src="../../assets/images/vip/title-bg.png" alt="" />
        <span class="common-text">规则与条款</span>
      </div>

      <div class="tnc-note">
        <ul class="common-text">
          <li>
            返水奖金根据北京时间每天00:00:00-23:59:59之间的有效投注额进行计算，所有游戏场馆投注额都是按照北京时间计算，返水彩金无需申请，系统会在次日下午14:00派发到您的主账户；
          </li>
          <li>雷火电竞夺宝、捕鱼和彩票 不参与返水优惠；</li>
          <li>电竞/体育中的连串过关投注额返水将以注单结算时间为准。</li>
          <li>
            返水根据有效投注进行计算，在所有产品中，任何注单取消或本金退还，任何低于欧洲盘1.7或亚洲盘0.7水位的投注以及在同一游戏中同时投注对等盘口，将不计算在有效投注额内，赢半和输半只计算一半流水，体育提前注单按照实际输赢金额的绝对值作为有效投注；
          </li>
          <li>
            返水奖金可投注于任何平台游戏，奖金只需1倍投注额即可申请提款，最低返水1元，低于1元不予派发。
          </li>
          <li>
            此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址, 电话号码, 支付方式(相同借记卡/信用卡/银行账户号码) IP地址，同一网络环境等将可以作为判定是否独立玩家的条件。
          </li>
          <li>对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，雷火保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。</li>
          <li>在某些未知因素超出可控范围的情况下，雷火保留可单方面执行的决定权，并承诺会在这类紧急问题发生时解释给客户原因并听取客户反馈与客户沟通协商解决。</li>
          <li>雷火保留对本次活动的修订、终止和最终解释权，超出本网站控制外的技术错误，雷火将不承担任何责任。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onActivated, watch } from "vue";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

var qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();

const tab = ref("rules");

const slide = ref(0);
const vipItems = ref([
  { level: "1", title: "青铜2", amount: "一笔存款" },
  { level: "2", title: "青铜1", amount: "3,000" },
  { level: "3", title: "白银3", amount: "30,000" },
  { level: "4", title: "白银2", amount: "80,000" },
  { level: "5", title: "白银1", amount: "200,000" },
  { level: "6", title: "黄金3", amount: "400,000" },
  { level: "7", title: "黄金2", amount: "600,000" },
  { level: "8", title: "黄金1", amount: "1,000,000" },
  { level: "9", title: "铂金2", amount: "2,000,000" },
  { level: "10", title: "铂金1", amount: "4,000,000" },
  { level: "11", title: "钻石", amount: "8,000,000" },
  { level: "12", title: "王者", amount: "12,000,000" }
]);

const vipClaimItems = [
  { benefit: "网站首存优惠", turnover: "无", availableBtn: false, claimedBtn: false, depositPromoBtn: false },
  {
    benefit: "存款最少20元可申请一次晋级奖金88元",
    turnover: "电竞/体育10倍 老虎机12倍 真人18倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  },
  {
    benefit: "存款最少100元可申请一次再存20% 最高奖金1888元",
    turnover: "电竞/体育15倍 老虎机12倍 真人18倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金188元",
    turnover: "电竞/体育 5倍  老虎机12倍 真人15倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金388元",
    turnover: "电竞/体育 5倍  老虎机12倍 真人15倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  },
  {
    benefit: "存款最少200元可申请一次再存30%最高奖金888元",
    turnover: "电竞/体育 15倍  老虎机12倍 真人18倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金888元",
    turnover: "电竞/体育 5倍  老虎机12倍 真人18倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  },
  {
    benefit: "存款最少500元可申请每月一次再存35% 最高奖金2888元",
    turnover: "电竞/体育 15倍  老虎机12倍 真人18倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金1888元",
    turnover: "电竞/体育 8倍  老虎机12倍 真人18倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  },
  {
    benefit: "存款最少500元可申请一次再存40%最高奖金5888元",
    turnover: "电竞/体育 15倍  老虎机12倍 真人18倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金8888元",
    turnover: "电竞/体育10倍  老虎机12倍 真人18倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金18888元",
    turnover: "电竞/体育10倍  老虎机12倍 真人18倍 棋牌20倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false
  }
];

const claimDesc = ref(vipClaimItems[0]);
const currentDeposit = ref(0);

// for (let i = 0, l = vipItems.value.length; i < l; i++) {
//   if (!claimDesc.value) {
//     vipClaimItems[i].vip = i;
//     claimDesc.value = vipClaimItems[i];
//   }
// }

const checkVipRedeem = () => {
  if (!claimDesc.value) {
    vipClaimItems.value.forEach((el, i) => {
      el[i].vip = i;
      if (i === 0) {
        claimDesc.value = el[0].vip;
      }
    });
  }
  getProgressBar();
  eventapi.get("/vip-upgrade/lh/canRedeem").then((res) => {
    if (res.code === 0) {
      // console.log(res.data);
      // Your arrays of elements
      const depositPromoAvailableElements = res.data.depositPromoAvailable;
      const promoAvailableElements = res.data.promoAvailable;
      const unavailableElements = res.data.unavailable;
      const claimedElements = res.data.claimed;

      // Function to update properties based on the provided elements
      function updatePropertiesBasedOnElements(elements, property) {
        elements.forEach((element, i) => {
          const index = element - 1;
          // vipClaimItems[i].vip = i
          if (index >= 0 && index < vipClaimItems.length) {
            vipClaimItems[index][property] = true;
          }
        });
      }

      // Call the function to update properties based on depositPromoAvailable elements
      updatePropertiesBasedOnElements(depositPromoAvailableElements, "depositPromoBtn");

      // Call the function to update properties based on promoAvailable elements
      updatePropertiesBasedOnElements(promoAvailableElements, "availableBtn");

      // Call the function to update properties based on unavailable elements
      updatePropertiesBasedOnElements(unavailableElements, "unavailable");

      // Call the function to update properties based on unavailable elements
      updatePropertiesBasedOnElements(claimedElements, "claimedBtn");

      // Now, vipItems array has the updated properties based on the provided elements
      // vipClaimItems[slide.value].vip = slide.value + 1;
      // claimDesc.value = vipClaimItems[slide.value];
      if (vipLevel.value !== 0) {
        slide.value = vipLevel.value - 1;
      } else {
        slide.value = 1;
      }

      vipClaimItems[slide.value].vip = slide.value;
      claimDesc.value = vipClaimItems[slide.value];
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
const getProgressBar = () => {
  vipItems.value.forEach((vip, i) => {
    if (Number(vipLevel.value + 1) > Number(vip.level)) {
      vip.progressBarVal = 0;
    } else {
      vip.progressBarVal = 1;
    }
    // if (vipLevel.value > vip.level) {
    //   vip.progressBarVal = 100
    // }

    if (Number(vipLevel.value + 1 === Number(vip.level))) {
      // Remove commas from the string
      let amt = vip.amount.replace(/,/g, "");
      let current = currentDeposit.value.replace(/,/g, "");

      // Parse the string into a number
      let vipAmount = parseInt(amt, 10);
      let currentDep = parseInt(current, 10);

      // console.log(vipAmount); // Outputs: 400000
      // console.log(currentDep);

      let percentageChange = (currentDep / vipAmount) * 100;
      // console.log(percentageChange / 100);
      vipItems.value[Number(vipLevel.value)].progressBarVal = 1 - percentageChange / 100;
      // // Calculate the maximum absolute percentage change
      // let maxAbsoluteChange = Math.max(Math.abs(percentageChange), 1);

      // // Normalize to a range between 0 and 1
      // let normalizedValue = Math.abs(percentageChange) / maxAbsoluteChange;

      // // Map the normalized value to a range with increments of 0.1
      // let mappedValue = Math.ceil(normalizedValue * 10) / 10;

      // console.log(mappedValue); // Outputs: 0.8
      // // var currentProgressPercentage = Math.abs((vipAmount - currentDep) / currentDep) / 100;
      // vipItems.value[Number(vipLevel.value)].progressBarVal = mappedValue
    }
  });
};

watch(slide, (newValue) => {
  if (vipClaimItems[newValue]) {
    vipClaimItems[newValue].vip = newValue;
    claimDesc.value = vipClaimItems[newValue];
  }
});

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

const vipNumber = ref(null);
const extractNumber = (str) => {
  const match = str.match(/\d+/);
  vipNumber.value = match ? parseInt(match[0], 10) : null;
};

const claim = async () => {
  extractNumber(store.vip);

  try {
    // const res = await eventapi.post("/vip-upgrade/lh/claim", qs.stringify({ vipLevel: vipNumber.value }));
    const res = await eventapi.post("/vip-upgrade/lh/claim", qs.stringify({ vipLevel: slide.value + 1 }));
    if (res.code === 0) {
      $q.notify({
        color: "positive",
        position: "top",
        message: "领取成功",
        icon: "check_circle_outline"
      });
      claimDesc.value.claimedBtn = true;

      claimDesc.value.availableBtn = false;
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
const vipLevel = ref(null);
onActivated(() => {
  if (store.hasToken()) {
    store.getMemberInfo().then(() => {
      vipLevel.value = +store.vip.replace("VIP", "");
      currentDeposit.value = parseFloat(store.currentDeposit).toLocaleString();
      checkVipRedeem();
    });
  } else {
    claimDesc.value.vip = 0;
    vipItems.value.forEach((item) => {
      item.progressBarVal = 1;
    });
  }
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

    .card-img-wrap {
      min-height: 160px;

      @media (min-width: 470px) {
        min-height: 210px;
      }
    }

    .card-img {
      width: 100%;
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
      top: 25%;

      @media (min-width: 470px) {
        top: 35%;
      }

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
            &.vip-card-current-num {
              color: #86570b;
            }
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

      &.status-claimed {
        opacity: 0.6;
        filter: grayscale(0.6);
      }

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

    &:first-child {
      min-width: 60px;
    }
  }

  .vip-card-common-text {
    font-size: 3vw;
    font-weight: 400;
    color: $font-1;
  }

  .vip-card-current-num {
    margin-top: 8px;
    font-size: 11px;
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

.body--dark {
  .vip-container {
    background: $background-dark;

    .q-icon {
      box-shadow: none;
      background: $background-dark-header;
      color: $font-3-dark;
    }

    .vip-card-container {
      .vip-card-info {
        .level {
          .vip-level {
            color: $dark;
          }
          .vip-card-common-text {
            color: $font-1;
          }
        }
        .amount {
          .vip-card-common-text {
            color: $font-1;
          }
        }
      }
    }

    .level-promo-container {
      @include content-block-dark-with-border;
      .q-separator {
        display: none;
      }
      .level-promo-header {
        background: $background-dark-header;
        .level-promo-title {
          color: $font-3-dark;
        }
      }
    }

    .vip-detail-container {
      .rules-content {
        @include content-block-dark-with-border;
        thead {
          > :first-child {
            background: $background-dark-header;
          }
          tr :not(:last-child) {
            border-right-width: 1px;
          }
          th {
            color: $font-3-dark;
          }
        }
      }
    }

    .tnc-container {
      .tnc-note {
        @include content-block-dark;
      }
    }
  }
}
</style>
