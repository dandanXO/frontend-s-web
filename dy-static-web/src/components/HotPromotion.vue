<template>
  <div class="hot-promo" :class="list.redirectUrl === 'dy2-game-steps' && 'flat-border-radius'">
    <ClaimPromo
      v-if="listParam.type === 'claimpromo'"
      :promo-id="list.id"
      :promo-code="list.promoCode"
      :loading-claim="loadingClaim"
      @daily-slot="handleSlot()"
    />
    <TigerCardPromo v-if="list.redirectUrl === 'dy2-tiger-card'" />
    <PrizePoolVotePromo v-if="list.redirectUrl === 'Dongying-team-vote'" />
    <ESportSafetyPromo v-if="list.redirectUrl === 'dy2-esport-safety'" />
    <SportSafetyPromo v-if="list.redirectUrl === 'sport-safety'" />
    <NbaGamePromo v-if="list.redirectUrl === 'nba-game'" />
    <MeiZhouBeiPromoPage v-if="list.redirectUrl === 'dy2meizhoubei'" />
    <OuZuLianPromo v-if="list.redirectUrl === 'ouzulian'" />
    <GoldenEggPromo v-if="list.redirectUrl === 'goldenegg'" />

    <WelcomeTaskPromo v-if="list.redirectUrl === 'welcomenewuser'" />
    <InviteFriendPromo v-if="list.redirectUrl === 'invitefriend'" />
    <EsportQuiz v-if="list.redirectUrl === 'Dongying-quiz'"></EsportQuiz>
    <LotteryPromo v-if="list.redirectUrl === 'dy2-lottery'"></LotteryPromo>
    <GiftPromo v-if="list.redirectUrl === 'dy2-gift'"></GiftPromo>
    <AsianCup2024 v-if="list.redirectUrl === 'dy-promo-application-A'"></AsianCup2024>
    <BasketballHot v-if="list.redirectUrl === '/dy-promo-basketball'"></BasketballHot>
    <Nba24Match v-if="list.redirectUrl === 'dy2-nba24-match'" />
    <Olympic24Match v-if="list.redirectUrl === 'dy2-olympic-match'" />
    <LPLSummer v-if="list.redirectUrl === 'dy-promo-application-B'"></LPLSummer>
    <LPLLCK v-if="list.redirectUrl === 'dy2-lpl-lck'" />
    <Cny2024Promo v-if="list.redirectUrl === 'dy2-cny2024-promo'"></Cny2024Promo>
    <BbDacha2024Promo v-if="list.redirectUrl === 'dy2-asian-zone'"></BbDacha2024Promo>
    <LivepokerRebate v-if="list.redirectUrl === 'dy2-livepoker-rebate'" :promo-code="list.promoCode"/>
    <PrivilegeInvite
      v-if="
        list.redirectUrl === 'Dongying-refer' ||
        list.redirectUrl === 'dy2-refer-bonus' ||
        list.redirectUrl === 'dy2-refer-bonus'
      "
    />
    <CnyStepGame2024Promo v-if="list.redirectUrl === 'dy2-cny-step-game'"></CnyStepGame2024Promo>

    <Dy2StepGamePromo v-if="list.redirectUrl === 'dy2-game-steps'" :pageContent="list.pageContent"></Dy2StepGamePromo>

    <CS2Sign v-if="list.redirectUrl === 'dy2-cs2-copenhagen-major-2024'" :promo-code="list.promoCode" />
    <BonusSpinWheel v-if="list.redirectUrl === 'dy2-spin-wheel'" />
    <LOLMsi2024Promo v-if="list.redirectUrl === 'dy2-msi-promo'" />
    <HongBaoYuEurocupPromo
      :promo-code="list.promoCode"
      :pageContent="list.pageContent"
      :promoParam="list.param"
      v-if="list.redirectUrl === 'dy2-eurocup-hongbao'"
    />

    <HongBaoPreEurocupPromo
      :promo-code="list.promoCode"
      :pageContent="list.pageContent"
      :promoParam="list.param"
      v-if="listParam.type === 'hongbaoyu'"
    />
    <LPLSummer24 v-if="list.redirectUrl === 'dy2-lpl-summer24'" />
    <DragonBoat v-if="list.redirectUrl === 'dy-duanwujie24'" />
    <EurocupManual v-if="list.redirectUrl === 'dy2-eurocup-manual'" />
    <BlastPremierPromo v-if="list.redirectUrl === 'dy2-cs2-blast-2024'" :promo-code="list.promoCode" />
    <SportZhongChao v-if="list.redirectUrl === 'dy-sport-zhongchao'" />
    <fishHongbao v-if="list.redirectUrl === 'dy-fish-hongbao'" />
    <OlympicFund v-if="list.redirectUrl === 'dy2-olympic-fund'" />
    <slotLucky8 v-if="list.redirectUrl === 'dy-lucky-slot'" :promo-code="list.promoCode" />
    <NewplayerGuide v-if="list.redirectUrl === 'dy2-newplayer-guide'" />
    <intelEsl2024 v-if="list.redirectUrl === 'dy2-intel-esl'" />

    <newFootballFight v-if="list.redirectUrl === 'dy2-football'" :promo-code="list.promoCode"/>
    <div style="text-align: center" v-if="list.redirectUrl === 'fankuijianyi'">
      <img
        style="max-width: 1200px; width: 100%; margin: 25px auto 0px"
        src="../assets/images/promotion/webfeedback.png"
      />
    </div>

    <div style="text-align: center" v-if="list.redirectUrl === 'dy-ouzhoumianpei'">
      <div class="cs-btn" @click="store.openLiveChat()">联系客服</div>
    </div>

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
import { claimBonusItem } from "@/api/index/promo";
import ClaimPromo from "../components/hotpromo/claimPromo.vue";
import TigerCardPromo from "../components/hotpromo/tigercard/tigerCardPromo.vue";
import PrizePoolVotePromo from "../components/hotpromo/prizePoolVote/prizePoolVotePromo.vue";
import ESportSafetyPromo from "../components/hotpromo/eSportSafety/eSportSafetyPromo.vue";
import SportSafetyPromo from "../components/hotpromo/sportSafety/sportSafetyPromo.vue";
import MeiZhouBeiPromoPage from "./hotpromo/meizhoubei/MeiZhouBeiPromoPage.vue";
import NbaGamePromo from "../components/hotpromo/nbagame/nbaGamePromo.vue";
import GoldenEggPromo from "../components/hotpromo/goldenegg/goldenEggPromo.vue";
import HongBaoYuPromo from "../components/hotpromo/hongbaoyu/HongBaoYu.vue";
import InviteFriendPromo from "../components/hotpromo/invitefriend/inviteFriendPromo.vue";
import slotLucky8 from "../components/hotpromo/slot-lucky8-2024/slot-lucky8-2024.vue";
import WelcomeTaskPromo from "../components/hotpromo/welcometask/welcomeTaskPromo.vue";
import EsportQuiz from "../components/hotpromo/esportquiz/EsportQuiz.vue";
import LotteryPromo from "../components/hotpromo/lottery/LotteryPromo.vue";
import PrivilegeInvite from "../components/hotpromo/privilegeInvite/PrivilegeInvite.vue";
import GiftPromo from "../components/hotpromo/gift/GiftPromo.vue";
import AsianCup2024 from "../components/hotpromo/asian-cup-2024/AsianCup2024.vue";
import BasketballHot from "../components/hotpromo/basketball-hot/BasketballHot.vue";
import LPLSummer from "../components/hotpromo/lpl-summer/LPLSummer.vue";
import Cny2024Promo from "../components/hotpromo/cny2024/Cny2024Promo.vue";
import BbDacha2024Promo from "../components/hotpromo/bbdacha2024/BbDacha2024Promo.vue";
import CnyStepGame2024Promo from "../components/hotpromo/cnystepgame2024/CnyStepGame2024Promo.vue";
import Dy2StepGamePromo from "../components/hotpromo/dy2stepgame/Dy2StepGamePromo.vue";
import Nba24Match from "../components/hotpromo/Nba24Match/Nba24Match.vue";
import CS2Sign from "../components/hotpromo/CS2Sign/CS2Sign.vue";
import BonusSpinWheel from "../components/hotpromo/bonusSpinWheel/BonusSpinWheel.vue";
import LOLMsi2024Promo from "../components/hotpromo/LOL-msi-2024/LOLMsi2024Promo.vue";
import HongBaoYuEurocupPromo from "../components/hotpromo/hongbaoyu/HongBaoYuEurocup.vue";
import HongBaoPreEurocupPromo from "../components/hotpromo/hongbaoyu/HongBaoPreEurocup.vue";
import LPLSummer24 from "../components/hotpromo/lpl-summer-2024/LPLSummer2024.vue";
import intelEsl2024 from "../components/hotpromo/intel-esl-2024/intel-esl-2024.vue";
import DragonBoat from "../components/hotpromo/dragonboat/DragonBoat.vue";
import EurocupManual from "../components/hotpromo/EurocupManual/EurocupManual.vue";
import NewplayerGuide from "../components/hotpromo/newplayerguide/NewPlayerGuide.vue";

