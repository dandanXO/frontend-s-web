<template>
  <div class="hot-promo">
    <ClaimPromo
      v-if="listParam.type === 'claimpromo'"
      :promo-id="list.id"
      :promo-code="list.promoCode"
      :loading-claim="btnLoading"
      @daily-slot="handleSlot(list.promoCode)"
    />
    <PrivilegeInvite
      v-if="
        list.redirectUrl === 'Dongying-refer' ||
        list.redirectUrl === 'dy2-vip-upgrade-bonus' ||
        list.redirectUrl === 'dy2-refer-bonus'
      "
    />
    <TigerCardPromo v-if="list.redirectUrl === 'dy2-tiger-card'" />
    <PrizePoolVotePromo v-if="list.redirectUrl === 'Dongying-team-vote'" />
    <GoldenEggPromo v-if="list.redirectUrl === 'goldenegg'" />
    <HongBaoYu2024 v-if="list.redirectUrl === 'hongbaoyu'" :promo-code="list.promoCode" />
    <HongBaoYuEurocupPromo
      :promo-code="list.promoCode"
      :pageContent="list.pageContent"
      :promo-param="list.param"
      v-if="list.redirectUrl === 'dy2-eurocup-hongbao'"
    />
    <HongBaoPreEurocupPromo
      :promo-code="list.promoCode"
      :pageContent="list.pageContent"
      :promo-param="list.param"
      v-if="listParam.type === 'hongbaoyu'"
    />
    <NewplayerGuide v-if="list.redirectUrl === 'dy2-newplayer-guide'" />
    <UpcomingMatchPromo v-if="list.redirectUrl === 'nba-game'" platformType="NBA" />
    <UpcomingMatchPromo
      v-if="list.redirectUrl === 'dy2-esport-safety' || list.redirectUrl === 'sport-safety'"
      :platformType="list.redirectUrl === 'dy2-esport-safety' ? 'ESPORT' : 'SPORT'"
    />

    <MeiZhouBeiPromoPage v-if="list.redirectUrl === 'dy2meizhoubei'" platformType="COPA" />
    <OuZuLianPromo v-if="list.redirectUrl === 'ouzulian'" />
    <InsuranceSubmitPromo
      v-if="list.redirectUrl === 'dy2-esport-safety' || list.redirectUrl === 'sport-safety'"
      :platformType="list.redirectUrl === 'dy2-esport-safety' ? 'ESPORT' : 'SPORT'"
    />

    <InviteFriendPromo v-if="list.redirectUrl === 'invitefriend'" />
    <EsportQuiz v-if="list.redirectUrl === 'Dongying-quiz'"></EsportQuiz>
    <LotteryPromo v-if="list.redirectUrl === 'dy2-lottery'"></LotteryPromo>
    <GiftPromo v-if="list.redirectUrl === 'dy2-gift'"></GiftPromo>

    <AsiaCup2024Promo
      v-if="list.redirectUrl === 'asian-cup-2024' || list.redirectUrl === 'dy-promo-application-A'"
    ></AsiaCup2024Promo>
    <BasketballHot v-if="list.redirectUrl === '/dy-promo-basketball'"></BasketballHot>
    <LplSummerPromo
      v-if="list.redirectUrl === 'lpl-summer' || list.redirectUrl === 'dy-promo-application-B'"
    ></LplSummerPromo>
    <IntelEsl24 v-if="list.redirectUrl === 'dy2-intel-esl'" />

    <div style="text-align: center" v-if="list.redirectUrl === 'dy-ouzhoumianpei'">
      <div class="cs-btn" @click="goToCsChat()">联系客服</div>
    </div>

    <Cny2024Promo v-if="list.redirectUrl === 'dy2-cny2024-promo'"></Cny2024Promo>
    <BbDacha2024Promo v-if="list.redirectUrl === 'dy2-asian-zone'"></BbDacha2024Promo>
    <CnyStepGame2024Promo v-if="list.redirectUrl === 'dy2-cny-step-game'"></CnyStepGame2024Promo>
    <Dy2StepGamePromo v-if="list.redirectUrl === 'dy2-game-steps'" :pageContent="list.pageContent"></Dy2StepGamePromo>
    <CS2Sign v-if="list.redirectUrl === 'dy2-cs2-copenhagen-major-2024'" :promo-code="list.promoCode" />
    <SlotLacky8 v-if="list.redirectUrl === 'dy-lucky-slot'" :promo-code="list.promoCode" />
    <BonusSpinWheel v-if="list.redirectUrl === 'dy2-spin-wheel'" />
    <LOLMsi2024Promo v-if="list.redirectUrl === 'dy2-msi-promo'" />
    <Nba24Match v-if="list.redirectUrl === 'dy2-nba24-match'" />
    <Olympic24Match v-if="list.redirectUrl === 'dy2-olympic-match'" />
    <LPLSummer24 v-if="list.redirectUrl === 'dy2-lpl-summer24'" />
    <DragonBoat v-if="list.redirectUrl === 'dy-duanwujie24'" />
    <EurocupManual v-if="list.redirectUrl === 'dy2-eurocup-manual'" />

    <BlastPremierPromo v-if="list.redirectUrl === 'dy2-cs2-blast-2024'" :promo-code="list.promoCode" />
    <SportZhongChao v-if="list.redirectUrl === 'dy-sport-zhongchao'" />
    <fishHongbao v-if="list.redirectUrl === 'dy-fish-hongbao'" />
    <OlympicFund v-if="list.redirectUrl === 'dy2-olympic-fund'" />
    <LPLLCK v-if="list.redirectUrl === 'dy2-lpl-lck'" />
    <div style="text-align: center" v-if="list.redirectUrl === 'fankuijianyi'">
      <img style="width: 100%; margin: 10px auto 0px" src="../assets/images/promotion/hotpromo/h5feedback.png" />
    </div>
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
import { defineAsyncComponent, defineComponent, ref } from "vue";
import { userStore } from "stores/index";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import moment from "moment";
import { useRouter } from "vue-router";

