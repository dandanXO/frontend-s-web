<template>
  <div class="hot-promo" :class="list.redirectUrl === 'lh1-game-steps' && 'flat-border-radius'">
    <ClaimPromo
      v-if="listParam.type === 'claimpromo'"
      :promo-id="list.id"
      :loading-claim="loadingClaim"
      @daily-slot="handleSlot()"
    />

    <WelcomeTaskPromo v-if="list.redirectUrl === 'lh1-welcomenewuser'" />
    <InviteFriendPromo v-if="list.redirectUrl === 'lh1-invitefriend'" />

    <OuZuLianPromo v-if="list.redirectUrl === 'ouzulian'" />
    <SubmitClaimPromo v-if="list.redirectUrl === 'LH1-UCL'" :promo-code="list.promoCode" />

    <EsportQuiz v-if="list.redirectUrl === 'lh1-quiz'" />

    <GiftPromo v-if="list.redirectUrl === 'lh1-gift'" />
    <AppHongBao v-if="list.redirectUrl === 'lh1-app-hongbao'" :promo-code="list.promoCode" :params="list.param" />

    <HongBaoPreEurocup v-if="listParam.type === 'hongbaoyu'" :promo-code="list.promoCode" :params="list.param" />

    <Cny2024Promo v-if="list.redirectUrl === 'lh1-cny2024-promo'" />

    <div style="text-align: center" v-if="list.redirectUrl === 'lh1-feedback-award'">
      <img
        style="max-width: 1200px; width: 100%; margin: 25px auto 0px"
        src="../assets/images/promotion/hotpromo/lhfeedback/feedback.png"
      />
    </div>

    <PrivilegeInvite v-if="list.redirectUrl === 'lh1-invite'" />

    <newFootballFight v-if="list.redirectUrl === 'lh1-football'" :promo-code="list.promoCode" />
    <Cba30Dream v-if="list.redirectUrl === 'lh1-cba30-dream'" :promo-code="list.promoCode" />

    <LplPKlck2025loss
      v-if="list.redirectUrl === 'lh1-lpl-lck-2025-loss'"
      :promo-param="listParam"
      :promo-code="list.promoCode"
    />

    <LiveDailyRebates v-if="list.redirectUrl === 'lh1-live-daily-rebates'" :promo-code="list.promoCode" />

    <NewVipRebate v-if="list.redirectUrl === 'lh1-newvip-rebate'" :promo-code="list.promoCode" />
    <LongNewVip v-if="list.redirectUrl === 'lh1-vip'" :promo-code="list.promoCode" />

    <CnyStepGame2024Promo v-if="list.redirectUrl === 'lh1-cny-step-game'"></CnyStepGame2024Promo>

    <Summoner v-if="list.redirectUrl === 'lh1-summon-event'" :promo-code="list.promoCode" />
    <DailyCheckin v-if="list.redirectUrl === 'lh1-daily-checkin'" :promo-info="list" />

    <slotLucky8 v-if="list.redirectUrl === 'lh1-slot-lucky8'" :promo-code="list.promoCode" />
    <fishHongbao v-if="list.redirectUrl === 'lh-fish-hongbao'" />

    <DepositRebate2 v-if="list.redirectUrl === 'lh1-deposit-rebate2'" />

    <Aijiasu v-if="list.redirectUrl === 'lh1-aijiasu'" />

    <newplayerGuide v-if="list.redirectUrl === 'lh1-newplayer-guide'" />

    <ChallengeComeBackPromo v-if="list.redirectUrl === 'lh1-cycle-loss-refund'" :promo-code="list.promoCode" />
    <OfficialGiftPromo v-if="list.redirectUrl === 'lh-official-gift'" :params="list.param" />
    <DailiPromo v-if="list.redirectUrl === 'lh1-all-daili'" :params="list.param" />
    <SlotLossBonusPromo v-if="list.redirectUrl === 'lh1-weekly-slot-loss-bonus'" />

    <PGLBucharest2025 v-if="list.redirectUrl === 'lh1-pgl-bucharest-2025'" :promo-code="list.promoCode" />
    <VctBangkok v-if="list.redirectUrl === 'lh1-vct-masters-bangkok-2025'" :promo-code="list.promoCode" />
    <Blast2025 v-if="list.redirectUrl === 'lh1-blast-open-lisbon-2025'" :promo-code="list.promoCode" />

    <DarkModePromo v-if="list.redirectUrl === 'lh1-dark-mode'" />
    <SkyesportsSouvenir2025 v-if="list.redirectUrl === 'lh1-skyesports-souvenir-2025'" :promo-code="list.promoCode" />
    <EslProLeagueS21
      v-if="list.redirectUrl === 'lh1-esl-pro-league-s21'"
      :promo-param="listParam"
      :promo-code="list.promoCode"
    />
    <FissureUniverseS4 v-if="list.redirectUrl === 'lh1-fissure-universe-s4'" :promo-code="list.promoCode" />
    <YaLLa2025 v-if="list.redirectUrl === 'lh1-yalla-compass-qatar-2025'" :promo-code="list.promoCode" />
    <IemMelbourne2025 v-if="list.redirectUrl === 'lh1-iem-melbourne-2025'" :promo-code="list.promoCode" />
    <PglWallachiaS4 v-if="list.redirectUrl === 'lh1-pgl-wallachia-s4'" :promo-code="list.promoCode" />
    <BlastSlam32025 v-else-if="list.redirectUrl === 'lh1-blast-slam-3-2025'" :promo-code="list.promoCode" />
    <PglAstana2025 v-else-if="list.redirectUrl === 'lh1-pgl-astana-2025'" :promo-code="list.promoCode" />
    <Cct2025 v-if="list.redirectUrl === 'lh1-cct-global-finals-2025'" :promo-code="list.promoCode" />
    <FpSlotPromo v-if="list.redirectUrl === 'lh1-fp-slot'" :promo-code="list.promoCode" />
    <elsOne2025 v-if="list.redirectUrl === 'lh1-esl-one-raleigh-2025'" :promo-code="list.promoCode" />
    <YuEBaoPromo v-if="list.redirectUrl === 'lh1-yu-e-bao'" :promo-code="list.promoCode" :params="list.param" />
    <BlastRival2025
      v-if="list.redirectUrl === 'lh1-blast-rivals-2025-s1'"
      :promo-code="list.promoCode"
      :params="list.param"
    />

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
import { mapActions } from "pinia";
import { uiStore } from "@/store/ui";
import { userStore } from "@/store";
import moment from "moment";
import { ElMessageBox } from "element-plus";

