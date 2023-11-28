<template>
  <q-dialog v-model="isGiftRecordModalOpen" class="custom-modal-content">
    <q-card>
      <q-card-section class="row items-center q-pb-none dialog-header">
        <div class="text-h6">兑换记录</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section class="dialog-body">
        <table class="record-table">
          <thead>
            <tr>
              <th>兑换时间</th>
              <th width="290">礼品名称</th>
              <th>当前状态</th>
            </tr>
          </thead>
          <tbody id="recordBody">
            <template v-if="isGiftRecordLoading">
              <tr><td colspan="3">loading...</td></tr>
            </template>
            <template v-else-if="giftRecordData.length ? true : false">
              <tr v-for="(e, i) in giftRecordData" :key="`gift-record-${i}`">
                <td>{{ e.createTime }}</td>
                <td class="gift-name">{{ e.giftName }}</td>
                <td>{{ e.status }}</td>
              </tr>
            </template>
            <template v-else>
              <tr><td colspan="3">暂无数据</td></tr>
            </template>
          </tbody>
        </table>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isGiftModalOpen" class="custom-modal-content">
    <q-card>
      <q-card-section class="row items-center q-pb-none dialog-header">
        <div class="text-h6">申请礼品</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>
      <q-card-section class="dialog-body">
        <form id="giftForm" novalidate="">
          <div class="form-group">
            <label class="form-label">收件人：</label>
            <div class="form-input">
              <input
                v-model="submitGiftData.recipient"
                type="input"
                name="recipient"
                class="form-control"
                autocomplete="off"
                required
                data-parsley-required-message="收件人不能为空"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">手机号码：</label>
            <div class="form-input">
              <input
                v-model="submitGiftData.recipientTelephone"
                type="input"
                name="recipientTelephone"
                class="form-control"
                autocomplete="off"
                minlength="11"
                maxlength="11"
                required
                data-parsley-length-message="请输入11位手机号码"
                data-parsley-required-message="手机号码不能为空"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">收件地址：</label>
            <div class="form-input">
              <textarea
                v-model="submitGiftData.address"
                rows="5"
                cols="8"
                name="address"
                class="form-control"
                autocomplete="off"
                required
                data-parsley-required-message="收件地址不能为空"
              ></textarea>
            </div>
          </div>
          <div class="form-group">
            <input type="hidden" name="giftId" id="giftId" :value="selectedGift.id" />
            <div class="btn btn-primary" style="margin-right: 20px" @click="reset()">重置</div>
            <div id="giftSubmit" class="btn btn-primary" @click="submitGift()">提交</div>
          </div>
        </form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <div class="esports-gift-container">
    <div style="margin: 0 auto">
      <div class="title">活动礼品</div>
      <div class="progress-bar-container">
        <div class="member-bet-box" ref="memberBetBoxRef">
          <div style="width: 100px">
            <span class="member-valid-bet">
              <Vue3autocounter
                ref="counter"
                :startAmount="0.0"
                :endAmount="memberBetDisplay"
                :duration="2"
                separator=","
                decimalSeparator="."
                :decimals="2"
                :autoinit="true"
              />
            </span>
            元
          </div>
          <div class="dsj"></div>
        </div>
        <div class="progress-bar-box">
          <div
            v-for="(e, i) in progressBarItemCount"
            :key="`pbi-count-${i}`"
            class="progress-bar-item"
            ref="progressBarItemRef"
          ></div>
        </div>
        <div class="progress-down-box">
          <div class="progress-down-item-large"></div>
          <div
            v-for="(e, i) in progressDownItemSmallCount"
            :key="`pdis-count-${i}`"
            class="progress-down-item-small"
          ></div>
          <div class="progress-down-item-large"></div>
          <div
            v-for="(e, i) in progressDownItemSmallCount"
            :key="`pdis-count-${i + 7}`"
            class="progress-down-item-small"
          ></div>
          <div class="progress-down-item-large"></div>
          <div
            v-for="(e, i) in progressDownItemSmallCount"
            :key="`pdis-count-${i + 14}`"
            class="progress-down-item-small"
          ></div>
          <div class="progress-down-item-large"></div>
          <div
            v-for="(e, i) in progressDownItemSmallCount"
            :key="`pdis-count-${i + 21}`"
            class="progress-down-item-small"
          ></div>
          <div class="progress-down-item-large"></div>
          <div
            v-for="(e, i) in progressDownItemSmallCount"
            :key="`pdis-count-${i + 28}`"
            class="progress-down-item-small"
          ></div>
          <div class="progress-down-item-large"></div>
          <div
            v-for="(e, i) in progressDownItemSmallCount"
            :key="`pdis-count-${i + 35}`"
            class="progress-down-item-small"
          ></div>
          <div class="progress-down-item-large"></div>
          <div style="position: absolute; top: 27px; left: 0">0</div>
          <div style="position: absolute; right: 0; top: 27px">5000000</div>
        </div>
        <div style="margin: 25px 0; color: #596281">
          注：流水只统计东赢电竞，CR体育，IM电竞/体育，沙巴体育，小艾电竞总流水。
          <div class="exchange-btn exchange-record-btn active" @click="loadMemberRecords()">兑换记录</div>
        </div>
      </div>
      <div class="gift-container">
        <div v-for="(e, i) in giftListData" :key="`gift-list-${i}`" class="gift-item-box">
          <div>
            <img :src="imgURL + e.siteId + '/' + e.mobileImgUrl" />
          </div>
          <div class="gift-name">{{ e.name }}</div>
          <div class="gift-desc">需要流水金额：{{ e.redeemPoints }}</div>
          <div
            :class="`exchange-btn ${memberBet >= e.redeemPoints ? 'active' : ''}`"
            :data-rpoint="e.redeemPoints"
            @click="exchangeGift(e)"
          >
            兑换礼品
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
import { getGiftList, getGiftBet, redeemGift, getGiftRecord } from "../../../api/index/promo";
import Vue3autocounter from "vue3-autocounter";
import { TweenMax } from "gsap";
import * as _ from "lodash";

