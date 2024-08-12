<template>
  <div class="hot-promo">
    <ClaimPromo
      v-if="listParam.type === 'claimpromo'"
      :promo-id="list.id"
      :promo-code="list.promoCode"
      :loading-claim="btnLoading"
      @daily-slot="handleSlot(list.promoCode)"
    />
    <DragonCardPromo v-if="list.redirectUrl === 'lh1-dragon-card'" />
    <EurocupVotePromo v-if="list.redirectUrl === 'lh1-team-vote'" />
    <GoldenEggPromo v-if="list.redirectUrl === 'goldenegg'" />
    <HongBaoPreEurocup v-if="listParam.type === 'hongbaoyu'" :promo-code="list.promoCode" />
    <UpcomingMatchPromo v-if="list.redirectUrl === 'lh1-nba-safety'" platformType="NBA" />

    <UpcomingMatchPromo
      v-if="list.redirectUrl === 'lh1-esport-safety' || list.redirectUrl === 'lh1-sport-safety'"
      :platformType="list.redirectUrl === 'lh1-esport-safety' ? 'ESPORT' : 'SPORT'"
    />
    <MeiZhouBeiPromo v-if="list.redirectUrl === 'lh1meizhoubei'" platformType="COPA" />
    <OuZuLianPromo v-if="list.redirectUrl === 'ouzulian'" />

    <InsuranceSubmitPromo
      v-if="list.redirectUrl === 'lh1-esport-safety' || list.redirectUrl === 'lh1-sport-safety'"
      :platformType="list.redirectUrl === 'lh1-esport-safety' ? 'ESPORT' : 'SPORT'"
    />

    <FeedbackAwardPromo v-if="list.redirectUrl === 'lh1-feedback-award'" />
    <div style="text-align: center" v-if="list.redirectUrl === 'lh1ouzhoubeibaopei'">
      <div class="cs-btn" @click="goToCsChat()">联系客服</div>
    </div>

    <AppHongBao v-if="list.redirectUrl === 'lh1-app-hongbao'" :promo-code="list.promoCode" :params="list.param" />
    <FtdPromo v-if="list.redirectUrl === 'lh1-ftd-promo'" />

    <PrivilegeInvitePromo
      v-if="
        list.redirectUrl === 'lh1-invite' || list.redirectUrl === 'lh1-invite-2' || list.redirectUrl === 'lh1-invite-3'
      "
    />

    <LotteryPromo v-if="list.redirectUrl === 'lh1-lottery'" />

    <EsportQuiz v-if="list.redirectUrl === 'lh1-quiz'" />

    <DailyLoginPromo v-if="list.redirectUrl === 'lh1-monthly-sign'" />

    <LoginRewardPromo v-if="list.redirectUrl === 'lh1-login-reward'" />

    <FootballFightPromo v-if="list.redirectUrl === 'lh1-football-fight'" />

    <UpgradeHongBaoPromo
      v-if="list.redirectUrl === 'lh1-upgrade-hongbao'"
      :promo-code="list.promoCode"
      :params="list.param"
    />

    <LplSummerPromo v-if="list.redirectUrl === 'lh1-lpl-game'"></LplSummerPromo>

    <BbDacha2024Promo v-if="list.redirectUrl === 'lh1-asian-zone'"></BbDacha2024Promo>
    <LhStepGamePromo v-if="list.redirectUrl === 'lh1-game-steps'" :pageContent="list.pageContent"></LhStepGamePromo>
    <CS2Sign v-if="list.redirectUrl === 'lh-cs2-copenhagen-major-2024'" :promo-code="list.promoCode" />
    <BonusSpinWheel v-if="list.redirectUrl === 'lh1-spin-wheel'" />
    <SummonerPromo v-if="list.redirectUrl === 'lh1-summon-event'" :promo-code="list.promoCode" />
    <LOLMsi2024Promo v-if="list.redirectUrl === 'lh-msi-match'" />
    <EuroCup2024 v-if="list.redirectUrl === 'lh1-eurocup-2024'" :promo-code="list.promoCode" />
    <EuroCup2024FirstShoot v-if="list.redirectUrl === 'lh1-eurocup-firstshoot'" />
    <Shoutouxinxiu v-if="list.redirectUrl === 'lh1-shoutouxinxiu'" />
    <BlastPremierPromo v-if="list.redirectUrl === 'lh-cs2-blast-2024'" :promo-code="list.promoCode" />
    <EurocupManual v-if="list.redirectUrl === 'lh-eurocup-manual'" />
    <SportZhongChao v-if="list.redirectUrl === 'lh-sport-zhongchao'" />
    <Nba24Match v-if="list.redirectUrl === 'lh-nba24-match'" />
    <Olympic24Match v-if="list.redirectUrl === 'lh1-olympic-match'" />
    <SlotLacky8 v-if="list.redirectUrl === 'lh1-slot-lucky8'" :promo-code="list.promoCode" />
    <fishHongbao v-if="list.redirectUrl === 'lh-fish-hongbao'" />
    <LPLSummer2024 v-if="list.redirectUrl === 'lh-lpl-summer24'" />
    <IntelEls24 v-if="list.redirectUrl === 'lh1-intel-esl'" />
    <DuanWuJiePromo v-if="list.redirectUrl === 'lh-duanwujie24'" />
    <DepositRebates v-if="list.redirectUrl === 'lh1-deposit-rebates'" />
    <DepositRebate2 v-if="list.redirectUrl === 'lh1-deposit-rebate2'" />
    <WinLossPromo v-if="list.redirectUrl === 'lh1-eurocup-guess'" />
    <AijiasuPromo v-if="list.redirectUrl === 'lh1-aijiasu'" />
    <EuroRegen v-if="list.redirectUrl === 'lh1-eurocup-regen'" />
    <newplayerGuide v-if="list.redirectUrl === 'lh1-newplayer-guide'" />
    <OlympicCheckin v-if="list.redirectUrl === 'lh1-olympic-checkin'" />
    <ChallengeComebackPromo v-if="list.redirectUrl === 'lh1-challenge-comeback'" />
    <OfficialGiftPromo v-if="list.redirectUrl === 'lh-official-gift'" :params="list.param" />
    <OlympicFund v-if="list.redirectUrl === 'lh1-olympic-fund'" />
    <DailyCheckin v-if="list.redirectUrl === 'lh1-daily-checkin'" :promo-info="list" />
    <LPLLCK v-if="list.redirectUrl === 'lh1-lpl-lck'" />
    <LivepokerRebate v-if="list.redirectUrl === 'lh1-livepoker-rebate'" />
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