import SportZhongChao from "../components/hotpromo/SportZhongChao/SportZhongChao.vue";
import BlastPremierPromo from "../components/hotpromo/BlastPremierPromo/BlastPremierPromo.vue";
import fishHongbao from "../components/hotpromo/fishHongbao/fishHongbao.vue";
import Olympic24Match from "@/components/hotpromo/Olympic24Match/Olympic24Match.vue";
import OlympicFund from "@/components/hotpromo/olympic-fund/OlympicFund.vue";
import LivepokerRebate from "@/components/hotpromo/livepoker-rebate/LivepokerRebate.vue";

import OuZuLianPromo from "../components/hotpromo/ouzulian/OuZuLianPromo.vue";
import LPLLCK from "../components/hotpromo/lpllck/LPLLCK.vue";
import newFootballFight from "../components/hotpromo/newFootballfight/FootballFight.vue";

import { ElMessage, ElMessageBox } from "element-plus";
import { userStore } from "@/store";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    LivepokerRebate,
    SportZhongChao,
    BlastPremierPromo,
    fishHongbao,
    Olympic24Match,
    OlympicFund,
    Nba24Match,
    ClaimPromo,
    TigerCardPromo,
    MeiZhouBeiPromoPage,
    PrizePoolVotePromo,
    ESportSafetyPromo,
    SportSafetyPromo,
    NbaGamePromo,
    GoldenEggPromo,
    HongBaoYuPromo,
    InviteFriendPromo,
    WelcomeTaskPromo,
    EsportQuiz,
    LotteryPromo,
    PrivilegeInvite,
    GiftPromo,
    AsianCup2024,
    BasketballHot,
    LPLSummer,
    Cny2024Promo,
    BbDacha2024Promo,
    CnyStepGame2024Promo,
    Dy2StepGamePromo,
    CS2Sign,
    slotLucky8,
    BonusSpinWheel,
    LOLMsi2024Promo,
    HongBaoYuEurocupPromo,
    HongBaoPreEurocupPromo,
    LPLSummer24,
    intelEsl2024,
    DragonBoat,
    EurocupManual,
    OuZuLianPromo,
    NewplayerGuide,
    LPLLCK,
    newFootballFight
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
      store: userStore(),
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
      ]
    };
  },
  computed: {
    listParam() {
      try {
        console.log(JSON.parse(this.list.param));
        return JSON.parse(this.list.param);
      } catch (e) {
        console.log(e);
        return {};
      }
    }
  },
  methods: {
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
            ElMessage.error(res.message);
            this.loadingClaim = false;
          }
        })
        .catch((err) => {
          console.log(err.message);
          // message.error(err.message, 4);
          this.loadingClaim = false;
        });
    }
  },
  mounted() {
    console.log("Mount");
    // console.log(this.list);
    // List for non common promo
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
    align-items: center;

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
}

.cs-btn {
  cursor: pointer;
  display: block;
  width: 198px;
  height: 52px;
  background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#000, #000);
  background-blend-mode: normal, normal;
  border-radius: 26px;
  color: #fff;
  font-size: 16px;
  margin: 0 auto;
  text-align: center;
  line-height: 52px;
  border: none;

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
  }
}
</style>