import { claimBonusItem, submitLuckyNumber, luckyNumberList, winnerList } from "@/api/index/promo";
import ClaimPromo from "../components/hotpromo/claimPromo.vue";
import InviteFriendPromo from "../components/hotpromo/invitefriend/inviteFriendPromo.vue";
import WelcomeTaskPromo from "../components/hotpromo/welcometask/welcomeTaskPromo.vue";
import EsportQuiz from "../components/hotpromo/esportquiz/EsportQuiz.vue";
import PrivilegeInvite from "../components/hotpromo/privilegeInvite/PrivilegeInvite.vue";
import newFootballFight from "../components/hotpromo/newFootballfight/FootballFight.vue";
import Cba30Dream from "../components/hotpromo/cba30-dream/Cba30Dream.vue";
import LplPKlck2025loss from "../components/hotpromo/lpl-lck-2025-loss/lpl-lck-2025-loss.vue";
import LiveDailyRebates from "../components/hotpromo/live-daily-rebates/LiveDailyRebates.vue";
import NewVipRebate from "../components/hotpromo/newVipRebate/NewVipRebate.vue";
import LongNewVip from "../components/hotpromo/longNewVip/LongNewVip.vue";
import GiftPromo from "../components/hotpromo/gift/GiftPromo.vue";
import Cny2024Promo from "../components/hotpromo/cny2024/Cny2024Promo.vue";
import CnyStepGame2024Promo from "../components/hotpromo/cnystepgame2024/CnyStepGame2024Promo.vue";
import Summoner from "../components/hotpromo/summoner/Summoner.vue";
import AppHongBao from "../components/hotpromo/apphongbao/AppHongBao.vue";
import DailyCheckin from "../components/hotpromo/DailyCheckin/DailyCheckin.vue";
import slotLucky8 from "../components/hotpromo/slot-lucky8-2024/slot-lucky8-2024.vue";
import HongBaoPreEurocup from "../components/hotpromo/hongbaoyu2024/HongBaoPreEurocup.vue";
import fishHongbao from "../components/hotpromo/fishHongbao/fishHongbao.vue";
import DepositRebate2 from "../components/hotpromo/depositRebate2/depositRebate2.vue";
import Aijiasu from "../components/hotpromo/aijiasu/Aijiasu.vue";
import newplayerGuide from "../components/hotpromo/newplayerGuide/newplayerGuide.vue";
import OuZuLianPromo from "../components/hotpromo/ouzulian/OuZuLianPromo.vue";
import ChallengeComeBackPromo from "../components/hotpromo/challengeComeback/ChallengeComeback.vue";
import OfficialGiftPromo from "../components/hotpromo/officialGift/OfficialGiftPromo.vue";
import SubmitClaimPromo from "@/components/hotpromo/submitclaim/SubmitClaimPromo.vue";
import DailiPromo from "@/components/hotpromo/daili/DailiPromo.vue";
import SlotLossBonusPromo from "@/components/hotpromo/slot-loss-bonus/SlotLossBonusPromo.vue";
import VctBangkok from "./hotpromo/vct-bangkok/VctBangkok.vue";

