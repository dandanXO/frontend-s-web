<template>
  <div class="vip-container">
    <div class="vip_clude">
      <div class="vip_level">
        <div class="level_img">
          <template v-for="(vip, n) in vipList" :key="n">
            <img
              v-if="selectedVIP === vip.level - 1"
              src="../assets/vip/vip_current_bg.png"
              :class="
                selectedVIP === vip.level - 1
                  ? `btn_vip btn_vip_vip${vip.level} active`
                  : `btn_vip btn_vip_vip${vip.level}`
              "
            />
            <div
              :class="
                selectedVIP === vip.level - 1
                  ? `btn_vip btn_vip_vip${vip.level} active`
                  : `btn_vip btn_vip_vip${vip.level}`
              "
              @click="selectedVIP = vip.level - 1"
            >
              <!-- <img :class="{ active: vip.level === store.vip , active: selectedVIP === vip.level }" :src="require('../assets/vip/vip_detail_' + (vip.level) + '.png')"> -->
              <!-- <p> VIP {{vip.level}} </p> -->
            </div>
          </template>
        </div>
      </div>

      <div class="vip-list-container mx-auto">
        <Carousel :itemsToShow="1" :wrapAround="false" v-model="selectedVIP">
          <Slide v-for="(vip, vipIndex) in vipList" :key="vipIndex">
            <div class="carousel__item swiper-slide">
              <div class="vip-detail-left-box">
                <div>
                  <img :src="require(`../assets/vip/vip_detail_${vipIndex + 1}.png`)" />
                </div>
                <div class="vip-txt-left-box">
                  <img :src="require(`../assets/vip/vip_detail_txt_${vipIndex + 1}.png`)" />
                  <div class="vip-txt-desc" v-html="vip.description" />
                </div>
              </div>

              <div class="vip-detail-right-box">
                <div class="vip-detail-promo-box">
                  <div class="vip-promo-title">每月红包：</div>
                  <div class="vip-promo-txt">
                    {{ vip.monthlyBonus ? vip.monthlyBonus + "元" : "无" }}
                  </div>
                  <div v-if="vip.monthlyBonus">
                    <template v-if="!store.token || vip.level == store.vip.split('VIP')[1]">
                      <!-- <div :class="redeemed"> -->
                      <button
                        class="vip-btn-get vip-receive-btn"
                        data-bonu-type="month"
                        data-vip-lev="10"
                        @click="onVIPButtonClick('dy2-vip-monthly')"
                        :disabled="btnIsDisabled || btnIsRedeemMonthly"
                      >
                        <span v-if="btnIsRedeemMonthly">已</span>
                        领取
                      </button>
                      <!-- </div> -->
                    </template>
                  </div>
                </div>
                <div class="vip-detail-promo-box">
                  <div class="vip-promo-title">生日礼金：</div>
                  <div class="vip-promo-txt">
                    {{ vip.birthdayBonus ? `${vip.birthdayBonus}元` : "无" }}
                  </div>

                  <div v-if="vip.birthdayBonus">
                    <template v-if="!store.token || vip.level == store.vip.split('VIP')[1]">
                      <button
                        class="vip-btn-get vip-receive-btn"
                        data-bonu-type="birth"
                        data-vip-lev="10"
                        @click="onVIPButtonClick('dy2-vip-birthday')"
                        :disabled="btnIsDisabled || btnIsRedeemBirthday"
                      >
                        <span v-if="btnIsRedeemBirthday">已</span>
                        领取
                      </button>
                    </template>
                  </div>
                </div>
                <div class="vip-detail-promo-box">
                  <div class="vip-promo-title">每月存送：</div>
                  <div class="vip-promo-txt" v-html="vip.cunsong"></div>
                  <div v-if="vip.birthdayBonus">
                    <router-link to="/center/deposit">
                      <el-button class="vip-btn-get vip-deposit-btn">领取</el-button>
                    </router-link>
                  </div>
                </div>
                <div class="vip-detail-promo-box">
                  <div class="vip-promo-title">流水要求：</div>
                  <div class="vip-promo-txt">
                    {{ vip.drawTimes ? vip.drawTimes + "倍" : "-" }}
                  </div>
                </div>
              </div>
            </div>
          </Slide>
          <template #addons>
            <Navigation>
              <template #prev>
                <img :src="require(`../assets/vip/left_arrow.png`)" />
              </template>
              <template #next>
                <img :src="require(`../assets/vip/right_arrow.png`)" />
              </template>
            </Navigation>
          </template>
        </Carousel>
      </div>

      <div class="vip_table">
        <table border="0" cellpadding="0" cellspacing="0" id="vip_detail">
          <thead>
            <tr>
              <th>等级</th>
              <th>升级要求/元</th>
              <th style="text-align: center">
                生日礼金
                <br />
                (3倍)
              </th>
              <th style="text-align: center">
                每月最低
                <br />
                累计存款
              </th>
              <th style="text-align: center">
                每月红包
                <br />
                (3倍)
              </th>
              <th width="280">每月优惠</th>
              <th>优惠流水要求</th>
              <th>平台限制</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>VIP1</td>
              <td>有一笔存款</td>
              <td>无</td>
              <td>无</td>
              <td>无</td>
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
              <td>存款至少100元可申请每月一次再存20% 最高奖金588元</td>
              <td>15倍</td>
              <td>电竞/体育</td>
            </tr>
            <tr>
              <td>VIP3</td>
              <td>50,000≤累积存款</td>
              <!--              <td>10888≤一个月内累积存款</td>-->
              <td>108元</td>
              <td>5,000元</td>
              <td>88元</td>
              <td>存款至少100元可申请每月一次再存20%最高奖金888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP4</td>
              <td>250,000≤累积存款</td>
              <!--              <td>38888≤一个月内累积存款</td>-->
              <td>388元</td>
              <td>10,000元</td>
              <td>188元</td>
              <td>存款至少100元可申请每周一次再存25% 最高奖金888元</td>
              <td>15倍</td>
              <td>电竞/体育</td>
            </tr>
            <tr>
              <td>VIP5</td>
              <td>500,000≤累积存款</td>
              <!--              <td>58888≤一个月内累积存款</td>-->
              <td>688元</td>
              <td>20,000元</td>
              <td>388元</td>
              <td>存款至少500元可申请每月一次再存50% 最高奖金1,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP6</td>
              <td>2,500,000≤累积存款</td>
              <!--              <td>88888≤一个月内累积存款</td>-->
              <td>1,088元</td>
              <td>50,000元</td>
              <td>888元</td>
              <td>存款至少500元可申请每周一次再存30% 最高奖金2,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP7</td>
              <td>5,000,000≤累积存款</td>
              <!--              <td>188888≤一个月内累积存款</td>-->
              <td>6,888元</td>
              <td>60,000元</td>
              <td>2,888元</td>
              <td>存款至少500元可申请每周一次再存35% 最高奖金3,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP8</td>
              <td>8,000,000≤累积存款</td>
              <!--              <td>288888≤一个月内累积存款</td>-->
              <td>8,888元</td>
              <td>80,000元</td>
              <td>5,888元</td>
              <td>存款至少500元可申请每周一次再存40% 最高奖金5,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP9</td>
              <td>12,000,000≤累积存款</td>
              <!--              <td>588888≤一个月内累积存款</td>-->
              <td>10,888元</td>
              <td>100,000元</td>
              <td>6,888元</td>
              <td>存款至少500元可申请每周一次再存45% 最高奖金8,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
            <tr>
              <td>VIP10</td>
              <td>20,000,000≤累积存款</td>
              <!--              <td>888888≤一个月内累积存款</td>-->
              <td>18,888元</td>
              <td>150,000元</td>
              <td>8,888元</td>
              <td>存款至少500元可申请每周一次再存50% 最高奖金12,888元</td>
              <td>15倍</td>
              <td>所有（彩票除外）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="vip_table">
        <table border="0" cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <th>等级</th>
              <th>VIP1</th>
              <th>VIP2</th>
              <th>VIP3</th>
              <th>VIP4</th>
              <th>VIP5</th>
              <th>VIP6</th>
              <th>VIP7</th>
              <th>VIP8</th>
              <th>VIP9</th>
              <th>VIP10</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>电竞返水</td>
              <td>0.40%</td>
              <td>0.40%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.50%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.80%</td>
              <td>0.90%</td>
              <td>1.00%</td>
            </tr>
            <tr>
              <td>体育返水</td>
              <td>0.40%</td>
              <td>0.40%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.50%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.80%</td>
              <td>0.90%</td>
              <td>1.00%</td>
            </tr>
            <tr>
              <td>真人返水</td>
              <td>0.40%</td>
              <td>0.40%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.50%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.80%</td>
              <td>0.90%</td>
              <td>1.00%</td>
            </tr>
            <tr>
              <td>电子返水</td>
              <td>0.50%</td>
              <td>0.60%</td>
              <td>0.70%</td>
              <td>0.80%</td>
              <td>0.90%</td>
              <td>1.20%</td>
              <td>1.50%</td>
              <td>1.80%</td>
              <td>1.90%</td>
              <td>2.00%</td>
            </tr>
            <tr>
              <td>棋牌返水</td>
              <td>0.50%</td>
              <td>0.60%</td>
              <td>0.70%</td>
              <td>0.75%</td>
              <td>0.80%</td>
              <td>0.85%</td>
              <td>0.90%</td>
              <td>0.95%</td>
              <td>1.00%</td>
              <td>1.20%</td>
            </tr>
            <tr>
              <td>返水上限</td>
              <td colspan="3" style="text-align: center">18888元</td>
              <td colspan="3" style="text-align: center">38888元</td>
              <td colspan="2" style="text-align: center">58888元</td>
              <td colspan="2" style="text-align: center">88888元</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="vip_ruler">
      <div class="ruler_title">
        <h1>规则与条款</h1>
      </div>
      <ul class="role-list">
        <li style="">
          <span class="role-list-decimal">1</span>
          晋升标准
          <br />
          会员的累计有效存款额达到相应级别的要求，即可在当日24点前晋级相应VIP等级。
        </li>
        <li style="">
          <span class="role-list-decimal">2</span>
          晋升顺序
          <br />
          VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升。
        </li>
        <!--        <li style="">-->
        <!--          <span class="role-list-decimal">3</span>-->
        <!--          降级标准-->
        <!--          <br />-->
        <!--          如果会员在上月（自然月）内没有完成相应的保级要求，系统会在月初自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级。-->
        <!--        </li>-->
        <li style="">
          <span class="role-list-decimal">3</span>
          生日礼金
          <br />
          VIP2或以上等级会员可享受生日礼金，每年仅可领取一次。（生日彩金3倍流水即可提款）
        </li>
        <li style="">
          <span class="role-list-decimal">4</span>
          每月红包
          <br />
          每月1号会员即可登录账户领取每月红包（每月红包彩金3倍流水即可提款）。上月需达到累计存款要求方可领取每月红包奖金。
        </li>
        <li style="">
          <span class="role-list-decimal" style="top: 10px">5</span>
          东赢保留对活动的修改，停止及最终解释权。
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue";
import { userStore } from "@/store";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import { claimBonusItem } from "@/api/index/promo";
import { ElMessageBox } from "element-plus";
import { getPriviVipCanRedeem } from "@/api/personal/vip";

