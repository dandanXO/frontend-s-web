<template>
  <div class="hot-promo" :class="list.redirectUrl === 'lh1-game-steps' && 'flat-border-radius'">
    <ClaimPromo
      v-if="listParam.type === 'claimpromo'"
      :promo-id="list.id"
      :loading-claim="loadingClaim"
      @daily-slot="handleSlot()"
    />
    <TigerCardPromo v-if="list.redirectUrl === 'lh1-tiger-card'" />
    <DragonCardPromo v-if="list.redirectUrl === 'lh1-dragon-card'" :promo-code="list.promoCode" />
    <GoldenEggPromo v-if="list.redirectUrl === 'lh1-goldenegg' && store.token" />
    <HongBaoYuPromo v-if="list.redirectUrl === 'lh1-hongbaoyu' && store.token" />
    <WelcomeTaskPromo v-if="list.redirectUrl === 'lh1-welcomenewuser' && store.token" />
    <InviteFriendPromo v-if="list.redirectUrl === 'lh1-invitefriend'" />
    <EsportSafetyPromo v-if="list.redirectUrl === 'lh1-esport-safety'" />
    <SportSafetyPromo v-if="list.redirectUrl === 'lh1-sport-safety'" />
    <MeiZhouBeiPromo v-if="list.redirectUrl === 'lh1meizhoubei'" />
    <PredictionMatchPromo v-if="list.redirectUrl === 'lh1-s13-vote'" />
    <DailyLoginPromo v-if="list.redirectUrl === 'lh1-monthly-sign'" />
    <NbaGamePromo v-if="list.redirectUrl === 'lh1-nba-safety'" />
    <EsportQuiz v-if="list.redirectUrl === 'lh1-quiz'" />
    <LotteryPromo v-if="list.redirectUrl === 'lh1-lottery' && store.token" />
    <GiftPromo v-if="list.redirectUrl === 'lh1-gift' && store.token" />
    <Gift8Promo v-if="list.redirectUrl === 'lh1-gift8' && store.token" />
    <UpgradeHongBao v-if="list.redirectUrl === 'lh1-upgrade-hongbaoz' && store.token" />
    <AppHongBao
      v-if="list.redirectUrl === 'lh1-app-hongbao' && store.token"
      :promo-code="list.promoCode"
      :params="list.param"
    />
    <FtdPromo v-if="list.redirectUrl === 'lh1-ftd-promo' && store.token" />

    <HongBaoPreEurocup
      v-if="listParam.type === 'hongbaoyu' && store.token"
      :promo-code="list.promoCode"
      :params="list.param"
    />

    <AsianCup2024 v-if="list.redirectUrl === 'lh1-promo-application-A' && store.token" />
    <BasketballHot v-if="list.redirectUrl === 'lh1-promo-basketball' && store.token" />
    <LPLSummer v-if="list.redirectUrl === 'lh1-lpl-game' && store.token" />
    <Cny2024Promo v-if="list.redirectUrl === 'lh1-cny2024-promo' && store.token" />
    <div style="text-align: center" v-if="list.redirectUrl === 'lh1-feedback-award' && store.token">
      <img
        style="max-width: 1200px; width: 100%; margin: 25px auto 0px"
        src="../assets/images/promotion/hotpromo/lhfeedback/feedback.png"
      />
    </div>
    <div style="text-align: center" v-if="list.redirectUrl === 'lh1ouzhoubeibaopei' && store.token">
      <div class="cs-btn" @click="store.openLiveChat()">联系客服</div>
    </div>
    <BbDacha2024Promo v-if="list.redirectUrl === 'lh1-asian-zone' && store.token"></BbDacha2024Promo>
    <PrivilegeInvite v-if="list.redirectUrl === 'lh1-invite' && store.token" />
    <FootballFight v-if="list.redirectUrl === 'lh1-football-fight' && store.token" />

    <CnyStepGame2024Promo v-if="list.redirectUrl === 'lh1-cny-step-game' && store.token"></CnyStepGame2024Promo>
    <CS2Sign v-if="list.redirectUrl === 'lh-cs2-copenhagen-major-2024' && store.token" :promo-code="list.promoCode" />
    <LhStepGamePromo
      v-if="list.redirectUrl === 'lh1-game-steps' && store.token"
      :pageContent="list.pageContent"
    ></LhStepGamePromo>

    <BonusSpinWheel v-if="list.redirectUrl === 'lh1-spin-wheel' && store.token" />
    <Summoner v-if="list.redirectUrl === 'lh1-summon-event' && store.token" :promo-code="list.promoCode" />
    <Europe2024 v-if="list.redirectUrl === 'lh1-eurocup-2024' && store.token" :promo-code="list.promoCode" />
    <LOLMsi2024Promo v-if="list.redirectUrl === 'lh-msi-match' && store.token" />
    <Europe2024FirstShoot v-if="list.redirectUrl === 'lh1-eurocup-firstshoot' && store.token" />
    <BlastPremierPromo v-if="list.redirectUrl === 'lh-cs2-blast-2024' && store.token" :promo-code="list.promoCode" />
    <EurocupManual v-if="list.redirectUrl === 'lh-eurocup-manual' && store.token" />
    <SportZhongChao v-if="list.redirectUrl === 'lh-sport-zhongchao' && store.token" />
    <Nba24Match v-if="list.redirectUrl === 'lh-nba24-match' && store.token" />
    <slotLucky8 v-if="list.redirectUrl === 'lh1-slot-lucky8' && store.token" :promo-code="list.promoCode" />
    <LPLSummer2024 v-if="list.redirectUrl === 'lh-lpl-summer24' && store.token" />
    <intelEsl2024 v-if="list.redirectUrl === 'lh1-intel-esl' && store.token" />

    <fishHongbao v-if="list.redirectUrl === 'lh-fish-hongbao' && store.token" />

    <DuanWuJiePromo v-if="list.redirectUrl === 'lh-duanwujie24' && store.token" />
    <EurocupVotePromo v-if="list.redirectUrl === 'lh1-team-vote'" />
    <DepositRebates v-if="list.redirectUrl === 'lh1-deposit-rebates'" />
    <WinLossPromo v-if="list.redirectUrl === 'lh1-eurocup-guess'" />
    <Aijiasu v-if="list.redirectUrl === 'lh1-aijiasu'" />
    <EuroRegen v-if="list.redirectUrl === 'lh1-eurocup-regen' && store.token" />

    <el-dialog class="award-modal" :modal="false" v-model="privilegeClaimedModalVisible" align-center>
      <div class="modal-div">
        <span class="img-item">
          <div class="inner-contents">
            <div class="amount">{{ amount }}</div>
            <div class="bonus">奖金</div>
          </div>
        </span>
        <img src="../assets/images/index/bonus.svg" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { claimBonusItem, submitLuckyNumber, luckyNumberList, winnerList } from "@/api/index/promo";
