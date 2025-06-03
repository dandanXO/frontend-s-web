<template>
  <div class="vip-container">
    <RoundTab v-model:tab="tab" :items="tabItems"></RoundTab>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="special" style="padding: 0">
        <div ref="scrollContainer" class="scroll-container">
          <div
            v-for="(vip, vipIndex) in vipItems"
            :key="vipIndex"
            :data-index="vipIndex"
            class="card"
            :style="{ backgroundImage: `url(${require(`../../assets/vip/v${vip.vipLevel - 1}_card_bg.png`)})` }"
          >
            <div class="card_top">
              <div class="info-container">
                <img :src="require(`../../assets/vip/vip_text_${vip.vipLevel - 1}.png`)" />
                <span>{{ `${vip.monthlySaving}${vip.oneMonthSaving}` }}</span>
              </div>
              <img :src="require(`../../assets/vip/vip_badge_${vip.vipLevel - 1}.png`)" />
            </div>
            <div class="card_btm">
              <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: progessPercentage(vip.upgrade) + '%' }"></div>
              </div>
              <div class="amt-info">
                <span>累计存款大于{{ convertToCommaAmount(vip.upgrade) }}</span>
                <span>当前流水(元)：{{ convertToCommaAmount(currentBetAmount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="vip-benefits">
          <div class="bft-title">
            <img src="~/assets/vip/vip_priv_title.png" />
          </div>
          <div class="bft-row">
            <div class="bft-row-cnt">
              <div class="left">
                <div class="icon-description">
                  <img class="" src="../../assets/vip/promo_rewards_icon.png" />
                  <span>晋级奖励</span>
                </div>
                <div class="txt">
                  {{ vipCardData.cunsong }}
                </div>
              </div>
              <!-- <template v-if="vip.cunsong !== '无'">
                    <q-btn
                      class="btn"
                      color="dyblue"
                      style="white-space: nowrap"
                      label="领取"
                    />
                  </template> -->
            </div>
            <!--                <div class="bft-row-cnt">-->
            <!--                  <div class="left">-->
            <!--                    <div class="icon">-->
            <!--                      <img src="../../assets/vip/red_box.png"/>-->
            <!--                    </div>-->
            <!--                    <div class="txt">每月红包: {{ vip.monthlyBonus }}</div>-->
            <!--                  </div>-->
            <!--                  <template v-if="vip.monthlyBonus !== '无'">-->
            <!--                    <q-btn-->
            <!--                        class="btn"-->
            <!--                        color="brightbtn"-->
            <!--                        label="领取"-->
            <!--                        :disable="btnIsDisabled"-->
            <!--                        @click="onVIPButtonClick('monthly')"-->
            <!--                        :loading="false"-->
            <!--                    />-->
            <!--                  </template>-->
            <!--                </div>-->
            <div class="bft-row-cnt">
              <div class="left">
                <div class="icon-description">
                  <img src="../../assets/vip/birthday_icon.png" />
                  <span>生日礼金</span>
                </div>
                <div v-if="vipCardData.birthdayBonus === '无'" class="txt">{{ vipCardData.birthdayBonus }}</div>
                <div v-else class="btn-container">
                  <q-btn
                    color="orangebtn"
                    label="领取"
                    :disable="btnIsDisabled"
                    @click="onVIPButtonClick('birthday')"
                  />
                </div>
              </div>
            </div>
            <div class="bft-row-cnt">
              <div class="left">
                <div class="icon-description">
                  <img src="../../assets/vip/turnover_multiplier_icon.png" />
                  <span>流水要求</span>
                </div>
                <div class="txt">{{ vipCardData.drawTimes }}倍</div>
              </div>
            </div>
          </div>
        </div>

        <div class="vip-benefits">
          <div class="bft-title">
            <img src="~/assets/vip/vip_disc_title.png" />
          </div>
          <div class="bft-promo-row">
            <div class="bft-promo">
              <div class="promo-percent">{{ vipCardData.perEsport }}</div>
              <div class="promo-title">电竞返水</div>
            </div>
            <div class="bft-promo">
              <div class="promo-percent">{{ vipCardData.perSport }}</div>
              <div class="promo-title">体育返水</div>
            </div>
            <div class="bft-promo">
              <div class="promo-percent">{{ vipCardData.perLive }}</div>
              <div class="promo-title">真人返水</div>
            </div>
            <div class="bft-promo">
              <div class="promo-percent">{{ vipCardData.perSlot }}</div>
              <div class="promo-title">电子返水</div>
            </div>
            <div class="bft-promo">
              <div class="promo-percent">{{ vipCardData.perPoker }}</div>
              <div class="promo-title">棋牌返水</div>
            </div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="details">
        <RowHeaderTable
          :header-data="['等级', '升级要求', '晋升奖金(1倍)', '生日奖金(1倍)']"
          :row-data="[
            ['VIP1', '5000', '8元', '0元'],
            ['VIP2', '20000', '8元', '0元'],
            ['VIP3', '200000', '38元', '0元'],
            ['VIP4', '500000', '88元', '0元'],
            ['VIP5', '2000000', '288元', '188元'],
            ['VIP6', '5000000', '588元', '388元'],
            ['VIP7', '8000000', '1888元', '588元'],
            ['VIP8', '10000000', '2888元', '888元'],
            ['VIP9', '20000000', '5888元', '1288元'],
            ['VIP10', '30000000', '18888元', '1588元']
          ]"
        />

        <RowHeaderTable
          :header-data="['等级', '每月优惠', '优惠流水要求']"
          :row-data="[
            ['VIP1', '每月单笔≥500元,返现15%, 最高188元', '无'],
            ['VIP2', '每月单笔≥500元,返现15%, 最高258元', '15倍'],
            ['VIP3', '每月单笔≥500元,返现15%, 最高288元', '15倍'],
            ['VIP4', '每月单笔≥1000元,返现25%, 最高388元', '15倍'],
            ['VIP5', '每月单笔≥1000元,返现25%, 最高588元', '15倍'],
            ['VIP6', '每月单笔≥1000元,返现25%, 最高688元', '15倍'],
            ['VIP7', '每月单笔≥2000元,返现35%, 最高888元', '15倍'],
            ['VIP8', '每月单笔≥2000元,返现35%, 最高1288元', '15倍'],
            ['VIP9', '每月单笔≥2000元,返现35%, 最高1888元', '15倍'],
            ['VIP10', '每月单笔≥2000元,返现40%, 最高2888元', '15倍']
          ]"
        />

        <RowHeaderTable
          isHighlightFirstCol
          :header-data="['等级', '体育返水', '电竞返水', '真人返水', '棋牌返水', '电子返水', '返水上限']"
          :row-data="[
            ['VIP0', '0.40%', '0.45%', '0.50%', '0.40%', '0.45%', '8888元'],
            ['VIP1', '0.40%', '0.45%', '0.50%', '0.45%', '0.45%', '12888元'],
            ['VIP2', '0.40%', '0.50%', '0.50%', '0.50%', '0.50%', '15888元'],
            ['VIP3', '0.45%', '0.50%', '0.50%', '0.50%', '0.55%', '16888元'],
            ['VIP4', '0.50%', '0.55%', '0.55%', '0.60%', '0.60%', '18888元'],
            ['VIP5', '0.55%', '0.60%', '0.60%', '0.65%', '0.65%', '28888元'],
            ['VIP6', '0.60%', '0.65%', '0.65%', '0.70%', '0.70%', '38888元'],
            ['VIP7', '0.65%', '0.70%', '0.70%', '0.75%', '0.80%', '58888元'],
            ['VIP8', '0.70%', '0.75%', '0.80%', '0.80%', '0.90%', '88888元'],
            ['VIP9', '0.80%', '0.80%', '0.90%', '0.90%', '1%', '128888元'],
            ['VIP10', '1%', '1%', '1%', '1%', '1.2%', '188888元']
          ]"
        />

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
        <div class="terms-conditions-title">
          <img src="~/assets/vip/vip_rules_title.png" />
        </div>
        <div class="terms-conditions">
          <div class="content">
            <ol style="padding-inline-start: 15px">
              <li>晋升标准：用户充值达到相应级别即可晋升相应VIP等级。</li>
              <li>晋升顺序：VIP等级可以越级晋升，每天仅限晋升一级。</li>
              <li>晋级奖金：用户晋级后晋级奖金将自动派发到主账户中，每个级别的晋级奖金每位用户仅能获得一次。</li>
              <li>
                生日奖金：用户在注册90天内过生日，今年将不能领取生日礼金，另注册时间大于90天的会员需在生日当天的VIP页面进行自助领取，每年可领取一次。
              </li>
              <li>奖金流水：晋级奖金、生日奖金领取后需要完成一倍流水后可提款，此活动不可以与其他活动共享。</li>
              <li>
                每月首充：领取彩金需完成相应流水后可提款，有效投注额仅对已结算并产生输赢结果的投注额进行计算，
                电竞盘：香港盘0.75以下，欧洲盘1.75以下；
                香港盘＜0.75以下、欧洲盘＜1.75以下、马来盘＜0.75以下、印尼盘＜-1.3以下、美国盘＜-133以下，串关、走盘，注单取消，对冲等情况都不算有效流水。
              </li>
              <li>凡参加活动用户，即表示接受且自愿遵守平台规定，平台保留最终解释权。</li>
            </ol>
          </div>
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
import { ref, defineComponent, onMounted, computed, watch, nextTick } from "vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import Swal from "sweetalert2";
import RoundTab from "src/components/RoundTab.vue";
import { convertToCommaAmount } from "src/boot/utils.js";
import RowHeaderTable from "src/components/RowHeaderTable.vue";

