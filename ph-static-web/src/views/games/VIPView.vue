<template>
  <div class="vip-container">
    <div class="banner-container">
      <div class="btn-wrapper">
        <div class="center">
          <div class="page-headline">VIP</div>
          <div class="page-subline">Exclusive privileges for members</div>
          <!-- <div class="page-blend">GET NOW</div> -->
          <!-- <div class="page-liner">
            Araw-araw na 10% deposito, hanggang 5,000 pesos
          </div> -->
        </div>
      </div>
    </div>
    <Carousel :itemsToShow="2.95" :wrapAround="true">
      <Slide v-for="(vip, vipIndex) in vipItems" :key="vipIndex">
        <div class="carousel__item">
          <div class="vipitem">
            <div
              class="vipcontents"
              :style="
                vip.upgrade === 'Successful deposit'
                  ? 'padding-top: 120px;'
                  : ''
              "
            >
              <div class="title">Upgrade requirements</div>
              <div
                class="inner-vip"
                :style="
                  vip.upgrade === 'Successful deposit'
                    ? 'font-size: 20px; padding: 5px 0;'
                    : ''
                "
              >
                {{ vip.upgrade }}
              </div>

              <div class="second-vip">
                <div v-if="vip.monthly">
                  <div class="title">Monthly Bonus</div>
                  <div class="inner-vip">{{ vip.monthly }}</div>
                  <a-button
                    v-if="vipLevel === 'VIP' + vip.vipLevel && storeToken"
                    class="claim-btn"
                    :loading="loadingMClaim"
                    @click="dailySlot('jolly88-vip-monthly', 'monthly')"
                    >Claim Now</a-button
                  >
                </div>
                <div v-if="vip.birthday">
                  <div class="title">Birthday Bonus</div>
                  <div class="inner-vip">{{ vip.birthday }}</div>
                  <a-button
                    v-if="vipLevel === 'VIP' + vip.vipLevel && storeToken"
                    class="claim-btn"
                    :loading="loadingBClaim"
                    @click="dailySlot('jolly88-vip-birthday', 'birthday')"
                    >Claim Now</a-button
                  >
                </div>
              </div>
            </div>
            <div class="viplevelcircle">
              <img
                :src="
                  require('../../assets/images/vip/badge/badge-' +
                    vip.vipLevel +
                    '.png')
                "
              />
            </div>
          </div>

          <div class="inner-vip-mobile">
            <div class="game-title">REBATE BONUS</div>
            <div class="rebates">
              <div class="rebate" v-for="(rebate, i) in vip.rebates" :key="i">
                <div class="value">{{ rebate.rebateValue }}</div>
                <div class="name">{{ rebate.rebateName }}</div>
              </div>
            </div>
            <span class="note"
              >*Note: All the Bonus, Deposit amount and withdrawal amount in
              PHP</span
            >
          </div>
        </div>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>

    <div class="vip-program">
      <div class="game-title">VIP PROGRAM</div>
      <div class="buttons">
        <div
          class="common-btn"
          :class="{ active: showRebate }"
          @click="showRebate = true"
        >
          REBATE BONUS
        </div>
        <div
          class="common-btn"
          :class="{ active: !showRebate }"
          @click="showRebate = false"
        >
          EXCLUSIVE PROMOTIONS AND BENEFITS
        </div>
      </div>
      <div v-if="showRebate">
        <a-table :pagination="false" :columns="columns" :data-source="data" />
      </div>
      <a-table
        v-if="!showRebate"
        :pagination="false"
        :columns="promoExclusive"
        :data-source="dataExclusive"
      />

      <span class="note"
        >*Note: All the Bonus, Deposit amount and withdrawal amount in PHP</span
      >

      <div class="left"></div>
      <div class="right"></div>
    </div>
    <div class="terms-conditions">
      <div class="game-title">Terms &amp; Conditions</div>
      <div class="terms">
        <div class="term" v-for="(term, i) in terms" :key="i">
          <div class="circle-wrapper">
            <div class="circle">{{ i + 1 }}</div>
          </div>
          <div class="term-text">{{ term.text }}</div>
        </div>
      </div>
    </div>

    <a-modal v-model:visible="privilegeClaimedModalVisible" centered>
      <div class="modal-div">
        <span class="img-item">
          <div class="inner-contents">
            <div class="amount">{{ amount }}</div>
            <div class="bonus">BONUS</div>
          </div>
        </span>
        <img src="../../assets/images/index/bonus.svg" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { ref, defineComponent, computed } from "vue";