const ClaimPromo = defineAsyncComponent(() => import("../components/hotpromo/claimPromo.vue"));
const TigerCardPromo = defineAsyncComponent(() => import("../components/hotpromo/tigercard/tigerCardPromo.vue"));
const PrizePoolVotePromo = defineAsyncComponent(() =>
  import("../components/hotpromo/prizePoolVote/prizePoolVotePromo.vue")
);
const GoldenEggPromo = defineAsyncComponent(() => import("../components/hotpromo/goldenegg/goldenEggPromo.vue"));
const HongBaoPreEurocupPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/hongbaoyu/HongBaoPreEurocup.vue")
);
const HongBaoYu2024 = defineAsyncComponent(() => import("../components/hotpromo/hongbaoyu2024/HongBaoYu2024.vue"));
const HongBaoYuEurocupPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/hongbaoyu/HongBaoYuEurocup.vue")
);
const UpcomingMatchPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/upcomingmatch/upcomingMatchPromo.vue")
);
const InsuranceSubmitPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/insurancesubmit/insuranceSubmitPromo.vue")
);
const InviteFriendPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/invitefriend/inviteFriendPromo.vue")
);
const EsportQuiz = defineAsyncComponent(() => import("../components/hotpromo/esportquiz/EsportQuiz.vue"));
const LotteryPromo = defineAsyncComponent(() => import("../components/hotpromo/lottery/LotteryPromo.vue"));
const GiftPromo = defineAsyncComponent(() => import("../components/hotpromo/gift/GiftPromo.vue"));
const PrivilegeInvite = defineAsyncComponent(() =>
  import("../components/hotpromo/privilegeinviteA/PrivilegeInvite.vue")
);
const NewplayerGuide = defineAsyncComponent(() => import("../components/hotpromo/newplayerguide/NewPlayerGuide.vue"));
const AsiaCup2024Promo = defineAsyncComponent(() => import("../components/hotpromo/asiacup2024/AsiaCup2024Promo.vue"));
const BasketballHot = defineAsyncComponent(() => import("../components/hotpromo/basketballHot/BasketballHot.vue"));
const LplSummerPromo = defineAsyncComponent(() => import("../components/hotpromo/lplsummer/LplSummerPromo.vue"));
const Cny2024Promo = defineAsyncComponent(() => import("../components/hotpromo/cny2024/Cny2024Promo.vue"));
const BbDacha2024Promo = defineAsyncComponent(() => import("../components/hotpromo/bbdacha2024/BbDacha2024Promo.vue"));
const CnyStepGame2024Promo = defineAsyncComponent(() =>
  import("../components/hotpromo/cnystepgame2024/CnyStepGame2024Promo.vue")
);
const Dy2StepGamePromo = defineAsyncComponent(() => import("../components/hotpromo/dy2stepgame/Dy2StepGamePromo.vue"));
const CS2Sign = defineAsyncComponent(() => import("../components/hotpromo/CS2Sign/CS2Sign.vue"));
const BonusSpinWheel = defineAsyncComponent(() => import("../components/hotpromo/bonusSpinWheel/BonusSpinWheel.vue"));
const LOLMsi2024Promo = defineAsyncComponent(() => import("../components/hotpromo/LOL-msi-2024/LOLMsi2024Promo.vue"));
const Nba24Match = defineAsyncComponent(() => import("../components/hotpromo/Nba24Match/Nba24Match.vue"));
const LPLSummer24 = defineAsyncComponent(() => import("../components/hotpromo/lpl-summer-2024/LPLSummer2024.vue"));
const DragonBoat = defineAsyncComponent(() => import("../components/hotpromo/dragonboat/DragonBoat.vue"));
const EurocupManual = defineAsyncComponent(() => import("./hotpromo/EurocupManual/EurocupManual.vue"));
const SportZhongChao = defineAsyncComponent(() => import("../components/hotpromo/SportZhongChao/SportZhongChao.vue"));
const BlastPremierPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/BlastPremierPromo/BlastPremierPromo.vue")
);
const fishHongbao = defineAsyncComponent(() => import("../components/hotpromo/fishHongbao/fishHongbao.vue"));
const MeiZhouBeiPromoPage = defineAsyncComponent(() =>
  import("../components/hotpromo/meizhoubei/MeiZhouBeiPromoPage.vue")
);
const OlympicFund = defineAsyncComponent(() => import("../components/hotpromo/Olympic-fund/OlympicFund.vue"));
const Olympic24Match = defineAsyncComponent(() => import("../components/hotpromo/Olympic24Match/Olympic24Match.vue"));
const OuZuLianPromo = defineAsyncComponent(() => import("../components/hotpromo/ouzulian/OuZuLianPromo.vue"));
const SlotLacky8 = defineAsyncComponent(() => import("../components/hotpromo/slot-lacky8-24/slot-lacky8-24.vue"));

