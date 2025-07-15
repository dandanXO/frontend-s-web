<template>
  <div class="hot-promo">
    <ClaimPromo
      v-if="listParam.type === 'claimpromo'"
      :promo-id="list.id"
      :promo-code="list.promoCode"
      :loading-claim="btnLoading"
      @daily-slot="handleSlot(list.promoCode)"
    />
  </div>

  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="items-center row">
        <div class="bonus-svg-div">
          <span class="bonus-text">{{ $t("common.notification.claimed") }}</span>
          <span class="claim-amt">{{ claimMsg }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat :label="$t('btn.confirm')" color="primary" v-close-popup />
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
import { useI18n } from "vue-i18n";

const ClaimPromo = defineAsyncComponent(() => import("../components/hotpromo/claimPromo.vue"));

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    ClaimPromo
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
    const { t } = useI18n();

    const isClaimModal = ref(false);
    const claimMsg = ref("");

    const handleSlot = (promoCode) => {
      if (!store.token) {
        $q.dialog({
          class: "q-px-md q-pt-md",
          title: t("common.notification.loginRequired.title"),
          message: t("common.notification.loginRequired.message"),
          ok: {
            push: true,
            color: "dyblue",
            label: t("btn.goLogin"),
            tabindex: 1
          },
          cancel: {
            push: true,
            color: "warning",
            label: t("btn.cancel"),
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
          title: t("common.notification.loginRequired.title"),
          message: t("common.notification.loginRequired.message"),
          ok: {
            push: true,
            color: "dyblue",
            label: t("btn.goLogin"),
            tabindex: 1
          },
          cancel: {
            push: true,
            color: "warning",
            label: t("btn.cancel"),
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
  font-size: 14px;
  width: fit-content;
  padding: 0px 20px 0px 10px;
  min-width: 100px;
  height: fit-content;
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

.claim-title-icon,
.claim-coin-icon,
.claim-gift-icon,
.claim-stacked-coins-icon {
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.claim-title-icon {
  background: url("../assets/images/promotion/hotpromo/lh-livepoker-rebate/section-title-img.png") no-repeat center
    center;
  background-size: 100% 100%;
}

.claim-coin-icon {
  background: url("../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon1.png") no-repeat center center;
  background-size: 100% 100%;
}

.claim-gift-icon {
  background: url("../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon2.png") no-repeat center center;
  background-size: 100% 100%;
}

.claim-stacked-coins-icon {
  background: url("../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon3.png") no-repeat center center;
  background-size: 100% 100%;
}
</style>
