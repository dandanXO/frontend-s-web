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

    <GoldenEggPromo v-if="list.redirectUrl === 'goldenegg'" />

    <HongBaoPreEurocupPromo
      :promo-code="list.promoCode"
      :pageContent="list.pageContent"
      :promo-param="list.param"
      v-if="listParam.type === 'hongbaoyu'"
    />

    <OuZuLianPromo v-if="list.redirectUrl === 'ouzulian'" />

    <InviteFriendPromo v-if="list.redirectUrl === 'invitefriend'" />
    <EsportQuiz2 v-if="list.redirectUrl === 'dy2-quiz'"></EsportQuiz2>

    <AsiaCup2024Promo
      v-if="list.redirectUrl === 'asian-cup-2024' || list.redirectUrl === 'dy-promo-application-A'"
    ></AsiaCup2024Promo>

    <SlotLacky8 v-if="list.redirectUrl === 'dy-lucky-slot'" :promo-code="list.promoCode" />

    <ChallengeComebackPromo v-if="list.redirectUrl === 'dy2-cycle-loss-refund'" :promo-code="list.promoCode" />

    <BountyBlastPremier v-if="list.redirectUrl === 'bounty-blast-premier'" :promo-code="list.promoCode" />

    <fishHongbao v-if="list.redirectUrl === 'dy-fish-hongbao'" />

    <LivepokerRebate v-if="list.redirectUrl === 'dy2-livepoker-rebate'" :promo-code="list.promoCode" />
    <div style="text-align: center" v-if="list.redirectUrl === 'fankuijianyi'">
      <img style="width: 100%; margin: 10px auto 0px" src="../assets/images/promotion/hotpromo/h5feedback.png" />
    </div>

    <SubmitClaimPromo v-if="list.redirectUrl === 'dy2-UCL'" :promo-code="list.promoCode" />

    <PglS32025 v-if="list.redirectUrl === 'dy1-2025-pgl-s3'" :promo-code="list.promoCode" />

    <PullbackTide v-if="list.redirectUrl === 'dy2-pullback-tide'" :promo-code="list.promoCode" />
    <Cba30Dream v-if="list.redirectUrl === 'dy2-cba30-dream'" :promo-code="list.promoCode" />

    <Lh1LplLck2025loss v-else-if="list.redirectUrl === 'dy2-lpl-lck-2025'" :promo-param="listParam" />
    <Blast2025S3 v-else-if="list.redirectUrl === 'dy2-blast-open-lisbon-2025'" :promo-code="list.promoCode" />

    <SkyesportsSouvenir2025 v-if="list.redirectUrl === 'dy2-skyesports-souvenir-2025'" :promo-code="list.promoCode" />

    <Monthly20HongBaoYu v-if="list.redirectUrl === 'dy2-monthly-20th-red-envelope'" :promo-code="list.promoCode" />
    <OfficialGiftPromo v-if="list.redirectUrl === 'dy-official-gift'" :params="list.param" />
    <PGLBucharest2025 v-if="list.redirectUrl === 'dy2-pgl-bucharest-2025'" :promo-code="list.promoCode" />
    <EslProLeagueS21 v-else-if="list.redirectUrl === 'dy2-esl-pro-league-s21'" :promo-param="listParam" />
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
import { defineAsyncComponent, defineComponent, ref } from "vue";
import { userStore } from "stores/index";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import moment from "moment";
import { useRouter } from "vue-router";

import Monthly20HongBaoYu from "./hotpromo/hongbaoyu2025/Monthly20HongBaoYu.vue";

const OfficialGiftPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/officialGift/OfficialGiftPromo.vue")
);
const ClaimPromo = defineAsyncComponent(() => import("../components/hotpromo/claimPromo.vue"));

const GoldenEggPromo = defineAsyncComponent(() => import("../components/hotpromo/goldenegg/goldenEggPromo.vue"));

const HongBaoPreEurocupPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/hongbaoyu/HongBaoPreEurocup.vue")
);

const InviteFriendPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/invitefriend/inviteFriendPromo.vue")
);
const EsportQuiz2 = defineAsyncComponent(() => import("../components/hotpromo/esportquiz2/EsportQuiz.vue"));
const PrivilegeInvite = defineAsyncComponent(() =>
  import("../components/hotpromo/privilegeinviteA/PrivilegeInvite.vue")
);
const AsiaCup2024Promo = defineAsyncComponent(() => import("../components/hotpromo/asiacup2024/AsiaCup2024Promo.vue"));

const ChallengeComebackPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/challenge-comeback/ChallengeComeback.vue")
);

const BountyBlastPremier = defineAsyncComponent(() =>
  import("../components/hotpromo/bounty-blast/BountyBlastPremier.vue")
);

const fishHongbao = defineAsyncComponent(() => import("../components/hotpromo/fishHongbao/fishHongbao.vue"));

const OuZuLianPromo = defineAsyncComponent(() => import("../components/hotpromo/ouzulian/OuZuLianPromo.vue"));
const SlotLacky8 = defineAsyncComponent(() => import("../components/hotpromo/slot-lacky8-24/slot-lacky8-24.vue"));
const LivepokerRebate = defineAsyncComponent(() =>
  import("../components/hotpromo/livepoker-rebate/LivepokerRebate.vue")
);
const Lh1LplLck2025loss = defineAsyncComponent(() =>
  import("../components/hotpromo/lh1-lpl-lck-2025-loss/lh1-lpl-lck-2025-loss.vue")
);

const SubmitClaimPromo = defineAsyncComponent(() => import("../components/hotpromo/submitclaim/SubmitClaimPromo.vue"));

const PglS32025 = defineAsyncComponent(() => import("../components/hotpromo/pgl-s3-2025/PglS32025.vue"));
const PullbackTide = defineAsyncComponent(() => import("./hotpromo/pullback-tide/PullbackTide.vue"));
const Cba30Dream = defineAsyncComponent(() => import("./hotpromo/cba30-dream/Cba30Dream.vue"));

const EslProLeagueS21 = defineAsyncComponent(() => import("./hotpromo/esl-pro-league-s21/EslProLeagueS21.vue"));
import SkyesportsSouvenir2025 from "./hotpromo/skyesports-souvenir-2025/SkyesportsSouvenir2025.vue";
import PGLBucharest2025 from "./hotpromo/pgl-bucharest-2025/PGLBucharest2025.vue";
const Blast2025S3 = defineAsyncComponent(() => import("./hotpromo/Blast2025-s3/Blast2025S3.vue"));

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    Blast2025S3,
    EslProLeagueS21,
    PGLBucharest2025,
    SkyesportsSouvenir2025,
    OfficialGiftPromo,
    LivepokerRebate,
    BountyBlastPremier,
    fishHongbao,
    ClaimPromo,
    GoldenEggPromo,
    InviteFriendPromo,
    EsportQuiz2,
    PrivilegeInvite,
    AsiaCup2024Promo,
    HongBaoPreEurocupPromo,
    SlotLacky8,
    OuZuLianPromo,
    SubmitClaimPromo,
    PglS32025,
    PullbackTide,
    Cba30Dream,
    ChallengeComebackPromo,
    Lh1LplLck2025loss,
    Monthly20HongBaoYu
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

.ribbon {
  clip-path: polygon(0% 0%, 100% 0%, calc(100% - 10px) 50%, 100% 100%, 0% 100%);
  background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
  padding-right: 10px;
  font-family: "PingFang";
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  width: fit-content;
  padding: 0px 20px 0px 10px;
}

.title-img {
  aspect-ratio: 960 / 80;
  background: url("../assets/images/promotion/hotpromo/common/promo-details-title-bg.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 290px 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #4c4c6c;
  font-weight: bold;
  letter-spacing: 1px;
}
</style>
