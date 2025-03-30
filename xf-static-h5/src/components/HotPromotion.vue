<template>
  <div :class="list.redirectUrl === 'cny-spinwheel' ||  list.redirectUrl === 'xf1-ag-yuanxiaohongbao' || list.redirectUrl === 'xf1-lantern-festival-bonus' ? '' : 'hot-promo'">
    <ClaimPromo
      v-if="listParam.type === 'claimpromo' && store.hasToken()"
      :promo-id="list.id"
      :loading-claim="btnLoading"
      @daily-slot="handleSlot()"
    />
    <TigerCardPromo v-if="list.redirectUrl === 'tigercard'" />
    <GoldenEggPromo v-if="list.redirectUrl === 'goldenegg'" />
    <HongBaoYuPromo v-if="list.redirectUrl === 'hongbaoyu'" />
    <WelcomeTaskPromo v-if="list.redirectUrl === 'welcomenewuser'" />
    <PrivilegeInvite v-if="store.token && list.redirectUrl === 'invitefriend'" />
    <HongBaoYu2025 v-if="list.redirectUrl === 'xf1-cny2025-red-envelope'" :promo-code="list.promoCode" />
    <OfficialGiftPromo v-if="list.redirectUrl === 'xf-official-gift'" :params="list.param" />
    <SlotLacky8 v-if="list.redirectUrl === 'xf-lucky-slot' && store.token" :promo-code="list.promoCode" />
    <BonusSpinWheelPromo v-if="list.redirectUrl === 'cny-spinwheel'" />
    <ReturnPromo v-if="list.redirectUrl === 'xf-return-promo'" />
    <DepositAwardPromo v-if="list.redirectUrl === 'xf-deposit-award'" />
    <AgYuanxiaohongbao v-if="list.redirectUrl === 'xf1-ag-yuanxiaohongbao'" :promo-code="list.promoCode" />
    <HongBaoYu2024Promo :promo-code="list.promoCode" v-if="list.redirectUrl === 'cny-hongbaoyu'" />
    <HongBaoYuEurocupPromo
      :promo-code="list.promoCode"
      :pageContent="list.pageContent"
      :promo-param="list.param"
      v-if="list.redirectUrl === 'xf-eurocup-hongbao'"
    />

    <LanternFestival2025
      v-if="list.redirectUrl === 'xf1-lantern-festival-bonus'"
      :promo-param="listParam"
      :promo-code="list.promoCode"
    />
    <HongBaoPreEurocupPromo
      :promo-code="list.promoCode"
      :pageContent="list.pageContent"
      :promo-param="list.param"
      v-if="listParam.type === 'hongbaoyu'"
    />

    <SlotsRebatePromo v-if="list.redirectUrl === 'xf1-slots-rebate'" :promo-code="list.promoCode" />
    <SlotsBonusPromo v-if="list.redirectUrl === 'xf1-slots-bet-bonus'" :promo-code="list.promoCode" />

    <div v-if="list.redirectUrl === 'fucaiiphone'" class="promo-4">
      <div class="tabs">
        <q-card-section>
          <q-tabs v-model="activeKey" dense color="black" indicator-color="black" align="justify" narrow-indicator>
            <q-tab name="1" label="选择幸运号码" />
            <q-tab name="2" label="记录" />
            <!--            <q-tab-->
            <!--              name="3"-->
            <!--              label="获奖名单-->
            <!--"-->
            <!--            />-->
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeKey" animated>
            <q-tab-panel name="1">
              <div class="tab1">
                <!--                <img src="../assets/images/promotion/hotpromo/22/icon.png"/>-->
                <div class="contents">
                  <q-form class="q-gutter-md">
                    <div class="q-mb-md">
                      {{ selectedHotPromo.contents.tab1 }}
                    </div>
                    <q-input
                      v-model="lucky_number"
                      filled
                      bg-color="white"
                      label-color="black"
                      color="black"
                      :input-style="{ color: 'black' }"
                      type="number"
                      :rules="[(val) => (val && val.length === 3) || '号码长度应为3']"
                      label="幸运号码"
                    />
                    <q-btn :loading="btnLoading" @click="submitLuckyNumber()" color="brand" label="发送" />
                  </q-form>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="2">
              <q-form>
                <q-input filled v-model="formState.dateTime" label="选择日期" readonly color="white">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formState.dateTime" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="关闭" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:after>
                    <q-toggle
                      style="font-size: 12px"
                      v-model="formState.onlyMe"
                      color="red"
                      label="我自己"
                      left-label
                      size="xs"
                      val="xs"
                    />
                  </template>
                </q-input>
                <q-btn
                  @click="filterLuckyNumber()"
                  :loading="loading"
                  class="full-width q-mt-md"
                  color="brand"
                  label="搜索"
                />
              </q-form>
              <q-table
                title="幸运号码记录"
                no-data-label="没有数据"
                loading-label="加载中..."
                rows-per-page-label=" "
                :loading="loading"
                class="q-mt-md"
                :columns="filterColumn"
                :rows="dataSource"
              ></q-table>
            </q-tab-panel>

            <!--            <q-tab-panel name="3">-->
            <!--              <q-form>-->
            <!--                <q-input-->
            <!--                  filled-->
            <!--                  v-model="formState.resultTime"-->
            <!--                  label="选择日期"-->
            <!--                  readonly-->
            <!--                  color="white"-->
            <!--                >-->
            <!--                  <template v-slot:append>-->
            <!--                    <q-icon name="event" class="cursor-pointer">-->
            <!--                      <q-popup-proxy-->
            <!--                        cover-->
            <!--                        transition-show="scale"-->
            <!--                        transition-hide="scale"-->
            <!--                      >-->
            <!--                        <q-date-->
            <!--                          v-model="formState.resultTime"-->
            <!--                          mask="YYYY-MM-DD"-->
            <!--                        >-->
            <!--                          <div class="row items-center justify-end">-->
            <!--                            <q-btn-->
            <!--                              v-close-popup-->
            <!--                              label="关闭"-->
            <!--                              color="white"-->
            <!--                              flat-->
            <!--                            />-->
            <!--                          </div>-->
            <!--                        </q-date>-->
            <!--                      </q-popup-proxy>-->
            <!--                    </q-icon>-->
            <!--                  </template>-->
            <!--                </q-input>-->
            <!--                <q-btn-->
            <!--                  @click="filterWinnerLists()"-->
            <!--                  :loading="loading"-->
            <!--                  class="full-width q-mt-md"-->
            <!--                  color="brand"-->
            <!--                  label="搜索"-->
            <!--                />-->
            <!--              </q-form>-->

            <!--              <q-table-->
            <!--                class="q-mt-md"-->
            <!--                no-data-label="没有数据"-->
            <!--                loading-label="加载中..."-->
            <!--                rows-per-page-label=" "-->
            <!--                :loading="loading"-->
            <!--                :columns="winnerColumn"-->
            <!--                :rows="winnerDataSource"-->
            <!--              />-->
            <!--            </q-tab-panel>-->
          </q-tab-panels>
        </q-card-section>
      </div>
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
import { defineComponent, onMounted, ref, defineAsyncComponent } from "vue";
import { userStore } from "stores/index";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import * as _ from "lodash";
import moment from "moment";
import ClaimPromo from "../components/hotpromo/claimPromo.vue";
import TigerCardPromo from "../components/hotpromo/tigercard/tigerCardPromo.vue";
import GoldenEggPromo from "../components/hotpromo/goldenegg/goldenEggPromo.vue";
import HongBaoYuPromo from "../components/hotpromo/hongbaoyu/HongBaoYu.vue";
import HongBaoYu2024Promo from "../components/hotpromo/hongbaoyu/HongBaoYu2024.vue";
import HongBaoYuEurocupPromo from "../components/hotpromo/hongbaoyu/HongBaoYuEurocup.vue";
import HongBaoPreEurocupPromo from "../components/hotpromo/hongbaoyu/HongBaoPreEurocup.vue";
import WelcomeTaskPromo from "../components/hotpromo/welcometask/welcomeTaskPromo.vue";
import PrivilegeInvite from "../components/hotpromo/privilegeinviteA/PrivilegeInvite.vue";
import SlotLacky8 from "../components/hotpromo/slot-lacky8-24/slot-lacky8-24.vue";
// import CnySpinWheelPromo from "../components/hotpromo/cnySpinWheel/CnySpinWheel.vue";
import BonusSpinWheelPromo from "../components/hotpromo/bonusSpinWheel/BonusSpinWheel.vue";
import ReturnPromo from "../components/hotpromo/returnPromo/ReturnPromo.vue";
import DepositAwardPromo from "../components/hotpromo/depositAward/DepositAwardPromo.vue";
import SlotsRebatePromo from "../components/hotpromo/slotsrebate/SlotsRebatePromo.vue";
import SlotsBonusPromo from "../components/hotpromo/slotsbonus/SlotsBonusPromo.vue";
import OfficialGiftPromo from "./hotpromo/officialGift/OfficialGiftPromo.vue";
import AgYuanxiaohongbao from "./hotpromo/ag-yuanxiaohongbao/AgYuanxiaohongbao.vue";
import LanternFestival2025 from "../components/hotpromo/lantern-festival-2025/LanternFestival2025.vue";

