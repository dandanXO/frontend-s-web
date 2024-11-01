<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brightbtn" />
      <div class="label" style="color: #fff">加载中</div>
    </q-inner-loading>
    <div v-if="!loading" class="q-pa-md">
      <q-infinite-scroll @load="onLoad" :offset="250" class="q-gutter-y-md">
        <div v-for="(det, n) in truncatedList" :key="n" class="bg-darkbox" style="position: relative">
          <!-- Table top amount start -->
          <template v-for="header in headers" :key="header.key">
            <div v-if="header.key === 'depositAmount'" class="amount-container">
              <div class="amount-header-title">{{ header.label }}</div>
              <div class="amount-desc">{{ det.depositAmount }}</div>
            </div>
          </template>
          <!-- Table top amount end -->

          <div class="table-data" v-for="(head, e) in headers" :key="e">
            <template v-if="head.key !== 'depositAmount'">
              <div class="label">{{ head.label }}:</div>
              <template v-for="obj in Object.keys(det)" :key="obj">
                <div v-if="obj === head.key" class="desc">
                  <div v-if="obj === 'type'">
                    {{ translateRecord(det[obj], "") }}
                  </div>
                  <div v-else-if="obj === 'betId'">
                    <q-link @click="copyText(det[obj], '注单号')">
                      <span style="color: #468cff">复制</span>
                      {{ det[obj].slice(0, 1) }}...
                      <q-tooltip anchor="center start" self="center middle" :offset="[-180, 10]">
                        {{ det[obj] }}
                      </q-tooltip>
                    </q-link>
                  </div>
                  <div v-else-if="obj === 'status'">
                    {{ checkRecord(det[obj]) }}
                  </div>
                  <div v-else-if="obj === 'betStatus'">
                    {{ checkRecord(det[obj]) }}
                  </div>
                  <div v-else-if="obj === 'paymentType'">
                    {{ checkRecord(det[obj]) }}
                  </div>
                  <div v-else-if="obj === 'gameType' || obj === 'platform'">
                    {{ checkRecord(det[obj]) }}
                  </div>
                  <div
                    v-else-if="
                      obj === 'commitDate' ||
                      obj === 'feedbackTime' ||
                      obj === 'recordTime' ||
                      obj === 'transferDate' ||
                      (obj === 'betTime' && recordType === 'bethistory')
                    "
                  >
                    {{ humanDatetime(det[obj]) }}
                  </div>
                  <div v-else-if="obj === 'platformCode' || obj === 'financeRemark' || obj === 'subType'">
                    {{ checkRecord(det[obj]) }}
                  </div>
                  <div v-else-if="obj === 'serialNumber'" class="serialnum-row">
                    {{ det[obj] }}
                    <div @click="copyText(det.serialNumber)" class="btn-copyserialnum">复制</div>
                  </div>
                  <div v-else>
                    {{ det[obj] }}
                  </div>
                </div>
              </template>
            </template>
          </div>
          <div
            v-if="
              (recordType === 'deposit' && det.status === 'PENDING') ||
              (recordType === 'withdraw' && det.status === 'STEP_1')
            "
            class="buttons"
          >
            <q-btn label="催单" @click="feedbackTrans(det)" color="orangebtn" class="btn-reminder" size="md" />
          </div>

          <div v-if="recordType === 'withdraw'" class="buttons">
            <template
              v-if="
                det.status === 'SUCCESS' &&
                (det.currencyName === 'CNY' || det.currencyName === 'AliCNY') &&
                det.confirmStatus === 0
              "
            >
              <q-btn @click="openWithdrawConfirmDialog(det)" outline label="确认到账" size="sm" color="bright" />
            </template>

            <template v-if="det.status === 'APPLY' || det.status === 'STEP_2'">
              <q-btn
                @click="openWithdrawCancelDialog(det)"
                outline
                label="取消"
                size="sm"
                color="bright"
                class="q-mr-sm"
              />
            </template>
          </div>
        </div>

        <template v-slot:loading>
          <div v-if="comList.length > 0">
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="white" size="40px" />
            </div>
          </div>
          <div v-else class="q-pa-md" style="text-align: center">
            <div class="row justify-center q-my-md" v-if="!isEnded">
              <q-spinner-dots color="white" size="40px" />
            </div>
            <span style="padding: 4px 0px; line-height: 36px" v-if="isEnded">没有更多数据了</span>
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>

  <q-input style="width: 100%; opacity: 0" filled color="white" ref="copyinput" v-model="text_copied" />

  <q-dialog v-model="reminderDialog" width="100%">
    <q-card class="reminder-dialog-card bg-darkbox text-white" style="width: 100%">
      <div class="row q-mb-md">
        <div class="text-h6">催单</div>
        <!-- <q-btn flat v-close-popup round dense icon="close" /> -->
      </div>
      <q-card-section>
        <q-form
          ref="formRef"
          v-model="reminderForm"
          hide-required-mark
          name="basic"
          colon
          autocomplete="off"
          label-align="left"
          label-cols="5"
          class="reminder-dialog-form q-pt-md q-gutter-y-md"
        >
          <div>
            <div class="q-mb-sm">存款编码</div>
            <q-input
              placeholder="存款编码"
              v-model="reminderForm.orderNo"
              padding="none"
              readonly
              disable
              outlined
              color="white"
              bg-color="recinputstyle"
            />
          </div>

          <div>
            <div class="q-mb-sm">
              上传图片
              <span style="color: #f53434">*</span>
            </div>
            <FileUpload @photoResponse="getImageLink" ref="uploadFileRef" />
          </div>

          <div>
            <div class="q-mb-sm">
              备注
              <span style="color: #f53434">*</span>
            </div>
            <q-input
              type="textarea"
              v-model="reminderForm.memberRemark"
              placeholder="备注"
              autogrow
              :rows="2"
              :max-rows="5"
              outlined
              color="white"
              bg-color="recinputstyle"
            />
          </div>

          <q-btn
            class="common-btn q-mt-md"
            color="brightbtn"
            size="md"
            label="发送"
            style="width: 100%"
            @click="submitReminder"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isConfirmWithdraw">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black">
      <q-card-section class="q-mb-md">
        系统提示
        <br />
        <br />
        确认到账
      </q-card-section>
      <q-btn @click="openWithdrawConfirm()" label="确认" color="brightbtn" style="margin-right: 8px" />
      <q-btn @click="isConfirmWithdraw = false" label="取消" color="warning" />
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isCancelWithdraw">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black">
      <q-card-section class="q-mb-md">
        系统提示
        <br />
        <br />
        确认取消提款
      </q-card-section>
      <q-btn @click="openWithdrawCancel()" label="确认" color="brightbtn" style="margin-right: 8px" />
      <q-btn @click="isCancelWithdraw = false" label="取消" color="warning" />
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import moment from "moment";
import FileUpload from "components/FileUpload.vue";
import { api } from "boot/axios";
import { SessionStorage, useQuasar } from "quasar";
import { translateRecord } from "../directives/translate.js";
import * as _ from "lodash";