export default defineComponent({
  components: {
    Carousel,
    Slide,
    Navigation
  },
  setup() {
    const store = userStore();
    const selectedVIP = ref(0);
    const btnIsDisabled = ref(false);
    const btnIsRedeemMonthly = ref(false);
    const btnIsRedeemBirthday = ref(false);
    const vipLevel = ref("");

    const claimBirthdayBonus = (vip) => {
      alert(vip.level);
    };

    const vipList = ref([
      {
        level: 1,
        description: "> 有一笔存款",
        monthlyBonus: null,
        birthdayBonus: null,
        cunsong: `无`,
        drawTimes: null
      },
      {
        level: 2,
        description: `升级要求 &gt; 5000≤累积存款<br>`,
        monthlyBonus: "28",
        birthdayBonus: "38",
        cunsong: `存款至少100元可申请每月一次再存20% 最高奖金588元`,
        drawTimes: "15"
      },
      {
        level: 3,
        description: `升级要求 &gt; 50000≤累积存款<br>`,
        monthlyBonus: "88",
        birthdayBonus: "108",
        cunsong: `存款至少100元可申请每月一次再存20% 最高奖金888元`,
        drawTimes: "15"
      },
      {
        level: 4,
        description: `升级要求 &gt; 250000≤累积存款<br>`,
        monthlyBonus: "188",
        birthdayBonus: "388",
        cunsong: `存款至少100元可申请每周一次再存25% 最高奖金888元`,
        drawTimes: "15"
      },
      {
        level: 5,
        description: `升级要求 &gt; 500000≤累积存款<br>`,
        monthlyBonus: "388",
        birthdayBonus: "688",
        cunsong: `存款至少500元可申请每月一次再存50% 最高奖金1888元`,
        drawTimes: "15"
      },
      {
        level: 6,
        description: `升级要求 &gt; 2500000≤累积存款<br>`,
        monthlyBonus: "888",
        birthdayBonus: "1088",
        cunsong: `存款至少500元可申请每周一次再存30% 最高奖金2888元`,
        drawTimes: "15"
      },
      {
        level: 7,
        description: `升级要求 &gt; 5000000≤累积存款<br>`,
        monthlyBonus: "2888",
        birthdayBonus: "6888",
        cunsong: `存款至少500元可申请每周一次再存35% 最高奖金3888元`,
        drawTimes: "15"
      },
      {
        level: 8,
        description: `升级要求 &gt; 8000000≤累积存款<br>`,
        monthlyBonus: "5888",
        birthdayBonus: "8888",
        cunsong: `存款至少500元可申请每周一次再存40% 最高奖金5888元`,
        drawTimes: "15"
      },
      {
        level: 9,
        description: `升级要求 &gt; 12000000≤累积存款<br>`,
        monthlyBonus: "6888",
        birthdayBonus: "10888",
        cunsong: `存款至少500元可申请每周一次再存45% 最高奖金8888元`,
        drawTimes: "15"
      },
      {
        level: 10,
        description: `升级要求 &gt; 20000000≤累积存款<br>`,
        monthlyBonus: "8888",
        birthdayBonus: "18888",
        cunsong: `存款至少500元可申请每周一次再存50% 最高奖金12888元`,
        drawTimes: "15"
      }
      // {
      //     level: 2,
      //     morethan: 20000,
      //     upgrade: 8,
      //     birthdayBonus: false,
      //     drawTimes: 3,
      //     drawLimit: "10万",
      //     level5: "每月单笔≥500元,返现15%,最高258元",
      //     description:
      //         "升级要求 > 5000≤累积存款<br/>保级要求 > 1888≤一个月内累积存款",
      // },
      // {
      //     level: 3,
      //     morethan: 200000,
      //     upgrade: 38,
      //     birthdayBonus: false,
      //     drawTimes: 3,
      //     drawLimit: "10万",
      //     level5: "每月单笔≥500元,返现15%,最高288元",
      //     description:
      //         "升级要求 &gt; 50000≤累积存款<br>保级要求 &gt; 10888≤一个月内累积存款",
      // },
      // {
      //     level: 4,
      //     morethan: 500000,
      //     upgrade: 88,
      //     birthdayBonus: false,
      //     drawTimes: 6,
      //     drawLimit: "15万",
      //     level5: "每月单笔≥1000元,返现25%,最高388元",
      //     description:
      //         "升级要求 &gt; 250000≤累积存款<br>保级要求 &gt; 38888≤一个月内累积存款",
      // },
      // {
      //     level: 5,
      //     morethan: 2000000,
      //     upgrade: 288,
      //     birthdayBonus: 188,
      //     drawTimes: 8,
      //     drawLimit: "20万",
      //     level5: "每月单笔≥1000元,返现25%,最高588元",
      //     description:
      //         "升级要求 &gt; 500000≤累积存款<br>保级要求 &gt; 58888≤一个月内累积存款",
      // },
      // {
      //     level: 6,
      //     morethan: 5000000,
      //     upgrade: 588,
      //     birthdayBonus: 388,
      //     drawTimes: 8,
      //     drawLimit: "20万",
      //     level5: "每月单笔≥1000元,返现25%,最高688元",
      //     description:
      //         "升级要求 &gt; 2500000≤累积存款<br>保级要求 &gt; 88888≤一个月内累积存款",
      // },
      // {
      //     level: 7,
      //     morethan: 8000000,
      //     upgrade: 1888,
      //     birthdayBonus: 588,
      //     drawTimes: 8,
      //     drawLimit: "20万",
      //     level5: "每月单笔≥2000元,返现35%,最高888元",
      //     description:
      //         "升级要求 &gt; 5000000≤累积存款<br>保级要求 &gt; 188888≤一个月内累积存款",
      // },
      // {
      //     level: 8,
      //     morethan: 10000000,
      //     upgrade: 2888,
      //     birthdayBonus: 888,
      //     drawTimes: 10,
      //     drawLimit: "30万",
      //     level5: "每月单笔≥2000元,返现35%,最高1288元",
      //     description:
      //         "升级要求 &gt; 8000000≤累积存款<br>保级要求 &gt; 288888≤一个月内累积存款",
      // },
      // {
      //     level: 9,
      //     morethan: 20000000,
      //     upgrade: 5888,
      //     birthdayBonus: 1288,
      //     drawTimes: 10,
      //     drawLimit: "30万",
      //     level5: "每月单笔≥2000元,返现35%,最高1888元",
      //     description:
      //         "升级要求 &gt; 12000000≤累积存款<br>保级要求 &gt; 588888≤一个月内累积存款",
      // },
      // {
      //     level: 10,
      //     morethan: 30000000,
      //     upgrade: 18888,
      //     birthdayBonus: 1588,
      //     drawTimes: 12,
      //     drawLimit: "30万",
      //     level5: "每月单笔≥2000元,返现40%,最高2888元",
      //     description:
      //         "升级要求 &gt; 20000000≤累积存款<br>保级要求 &gt; 888888≤一个月内累积存款",
      // },
    ]);

    // const fireCommonError = () => {
    //     Swal.fire({
    //         title: "系统提示",
    //         text: "请登录后再操作",
    //         confirmButtonText: "确认",
    //     });
    // };

    const errorCount = ref(0);
    let countdownInterval;

    const onVIPButtonClick = (bonusItem) => {
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
        ElMessageBox.alert("请登录后再操作", "系统提示", {
          // if you want to disable its autofocus
          // autofocus: false,
          center: true,
          confirmButtonText: "确认",
          showClose: false,
          buttonSize: "large"
        }).then(() => {
          store.loginPageVisible = true;
        });
        return;
      } else {
        claimBonusItem(bonusItem)
          .then((res) => {
            const redeemAmout = res.data;

            if (res.code === 0) {
              console.log("bonusItem:", bonusItem);
              // Success
              ElMessageBox.alert(`你已领取 ${redeemAmout}`, "系统提示", {
                confirmButtonText: "OK",
                type: "success"
              });

              if (bonusItem === "dy2-vip-monthly") {
                btnIsRedeemMonthly.value = true;
              } else if (bonusItem === "dy2-vip-birthday") {
                btnIsRedeemBirthday.value = true;
              }

              // location.href = `/center/deposit`;
            }
          })
          .catch((err) => {
            errorCount.value++;
            console.log(err);
            if (errorCount.value >= 3) {
              // Disable the button after 3 or more errors
              btnIsDisabled.value = true;
              const currentTime = new Date().getTime();
              const expirationTime = currentTime + 30000; // 30 secs in milliseconds
              localStorage.setItem("vipButtonDisabled", "true");
              localStorage.setItem("vipButtonExpirationTime", expirationTime.toString());
              // Start the countdown
              startCountdown(expirationTime);
              ElMessageBox.alert(`按钮将在30秒后启用`, "系统提示", {
                confirmButtonText: "确认",
                buttonSize: "large",
                showClose: false,
                center: true
              });
            }
          }); // End catch
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

    const reduce = () => {
      if (!store.token && Number(selectedVIP.value > 1)) {
        selectedVIP.value--;
      }
    };
    const plus = () => {
      if (!store.token && Number(selectedVIP.value < 10)) {
        selectedVIP.value++;
      }
    };

    const checkPrivilegeClaim = (type, btnValue) => {
      getPriviVipCanRedeem(`dy2-vip-${type}`).then((res) => {
        if (res.data === false) {
          btnValue.value = true;
        }
      });
    };

    const checkPrivilegeClaimMonthly = () => {
      checkPrivilegeClaim("monthly", btnIsRedeemMonthly);
    };

    const checkPrivilegeClaimBirthday = () => {
      checkPrivilegeClaim("birthday", btnIsRedeemBirthday);
    };

    onMounted(() => {
      vipLevel.value = store.vip.replace("VIP", "");
      if (vipLevel.value >= 1) {
        selectedVIP.value = vipLevel.value ? parseInt(vipLevel.value) - 1 : 0;
      }

      if (store.token) {
        checkPrivilegeClaimMonthly();
        checkPrivilegeClaimBirthday();
      }
    });

    return {
      vipList,
      claimBirthdayBonus,
      store,
      selectedVIP,
      vipLevel,
      reduce,
      plus,
      onVIPButtonClick,
      btnIsDisabled,
      btnIsRedeemMonthly,
      btnIsRedeemBirthday,
      errorCount,
      startCountdown,
      checkPrivilegeClaimMonthly,
      checkPrivilegeClaimBirthday
    };
  }
});
</script>

<style>
.carousel__next {
  right: 30px;
}
.carousel__prev {
  left: 30px;
}
</style>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.vip-container {
  letter-spacing: 0;
  padding-bottom: 20px;
  background: url(../assets/vip/vip_bg.jpg) no-repeat top center;
  background-size: contain;
  padding-top: 600px;
}
.vip-container button {
  border: none;
}
.vip-container .vip-header-box {
  width: 1184px;
  height: 134px;
  /* background-image: url(../img/vip/levelbg.png); */
  background-repeat: no-repeat;
  margin: 0 auto;
  display: flex;
  padding: 9px 4px 0;
  justify-content: space-between;
  position: relative;
}
.vip-container .vip-header-box .current-vip-bg {
  position: absolute;
  width: 62px;
  height: 78px;
  /* background-image: url(data:image/png;base64,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); */
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1;
  display: none;
}
.vip-container .vip-header-box .vip-header-item {
  width: 44px;
  height: 46px;
  font-size: 16px;
  color: #515e6b;
  /* background-image: url(../img/vip/vip_header_list.png); */
  background-repeat: no-repeat;
  background-position: left top;
  cursor: pointer;
  z-index: 2;
}
.vip-container .vip-header-box .vip-header-vip1 {
  background-position-x: 0;
  background-position-y: -46px;
}
.vip-container .vip-header-box .vip-header-vip2 {
  background-position-x: -44px;
  background-position-y: -46px;
  margin-top: 17px;
}
.vip-container .vip-header-box .vip-header-vip3 {
  background-position-x: -88px;
  background-position-y: -46px;
  margin-top: 34px;
}
.vip-container .vip-header-box .vip-header-vip4 {
  background-position-x: -132px;
  background-position-y: -46px;
  margin-top: 51px;
}
.vip-container .vip-header-box .vip-header-vip5 {
  background-position-x: -176px;
  background-position-y: -46px;
  margin-top: 68px;
}
.vip-container .vip-header-box .vip-header-vip6 {
  background-position-x: -220px;
  background-position-y: -46px;
  margin-top: 68px;
}
.vip-container .vip-header-box .vip-header-vip7 {
  background-position-x: -264px;
  background-position-y: -46px;
  margin-top: 51px;
}
.vip-container .vip-header-box .vip-header-vip8 {
  background-position-x: -308px;
  background-position-y: -46px;
  margin-top: 34px;
}
.vip-container .vip-header-box .vip-header-vip9 {
  background-position-x: -352px;
  background-position-y: -46px;
  margin-top: 17px;
}
.vip-container .vip-header-box .vip-header-vip10 {
  background-position-x: -396px;
  background-position-y: -46px;
}
.vip-container .vip-header-box .vip-header-unavailable {
  background-position-y: 0;
}
.vip-container .vip-list-container {
  width: $maxwidth;
  border-style: solid;
  border-width: 4px;
  border-image-source: linear-gradient(237deg, #6f8fec 0, #81adfe 100%);
  border-image-slice: 1;
  margin-top: 64px;
  margin-left: auto;
  margin-right: auto;
}

.swiper-container-rtl .swiper-button-next,
.vip-container .swiper-button-prev {
  width: 50px;
  height: 55px;
  background-image: url(data:image/png;base64,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);
  background-size: cover;
  left: 44px;
}
.swiper-container-rtl .swiper-button-prev,
.vip-container .swiper-button-next {
  width: 50px;
  height: 55px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA3CAYAAABO8hkCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTEyLTAzVDE3OjEyOjI4KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMi0wM1QxNzoxMjozNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0xMi0wM1QxNzoxMjozNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozZjZkNTUwOS1kMWNj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);
  background-size: cover;
  right: 44px;
}
.vip-container .vip-list-container .swiper-slide {
  display: flex;
  padding: 62px 107px;
}
.vip-container .vip-list-container .vip-detail-left-box {
  width: 517px;
  height: 263px;
  display: flex;
  background-image: url(../assets/vip/vip_detail_item_bg.png);
  background-repeat: no-repeat;
  background-position: right bottom;
}
.vip-container .vip-list-container .vip-detail-left-box .vip-txt-left-box {
  display: flex;
  flex-direction: column;
  margin-top: 11px;
  justify-content: space-evenly;
  align-items: center;
  padding-left: 19px;
  padding-right: 63px;
  color: #73561f;
  font-size: 14px;
  flex: 1 0 auto;
  .vip-txt-desc {
    text-align: left;
  }
}
.vip-container .vip-list-container .vip-detail-left-box .vip-btn-ljsq {
  width: 144px;
  height: 33px;
  background-image: linear-gradient(-38deg, #a88f5d 0, #e3d5a8 100%);
  border-radius: 5px;
  font-size: 14px;
  color: #702929;
}
.vip-container .table,
.vip-container .table td,
.vip-container .table th {
  border: 1px solid #bac8dc;
  font-size: 12px;
  color: #fff;
  background-color: #7197ff;
}
.vip-container .vip-list-container .vip-detail-right-box {
  padding-left: 33px;
  padding-top: 6px;
  font-size: 14px;
  color: #515e6b;
}
.vip-container .vip-list-container .vip-detail-right-box .vip-btn-get {
  cursor: pointer;
  width: 100px;
  height: 36px;
  font-size: 14px;
  border-radius: 0;
  /* background: -webkit-gradient(
  linear,
  right top,
  left top,
  from(#3a97e5),
  to(#42d2e8)
); */
  background: -webkit-linear-gradient(right, #3a97e5, #42d2e8);
  background: linear-gradient(270deg, #3a97e5, #42d2e8);
  color: #fff;
  margin-right: 10px;
}
.vip-container .vip-list-container .vip-detail-right-box .vip-btn-get:disabled,
.vip-container .vip-list-container .vip-detail-right-box .vip-btn-get[disabled] {
  background: -webkit-linear-gradient(right, #85898d, #b0bec0);
  background: linear-gradient(270deg, #85898d, #b0bec0);
}

.vip-container .vip-list-container .vip-detail-right-box .vip-detail-promo-box {
  width: 465px;
  height: 60px;
  background-color: #d2d8e2;
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 5px;
  justify-content: flex-start;
  gap: 5px;
}
.vip-container .vip-list-container .vip-detail-right-box .vip-detail-promo-box .vip-promo-title {
  color: #364160;
  width: 108px;
}
.vip-container .vip-list-container .vip-detail-right-box .vip-detail-promo-box .vip-promo-txt {
  width: 260px;
}
.vip-container .table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 1246px;
  font-size: 14px;
  margin: 60px auto 0;
}
.vip-container .table .table-header {
  background-color: #7197ff;
  background-repeat: no-repeat;
  height: 60px;
  color: #fff;
}
.vip-container .role-list {
  margin-top: 20px;
}
.vip-container .role-list li {
  /* background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTEyLTAzVDE3OjEzOjM2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMi0wM1QxNzoxOToyNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0xMi0wM1QxNzoxOToyNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphOGQ3MGZhMi01OTk0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); */
  background-repeat: no-repeat;
  background-position: center left;
  min-height: 48px;
  padding-left: 65px;
  line-height: 28px;
  font-size: 14px;
  color: #52697e;
  margin-bottom: 10px;
  position: relative;
  display: flex;
  align-items: center;
}
.vip-container .role-list li .role-list-decimal {
  position: absolute;
  left: 0;
  top: 13px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  width: 48px;
}
.vip_clude {
  margin: 0 auto;
}
.vip_topImg,
.vip_topImg > img {
  width: 100%;
}
.vip_level {
  height: 176px;
}
.level_img {
  height: 120px;
  display: flex;
  margin: 0 auto;
  max-width: 1180px;
  padding: 2px;
  justify-content: space-between;
  align-items: flex-start;
  background: url(../assets/vip/levelbg.png) no-repeat center center;
  position: relative;
  img {
    width: 100%;
    position: absolute;
    width: 60px;
    height: 75px;
    z-index: 1;
    &.btn_vip_vip {
      &1 {
        left: -7px;
        top: -20px;
      }
      &2 {
        left: 120px;
        top: -3px;
      }
      &3 {
        left: 245px;
        top: 14px;
      }
      &4 {
        left: 371px;
        top: 33px;
      }
      &5 {
        left: 497px;
        top: 48px;
      }
      &6 {
        left: 623px;
        top: 46px;
      }
      &7 {
        left: 748px;
        top: 30px;
      }
      &8 {
        left: 874px;
        top: 14px;
      }
      &9 {
        left: 1001px;
        top: -4px;
      }
      &10 {
        left: 1125px;
        top: -20px;
      }
    }
  }
}
.level_img > div {
  // background-image: url(../assets/images/vip/badge/vip-bg.png);
  background-size: auto;
  /* background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABfCAYAAAB7spBFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNzJjYTJiNy05N2RiLWRiNGEtYTFlZS02ODhjY2E2N2MxODUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTBFM0M1RURDODEyMTFFQUFEMjFFRjZFNUE2NkFFN0QiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTBFM0M1RUNDODEyMTFFQUFEMjFFRjZFNUE2NkFFN0QiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVjZDk4ZjYyLTI4NWItYmI0ZS1iYmY1LWFiNjY0MjVmNmRlZCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk4YzdiNDY0LTU0NWUtMTFlYS05OWQ0LWE5MDkx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); */
  background-repeat: no-repeat;
  width: 44px;
  height: 46px;
  cursor: pointer;
  display: block;
  position: relative;
  text-align: center;
  background-image: url(../assets/vip/vip_header_list.png);
  z-index: 2;
  &.btn_vip {
    &.active {
      // &:after {
      //   content: "";
      //   position: absolute;
      //   background: url(../assets/vip/vip_current_bg.png);
      //   left: -8px;
      //   top: -21px;
      //   width: 60px;
      //   height: 20px;
      // }
    }

    &.btn_vip_vip {
      &1 {
        background-position-x: 0;
        background-position-y: -46px;
      }
      &2 {
        background-position-x: -44px;
        background-position-y: -46px;
        margin-top: 17px;
      }
      &3 {
        background-position-x: -88px;
        background-position-y: -46px;
        margin-top: 34px;
      }
      &4 {
        background-position-x: -132px;
        background-position-y: -46px;
        margin-top: 51px;
      }

      &5 {
        background-position-x: -176px;
        background-position-y: -46px;
        margin-top: 68px;
      }

      &6 {
        background-position-x: -220px;
        background-position-y: -46px;
        margin-top: 68px;
      }

      &7 {
        background-position-x: -264px;
        background-position-y: -46px;
        margin-top: 51px;
      }
      &8 {
        background-position-x: -308px;
        background-position-y: -46px;
        margin-top: 34px;
      }
      &9 {
        background-position-x: -352px;
        background-position-y: -46px;
        margin-top: 17px;
      }
      &10 {
        background-position-x: -396px;
        background-position-y: -46px;
      }
    }
  }
}
.level-active:before {
  content: " ";
  left: 22px;
  top: -23px;
  /* background-image: url(../assets/images/vip/badge/vip-bg.png); */
  /* background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAaCAYAAAA0R0VGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNzJjYTJiNy05N2RiLWRiNGEtYTFlZS02ODhjY2E2N2MxODUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDJCNDZGNDhDODEyMTFFQTk2MjY4ODIzOUQwNkY0MzEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDJCNDZGNDdDODEyMTFFQTk2MjY4ODIzOUQwNkY0MzEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVjZDk4ZjYyLTI4NWItYmI0ZS1iYmY1LWFiNjY0MjVmNmRlZCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk4YzdiNDY0LTU0NWUtMTFlYS05OWQ0LWE5MDkxZDEwM2I1NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ps5fPccAAAS6SURBVHjavJdfbBRFHMdnZndv9/5Te6VQsY3tFUrEBHzwbx8I0RJ9UaEqtZqQxsaY+EJC8EGNPkp8UggSY9IQ+6Am+EB84AmRiArlX8UWmoBpadVyV8X+ud7t7c78nLnM1nG869le4ibfzN7t/Pb32d/85jcz+KlPAdVw4TK/9Reu2oFZI1ggooEKIKaAwf8JFwAFMhTAAEyIKvdQCxyuMFTlhgcrUJZ8j6nA+VJYtlAlHXQfoMKVGyKsRUJtg34CLKSIyD4eV1G+m2l2ug9Upl8J0NQMDEVEMaJaq8I5jXiy7mlj4J0IWtjuovClU/SZN8dg27Rmg7Q0KOdD9bP0ECtDJCLgcIW5IrJ15P+m7GcqfcM78PEXouxON2ZeymFzXQ/jk/2KnaXAmNLGls/D2vstdXKZWg6Z0tDuxCfaTORZp2H3DTlERdmHytaW8FEXLIctBUeMqSGexZQoYNkaSgpY3EergXzyDewa06JYktG+691/Ra2HvdfXCsNHGmHipQ4Yiv+EOy8DIkT5+uDLBUB8Am3OptnFjhDk1y9CbOwr3P9xHsWLSv4spYD8oMgedvAV7uPDdTDe2wHnQ8N4+3ktDUBP/pLzNWxqH2N+mDLfirHpvs3sbFpAcCW4klxrVHGCJGZunDKKgHmOB1ZU7yPthBIpmFzLfbzKfdjcRyjKMn3yo/9RL0mZqYxdSqYopUiI32fH8Za8AnZXA4w387ZeKrHTO/J8iP6ZFv1NOtfS5X30soyqeJ7awEbb5b2AjM/ge4SPbODDo3imXF0Rw6rOolLChyB3NUYzKQbIM1hxXRKm52+aD90SQ9nuf7/pcffooVZ6YaMDOW8DG2lq887tBWAYAJBQmM3em4TMTDP9saWzOPjaRv9sT4a0XZonKYhDNrHTPbwnzjKPeih0qwCRK+Nk6/sTxjbxfleWodLQYr624gq5FI3CH8lnc299wnOpfY6s/e6M0z/4SGGwu55N7Pg71MTDiFnVqv3vpOXUL+aWoU3e6R4bcs0+tn89Gd7flzHSt/njHNcCV14FDODUar80C4W2Fo4/eH/hxCHMa6KPnawBXgIjaqOaLkyv2V37h8K930ooAbfIVVAjZyqVX18pStBXnN2XGwvDn6f8G70YLTQwVPs1Y6Y/42DnJNCiEjFfgkEwW9Xlw5f1zJUGJcMziX3H8hD+OUjgWpSD2PWvEweOKWBqxHx1CSPKLAWlzgSAwiifJ3Wz150nD1NeKxh3sFr5DBWuRp77oEhis1rEdDCoVEoCQE+N4Gi8+2LWTH9ZS9SmrAcGbkafGJE5Vgls2f2cHsGCTFrzQt3rA4/dfrvdhHzDSvMsb6RGfki98QW/nVNmZrESWLXNZrAmusHCvWDdjUeTLx60WK6BYdMGZJjVd6XU5zO8kDfrf+M/73DNlwFb0U4YtEkiAEld4VrkvpmjBwj466EEjnH1mIGoVbxEW5O5pqa9s3bbolZsodIuGVc54BBtU2DLxdvWtlC4wgfSMhXAVaJGVxM5Pf987d5VFmqyDBxTAH0ZLW+5PFsNnFpugoliaAW7nK1+2FEPPDXDqQVahSPLQC0HCSs5iZn/8eVYiyKrcoqqeKJayVn2LwEGAB5W1KDIhmhYAAAAAElFTkSuQmCC); */
  width: 39px;
  height: 26px;
  display: block;
  position: absolute;
}
.level-active > p {
  color: #b39b5a !important;
}
.level_img > div > p,
.level_text > span {
  font-size: 16px;
  color: #6c757d;
  text-align: center;
}
.level-active > img {
  filter: none !important;
}
.level_img > div > img {
  filter: grayscale(100%);
  margin-top: 12px;
  margin-left: 2px;
}
.level_img > div > img:hover,
.level_img > div > img.active {
  filter: none;
}
.level_img > div > p {
  margin-top: 24px;
  font-weight: 400;
}
// .level_img > img {
//   margin-right: 30px;
//   margin-top: 50px;
// }
.level_text {
  width: 1200px;
  margin: 0 auto;
}
.level_text > span {
  display: inline-block;
  width: 62px;
  margin-right: 30px;
  margin-top: 10px;
}

.vip-carousel {
  max-width: $maxwidth;
  margin-inline: auto;
  border-style: inset;
  border-width: 4px;
  border-image-source: linear-gradient(237deg, #6f8fec 0, #81adfe 100%);
  border-image-slice: 1;
}
.vip_link > img:nth-child(1) {
  float: left;
  margin-top: -20px;
  margin-left: 20px;
}
.vip_link > img:nth-child(2) {
  float: right;
  margin-top: -20px;
  margin-right: 20px;
}
.vip_lable {
  width: 1318px;
  height: 403px;
  overflow: hidden;
  display: flex;
}
.lable_class {
  display: flex;
  width: 100%;
  margin-left: 50px;
}
.lable_class > div {
  width: 200px;
  position: relative;
}
.lable_class > .level_card {
  background-image: url(../assets/images/vip/vip_bg.png);
  background-size: 100%;
  background-repeat: no-repeat;
  width: 351px;
  height: 356px;
  margin-top: 30px;
  margin-left: 30px;
  padding: 0 25px;
}
.level_card .card_title {
  height: 90px;
  margin: 0 13px;
  padding: 19px 22px 0 27px;
  display: flex;
  justify-content: space-between;
}
.level1,
.level1_img,
.level_title > div {
  display: inline-block;
}
.level_card .card_title p {
  margin-top: 5px;
  font-family: "Bodoni MT";
  font-size: 32px;
  font-weight: 400;
  font-stretch: normal;
  letter-spacing: 0;
  color: #fff;
}
.level_card .card_title img {
  width: 60px;
  height: 64px;
}
.level_card .card_content {
  padding: 45px 48px 19px 45px;
  height: 243px;
}
.level_card .card_content > ul {
  padding: 0;
  margin: 0;
}
.level_card .card_content > ul > li {
  list-style-type: none;
  background-repeat: no-repeat;
  line-height: 22px;
  padding-left: 40px;
}
.level_card .card_content > ul > li:nth-child(1) {
  /* background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNzJjYTJiNy05N2RiLWRiNGEtYTFlZS02ODhjY2E2N2MxODUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTI2ODY1QjlDODEzMTFFQUFBRThCNkIxRTYwQjE1RjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTI2ODY1QjhDODEzMTFFQUFBRThCNkIxRTYwQjE1RjEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVjZDk4ZjYyLTI4NWItYmI0ZS1iYmY1LWFiNjY0MjVmNmRlZCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk4YzdiNDY0LTU0NWUtMTFlYS05OWQ0LWE5MDkxZDEwM2I1NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq0v4XMAAANZSURBVHjabJVNSFVBFMfnqmGFQUQuEpRwl0VU5AdESCYI0SIxMAiUiKhwU7SIiGoRQquCdkWBoJCBGUEWLatF9kFIUEhBBRVpaPRBi/LOmX7z9e6V+95z3pw558z//OfMmWNijFH28/zWBWWUl9GtMVrOIe1ETsQoUdZqnM16JcwVuE5iOI380SoFW2f/eYdRpcLHGFE+SLIEGWc57IB8oBiwtPY208hcidiH/7/gthhYtI7iUjZuErG8VJ7logBSklUr8go85o1kyBUlxqBYNbY/jIm4ucTOnoivDSgmSwvau4g/7VoskwIwG8MmJjPKptcmgFhIS8ba3TcEZDnLuM5II4kCsITkOwdlPnApYxGAUMoFCUNH2cgd5ikXxOmlDLAdSeJnoxpFZJcHkNzxs0BiT6jNNuxbdFiXzbHOGK2ShXRItDSbHKgLYDyrmBbk9Vz6MLbGVItKswLIlRvKwOYsY3upItzFZpfl6jWswymaGJe4uG6RLBcZY4AZHTpNj1g2lgGM3nCSk1rLo5gSbWQa3Slsk05n/bTsZt9B5KoCY47RyGs7DqXqeJl8PpskuQyjEaiNoKvjJL3MrzjVBgqozVUKrxD2RxHfsufhImC9kPbg0OZr2v+wpZP67ke8Ash+gtRwQe8Y3az3SKxlf8lN+PcVgVO9A8PqfF55evdVktwT/9q+urLz8mOAxwjQ70vUtgNVjX5jIRUA1/ptibsc95eYrSapOIT4BZAHBJsDYC9g9VBsj4FspYTLXVYAXtD6uwovLKaDMY/mNxu08UWinMyzB/QbTNfGrhbK8m8RWOQll9cC4ZWlpqPUDCcYBmRO3NtJ7IO/gX45Hs2AtfgSdaApeX5frIpU32ZXB5RaPDM32pmeIv3g4gZYT+MzDlg9cp3kGhU/nwg0Xq7cpoh8DaeW2NShWMm6AXMDy3XMlRx/M+YaHdtm9txH0UwUU5HSqJUM4dWFU08uHbHvDqJJWddEMJX16WfMF5l/lUlFap0WcB0gjzV4dwVA15gw1vqenAULj+MJ4wC6uXzbzKXCdV0LNIvDPsBPoD7mGLoqjP0i1LgYTqiusmOQE8zEDlkGOC01FoQfjDNItuH3Ym5FrnX/QBM1D+4L/G6ynnJsAmi+bf4XYADmV8MQ6ulJ4wAAAABJRU5ErkJggg==); */
  background-image: url(../assets/images/vip/badge/money.png);
}
.level_card .card_content > ul > li:nth-child(2) {
  background-image: url(../assets/images/vip/badge/highest.png);
  /* background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNzJjYTJiNy05N2RiLWRiNGEtYTFlZS02ODhjY2E2N2MxODUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjZDMkYxOEFDODEzMTFFQTg1RkVERTgyQTE2MjBGOEIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjZDMkYxODlDODEzMTFFQTg1RkVERTgyQTE2MjBGOEIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVjZDk4ZjYyLTI4NWItYmI0ZS1iYmY1LWFiNjY0MjVmNmRlZCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk4YzdiNDY0LTU0NWUtMTFlYS05OWQ0LWE5MDkxZDEwM2I1NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoC9x2gAAASsSURBVHjaPJVvaJdVFMfvufdZf8yGOipWI8ag1Noqo39aFEVOxkyG9CL690KKeiGFFUQFQS8iShKZBWtCaISBveiNLwLtD2JGCEZlYlhIaSEajDWdbc9zz+lz7rP1Y8/vd5977vme7/mec8/k4GevhhhjsBBCFGEtQST6b6+IrJUoDyaJRyqJb2Cu3cZvMH/w4XQoH2nXjuH7laoGMys2A1QtLE4xPqUmmwDujhaJaLcFsQ9wOiliOMc5YJsH6uTrGoJOsv1XAW7qOsSEs7M1WcrvNoKt9iwIcJaYBwi2W6KdCp6JA3Hc1HqyhIc0hH58egFYEaMeJ+Jj4J6qcs4wVmyyXGP8mGxuhZESeTtO4zD9CZTa0XLgHAEl5wVI9DbMHsXPfUvGZNmNdSXMPwW4ATh2ArJZHDSmf0Oy59X0Q43SRElz2luphVhJf8ZMflOxBktV9C3gLoss87NVrpuQozyJZsOAepYvADqeC0gsOrr25ozJI3mhJWaAXjeRPzU074Oa5lljWwbzi6u6aboB3UhqoSPZJ8GqMagF1Uza5IGuHAxR59bsVWRRWkdCj8cCFOYyy96CLDqAqRPg2XuIvBQmU6S5NSaCqpTKezAQ+YsElx4W35sCQqqADFEd7xyX6F3I7sdhAzgHLOTJqmmaNd46EtP+RvWoZS3pxrkHViOAvEPRFtPbh5Okl2H1B3tvYbuMM4fRiULKBK34tahdIJhVdV0PeKXptWNVjOctoanGwpg2vI4u34ZzT2gvz2AjzS3U4hecSVlqidVrGm3C7TmEaZX2gnlXXCGaPOWJ0LYS3d0RVPIlluVN1zGldJpAYxRxPe83ieiVLhM3ciuE9pZu8f4m8+w3GD2r3GQrRdJEE2jbUl5dCxugPeLFRvstSLU5Z9tFds/gfj3BDlGM9yxanu9lZ0p5ugg8VWnOZ3nrI/ISbynzC6O20MRGQpaOKqWvGmtGVdQZHQf4JSRZaKrnpLSeldkRSj3kDhiP0edH/Ob9yMad3L4bOyxdjmGKmk9zdBdAs/i9gkwzuVCXtlOCnPMCO7AHLHta+ngtGq/gXBeMdQ9t+XRu5D5yHkgpHmQoYY87YLODOVGK2QK2U61Nee6ytEw92CL2VrudLPcx3TJA4Qc0uhnNXiSnbzlo7lymYSpToAC7+lbSVorEJKRIIrkE4usRrvhdLGpq8lEaurt3mrO1mq3zQUSQ87g66zJfUZabp6WaPl19zGpZSxleWYvt3sbyONldinS7cRlNQ6t6vaI/I8NyVbsBp/s5eQHgQy5JmRVlXrdj3YOUXctlh8UgPjvZv4qC/srORuyn05pV18JKGa3yHbFvB6sXoEEOwN5OAvEP3jMcKuBaQO0inj7WPgVHebp4P0OvP4tK3ziZqrDxFINf0/A43lvIcj3Vfpj3dZJlLxkdxX6GmZE5ugix+yDyAP16dcmD9uJrEzLs86JQeoC97HP/tvj8zvoJDnyulp9Dx34uzDB7w643M6ItqP0/3P+mcDtZMTrtRONYqQWq2vEoJVOmgxdomtftnNlDJ61EyyEuTn8UW+IZAjsJ7gnevwT9C6Q7Vq5zIcjMRntvv/8EGACe1322fntIUwAAAABJRU5ErkJggg==); */
}
.level_card .card_content > ul > li > p:nth-child(1) {
  font-size: 14px;
  color: #6c757d;
  letter-spacing: 1px;
  font-weight: 600;
}
.level_card .card_content > ul > li > p:nth-child(2) {
  font-size: 10px;
  color: #6c757d;
}
.level_card .card_content > .slogan {
  margin-top: 20px;
  font-size: 14px;
  color: #e3cb87;
  text-align: center;
}
.level1 {
  margin-top: 17px;
  margin-left: 60px;
}
.level1_img {
  margin-left: 90px;
}
.level1 h3 {
  font-size: 32px;
  color: #fff;
  font-weight: 500;
}
.level1 p {
  font-size: 14px;
  color: #703b3b;
  margin-top: 5px;
}
.level_title > div:nth-child(1) {
  width: 17%;
}
.level_title > div:nth-child(2) {
  width: 80%;
}
.level_title {
  width: 70%;
  margin: 0 auto;
}
.level_title > div > img {
  position: relative;
  top: -20px;
}
.level1_text1 {
  font-size: 14px;
  color: #e3cb87;
  margin-left: 95px;
  margin-top: 10px !important;
}
.lever_button {
  background-image: linear-gradient(-38deg, #a88f5d 0, #e3d5a8 100%);
  text-align: center;
  font-size: 11px;
  border-radius: 5px;
  width: 100px;
  margin: 20px auto 0;
  a {
    color: #833824;
    text-decoration: none;
    display: inline-block;
    padding: 5px;
  }
}
.level2 {
  width: 100px !important;
  margin: 190px 20px;
}
.level4,
.level5 {
  margin-top: 30px;
  background-size: 100%;
  background-repeat: no-repeat;
  margin-left: 30px;
}
.level3 {
  margin-top: 30px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAFBCAYAAAAhR6DOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNzJjYTJiNy05N2RiLWRiNGEtYTFlZS02ODhjY2E2N2MxODUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUIzNDM1NzZDODE0MTFFQThGQUVDMTAwMUQ5OUEyMEQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUIzNDM1NzVDODE0MTFFQThGQUVDMTAwMUQ5OUEyMEQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVjZDk4ZjYyLTI4NWItYmI0ZS1iYmY1LWFiNjY0MjVmNmRlZCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk4YzdiNDY0LTU0NWUtMTFlYS05OWQ0LWE5MDkx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);
  background-size: 100%;
  background-repeat: no-repeat;
}
.level3 button {
  background-color: #4aa5d9;
  border-radius: 2px;
  padding: 0.25rem 1.8rem;
  color: #fff;
}
table td,
table > thead {
  border: 1px solid #4c535b;
}
.level4 {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAFBCAYAAAAhR6DOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNzJjYTJiNy05N2RiLWRiNGEtYTFlZS02ODhjY2E2N2MxODUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkQyMjUxMjZDODE0MTFFQTkyOEFCRTkxMTdFMjZDODkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkQyMjUxMjVDODE0MTFFQTkyOEFCRTkxMTdFMjZDODkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVjZDk4ZjYyLTI4NWItYmI0ZS1iYmY1LWFiNjY0MjVmNmRlZCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk4YzdiNDY0LTU0NWUtMTFlYS05OWQ0LWE5MDkxZDEwM2I1NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsHB6hQAACULSURBVHja7H0JmCRXcWbUXV19VFWf093T54ymhxHSSCA+G8nWBdgCX2jtzwj7w+u9tF4WFhuBdtey8bHyLoeQzGnwGmyMP5v1gSQ+HxIGSRyLF81IGglmpNH03dN3dd1VXXduxKvsOTuzK19WdVVlxT8EPZruzM7KjHgR///ivbQpigIMY8h+4ttGDxlE+0m016HdgDaJ1o3WhraNFkabRTuF9jzak2irWifzvO9WfghVgpNvgQQqGzQ60X4F7V1ob0Cza/wcBcGwaj+u/lsJ7QTal9H+HC3BN702sPMtkPB/fQugfQRtCe3TaD+CZlf2Pu5Ss6vHfVo9z0fU8wLnaw6ARr6X70E7h3Y/mr9K5/Wr56PzvpefGQdAI6aACbSn0T6F1gsGh/sKjc77SbRnMo98a4IfAgdAo0TAT6EheVVuhRp5/hX24/T7Mo8889P8HDgA6o370B5H69rn30u/7zEMgvv4EXAA7P/4ryhkD6I9hOZQ/3u/jX7vQ9sPP/0gPxEOgP0GOd0DDXItD3AQyMPGE2HGsP3xp/8TfvlsA17au9vuu+OP+AlxANQM6Y8/9Wb88gSaowEvr4h2l+++O7/BT4oDoPrO/9BTA1BuVTjQwJe5hnaD7wN3rvMTqwzcClE59f2ijPPbfG5wvn4EHIf6wOa067dR2GyglBQoLUehcHIRSlspo7+Oru8LaCyRcgaoHlIf++Y78MtXDB/osIP37deDY7LH8KGlUBIyf30KlFRW5pLvaf/gm/4PP7m9wSrQns7/DR8O2w/LTFo5RgPgmOiWezC9HeC8fhAkJ8seLl83gwPAdOUD70EbkvFDm8dpqnuNyifJCeMhcd0MDgAzSH70n30KKB9Ek/pTmN+CUiIjF3f5IhTOroMi/+d+un5+ihwAZkb/d5hpblPSeSi8cF7qVxdnt6C4GDHTNtSDdg8/RA4AMxFwr9nmtfyL56EUNqbmKNkC5P5lBqrQOPcf+BlyAEgh8eGvDykK/AiJZGastJ2H/Esrxkb/hTAU1xJg9nfT9dPn4KfJASAx+CtvQ7OZ9UDHQCe4rjfmg46RIDiPDkAVIoCu/6f4YXIAyOCNpm9u0Afen7kO7N3txtSfNhd477oWHGPdDfE5OABaMgEoN5hpVwZ0Ys9dx4SeLwOb1wnet14Ltp52s23Tx/lpcgDIYNTMwe43jIFzvMfcw8EM4rntGrC5TPXeDfOj5ACQyQC9sqOufcgP7pvGLj9hSYH86VXIfPMVKMW2L/9dhSJk/+8M5E4siL9fCtfUADiO9JvJAEF+mtrgZjjNCABqwvEYH1Js4Hn9aHkW+NLTZfKQ+c606PEpLITB9/bjghuQ5Jl58gzkXloGm9sJjoMBcAxevqGE542TUJjeBGU7z8+FM8C+RUBSqv8Ha3bn0QO7ElvPTRgYPhcUV6KQ/tpLIhAy33gZnf88ljl2cL9+ZFfC7OjvBKcgxFJzAUl+lpwBZEqgZfxiuIh3HO7bvWa32cA52Qv20ytQSGWhsBSG1N8+B0o6V/52pwecdKxn90fium4Yci+vynyUVX6aVQ6Ap/7NacvfmNdNwBx+ud7oca6J3t0DCh1djPqL4Yv/lspdpAihFKQffxHaf/EmcBzo2jULSDbWLbTC8zKCO//0Ws4Ae1MA5UX88nOGa8pAm0ZkOMAxHBBtavS/UiQFpWQWbF4XOEgqRe5gD/jKHaC7phZ7+VjjeJGfZrVLIKUlIuBZqcNKu98cKova7pyCIpJgKCqQ+ZdZyP1wGRzBdmh782uQADvAjn/XKoFADRwJPMcbilY5AFrifirKd6C80NyQCF+KpMsj+pWny+Qh/eRpKC5FRJtCiWp//FrciEPq8VNgo+yBBNj31tfuSoSVfKnSXamvfFTfZv9nFcgwnp+fjGPJ8V2jXfj5hS3t4IimoRBKQGErCaXtnPj5Ur4ARfzvgmpKobT7sfQ9439exM+xyU+TVSDZMugx/P/bjBxSmEF/e9NRofpcVgJhrd/+86/HET+B3lyC7MkFoeo4hwLgvf0I2JwOMfPr0Ogbyp1ZkUm9j/FDrEkAKC3i/wotLH/ISBlEI3xuegPc1wxcnW47PMKEQ58rr/YCjwNch/rLO0boZI7czIYMCf4bfqNADQLgtmOtsu1Mx2osmaTXFb2t4qChmd3vzYBrtEeH0IL4fu40ZgD6OZv+Obe/Ow2leMaoL5/0d3ScaZ1nZQSv5RLIABn+pJEAIOSxDMp8fxbabj2i+TPuY4PgHOkWM8MkcWohd2YVss/Ni14ig+BtEpkEV6UM+jraGUPUUylB+ulXIHtqUfvEOOzbu7yi9tcMJCTUqSdeglKhaJT8rqL9BT+9GpVAz5weaKFbNKDcMHLu41Deca3ywMkXIfm1U1BKZMH7xkO6Nf5uyP5gGdJf/yEUI2mZi/7sqaVrclZ9Irdfu17fAGi9KkiMpr+LNmLoOOQDySd+ALnZDWj70UPgntp7Z8X8UliUTxQAV7ZGVwiKmM/xU6thALSarnDq/JHcDQdf/R386xdljs+9ui7KGedgADzXDona3+5zi/JHKZVAyRSgsBKBLNb7hcWt8iSZPB7B6w2xa9c0A7SgtKYof14s2X/PYS+NSB2eyUN+blNYrVBS7JnVeM8Xrf58qvnpmARXhuOnlo98YyFyYKQKW5XUzND5vZvJ4HNQfneZ29IRYMY4ACoG9TZ/Bu0kca94pgMSWR/s09sgDVm24IJQKkDXTP9Hk3cvod3Fj5A5gOx9uRft9+GKRTFL0QE42jcLNltj3YXzsX4sgS6bUZtC+ycov9GGMsIZLoG4BKoEt6M9r478V60IyxVdsJ7saagLjm53YWbS3HuIssCL6ufp5cdbjQBQLGmjaH+rvvH9Or2f3cAAyOTdDVH4F4t2WMbRf4/P5kR7N9o5tPvQ3E39rOqfASzl+W1oWOoor6D9fCXHkO8tRgdFyVHvGFiO90Oh5Kj0syI/UJAfKKfR3sYRwByAtg//CEhsguVyOaBk7wBHKV63i3e53NDuc0N42/Chh9H+oVn5QTXf6tWqHOBGtKfR/sqo8zsdChwaSMG1B+OwmeqGdK6tLoNgoeiEVzZGwO/Lww1jUejvknqXWMvzg1YLgB1Z84RKdg1hpGcbbj4SEiPQ96e7YT3WBguxIShQKbSPf0po9HuTWTf8cKkL5kPtMNaXgmsGk9DuKchUAe9GOwdWnz9o4QC49CHTV0PrfHs6c3DdaAxH2xycmOmG2Y12KJZsqirkhvPojPs5+m8k+yCZu6j6RFMuODnbDamMA46Px2CiPwV2u+E6YWf+gPZQ+dlGl0GrxSDkOEBzkYDb1VH/mNED29xFGO7ehu6OHEyvdUA4ufvgGM10QbsrCL2+cM0/DDn+erL3qgcpCHG4DbOSV2SDW6ZCMLfeAUtbbTL84HGw4PxB1Uhwk9Bg2p32EbS7jR5IY/tYXxoOYsmzsOmDkzNBdT2K9udeSQ5AmzMDPle6Zh8oX3Jh6TOsXsXu10INpDNr7bAS9gqu0tOZxcDwwmbc8DanxA/ejPbHaNQIaMkGOyuWQNSr8CDayzLOfyCQgVuPhcDjKsGz00ExglayGItexrIQO4hO6qxJ3UOS63z0IBRKlY1Z2zlHmR9gAI9jMJf5geH26obkB2alY6sGAA3c71Qd/wGqYIwc3OXLw9HhBAwGM/D8XADOrnRArmDs9pDzL8RGRDBUOwbOx4dgu2C4nFH5QRD5gbNa/OBuK42WUgHQgFMjN6I9hfaXaKNGjnWgM0wKWTMhanxy/vi2U/paUvk2WIwPV/Xzrad7IZL1Sx9PGWw54oXvY0ajBfi3TG2J8k7iXIfRvor2JNoxC0wEN30GIFnzs6B2a0rJmugMZVkziATSU5WLiqKzrqf6qjLVG834YS1VnSWohaINZtbb4QRyGpo/OD4Wgz65+YOfAIvMHzTr3qB03b+G9j/U9GwIJGsOdWeEj51Ax6d6udpYT/WDx5GDgCcqr/jk22EpXv03HG1nkR8sdkGgPS+4QQCDYSXcBqmsw+gzIH7wSyrn+hSpwvslg9Y1AJT6RsCd6s2WlDUz0N2Rh+m1dix5XDWN6EWs2x3+HHS4UoaPzRS8MI98olTD64uknJgNAjCEvOf4RBRWsUxa2Gy7MMdhkB/QgHQ/2qOsAtUGE2hfRfumjPOP9W3D6yZikMnbxUO/6Py1HKlssBAfRfLqNXQcTa7NxsehqDhqf41i/gD5wbmgUBFumQojP8jInOqw+nyeknk+rAJpo0NNsVIKxIFAFm47tgVeV1E4/vmttn2dyCMnnkNnzhYrUxBJ65+JTVQsd1YLZX7gE/eI+MH1Y3HkB1IVzR3NxA8aOQB2ZM3TUrJmWwGODidVWdMvJWtWzbnQmWfRqfNFp+7QVCg68OfGRRDUC8SHTi91wlKoTZ0/SFlm/qCZZFCSNb8lK2tODKTh2EhClDnk/GZkzWpZjkb2+KSmc4sgSUxApuhpCGk5nHLBidkAJDMOuH48BuP9abDZFaPnCaA9hHYa7e5GXE0gqQLVrIaglPkHaP9eJjipdp1E51/a8sKz5/wqmWuctg1auE7lzaR/Dlz2/FUZgpy/ka6XHvNK2AMbMbfgUD+G/GAWy6TzW16jp9rhB8+g/Re0H3AJdHUgvk9Nmfcava5yt2ZCyHknpv0whw/JoJKxf0FABJfKHFEOYc1fLAdF2fkbE4IfrPnEvfX7CsgPEtDbKcUPboeL663l+UEVU0AjrAh7C9ofysmaJSFrBtvzgsDth7JTDZCzz8QnYKR9GRZTB4Xq0wxIi/6iDnG/Dx9IQ6AjL5ru9nv+wCq7Quykxa+blTVPzvqbxvkvZgIPTCMnaBbnvxQR0V/kV/uL4jDRv920/UX1CIAdWfMleVkzDF5XCU7M+EU9qvBLUOrDDyIeeHY6AHabgvwgYnb+gJao3liP2lviw0t5HBXltAj9Y2iG5/dJ1hzqzoqy57nZTkhsO2tTkDEMIV8AmF5rg2UkyyRAXDeSF4ERShjOyMQPaKnq52GP9QfNuCieIvu7aH9p1PnL3ZrbcO1ICiJY5rwwd6nzMxoF2zk7nEZ+sISBQCXRNYNpmfkDB+zz/EGtA4CY/v+GcrfmzUYPppR681RURPyz012wHnOzpzU6P0gSP+gS65OvH0/UhB/Uf01wZaXVe9E+BFLdmnkYCmbL3ZpY59PowmgufrCMZdB63A1jvRm4BQex2Y02s/MH70d7oSE4wB74SbSHwZSsWYCZ9bamU3YYl6PcX9QmOAHxg2B7Elbl+QFVEX8C5baYqq1PtskQ2q+98zmtaP0oSEpaY30ZdP4sLIa8glCxsmM9BDsKcAj5XDTthNWw2+j8wQ5ogYWYP7j1WFRqNi7w228yxwGuqKk60B5E+6FMv8dAIAf4QcQi9BMznbC05RFL+Ky5/25rWzjpRH7QifzAjvwgCeP9GVP9Rd86EzA9f2CmuN7p1nxVTUuG5vJJ1pwaTsOBYA6en+uEsyu+unVrMvaXH5TnD7rEOxZumYrBwR6pZZmCH2AQPI12oywJlvU4kjW/B2VZc9CQzqXKmsdG0hDFEeHUXAckth3sGS3ID2aRH5yc6YIuXwFeO5oS4ocEBD/49pnAF9AM9xcZ4gCPvfO5PvzyYbRflQmeg1jjT/Zvw3ms8Rew1m/UhjXG/oOWqR7Ckoj4wUrEPD+47TXa/CD4oTcZC4DH7jlJtJ3aWH8LJGXNQSx1KP+QKsCyJmPX0RjHw0HkhGMYCGsYBAsh5INyg+Q02v23Hovtuj6520gAoPPTFnn0pnQpWXOoOye6B2eFrMkzuIy9QVvQj/ZmhSo4t+GF81vSreLPoL0fA+EFwwHw6D0niWTQbNzPyfzm0b6sKHkWMYpZ1mTIgAbQyYGMIMurmBG2ElLzQrSxxp9R9YKBsCoqEr0AQMenbs3fBMlejAF/DqaGtmEt6ob5TS/kClznM8zyg4LgjmL+oAr84O6v3JS7KgAevecEeeovQ3kya9Do2TvbijCEdT5F7cy6l5UdRtX5wQHiB1hZ0OC6GHKb4gd3f+UNj14IgK++48RNUF6Z86NGz0ayJl1Uvz8Pc+j46zFuX2DsBz/IqfxAukGS+MF7bH/3i89+ASRlzeGeHEwgY18OY0RueljWZOwrP5hAfmBHlyvzAymB5cN01L81elRPZ0HIVVQ8PTfTwbImY99BPndmySf6iyb7qYFyhx8Y80WnYjDqqM4nUkJ1PsuajHqDfDCS6hAD8nVjKcEPFgzwA2elSwpHe3Oi7lrCk5+cbVdlTdY2GfVHub/IBRtxJ4ygn958JIH8wCNK870zwB4+PBDIw9RQBiPLBSdn2lnWZDQs8uibs2seWA27YHIgC4H2bSyLXLr8QPM7JGsOBvPgw7LnhTkfy5qMpuIHp5fa1PUHWUgjL9DiqZqMgZw/lnLAqXl2fkZzIoL8YB0rF6pidEjw7jUQ6fpnVxprr0oGwzA/gJ0FN4pGCaToHs1gWCEKNH1ZUwZVFPZ/hgV8X9F/uyTPYDFaGjQPsA27vH1F4RqIYQEU0YVdNu0cQPMAOdB4/RD38DOaHaVSuZNUy5fterUTg2EVHgDMARiM3UogjdpITztlMJpm9IeduQDFYAZg32dYJQJ0M4CizZ6p7a3EgcBo9gygSJDgkmITr75hMCwMt+56AOYAjObPAIpeLdSm2wrBVIBhhRpIrxVCtxlOUTgCGBbgwFLNcJWRaAajOYiwZgbQ+paicD8Qo/mdf48UwDPBjJaG5jzAXvopg9E05Y/MPACD0RoZQKsXSAGdDgoGo1k4gP6aYM4ADOYAzAEYzAF2O5LBsEIE6GUA0FkPwFHAsEYM6K0JLr9DSTt98P1jWCAB6PUCJfBrcNeo4QhgNDkKxfJbjHR6gVgGZVi7/NnxZWMkmMFoAeh2g3IFxLACB5BbD8ARwGiBCNCUQWkxvI3XBDMswQIA9GTQXUGvPLUje1aK9XklUu/hTn52FkFoOlHXBAC6JZDWgUrr3jSGxXKAti936b4kj3uBGFZxfg0/tum0QvCqYIaVWIBBDsATwQxrOP9FX96dAyj6B3IEMJo9AvTe6b7n7tDs/4xmL3/kVoSx5zMsVQeBsQBg/2e0gP8Dy6AMazu/vgzKK8IYrcACtH2ZZVCG9csfReJF2ez4jBbhADoyqKIwB2A0PQfYWRVmKANwCmC0QgogDpDWzAAcB4wmR6GEo7xdnwPk+TYxrFwC2XSWtDhBZ29ERVE4BTCavvxRdvZH1CiBgEsghpXLfz0/5m1RGC0NbRlUsbEMyrAEB9jxZUMZgHaFsNv4BjKsngE0vlFU2TMnAIaFOYCHJ8IYrREFu8Or0wrBHIBhBQ5gU1shDHIA9nuG9RMAt0MzWsH5dXeF4H2BGJYPAhtoL4jhJZEMS3OAy79WzgHY8RkWCwJDAcDFD6M1SLDOijBQtOUjBqN5Rn+JVgjgTmhGC5RAuu3QXAYxrFL+GJZBywfxTADDKkFgUAbdkUCZAjCavfzR82PiAEW+TQwrj/56Xf20PXpS60CFN0hnNDku7gqhUQLxe4IZlk8Beu8JZv9ntLD/czs0ozWCQI8DaB7FHIDR/M5vK3c0GOUA/JI8hlWG/z1ekrc7iiUF2bONMwDDEuWP8QUxnAIYFgkBRTsF+LkEYnAJpJc+2P8ZVi6BeEUYw/pBoN8Ord8NyiSY0eQM4LKvV5Ng5gAM5gC7pw32f4YVOICiSC6I4RBgWJ0GczMcw/oZAPQyAEcAo4UjQFMFUi6sCOYIYDS7/2urmdwOzWgZFrB7BtApgXhRPKPpnV+56MucARicAXbhAGntA3kmmNHcKJZKum39lAHymlHDvs+wQgkkwwEuzARzEDCavPzR47I8E8xoEQYgI4Oy7zMs4P/yMiiXQAwrjP8yJVAJj7DZOA0wmj8E9HeH1jisVAKxqyi7P6Op3V+/rd9j51vEaGF4+f0ADOtnAJZBGUyFeUEMo4Vd3/CCGIUjgGGREkhqQQzwghiGRXKAnh9zOzTD8iWQHnhrREYLU2DmAAzmAIpO1PCCGEbzMwApDsBEgNEKRIBJMKOlibBTUfZ4SR73QjCamgMol33dLQMUOQMwWjcDACT1GDQHAqOZIV72aLNJyqCcChgWGP73eD8A7w3KsLL/swzK4CjQ5QCax/BEMMMKvr9HK8QeLwljGZTR1BGgXEFqK8wAxJ5tOuyZwWiaDKDIvCeY7x3D2uU/wc+7QjBaGpqtEOWV9NwKwWh2CqBc8GVDJRCD0RoZQI88MBdgWIEEg5QMyrvjMqwSAYpxGZQzAKMVMgDLoIyWCALDHAAUzgAMizi/IsEBFADeHZdhgQhQLvqykRKIwWgFaJNgLoEYViHBuiUQb4/OaAkKrCWDKntEDvs/o7kpgO50FnGAlG7gMBhNHQAK2MCmywEKesUPxwGjmUFvOwXdXSF0FsVzKmBYhwUY5ADAHIBhEQ4Ae3AA3QMZDKsEgaEA4PKHYbUiSIMEKxrkoaSSBw4CRnO7vt7GWNpbI5L/cxJgWCcCdoOX1wMwWtj/waPTCsEyKMMKsIHcm+K5GY5hlQygSLwl8rL8wWA0cwToFDK8JJLRMjGgUQIpOgfya1IZze78ymVfK88A7PcMqwSB7vsBuBeI0QLOrzAHYDAH2CUDgM5b8hQOBYYVOIDOW/KcPA3GaIUMIDUPoNRxHmD0WA8/OYtg8cxW/Qmw9mtSGzMDLNTxpjFaKQOAUtA6SuGpYIbFOYD2rhAMhgVQKpXAbtde98X7AjFaowQyOg/AlQ/DUhGgmQFA0SEO3AvEsAoJ5t2hGYyrMwDocAAWgRiWqYCMzgMUiT3b7Oz/DEtEgIYf23R7gXhbCIbFmXAX7wrBaBESDEyCGYyKSTAo9W2GYzCqlgEUXRKs85ZIngdgNDn8HR0QSyaNzwNE8SA6uL2tje8io+ng9bhhfGgQ/dcL4URCpwTSQC6fh41wBHq6uiDY2QkbkYj4NwajoWt6hwP6gkEI4OC9GgqJgVz35/Wa3eKptLBufxdMDA1BJJ6AUDQq5ggYjEaCzWaDYFcn9AYCEI7F4czcfIUkuIIaPxyLQTQeFyc/dHAYNjEIophWFG4VZTQAOrBM7+/pgdT2NsyvrBiqVJyVunARnX0dy6BoKiVKovHhYVjf2hK/lMGoB9wuF/R3d4vRfyMchkQ6bbxkMnpANpeDNXT8Tp8P+YEfg6EL+UGY+QFj30ALXHr9fuhG/yNuGo7H5DmD7IEUbWR0ERNDwxBJxGGL+QGjxuhq7xCjfhzJ7bmlRTP+Rgf+meN4z8+s4V+OoY3LnGU7mxUcwefxwmBvn3gvawazBNMDRjXh9XjgYP8AOHD0p1GfOGhJ3sn+H9ovfOmVe//ItkNk//XRz9+NXz6Kdlj2rB63W5REvjYv8wNGVVCWNbshgLxzNbQpHN8EVtH+G9qXv/TKfxSOb7tUycEgcOOX96F9iMi17G/p9LXjBXeJF+1tMj9gSEDImuhDPYEgRLDGD0UjZk6XQ3sE7cGj45PJ//7EWy7+nt2kzF85+vlB+mG0XwUTDXPED/oxeokf0AdgfsCoBB1tPlHnUwURicchVzA1gP492m+8Znxyeucf9gyAC4Ew9fkb8cvDaLdLM3aMZIpiSmEUBDx/wNDCpbImOX5SQta8BK+Q4x+dmHziym/8ZqUBcDEQPlcVfhAQ/KANNrZCzA8YFwdJJLY9/gB0o1HJHI5FzZwuqlYvnzo6cSi32w8YDgDCu6Y+R/zgvWi/jeaX5gftxA/8ZX4Q3mJ+0OLo6iBZsxfiyQRsmSuThayJ9gA6/preDz4gEwCXBEKV+EFAsPtIImb2gzOaEF63BwZ6eiFfKAiSu53NmDkdyZrvPTp+6GQlP/zAkxcDwLADf/nsr5GU9O/QbkJ7RvaKw/EonFucE3xgcngUGb9f1H4Ma8PhcMBgbz+MDx2EGI76K5vrZpyffPFdaDdX6vxXQmomWE0aL6DdgSbND6i/iHo4aMEC8YMxvCnroRCkM8wPrIZyt6b/gqz58tyMmdNRbf9xtP+J5Y7od5aVVSRbIS77dY+i/YPKD34LLWD0bNlcFta3NpEfdEBvMIjlkB/5QYj5gUXQTrImljvp7TTMryxB3txzfRztA0cnDk9XhYBX6TPuROQU2hdVQmIYiVQSFleX8UZtY4ochT4kR3o7+zIaGyRrDvcP4sgfEILH+lbIjPOfQXsr2tunxg9P72zcLGPmSyDtb22o/ODTYGL+gPhBFMlxT6Ab+cEYhKJhiCbjPH/QJCjLmkEhdGxGtsTzNIEdWfOTaFUvCWo1vO7wg3+FJpWqqNGJbt7i+jK43bS+cwR8Xl6f3Ojoau8UogbJGdNLc2acv6RWE0fU6qIm9bAcB6h8IDbPD7I5WM+W+QFlhGCpxPygAUGyZn9vnyhxljfWYDtjWtZ8tzqQmnC/WqlAxi5hhx98iVi7WiIZzjzxVEJYN6bWcRxhIjiybGFpxPMH9QXJmv3BXvB3dsFaaEOUriZAsuZ9aF+BfdqRaj8ZZgjtXjA7fxCLwLmFGXX+YJznD+oEuufdXUHxDGgy65W5c2acP4v2B2q581d7Or9i0uoUADXgB+eRH3hgbGiU+cE+gmRNUumcTifMryxCKGrqjZ5UJr9WLZGTlVbgVfL/qqtARj+4KX6QEeuTN1R+0AOBUhEDg/lBrUCyZh+WO7Rt/gbe52Ta1PsVSdZ8P9qT9fxM9RbZd/jBNWifBTPzB2vnIY3Ea3xojOcPqu0ktAg92CPuLd3jpfVlM84fVev847LOX/cMUIMFv8QP/jPan4CJ+YNILAyxeAS6MRtQbUqpOYZ1Kc8fyKOroxMHlD7RrTmzOAtFzLKSoMHtT6G8JDHUKJ+vniWQHj8w1V9EZRApRtR2PTY4CuvhTRy50uzNBlDu1hxAgkuy5ipsm+vP+h7ae0BD1qynAzZqnUD84Fq0D6gp07isIPqLNiCEWYHmD4b7h0QNy9AHyZoHegdgDMudaDIGK5umnH8Z7ZfQfqxqzl/lEqiRC+Ur+UFBjh8kYEnwA+ovGhfpnPnB1bgoa05AoVCAs/OvivJREhQxJGsehUpkTS6BKuIHf4z2hyDdX0TrkaNCLaKHTPyARjjmByRrtkM/DgzUrTm3siDKHpPZ+36QlLibIgDqtOvVi2b5gZg/QD4QT8aRHwQEP9jAMqlV+YHb5RYZkUZ/ui/JdNLM6UjW/HW0f671dVfT+5qxFqgSP1iHLcwClBGG+4eFM7QKyrJmrygJadQ/jyWiCeePqo5/fD+cv9okoFmL4SrygyWRAVqFH3S1d8EEloA2/DOzNAORuPSGUyW1LKVn8AnZZ8AcoDr84DOqmeAHMegOdKNzTCI/CEHMYvzAc6msubliVtb8DpR3EHyhHp+l1UsgrfrTZH9RCUKRECytLwlnGRscA5/X1/Q3pixrHhAZjoJ61ZysuQhlWfO2ejl/1ctBi2X46vGDWHPzg7KsSSvqJlVZ82w1ZE26tw0ta1pZBTLKD2j9we9BuQXb8OdMJOPCguhEY4PjWCJFBGkuybcC7BtI1uzr7i8vQl+eq4asSb07c43y+arpfs3OASrlBzR/8BY5fhAW8wfUX3SRH0Qbkh8IWTNIsqYdNiNVkTWpU/cpK4sCrTAlSg/yJ8zzg03kB4tij9NG4wdlWbMP6/wJMeN9HnmMSVmTHP+41Z2/VQKgRvygtyH4QVnWnFRlzWmIYMaSBMman4OyrEm7ehRawSmsXALVjB/srE8W/ABH3Ugd+IHH7b1C1jQ1m/0ttN9oFmWHZdDq8QNK80/InoRG2+nFc+r65EkIdAZrvj65LGsOXiJrmnL+HVnzDrCIrLkvGcBCKtiF3cbQPgZS/UVF5AcbkEBnpAAYOzAGG5H1qvcXUYkT6ApCr79XZJyz8y+bOR3JmrTwiHbpaL5GqHqrQGC9BsrH0P4RTO9vugadWJN3+/swGGh98gbk8znTF9fe1qHKmimYX503e85H1XJnoVkfVgPsC2RJVIkfxIURPxgfmlT5QUiKH5Rlzf5yt6aQNU29IfGMWvY9A4yW5wD7xA9eVfnBIVEeVfxQLsiak6KUKsua0s4fveTzsPNzABjmBz8NpuYPNmBpfUH0F5FOv9f8QVnWPKTKmufMyJqUcqhT1lTHLAcAg/YuqsL8wZqYP+gO9MFQ/0FwXTF/QLLm6OA4tPs6YWVzWfAHEzsw0Ej/BnXkD1ntgdR/WxRouWWE1ekvSsWEBbt6RHkTTYRFj1G3vxf8HQEMklWIJUy9EJpkzf8K5b01GUyCa8YPPqMGxF0yJwnHt4TjEy8Y7h8Vfz87f8bMdZGs+RDa/1L/bm3UWwadGjvG/AD5ATotBQCthjoiww/CWBKRmcTfob1/avzYIo/nzAH2Feh0pBJdZ4YfmMAP0O7Aa/gFdn4OgHoGQQ7N9PpkA9hSy7DX4e99hp+AOdhk+trvHv8E3zltHDPDD3RAgUWL0H8HLKjs7CcenX8fZ4Ba8wPVzlTpnDTS3wQWlTXrCZZBawfiB7SgRLq/CMqy5gfR/ppvJ3OAZoTs/kUkZdJ8w1F2fg4AK8BIf9HfqI7/u9AKmn4zlkC8n6xpfnCXmhkunVChvU9/HbhhjTNAi/ADygbUlz+tZoeb2Pn3H/9fgAEAUkKkI2hPbh4AAAAASUVORK5CYII=);
}
.level5 {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAFBCAYAAAAhR6DOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNzJjYTJiNy05N2RiLWRiNGEtYTFlZS02ODhjY2E2N2MxODUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkEyMkQ1QUJDODE1MTFFQTk4Q0Y5NUExNEM4OEUwQjciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkEyMkQ1QUFDODE1MTFFQTk4Q0Y5NUExNEM4OEUwQjciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVjZDk4ZjYyLTI4NWItYmI0ZS1iYmY1LWFiNjY0MjVmNmRlZCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk4YzdiNDY0LTU0NWUtMTFlYS05OWQ0LWE5MDkx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);
  margin-right: 85px;
}
.level3 > h3,
.level4 > h3,
.level5 > h3 {
  margin-top: 100px;
  font-size: 18px;
  color: #fff;
  text-align: center;
}
.level3 > p,
.level4 > p,
.level5 > p {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  color: #fff;
  width: 130px;
  margin-left: 38px;
  text-align: center;
}
.level_p {
  margin-top: 25px !important;
}
.vip_ruler {
  width: 1244px;
  height: 602px;
  margin: 50px auto;
  text-align: left;
  .role-list li {
    background-image: url(../assets/vip/list_item_bg.png);
    background-repeat: no-repeat;
    background-position: center left;
    min-height: 48px;
    padding-left: 65px;
    line-height: 28px;
    font-size: 14px;
    color: #52697e;
    margin-bottom: 10px;
    position: relative;
    display: flex;
    align-items: center;
  }
}
.ruler_title > h1,
.ruler_title > img {
  display: inline-block;
  vertical-align: middle;
  margin-top: 30px;
}
.ruler_title {
  width: 100%;
  text-align: left;
}
.ruler_title > h1 {
  // font-size: 24px;
  // color: #8999c7;
  // width: 170px;
  color: #3865e8;
  font-size: 26px;
}
.vip_ruler > p {
  margin: 30px 50px;
  font-size: 14px;
  color: #61718d;
}
.vip_table {
  width: $maxwidth;
  margin: 20px auto;
}
table {
  width: 100%;
  text-align: left;
}
.vip_table th {
  height: 20px;
  line-height: 20px;
  border: 1px solid #bac8dc;
  font-size: 14px;
  color: #fff;
  background-color: #7197ff;
  padding: 10px;
}
table td {
  height: 60px;
  line-height: 25px;
  font-size: 14px;
  border: 1px solid #bac8dc;
  color: #6c757d;
  text-align: left;
  padding: 5px 10px;
}
.td_button > span,
.td_button_blue > span {
  width: 201px;
  height: 47px;
  line-height: 47px;
  border-radius: 10px;
  cursor: pointer;
  display: inline-block;
  text-align: center;
}
.td_button,
.td_button_blue {
  text-align: center;
}
.td_button_blue > span {
  background-image: linear-gradient(162deg, #2483ba 0, #376aae 100%);
}
.td_button > span {
  background-color: #333b44;
}
.vip_button {
  width: 300px;
  margin: 0 auto;
}
.vip_button div {
  width: 300px;
  height: 66px;
  line-height: 66px;
  font-size: 18px;
  margin: 50px 50px 50px 0;
  text-align: center;
  background-color: #333b44;
  border-radius: 33px;
  color: #6c757d;
  cursor: pointer;
}
.blue,
.purple,
.red {
  font-size: 12px;
  display: inline-block;
  margin-top: 30px;
  position: absolute;
  bottom: 90px;
  left: 55px;
  right: 55px;
  text-align: center;
}
.red {
  color: #ef8eae;
}
.blue {
  color: #56adff;
}
.purple {
  color: #c6add0;
}
.button_active {
  background-color: #1c95a7 !important;
  color: #fff !important;
}
.ruler-table {
  width: 1200px;
  margin: 50px auto;
}
.ruler-table > thead {
  border: none;
}
.ruler-table td,
.ruler-table th {
  width: 400px;
  height: 54px;
  line-height: 54px;
  color: #6c757d;
  font-size: 14px;
  text-align: center;
  border: none;
  background-color: none;
}
.ruler-table tbody > tr:nth-child(2n) > td,
.ruler-table th {
  background-color: #333b44;
}
.privilege {
  word-break: break-all;
}
.privilege span {
  margin-left: 5px;
}
</style>
