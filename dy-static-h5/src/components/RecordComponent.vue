<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brand" />
      <div class="label">加载中</div>
    </q-inner-loading>
    <div v-if="!loading">
      <q-infinite-scroll @load="onLoad" :offset="250">
        <!--          style="background: #212534; color: #bacef1;"-->
        <q-card v-for="(det, n) in truncatedList" :key="n" class="q-pa-sm">
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
                <div v-else-if="obj === 'commitDate'">
                  {{ humanDatetime(det[obj]) }}
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
          <div v-if="recordType === 'deposit'" class="buttons">
            <q-btn
              outline
              label="催单"
              size="sm"
              color="bright"
              class="q-mr-sm"
            />
            <q-btn outline label="复制" size="sm" color="bright" />
          </div>
          <div v-if="recordType === 'withdraw'" class="buttons">
            <template
              v-if="
                det.status === 'SUCCESS' &&
                det.currencyName === 'CNY' &&
                det.confirmStatus === 0
              "
            >
              <q-btn
                @click="openWithdrawConfirmDialog(det)"
                outline
                label="确认到账"
                size="sm"
                color="bright"
              />
            </template>
          </div>
        </q-card>

        <template v-slot:loading>
          <div v-if="comList.length > 0">
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </div>
          <div v-else class="q-pa-md" style="text-align: center">
            没有更多数据了
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>

  <q-dialog width="100%" v-model="isConfirmWithdraw">
    <q-card style="width: 100%; padding: 20px" class="bg-white text-black">
      <q-card-section class="q-mb-md">
        系统提示<br /><br />
        确认到账
      </q-card-section>
      <q-btn @click="openWithdrawConfirm()" label="确认" color="dyblue" />
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { translateRecord } from "../directives/translate.js";
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
    }
  },
  setup(props, { emit }) {
    const truncatedList = ref([]);
    const comList = ref({});
    const $q = useQuasar();
    const qs = require("qs");
    const isConfirmWithdraw = ref(false);
    const passDet = ref(null);
    const onLoad = (index, done) => {
      comList.value = props.list;
      setTimeout(() => {
        if (comList.value.length) {
          var slicedArray = comList.value.splice(0, 3);
          slicedArray.forEach((element) => {
            truncatedList.value.push(element);
          });
          done();
        }
      }, 200);
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
      passDet
    };
  }
});
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