const IntelEsl24 = defineAsyncComponent(() => import("../components/hotpromo/intel-esl-24/intel-esl-24.vue"));
const LPLLCK = defineAsyncComponent(() => import("../components/hotpromo/lpllck/LPLLCK.vue"));
export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    SportZhongChao,
    BlastPremierPromo,
    fishHongbao,
    OlympicFund,
    Olympic24Match,
    Nba24Match,
    ClaimPromo,
    TigerCardPromo,
    MeiZhouBeiPromoPage,
    PrizePoolVotePromo,
    GoldenEggPromo,
    HongBaoYu2024,
    UpcomingMatchPromo,
    InsuranceSubmitPromo,
    InviteFriendPromo,
    EsportQuiz,
    LotteryPromo,
    GiftPromo,
    PrivilegeInvite,
    AsiaCup2024Promo,
    BasketballHot,
    LplSummerPromo,
    Cny2024Promo,
    BbDacha2024Promo,
    CnyStepGame2024Promo,
    Dy2StepGamePromo,
    CS2Sign,
    BonusSpinWheel,
    LOLMsi2024Promo,
    HongBaoYuEurocupPromo,
    HongBaoPreEurocupPromo,
    LPLSummer24,
    SlotLacky8,
    DragonBoat,
    EurocupManual,
    OuZuLianPromo,
    IntelEsl24,
    NewplayerGuide,
    LPLLCK
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

    const isClaimModal = ref(false);
    const claimMsg = ref("");

    const handleSlot = (promoCode) => {
      if (!store.token) {
        $q.dialog({
          class: "q-px-md q-pt-md",
          title: "系统提示",
          message: "请登录后再操作",
          ok: {
            push: true,
            color: "dyblue",
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
    const loading = ref(false);
    const btnLoading = ref(false);

    const formState = ref({
      dateTime: "",
      onlyMe: false,
      resultTime: ""
    });

    const router = useRouter();
    const goToCsChat = () => {
      if (!store.token) {
        $q.dialog({
          class: "q-px-md q-pt-md",
          title: "系统提示",
          message: "请登录后再操作",
          ok: {
            push: true,
            color: "dyblue",
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

    return {
      store,
      filterWinnerLists,
      formState,
      winnerDataSource,
      loading,
      btnLoading,
      isClaimModal,
      claimMsg,
      goToCsChat,
      handleSlot
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