export default defineComponent({
  name: "TransitRecordView",
  components: {
    RoundTab,
    RowHeaderTable
  },
  setup() {
    const $q = useQuasar();
    const tab = ref("special");

    const showRebate = ref(false);

    const router = useRouter();
    const store = userStore();
    const vipLevel = ref("");
    const loading = ref(false);
    const loadingMClaim = ref(false);
    const loadingBClaim = ref(false);

    const btnIsDisabled = ref(false);

    const errorCount = ref(0);
    let countdownInterval;

    const scrollContainer = ref(null);
    const scrollVipCardIndex = ref(0);

    const options = {
      root: null,
      threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scrollVipCardIndex.value = entry.target.dataset.index;
        }
      });
    }, options);

    const vipCardData = computed(() => {
        return vipList.value[scrollVipCardIndex.value];
    });

    watch(tab, () => {
      nextTick(() => {
        if (tab.value === "special") {
          initVipCardScroll();
        }
      });
    });

    const onVIPButtonClick = (type) => {
      // Check if the button is already disabled
      if (localStorage.getItem("vipButtonDisabled") === "true") {
        const currentTime = new Date().getTime();
        const expirationTime = parseInt(localStorage.getItem("vipButtonExpirationTime"), 10);

        // Check if the expiration time has passed
        if (currentTime < expirationTime) {
          return; // Exit the function if the button is still disabled
        } else {
          localStorage.removeItem("vipButtonDisabled");
          localStorage.removeItem("vipButtonExpirationTime");
          clearInterval(countdownInterval);
        }
      }

      if (!store.token) {
        Swal.fire({
          title: "请登录后再操作",
          text: "系统提示",
          confirmButtonText: "登录"
        }).then((dialog) => {
          if (dialog.isConfirmed) {
            router.push({ path: "/login" });
          }
        });
      } else {
        const bonusItem = `xf1-vip-${type}`;
        eventapi
          .put("/bonus/claim/" + bonusItem)
          .then((res) => {
            // console.log(res);
            if (res.code === 0) {
              Swal.fire({
                title: "系统提示",
                text: `你已领取 ${res.data}`,
                confirmButtonText: "确认"
              }).then((dialog) => {
                if (dialog.isConfirmed) {
                  router.push({ path: "/finance/deposit" });
                }
              });
            }
          })
          .catch((err) => {
            errorCount.value++;
            console.log(err);
            if (errorCount.value >= 3) {
              // Disable the button after 3 or more errors
              btnIsDisabled.value = true;
              const currentTime = new Date().getTime();
              const expirationTime = currentTime + 10000; // 10 secs in milliseconds

              localStorage.setItem("vipButtonDisabled", "true");
              localStorage.setItem("vipButtonExpirationTime", expirationTime.toString());
              // Start the countdown
              startCountdown(expirationTime);
              Swal.fire({
                title: "系统提示",
                text: `按钮将在30秒后启用`,
                confirmButtonText: "确认"
              });
            }
          });
      }
    };

    // Function to start the countdown
    const startCountdown = (expirationTime) => {
      countdownInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const remainingTime = expirationTime - currentTime;

        if (remainingTime > 0) {
          const seconds = Math.floor(remainingTime / 1000) % 60;
          if (seconds === 0) {
            btnIsDisabled.value = false;
            errorCount.value = 0;
          }
        } else {
          clearInterval(countdownInterval); // Clear the countdown interval
          // Remove the stored disabled state and expiration time
          localStorage.removeItem("vipButtonDisabled");
          localStorage.removeItem("vipButtonExpirationTime");
        }
      }, 1000);
    };

    // Check if the button should be initially disabled after a page refresh
    if (localStorage.getItem("vipButtonDisabled") === "true") {
      const currentTime = new Date().getTime();
      const expirationTime = parseInt(localStorage.getItem("vipButtonExpirationTime"), 10);

      // Check if the expiration time has passed
      if (currentTime < expirationTime) {
        // Disable the button
        btnIsDisabled.value = true;
        // Start the countdown
        startCountdown(expirationTime);
      } else {
        // Remove the stored disabled state and expiration time
        localStorage.removeItem("vipButtonDisabled");
        localStorage.removeItem("vipButtonExpirationTime");
      }
    }

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
        description: "升级要求 &gt; 5000≤累积存款<br> 保级要求 &gt; 1888≤一个月内累积存款",
        monthlyBonus: `无`,
        birthdayBonus: `无`,
        cunsong: `8元`,
        drawTimes: `12`,
        perEsport: "0.45%",
        perSport: "0.40%",
        perLive: "0.50%",
        perSlot: "0.45%",
        perPoker: "0.45%"
      },
      {
        level: 2,
        description: `升级要求 &gt; 20000≤累积存款<br> 保级要求 &gt; 1888≤一个月内累积存款`,
        monthlyBonus: "28",
        birthdayBonus: "无",
        cunsong: `8元`,
        drawTimes: "12",
        perEsport: "0.50%",
        perSport: "0.40%",
        perLive: "0.50%",
        perSlot: "0.50%",
        perPoker: "0.50%"
      },
      {
        level: 3,
        description: `升级要求 &gt; 200000≤累积存款<br>
							保级要求 &gt; 10888≤一个月内累积存款`,
        monthlyBonus: "88",
        birthdayBonus: "无",
        cunsong: `38元`,
        drawTimes: "12",
        perEsport: "0.50%",
        perSport: "0.45%",
        perLive: "0.50%",
        perSlot: "0.55%",
        perPoker: "0.55%"
      },
      {
        level: 4,
        description: `升级要求 &gt; 500000≤累积存款<br>
							保级要求 &gt; 38888≤一个月内累积存款`,
        monthlyBonus: "188",
        birthdayBonus: "无",
        cunsong: `88元`,
        drawTimes: "15",
        perEsport: "0.55%",
        perSport: "0.50%",
        perLive: "0.55%",
        perSlot: "0.60%",
        perPoker: "0.60%"
      },
      {
        level: 5,
        description: `升级要求 &gt; 2000000≤累积存款<br>
							保级要求 &gt; 58888≤一个月内累积存款`,
        monthlyBonus: "388",
        birthdayBonus: "188",
        cunsong: `288元`,
        drawTimes: "15",
        perEsport: "0.60%",
        perSport: "0.55%",
        perLive: "0.60%",
        perSlot: "0.65%",
        perPoker: "0.65%"
      },
      {
        level: 6,
        description: `升级要求 &gt; 5000000≤累积存款<br>
							保级要求 &gt; 88888≤一个月内累积存款`,
        monthlyBonus: "888",
        birthdayBonus: "388",
        cunsong: `588元`,
        drawTimes: "15",
        perEsport: "0.65%",
        perSport: "0.60%",
        perLive: "0.65%",
        perSlot: "0.70%",
        perPoker: "0.70%"
      },
      {
        level: 7,
        description: `升级要求 &gt; 8000000≤累积存款<br>
							保级要求 &gt; 188888≤一个月内累积存款`,
        monthlyBonus: "2888",
        birthdayBonus: "588",
        cunsong: `1888元`,
        drawTimes: "18",
        perEsport: "0.65%",
        perSport: "0.70%",
        perLive: "0.70%",
        perSlot: "0.80%",
        perPoker: "0.75%"
      },
      {
        level: 8,
        description: `升级要求 &gt; 10000000≤累积存款<br>
							保级要求 &gt; 288888≤一个月内累积存款`,
        monthlyBonus: "5888",
        birthdayBonus: "888",
        cunsong: `2888元`,
        drawTimes: "18",
        perEsport: "0.75%",
        perSport: "0.70%",
        perLive: "0.80%",
        perSlot: "0.90%",
        perPoker: "0.80%"
      },
      {
        level: 9,
        description: `升级要求 &gt; 20000000≤累积存款<br>
							保级要求 &gt; 588888≤一个月内累积存款`,
        monthlyBonus: "6888",
        birthdayBonus: "1288",
        cunsong: `5888元`,
        drawTimes: "18",
        perEsport: "0.80%",
        perSport: "0.80%",
        perLive: "0.90%",
        perSlot: "1.00%",
        perPoker: "0.90%"
      },
      {
        level: 10,
        description: `升级要求 &gt; 30000000≤累积存款<br>
							保级要求 &gt; 888888≤一个月内累积存款`,
        monthlyBonus: "8888",
        birthdayBonus: "1588",
        cunsong: `18888元`,
        drawTimes: "18",
        perEsport: "1.00%",
        perSport: "1.00%",
        perLive: "1.00%",
        perSlot: "1.20%",
        perPoker: "1.00%"
      }
    ]);

    const vipItems = [
      {
        vipLevel: "1",
        upgrade: 5000,
        monthly: "",
        birthday: "",
        monthlySaving: "",
        oneMonthSaving: "每月单笔≥500元, 返现15%, 最高188元"
      },
      {
        vipLevel: "2",
        upgrade: 20000,
        monthly: "188",
        birthday: "",
        monthlySaving: "",
        oneMonthSaving: "每月单笔≥500元, 返现15%, 最高258元"
      },
      {
        vipLevel: "3",
        upgrade: 200000,
        monthly: "688",
        birthday: "888",
        monthlySaving: "",
        oneMonthSaving: "每月单笔≥500元,返现15%, 最高288元"
      },
      {
        vipLevel: "4",
        upgrade: 500000,
        monthly: "1,588",
        birthday: "2,888",
        monthlySaving: "",
        oneMonthSaving: "每月单笔≥1000元,返现25%, 最高388元"
      },
      {
        vipLevel: "5",
        upgrade: 2000000,
        monthly: "2,888",
        birthday: "5,888",
        monthlySaving: "",
        oneMonthSaving: "每月单笔≥1000元,返现25%, 最高588元"
      },
      {
        vipLevel: "6",
        upgrade: 5000000,
        monthly: "6,888",
        birthday: "8,888",
        monthlySaving: "",
        oneMonthSaving: "每月单笔≥1000元,返现25%, 最高688元"
      },
      {
        vipLevel: "7",
        upgrade: 8000000,
        monthly: "18,888",
        birthday: "48,888",
        monthlySaving: "",
        oneMonthSaving: "每月单笔≥2000元,返现35%, 最高888元"
      },
      {
        vipLevel: "8",
        upgrade: 10000000,
        monthly: "18,888",
        birthday: "48,888",
        monthlySaving: "",
        oneMonthSaving: "每月单笔≥2000元,返现35%, 最高1288元"
      },
      {
        vipLevel: "9",
        upgrade: 20000000,
        monthly: "18,888",
        birthday: "48,888",
        monthlySaving: "",
        oneMonthSaving: "每月单笔≥2000元,返现35%, 最高1888元"
      },
      {
        vipLevel: "10",
        upgrade: 30000000,
        monthly: "18,888",
        birthday: "48,888",
        monthlySaving: "",
        oneMonthSaving: "每月单笔≥2000元,返现40%, 最高2888元"
      }
    ];

    const isClaimModal = ref(false);
    const claimMsg = ref("");

    const tabItems = [
      {
        name: "special",
        label: "VIP特权"
      },
      {
        name: "details",
        label: "VIP详情"
      }
    ];

    const progessPercentage = (upgradeAmt) => {
      return (currentDepositAmount.value / upgradeAmt) * 100;
    };

    const currentBetAmount = ref(0);
    const currentDepositAmount = ref(0);

    const getVipDetails = () => {
      const randNum = Math.floor(Math.random() * 1000) + 1;
      eventapi.get(`/vip-bonus/get-detail?v=${randNum}`).then((res) => {
        currentBetAmount.value = res.data.currentBetAmount;
        currentDepositAmount.value = res.data.currentDepositAmount;
      });
    };
    onMounted(() => {
      getVipDetails();
      initVipCardScroll();
    });

    const initVipCardScroll = () => {
      vipLevel.value = store.vip.replace("VIP", ""); 
      scrollVipCardIndex.value = vipLevel.value >= 1 && vipLevel.value ? parseInt(vipLevel.value) - 1 : 0;

      setTimeout(() => {
        const itemElements = scrollContainer.value.querySelectorAll(".card");
        if (itemElements[scrollVipCardIndex.value]) {
          itemElements[scrollVipCardIndex.value].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start"
          });
        }

        // reset observe
        observer.disconnect();
        itemElements.forEach((item) => {
          observer.observe(item);
        });
      }, 100);
    };

    const claimRebate = (type, vipType) => {
      loading.value = true;
      if (vipType === "monthly") {
        loadingMClaim.value = true;
      } else if (vipType === "birthday") {
        loadingBClaim.value = true;
      }
      const eventUrl = "/bonus/claim/" + type;
      // console.log(eventUrl);
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
      claimRebate,
      store,
      isClaimModal,
      claimMsg,
      loadingMClaim,
      loadingBClaim,
      tab,
      tabItems,
      onVIPButtonClick,
      btnIsDisabled,
      startCountdown,
      convertToCommaAmount,
      progessPercentage,
      currentBetAmount,
      scrollContainer,
      vipCardData
    };
  }
});
</script>
<style scoped lang="scss">
.vip-container {
  min-height: 100%;
  font-family: PingFang SC;

  .banner-container {
    background-size: cover;
    margin-bottom: -200px;
    padding-top: 100px;
    padding-bottom: 200px;
    // width: 1920px;
    // height: 450px;
    font-size: 30px;
    background-repeat: no-repeat;
    background-position: center center;
    min-height: 300px;
    display: flex;

    .btn-wrapper {
      width: 95%;
      max-width: 1400px;
      margin: auto;
      position: relative;

      .center {
        text-transform: uppercase;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #ffffff;

        .page-headline {
          font-size: 150px;
          line-height: 150px;
          font-family: Wave;
        }

        .page-subline {
          font-size: 25px;
          line-height: 25px;
          margin-bottom: 20px;
          font-family: Wave;
        }

        .page-blend {
          background-image: linear-gradient(to right, #de4545, #db7e42);
          font-family: Wave;
          color: #ffffff;
          font-size: 60px;
          line-height: 60px;
          padding: 15px;
          border-radius: 20px;
          margin-bottom: 10px;
          width: 100%;
          max-width: 460px;

          .pesos {
            font-family: sans-serif;
            font-weight: bold;
          }
        }

        .page-liner {
          font-size: 20px;
          text-transform: none;
        }

        img {
          max-width: unset;
        }

        .common-btn.getnow {
          background: #ffffff;
          color: #000000;
          border: transparent;

          &:hover {
            background: #ffd800;
          }
        }
      }
    }

    // .jp-container {
    //   display: flex;
    //   justify-content: center;
    //   text-align: center;
    //   font-size: 110px;
    //   margin-top: 30px;
    //   color: #1bcef1;
    //   font-family: jp;
    //   font-weight: 600;
    //   line-height: 120px;

    //   .jp-number-item {
    //     width: 96px;
    //     height: 120px;
    //     // background-image: url("../../assets/images/games/casino/jp_bg.png");
    //     background-repeat: no-repeat;
    //     background-size: 100% 100%;
    //   }
    // }
  }

  .vip-benefits {
    padding: 10px;
    font-size: 0.75rem;
    background: #1a2338;

    .bft-title {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #3a3a3a;
      font-weight: bold;
      gap: 10px;
      margin-bottom: 12px;

      > img {
        width: 180px;
      }
    }

    .bft-row {
      // padding: 10px;
      display: flex;
      flex-direction: row;
      // gap: 10px;

      .bft-row-cnt {
        background: #fff;
        // padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #3a3a3a;
        flex: 1;
        background: url(../../assets/vip/vip_priv_item_bg.png) center center no-repeat;
        background-size: contain;
        width: 100%;
        aspect-ratio: 9 / 10;

        .left {
          display: flex;
          // justify-content: space-between;
          align-items: center;
          // gap: 40px;
          flex-direction: column;
          height: 100%;
          // padding-bottom: 10px;
          width: 100%;
          color: #fff;

          .icon-description {
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            flex: 5;
            justify-content: center;

            img {
              width: 40px;
              display: block;
              margin-bottom: 6px;
            }
          }
          .txt {
            flex: 3;
            display: flex;
            align-items: center;
          }
          .btn-container {
            flex: 3;
            padding: 0;
            width: calc(100% - 40px);
            display: flex;
            align-items: center;
            justify-content: center;

            button {
              width: 100%;
            }
          }
        }
      }
    }

    .bft-promo-row {
      display: grid;
      gap: 15px;
      grid-template-columns: repeat(3, 1fr);
      padding: 10px;

      .bft-promo {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: url(../../assets/vip/vip_disc_item_bg.png) center center no-repeat;
        background-size: contain;
        padding: 4px;
        aspect-ratio: 10 / 8;

        .promo-percent {
          color: #01bfd8;
          text-align: center;
          font-weight: 600;
          font-size: 24px;
        }

        .promo-title {
          color: #ffffff99;
          font-weight: 600;
          font-size: 12px;
        }
      }
    }
  }

  .vip-program {
    .game-title {
      margin-bottom: 30px;
    }

    margin: 50px auto;
    max-width: 1080px;
    width: 95%;

    .buttons {
      display: flex;
      justify-content: center;
      align-items: stretch;
      border: 1px solid #db7e42;
      border-radius: 10px;
      margin-bottom: 10px;

      .common-btn {
        display: block;
        width: 100%;
        text-align: center;
        background: transparent;

        &.active {
          background-image: linear-gradient(to right, #de4545, #db7e42);
        }
      }
    }

    :deep(.ant-table-thead > tr > th) {
      text-align: center;

      &:nth-child(odd) {
        background: #2b2b4b;
      }
    }

    :deep(.ant-table-tbody > tr > td) {
      &:nth-child(odd) {
        background: #2b2b4b;
      }
    }

    .note {
      color: #db7d42;
      margin-top: 5px;
      display: block;
    }
  }

  .q-tab-panel {
    padding: 16px;
  }

  // .table-wrapper {
  //   border-radius: 10px;
  //   background: linear-gradient(180deg, rgba(0, 191, 215, 0) 0%, #00bfd7 75.68%);
  //   padding: 1px;
  //   margin-bottom: 14px;

  //   table {
  //     text-align: center;
  //     font-size: 10px;
  //     color: #000;
  //     width: 100%;

  //     border-collapse: separate;
  //     border-spacing: 0;
  //     overflow: hidden;
  //     border-radius: 10px;

  //     thead {
  //       background-color: #445f95;

  //       th {
  //         color: #ffffff;
  //         padding: 12px 4px;
  //         font-size: 12px;
  //         max-width: 10px;
  //         overflow-wrap: anywhere;
  //         font-weight: 400;
  //       }
  //     }

  //     tbody {
  //       background: linear-gradient(180deg, #384e79 0%, #212e4b 100%);
  //       td {
  //         // border: 0.35px solid #3B5385;
  //         // border-radius: 10px;
  //         color: #ffffff99;
  //         padding: 10px 4px;
  //         font-size: 12px;
  //         // background: #fff;
  //       }
  //     }
  //   }

  //   .percentage_table {
  //     tbody tr td:first-child {
  //       background-color: #445f95;
  //     }
  //   }

  //   th,
  //   td {
  //     padding: 12px;
  //   }

  //   th:first-of-type {
  //     border-top-left-radius: 10px;
  //   }
  //   th:last-of-type {
  //     border-top-right-radius: 10px;
  //   }
  //   tr:last-of-type td:first-of-type {
  //     border-bottom-left-radius: 10px;
  //   }
  //   tr:last-of-type td:last-of-type {
  //     border-bottom-right-radius: 10px;
  //   }
  // }

  .terms-conditions-title {
    display: flex;
    justify-content: center;
    margin-bottom: 14px;
    margin-top: 20px;
    > img {
      width: 180px;
    }
  }

  .terms-conditions {
    color: #fff;
    font-size: 0.8rem;
    color: #ffffff99;

    border: 1px solid transparent;
    border-radius: 10px;
    background-image: linear-gradient(180deg, #384e79 0%, #212e4b 100%),
      linear-gradient(180deg, rgba(0, 191, 215, 0) 0%, #00bfd7 75.68%);
    background-origin: border-box;
    background-clip: content-box, border-box;

    .content {
      padding: 16px;
    }

    li {
      line-height: 24px;
    }

    li:after {
      content: "";
      display: block;
      margin: 16px 0;
    }
  }
}

.scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 20px;
  background-color: #1a2338;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.card {
  flex: 0 0 80%;
  margin-right: 20px;
  height: 120px;
  border-radius: 10px;
  scroll-snap-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  flex-direction: column;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 10px;
  .card_top {
    flex: 1;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    max-width: 300px;
    padding: 0 10px;
    > img {
      width: 75px;
      height: 60px;
    }
    @media (max-width: 400px) {
      > img {
        width: 50px;
        height: 40px;
      }
    }
    @media (max-width: 370px) {
      > img {
        width: 40px;
        height: 32px;
      }
    }

    .info-container {
      display: flex;
      flex-direction: column;
      padding-right: 10px;
      align-self: flex-end;
      > img {
        width: 50px;
        margin-bottom: 6px;
      }
      @media (max-width: 400px) {
        > img {
          width: 32px;
          margin-bottom: 4px;
        }
      }
      @media (max-width: 370px) {
        > img {
          width: 24px;
          margin-bottom: 3px;
        }
      }
    }
  }
  .card_btm {
    flex: 1;
    width: 100%;
    max-width: 300px;
    padding: 0 10px;
    .amt-info {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
    .progress-bar-container {
      width: 100%;
      height: 6px;
      border-radius: 15px;
      overflow: hidden;
      background: #ffffff4d;
      margin-top: 6px;
      margin-bottom: 6px;
    }

    .progress-bar {
      height: 100%;
      width: 75%;
      background: #fff;
      transition: width 0.5s;
    }
  }
}
</style>