import ClaimPromo from "../components/hotpromo/claimPromo.vue";
import TigerCardPromo from "../components/hotpromo/tigercard/tigerCardPromo.vue";
import DragonCardPromo from "../components/hotpromo/dragoncard/dragonCardPromo.vue";
import MeiZhouBeiPromo from "../components/hotpromo/meizhoubei/MeiZhouBeiPromo.vue";
// import PrizePoolVotePromo from "../components/hotpromo/prizePoolVote/prizePoolVotePromo.vue";
import EurocupVotePromo from "../components/hotpromo/eurocup-2024-vote/eurocupVotePromo.vue";
import GoldenEggPromo from "../components/hotpromo/goldenegg/goldenEggPromo.vue";
import HongBaoYuPromo from "../components/hotpromo/hongbaoyu/HongBaoYu.vue";
import InviteFriendPromo from "../components/hotpromo/invitefriend/inviteFriendPromo.vue";
import WelcomeTaskPromo from "../components/hotpromo/welcometask/welcomeTaskPromo.vue";
import EsportSafetyPromo from "../components/hotpromo/eSportSafety/eSportSafetyPromo.vue";
import SportSafetyPromo from "../components/hotpromo/sportSafety/sportSafetyPromo.vue";
import PredictionMatchPromo from "../components/hotpromo/PredictionMatch/PredictionMatchPromo.vue";
import DailyLoginPromo from "../components/hotpromo/DailyLogin/DailyLoginPromo.vue";
import NbaGamePromo from "../components/hotpromo/nbagame/nbaGamePromo.vue";
import EsportQuiz from "../components/hotpromo/esportquiz/EsportQuiz.vue";
import LotteryPromo from "../components/hotpromo/lottery/LotteryPromo.vue";
import PrivilegeInvite from "../components/hotpromo/privilegeInvite/PrivilegeInvite.vue";
import FootballFight from "../components/hotpromo/footballfight/FootballFight.vue";
import GiftPromo from "../components/hotpromo/gift/GiftPromo.vue";
import Gift8Promo from "../components/hotpromo/gift8/Gift8Promo.vue";
import UpgradeHongBao from "../components/hotpromo/upgradeHongBao/UpgradeHongBao.vue";
// import HongBaoYu2024 from "../components/hotpromo/hongbaoyu2024/HongBaoYu2024.vue";
import AsianCup2024 from "../components/hotpromo/asian-cup-2024/AsianCup2024.vue";
import BasketballHot from "../components/hotpromo/basketball-hot/BasketballHot.vue";
import LPLSummer from "../components/hotpromo/lpl-summer/LPLSummer.vue";
import Cny2024Promo from "../components/hotpromo/cny2024/Cny2024Promo.vue";
import BbDacha2024Promo from "../components/hotpromo/bbdacha2024/BbDacha2024Promo.vue";
import CnyStepGame2024Promo from "../components/hotpromo/cnystepgame2024/CnyStepGame2024Promo.vue";
import LhStepGamePromo from "../components/hotpromo/lhstepgame/LhStepGamePromo.vue";
import CS2Sign from "../components/hotpromo/CS2Sign/CS2Sign.vue";
import BonusSpinWheel from "../components/hotpromo/bonusSpinWheel/BonusSpinWheel.vue";
import Summoner from "../components/hotpromo/summoner/Summoner.vue";
import AppHongBao from "../components/hotpromo/apphongbao/AppHongBao.vue";
import FtdPromo from "../components/hotpromo/ftd/FtdPromo.vue";
import LOLMsi2024Promo from "../components/hotpromo/LOL-msi-2024/LOLMsi2024Promo.vue";
import Europe2024 from "../components/hotpromo/europe-2024/Europe2024.vue";
import Europe2024FirstShoot from "../components/hotpromo/europe-2024-first-shoot/Europe2024FirstShoot.vue";
import BlastPremierPromo from "../components/hotpromo/BlastPremierPromo/BlastPremierPromo.vue";
import EurocupManual from "../components/hotpromo/EurocupManual/EurocupManual.vue";
import SportZhongChao from "../components/hotpromo/SportZhongChao/SportZhongChao.vue";
import Nba24Match from "../components/hotpromo/Nba24Match/Nba24Match.vue";
import slotLucky8 from "../components/hotpromo/slot-lucky8-2024/slot-lucky8-2024.vue";
import LPLSummer2024 from "../components/hotpromo/lpl-summer-2024/LPLSummer2024.vue";
import intelEsl2024 from "../components/hotpromo/intel-esl-2024/intel-esl-2024.vue";
import DuanWuJiePromo from "../components/hotpromo/dragonboat/DragonBoat.vue";
import HongBaoPreEurocup from "../components/hotpromo/hongbaoyu2024/HongBaoPreEurocup.vue";
import fishHongbao from "../components/hotpromo/fishHongbao/fishHongbao.vue";
import DepositRebates from "../components/hotpromo/depositRebates/depositRebates.vue";
import WinLossPromo from "../components/hotpromo/winloss/WinLoss.vue";
import Aijiasu from "../components/hotpromo/aijiasu/Aijiasu.vue";
import EuroRegen from "../components/hotpromo/EuroRegen/EuroRegen.vue";
import { ElMessage } from "element-plus";
import { userStore } from "@/store";
import moment from "moment";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    slotLucky8,
    intelEsl2024,
    ClaimPromo,
    TigerCardPromo,
    EurocupVotePromo,
    GoldenEggPromo,
    HongBaoYuPromo,
    InviteFriendPromo,
    WelcomeTaskPromo,
    EsportSafetyPromo,
    SportSafetyPromo,
    PredictionMatchPromo,
    DailyLoginPromo,
    NbaGamePromo,
    EsportQuiz,
    LotteryPromo,
    PrivilegeInvite,
    FootballFight,
    GiftPromo,
    Gift8Promo,
    AsianCup2024,
    BasketballHot,
    LPLSummer,
    Cny2024Promo,
    BbDacha2024Promo,
    CnyStepGame2024Promo,
    UpgradeHongBao,
    // HongBaoYu2024,
    DragonCardPromo,
    CS2Sign,
    BonusSpinWheel,
    LhStepGamePromo,
    Summoner,
    AppHongBao,
    FtdPromo,
    LOLMsi2024Promo,
    Europe2024,
    Europe2024FirstShoot,
    BlastPremierPromo,
    EurocupManual,
    SportZhongChao,
    Nba24Match,
    fishHongbao,
    LPLSummer2024,
    DuanWuJiePromo,
    DepositRebates,
    HongBaoPreEurocup,
    WinLossPromo,
    MeiZhouBeiPromo,
    Aijiasu,
    EuroRegen
  },
  props: {
    list: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      emptyText: "今天没有获奖者。",
      privilegeClaimedModalVisible: false,
      dataSource: [],
      winnerDataSource: [],
      activeKey: "1",
      store: userStore(),
      btnLoading: false,
      loadingClaim: false,
      memberId: null,
      amount: "$0",
      hotPromoList: [
        // {
        //   id: 19,
        //   bg: require("../assets/images/promotion/hotpromo/19/bg.png"),
        //   contents:
        //     "*The rebate bonus needs 1 times rollover before withdrawing and will be returned if not used within 30 days.",
        // },
        // {
        //   id: 20,
        //   bg: require("../assets/images/promotion/hotpromo/20/bg.png"),
        //   contents: "Hello hello",
        // },
        // {
        //   id: 21,
        //   bg: "",
        //   contents: "Hello hello",
        // },
        // {
        //   id: 22,
        //   bg: require("../assets/images/promotion/hotpromo/22/bg.png"),
        //   contents: {
        //     tab1: "Fill up the lucky number after the Member need meet deposit minimum amount of 1700VDNP or above. Once per day.",
        //   },
        // },
        // {
        //   id: 23,
        //   bg: require("../assets/images/promotion/hotpromo/23/bg.png"),
        //   contents: {
        //     tab1: "Fill up the lucky number after the Member need meet deposit minimum amount of 1700VDNP or above. Once per day.",
        //   },
        // },
        // {
        //   id: 24,
        //   bg: require("../assets/images/promotion/hotpromo/24/bg.png"),
        //   contents: {
        //     tab1: "Fill up the lucky number after the Member need meet deposit minimum amount of 1700VDNP or above. Once per day.",
        //   },
        // },
      ],
      selectedHotPromo: {
        id: "",
        bg: "",
        contents: ""
      },
      formState: {
        dateTime: "",
        onlyMe: false
      },
      luckyNumber: null,
      query: {
        winStatus: "",
        recordTime: null,
        onlyMe: false
      },
      winnersQuery: {
        resultTime: null
      },
      columns: [
        {
          title: "号码",
          dataIndex: "number",
          key: "1"
        },
        {
          title: "登录名",
          dataIndex: "loginName",
          key: "2"
        },
        {
          title: "获奖状态",
          dataIndex: "winStatus",
          key: "3"
        },
        {
          title: "时间",
          dataIndex: "recordTime",
          key: "recordTime",
          slots: { customRender: "recordTime" }
        }
      ],
      winnerColumns: [
        {
          title: "号码",
          dataIndex: "number",
          key: "number"
        },
        {
          title: "登录名",
          dataIndex: "loginName",
          key: "loginName"
        },
        {
          title: "获奖状态",
          dataIndex: "winStatus",
          key: "winStatus"
        },
        {
          title: "公告日期",
          dataIndex: "resultTime",
          key: "4",
          slots: { customRender: "resultTime" }
        }
      ]
    };
  },
  computed: {
    listParam() {
      try {
        return JSON.parse(this.list.param);
      } catch (e) {
        return {};
      }
    }
  },
  methods: {
    handleSlot() {
      this.loadingClaim = true;
      const bonusItem = this.list.promoCode;

      claimBonusItem(bonusItem)
        .then((res) => {
          if (res.code === 0) {
            this.amount = "$" + res.data;
            this.privilegeClaimedModalVisible = true;
            this.loadingClaim = false;
            this.store.getBalance();
          } else {
            ElMessage.error(res.message);
            this.loadingClaim = false;
          }
        })
        .catch((err) => {
          console.log(err.message);
          // message.error(err.message, 4);
          this.loadingClaim = false;
        });
    },
    chooseLuckyNumber() {
      this.btnLoading = true;
      submitLuckyNumber(this.luckyNumber)
        .then((res) => {
          if (res.code === 0) {
            ElMessage.success({
              type: "success",
              message: "成功发送号码。"
            });
            this.luckyNumber = null;
            this.btnLoading = false;
          } else {
            ElMessage.error(res.message);
            this.btnLoading = false;
          }
        })
        .catch((err) => {
          console.log(err.message);
          // message.error(err.message, 4);
          this.btnLoading = false;
        });
    },
    retrieveList() {
      if (this.query.onlyMe) {
        this.memberId = this.store.id;
      } else {
        this.memberId = null;
      }
      luckyNumberList(this.query, this.memberId)
        .then((res) => {
          if (res.code === 0) {
            let newArray = [];
            for (let i = 0; i < res.data.length; i++) {
              let obj = res.data[i];
              let status = "";
              switch (obj.winStatus) {
                case "BET":
                  status = "未开奖";
                  break;
                case "WIN":
                  status = "已中奖";
                  break;
                case "LOSS":
                  status = "未中奖";
                  break;
              }
              obj.winStatus = status;
              newArray.push(obj);
            }
            this.dataSource = newArray;
          }
        })
        .catch((err) => {
          console.log(err.message);
          // message.error(err.message, 4);
        });
    },
    retrieveWinnerList() {
      this.winnerDataSource = [];
      winnerList(this.winnersQuery, this.memberId)
        .then((res) => {
          if (res.code === 0) {
            res.data.forEach((element) => {
              element.winners.forEach((winner) => {
                winner.resultTime = element.resultTime;
                this.winnerDataSource.push(winner);
              });
            });
            if (this.winnerDataSource.length === 0) {
              this.emptyText = "今天没有获奖者。";
            }
          } else {
            ElMessage.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
          // message.error(err.message, 4);
        });
    },
    humanDatetime(ts) {
      return moment(ts).format("YYYY-MM-DD");
    }
  },
  mounted() {
    // console.log("Mount");
    // console.log(this.list);
    this.hotPromoList.forEach((element) => {
      if (this.list.id === element.id) {
        this.selectedHotPromo = element;
      }
    });
  }
});
</script>
<style lang="scss">
.award-modal {
  background: none;
  box-shadow: none;

  .el-dialog__header .el-dialog__headerbtn {
    font-size: 40px;
    background: #3d8183;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-dialog__body {
    background: none;
  }
}

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
    font-size: 60px;
    line-height: 65px;
  }

  .bonus {
    color: rgb(228, 0, 35);
    font-size: 35px;
    font-weight: bold;
    line-height: 38px;
  }
}

