<template>
  <div class="table-record">
    <div>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="brand" />
        <div class="label">加载中</div>
      </q-inner-loading>
      <div v-if="!loading">
        <q-infinite-scroll :offset="150">
          <div v-if="truncatedList.length" class="q-pa-sm quick-btn-container">
            <button class="read-all-btn" @click="readAllMsg()">
              <q-icon name="mail_outline" />
              <div>全部已读</div>
            </button>
            <button class="del-all-btn" @click="deleteAllMsg()">
              <q-icon name="delete" />
              <div>全部删除</div>
            </button>
          </div>

          <q-card
            v-for="(det, n) in truncatedList"
            :key="n"
            class="q-pa-sm mail-card"
            :class="{ active: det.isOpen }"
            style=""
            @click="openMsg(det)"
          >
            <div style="display: flex; justify-content: space-between; align-items: center">
              <div class="mail-title">
                {{ det.title }}
              </div>
              <div>
                <q-chip color="brand" size="sm" label="已读" v-if="det.readTime" />
                <q-icon name="delete" @click.stop.prevent="deleteMsg(det.id, n)" />
              </div>
            </div>
            <div class="text-grey mailcontents" :style="`height: ${det.isOpen ? 'auto' : '0px'}`">
              {{ det.content }}
            </div>
          </q-card>

          <template v-slot:loading>
            <div v-if="mailData.length > 0">
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </div>
            <div v-else class="q-pa-md" style="text-align: center">
              {{ truncatedList.length === 0 ? "暂无数据" : "暂无更多数据了" }}
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();

console.log("jesus");
const loading = ref(true);
const mailData = ref([]);
const truncatedList = ref([]);
const loadFeedbackReplies = () => {
  api
    .get("/session/feedback/replies", {})
    .then((response) => {
      if (response.code === 0) {
        truncatedList.value = [];

        // massage
        mailData.value = response.data.records;
        if (mailData.value.length) {
          const clonseMailData = [...mailData.value];
          clonseMailData.forEach((element) => {
            element.isOpen = false;
            truncatedList.value.push(element);
          });
        }

        loading.value = false;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const msgId = ref();
const openMsg = (m) => {
  const { id } = m;

  m.isOpen = !m.isOpen;
  m.readTime = true; // fake read

  msgId.value = id;

  api
    .get(`/session/feedback/${id}/read`, {})
    .then((res) => {
      const { code, data } = res;
      if (code === 0) {
        m.content = data.content;
        // loadFeedbackReplies(); // recall api = ui not smooth
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const readAllMsg = () => {};

const deleteMsg = (ids, spliceIndex, callback) => {
  api
    .delete(`/session/feedback/delete?ids=${ids}`, {})
    .then((res) => {
      const { code } = res;
      if (code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "删除成功",
          icon: "check_circle_outline"
        });

        if (spliceIndex !== null) truncatedList.value.splice(spliceIndex, 1); // fake delete
        callback && callback();
        // loadFeedbackReplies(); // recall api = ui not smooth
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteAllMsg = () => {
  let ids = "";
  mailData.value.forEach((e) => {
    const { id } = e;
    if (!ids) ids = id;
    else ids += `,${id}`;
  });

  deleteMsg(ids, null, () => {
    loadFeedbackReplies();
  });
};

onMounted(() => {
  loadFeedbackReplies();
});
</script>

<style scoped lang="scss">
.table-record {
  width: 100%;
  gap: 10px;

  .label {
    color: #bacef1;
  }

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

    &.active {
      background: $primary;
    }

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
}
</style>
