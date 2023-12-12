<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brand" />
      <div class="label">加载中</div>
    </q-inner-loading>
    <div v-if="!loading">
      <q-infinite-scroll @load="onLoad" :offset="150">
        <div v-if="truncatedList.length" class="q-pa-sm quick-btn-container">
          <button class="read-all-btn" @click="readAllMessage()">
            <q-icon name="mail_outline" />
            <div>全部已读</div>
          </button>
          <button class="del-all-btn" @click="deleteAllMessage()">
            <q-icon name="delete" />
            <div>全部删除</div>
          </button>
        </div>

        <q-card
          v-for="(det, n) in truncatedList"
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
            {{ truncatedList.length === 0 ? "暂无数据" : "暂无更多数据了" }}
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import moment from "moment";

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
    }
  },
  setup(props, { emit }) {
    const truncatedList = ref([]);
    const comList = ref({});
    const onLoad = (index, done) => {
      comList.value = props.list;
      setTimeout(() => {
        if (comList.value.length) {
          var slicedArray = comList.value.splice(0, 6);
          slicedArray.forEach((element) => {
            truncatedList.value.push(element);
          });
          done();
        }
      }, 200);
    };
    const isSelectedMail = ref("");
    const selectMail = (mail) => {
      isSelectedMail.value = mail.title;
    };

    const readAllMessage = () => {};

    const deleteAllMessage = () => {};

    onMounted(() => {
      onLoad;
    });
    return {
      humanDatetime(ts) {
        return moment(ts).format("YYYY-MM-DD HH:mm:ss");
      },
      onLoad,
      truncatedList,
      comList,
      selectMail,
      isSelectedMail,
      readAllMessage,
      deleteAllMessage
    };
  }
});
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
