<template>
  <div class="hot-promo">
    <ClaimPromo
      v-if="isCommonPromo && store.hasToken()"
      :promo-id="list.id"
      :promo-code="list.promoCode"
      :loading-claim="btnLoading"
      @daily-slot="handleSlot()"
    />
    <PrivilegeInvite
      v-if="
        !isCommonPromo &&
        store.token &&
        (list.redirectUrl === 'Dongying-refer' ||
          list.redirectUrl === 'lh1-vip-upgrade-bonus' ||
          list.redirectUrl === 'lh1-refer-bonus')
      "
    />
    <DragonCardPromo v-if="!isCommonPromo && list.redirectUrl === 'lh1-dragon-card'" />
<!--    <PrizePoolVotePromo v-if="!isCommonPromo && list.redirectUrl === 'Dongying-team-vote'" />-->
    <EurocupVotePromo v-if="!isCommonPromo && list.redirectUrl === 'lh1-team-vote'" />
    <GoldenEggPromo v-if="!isCommonPromo && list.redirectUrl === 'goldenegg'" />
    <HongBaoYu2024 v-if="!isCommonPromo && list.redirectUrl === 'hongbaoyu'" :promo-code="list.promoCode" />
    <UpcomingMatchPromo v-if="!isCommonPromo && list.redirectUrl === 'lh1-nba-safety'" platformType="NBA" />

    <HongBaoPreEurocup v-if="!isCommonPromo && list.redirectUrl === 'tiqianhongbao'" :promo-code="list.promoCode" />

    <UpcomingMatchPromo
      v-if="
        (!isCommonPromo && list.redirectUrl === 'lh1-esport-safety') ||
        (!isCommonPromo && list.redirectUrl === 'lh1-sport-safety')
      "
      :platformType="list.redirectUrl === 'lh1-esport-safety' ? 'ESPORT' : 'SPORT'"
    />

    <InsuranceSubmitPromo
      v-if="
        (!isCommonPromo && list.redirectUrl === 'lh1-esport-safety') ||
        (!isCommonPromo && list.redirectUrl === 'lh1-sport-safety')
      "
      :platformType="list.redirectUrl === 'lh1-esport-safety' ? 'ESPORT' : 'SPORT'"
    />

    <FeedbackAwardPromo v-if="list.redirectUrl === 'lh1-feedback-awards' && !isCommonPromo" />

    <AppHongBao
      v-if="list.redirectUrl === 'lh1-app-hongbao' && !isCommonPromo && store.token"
      :promo-code="list.promoCode"
      :params="list.param"
    />
    <FtdPromo v-if="list.redirectUrl === 'lh1-ftd-promo' && !isCommonPromo && store.token" />

    <PrivilegeInvitePromo
      v-if="
        (list.redirectUrl === 'lh1-invite' ||
          list.redirectUrl === 'lh1-invite-2' ||
          list.redirectUrl === 'lh1-invite-3') &&
        !isCommonPromo
      "
    />

    <LotteryPromo v-if="list.redirectUrl === 'lh1-lottery' && !isCommonPromo && store.token" />

    <InviteFriendPromo v-if="list.redirectUrl === 'invitefriend' && !isCommonPromo" />
    <EsportQuiz v-if="list.redirectUrl === 'lh1-quiz' && !isCommonPromo" />

    <DailyLoginPromo v-if="list.redirectUrl === 'lh1-monthly-sign' && !isCommonPromo" />

    <LoginRewardPromo v-if="list.redirectUrl === 'lh1-login-reward' && !isCommonPromo" />

    <FootballFightPromo v-if="list.redirectUrl === 'lh1-football-fight' && !isCommonPromo" />

    <UpgradeHongBaoPromo
      v-if="list.redirectUrl === 'lh1-upgrade-hongbao' && !isCommonPromo"
      :promo-code="list.promoCode"
      :params="list.param"
    />

    <GiftPromo v-if="list.redirectUrl === 'lh1-gift' && !isCommonPromo && store.token"></GiftPromo>

    <AsiaCup2024Promo
      v-if="
        (list.redirectUrl === 'asian-cup-2024' || list.redirectUrl === 'dy-promo-application-A') &&
        !isCommonPromo &&
        store.token
      "
    ></AsiaCup2024Promo>
    <BasketballHot v-if="list.redirectUrl === '/dy-promo-basketball' && !isCommonPromo"></BasketballHot>
    <LplSummerPromo v-if="list.redirectUrl === 'lh1-lpl-game' && !isCommonPromo && store.token"></LplSummerPromo>

    <Cny2024Promo v-if="list.redirectUrl === 'lh1-cny2024-promo' && !isCommonPromo && store.token"></Cny2024Promo>
    <BbDacha2024Promo v-if="list.redirectUrl === 'lh1-asian-zone' && !isCommonPromo && store.token"></BbDacha2024Promo>
    <CnyStepGame2024Promo
      v-if="list.redirectUrl === 'lh1-cny-step-game' && !isCommonPromo && store.token"
    ></CnyStepGame2024Promo>
    <LhStepGamePromo
      v-if="list.redirectUrl === 'lh1-game-steps' && !isCommonPromo && store.token"
      :pageContent="list.pageContent"
    ></LhStepGamePromo>
    <CS2Sign
      v-if="list.redirectUrl === 'lh-cs2-copenhagen-major-2024' && !isCommonPromo && store.token"
      :promo-code="list.promoCode"
    />
    <BonusSpinWheel v-if="list.redirectUrl === 'lh1-spin-wheel' && !isCommonPromo && store.token" />
    <SummonerPromo
      v-if="list.redirectUrl === 'lh1-summon-event' && !isCommonPromo && store.token"
      :promo-code="list.promoCode"
    />
    <LOLMsi2024Promo v-if="list.redirectUrl === 'lh-msi-match' && !isCommonPromo && store.token" />
    <EuroCup2024
      v-if="list.redirectUrl === 'lh1-eurocup-2024' && !isCommonPromo && store.token"
      :promo-code="list.promoCode"
    />
    <EuroCup2024FirstShoot v-if="list.redirectUrl === 'lh1-eurocup-firstshoot' && !isCommonPromo && store.token" />
    <BlastPremierPromo
      v-if="list.redirectUrl === 'lh-cs2-blast-2024' && !isCommonPromo && store.token"
      :promo-code="list.promoCode"
    />
    <EurocupManual v-if="list.redirectUrl === 'lh-eurocup-manual' && !isCommonPromo && store.token" />
    <SportZhongChao v-if="list.redirectUrl === 'lh-sport-zhongchao' && !isCommonPromo && store.token" />
    <Nba24Match v-if="list.redirectUrl === 'lh-nba24-match' && !isCommonPromo && store.token" />
    <fishHongbao v-if="list.redirectUrl === 'lh-fish-hongbao' && !isCommonPromo && store.token" />
    <LPLSummer2024 v-if="list.redirectUrl === 'lh-lpl-summer24' && !isCommonPromo && store.token" />
    <DuanWuJiePromo v-if="list.redirectUrl === 'lh-duanwujie24' && !isCommonPromo && store.token" />
  </div>

  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="row items-center">
        <div class="bonus-svg-div">
          <span class="bonus-text">恭喜获得奖金</span>
          <span class="claim-amt">{{ claimMsg }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="确定" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { userStore } from "stores/index";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import * as _ from "lodash";
import moment from "moment";
import ClaimPromo from "../components/hotpromo/claimPromo.vue";
import DragonCardPromo from "../components/hotpromo/dragoncard/dragonCardPromo.vue";
import EurocupVotePromo from "../components/hotpromo/eurocup-2024-vote/eurocupVotePromo.vue";
import GoldenEggPromo from "../components/hotpromo/goldenegg/goldenEggPromo.vue";
import HongBaoPreEurocup from "../components/hotpromo/hongbaoyu/HongBaoPreEurocup.vue";
import HongBaoYu2024 from "../components/hotpromo/hongbaoyu2024/HongBaoYu2024.vue";
import UpcomingMatchPromo from "../components/hotpromo/upcomingmatch/upcomingMatchPromo.vue";
import InsuranceSubmitPromo from "../components/hotpromo/insurancesubmit/insuranceSubmitPromo.vue";
import FeedbackAwardPromo from "../components/hotpromo/feedbackaward/feedbackAwardPromo.vue";
import PrivilegeInvitePromo from "../components/hotpromo/privilegeinvite/privilegeInvitePromo.vue";
// import InviteFriendPromo from "../components/hotpromo/invitefriend/inviteFriendPromo.vue";
import EsportQuiz from "../components/hotpromo/esportquiz/EsportQuiz.vue";
import LotteryPromo from "../components/hotpromo/lottery/LotteryPromo.vue";
import DailyLoginPromo from "../components/hotpromo/dailylogin/dailyLoginPromo.vue";
import LoginRewardPromo from "../components/hotpromo/loginreward/loginRewardPromo.vue";
import FootballFightPromo from "../components/hotpromo/footballfight/footballFightPromo.vue";
import UpgradeHongBaoPromo from "../components/hotpromo/upgradehongbao/upgradeHongBaoPromo.vue";
// import GiftPromo from "../components/hotpromo/gift/GiftPromo.vue";
// import PrivilegeInvite from "../components/hotpromo/privilegeinviteA/PrivilegeInvite.vue";
// import AsiaCup2024Promo from "../components/hotpromo/asiacup2024/AsiaCup2024Promo.vue";
// import BasketballHot from "../components/hotpromo/basketballHot/BasketballHot.vue";
import LplSummerPromo from "../components/hotpromo/lplsummer/LplSummerPromo.vue";
// import Cny2024Promo from "../components/hotpromo/cny2024/Cny2024Promo.vue";
import BbDacha2024Promo from "../components/hotpromo/bbdacha2024/BbDacha2024Promo.vue";
// import CnyStepGame2024Promo from "../components/hotpromo/cnystepgame2024/CnyStepGame2024Promo.vue";
import LhStepGamePromo from "../components/hotpromo/lhstepgame/LhStepGamePromo.vue";
import CS2Sign from "../components/hotpromo/CS2Sign/CS2Sign.vue";
import BonusSpinWheel from "../components/hotpromo/bonusSpinWheel/BonusSpinWheel.vue";
import SummonerPromo from "../components/hotpromo/summoner/SummonerPromo.vue";
import AppHongBao from "../components/hotpromo/apphongbao/AppHongBao.vue";
import FtdPromo from "../components/hotpromo/ftd/FtdPromo.vue";
import LOLMsi2024Promo from "../components/hotpromo/LOL-msi-2024/LOLMsi2024Promo.vue";
import EuroCup2024 from "../components/hotpromo/europe-2024/EuroCup2024.vue";
import EuroCup2024FirstShoot from "./hotpromo/europe-2024-first-shoot/EuroCup2024FirstShoot.vue";
import BlastPremierPromo from "../components/hotpromo/BlastPremierPromo/BlastPremierPromo.vue";
import EurocupManual from "../components/hotpromo/EurocupManual/EurocupManual.vue";
import SportZhongChao from "../components/hotpromo/SportZhongChao/SportZhongChao.vue";
import Nba24Match from "../components/hotpromo/Nba24Match/Nba24Match.vue";
import fishHongbao from "../components/hotpromo/fishHongbao/fishHongbao.vue";
import LPLSummer2024 from "../components/hotpromo/lpl-summer-2024/LPLSummer2024.vue";
import DuanWuJiePromo from "../components/hotpromo/dragonboat/DragonBoat.vue";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    fishHongbao,
    ClaimPromo,
    DragonCardPromo,
    EurocupVotePromo,
    GoldenEggPromo,
    HongBaoYu2024,
    UpcomingMatchPromo,
    InsuranceSubmitPromo,
    FeedbackAwardPromo,
    PrivilegeInvitePromo,
    // InviteFriendPromo,
    EsportQuiz,
    LotteryPromo,
    DailyLoginPromo,
    LoginRewardPromo,
    FootballFightPromo,
    UpgradeHongBaoPromo,
    // GiftPromo,
    // PrivilegeInvite,
    // AsiaCup2024Promo,
    // BasketballHot,
    HongBaoPreEurocup,
    LplSummerPromo,
    // Cny2024Promo,
    BbDacha2024Promo,
    CS2Sign,
    // CnyStepGame2024Promo
    BonusSpinWheel,
    LhStepGamePromo,
    SummonerPromo,
    AppHongBao,
    FtdPromo,
    LOLMsi2024Promo,
    EuroCup2024,
    EuroCup2024FirstShoot,
    BlastPremierPromo,
    EurocupManual,
    SportZhongChao,
    Nba24Match,
    LPLSummer2024,
    DuanWuJiePromo
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
      isCommonPromo: null,
      activeKey: "1",
      hotPromoList: [],
      selectedHotPromo: {
        id: "",
        bg: "",
        contents: ""
      }
    };
  },
  methods: {
    handleSlot() {
      const bonusItem = this.list.promoCode;
      const eventUrl = "/bonus/claim/" + bonusItem;
      this.btnLoading = true;
      eventapi
        .put(eventUrl)
        .then((res) => {
          this.btnLoading = false;
          if (res.code === 0) {
            var rebatePoint = res.data;
            this.claimMsg = "￥" + rebatePoint;
            this.isClaimModal = true;
          } else {
            this.btnLoading = false;
          }
        })
        .catch((error) => {
          this.btnLoading = false;
        });
    }
  },
  mounted() {
    this.hotPromoList.forEach((element) => {
      if (this.list.id === element.id) {
        this.selectedHotPromo = element;
      }
    });
    if (
      this.list.redirectUrl === "lh1-tiger-card" ||
      this.list.redirectUrl === "Dongying-team-vote" ||
      this.list.redirectUrl === "goldenegg" ||
      this.list.redirectUrl === "hongbaoyu" ||
      this.list.redirectUrl === "invitefriend" ||
      this.list.redirectUrl === "welcomenewuser" ||
      this.list.redirectUrl === "lh1-lottery" ||
      this.list.redirectUrl === "lh1-quiz" ||
      this.list.redirectUrl === "lh1-nba-safety" ||
      this.list.redirectUrl === "lh1-esport-safety" ||
      this.list.redirectUrl === "lh1-sport-safety" ||
      this.list.redirectUrl === "lh1-gift" ||
      this.list.redirectUrl === "Dongying-refer" ||
      this.list.redirectUrl === "lh1-vip-upgrade-bonus" ||
      this.list.redirectUrl === "lh1-refer-bonus" ||
      this.list.redirectUrl === "asian-cup-2024" ||
      this.list.redirectUrl === "/dy-promo-basketball" ||
      this.list.redirectUrl === "lpl-summer" ||
      this.list.redirectUrl === "dy-promo-application-A" ||
      this.list.redirectUrl === "dy-promo-application-B" ||
      this.list.redirectUrl === "lh1-cny2024-promo" ||
      this.list.redirectUrl === "lh1-asian-zone" ||
      this.list.redirectUrl === "lh1-cny-step-game" ||
      this.list.redirectUrl === "lh1-feedback-award" ||
      this.list.redirectUrl === "lh1-invite" ||
      this.list.redirectUrl === "lh1-invite-2" ||
      this.list.redirectUrl === "lh1-invite-3" ||
      this.list.redirectUrl === "lh1-s13-vote" ||
      this.list.redirectUrl === "lh1-team-vote" ||
      this.list.redirectUrl === "lh1-monthly-sign" ||
      this.list.redirectUrl === "lh1-sports-continuous-win" ||
      this.list.redirectUrl === "lh1-gift8" ||
      this.list.redirectUrl === "lh1-upgrade-hongbao" ||
      this.list.redirectUrl === "lh1-login-reward" ||
      this.list.redirectUrl === "lh1-football-fight" ||
      this.list.redirectUrl === "lh1-dragon-card" ||
      this.list.redirectUrl === "lh1-lpl-game" ||
      this.list.redirectUrl === "lh-cs2-copenhagen-major-2024" ||
      this.list.redirectUrl === "lh1-spin-wheel" ||
      this.list.redirectUrl === "lh1-game-steps" ||
      this.list.redirectUrl === "lh1-summon-event" ||
      this.list.redirectUrl === "lh1-app-hongbao" ||
      this.list.redirectUrl === "lh1-ftd-promo" ||
      this.list.redirectUrl === "lh-msi-match" ||
      this.list.redirectUrl === "lh1-eurocup-2024" ||
      this.list.redirectUrl === "lh1-eurocup-firstshoot" ||
      this.list.redirectUrl === "lh-cs2-blast-2024" ||
      this.list.redirectUrl === "lh-eurocup-manual" ||
      this.list.redirectUrl === "lh-sport-zhongchao" ||
      this.list.redirectUrl === "lh-nba24-match" ||
      this.list.redirectUrl === "lh-fish-hongbao" ||
      this.list.redirectUrl === "lh-lpl-summer24" ||
      this.list.redirectUrl === "lh-sport-zhongchao"||
      this.list.redirectUrl === "lh-duanwujie24" ||
      this.list.redirectUrl === "tiqianhongbao"
    ) {
      this.isCommonPromo = false;
    } else {
      this.isCommonPromo = true;
    }
    const store = userStore();

    if (this.list.id == 30) {
      // console.log("Iphone promo");
      // this.loadLNWinnerList();
      if (store.hasToken()) {
        this.filterWinnerLists();
      }
    }
  },
  setup() {
    const $q = useQuasar();
    const store = userStore();
    var qs = require("qs");

    const loading = ref(false);
    const btnLoading = ref(false);
    const isClaimModal = ref(false);
    const claimMsg = ref("");
    const formState = ref({
      dateTime: "",
      onlyMe: false,
      resultTime: ""
    });

    const winnerDataSource = ref([]);
    const filterWinnerLists = () => {
      var resultTime = formState.value.resultTime;
      var winnerUrl = "/privi/winners";
      if (resultTime) {
        winnerUrl += "?resultTime=" + resultTime;
      }

      // console.log(winnerUrl);

      winnerDataSource.value = [];
      loading.value = true;
      eventapi.get(winnerUrl).then((res) => {
        loading.value = false;
        var data = res.data.data;

        for (let i in data) {
          _.each(data[i].winners, function (winner, index) {
            winner.date = moment(data[i].resultTime).format("DD/MM/YYYY");

            winnerDataSource.value.push(winner);
          });
        }
      });
    };

    // const loadLNWinnerList = () => {
    //   const winnerUrl = "/privi/winners";
    //   winnerDataSource.value = [];
    //   loading.value = true;
    //   eventapi
    //     .get(winnerUrl)
    //     .then((res) => {
    //       loading.value = false;
    //       var data = res.data.data;

    //       for (let i in data) {
    //         _.each(data[i].winners, function (winner, index) {

    //           winner.date = moment(data[i].resultTime).format("DD/MM/YYYY");
    //           console.log(winner);

    //           winnerDataSource.value.push(winner);
    //         })
    //       }
    //     });
    // }

    // const ClaimDailyRebate = (id) => {
    //   if (!store.hasToken()) {
    //   } else {
    //     // var user_id = store.id;
    //     var claim_id = '';
    //     if (id == 27) {
    //       claim_id = 'jolly88-daily-rebate';
    //     } else if (id == 32) {
    //       claim_id = 'jolly88-daily-slot';
    //     } else if (id == 31) {
    //       claim_id = 'jolly88-refund';
    //     }

    //     // console.log(eventapi);

    // }
    // }

    return {
      store,
      filterWinnerLists,
      formState,
      winnerDataSource,
      loading,
      btnLoading,
      isClaimModal,
      claimMsg
    };
  }
});
</script>
<style lang="scss">
.hot-promo {
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  .promo-bg {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .common-promo {
    background-size: contain;
    gap: 30px;
    text-align: center;
    padding: 20px;

    .extra-img {
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
      // color: #ffffff;

      .orange {
        color: #db7e42;
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

.promo-sjb,
.promo-invt {
  background: #2b2b4b;
  padding: 10px;
}

.win-rebate-model {
  width: 80%;
  max-width: 450px;
  min-width: 300px;
  padding: 10px;
  background: transparent;
  position: relative;
  box-shadow: none;

  .close-btn {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 5;

    .q-btn,
    .q-btn__content {
      margin-top: 0px;
      width: 40px;
      height: 40px;
    }

    .q-btn__content {
      color: #000;
      width: 8px;
      background-image: none !important;
    }
  }

  .bonus-svg-div {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;

    .claim-amt {
      font-size: 30px;
      color: var(--q-primary);
      text-align: center;
    }

    .bonus-text {
      font-size: 22px;
      // color: #ff3131;
      color: var(--q-primary);
      text-align: center;
      font-weight: 700;
      white-space: nowrap;
    }
  }

  .q-btn-item {
    margin-top: 10px;
  }

  .q-btn__content {
    color: #fff;
    background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%) !important;
    width: 80px;
    border-radius: 5px;
    -moz-border-radius: 5px;
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

      .extra-img {
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
./hotpromo/EurocupManual1/EurocupManual.vue