import { claimBonusItem } from "@/api/index/promo";
import { userStore } from "@/store";
import { Carousel, Slide, Navigation } from "vue3-carousel";
// import { message } from "ant-design-vue";

export default defineComponent({
  name: "TransitRecordView",
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  setup() {
    const store = userStore();
    const amount = ref("$0");
    const privilegeClaimedModalVisible = ref(false);
    const vipLevel = computed(() => {
      return store.vip;
    });
    const storeToken = computed(() => {
      return store.token;
    });
    const loadingClaim = ref(false);
    const loadingMClaim = ref(false);
    const loadingBClaim = ref(false);
    const dailySlot = (bonusItem, vipType) => {
      loadingClaim.value = true;
      if (vipType === "monthly") {
        loadingMClaim.value = true;
      } else if (vipType === "birthday") {
        loadingBClaim.value = true;
      }
      claimBonusItem(bonusItem)
        .then((res) => {
          if (res.code === 0) {
            amount.value = "$" + res.data;
            privilegeClaimedModalVisible.value = true;
            loadingClaim.value = false;
            loadingMClaim.value = false;
            loadingBClaim.value = false;
            store.getBalance();
          }
        })
        .catch((err) => {
          console.log(err.message);
          loadingClaim.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;
        });
    };
    const showRebate = ref(false);
    const columns = [
      {
        title: "VIP Level",
        dataIndex: "vipLevel",
        key: "vipLevel",
      },
      {
        title: "VIP 1",
        dataIndex: "vip1",
        key: "vip1",
      },
      {
        title: "VIP 2",
        dataIndex: "vip2",
        key: "vip2",
      },
      {
        title: "VIP 3",
        dataIndex: "vip3",
        key: "vip3",
      },
      {
        title: "VIP 4",
        dataIndex: "vip4",
        key: "vip4",
      },
      {
        title: "VIP 5",
        dataIndex: "vip5",
        key: "vip5",
      },
      {
        title: "VIP 6",
        dataIndex: "vip6",
        key: "vip6",
      },
      {
        title: "VIP 7",
        dataIndex: "vip7",
        key: "vip7",
      },
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
        vip7: "1.00%",
      },
      {
        key: "2",
        vipLevel: "Fishing Rebate",
        vip1: "0.30%",
        vip2: "0.30%",
        vip3: "0.30%",
        vip4: "0.30%",
        vip5: "0.30%",
        vip6: "0.30%",
        vip7: "0.30%",
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
        vip7: "0.80%",
      },
      // {
      //   key: "4",
      //   vipLevel: "เงินคืนไพ่",
      //   vip1: "0.20%",
      //   vip2: "0.20%",
      //   vip3: "0.30%",
      //   vip4: "0.40%",
      //   vip5: "0.50%",
      //   vip6: "0.60%",
      //   vip7: "0.80%",
      // },
      {
        key: "5",
        vipLevel: "Sports/Esports Rebate",
        vip1: "0.20%",
        vip2: "0.30%",
        vip3: "0.40%",
        vip4: "0.40%",
        vip5: "0.50%",
        vip6: "0.50%",
        vip7: "0.60%",
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
        vip7: "0.60%",
      },
    ];
    const promoExclusive = [
      {
        title: "VIP Level",
        dataIndex: "vipLevel",
        key: "vipLevel",
        render: (text) => String(text),
      },
      {
        title: "VIP 1",
        dataIndex: "vip1",
        key: "vip1",
      },
      {
        title: "VIP 2",
        dataIndex: "vip2",
        key: "vip2",
      },
      {
        title: "VIP 3",
        dataIndex: "vip3",
        key: "vip3",
      },
      {
        title: "VIP 4",
        dataIndex: "vip4",
        key: "vip4",
      },
      {
        title: "VIP 5",
        dataIndex: "vip5",
        key: "vip5",
      },
      {
        title: "VIP 6",
        dataIndex: "vip6",
        key: "vip6",
      },
      {
        title: "VIP 7",
        dataIndex: "vip7",
        key: "vip7",
        render: (text) => String(text),
      },
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
        vip7: "1,500,000/Day",
      },
      {
        key: "2",
        vipLevel: "Bet Limit",
        vip1: "Standard",
        vip2: "Standard",
        vip3: "Standard",
        vip4: "Standard",
        vip5: "High limit",
        vip6: "High limit",
        vip7: "High limit",
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
        vip7: "✔",
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
        vip7: "✔",
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
        vip7: "✔",
      },
    ];
    const terms = [
      {
        text: `The program applies to VIP members with valid accounts. The VIP upgrade is based on the member's total accumulated deposit amount, the daily total successful deposit amount is calculate from 00:00:01 to 23:59:59  (GMT+8)`,
      },
      {
        text: `The system will automatically upgrade VIP level after 00:00:00 (GMT+8) of the next day, the VIP level only can upgrade one level a day if the member's  total 
deposit amount is eligible for the corresponding VIP level.`,
      },
      {
        text: `The Free bonus, rebates and promotins benefits level corresponding to the VIP level will be updated as soon as the member's account is updated in the 
next day.`,
      },
      {
        text: `Birthday bonus:the bonus need to be claim on VIP page by member self on the birthday day and overdue void, Members who celebrate their birthday less 
than 90 days from registration day will not receive this year's birthday bonus, Only members who have registered for more than 90 days can receive it, once 
a year. (Birthday bonus can be withdrawal after 1x turnover)`,
      },
      {
        text: `Monthly bonus:the bonus need to be claim on VIP page by member self after the member have upgraded to a new level in the next day, Each member can 
claim 1 monthly bonus in upgrade month.(Monthly bonus can be withdrawal after 3x turnover)`,
      },
      {
        text: `All draw bets, CANCEL bets, 2 sided bets, bets on Europe Handicap under 1.75, Asian Handicap under 0.75, Number Games, Fantasy Sports, Progressive RNG 
Jackpots, Progressive RNG Slot will not be counted in this promotion.`,
      },
      {
        text: `Jolly88 reserves the right to modify, refuse or cancel this VIP membership
program at any time without prior notice.`,
      },
      {
        text: `Jolly88 reserves the right to modify, refuse or cancel this VIP membership program at any time without prior notice.`,
      },
    ];
    const vipItems = [
      {
        vipLevel: "1",
        upgrade: "Successful deposit",
        monthly: "",
        birthday: "",
        rebates: [
          {
            rebateName: "Slots Rebate",
            rebateValue: "1.00%",
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.80%",
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เงินคืนไพ่",
          //   rebateValue: "0.20%",
          // },
          {
            rebateName: "Poker Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เเงินคืนล็อตตารี่",
          //   rebateValue: "0.30%",
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.65%",
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.60%",
          },
        ],
      },
      {
        vipLevel: "2",
        upgrade: "70,000",
        monthly: "188",
        birthday: "",
        rebates: [
          {
            rebateName: "Slots Rebate",
            rebateValue: "1.00%",
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.80%",
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เงินคืนไพ่",
          //   rebateValue: "0.20%",
          // },
          {
            rebateName: "Poker Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เเงินคืนล็อตตารี่",
          //   rebateValue: "0.30%",
          // },

          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.65%",
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.60%",
          },
        ],
      },
      {
        vipLevel: "3",
        upgrade: "500,000",
        monthly: "688",
        birthday: "888",
        rebates: [
          {
            rebateName: "Slots Rebate",
            rebateValue: "1.00%",
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.80%",
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เงินคืนไพ่",
          //   rebateValue: "0.30%",
          // },
          {
            rebateName: "Poker Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เเงินคืนล็อตตารี่",
          //   rebateValue: "0.40%",
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.65%",
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.60%",
          },
        ],
      },
      {
        vipLevel: "4",
        upgrade: "2,000,000",
        monthly: "1,588",
        birthday: "2,888",
        rebates: [
          {
            rebateName: "Slots Rebate",
            rebateValue: "1.00%",
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.80%",
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เงินคืนไพ่",
          //   rebateValue: "0.40%",
          // },
          {
            rebateName: "Poker Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เเงินคืนล็อตตารี่",
          //   rebateValue: "0.40%",
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.65%",
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.60%",
          },
        ],
      },
      {
        vipLevel: "5",
        upgrade: "7,000,000",
        monthly: "2,888",
        birthday: "5,888",
        rebates: [
          {
            rebateName: "Slots Rebate",
            rebateValue: "1.00%",
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.80%",
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เงินคืนไพ่",
          //   rebateValue: "0.50%",
          // },
          {
            rebateName: "Poker Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เเงินคืนล็อตตารี่",
          //   rebateValue: "0.50%",
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.65%",
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.60%",
          },
        ],
      },
      {
        vipLevel: "6",
        upgrade: "20,000,000",
        monthly: "6,888",
        birthday: "8,888",
        rebates: [
          {
            rebateName: "Slots Rebate",
            rebateValue: "1.00%",
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.80%",
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.80%",
          },
          {
            rebateName: "Poker Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เงินคืนไพ่",
          //   rebateValue: "0.60%",
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.65%",
          },
          // {
          //   rebateName: "เเงินคืนล็อตตารี่",
          //   rebateValue: "0.50%",
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.65%",
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.60%",
          },
        ],
      },
      {
        vipLevel: "7",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        rebates: [
          {
            rebateName: "Slots Rebate",
            rebateValue: "1.00%",
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.80%",
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.80%",
          },
          // {
          //   rebateName: "เงินคืนไพ่",
          //   rebateValue: "0.80%",
          // },
          {
            rebateName: "Poker Rebate",
            rebateValue: "0.80%",
          },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.65%",
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.60%",
          },
          // {
          //   rebateName: "เเงินคืนล็อตตารี่",
          //   rebateValue: "0.60%",
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.65%",
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.60%",
          },
        ],
      },
    ];

    return {
      columns,
      data,
      showRebate,
      promoExclusive,
      dataExclusive,
      terms,
      vipItems,
      vipLevel,
      storeToken,
      dailySlot,
      loadingClaim,
      loadingMClaim,
      loadingBClaim,
      amount,
      privilegeClaimedModalVisible,
    };
  },
});
</script>
<style scoped lang="scss">
.modal-div {
  width: 340px;
  position: relative;
  margin: 0 auto;
  .img-item {
    color: rgb(255, 255, 255);
    position: absolute;
    left: 0px;
    right: 0px;
    margin: auto;
    top: 61%;
    text-align: center;
    .inner-contents {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
  .amount {
    font-size: 55px;
    line-height: 65px;
    font-weight: bold;
  }
  .bonus {
    color: rgb(228, 0, 35);
    font-size: 35px;
    font-weight: bold;
    line-height: 38px;
  }
}
$max-width: 1400px;
.vip-container {
  background: linear-gradient(to bottom, #23263c, #190f25);
  min-height: 100vh;
  .banner-container {
    background: url("../../assets/images/vip/banner.png") no-repeat center
      center;
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
  .inner-vip-mobile {
    display: none;
  }
  .vipitem {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    background: url("../../assets/images/vip/vip_04.png") no-repeat top center;
    background-size: contain;
    width: 350px;
    min-height: 410px;
    justify-content: flex-end;
    .viplevelcircle {
      img {
        width: 140px;
        margin-top: 20px;
      }
      margin-bottom: -50px;
      z-index: 1;
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
        .ant-btn.claim-btn {
          color: #ffffff;
          background-image: linear-gradient(to right, #de4545, #db7e42);
          border: 0;
          :hover {
            opacity: 0.8;
          }
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
  .terms-conditions {
    padding-bottom: 80px;
    max-width: 900px;
    margin: 0 auto;
    width: 95%;
    position: relative;
    .game-title {
      margin-top: 80px;
      margin-bottom: 30px;
    }
    .terms {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .term {
        .circle-wrapper {
          margin-right: -50px;

          z-index: 1;
          background: #2b2b4b;
          border: 4px solid #d7510b;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 10px;

          .circle {
            border: 2px solid #d7510b;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 50px;
            font-family: Wave;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
          }
        }
        .term-text {
          min-height: 80px;
          width: calc(100% - 40px);
          border-radius: 10px;
          background: #2b2b4b;
          min-width: 20px;
          justify-content: center;
          align-items: center;
          display: flex;
          color: #ffffff;
          padding: 20px 20px 20px 80px;
          margin-left: 40px;
        }
      }
    }
  }
}
.section-product {
  width: 95%;
  min-height: 70vh;
  margin: 0 auto;
  padding: 50px 0 80px 0;
  max-width: $max-width;
  /* position: relative; */
  .title {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      height: 1px;
      width: 100%;
      left: 0;
      margin-top: 20px;
      background-color: rgb(214, 214, 214);
    }
  }
  .subintro {
    font-size: 16px;
    width: 100%;
    margin: auto;
    font-weight: 100;
    color: #190f25;
  }
  .item-group {
    padding-top: 50px;
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    &:last-child {
      padding-top: 30px;
    }
  }
  .set {
    margin: auto;
    width: 100%;
  }
  .items {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 340px;
    margin: auto;
    overflow: hidden;
    .theme {
      overflow: hidden;
      img {
        width: 100%;
        vertical-align: middle;
        margin-top: 70px;
        border-radius: 20px 20px 0 0;
      }
    }
    .main-object {
      position: absolute;
      top: 0;
      right: 0px;
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;
      img {
        vertical-align: middle;
        width: 100%;
      }
    }
    &:hover .main-object {
      position: absolute;
      transform: translateX(-25px);
    }
    .sub-object {
      display: none;
      position: absolute;
      top: 0;
      left: 10px;
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;
      img {
        vertical-align: middle;
        width: 100%;
      }
    }
    .txt {
      position: absolute;
      bottom: 0px;
      background: #2b2b4b;
      padding: 20px 80px 20px 20px;
      color: #fff;
      width: 100%;
      filter: brightness(0.9);
      border-radius: 0 0 20px 20px;

      p {
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 16px;
      }
      img {
        max-width: 50%;
        margin: 0 0 10px;
        display: block;
        max-height: 30px;
      }
    }
    &:hover {
      .txt {
        opacity: 1;
        filter: brightness(1);
      }
    }
  }
}
@media (max-width: 768px) {
  .section-product .item-group {
    grid-template-columns: 1fr;
  }

  .vip-program {
    display: none;
  }
  .vip-container {
    .banner-container {
      background-position: 70% 50%;
      .btn-wrapper {
        .center {
          max-width: 300px;
          width: 100%;
          margin: 0 auto;
          .page-headline {
            font-size: 5rem;
            line-height: 5rem;
          }
          .page-blend {
            font-size: 1.7rem;
            line-height: 1.7rem;
            padding: 10px;
          }
          .page-subline {
            font-size: 1rem;
            line-height: 1rem;
          }
          .page-liner {
            font-size: 0.7rem;
            line-height: 1rem;
          }
        }
      }
    }
    .vipitem {
      background-size: cover;
      min-width: 340px;
      margin: auto;
      .vipcontents {
        padding-bottom: 10px;
      }
    }
    .inner-vip-mobile {
      margin-top: 20px;
      display: block;

      .rebates {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100vw;
        gap: 10px;
        padding: 10px;
        .rebate {
          background: #23263c;
          border-top: 5px solid #dc5e43;
          border-bottom: 5px solid #dc5e43;
          border-radius: 20px;
          .name {
            font-size: 12px;
            line-height: 15px;
            color: #ffffff;
            padding: 20px 0;
          }
          .value {
            background: #2b2b4b;
            color: #ffffff;
            margin: 20px 0 0;
            font-family: Wave;
            font-size: 30px;
          }
        }
      }
      .note {
        color: #db7d42;
        font-size: 12px;
        text-align: left;
        padding: 0 10px;
        display: block;
      }
    }
  }
}
@media (max-width: 500px) {
  .vip-container {
    .inner-vip-mobile {
      .rebates {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>
<!-- Carousel CSS only -->
<style lang="scss">
.carousel {
  max-width: 1080px;
  margin: 0 auto;
}
.carousel__item {
  // background: url(../../assets/images/vip/vipbg.png)no-repeat center center;
  background-size: 100%;
  font-size: 20px;
  border-radius: 8px;
}

.carousel__slide {
  padding: 10px;
  align-items: flex-start;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  background: url(../../assets/images/vip/nextprev.png) no-repeat center center;
  background-size: contain;
  top: 25%;
  .carousel__icon {
    display: none;
  }
}
.carousel__prev {
  top: 26.5%;
  left: 4%;
}
.carousel__next {
  transform: rotate(180deg);
}
.carousel__slide > .carousel__item {
  transform: scale(0.8);
  filter: brightness(0.7);
  transition: 0.5s;
}
.carousel__slide--visible > .carousel__item {
  opacity: 1;
  filter: brightness(1);
  transform: rotateY(0);
}
.carousel__slide--next > .carousel__item {
  /* transform: scale(1.2) translate(-10px); */
  transform: scale(0.8) translate(-170px);
  z-index: -2;
}
.carousel__slide--prev > .carousel__item {
  transform: scale(0.8) translate(170px);
  z-index: -2;
  /* transform: scale(0.9) translate(10px); */
}
.carousel__slide--active > .carousel__item {
  transform: scale(1);
  z-index: 0;
}
@media (max-width: 768px) {
  .carousel__slide > .carousel__item {
    transform: scale(0);
    filter: brightness(0.7);
    transition: 0.5s;
  }
  .carousel__slide--visible > .carousel__item {
    opacity: 1;
    filter: brightness(1);
    transform: rotateY(0);
  }

  .carousel__slide--next > .carousel__item {
    /* transform: scale(1.2) translate(-10px); */
    // transform: scale(0.8) translate(-0px);
    // z-index: -2;
    .inner-vip-mobile {
      display: none;
    }
  }
  .carousel__slide--prev > .carousel__item {
    // transform: scale(0.8) translate(0px);
    // z-index: -2;
    /* transform: scale(0.9) translate(10px); */
    .inner-vip-mobile {
      display: none;
    }
  }
}
</style>
