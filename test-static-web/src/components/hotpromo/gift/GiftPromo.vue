<template>
  <el-dialog v-model="isGiftRecordModalOpen" title="兑换记录" class="custom-modal-content">
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
  </el-dialog>

  <el-dialog v-model="isGiftModalOpen" title="申请礼品" class="custom-modal-content">
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
  </el-dialog>

  <div class="esports-gift-container">
    <div style="width: 1075px; margin: 0 auto">
      <div class="title">活动礼品</div>
      <div class="progress-bar-container">
        <div class="member-bet-box" ref="memberBetBoxRef">
          <div style="width: 100px">
            <span class="member-valid-bet">
              <Vue3Autocounter
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
          <div style="position: absolute; top: 27px; left: -1px">0</div>
          <div style="position: absolute; right: 0; top: 27px; transform: translateX(50%)">5000000</div>
        </div>
        <div style="margin: 15px 0 25px 15px; color: #596281">
          注：流水只统计雷火电竞，IM电竞/体育，沙巴体育，小艾电竞总流水。
          <div class="exchange-btn exchange-record-btn active" @click="loadMemberRecords()">兑换记录</div>
        </div>
      </div>
      <div class="gift-container">
        <div v-for="(e, i) in giftListData" :key="`gift-list-${i}`" class="gift-item-box">
          <div>
            <img :src="imgURL + e.desktopImgUrl" />
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
import { userStore } from "@/store";
import { getGiftList, getGiftBet, redeemGift, getGiftRecord } from "@/api/index/promo";
import Vue3Autocounter from "vue3-autocounter";
import { TweenMax } from "gsap";
import * as _ from "lodash";
import { useLocalStorage } from "@vueuse/core";
import { useNotify } from "@/hooks/notify";

const store = userStore();
const notify = useNotify();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

const isGiftRecordLoading = ref(false);
const isGiftRecordModalOpen = ref(false);
const giftRecordData = ref([]);
function loadMemberRecords() {
  if (!store.token) {
    notify.error("请登录后操作");
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
    notify.error("活动2020年2月1日开始，敬请期待!");
  } else if (memberBet.value < redeemPoints) {
    notify.error("兑换此礼品您还需要" + (redeemPoints - memberBet.value).toFixed(2) + "元有效投注额，请继续加油！");
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
          notify({
            type: "success",
            message: "操作成功",
            onClose: () => {
              location.reload();
              isGiftModalOpen.value = false;
            }
          });
        } else {
          notify.error(message);
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
    else notify.error(message);

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
        const leftMargin = ratio * 1014;

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
      notify.error(message);
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

    .member-bet-box {
      position: absolute;
      top: -45px;
      left: -20px;
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
      width: 1017px;
      height: 44px;
      background-color: #fbfcfe;
      border: solid 2px #40aae6;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin: 0 auto;

      .progress-bar-item {
        width: 16px;
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
      width: 1018px;
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
    justify-content: flex-start;
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

      img {
        width: 100%;
      }

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
  width: 550px;
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
