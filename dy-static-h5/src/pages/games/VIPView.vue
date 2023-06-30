<template>
  <div class="vip-container">
    <q-tabs v-model="tab" active-color="white" indicator-color="transparent">
      <q-tab name="special" label="VIP特权" />
      <q-tab name="details" label="VIP详情" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="special" style="padding: 0">
        <q-carousel
          class="vip bg-transparent"
          animated
          v-model="slide"
          arrows
          swipeable
          transition-prev="slide-right"
          transition-next="slide-left"
        >
          <q-carousel-slide
            v-for="(vip, vipIndex) in levels"
            :key="vipIndex"
            :name="vipIndex"
          >
            <div class="carousel__item">
              <div class="vipitem">
                <div class="viplevelcard">
                  <div class="vip-badgelevel">
                    <div class="vip-badge">
                      <img
                        :src="
                          require(`src/assets/vip/vip_img_${vip.level}.png`)
                        "
                      />
                    </div>
                    <div class="vip-text">
                      <img
                        :src="
                          require(`src/assets/vip/vip_text_${vip.level}.png`)
                        "
                      />
                    </div>
                  </div>
                  <div class="vip-badgecontent" v-html="vip.description"></div>
                </div>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>

        <div class="vip-benefits">
          <div class="bft-title">VIP特权</div>
          <template v-for="(vip, vipIndex) in levels" :key="vipIndex">
            <template v-if="vipIndex === slide">
              <div class="bft-row">
                <div class="bft-row-cnt">
                  <div class="left">
                    <div class="icon">
                      <img src="../../assets/vip/red_box.png" />
                    </div>
                    <div class="txt">
                      {{ labels.redEnvelop }}:
                      {{ vip.monthlyRedEnvelop ? vip.monthlyRedEnvelop : "无" }}
                    </div>
                  </div>
                  <template v-if="vip.monthlyRedEnvelop">
                    <q-btn
                      class="btn"
                      color="dyblue"
                      label="领取"
                      @click="onVIPButtonClick('monthly')"
                    />
                  </template>
                </div>
                <div class="bft-row-cnt">
                  <div class="left">
                    <div class="icon">
                      <img src="../../assets/vip/deposit.png" />
                    </div>
                    <div class="txt" style="margin-right: 20px">
                      {{ labels.deposit }}:
                      {{ vip.monthlyDeposit ? vip.monthlyDeposit : "无" }}
                    </div>
                  </div>
                  <template v-if="vip.monthlyDeposit">
                    <q-btn
                      class="btn"
                      color="dyblue"
                      style="white-space: nowrap"
                      label="领取"
                      @click="onVIPButtonClick('deposit')"
                    />
                  </template>
                </div>
                <div class="bft-row-cnt">
                  <div class="left">
                    <div class="icon">
                      <img src="../../assets/vip/money.png" />
                    </div>
                    <div class="txt">
                      {{ labels.birthday }}:
                      {{ vip.birthdayBonus ? vip.birthdayBonus : "无" }}
                    </div>
                  </div>
                  <template v-if="vip.birthdayBonus">
                    <q-btn
                      class="btn"
                      color="dyblue"
                      label="领取"
                      @click="onVIPButtonClick('birthday')"
                    />
                  </template>
                </div>
                <div class="bft-row-cnt">
                  <div class="left">
                    <div class="txt">
                      {{ labels.requirements }}:
                      {{ vip.requirements ? vip.requirements : "无" }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>

        <div class="vip-benefits">
          <div class="bft-title">VIP优惠</div>
          <div class="bft-promo-row">
            <div class="bft-promo">
              <div class="promo-percent">0.4%</div>
              <div class="promo-title">电竞返水</div>
            </div>
            <div class="bft-promo">
              <div class="promo-percent">0.4%</div>
              <div class="promo-title">体育返水</div>
            </div>
            <div class="bft-promo">
              <div class="promo-percent">0.4%</div>
              <div class="promo-title">真人返水</div>
            </div>
            <div class="bft-promo">
              <div class="promo-percent">0.5%</div>
              <div class="promo-title">电子返水</div>
            </div>
            <div class="bft-promo">
              <div class="promo-percent">0.5%</div>
              <div class="promo-title">棋牌返水</div>
            </div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="details">
        <table class="bouns_table">
          <thead>
            <tr>
              <th class="dy-vip-th">等级</th>
              <th class="dy-vip-th">升级要求</th>
              <th class="dy-vip-th">保级要求</th>
              <th class="dy-vip-th">生日礼金</th>
              <th class="dy-vip-th">每月红包</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>VIP1</td>
              <td>有一笔存款</td>
              <td>无</td>
              <td>无</td>
              <td>无</td>
            </tr>
            <tr>
              <td>VIP2</td>
              <td>5000≤累积存款</td>
              <td>1888≤一个月内累积存款</td>
              <td>38元</td>
              <td>28元</td>
            </tr>
            <tr>
              <td>VIP3</td>
              <td>50000≤累积存款</td>
              <td>10888≤一个月内累积存款</td>
              <td>108元</td>
              <td>88元</td>
            </tr>
            <tr>
              <td>VIP4</td>
              <td>250000≤累积存款</td>
              <td>38888≤一个月内累积存款</td>
              <td>388元</td>
              <td>188元</td>
            </tr>
            <tr>
              <td>VIP5</td>
              <td>500000≤累积存款</td>
              <td>58888≤一个月内累积存款</td>
              <td>688元</td>
              <td>388元</td>
            </tr>
            <tr>
              <td>VIP6</td>
              <td>2500000≤累积存款</td>
              <td>88888≤一个月内累积存款</td>
              <td>1088元</td>
              <td>888元</td>
            </tr>
            <tr>
              <td>VIP7</td>
              <td>5000000≤累积存款</td>
              <td>188888≤一个月内累积存款</td>
              <td>6888元</td>
              <td>2888元</td>
            </tr>
            <tr>
              <td>VIP8</td>
              <td>8000000≤累积存款</td>
              <td>288888≤一个月内累积存款</td>
              <td>8888元</td>
              <td>5888元</td>
            </tr>
            <tr>
              <td>VIP9</td>
              <td>12000000≤累积存款</td>
              <td>588888≤一个月内累积存款</td>
              <td>10888元</td>
              <td>6888元</td>
            </tr>
            <tr>
              <td>VIP10</td>
              <td>20000000≤累积存款</td>
              <td>888888≤一个月内累积存款</td>
              <td>18888元</td>
              <td>8888元</td>
            </tr>
          </tbody>
        </table>

        <table class="privilege_table">
          <thead>
            <tr>
              <th class="dy-vip-th">等级</th>
              <th class="dy-vip-th">每月优惠</th>
              <th class="dy-vip-th">流水</th>
              <th class="dy-vip-th">平台限制</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>VIP1</td>
              <td>无</td>
              <td>无</td>
              <td>无</td>
            </tr>
            <tr>
              <td>VIP2</td>
              <td>存款最少100元可申请每月一次再存20%最高奖金588元</td>
              <td>12倍</td>
              <td>电竞/体育</td>
            </tr>
            <tr>
              <td>VIP3</td>
              <td>存款最少100元可申请每月一次再存20%最高奖金888元</td>
              <td>12倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP4</td>
              <td>存款最少100元可申请每月一次再存25%最高奖金888元</td>
              <td>12倍</td>
              <td>电竞/体育</td>
            </tr>
            <tr>
              <td>VIP5</td>
              <td>存款最少500元可申请每月一次再存50%最高奖金1888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP6</td>
              <td>存款至少500元可申请每周一次再存30%最高奖金2888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP7</td>
              <td>存款至少500元可申请每周一次再存35%最高奖金3888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP8</td>
              <td>存款至少500元可申请每周一次再存40%最高奖金5888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP9</td>
              <td>存款至少500元可申请每周一次再存45%最高奖金8888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP10</td>
              <td>存款至少500元可申请每周一次再存50%最高奖金12888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
          </tbody>
        </table>

        <table class="percent_table">
          <thead>
            <tr>
              <th class="dy-vip-th">等级</th>
              <th class="dy-vip-th">VIP1</th>
              <th class="dy-vip-th">VIP2</th>
              <th class="dy-vip-th">VIP3</th>
              <th class="dy-vip-th">VIP4</th>
              <th class="dy-vip-th">VIP5</th>
              <th class="dy-vip-th">VIP6</th>
              <th class="dy-vip-th">VIP7</th>
              <th class="dy-vip-th">VIP8</th>
              <th class="dy-vip-th">VIP9</th>
              <th class="dy-vip-th">VIP10</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>电竞返水</td>
              <td>0.4%</td>
              <td>0.4%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.5%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.8%</td>
              <td>0.9%</td>
              <td>1%</td>
            </tr>
            <tr>
              <td>体育返水</td>
              <td>0.4%</td>
              <td>0.4%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.5%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.8%</td>
              <td>0.9%</td>
              <td>1%</td>
            </tr>
            <tr>
              <td>真人返水</td>
              <td>0.4%</td>
              <td>0.4%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.5%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.8%</td>
              <td>0.9%</td>
              <td>1%</td>
            </tr>
            <tr>
              <td>电子返水</td>
              <td>0.5%</td>
              <td>0.6%</td>
              <td>0.7%</td>
              <td>0.8%</td>
              <td>0.9%</td>
              <td>1.2%</td>
              <td>1.5%</td>
              <td>1.8%</td>
              <td>1.9%</td>
              <td>2%</td>
            </tr>
            <tr>
              <td>棋牌返水</td>
              <td>0.5%</td>
              <td>0.6%</td>
              <td>0.7%</td>
              <td>0.75%</td>
              <td>0.8%</td>
              <td>0.85%</td>
              <td>0.9%</td>
              <td>0.95%</td>
              <td>1%</td>
              <td>1.2%</td>
            </tr>
            <tr>
              <td>返水上限</td>
              <td colspan="3">18888元</td>
              <td colspan="3">38888元</td>
              <td colspan="2">58888元</td>
              <td colspan="2">88888元</td>
            </tr>
          </tbody>
        </table>

        <!-- <div class="terms-conditions">
       <div class="terms">
         <div class="term" v-for="(term, i) in terms" :key="i">
           <div class="circle-wrapper">
             <div class="circle">{{ i + 1 }}</div>
           </div>
           <div class="term-text">{{ term.text }}</div>
         </div>
       </div>
     </div> -->
        <div class="terms-conditions">
          <div class="title">规则与条款</div>
          <ol style="padding-inline-start: 15px">
            <li>
              晋升标准：会员的累计有效存款额达到相应级别的要求，即可在当日24点前晋级相应VIP等级。
            </li>
            <li>
              晋升顺序：VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升。
            </li>
            <li>
              保级要求：会员在达到某VIP等级后，30天内存款需要完成保级要求。如果在此期间完成晋升，保级要求从新按照当前等级计算。
            </li>
            <li>
              降级标准：如果会员在上月（自然月）内没有完成相应的保级要求，系统会在月初自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级。
            </li>
            <li>
              生日礼金：VIP2或以上等级会员可享受生日礼金，每年仅可领取一次。（生日彩金1倍流水即可提款）
            </li>
            <li>
              每月红包：每月1号会员即可登录账户领取每月红包。（每月红包彩金3倍流水即可提款）
            </li>
            <li>东赢保留对活动的修改，停止及最终解释权。</li>
          </ol>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="isClaimModal" persistent>
      <q-card class="win-rebate-model">
        <q-card-section class="row items-center">
          <div class="bonus-svg-div">
            <span class="claim-amt">{{ claimMsg }}</span>
            <span class="bonus-text">Bonus</span>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";

import vipLevel from "src/constant/vip-level.js";
import { claimBonusItem } from "src/api/index/promo";
import { openCommonError, openLoginAlert } from ".shared/helper/utils";

export default defineComponent({
  name: "TransitRecordView",
  setup() {
    const $q = useQuasar();
    const tab = ref("special");

    const slide = ref(0);
    const showRebate = ref(false);

    const store = userStore();

    const loading = ref(false);
    const loadingMClaim = ref(false);
    const loadingBClaim = ref(false);

    const router = useRouter();

    const columns = [
      {
        title: "VIP Level",
        dataIndex: "vipLevel",
        key: "vipLevel"
      },
      {
        title: "VIP 1",
        dataIndex: "vip1",
        key: "vip1"
      },
      {
        title: "VIP 2",
        dataIndex: "vip2",
        key: "vip2"
      },
      {
        title: "VIP 3",
        dataIndex: "vip3",
        key: "vip3"
      },
      {
        title: "VIP 4",
        dataIndex: "vip4",
        key: "vip4"
      },
      {
        title: "VIP 5",
        dataIndex: "vip5",
        key: "vip5"
      },
      {
        title: "VIP 6",
        dataIndex: "vip6",
        key: "vip6"
      },
      {
        title: "VIP 7",
        dataIndex: "vip7",
        key: "vip7"
      },
      {
        title: "VIP 8",
        dataIndex: "vip8",
        key: "vip8"
      },
      {
        title: "VIP 9",
        dataIndex: "vip9",
        key: "vip9"
      },
      {
        title: "VIP 10",
        dataIndex: "vip10",
        key: "vip10"
      },
      {
        title: "VIP 11",
        dataIndex: "vip11",
        key: "vip11"
      },
      {
        title: "VIP 12",
        dataIndex: "vip12",
        key: "vip12"
      }
    ];
    const data = [
      {
        key: "1",
        vipLevel: "Slots Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.50%",
        vip5: "0.60%",
        vip6: "0.80%",
        vip7: "1.00%"
      },
      {
        key: "2",
        vipLevel: "Fishing Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "3",
        vipLevel: "Live Casino Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "4",
        vipLevel: "Poker Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "5",
        vipLevel: "Sports/Esports Rebate",
        vip1: "0.20%",
        vip2: "0.30%",
        vip3: "0.35%",
        vip4: "0.40%",
        vip5: "0.45%",
        vip6: "0.55%",
        vip7: "0.65%"
      },
      {
        key: "6",
        vipLevel: "Lottery Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.40%",
        vip5: "0.50%",
        vip6: "0.50%",
        vip7: "0.60%"
      }
    ];
    const promoExclusive = [
      {
        title: "VIP Level",
        dataIndex: "vipLevel",
        key: "vipLevel",
        render: (text) => String(text)
      },
      {
        title: "VIP 1",
        dataIndex: "vip1",
        key: "vip1"
      },
      {
        title: "VIP 2",
        dataIndex: "vip2",
        key: "vip2"
      },
      {
        title: "VIP 3",
        dataIndex: "vip3",
        key: "vip3"
      },
      {
        title: "VIP 4",
        dataIndex: "vip4",
        key: "vip4"
      },
      {
        title: "VIP 5",
        dataIndex: "vip5",
        key: "vip5"
      },
      {
        title: "VIP 6",
        dataIndex: "vip6",
        key: "vip6"
      },
      {
        title: "VIP 7",
        dataIndex: "vip7",
        key: "vip7",
        render: (text) => String(text)
      }
    ];
    const dataExclusive = [
      {
        key: "1",
        vipLevel: "Withdrawal Funds",
        vip1: "500,000/Day",
        vip2: "500,000/Day",
        vip3: "500,000/Day",
        vip4: "1,000,000/Day",
        vip5: "1,000,000/Day",
        vip6: "1,000,000/Day",
        vip7: "2,000,000.00/Day"
      },
      {
        key: "2",
        vipLevel: "Bet Limit",
        vip1: "Standard",
        vip2: "Standard",
        vip3: "Standard",
        vip4: "Standard",
        vip5: "High Limit",
        vip6: "High Limit",
        vip7: "High Limit"
      },
      {
        key: "3",
        vipLevel: "Priority Payment Method",
        vip1: "",
        vip2: "",
        vip3: "",
        vip4: "",
        vip5: "✔",
        vip6: "✔",
        vip7: "✔"
      },
      {
        key: "4",
        vipLevel: "24/7 VIP Customer Care Team",
        vip1: "",
        vip2: "",
        vip3: "",
        vip4: "",
        vip5: "",
        vip6: "✔",
        vip7: "✔"
      },
      {
        key: "5",
        vipLevel: "Invitation to Exclusive Events",
        vip1: "",
        vip2: "",
        vip3: "",
        vip4: "",
        vip5: "",
        vip6: "",
        vip7: "✔"
      }
    ];
    const terms = [
      {
        text: `The program applies to VIP members with valid accounts. The VIP upgrade is based on the member's total accumulated deposit amount, the daily total successful deposit amount is calculate from 00:00:01 to 23:59:59  (GMT+8)`
      },
      {
        text: `The system will automatically upgrade VIP level after 00:00:00 (GMT+8) of the next day, the VIP level only can upgrade one level a day if the member's  total
deposit amount is eligible for the corresponding VIP level.`
      },
      {
        text: `The Free bonus, rebates and promotins benefits level corresponding to the VIP level will be updated as soon as the member's account is updated in the
next day.`
      },
      {
        text: `Birthday bonus:the bonus need to be claim on VIP page by member self on the birthday day and overdue void, Members who celebrate their birthday less
than 90 days from registration day will not receive this year's birthday bonus, Only members who have registered for more than 90 days can receive it, once
a year. (Birthday bonus can be withdrawal after 1x turnover)`
      },
      {
        text: `Monthly bonus:the bonus need to be claim on VIP page by member self after the member have upgraded to a new level in the next day, Each member can
claim 1 monthly bonus in upgrade month.(Monthly bonus can be withdrawal after 3x turnover)`
      },
      {
        text: `All draw bets, CANCEL bets, 2 sided bets, bets on Europe Handicap under 1.75, Asian Handicap under 0.75, Number Games, Fantasy Sports, Progressive RNG
Jackpots, Progressive RNG Slot will not be counted in this promotion.`
      },
      {
        text: `Jolly88 reserves the right to modify, refuse or cancel this VIP membership
program at any time without prior notice.`
      },
      {
        text: `Jolly88 reserves the right to modify, refuse or cancel this VIP membership program at any time without prior notice.`
      }
    ];
    const vipList = ref([
      {
        level: 1,
        description: "> 有一笔存款",
        monthlyBonus: `无`,
        birthdayBonus: `无`,
        cunsong: `无`,
        drawTimes: `无`
      },
      {
        level: 2,
        description: `升级要求 &gt; 5000≤累积存款<br> 保级要求 &gt; 1888≤一个月内累积存款`,
        monthlyBonus: "28",
        birthdayBonus: "38",
        cunsong: `存款至少100元可申请每月一次再存20% 最高奖金588元`,
        drawTimes: "12"
      },
      {
        level: 3,
        description: `升级要求 &gt; 50000≤累积存款<br>
							保级要求 &gt; 10888≤一个月内累积存款`,
        monthlyBonus: "88",
        birthdayBonus: "108",
        cunsong: `存款至少100元可申请每月一次再存20% 最高奖金888元`,
        drawTimes: "12"
      },
      {
        level: 4,
        description: `升级要求 &gt; 250000≤累积存款<br>
							保级要求 &gt; 38888≤一个月内累积存款`,
        monthlyBonus: "188",
        birthdayBonus: "388",
        cunsong: `存款至少100元可申请每周一次再存25% 最高奖金888元`,
        drawTimes: "12"
      },
      {
        level: 5,
        description: `升级要求 &gt; 500000≤累积存款<br>
							保级要求 &gt; 58888≤一个月内累积存款`,
        monthlyBonus: "388",
        birthdayBonus: "688",
        cunsong: `存款至少500元可申请每月一次再存50% 最高奖金1888元`,
        drawTimes: "15"
      },
      {
        level: 6,
        description: `升级要求 &gt; 2500000≤累积存款<br>
							保级要求 &gt; 88888≤一个月内累积存款`,
        monthlyBonus: "888",
        birthdayBonus: "1088",
        cunsong: `存款至少500元可申请每周一次再存30% 最高奖金2888元`,
        drawTimes: "15"
      },
      {
        level: 7,
        description: `升级要求 &gt; 5000000≤累积存款<br>
							保级要求 &gt; 188888≤一个月内累积存款`,
        monthlyBonus: "2888",
        birthdayBonus: "6888",
        cunsong: `存款至少500元可申请每周一次再存35% 最高奖金3888元`,
        drawTimes: "15"
      },
      {
        level: 8,
        description: `升级要求 &gt; 8000000≤累积存款<br>
							保级要求 &gt; 288888≤一个月内累积存款`,
        monthlyBonus: "5888",
        birthdayBonus: "8888",
        cunsong: `存款至少500元可申请每周一次再存40% 最高奖金5888元`,
        drawTimes: "15"
      },
      {
        level: 9,
        description: `升级要求 &gt; 12000000≤累积存款<br>
							保级要求 &gt; 588888≤一个月内累积存款`,
        monthlyBonus: "6888",
        birthdayBonus: "10888",
        cunsong: `存款至少500元可申请每周一次再存45% 最高奖金8888元`,
        drawTimes: "15"
      },
      {
        level: 10,
        description: `升级要求 &gt; 20000000≤累积存款<br>
							保级要求 &gt; 888888≤一个月内累积存款`,
        monthlyBonus: "8888",
        birthdayBonus: "18888",
        cunsong: `存款至少500元可申请每周一次再存50% 最高奖金12888元`,
        drawTimes: "15"
      }
    ]);

    const vipItems = [
      {
        vipLevel: "1",
        monthly: "",
        birthday: "",
        saving: "有一笔",
        monthlySaving: "",
        oneMonthSaving: "无保级要求"
      },
      {
        vipLevel: "2",
        upgrade: "70,000",
        monthly: "188",
        birthday: "",
        saving: "5000≤累积",
        monthlySaving: "1888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "3",
        upgrade: "500,000",
        monthly: "688",
        birthday: "888",
        saving: "50000≤累积",
        monthlySaving: "10888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "4",
        upgrade: "2,000,000",
        monthly: "1,588",
        birthday: "2,888",
        saving: "250000≤累积",
        monthlySaving: "38888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "5",
        upgrade: "7,000,000",
        monthly: "2,888",
        birthday: "5,888",
        saving: "500000≤累积",
        monthlySaving: "58888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "6",
        upgrade: "20,000,000",
        monthly: "6,888",
        birthday: "8,888",
        saving: "2500000≤累积",
        monthlySaving: "88888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "7",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        saving: "5000000≤累积",
        monthlySaving: "188888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "8",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        saving: "8000000≤累积",
        monthlySaving: "288888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "9",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        saving: "12000000≤累积",
        monthlySaving: "588888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "10",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        saving: "20000000≤累积",
        monthlySaving: "888888≤",
        oneMonthSaving: "一个月内累积存款"
      }
    ];

    const isClaimModal = ref(false);
    const claimMsg = ref("");

    // onMounted(() => {
    //   vipLevel.value = store.vip.replace("VIP", "");
    // });

    const claimRebate = (type, vipType) => {
      loading.value = true;
      if (vipType === "monthly") {
        loadingMClaim.value = true;
      } else if (vipType === "birthday") {
        loadingBClaim.value = true;
      }
      // console.log(eventapi);
      const eventUrl = "/bonus/claim/" + type;
      console.log(eventUrl);
      eventapi
        .put(eventUrl)
        .then((res) => {
          loading.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;
          var responseCode = res.data;
          if (responseCode.code === 0) {
            var rebatePoint = responseCode.data;

            claimMsg.value = "$" + rebatePoint;
            isClaimModal.value = true;

            // $q.dialog({
            //   class: "q-px-md q-pt-md",
            //   title: "สำเร็จ",
            //   message: "You won " + rebatePoint + " !",
            //   ok: {
            //     push: true,
            //     color: 'deep-orange',
            //     label: "ตกลง",
            //     tabindex: 1
            //   },
            //   persistent: true
            // });
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: responseCode.message,
            //   icon: "report_problem"
            // });
          }
        })
        .catch((error) => {
          loading.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
        });
    };

    const { labels, levels } = vipLevel;

    const onVIPButtonClick = (type) => {
      if (!store.token) {
        openLoginAlert(() => {
          // Redirect to login page
          router.push({ path: "/login", query: { redirect: "/account/vip" } });
        });
      } else {
        const bonusItem = `dy1-vip-${type}`;

        claimBonusItem(bonusItem)
          .then((res) => {
            if (res.code === 0) {
              // Success
              location.href = `/center/deposit`;
            } else openCommonError();
          })
          .catch(openCommonError);
      }
    };

    return {
      columns,
      data,
      showRebate,
      promoExclusive,
      dataExclusive,
      terms,
      vipItems,
      vipList,
      loading,
      vipLevel,
      slide,
      claimRebate,
      store,
      isClaimModal,
      claimMsg,
      loadingMClaim,
      loadingBClaim,
      tab,

      labels,
      levels,
      onVIPButtonClick
    };
  }
});
</script>

<style scoped lang="scss" src="src/css/pages/vip.scss"></style>
<style lang="scss" src="src/css/pages/vip.carousel.scss"></style>