import Blast2025 from "../components/hotpromo/Blast2025/Blast2025.vue";
import DarkModePromo from "../components/hotpromo/dark-mode/DarkModePromo.vue";
import SkyesportsSouvenir2025 from "./hotpromo/skyesports-souvenir-2025/SkyesportsSouvenir2025.vue";
import EslProLeagueS21 from "./hotpromo/esl-pro-league-s21/EslProLeagueS21.vue";
import PGLBucharest2025 from "./hotpromo/pgl-bucharest-2025/PGLBucharest2025.vue";
import FissureUniverseS4 from "./hotpromo/fissure-universe-s4/FissureUniverseS4.vue";
import YaLLa2025 from "./hotpromo/YaLLa2025/YaLLa2025.vue";

import IemMelbourne2025 from "./hotpromo/iem-melbourne-2025/IemMelbourne2025.vue";
import PglWallachiaS4 from "./hotpromo/pgl-wallachia-s4/PglWallachiaS4.vue";
import BlastSlam32025 from "./hotpromo/blast-slam-3-2025/BlastSlam32025.vue";
import PglAstana2025  from "./hotpromo/pgl-astana-2025/Pgl-astana-2025.vue";

import Cct2025 from "./hotpromo/Cct-2025/Cct-2025.vue";
import FpSlotPromo from "./hotpromo/fp-slot-promo/FpSlotPromo.vue";
import elsOne2025 from "../components/hotpromo/elsOne2025/elsOne2025.vue";
import YuEBaoPromo from "./hotpromo/yu-e-bao/YuEBaoPromo.vue";
import BlastRival2025 from "./hotpromo/BlastRival2025/BlastRival2025.vue";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    YaLLa2025,
    elsOne2025,
    Cct2025,
    SubmitClaimPromo,
    newFootballFight,
    newplayerGuide,
    slotLucky8,
    ClaimPromo,
    InviteFriendPromo,
    WelcomeTaskPromo,
    EsportQuiz,
    PrivilegeInvite,
    GiftPromo,
    Cny2024Promo,
    CnyStepGame2024Promo,
    Summoner,
    AppHongBao,
    DailyCheckin,
    fishHongbao,
    DepositRebate2,
    HongBaoPreEurocup,
    Aijiasu,
    OuZuLianPromo,
    ChallengeComeBackPromo,
    OfficialGiftPromo,
    Cba30Dream,
    LplPKlck2025loss,
    LiveDailyRebates,
    NewVipRebate,
    LongNewVip,
    DailiPromo,
    SlotLossBonusPromo,
    PGLBucharest2025,
    VctBangkok,
    DarkModePromo,
    SkyesportsSouvenir2025,
    EslProLeagueS21,
    Blast2025,
    FissureUniverseS4,
    IemMelbourne2025,
    PglWallachiaS4,
    BlastSlam32025,
    PglAstana2025,
    FpSlotPromo,
    YuEBaoPromo,
    BlastRival2025
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
    ...mapActions(uiStore, ["notify"]),
    handleSlot() {
      const store = userStore();
      if (!store.hasToken()) {
        ElMessageBox.alert("请登录后再操作", "系统提示", {
          autofocus: false,
          center: true,
          confirmButtonText: "确认",
          showClose: false,
          buttonSize: "large",
          closeOnClickModal: true
        }).then(() => {
          store.loginPageVisible = true;
        });
        return;
      }
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
            this.notify({
              type: "error",
              message: res.message
            });
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
            this.notify({
              type: "success",
              message: "成功发送号码。"
            });
            this.luckyNumber = null;
            this.btnLoading = false;
          } else {
            this.notify({
              type: "error",
              message: res.message
            });
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
            this.notify({
              type: "error",
              message: res.message
            });
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
    font-size: 20px;
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
          flex: 1;
          color: #ffffff;
          text-align: center;

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

.section-bg {
  border: 1px solid rgba(172, 212, 246, 1);
  background: #f2f8fe;
  border-radius: 12px;
  padding: 30px;
  font-family: "PingFang SC";

  &.cny {
    background: url("../assets/images/promotion/hotpromo/hongbaoyu2025/section-bg.png");
    background-size: 100% 100%;
    border: none;
  }

  .claim-title-icon,
  .claim-coin-icon,
  .claim-gift-icon,
  .claim-stacked-coins-icon {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .claim-title-icon {
    background: url("../assets/promo/lh-livepoker-rebate/section-title-img.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .claim-coin-icon {
    background: url("../assets/promo/lh-livepoker-rebate/reward-icon1.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .claim-gift-icon {
    background: url("../assets/promo/lh-livepoker-rebate/reward-icon2.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .claim-stacked-coins-icon {
    background: url("../assets/promo/lh-livepoker-rebate/reward-icon3.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .claim-btn-img {
    aspect-ratio: 762/630;
    width: auto;
    height: 100%;
    background: url("../assets/promo/lh-livepoker-rebate/reward-btn.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .section-table {
    th {
      height: 56px;
      font-size: 1rem;
      font-weight: 400;
      line-height: 28px;
      color: #fff;
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%) !important;
      white-space: pre-wrap;

      &:not(:last-child) {
        border-right: 1px solid #dcdce8;
      }
    }

    td {
      border: 1px solid #dcdce8;
      color: #333;
    }

    &.cny {
      th {
        background: linear-gradient(180deg, #ffe190 0%, #ff9f40 100%) !important;
        color: #894800 !important;
      }
    }
  }

  .element-bg {
    color: #fff !important;
    box-shadow: 0px 8px 9px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
      0px -4px 4px 0px rgba(255, 255, 255, 0.25) inset !important;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%) !important;
  }

  .ribbon {
    clip-path: polygon(0% 0%, 100% 0%, calc(100% - 10px) 50%, 100% 100%, 0% 100%);
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    padding-right: 10px;
    font-family: "PingFang SC";
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: fit-content;
    padding: 0px 20px 0px 10px;
    aspect-ratio: 94/30;
    white-space: nowrap;

    &.cny {
      background: linear-gradient(180deg, #ffe190 0%, #ff9f40 100%);
      color: #894800;
    }
  }

  .title-img {
    aspect-ratio: 2952 / 176;
    background: url("../assets/images/promotion/hotpromo/common/promo-details-title-bg.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 905px 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 35px;
    color: #4c4c6c;
    font-weight: bold;
    letter-spacing: 3px;
    margin: 0 auto;
  }

  .title-img2 {
    aspect-ratio: 2952 / 176;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 905px 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 35px;
    font-weight: bold;
    letter-spacing: 3px;
    margin: 0 auto;
    color: transparent;
    background: linear-gradient(270.62deg, #e6cc93 -6.62%, #fff1e1 101.55%);
    -webkit-background-clip: text;
  }

  .item {
    color: #333;
    padding-left: 24px;
    display: flex;
    gap: 10px;
    font-size: 1rem;
    padding: 3px 0;

    .item-num {
      color: #ffffff;
      font-size: 1rem;
      line-height: 1;
      border-radius: 50%;
      height: 28px !important;
      width: 28px !important;
      min-width: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 2px;
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    }
  }
}

.dark {
  .section-bg {
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%) !important;
    border: 1px solid #be9457 !important;
    color: #fff;

    .claim-title-icon,
    .claim-coin-icon,
    .claim-gift-icon {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .claim-title-icon {
      background: url("../assets/images/promotion/hotpromo/common/claim-title-icon.svg") no-repeat center center;
      background-size: 100% 100%;
    }

    .claim-coin-icon {
      background: url("../assets/images/promotion/hotpromo/common/claim-coin-icon.svg") no-repeat center center;
      background-size: 100% 100%;
    }

    .claim-gift-icon {
      background: url("../assets/images/promotion/hotpromo/common/claim-gift-icon.svg") no-repeat center center;
      background-size: 100% 100%;
    }

    .claim-btn-img {
      aspect-ratio: 199/262;
      width: auto;
      height: 100%;
      max-height: 250px;
      background: url("../assets/images/promotion/hotpromo/common/claim-btn.png") no-repeat center center;
      background-size: 100% 100%;
    }

    .title-img {
      color: #fff;
    }

    .section-table {
      th {
        color: #fff !important;
        background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) !important;
        border-radius: 0px !important;

        &:not(:last-child) {
          border-right: 1px solid #484c5770;
        }
      }

      td {
        border: 1px solid #484c5770;
        color: #fff;
      }
    }

    .element-bg {
      color: #fff !important;
      box-shadow: 0px 8px 9px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
        0px -4px 4px 0px rgba(255, 255, 255, 0.25) inset !important;
      background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) !important;
    }

    .ribbon {
      background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%);
    }

    .item {
      color: #fff;

      .item-num {
        color: #fff !important;
        box-shadow: 0px 8px 9px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
          0px -4px 4px 0px rgba(255, 255, 255, 0.25) inset !important;
        background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) !important;
      }
    }
  }
}
</style>
