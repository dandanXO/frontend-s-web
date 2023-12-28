<template>
  <div class="hot-promo">
    <div v-if="list.promoCode === 'jolly_event' && !isCommonPromo && !btnHide">
      <div class="row items-center justify-center" v-if="store.hasToken()">
        <q-btn size="md" class="login-btn" @click="submitEvent">{{ $t("lang.participate") }}</q-btn>
      </div>
      <div class="row items-center justify-center" v-else>
        <q-btn size="md" class="login-btn" to="/login">{{ $t("lang.loginToCont") }}</q-btn>
      </div>
    </div>

    <div v-if="list.id === 30 && store.hasToken()" class="promo-4">
      <div class="tabs">
        <q-card-section>
          <q-tabs
            v-model="activeKey"
            dense
            class="text-grey"
            active-color="brand"
            indicator-color="black"
            align="justify"
            narrow-indicator
          >
            <q-tab name="1" label="เลือกเลขนำโชค" />
            <q-tab name="2" label="บันทึก" />
            <q-tab name="3" label="รายชื่อผู้ชนะ" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeKey" animated>
            <q-tab-panel name="1">
              <div class="tab1">
                <img src="../assets/images/promotion/hotpromo/22/icon.png" />
                <div class="contents">
                  <q-form class="q-gutter-md">
                    <div class="q-mb-md">
                      {{ selectedHotPromo.contents.tab1 }}
                    </div>
                    <q-input
                      v-model="lucky_number"
                      filled
                      color="white"
                      type="number"
                      :rules="[(val) => (val && val.length === 3) || 'ขีดสุด 3 ตัวเลข']"
                      label="เลขนำโชค"
                    />
                    <q-btn :loading="btnLoading" @click="submitLuckyNumber()" color="brand" label="ส่ง" />
                  </q-form>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="2">
              <q-form>
                <q-input filled v-model="formState.dateTime" label="เลือกวันที่" readonly color="white">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formState.dateTime" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="ปิด" color="white" flat />
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
                      label="เฉพาะฉันเท่านั้น"
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
                  label="คัดกรอง"
                />
              </q-form>
              <q-table
                title="เลขนำโชคบันทึกรา"
                no-data-label="ไม่มีข้อมูล"
                loading-label="กำลังโหลด..."
                rows-per-page-label=" "
                :loading="loading"
                class="q-mt-md"
                :columns="filterColumn"
                :rows="dataSource"
              ></q-table>
            </q-tab-panel>

            <q-tab-panel name="3">
              <q-form>
                <q-input filled v-model="formState.resultTime" label="เลือกวันที่" readonly color="white">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formState.resultTime" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="ปิด" color="white" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-btn
                  @click="filterWinnerLists()"
                  :loading="loading"
                  class="full-width q-mt-md"
                  color="brand"
                  label="คัดกรอง"
                />
              </q-form>

              <q-table
                class="q-mt-md"
                no-data-label="ไม่มีผู้ชนะรางวัลในวันนี้"
                loading-label="กำลังโหลด..."
                rows-per-page-label=" "
                :loading="loading"
                :columns="winnerColumn"
                :rows="winnerDataSource"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </div>
    </div>

    <ClaimPromo
      v-if="isCommonPromo && store.hasToken()"
      :promo-id="list.id"
      :loading-claim="btnLoading"
      @daily-slot="handleSlot()"
    />

    <SJBPromo v-if="list.id === 40 && !isCommonPromo && store.hasToken()" class="promo-sjb" />

    <template v-if="list.promoCode === 'multi-wheel'">
      <template v-if="store.hasToken()">
        <PromoSpinWheel></PromoSpinWheel>
        <PromoSpinWheelWinner></PromoSpinWheelWinner>
      </template>
      <div v-else class="row items-center justify-center">
        <q-btn size="md" class="login-btn" to="/login">{{ $t("lang.loginToCont") }}</q-btn>
      </div>
    </template>

    <!--    <InviteFriendPromo v-if="list.id === 80 && !isCommonPromo" class="promo-invt" />-->
  </div>

  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="row items-center">
        <div class="bonus-svg-div">
          <span class="claim-amt">{{ claimMsg }}</span>
          <span class="bonus-text">{{ $t("lang.claim") }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat :label="$t('lang.agree')" color="primary" v-close-popup />
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
import SJBPromo from "../components/hotpromo/40/shiJieBei.vue";
import InviteFriendPromo from "../components/hotpromo/35/inviteFriendPromo.vue";
import PromoSpinWheel from "components/hotpromo/80/PromoSpinWheel.vue";
import PromoSpinWheelWinner from "components/hotpromo/80/PromoSpinWheelWinner.vue";
import { useI18n } from "vue-i18n";
import qs from "qs";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    ClaimPromo,
    SJBPromo,
    PromoSpinWheel,
    PromoSpinWheelWinner
    // InviteFriendPromo
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
          var responseCode = res.data;
          if (responseCode.code === 0) {
            var rebatePoint = responseCode.data;
            this.claimMsg = "$" + rebatePoint;
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
      this.list.id === 30 ||
      this.list.id === 40 ||
      this.list.id === 35 ||
      this.list.id === 81 ||
      this.list.promoCode === "jolly_event"
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
    if (this.list.promoCode === "jolly_event") {
      if (store.hasToken()) {
        eventapi.get("/privi-christmas/check-deposit", qs.stringify({ promoCode: "jolly_event" })).then((res) => {
          if (res.data.data === false) {
            btnHide.value = true
          }
        })
      }
    }
  },
  setup() {
    var qs = require("qs");
    const $q = useQuasar();

    const store = userStore();

    const { t } = useI18n();
    const lucky_number = ref("");
    const loading = ref(false);
    const btnLoading = ref(false);
    const btnHide = ref(false);
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
        label: "เบอร์",
        field: "number",
        align: "left",
        sortable: true
      },
      {
        name: "name",
        label: "ชื่อ",
        field: "loginName",
        align: "left",
        sortable: true
      },
      {
        name: "status",
        label: "สถานะ",
        field: "winStatus",
        align: "left",
        sortable: true
      },
      {
        name: "date",
        label: "วันที่",
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
        label: "เบอร์",
        field: "number",
        align: "left",
        sortable: true
      },
      {
        name: "name",
        label: "ชื่อ",
        field: "loginName",
        align: "left",
        sortable: true
      },
      {
        name: "status",
        label: "สถานะ",
        field: "winStatus",
        align: "left",
        sortable: true
      },
      {
        name: "date",
        label: "วันที่",
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

      var filterUrl = "/privi/selectedNumbers?recordTime=" + filterDate + onlyMeParam;

      // console.log(filterDate);
      eventapi
        .get(filterUrl)
        .then((res) => {
          loading.value = false;
          var data = res.data.data;
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
    const submitEvent = () => {

      var joinChristmasUrl = "/privi-christmas/join";
      btnLoading.value = true;
      eventapi.post(joinChristmasUrl, qs.stringify({ promoCode: "jolly_event" })).then((res) => {
        btnLoading.value = false;
        var responseCode = res.data;
        if (responseCode.code === 0) {
          btnHide.value = true;
          $q.notify({
            color: "positive",
            position: "top",
            message: t("lang.sent_success"),
            icon: "check_circle_outline"
          });
        } else {
        }
      });
    };

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
        postData.promoCode = "jolly88-iphone";

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
                message: t("lang.number_sent"),
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
      claimMsg,
      submitEvent,
      btnHide
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

    > img {
      max-width: 250px;
      margin: auto;
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
      color: $white;
      font-size: 16px;
      border-radius: 10px;
      border: 1px solid #db7e42;
      box-shadow: rgb(0 0 0 / 100%) 0px 6px 12px 0px;
      width: 400px;
      text-align: center;

      &-active {
        background-image: $linear-bg-red;
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
      color: $white;
      background-color: #23263c;
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

.login-btn {
  border: 1px solid #ffa9ab;
  background: $linear-bg-1;
  color: $white !important;
  border-radius: 25px;
  font-size: $normal-size;
  line-height: 1rem;
}

.win-rebate-model {
  width: 80%;
  max-width: 450px;
  min-width: 300px;

  .bonus-svg-div {
    background-image: url("../assets/promo/BONUS.svg");
    background-repeat: no-repeat;
    width: 270px;
    height: 214px;
    margin: 12px auto 12px;
    background-position: center center;
    position: relative;

    .claim-amt {
      position: absolute;
      font-size: 33px;
      color: #fff;
      bottom: 28px;
      left: 50%;
      transform: translate(-50%, 0);
      font-family: "Wave";
    }

    .bonus-text {
      position: absolute;
      font-size: 24px;
      color: #ff3131;
      bottom: 0px;
      left: 50%;
      transform: translate(-50%, 0);
      font-weight: 700;
      font-family: "Jura";
    }
  }

  .q-btn-item {
    margin-top: 10px;
  }

  .q-btn__content {
    color: #fff;
    background-image: $linear-bg-red !important;
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
</style>
