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
    <OuZuLianPromo v-if="list.redirectUrl === 'ouzulian'" />

    <SubmitClaimPromo v-if="list.redirectUrl === 'LH1-UCL'" :promo-code="list.promoCode" />

    <FeedbackAwardPromo v-if="list.redirectUrl === 'lh1-feedback-award'" />

    <AppHongBao v-if="list.redirectUrl === 'lh1-app-hongbao'" :promo-code="list.promoCode" :params="list.param" />

    <PrivilegeInvitePromo
      v-if="
        list.redirectUrl === 'lh1-invite' || list.redirectUrl === 'lh1-invite-2' || list.redirectUrl === 'lh1-invite-3'
      "
    />

    <EsportQuiz v-if="list.redirectUrl === 'lh1-quiz'" />
    <SummonerPromo v-if="list.redirectUrl === 'lh1-summon-event'" :promo-code="list.promoCode" />
    <SlotLacky8 v-if="list.redirectUrl === 'lh1-slot-lucky8'" :promo-code="list.promoCode" />
    <fishHongbao v-if="list.redirectUrl === 'lh-fish-hongbao'" />
    <DepositRebate2 v-if="list.redirectUrl === 'lh1-deposit-rebate2'" />
    <AijiasuPromo v-if="list.redirectUrl === 'lh1-aijiasu'" />
    <newplayerGuide v-if="list.redirectUrl === 'lh1-newplayer-guide'" />
    <ChallengeComebackPromo v-if="list.redirectUrl === 'lh1-cycle-loss-refund'" :promo-code="list.promoCode" />
    <OfficialGiftPromo v-if="list.redirectUrl === 'lh-official-gift'" :params="list.param" />
    <DailyCheckin v-if="list.redirectUrl === 'lh1-daily-checkin'" :promo-info="list" />
    
    <NewFootball v-if="list.redirectUrl === 'lh1-football'" :promo-code="list.promoCode" />
    <EslOneBkk2024 v-if="list.redirectUrl === 'lh1-esl-one-bangkok-2024'" :promo-code="list.promoCode" />
    
    <Cba30Dream v-if="list.redirectUrl === 'lh1-cba30-dream'" :promo-code="list.promoCode" />
    <PerfectWorldMajor2024 v-if="list.redirectUrl === 'lh1-perfect-world-major-2024'" :promo-param="listParam" />
    <LiveDailyRebates v-if="list.redirectUrl === 'lh1-live-daily-rebates'" :promo-code="list.promoCode" />
    <NewVipRebate v-if="list.redirectUrl === 'lh1-newvip-rebate'" :promo-code="list.promoCode" />
    
    <LoLS14 v-if="list.redirectUrl === 'lh1-lol-s14'" :promo-code="list.promoCode" />
    <DailiPromo v-if="list.redirectUrl === 'lh1-all-daili'" :params="list.param" />
    <lh1Vip v-if="list.redirectUrl === 'lh1-vip'" />
    <SlotLossBonusPromo v-if="list.redirectUrl === 'lh1-weekly-slot-loss-bonus'" />
  </div>

  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="items-center row">
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
import EslOneBkk2024 from "./hotpromo/eslone-bkk-2024/EslOneBkk2024.vue";

const ClaimPromo = defineAsyncComponent(() => import("../components/hotpromo/claimPromo.vue"));
const DragonCardPromo = defineAsyncComponent(() => import("../components/hotpromo/dragoncard/dragonCardPromo.vue"));
const FeedbackAwardPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/feedbackaward/feedbackAwardPromo.vue")
);
const PrivilegeInvitePromo = defineAsyncComponent(() =>
  import("../components/hotpromo/privilegeinvite/privilegeInvitePromo.vue")
);
const EsportQuiz = defineAsyncComponent(() => import("../components/hotpromo/esportquiz/EsportQuiz.vue"));
const SummonerPromo = defineAsyncComponent(() => import("../components/hotpromo/summoner/SummonerPromo.vue"));
const AppHongBao = defineAsyncComponent(() => import("../components/hotpromo/apphongbao/AppHongBao.vue"));
const SlotLacky8 = defineAsyncComponent(() => import("../components/hotpromo/slot-lacky8-24/slot-lacky8-24.vue"));
const fishHongbao = defineAsyncComponent(() => import("../components/hotpromo/fishHongbao/fishHongbao.vue"));
const DepositRebate2 = defineAsyncComponent(() => import("../components/hotpromo/depositRebate2/depositRebate2.vue"));
const AijiasuPromo = defineAsyncComponent(() => import("../components/hotpromo/aijiasu/AijiasuPromo.vue"));
const newplayerGuide = defineAsyncComponent(() => import("../components/hotpromo/newplayerGuide/newplayerGuide.vue"));
const OuZuLianPromo = defineAsyncComponent(() => import("../components/hotpromo/ouzulian/OuZuLianPromo.vue"));
const ChallengeComebackPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/challengeComeback/ChallengeComeback.vue")
);
const OfficialGiftPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/officialGift/OfficialGiftPromo.vue")
);
const DailyCheckin = defineAsyncComponent(() => import("../components/hotpromo/DailyCheckin/DailyCheckin.vue"));
const NewFootball = defineAsyncComponent(() => import("../components/hotpromo/NewFootball/NewFootball.vue"));
const Cba30Dream = defineAsyncComponent(() => import("./hotpromo/cba30-dream/Cba30Dream.vue"));
const PerfectWorldMajor2024 = defineAsyncComponent(() => import("./hotpromo/perfect-world-major-2024/PerfectWorldMajor2024.vue"));
const LiveDailyRebates = defineAsyncComponent(() => import("./hotpromo/live-daily-rebates/LiveDailyRebates.vue"));
const NewVipRebate = defineAsyncComponent(() => import("../components/hotpromo/newVipRebate/newVipRebate.vue"));
const LoLS14 = defineAsyncComponent(() => import("../components/hotpromo/lol-s14/LoLS14.vue"));
const SubmitClaimPromo = defineAsyncComponent(() => import("../components/hotpromo/submitclaim/SubmitClaimPromo.vue"));
const DailiPromo = defineAsyncComponent(() => import("../components/hotpromo/daili/DailiPromo.vue"));
const lh1Vip = defineAsyncComponent(() => import("./hotpromo/lh1-vip/lh1Vip.vue"));
const SlotLossBonusPromo = defineAsyncComponent(() => import("./hotpromo/slot-loss-bonus/SlotLossBonusPromo.vue"));

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    NewFootball,
    DailyCheckin,
    SlotLacky8,
    fishHongbao,
    ClaimPromo,
    DragonCardPromo,
    FeedbackAwardPromo,
    PrivilegeInvitePromo,
    EsportQuiz,
    SummonerPromo,
    AppHongBao,
    DepositRebate2,
    AijiasuPromo,
    newplayerGuide,
    OuZuLianPromo,
    ChallengeComebackPromo,
    OfficialGiftPromo,
    EslOneBkk2024,
    Cba30Dream,
    PerfectWorldMajor2024,
    LiveDailyRebates,
    NewVipRebate,
    LoLS14,
    SubmitClaimPromo,
    DailiPromo,
    lh1Vip,
    SlotLossBonusPromo
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