const $q = useQuasar();
const store = userStore();
const imgURL = process.env.IMAGE_CDN + "/promo/gifts/";

const isGiftRecordLoading = ref(false);
const isGiftRecordModalOpen = ref(false);
const giftRecordData = ref([]);
function loadMemberRecords() {
  if (!store.token) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "请登录后操作",
      icon: "report_problem"
    });
  } else {
    isGiftRecordLoading.value = true;
    isGiftRecordModalOpen.value = true;

    getGiftRecord().then((res) => {
      isGiftRecordLoading.value = false;

      const { code, data } = res;
      if (code === 0) {
        if (data && data.length) giftRecordData.value = data;
      }
    });
  }
}

let selectedGift = reactive({ id: null });
const isGiftModalOpen = ref(false);
function exchangeGift(giftData) {
  const { id, redeemPoints } = giftData;

  const giftBeginTime = new Date(2020, 1, 1, 0, 0, 0).getTime();
  if (new Date().getTime() < giftBeginTime) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "活动2020年2月1日开始，敬请期待!",
      icon: "report_problem"
    });
  } else if (memberBet.value < redeemPoints) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "兑换此礼品您还需要" + (redeemPoints - memberBet.value).toFixed(2) + "元有效投注额，请继续加油！",
      icon: "report_problem"
    });
  } else {
    selectedGift = giftData;

    submitGiftData.giftId = id;
    reset();

    isGiftModalOpen.value = true;
  }
}

let isSubmitBtnDisable = false;
const submitGiftData = reactive({ giftId: "", recipient: "", recipientTelephone: "", address: "" });
function submitGift() {
  if (isSubmitBtnDisable) return;
  isSubmitBtnDisable = true;

  if (store.token) {
    redeemGift(submitGiftData)
      .then((res) => {
        const { code, message } = res;

        if (code == 0) {
          $q.notify({
            type: "positive",
            position: "top",
            message: "操作成功",
            icon: "check_circle_outline"
          });
          setTimeout(() => {
            location.reload();
            isGiftModalOpen.value = false;
          }, 2000);
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: message,
            icon: "report_problem"
          });
        }
      })
      .catch(() => {})
      .then(() => {
        isSubmitBtnDisable = false;
      });
  }
}

function reset() {
  submitGiftData.recipient = "";
  submitGiftData.recipientTelephone = "";
  submitGiftData.address = "";
}

const giftListData = ref([]);
function loadGifts(callback) {
  getGiftList().then((res) => {
    const { code, data, message } = res;

    if (code == 0) giftListData.value = data;
    else
      $q.notify({
        color: "negative",
        position: "top",
        message: message,
        icon: "report_problem"
      });

    callback && callback();
  });
}

const progressBarItemCount = 48;
const progressDownItemSmallCount = 7;
const memberBetBoxRef = ref();
const progressBarItemRef = ref([]);

const memberBet = ref(0);
const memberBetDisplay = ref(0);
function loadMemberBet() {
  getGiftBet().then((res) => {
    let { code, data, message } = res;
    if (code == 0) {
      memberBetDisplay.value = memberBet.value = data;
      if (data) {
        if (data > 5000000) memberBetDisplay.value = 5000000;

        const mbb = memberBetBoxRef.value;
        const ratio = memberBetDisplay.value / 5000000;
        const leftMargin = ratio * 407;

        // 0.2 / 2 = 10 --> +1 (init) --> +1 (endCount)
        let updateCount = 12;
        const progressItemActive = () => {
          updateCount--;
          if (updateCount <= 1) updateCount = 1;
          const count = Math.ceil(ratio * progressBarItemCount) / updateCount;
          for (let i = 0, l = count; i < l; i++) {
            progressBarItemRef.value[i].classList.add("active");
          }
        };
        TweenMax.to(mbb, 2, {
          x: leftMargin,
          onUpdate: _.throttle(progressItemActive, 200)
        });
      }
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: message,
        icon: "report_problem"
      });
    }
  });
}