const Olympic24Match = defineAsyncComponent(() => import("../components/hotpromo/Olympic24Match/Olympic24Match.vue"));
const ClaimPromo = defineAsyncComponent(() => import("../components/hotpromo/claimPromo.vue"));
const DragonCardPromo = defineAsyncComponent(() => import("../components/hotpromo/dragoncard/dragonCardPromo.vue"));
const EurocupVotePromo = defineAsyncComponent(() =>
  import("../components/hotpromo/eurocup-2024-vote/eurocupVotePromo.vue")
);
const GoldenEggPromo = defineAsyncComponent(() => import("../components/hotpromo/goldenegg/goldenEggPromo.vue"));
const HongBaoPreEurocup = defineAsyncComponent(() => import("../components/hotpromo/hongbaoyu/HongBaoPreEurocup.vue"));
const HongBaoYu2024 = defineAsyncComponent(() => import("../components/hotpromo/hongbaoyu2024/HongBaoYu2024.vue"));
const UpcomingMatchPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/upcomingmatch/upcomingMatchPromo.vue")
);
const MeiZhouBeiPromo = defineAsyncComponent(() => import("../components/hotpromo/meizhoubei/MeiZhouBeiPromo.vue"));
const InsuranceSubmitPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/insurancesubmit/insuranceSubmitPromo.vue")
);
const FeedbackAwardPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/feedbackaward/feedbackAwardPromo.vue")
);
const PrivilegeInvitePromo = defineAsyncComponent(() =>
  import("../components/hotpromo/privilegeinvite/privilegeInvitePromo.vue")
);
const EsportQuiz = defineAsyncComponent(() => import("../components/hotpromo/esportquiz/EsportQuiz.vue"));
const LotteryPromo = defineAsyncComponent(() => import("../components/hotpromo/lottery/LotteryPromo.vue"));
const DailyLoginPromo = defineAsyncComponent(() => import("../components/hotpromo/dailylogin/dailyLoginPromo.vue"));
const LoginRewardPromo = defineAsyncComponent(() => import("../components/hotpromo/loginreward/loginRewardPromo.vue"));
const FootballFightPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/footballfight/footballFightPromo.vue")
);
const UpgradeHongBaoPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/upgradehongbao/upgradeHongBaoPromo.vue")
);
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
const EuroCup2024FirstShoot = defineAsyncComponent(() =>
  import("./hotpromo/europe-2024-first-shoot/EuroCup2024FirstShoot.vue")
);
const Shoutouxinxiu = defineAsyncComponent(() => import("./hotpromo/shoutouxinxiu/shoutouxinxiuA.vue"));
const BlastPremierPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/BlastPremierPromo/BlastPremierPromo.vue")
);
const EurocupManual = defineAsyncComponent(() => import("../components/hotpromo/EurocupManual/EurocupManual.vue"));
const SportZhongChao = defineAsyncComponent(() => import("../components/hotpromo/SportZhongChao/SportZhongChao.vue"));
const Nba24Match = defineAsyncComponent(() => import("../components/hotpromo/Nba24Match/Nba24Match.vue"));
const SlotLacky8 = defineAsyncComponent(() => import("../components/hotpromo/slot-lacky8-24/slot-lacky8-24.vue"));
const fishHongbao = defineAsyncComponent(() => import("../components/hotpromo/fishHongbao/fishHongbao.vue"));
const LPLSummer2024 = defineAsyncComponent(() => import("../components/hotpromo/lpl-summer-2024/LPLSummer2024.vue"));
const IntelEls24 = defineAsyncComponent(() => import("../components/hotpromo/intel-els-24/intel-els-24.vue"));
const DuanWuJiePromo = defineAsyncComponent(() => import("../components/hotpromo/dragonboat/DragonBoat.vue"));
const DepositRebates = defineAsyncComponent(() => import("../components/hotpromo/depositRebates/depositRebates.vue"));
const DepositRebate2 = defineAsyncComponent(() => import("../components/hotpromo/depositRebate2/depositRebate2.vue"));
const WinLossPromo = defineAsyncComponent(() => import("../components/hotpromo/winloss/WinLoss.vue"));
const AijiasuPromo = defineAsyncComponent(() => import("../components/hotpromo/aijiasu/AijiasuPromo.vue"));
const EuroRegen = defineAsyncComponent(() => import("../components/hotpromo/EuroRegen/EuroRegen.vue"));
const newplayerGuide = defineAsyncComponent(() => import("../components/hotpromo/newplayerGuide/newplayerGuide.vue"));
const OuZuLianPromo = defineAsyncComponent(() => import("../components/hotpromo/ouzulian/OuZuLianPromo.vue"));
const OlympicCheckin = defineAsyncComponent(() => import("../components/hotpromo/olympic-checkin/OlympicCheckin.vue"));
const ChallengeComebackPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/challengeComeback/ChallengeComeback.vue")
);
const OfficialGiftPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/officialGift/OfficialGiftPromo.vue")
);
const OlympicFund = defineAsyncComponent(() => import("../components/hotpromo/Olympic-fund/OlympicFund.vue"));
const DailyCheckin = defineAsyncComponent(() => import("../components/hotpromo/DailyCheckin/DailyCheckin.vue"));
const LPLLCK = defineAsyncComponent(() => import("../components/hotpromo/lpl-lck/LPLLCK.vue"));
const LivepokerRebate = defineAsyncComponent(() => import("../components/hotpromo/livepoker-rebate/LivepokerRebate.vue"));

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    DailyCheckin,
    Olympic24Match,
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
    Shoutouxinxiu,
    BlastPremierPromo,
    EurocupManual,
    SportZhongChao,
    Nba24Match,
    LPLSummer2024,
    DuanWuJiePromo,
    DepositRebates,
    DepositRebate2,
    WinLossPromo,
    AijiasuPromo,
    EuroRegen,
    newplayerGuide,
    OuZuLianPromo,
    OlympicCheckin,
    ChallengeComebackPromo,
    OfficialGiftPromo,
    OlympicFund,
    LPLLCK,
    LivepokerRebate
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
      activeKey: "1",
      hotPromoList: [],
      selectedHotPromo: {
        id: "",
        bg: "",
        contents: ""
      }
    };
  },
  computed: {
    listParam() {
      try {
        return JSON.parse(this.list.param);
      } catch (e) {
        console.log(e);
        return {};
      }
    }
  },
  methods: {},
  mounted() {
    this.hotPromoList.forEach((element) => {
      if (this.list.id === element.id) {
        this.selectedHotPromo = element;
      }
    });
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
    const handleSlot = (promoCode) => {
      if (!store.token) {
        $q.dialog({
          class: "q-px-md q-pt-md",
          title: "系统提示",
          message: "请登录后再操作",
          ok: {
            push: true,
            color: "primary",
            label: "去登录",
            tabindex: 1
          },
          cancel: {
            push: true,
            color: "warning",
            label: "取消",
            tabindex: 0
          },
          persistent: true
        }).onOk(() => {
          router.push("/login");
        });
        return;
      }
      const bonusItem = promoCode;
      const eventUrl = "/bonus/claim/" + bonusItem;
      btnLoading.value = true;
      eventapi
        .put(eventUrl)
        .then((res) => {
          btnLoading.value = false;
          if (res.code === 0) {
            var rebatePoint = res.data;
            claimMsg.value = "￥" + rebatePoint;
            isClaimModal.value = true;
          } else {
            btnLoading.value = false;
          }
        })
        .catch((error) => {
          btnLoading.value = false;
        });
    };
    const goToCsChat = () => {
      if (!store.token) {
        $q.dialog({
          class: "q-px-md q-pt-md",
          title: "系统提示",
          message: "请登录后再操作",
          ok: {
            push: true,
            color: "primary",
            label: "去登录",
            tabindex: 1
          },
          cancel: {
            push: true,
            color: "warning",
            label: "取消",
            tabindex: 0
          },
          persistent: true
        }).onOk(() => {
          router.push("/login");
        });
        return;
      }
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
      claimMsg,
      handleSlot
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
