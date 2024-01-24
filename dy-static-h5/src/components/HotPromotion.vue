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
          list.redirectUrl === 'dy2-vip-upgrade-bonus' ||
          list.redirectUrl === 'dy2-refer-bonus')
      "
    />
    <TigerCardPromo v-if="!isCommonPromo && list.redirectUrl === 'dy2-tiger-card'" />
    <PrizePoolVotePromo v-if="!isCommonPromo && list.redirectUrl === 'Dongying-team-vote'" />
    <GoldenEggPromo v-if="!isCommonPromo && list.redirectUrl === 'goldenegg'" />
    <HongBaoYuPromo v-if="!isCommonPromo && list.redirectUrl === 'hongbaoyu'" :promo-code="list.promoCode" />
    <UpcomingMatchPromo v-if="!isCommonPromo && list.redirectUrl === 'nba-game'" platformType="NBA" />
    <UpcomingMatchPromo
      v-if="
        (!isCommonPromo && list.redirectUrl === 'dy2-esport-safety') ||
        (!isCommonPromo && list.redirectUrl === 'sport-safety')
      "
      :platformType="list.redirectUrl === 'dy2-esport-safety' ? 'ESPORT' : 'SPORT'"
    />

    <InsuranceSubmitPromo
      v-if="
        (!isCommonPromo && list.redirectUrl === 'dy2-esport-safety') ||
        (!isCommonPromo && list.redirectUrl === 'sport-safety')
      "
      :platformType="list.redirectUrl === 'dy2-esport-safety' ? 'ESPORT' : 'SPORT'"
    />

    <InviteFriendPromo v-if="list.redirectUrl === 'invitefriend' && !isCommonPromo" />
    <EsportQuiz v-if="list.redirectUrl === 'Dongying-quiz' && !isCommonPromo"></EsportQuiz>
    <LotteryPromo v-if="list.redirectUrl === 'dy2-lottery' && !isCommonPromo && store.token"></LotteryPromo>
    <GiftPromo v-if="list.redirectUrl === 'dy2-gift' && !isCommonPromo && store.token"></GiftPromo>

    <AsiaCup2024Promo
      v-if="
        (list.redirectUrl === 'asian-cup-2024' || list.redirectUrl === 'dy-promo-application-A') &&
        !isCommonPromo &&
        store.token
      "
    ></AsiaCup2024Promo>
    <BasketballHot v-if="list.redirectUrl === '/dy-promo-basketball' && !isCommonPromo"></BasketballHot>
    <LplSummerPromo
      v-if="
        (list.redirectUrl === 'lpl-summer' || list.redirectUrl === 'dy-promo-application-B') &&
        !isCommonPromo &&
        store.token
      "
    ></LplSummerPromo>

    <Cny2024Promo v-if="list.redirectUrl === 'dy2-cny2024-promo' && !isCommonPromo && store.token"></Cny2024Promo>
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
import TigerCardPromo from "../components/hotpromo/tigercard/tigerCardPromo.vue";
import PrizePoolVotePromo from "../components/hotpromo/prizePoolVote/prizePoolVotePromo.vue";
import GoldenEggPromo from "../components/hotpromo/goldenegg/goldenEggPromo.vue";
import HongBaoYuPromo from "../components/hotpromo/hongbaoyu/HongBaoYu.vue";
import UpcomingMatchPromo from "../components/hotpromo/upcomingmatch/upcomingMatchPromo.vue";
import InsuranceSubmitPromo from "../components/hotpromo/insurancesubmit/insuranceSubmitPromo.vue";
import InviteFriendPromo from "../components/hotpromo/invitefriend/inviteFriendPromo.vue";
import EsportQuiz from "../components/hotpromo/esportquiz/EsportQuiz.vue";
import LotteryPromo from "../components/hotpromo/lottery/LotteryPromo.vue";
import GiftPromo from "../components/hotpromo/gift/GiftPromo.vue";
import PrivilegeInvite from "../components/hotpromo/privilegeinviteA/PrivilegeInvite.vue";
import AsiaCup2024Promo from "../components/hotpromo/asiacup2024/AsiaCup2024Promo.vue";
import BasketballHot from "../components/hotpromo/basketballHot/BasketballHot.vue";
import LplSummerPromo from "../components/hotpromo/lplsummer/LplSummerPromo.vue";
import Cny2024Promo from "../components/hotpromo/cny2024/Cny2024Promo.vue";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    ClaimPromo,
    TigerCardPromo,
    PrizePoolVotePromo,
    GoldenEggPromo,
    HongBaoYuPromo,
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
    Cny2024Promo
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
      this.list.redirectUrl === "dy2-tiger-card" ||
      this.list.redirectUrl === "Dongying-team-vote" ||
      this.list.redirectUrl === "goldenegg" ||
      this.list.redirectUrl === "hongbaoyu" ||
      this.list.redirectUrl === "invitefriend" ||
      this.list.redirectUrl === "welcomenewuser" ||
      this.list.redirectUrl === "dy2-lottery" ||
      this.list.redirectUrl === "Dongying-quiz" ||
      this.list.redirectUrl === "nba-game" ||
      this.list.redirectUrl === "dy2-esport-safety" ||
      this.list.redirectUrl === "sport-safety" ||
      this.list.redirectUrl === "dy2-gift" ||
      this.list.redirectUrl === "Dongying-refer" ||
      this.list.redirectUrl === "dy2-vip-upgrade-bonus" ||
      this.list.redirectUrl === "dy2-refer-bonus" ||
      this.list.redirectUrl === "asian-cup-2024" ||
      this.list.redirectUrl === "/dy-promo-basketball" ||
      this.list.redirectUrl === "lpl-summer" ||
      this.list.redirectUrl === "dy-promo-application-A" ||
      this.list.redirectUrl === "dy-promo-application-B" ||
      this.list.redirectUrl === "dy2-cny2024-promo"
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