export default defineComponent({
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: function () {
        return true;
      }
    },
    recordType: {
      type: String,
      default: function () {
        return "";
      }
    },
    headers: {
      type: Array,
      default: function () {
        return [];
      }
    },
    isEnded: {
      type: Boolean,
      default: function () {
        return false;
      }
    }
  },
  components: {
    FileUpload
  },
  emits: ["loadnewdata"],
  setup(props, context) {
    const truncatedList = ref([]);
    const comList = ref({});
    const $q = useQuasar();
    const qs = require("qs");
    const isConfirmWithdraw = ref(false);
    const isCancelWithdraw = ref(false);
    const passDet = ref(null);

    const clearTable = () => {
      truncatedList.value = [];
    };

    context.expose({ clearTable });

    const onLoad = (index, done) => {
      comList.value = props.list;
      // console.log("onLoad");
      // console.log(comList.value);
      setTimeout(() => {
        if (!props.isEnded) {
          if (comList.value.length) {
            var slicedArray = comList.value.splice(0, 3);
            slicedArray.forEach((element) => {
              truncatedList.value.push(element);
            });
            done();
          } else if (comList.value.length === 0) {
            context.emit("loadnewdata");
            done();
          }
        }
      }, 100);
    };

    const openWithdrawConfirmDialog = (det) => {
      isConfirmWithdraw.value = true;
      passDet.value = det;
    };

    const openWithdrawConfirm = () => {
      const obj = {
        id: passDet.value.id,
        withdrawDate: passDet.value.withdrawDate
      };

      api
        .post("/session/withdraw/confirm", qs.stringify(obj))
        .then((response) => {
          // Handle the response
          if (response.code === 0) {
            isConfirmWithdraw.value = false;
            $q.notify({
              color: "positive",
              position: "top",
              message: "已经确认到账",
              icon: "check_circle_outline"
            });
            removeSessionKeys("/session/member/withdraw");
          }

          setTimeout(() => {
            window.location.reload();
          }, 1000);

          // console.log(response);
        })

        .catch((error) => {
          // Handle the error
          console.error(error);
        });
    };

    const openWithdrawCancelDialog = (det) => {
      isCancelWithdraw.value = true;
      passDet.value = det;
    };

    const openWithdrawCancel = () => {
      const obj = {
        id: passDet.value.id,
        withdrawDate: passDet.value.withdrawDate
      };

      api
        .post("/session/withdraw/cancel", qs.stringify(obj))
        .then((response) => {
          // Handle the response
          if (response.code === 0) {
            isConfirmWithdraw.value = false;
            $q.notify({
              color: "positive",
              position: "top",
              message: "已经取消提款",
              icon: "check_circle_outline"
            });
            removeSessionKeys("/session/member/withdraw");
          }

          setTimeout(() => {
            window.location.reload();
          }, 1000);

          // console.log(response);
        })

        .catch((error) => {
          // Handle the error
          console.error(error);
        });
    };

    const copyinput = ref(null);
    const text_copied = ref("");
    const copyText = (text) => {
      text_copied.value = text;
      console.log(text_copied.value);

      setTimeout(() => {
        const copyText = copyinput.value;
        console.log(copyText);

        copyText.select();
        document.execCommand("copy");
        console.log("Copied");

        $q.notify({
          color: "positive",
          position: "top",
          message: "存款编码复制成功！",
          icon: "check_circle_outline"
        });
      }, 100);
    };

    const reminderDialog = ref(false);
    const reminderForm = reactive({});
    const uploadFileRef = ref();
    const feedbackTrans = (trans) => {
      console.log(trans);
      console.log(trans.serialNumber);

      api.get("/session/getVerifyingFeedbackCount").then((res) => {
        // console.log(res);
        if (res.code === 0) {
          if (res.data < 3) {
            console.log("Ok here");
            reminderDialog.value = true;
            reminderForm.orderNo = trans.serialNumber;
            reminderForm.memberRemark = null;
            reminderForm.photos = null;
            if (props.recordType === "deposit") {
              reminderForm.type = 1;
              reminderForm.recordTime = trans.depositDate;
            } else if (props.recordType === "withdraw") {
              reminderForm.type = 2;
              reminderForm.recordTime = trans.withdrawDate;
            }
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: "已有3个正在催收催单。",
              icon: "report_problem"
            });
          }
        }
      });
    };

    const getImageLink = (linkId) => {
      reminderForm.photos = `${linkId}`;
    };

    const submitReminder = () => {
      // Check if image upload is empty
      if (!reminderForm.photos) {
        // Display an error message here
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "请上传图片",
          icon: "report_problem"
        });
        return;
      }

      api.post("/session/saveFinanceFeedback", qs.stringify(reminderForm)).then((res) => {
        // console.log(reminderForm)
        const ret = res.data;
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "催单提交成功！",
            icon: "check_circle_outline"
          });
          reminderDialog.value = false;
          reminderForm.value = {};
          // uploadFileRef.value.clear();
          removeSessionKeys("/session/member/deposit");
        }
      });
    };

    const removeSessionKeys = (prefix) => {
      var keys = SessionStorage.getAllKeys();
      _.each(keys, function (key, item) {
        // console.log(key);
        if (key.indexOf(prefix) > -1) {
          SessionStorage.remove(key);
        }
      });
    };

    return {
      humanDatetime(ts) {
        return moment(ts).format("YYYY-MM-DD HH:mm:ss");
      },
      checkRecord(status) {
        return translateRecord(status, props.recordType);
      },
      translateRecord,
      onLoad,
      truncatedList,
      comList,
      openWithdrawConfirmDialog,
      openWithdrawConfirm,
      isConfirmWithdraw,
      openWithdrawCancelDialog,
      openWithdrawCancel,
      isCancelWithdraw,
      passDet,
      copyText,
      text_copied,
      copyinput,
      feedbackTrans,
      submitReminder,
      reminderDialog,
      reminderForm,
      getImageLink
    };
  }
});
</script>
<style scoped lang="scss">
.table-data {
  font-size: 14px;
  display: flex;
  justify-content: flex-start;
  // gap: 20px;
  margin: 0 0 10px;

  .label {
    flex: 1;
    color: #ffffff99;
  }

  .desc {
    flex: 3;
    word-break: break-all;
    margin-left: auto;
    text-align: right;
  }
}

.buttons {
  text-align: right;
}

:deep(.q-card__section) {
  background: none;
}

.amount-container {
  padding-bottom: 12px;
  border-bottom: 1px solid #ffffff1a;
  margin-bottom: 6px;
}

.amount-header-title {
  color: #ffffff99;
  font-size: 14px;
}

.amount-desc {
  font-size: 18px;
  margin-top: 4px;
}

.btn-reminder {
  position: absolute;
  top: 20px;
  right: 12px;
}

.serialnum-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  // flex-wrap: wrap;
  // font-size: 12px;
  // height: 21px;
}

.btn-copyserialnum {
  margin-left: 4px;
  color: #00bfd7;
}
</style>
