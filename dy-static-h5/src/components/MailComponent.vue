<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brand" />
      <div class="label">加载中</div>
    </q-inner-loading>
    <div v-if="!loading">
      <q-infinite-scroll @load="onLoad" :offset="150">
        <div v-if="lists[type].length" class="q-pa-sm quick-btn-container">
          <button class="read-all-btn" @click="readAllMessage(type)">
            <q-icon name="mail_outline" />
            <div>全部已读</div>
          </button>
          <button class="del-all-btn" @click="deleteAllMessage(type)">
            <q-icon name="delete" />
            <div>全部删除</div>
          </button>
        </div>

        <q-card
          v-for="(det, n) in lists[type]"
          :key="n"
          class="q-pa-sm mail-card"
          :class="{ active: isSelectedMail === det.title }"
          style=""
          @click="selectMail(det)"
        >
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div class="mail-title">
              {{ det.title }}
            </div>
            <q-chip color="brand" size="sm" label="已读" v-if="det.isRead && det.isRead !== 0" />
          </div>
          <div class="text-grey mailcontents" :style="`height: ${isSelectedMail === det.title ? 'auto' : '0px'}`">
            {{ det.content }}
          </div>
          <div v-if="mailType === 'outbox'" class="buttons">
            <q-btn outline label="催单" size="sm" color="bright" class="q-mr-sm" />
            <q-btn outline label="复制" size="sm" color="bright" />
          </div>
        </q-card>

        <template v-slot:loading>
          <div v-if="comList.length > 0">
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </div>
          <div v-else class="q-pa-md" style="text-align: center">
            {{ lists[type].length === 0 ? "暂无数据" : "暂无更多数据了" }}
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>

  <q-dialog width="100%" v-model="isDeleteAllModal">
    <q-card style="width: 100%; padding: 20px" class="text-black">
      <q-card-section class="q-mb-md text-center" style="flex-direction: column">
        <strong>温馨提示</strong>
        <br />
        <br />
        确认删除信息？
      </q-card-section>
      <q-card-actions align="right">
        <q-btn @click="confirmDeleteAll(type)" label="确认" color="dyblue" />
        <q-btn @click="isDeleteAllModal = false" label="取消" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import moment from "moment";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

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
    mailType: {
      type: String,
      default: function () {
        return "";
      }
    },
    type: {
      type: String,
      default: function () {
        return "NOTIFICATION";
      }
    }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const isDeleteAllModal = ref(false);
    const lists = reactive({
      NOTIFICATION: [],
      ACTIVITY: [],
      ANNOUNCEMENT: [],
      PAYMENT: [],
      ALL: []
    });
    const comList = ref([]);
    const onLoad = (index, done) => {
      comList.value = props.list;
      setTimeout(() => {
        if (comList.value.length) {
          var slicedArray = comList.value.splice(0, 10);
          lists[props.type] = mergeArrays(lists[props.type], slicedArray);
          done();
        }
      }, 200);
    };
    const isSelectedMail = ref("");
    const selectMail = (mail) => {
      isSelectedMail.value = mail.title;
    };

    const readAllMessage = (type) => {
      api
        .post("/session/inbox/readAll", {
          type: type
        })
        .then((res) => {
          if (res.code === 0) {
            $q.notify({
              message: "全部消息已读",
              type: "positive",
              position: "top",
              icon: "check_circle_outline"
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const confirmDeleteAll = (type) => {
      api
        .post("/session/inbox/deleteAll", {
          type: type
        })
        .then((res) => {
          isDeleteAllModal.value = false;
          if (res.code === 0) {
            $q.notify({
              message: "已删除全部消息",
              type: "positive",
              position: "top",
              icon: "check_circle_outline"
            });
            lists[type] = [];
          }
        })
        .catch((error) => {
          isDeleteAllModal.value = false;
          console.log(error);
        });
    };

    const deleteAllMessage = (type) => {
      isDeleteAllModal.value = true;
    };

    onMounted(() => {
      onLoad;
    });
    return {
      humanDatetime(ts) {
        return moment(ts).format("YYYY-MM-DD HH:mm:ss");
      },
      onLoad,
      lists,
      comList,
      selectMail,
      isSelectedMail,
      readAllMessage,
      deleteAllMessage,
      isDeleteAllModal,
      confirmDeleteAll
    };
  }
});

function mergeArrays(array1, array2) {
  // 创建一个空数组来存储结果
  const mergedArray = [];

  // 将第一个数组的元素添加到合并数组中
  for (const item of array1) {
    // 检查合并数组中是否已存在相同ID的元素
    const existingItem = mergedArray.find((i) => i.id === item.id);

    if (!existingItem) {
      // 如果合并数组中不存在相同ID的元素，则添加
      mergedArray.push(item);
    }
  }

  // 将第二个数组的元素添加到合并数组中
  for (const item of array2) {
    // 检查合并数组中是否已存在相同ID的元素
    const existingItem = mergedArray.find((i) => i.id === item.id);

    if (!existingItem) {
      // 如果合并数组中不存在相同ID的元素，则添加
      mergedArray.push(item);
    }
  }

  return mergedArray;
}
</script>

<style scoped lang="scss">
.quick-btn-container {
  display: flex;
  gap: 10px;

  .read-all-btn,
  .del-all-btn {
    color: white;
    border: 0;
    padding: 5px 10px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .read-all-btn {
    background: $primary;
  }

  .del-all-btn {
    background: $secondary;
  }
}

.q-infinite-scroll {
  padding-top: 14px;
}

.table-data {
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  margin: 12px 0 10px;

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

.mail-card {
  margin-top: 0px;
  margin-bottom: 0px;
  border-top: 1px solid #d7d7d7;
  border-bottom: 1px solid #d7d7d7;
  box-shadow: none;
  border-radius: 0px;

  .mail-title {
    font-size: 16px;
    color: #000;
    font-weight: 500;
    margin-bottom: 6px;
  }

  .mailcontents {
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 16px;
    color: #333;
  }
}
</style>