onMounted(() => {
  loadGifts(() => {
    if (store.token) loadMemberBet();
  });
});
</script>

<style scoped lang="scss">
.esports-gift-container {
  font-size: 14px;
  color: #596281;
  line-height: 26px;

  .title {
    font-size: 18px;
    color: #40aae6;
    font-weight: bold;
    margin-left: 10px;
  }

  .progress-bar-container {
    position: relative;
    color: #40aae6;
    margin-top: 70px;
    padding: 0 20px;

    .member-bet-box {
      position: absolute;
      top: -45px;
      left: -28px;
      text-align: center;
      transition: 2s;

      .dsj {
        width: 0;
        height: 0;
        border: 15px solid transparent;
        border-top: 15px solid #40aae6;
        margin: 0 auto;
      }
    }

    .progress-bar-box {
      height: 44px;
      background-color: #fbfcfe;
      border: solid 2px #40aae6;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin: 0 auto;

      .progress-bar-item {
        width: 5px;
        height: 32px;
        background-color: #bccfda;
        transition: all 0.5s ease-out;

        &.active {
          background-color: #40aae6;
        }
      }
    }

    .progress-down-box {
      position: relative;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin: 5px auto 0;

      .progress-down-item-small {
        width: 3px;
        height: 15px;
        background-color: #40aae6;
      }

      .progress-down-item-large {
        width: 5px;
        height: 30px;
        background-color: #40aae6;
      }
    }
  }

  .gift-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    text-align: center;
    flex-wrap: wrap;
    padding-bottom: 46px;
    min-height: 370px;

    .gift-item-box {
      width: 200px;
      background-color: #ffffff;
      box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.07);
      border-radius: 10px;
      border: solid 1px #40aae6;
      font-size: 14px;
      line-height: 26px;
      margin: 12px 7px;
      padding: 15px;

      .gift-name {
        color: #000000;
        font-weight: 600;
        padding: 0 12px;
        height: 52px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .gift-desc {
        color: #596281;
        margin-bottom: 16px;
      }
    }
  }

  .exchange-btn {
    width: 150px;
    height: 40px;
    border-radius: 2px;
    border: solid 1px #596281;
    font-size: 18px;
    color: #596281;
    line-height: 40px;
    text-align: center;
    margin: 0 auto;
    cursor: pointer;

    &.active,
    &:hover {
      background-image: linear-gradient(218deg, #68b4fc 0%, #2f76f6 99%), linear-gradient(#40aae6, #40aae6);
      background-blend-mode: normal, normal;
      color: #ffffff;
      border: none;
    }
  }

  .exchange-record-btn {
    width: 100px;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    position: absolute;
    right: 15px;
  }

  .promo-time {
    margin: 25px 0 32px 42px;
    color: #596281;
  }

  .promo-content-box {
    width: 1061px;
    height: 501px;
    background-color: #ffffff;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.07);
    border-radius: 10px;
    border: solid 1px #40aae6;
    padding: 42px 66px;
    margin-top: 29px;

    .promo-rule-list li {
      list-style: decimal;
      margin-bottom: 7px;
    }
  }
}

.record-table {
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 16px;
  border: 1px solid #bac8dc;
  color: #737985;
  margin: 0 auto;

  th,
  td {
    border: 1px solid #bac8dc;
    text-align: center;
  }

  th {
    height: 40px;
    font-weight: 400;
  }
  td {
    font-weight: 600;
    color: #000000;

    .gift-name {
      padding: 0 12px;
    }
  }
}

.custom-modal-content {
  width: 1000px;
}

.dialog-header {
  background: #0eb0ff;
  color: white;
  padding: 0.5rem;
}

.dialog-body {
  padding: 30px 20px;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;

  q-button {
    background: #409eff;
    color: white;
    padding: 8px 15px;
    border-radius: 4px;
    width: 50%;
    text-align: center;
  }
}

#giftForm .form-group {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  .form-label {
    font-size: 12px;
    font-weight: normal;
    color: #3d4b66;
    width: 75px;
  }

  .form-input {
    .form-control {
      min-width: 200px;
      max-width: 200px;
    }
  }

  .btn-primary {
    width: 150px;
    height: 40px;
    border-radius: 2px;
    font-size: 18px;
    color: #596281;
    line-height: 40px;
    text-align: center;
    margin: 0 auto;
    color: #fff;
    background: linear-gradient(218deg, #68b4fc 0%, #007bff 99%), linear-gradient(#40aae6, #40aae6);
    border: solid 1px #007bff;

    &:hover {
      background: linear-gradient(218deg, #68b4fc 0%, #0062cc 99%), linear-gradient(#40aae6, #40aae6);
      border: solid 1px #0062cc;
    }
  }
}
</style>