.hot-promo {
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  &.flat-border-radius {
    border-radius: 0px !important;
  }

  .promo-bg {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;

    &.isDesktop {
      display: block;
      height: 500px;
    }

    &.isMobile {
      display: none;
      height: 220px;
    }
  }

  .common-promo {
    display: flex;
    justify-content: center;
    background-size: contain;
    gap: 30px;
    text-align: center;
    padding: 20px;
    flex-direction: column;
    width: 500px;
    margin: 0 auto;

    .extrel-img {
      position: absolute;
      right: 100px;
    }

    .contents {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 20px;

      .orange {
        color: #ffd800;
      }

      .common-btn {
        display: inline-block;
      }
    }

    &.p19 {
      gap: 120px;
      text-align: center;
    }

    &.p-2 {
      gap: 120px;
      text-align: center;
    }

    &.p-5 {
      gap: 60px;
      text-align: left;

      .ant-form-item-label > label {
        color: #eeeeee;
      }
    }

    &.p-6 {
      .contents {
        gap: 50px;
      }
    }
  }

  .promo-4 {
    .ant-tabs-bar {
      border-bottom: 0px solid #201f29;
      margin-bottom: 0;
      display: flex;
      justify-content: center;
      background: #212137;
    }

    .ant-tabs-nav .ant-tabs-tab {
      padding: 10px 48px;
      margin: 10px 5px 20px;
      color: #ffffff;
      font-size: 16px;
      border-radius: 10px;
      border: 1px solid #ffd800;
      box-shadow: rgb(0 0 0 / 100%) 0px 6px 12px 0px;
      width: 400px;
      text-align: center;

      &-active {
        background-image: linear-gradient(to right, #de4545, #ffd800);
      }
    }

    .ant-tabs-nav-container {
    }

    .ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane,
    .ant-tabs .ant-tabs-bottom-content > .ant-tabs-tabpane {
      background: #201f29;
    }

    .ant-tabs-ink-bar {
      height: 0px;
      background-color: #201f29;
    }

    .table {
      padding: 20px;
    }

    .ant-table {
      background-color: transparent;
    }

    .ant-table-thead > tr > th,
    .ant-table-placeholder {
      color: #ffffff;
      background-color: #201f29;
      border: 0;
    }

    .ant-table-placeholder {
      border: 0;
    }

    .tabs {
      .tab1 {
        display: flex;
        max-width: 900px;
        margin: 0 auto;
        gap: 20px;
        justify-content: space-evenly;
        align-items: center;
        padding: 20px;

        .contents {
          display: flex;
          justify-content: center;
          form {
            margin-top: 20px;

            input {
              max-width: 250px;
              width: 90%;
            }

            .common-btn {
              display: inline-block;
            }
          }

          flex: 1;
          color: #ffffff;
          text-align: center;
        }
      }

      .tab2 {
        .ant-form {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 20px;
          align-items: center;

          .firstrow {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
          }
        }

        .ant-form-item {
          margin: 0;
        }

        .ant-form-item-label > label {
          color: #ffffff;
        }

        .ant-switch-checked {
          background: #ffd800;
        }
      }
    }
  }
}

.cs-btn {
  cursor: pointer;
  color: #ffffff;
  padding: 5px 30px;
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 4.5799999237px 0px #b1d7ff inset;
  box-shadow: 0px -1px 3.6640000343px 0px #5894ff inset;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 26px;
  width: 198px;
  height: 52px;
  line-height: 52px;
  font-size: 16px;

  &:hover {
    opacity: 0.9;
  }
  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

@media (max-width: 768px) {
  .hot-promo {
    .promo-bg {
      img {
        max-width: 140px;
      }
    }

    .common-promo {
      flex-direction: column;
      background-position: top center;

      .extrel-img {
        display: none;
      }

      &.p19,
      &.p-2,
      &.p-5,
      &.p-6 {
        gap: 20px;

        .contents {
          gap: 20px;
        }
      }
    }

    .promo-4 {
      .ant-tabs-nav .ant-tabs-tab {
        width: unset;
        padding: 10px;
      }

      .tabs {
        .tab1 {
          flex-direction: column;
        }

        .tab2 {
          .ant-form {
            align-items: flex-start;

            .firstrow {
              flex-direction: column;
            }
          }
        }
      }
    }
  }
}
</style>
