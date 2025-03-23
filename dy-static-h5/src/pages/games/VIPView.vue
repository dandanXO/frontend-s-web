<template>
  <div class="vip-container">
    <div class="vip-tab-board">
      <q-tabs v-model="tab" active-color="primary" align="justify" class="vip-tabs">
        <q-tab name="special" label="VIP特权" />
        <q-tab name="details" label="VIP详情" />
      </q-tabs>
    </div>

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
          <q-carousel-slide v-for="(vip, vipIndex) in vipItems" :key="vipIndex" :name="vipIndex">
            <div class="carousel__item">
              <div class="vipitem">
                <div class="viplevelcard">
                  <div class="vip-badgelevel">
                    <div class="vip-badge">
                      <img :src="require(`../../assets/vip/vip_img_${vip.vipLevel}.png`)" />
                    </div>
                    <div class="vip-text">
                      <img :src="require(`../../assets/vip/vip_text_${vip.vipLevel}.png`)" />
                    </div>
                  </div>
                  <div class="vip-badgecontent">
                    <span>
                      {{ `>${vip.saving}存款` }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>

        <div class="vip-benefits">
          <div class="bft-title">
            <img src="../../assets/vip/vip-title-icon.png" />
            VIP特权
          </div>
          <template v-for="(vip, vipIndex) in vipList" :key="vipIndex">
            <template v-if="vipIndex === slide">
              <div class="bft-row">
                <div class="bft-row-cnt">
                  <div class="left">
                    <div class="icon">
                      <img src="../../assets/vip/vip-deposit-icon.png" />
                    </div>
                    <div class="txt" style="margin-right: 20px">每月存送: {{ vip.cunsong }}</div>
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
                <div class="bft-row-cnt">
                  <div class="left">
                    <div class="icon">
                      <img src="../../assets/vip/vip-bonus-icon.png" />
                    </div>
                    <div class="txt">每月红包: {{ vip.monthlyBonus }}</div>
                  </div>
                  <template v-if="!store.token || vip.level == vipLevel">
                    <q-btn
                      class="vip-bonus-btn"
                      color="dyblue"
                      outline
                      :label="isClaimedBonus ? `已领取` : `领取`"
                      :disable="btnIsDisabled || isClaimedBonus"
                      @click="onVIPButtonClick('monthly')"
                      :loading="!isBeforeCheckBonus"
                    />
                  </template>
                </div>
                <div class="bft-row-cnt">
                  <div class="left">
                    <div class="icon">
                      <img src="../../assets/vip/vip-birthday-icon.png" />
                    </div>
                    <div class="txt">生日礼金: {{ vip.birthdayBonus }}</div>
                  </div>
                  <template v-if="!store.token || vip.level == vipLevel">
                    <q-btn
                      class="vip-bonus-btn"
                      color="dyblue"
                      outline
                      :label="isClaimedBirthday ? `已领取` : `领取`"
                      :loading="!isBeforeCheckBirthday"
                      :disable="btnIsDisabled || isClaimedBirthday"
                      @click="onVIPButtonClick('birthday')"
                    />
                  </template>
                </div>
                <div class="bft-row-cnt">
                  <div class="left">
                    <div class="txt">流水要求: {{ vip.drawTimes }}</div>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>

        <template v-for="(vip, vipIndex) in vipList" :key="vipIndex">
          <template v-if="vipIndex === slide">
            <div class="vip-benefits">
              <div class="bft-title">
                <img src="../../assets/vip/vip-title-icon.png" />
                VIP优惠
              </div>
              <div class="bft-promo-row">
                <div class="bft-promo">
                  <div class="promo-percent">{{ vip.perEsport }}</div>
                  <div class="promo-title">电竞返水</div>
                </div>
                <div class="bft-promo">
                  <div class="promo-percent">{{ vip.perSport }}</div>
                  <div class="promo-title">体育返水</div>
                </div>
                <div class="bft-promo">
                  <div class="promo-percent">{{ vip.perLive }}</div>
                  <div class="promo-title">真人返水</div>
                </div>
                <div class="bft-promo">
                  <div class="promo-percent">{{ vip.perSlot }}</div>
                  <div class="promo-title">电子返水</div>
                </div>
                <div class="bft-promo">
                  <div class="promo-percent">{{ vip.perPoker }}</div>
                  <div class="promo-title">棋牌返水</div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </q-tab-panel>

      <q-tab-panel name="details">
        <table class="bouns_table">
          <thead>
            <tr>
              <th class="dy-vip-th">等级</th>
              <th class="dy-vip-th">升级要求</th>
              <th class="dy-vip-th">生日礼金</th>
              <th class="dy-vip-th">每月最低累计存款</th>
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
              <td>5,000≤累积存款</td>

              <td>38元</td>
              <td>1,500元</td>
              <td>28元</td>
            </tr>
            <tr>
              <td>VIP3</td>
              <td>50,000≤累积存款</td>

              <td>108元</td>
              <td>5,000元</td>
              <td>88元</td>
            </tr>
            <tr>
              <td>VIP4</td>
              <td>250,000≤累积存款</td>

              <td>388元</td>
              <td>10,000元</td>
              <td>188元</td>
            </tr>
            <tr>
              <td>VIP5</td>
              <td>500,000≤累积存款</td>
              <!--              <td>58888≤一个月内累积存款</td>-->
              <td>688元</td>
              <td>20,000元</td>
              <td>388元</td>
            </tr>
            <tr>
              <td>VIP6</td>
              <td>2,500,000≤累积存款</td>
              <!--              <td>88888≤一个月内累积存款</td>-->
              <td>1,088元</td>
              <td>50,000元</td>
              <td>888元</td>
            </tr>
            <tr>
              <td>VIP7</td>
              <td>5,000,000≤累积存款</td>
              <!--              <td>188888≤一个月内累积存款</td>-->
              <td>6,888元</td>
              <td>60,000元</td>
              <td>2,888元</td>
            </tr>
            <tr>
              <td>VIP8</td>
              <td>8,000,000≤累积存款</td>
              <!--              <td>288888≤一个月内累积存款</td>-->
              <td>8,888元</td>
              <td>80,000元</td>
              <td>5,888元</td>
            </tr>
            <tr>
              <td>VIP9</td>
              <td>12,000,000≤累积存款</td>
              <!--              <td>588888≤一个月内累积存款</td>-->
              <td>10,888元</td>
              <td>100,000元</td>
              <td>6,888元</td>
            </tr>
            <tr>
              <td>VIP10</td>
              <td>20,000,000≤累积存款</td>
              <!--              <td>888888≤一个月内累积存款</td>-->
              <td>18,888元</td>
              <td>150,000元</td>
              <td>8,888元</td>
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
              <td>15倍</td>
              <td>电竞/体育</td>
            </tr>
            <tr>
              <td>VIP3</td>
              <td>存款最少100元可申请每月一次再存20%最高奖金888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP4</td>
              <td>存款最少100元可申请每月一次再存25%最高奖金888元</td>
              <td>15倍</td>
              <td>电竞/体育</td>
            </tr>
            <tr>
              <td>VIP5</td>
              <td>存款最少500元可申请每月一次再存50%最高奖金1,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP6</td>
              <td>存款至少500元可申请每周一次再存30%最高奖金2,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP7</td>
              <td>存款至少500元可申请每周一次再存35%最高奖金3,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP8</td>
              <td>存款至少500元可申请每周一次再存40%最高奖金5,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP9</td>
              <td>存款至少500元可申请每周一次再存45%最高奖金8,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP10</td>
              <td>存款至少500元可申请每周一次再存50%最高奖金12,888元</td>
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

        <div class="terms-conditions">
          <div class="title">规则与条款</div>
          <ol style="padding-inline-start: 15px">
            <li>晋升标准：会员的累计有效存款额达到相应级别的要求，即可在当日24点前晋级相应VIP等级。</li>
            <li>晋升顺序：VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升。</li>
            <li>生日礼金：VIP2或以上等级会员可享受生日礼金，每年仅可领取一次。（生日彩金3倍流水即可提款）</li>
            <li>
              每月1号会员即可登录账户领取每月红包（每月红包彩金3倍流水即可提款）。上月需达到累计存款要求方可领取每月红包奖金。
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
            <span class="bonus-text">奖励</span>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="确定" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import Swal from "sweetalert2";

export default defineComponent({
  name: "TransitRecordView",
  setup() {
    const $q = useQuasar();
    const tab = ref("special");

    const slide = ref(0);
    const showRebate = ref(false);

    const router = useRouter();
    const store = userStore();
    const vipLevel = ref("");
    const loading = ref(false);
    const loadingMClaim = ref(false);
    const loadingBClaim = ref(false);

    const isBeforeCheckBonus = ref(true);
    const isBeforeCheckBirthday = ref(true);

    const isClaimedBonus = ref(false);
    const isClaimedBirthday = ref(false);

    const btnIsDisabled = ref(false);

    const errorCount = ref(0);
    let countdownInterval;

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
        const bonusItem = `dy2-vip-${type}`;
        eventapi
          .put("/bonus/claim/" + bonusItem)
          .then((res) => {
            // console.log(res);
            if (res.code === 0) {
              Swal.fire({
                title: "系统提示",
                text: `您已成功领取 ${res.data}`,
                confirmButtonText: "确认"
              }).then((dialog) => {
                // if (dialog.isConfirmed) {
                //   router.push({path: "/finance/deposit"});
                // }
              });
            }
          })
          .catch((err) => {
            errorCount.value++;
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
                text: `${err.message}`,
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
        description: "> 有一笔存款",
        monthlyBonus: `无`,
        birthdayBonus: `无`,
        cunsong: `无`,
        drawTimes: `无`,
        perEsport: "0.40%",
        perSport: "0.40%",
        perLive: "0.40%",
        perSlot: "0.50%",
        perPoker: "0.50%"
      },
      {
        level: 2,
        description: `升级要求 &gt; 5000≤累积存款<br> 保级要求 &gt; 1888≤一个月内累积存款`,
        monthlyBonus: "28",
        birthdayBonus: "38",
        cunsong: `存款至少100元可申请每月一次再存20% 最高奖金588元`,
        drawTimes: "15",
        perEsport: "0.40%",
        perSport: "0.40%",
        perLive: "0.40%",
        perSlot: "0.60%",
        perPoker: "0.60%"
      },
      {
        level: 3,
        description: `升级要求 &gt; 50000≤累积存款<br>
							保级要求 &gt; 10888≤一个月内累积存款`,
        monthlyBonus: "88",
        birthdayBonus: "108",
        cunsong: `存款至少100元可申请每月一次再存20% 最高奖金888元`,
        drawTimes: "15",
        perEsport: "0.45%",
        perSport: "0.45%",
        perLive: "0.45%",
        perSlot: "0.70%",
        perPoker: "0.70%"
      },
      {
        level: 4,
        description: `升级要求 &gt; 250000≤累积存款<br>
							保级要求 &gt; 38888≤一个月内累积存款`,
        monthlyBonus: "188",
        birthdayBonus: "388",
        cunsong: `存款至少100元可申请每周一次再存25% 最高奖金888元`,
        drawTimes: "15",
        perEsport: "0.45%",
        perSport: "0.45%",
        perLive: "0.45%",
        perSlot: "0.80%",
        perPoker: "0.75%"
      },
      {
        level: 5,
        description: `升级要求 &gt; 500000≤累积存款<br>
							保级要求 &gt; 58888≤一个月内累积存款`,
        monthlyBonus: "388",
        birthdayBonus: "688",
        cunsong: `存款至少500元可申请每月一次再存50% 最高奖金1888元`,
        drawTimes: "15",
        perEsport: "0.50%",
        perSport: "0.50%",
        perLive: "0.50%",
        perSlot: "0.90%",
        perPoker: "0.80%"
      },
      {
        level: 6,
        description: `升级要求 &gt; 2500000≤累积存款<br>
							保级要求 &gt; 88888≤一个月内累积存款`,
        monthlyBonus: "888",
        birthdayBonus: "1088",
        cunsong: `存款至少500元可申请每周一次再存30% 最高奖金2888元`,
        drawTimes: "15",
        perEsport: "0.55%",
        perSport: "0.55%",
        perLive: "0.55%",
        perSlot: "1.20%",
        perPoker: "0.85%"
      },
      {
        level: 7,
        description: `升级要求 &gt; 5000000≤累积存款<br>
							保级要求 &gt; 188888≤一个月内累积存款`,
        monthlyBonus: "2888",
        birthdayBonus: "6888",
        cunsong: `存款至少500元可申请每周一次再存35% 最高奖金3888元`,
        drawTimes: "15",
        perEsport: "0.65%",
        perSport: "0.65%",
        perLive: "0.65%",
        perSlot: "1.50%",
        perPoker: "0.90%"
      },
      {
        level: 8,
        description: `升级要求 &gt; 8000000≤累积存款<br>
							保级要求 &gt; 288888≤一个月内累积存款`,
        monthlyBonus: "5888",
        birthdayBonus: "8888",
        cunsong: `存款至少500元可申请每周一次再存40% 最高奖金5888元`,
        drawTimes: "15",
        perEsport: "0.80%",
        perSport: "0.80%",
        perLive: "0.80%",
        perSlot: "1.80%",
        perPoker: "0.95%"
      },
      {
        level: 9,
        description: `升级要求 &gt; 12000000≤累积存款<br>
							保级要求 &gt; 588888≤一个月内累积存款`,
        monthlyBonus: "6888",
        birthdayBonus: "10888",
        cunsong: `存款至少500元可申请每周一次再存45% 最高奖金8888元`,
        drawTimes: "15",
        perEsport: "0.90%",
        perSport: "0.90%",
        perLive: "0.90%",
        perSlot: "1.90%",
        perPoker: "1.00%"
      },
      {
        level: 10,
        description: `升级要求 &gt; 20000000≤累积存款<br>
							保级要求 &gt; 888888≤一个月内累积存款`,
        monthlyBonus: "8888",
        birthdayBonus: "18888",
        cunsong: `存款至少500元可申请每周一次再存50% 最高奖金12888元`,
        drawTimes: "15",
        perEsport: "1.00%",
        perSport: "1.00%",
        perLive: "1.00%",
        perSlot: "2.00%",
        perPoker: "1.20%"
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

    onMounted(() => {
      if (!store.token) {
        return;
      }
      vipLevel.value = store.vip.replace("VIP", "");
      if (vipLevel.value >= 1) {
        slide.value = vipLevel.value ? parseInt(vipLevel.value) - 1 : 0;
      }

      eventapi
        .get("/privi/vip/canRedeem?promoCode=dy2-vip-monthly")
        .then((res) => {
          console.log(res);
          isBeforeCheckBonus.value = true;
          if (res.data === false) {
            isClaimedBonus.value = true;
          }
        })
        .catch((e) => {
          isBeforeCheckBonus.value = true;
        });
      eventapi
        .get("/privi/vip/canRedeem?promoCode=dy2-vip-birthday")
        .then((res) => {
          console.log(res);
          isBeforeCheckBirthday.value = true;
          if (res.data === false) {
            isClaimedBirthday.value = true;
          }
        })
        .catch((e) => {
          isBeforeCheckBirthday.value = true;
        });
    });

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
      slide,
      claimRebate,
      store,
      isClaimModal,
      claimMsg,
      loadingMClaim,
      loadingBClaim,
      tab,
      onVIPButtonClick,
      btnIsDisabled,
      startCountdown,
      isBeforeCheckBonus,
      isBeforeCheckBirthday,
      isClaimedBirthday,
      isClaimedBonus
    };
  }
});
</script>
<style scoped lang="scss">
.vip-container {
  min-height: 100vh;

  .vip-tab-board {
    background: #fff;
    padding: 10px;
    border-radius: 20px;
    position: relative;
  }

  .vip-tabs {
  }

  .q-tab {
    //min-height: 46px;
    //background: #EEE;
    color: #757575;
  }

  .q-field__native.q-placeholder {
    color: #000000;
  }

  .q-tabs {
    background: #fff;
    border-radius: 30px;
    width: 90%;
    margin: 0 auto;
    border: 1px solid #757575;
    box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
  }

  .banner-container {
    //background: url("../../assets/vip/banner.png") no-repeat center center;
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
        }

        .page-subline {
          font-size: 25px;
          line-height: 25px;
          margin-bottom: 20px;
        }

        .page-blend {
          background-image: linear-gradient(to right, #de4545, #db7e42);
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

  .inner-vip-mobile {
    display: none;
  }

  .vipitem {
    position: relative;
    display: flex;
    // background: url("../../assets/vip/vip_04.png") no-repeat top center;
    background-size: contain;
    width: 320px;
    padding: 40px 0;
    justify-content: center;
    align-items: center;
    margin: 0 auto;

    .viplevelcard {
      // padding: 10px;
      width: 70%;
      height: 150px;
      background: url("../../assets/vip/vip_logo_bg.png") no-repeat center center;
      background-size: contain;
      position: relative;
      text-align: left;
      display: flex;
      flex-direction: column;
      padding: 35px 10px 10px 65px;

      .vip-badgelevel {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .vip-badge {
          flex: 1;
          position: absolute;
          // width: 2.66rem;
          top: -10px;
          left: -50px;

          img {
            width: 100%;
          }
        }

        .vip-text {
          flex: 2;

          img {
            width: 100%;
            max-width: 73px;
          }
        }
      }

      .vip-badgecontent {
        margin-top: 5px;
        font-size: 11px;
        color: #73561f;

        span {
          display: block;
          line-height: 200%;
        }

        // position: absolute;
        // right: 20px;
        // bottom: 20px;
      }
    }

    .vipcontents {
      padding-top: 60px;
      // background: #2b2b4b;
      color: #ffffff;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      // border-top: 2px solid #db7e42;
      // border-bottom: 2px solid #db7e42;
      .title {
        font-size: 18px;
        line-height: 36px;
      }

      .inner-vip {
        background-color: #303450;
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-evenly;
        font-size: 45px;
        line-height: 53px;
        font-family: "Arial";
      }

      .second-vip {
        // background: #2b2b4b;
        width: 100%;
        display: flex;
        justify-content: space-around;
        font-size: 45px;
        line-height: 53px;

        div {
          flex: 1;
        }

        .common-btn {
          padding: 5px 10px;
          font-size: 12px;
          line-height: 20px;
          margin: 0 30px 30px;
        }
      }
    }
  }

  .vip-benefits {
    padding: 10px;
    font-size: 0.75rem;
    background: #eaeef2;

    .bft-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #0a3255;
      font-size: 18px;
      font-weight: bold;
      padding: 2px 0px 4px;
      height: 24px;
      border-bottom: 1px solid #baa57f;
      gap: 10px;

      //&:before {
      //  content: "";
      //  width: 10px;
      //  height: 19px;
      //  display: inline-block;

      //}
    }

    .bft-row {
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 8px;
      border-radius: 10px;
      background: #fff;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

      .bft-row-cnt {
        background: #f2f9ff;
        padding: 10px;
        display: flex;
        height: 55px;
        border-radius: 15px;
        justify-content: space-between;
        align-items: center;
        color: #000;

        .left {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 30px;

          .icon {
            width: 40px;
            min-width: 40px;

            img {
              flex: 1;
              width: 100%;
              display: block;
            }
          }

          .txt {
            font-size: 14px;
            font-weight: bold;
          }
        }

        .vip-bonus-btn {
          border: 1px solid #0a325588;
          height: 46px;
          border-radius: 15px;
          width: 88px;
          font-size: 16px;
          font-weight: bold;

          &:active {
            background: linear-gradient(180deg, #52acff, #3559da);
            filter: brightness(0.9);
          }
        }
      }
    }

    .bft-promo-row {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      padding: 10px 10px;
      margin-top: 8px;
      border-radius: 10px;
      background: #fff;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

      .bft-promo {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column-reverse;
        width: calc(33.33% - 10px);
        padding: 8px 10px;
        border-radius: 10px;
        background: #f2f9ff;

        .promo-percent {
          color: #baa57f;
          text-align: center;
          font-weight: 700;
          font-size: 24px;
        }

        .promo-title {
          color: #3a3a3a;
          font-size: 14px;
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
    padding: 8px;
  }

  table {
    text-align: center;
    font-size: 10px;
    color: #000;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;

    thead {
      background-color: #68bcec50;
      color: #000;

      th {
        color: #000;
      }
    }

    tbody {
      td {
        border: 1px solid #bac8dc;
      }
    }
  }

  .terms-conditions {
    color: #52697e;
    font-size: 0.8rem;

    .title {
      color: #0a3255;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
<!-- Carousel CSS only -->
<style lang="scss">
.vip-container {
  .q-tabs {
    background: url(../../assets/vip/top_bg.png) no-repeat top right;
    background-attachment: fixed;
  }

  .q-tabs--not-scrollable .q-tabs__content {
    gap: 10px;
    display: flex;
    justify-content: space-evenly;
  }

  .q-tabs__content--align-justify .q-tab {
    flex: unset;
    .q-tab__label {
      font-weight: bold;
      font-size: 16px;
    }

    &.q-tab--active {
      background: #0a3255;
      border: 1px solid #baa57f;
      border-radius: 20px;

      .q-tab__label {
        color: #dec392;
      }
    }
  }

  .q-tab {
    width: 40vw;
    //min-height: 35px;

    &__label {
      font-size: 16px;
      color: #757575;
    }
  }

  .q-tab--active .q-tab__indicator {
    display: none;
    width: 100%;
    margin: 0 auto;
    height: 10px;

    &:before {
      content: "";
      background: url(../../assets/vip/tap.png) no-repeat top center;
      background-size: 100%;
      height: 10px;
      width: 19px;
      display: block;
      margin: auto;
    }
  }
}

.q-carousel {
  overflow: hidden;
  margin: 0 auto;
  text-align: center;

  ol {
    padding: 0;
    margin: 0 auto;
    width: 100%;
    list-style-type: none;
    display: flex;
  }
}

.carousel__item {
  background: url(../../assets/vip/logo_bg.png) no-repeat top center;
  // background: url(../../assets/images/vip/vipbg.png)no-repeat center center;
  background-size: cover;
  font-size: 20px;
}

.q-carousel__slide {
  padding: 0;
  width: 100%;
}

button {
  border: 0;
}

.q-carousel__arrow {
  background: url(../../assets/vip/left.png) no-repeat center center;
  background-size: contain;
  width: 45px;

  .q-icon {
    display: none;
  }
}

.q-carousel__prev,
.q-carousel__next {
  position: absolute;
  padding: 10px;

  box-sizing: content-box;
  background: url(../../assets/vip/right.png) no-repeat center center;
  background-size: contain;
  top: 20%;

  .carousel__icon {
    display: none;
  }
}

.carousel__prev {
  top: 20%;
  left: 0%;
}

.q-carousel__next-arrow--horizontal {
  transform: rotate(180deg);
  right: 10px;
}

h2#swal2-title.swal2-title {
  font-size: 14px;
}

#swal2-html-container.swal2-html-container {
  font-size: 14px;
}

.swal2-confirm.swal2-styled {
  font-size: 14px;
  background-color: #0089ed;
}
</style>