const HongBaoYu2025 = defineAsyncComponent(() => import("../components/hotpromo/hongbaoyu2025/HongBaoYu2025.vue"));

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    AgYuanxiaohongbao,
    LanternFestival2025,
    ClaimPromo,
    TigerCardPromo,
    GoldenEggPromo,
    HongBaoYuPromo,
    HongBaoYu2024Promo,
    HongBaoYuEurocupPromo,
    WelcomeTaskPromo,
    PrivilegeInvite,
    HongBaoPreEurocupPromo,
    BonusSpinWheelPromo,
    ReturnPromo,
    SlotLacky8,
    HongBaoYu2025,
    OfficialGiftPromo,
    DepositAwardPromo,
    SlotsRebatePromo,
    SlotsBonusPromo
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

    const lucky_number = ref("");
    const loading = ref(false);
    const btnLoading = ref(false);
    const isClaimModal = ref(false);
    const claimMsg = ref("");
    const formState = ref({
      dateTime: "",
      onlyMe: false,
      resultTime: ""
    });
    const filterColumn = ref([
      {
        name: "number",
        label: "号码",
        field: "number",
        align: "left",
        sortable: true
      },
      {
        name: "name",
        label: "名字",
        field: "loginName",
        align: "left",
        sortable: true
      },
      {
        name: "status",
        label: "状态",
        field: "winStatus",
        align: "left",
        sortable: true
      },
      {
        name: "date",
        label: "日期",
        field: "date",
        align: "left",
        sortable: true
      }
    ]);
    const dataSource = ref([]);
    const winnerDataSource = ref([]);

    const winnerColumn = [
      {
        name: "number",
        label: "号码",
        field: "number",
        align: "left",
        sortable: true
      },
      {
        name: "name",
        label: "名字",
        field: "loginName",
        align: "left",
        sortable: true
      },
      {
        name: "status",
        label: "状态",
        field: "winStatus",
        align: "left",
        sortable: true
      },
      {
        name: "date",
        label: "日期",
        field: "date",
        align: "left",
        sortable: true
      }
    ];

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

    const filterLuckyNumber = () => {
      loading.value = true;
      dataSource.value = [];

      var filterDate = formState.value.dateTime;
      var onlyMe = formState.value.onlyMe;
      var onlyMeParam = "";
      if (onlyMe) {
        var user_id = store.id;
        onlyMeParam = "&memberId=" + user_id;
      }

      if (filterDate) {
        var filterDateStart = moment(filterDate).format("YYYY-MM-DD 00:00:00");
        var filterDateEnd = moment(filterDate).format("YYYY-MM-DD 23:59:59");
        var betweenDate = "recordTimeBetween=" + filterDateStart + "," + filterDateEnd;
      } else {
        var betweenDate = "";
      }

      var filterUrl = "/privi/selectedNumbers?" + betweenDate + onlyMeParam;

      // console.log(filterDate);
      eventapi
        .get(filterUrl)
        .then((res) => {
          loading.value = false;
          var data = res.data;
          _.each(data, function (item, index) {
            item.date = moment(item.recordTime).format("DD/MM/YYYY");
            dataSource.value.push(item);
          });

          console.log(dataSource.value);
        })
        .catch((error) => {
          loading.value = false;
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
        });
    };
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

    const submitLuckyNumber = () => {
      console.log(lucky_number.value);
      var submit_number = lucky_number.value.toString();

      if (submit_number.length !== 3) {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "ขีดสุด 3 ตัวเลข",
        //   icon: "report_problem"
        // });
      } else {
        var user_id = store.id;

        var postData = {};
        postData.number = submit_number;
        postData.promoCode = "xf-iphone";

        var luckyNumberUrl = "/privi/lotteryNumber";
        btnLoading.value = true;
        eventapi
          .post(luckyNumberUrl, qs.stringify(postData))
          .then((res) => {
            btnLoading.value = false;
            var responseCode = res.data;
            console.log(responseCode);
            if (responseCode.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "发送成功",
                icon: "check_circle_outline"
              });
            } else {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: responseCode.message,
              //   icon: "report_problem"
              // });
            }
          })
          .catch((error) => {
            btnLoading.value = false;
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: error.message,
            //   icon: "report_problem"
            // });
          });
      }
    };

    return {
      store,
      lucky_number,
      submitLuckyNumber,
      // loadLNWinnerList,
      filterLuckyNumber,
      filterWinnerLists,
      formState,
      dataSource,
      winnerDataSource,
      winnerColumn,
      filterColumn,
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
    padding: 10px;

    img {
      max-width: 100px;
      margin: 0 auto;
    }

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

  .promo-4 {
    .ant-tabs-bar {
      border-bottom: 0px solid #2b2b4b;
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
      border: 1px solid #db7e42;
      box-shadow: rgb(0 0 0 / 100%) 0px 6px 12px 0px;
      width: 400px;
      text-align: center;

      &-active {
        background-image: linear-gradient(to right, #de4545, #db7e42);
      }
    }

    .ant-tabs-nav-container {
    }

    .ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane,
    .ant-tabs .ant-tabs-bottom-content > .ant-tabs-tabpane {
      background: #2b2b4b;
    }

    .ant-tabs-ink-bar {
      height: 0px;
      background-color: #2b2b4b;
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
      background-color: #212534;
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

          flex: 1;
          color: #ffffff;
          text-align: center;
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
          background: #db7e42;
        }
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

  .bonus-svg-div {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;

    .claim-amt {
      font-size: 33px;
      color: #fff;
      font-family: "Wave";
      text-align: center;
    }

    .bonus-text {
      font-size: 24px;
      // color: #ff3131;
      color: #ceab26;
      text-align: center;
      font-weight: 700;
      font-family: "Jura";
      white-space: nowrap;
    }
  }

  .q-btn-item {
    margin-top: 10px;
  }

  .q-btn__content {
    color: #fff;
    background-image: linear-gradient(to right, #de4545, #db7e42) !important;
    width: 80px;
    border-radius: 5px;
    -moz-border-radius: 5px;
  }
}

@media (max-width: 768px) {
  .hot-promo {
    .promo-bg {
      img {
        max-width: 100px;
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
  border-radius: 12px;
  padding: 30px;
  font-family: "PingFang";
  background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%) ;
  border: 1px solid #be9457 ;
  color: #fff;

  &.cny {
    background: url("../assets/images/promotion/hotpromo/hongbaoyu2025/section-bg.png") !important;
    background-size: 100% 100% !important;
    border: none !important;
    color: #4C4C6C !important;
  }

  .section-table {
    th {
      height: 56px;
      font-size: 1rem;
      font-weight: 400;
      line-height: 28px;
      color: #fff !important;
      box-shadow: 0px 8px 9px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
        0px -4px 4px 0px rgba(255, 255, 255, 0.25) inset ;
      background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) ;
      white-space: pre-wrap;

      &:not(:last-child) {
        border-right: 1px solid #dcdce8;
      }
    }

    td {
      border: 1px solid #484c5770;
      color: #fff;
      background-color: transparent !important;
    }

    &.cny {
      th {
        background: linear-gradient(180deg, #FFE190 0%, #FF9F40 100%) !important;
        color: #894800 !important;
      }

      td {
        color: #4C4C6C !important;
      }
    }
  }

  .element-bg {
    color: #fff !important;
    box-shadow: 0px 8px 9px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
      0px -4px 4px 0px rgba(255, 255, 255, 0.25) inset !important;
    background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) !important;
  }

  .ribbon {
    clip-path: polygon(0% 0%, 100% 0%, calc(100% - 10px) 50%, 100% 100%, 0% 100%);
    background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%);
    padding-right: 10px;
    font-family: "PingFang";
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: fit-content;
    padding: 0px 20px 0px 10px;
    white-space: nowrap;
    height: fit-content;

    &.cny {
      background: linear-gradient(180deg, #FFE190 0%, #FF9F40 100%);
      color: #894800;
    }
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
    color: #fff;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .item {
    color: #fff;
    padding-left: 24px;
    display: flex;
    gap: 10px;
    font-size: 1rem;

    .item-num {
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
      color: #fff ;
      box-shadow: 0px 8px 9px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
        0px -4px 4px 0px rgba(255, 255, 255, 0.25) inset ;
      background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) ;
    }

    .item-num__pseudo {
      height: 28px !important;
      width: 28px !important;
      min-width: 28px;
      display: flex;
    }
  }

  &.cny {
    .item, .title-img {
      color: #4C4C6C;
    }
  }
}
</style>
