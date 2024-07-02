<template>
  <div class="hot-promo">
    <ClaimPromo
      v-if="isCommonPromo && store.hasToken()"
      :promo-id="list.id"
      :promo-code="list.promoCode"
      :loading-claim="btnLoading"
      @daily-slot="handleSlot()"
    />
    <DragonCardPromo v-if="!isCommonPromo && list.redirectUrl === 'lh1-dragon-card'" />
    <EurocupVotePromo v-if="!isCommonPromo && list.redirectUrl === 'lh1-team-vote'" />
    <GoldenEggPromo v-if="!isCommonPromo && list.redirectUrl === 'goldenegg'" />
    <HongBaoPreEurocup v-if="!isCommonPromo && list.redirectUrl === 'tiqianhongbao' && store.token" :promo-code="list.promoCode" />
    <UpcomingMatchPromo v-if="!isCommonPromo && list.redirectUrl === 'lh1-nba-safety'" platformType="NBA" />

    <HongBaoPreEurocup
      v-if="!isCommonPromo && list.redirectUrl === 'lh1-jiajianghongbaoyu'"
      :promo-code="list.promoCode"
    />

    <UpcomingMatchPromo
      v-if="
        (!isCommonPromo && list.redirectUrl === 'lh1-esport-safety') ||
        (!isCommonPromo && list.redirectUrl === 'lh1-sport-safety')
      "
      :platformType="list.redirectUrl === 'lh1-esport-safety' ? 'ESPORT' : 'SPORT'"
    />
    <MeiZhouBeiPromo v-if="!isCommonPromo && list.redirectUrl === 'lh1meizhoubei'" platformType="COPA" />

    <InsuranceSubmitPromo
      v-if="
        (!isCommonPromo && list.redirectUrl === 'lh1-esport-safety') ||
        (!isCommonPromo && list.redirectUrl === 'lh1-sport-safety')
      "
      :platformType="list.redirectUrl === 'lh1-esport-safety' ? 'ESPORT' : 'SPORT'"
    />

    <FeedbackAwardPromo v-if="list.redirectUrl === 'lh1-feedback-award' && !isCommonPromo" />
    <div style="text-align: center" v-if="list.redirectUrl === 'lh1ouzhoubeibaopei' && store.token">
      <div class="cs-btn" @click="goToCsChat()">联系客服</div>
    </div>

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

    <EsportQuiz v-if="list.redirectUrl === 'lh1-quiz' && !isCommonPromo" />

    <DailyLoginPromo v-if="list.redirectUrl === 'lh1-monthly-sign' && !isCommonPromo" />

    <LoginRewardPromo v-if="list.redirectUrl === 'lh1-login-reward' && !isCommonPromo" />

    <FootballFightPromo v-if="list.redirectUrl === 'lh1-football-fight' && !isCommonPromo" />

    <UpgradeHongBaoPromo
      v-if="list.redirectUrl === 'lh1-upgrade-hongbao' && !isCommonPromo"
      :promo-code="list.promoCode"
      :params="list.param"
    />


    <LplSummerPromo v-if="list.redirectUrl === 'lh1-lpl-game' && !isCommonPromo && store.token"></LplSummerPromo>

    <BbDacha2024Promo v-if="list.redirectUrl === 'lh1-asian-zone' && !isCommonPromo && store.token"></BbDacha2024Promo>
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
    <SlotLacky8
      v-if="list.redirectUrl === 'lh1-slot-lucky8' && !isCommonPromo && store.token"
      :promo-code="list.promoCode"
    />
    <fishHongbao v-if="list.redirectUrl === 'lh-fish-hongbao' && !isCommonPromo && store.token" />
    <LPLSummer2024 v-if="list.redirectUrl === 'lh-lpl-summer24' && !isCommonPromo && store.token" />
    <IntelEls24 v-if="list.redirectUrl === 'lh1-intel-esl' && !isCommonPromo && store.token" />
    <DuanWuJiePromo v-if="list.redirectUrl === 'lh-duanwujie24' && !isCommonPromo && store.token" />
    <DepositRebates v-if="list.redirectUrl === 'lh1-deposit-rebates' && !isCommonPromo && store.token" />
    <WinLossPromo v-if="list.redirectUrl === 'lh1-eurocup-guess' && !isCommonPromo && store.token" />
    <AijiasuPromo v-if="list.redirectUrl === 'lh1-aijiasu' && !isCommonPromo && store.token" />
    <EuroRegen v-if="list.redirectUrl === 'lh1-eurocup-regen' && !isCommonPromo && store.token" />
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
/* eslint-disable */
import { defineAsyncComponent, defineComponent, onMounted, ref } from "vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import moment from "moment";

