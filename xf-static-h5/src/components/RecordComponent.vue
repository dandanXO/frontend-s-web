<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brand"/>
      <div class="label">加载中</div>
    </q-inner-loading>
    <div v-if="!loading">
      <q-infinite-scroll @load="onLoad" :offset="250">
        <q-card v-for="(det, n) in truncatedList" :key="n" class="q-pa-sm" style="background: #212534; color: #bacef1;">
          <div class="table-data" v-for="(head, e) in headers" :key="e">
            <div class="label">
              {{ head.label }}
            </div>
            <template v-for="obj in Object.keys(det)" :key="obj">
              <div v-if="obj === head.key" class="desc">
                <div v-if="obj === 'type'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else-if="obj === 'status'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else-if="obj === 'betStatus'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else-if="obj === 'gameType'">
                  {{ checkRecord(det[obj]) }}
                </div>
                <div
                    v-else-if="
                    obj === 'commitDate' ||
                    obj === 'feedbackTime' ||
                    obj === 'recordTime' ||
                    obj === 'transferDate'
                  "
                >
                  {{ humanDatetime(det[obj]) }}
                </div>
                <div
                    v-else-if="
                    obj === 'platformCode' ||
                    obj === 'financeRemark' ||
                    obj === 'subType'
                  "
                >
                  {{ checkRecord(det[obj]) }}
                </div>
                <div v-else>
                  {{ det[obj] }}
                </div>
              </div>
            </template>
            <!-- <div v-if="Object.keys(head.key)" class="desc">
                {{ det.value }}

            </div> -->
          </div>
          <div v-if="
              (det.status == 'PENDING' || det.status == 'APPLY') &&
              (recordType === 'deposit' || recordType === 'withdraw')
            " class="buttons">
            <q-btn outline label="催单" @click="feedbackTrans(det)" size="sm" color="bright" class="q-mr-sm"/>
            <q-btn outline label="复制" @click="copyText(det.serialNumber)" size="sm" color="bright"/>
          </div>
        </q-card>

        <template v-slot:loading>
          <div v-if="comList.length > 0">
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px"/>
            </div>
          </div>
          <div v-else class="q-pa-md" style="text-align: center;">
            没有更多数据了
          </div>
        </template>

      </q-infinite-scroll>
    </div>
  </div>
</template>
<script>
import {defineComponent, onMounted, reactive, ref} from "vue";
import moment from "moment";
import FileUpload from "components/FileUpload.vue";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {translateRecord} from "../directives/translate.js";


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
        return true
      }
    },
    recordType: {
      type: String,
      default: function () {
        return ''
      }

    },
    headers: {
      type: Array,
      default: function () {
        return [];
      }
    },
  },
  setup(props, {emit}) {
    const truncatedList = ref([])
    const comList = ref({})
    const $q = useQuasar();
    const qs = require("qs");
    const isConfirmWithdraw = ref(false);
    const passDet = ref(null);


    const onLoad = (index, done) => {
      comList.value = props.list
      setTimeout(() => {
        if (comList.value.length) {
          var slicedArray = comList.value.splice(0, 3);
          slicedArray.forEach(element => {
            truncatedList.value.push(element);
          });
          done();
        }
      }, 200)
    }

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
            }

            setTimeout(() => {
              window.location.reload();
            }, 2000);

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
      setTimeout(() => {
        const copyText = copyinput.value;
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
      reminderForm.photos = `https://fxlmnp.wallykrooger.com/photo/${linkId}`;
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

      api
          .post("/session/saveFinanceFeedback", qs.stringify(reminderForm))
          .then((res) => {
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
              uploadFileRef.value.clear();
            }
          });
    };


    return {
      humanDatetime(ts) {
        return moment(ts).format("YYYY-MM-DD HH:mm:ss");
      },
      checkRecord(status) {
        return translateRecord(status);
      },
      onLoad,
      truncatedList,
      comList,
      openWithdrawConfirmDialog,
      openWithdrawConfirm,
      isConfirmWithdraw,
      passDet,
      copyText,
      text_copied,
      copyinput,
      feedbackTrans,
      submitReminder,
      reminderDialog,
      reminderForm,
      getImageLink
    }
  },
})
</script>
<style scoped lang="scss">
.table-data {
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  margin: 0 0 10px;

  .label {
    flex: 1;
  }

  .desc {
    flex: 3;
    word-break: break-all;
  }
}

.buttons {
  text-align: right;
}
</style>