const ClaimPromo = defineAsyncComponent(() => import("../components/hotpromo/claimPromo.vue"));
const DragonCardPromo = defineAsyncComponent(() => import("../components/hotpromo/dragoncard/dragonCardPromo.vue"));
const EurocupVotePromo = defineAsyncComponent(() => import("../components/hotpromo/eurocup-2024-vote/eurocupVotePromo.vue"));
const GoldenEggPromo = defineAsyncComponent(() => import("../components/hotpromo/goldenegg/goldenEggPromo.vue"));
const HongBaoPreEurocup = defineAsyncComponent(() => import("../components/hotpromo/hongbaoyu/HongBaoPreEurocup.vue"));
const HongBaoYu2024 = defineAsyncComponent(() => import("../components/hotpromo/hongbaoyu2024/HongBaoYu2024.vue"));
const UpcomingMatchPromo = defineAsyncComponent(() => import("../components/hotpromo/upcomingmatch/upcomingMatchPromo.vue"));
const MeiZhouBeiPromo = defineAsyncComponent(() => import("../components/hotpromo/meizhoubei/MeiZhouBeiPromo.vue"));
const InsuranceSubmitPromo = defineAsyncComponent(() => import("../components/hotpromo/insurancesubmit/insuranceSubmitPromo.vue"));
const FeedbackAwardPromo = defineAsyncComponent(() => import("../components/hotpromo/feedbackaward/feedbackAwardPromo.vue"));
const PrivilegeInvitePromo = defineAsyncComponent(() => import("../components/hotpromo/privilegeinvite/privilegeInvitePromo.vue"));
const EsportQuiz = defineAsyncComponent(() => import("../components/hotpromo/esportquiz/EsportQuiz.vue"));
const LotteryPromo = defineAsyncComponent(() => import("../components/hotpromo/lottery/LotteryPromo.vue"));
const DailyLoginPromo = defineAsyncComponent(() => import("../components/hotpromo/dailylogin/dailyLoginPromo.vue"));
const LoginRewardPromo = defineAsyncComponent(() => import("../components/hotpromo/loginreward/loginRewardPromo.vue"));
const FootballFightPromo = defineAsyncComponent(() => import("../components/hotpromo/footballfight/footballFightPromo.vue"));
const UpgradeHongBaoPromo = defineAsyncComponent(() => import("../components/hotpromo/upgradehongbao/upgradeHongBaoPromo.vue"));
const LplSummerPromo = defineAsyncComponent(() => import("../components/hotpromo/lplsummer/LplSummerPromo.vue"));
const BbDacha2024Promo = defineAsyncComponent(() => import("../components/hotpromo/bbdacha2024/BbDacha2024Promo.vue"));
const LhStepGamePromo = defineAsyncComponent(() => import("../components/hotpromo/lhstepgame/LhStepGamePromo.vue"));
const CS2Sign = defineAsyncComponent(() => import("../components/hotpromo/CS2Sign/CS2Sign.vue"));
const BonusSpinWheel = defineAsyncComponent(() => import("../components/hotpromo/bonusSpinWheel/BonusSpinWheel.vue"));
const SummonerPromo = defineAsyncComponent(() => import("../components/hotpromo/summoner/SummonerPromo.vue"));
const AppHongBao = defineAsyncComponent(() => import("../components/hotpromo/apphongbao/AppHongBao.vue"));
const FtdPromo = defineAsyncComponent(() => import("../components/hotpromo/ftd/FtdPromo.vue"));
const LOLMsi2024Promo = defineAsyncComponent(() => import("../components/hotpromo/LOL-msi-2024/LOLMsi2024Promo.vue"));
const EuroCup2024 = defineAsyncComponent(() => import("../components/hotpromo/europe-2024/EuroCup2024.vue"));
const EuroCup2024FirstShoot = defineAsyncComponent(() => import("./hotpromo/europe-2024-first-shoot/EuroCup2024FirstShoot.vue"));
const BlastPremierPromo = defineAsyncComponent(() => import("../components/hotpromo/BlastPremierPromo/BlastPremierPromo.vue"));
const EurocupManual = defineAsyncComponent(() => import("../components/hotpromo/EurocupManual/EurocupManual.vue"));
const SportZhongChao = defineAsyncComponent(() => import("../components/hotpromo/SportZhongChao/SportZhongChao.vue"));
const Nba24Match = defineAsyncComponent(() => import("../components/hotpromo/Nba24Match/Nba24Match.vue"));
const SlotLacky8 = defineAsyncComponent(() => import("../components/hotpromo/slot-lacky8-24/slot-lacky8-24.vue"));
const fishHongbao = defineAsyncComponent(() => import("../components/hotpromo/fishHongbao/fishHongbao.vue"));
const LPLSummer2024 = defineAsyncComponent(() => import("../components/hotpromo/lpl-summer-2024/LPLSummer2024.vue"));
const IntelEls24 = defineAsyncComponent(() => import("../components/hotpromo/intel-els-24/intel-els-24.vue"));
const DuanWuJiePromo = defineAsyncComponent(() => import("../components/hotpromo/dragonboat/DragonBoat.vue"));
const DepositRebates = defineAsyncComponent(() => import("../components/hotpromo/depositRebates/depositRebates.vue"));
const WinLossPromo = defineAsyncComponent(() => import("../components/hotpromo/winloss/WinLoss.vue"));
const AijiasuPromo = defineAsyncComponent(() => import("../components/hotpromo/aijiasu/AijiasuPromo.vue"));
const EuroRegen = defineAsyncComponent(() => import("../components/hotpromo/EuroRegen/EuroRegen.vue"));

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    SlotLacky8,
    IntelEls24,
    fishHongbao,
    ClaimPromo,
    DragonCardPromo,
    EurocupVotePromo,
    GoldenEggPromo,
    HongBaoYu2024,
    UpcomingMatchPromo,
    MeiZhouBeiPromo,
    InsuranceSubmitPromo,
    FeedbackAwardPromo,
    PrivilegeInvitePromo,
    EsportQuiz,
    LotteryPromo,
    DailyLoginPromo,
    LoginRewardPromo,
    FootballFightPromo,
    UpgradeHongBaoPromo,
    HongBaoPreEurocup,
    LplSummerPromo,
    BbDacha2024Promo,
    CS2Sign,
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
    DuanWuJiePromo,
    DepositRebates,
    WinLossPromo,
    AijiasuPromo,
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
      this.list.redirectUrl === "lh1-jiajianghongbaoyu" ||
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
      this.list.redirectUrl === "lh1-slot-lucky8" ||
      this.list.redirectUrl === "lh-fish-hongbao" ||
      this.list.redirectUrl === "lh-lpl-summer24" ||
      this.list.redirectUrl === "lh1-intel-esl" ||
      this.list.redirectUrl === "lh-sport-zhongchao" ||
      this.list.redirectUrl === "lh-duanwujie24" ||
      this.list.redirectUrl === "tiqianhongbao" ||
      this.list.redirectUrl === "lh1-deposit-rebates" ||
      this.list.redirectUrl === "lh1-eurocup-guess" ||
      this.list.redirectUrl === "lh1meizhoubei" ||
      this.list.redirectUrl === "lh1-aijiasu" ||
      this.list.redirectUrl === "lh1ouzhoubeibaopei" ||
      this.list.redirectUrl === "lh1-eurocup-regen"
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
          data[i].winners.forEach((winner) => {
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

    const router = useRouter();
    const goToCsChat = () => {
      router.push("/liveChat");
    };

    return {
      goToCsChat,
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

.cs-btn {
  color: #ffffff;
  padding: 5px 30px;
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 4.5799999237px 0px #b1d7ff inset;
  box-shadow: 0px -1px 3.6640000343px 0px #5894ff inset;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
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
