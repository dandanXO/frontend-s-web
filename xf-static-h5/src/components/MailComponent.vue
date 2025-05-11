<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-ios color="white" size="8em" />
      <div class="label">加载中</div>
    </q-inner-loading>
    <div v-if="!loading">
      <q-infinite-scroll @load="onLoad" :offset="150" class="q-gutter-y-md q-pa-md">
        <div
          class="bg-darkbox"
          v-for="(det, n) in truncatedList"
          :key="n"
          :class="{ active: isSelectedMail === det.id }"
          @click="selectMail(det)"
        >
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div>
              <q-icon name="mail" />
              {{ det.title }}
            </div>
            <q-chip color="brand" size="sm" label="已读" v-if="det.isRead && det.isRead !== 0" />
          </div>
          <div
            class="text-grey mailcontents"
            :style="`height: ${isSelectedMail === det.id ? 'auto' : '0px'}`"
            v-if="isSelectedMail === det.id"
          >
            <div class="p-content">
           正文: {{ det.content }}
            </div>
            <div class="p-content" v-if="det.replyMessageContent">
           回复: {{ det.replyMessageContent }}
            </div>
          </div>
          <div v-if="mailType === 'outbox'" class="buttons">
            <q-btn outline label="催单" size="sm" color="bright" class="q-mr-sm" />
            <q-btn outline label="复制" size="sm" color="bright" />
          </div>
        </div>

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
  emits: ["readMsg"],
  setup(props, context) {
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
      console.log(mail.id);
      isSelectedMail.value = mail.id;
      // context.emit('readMsg', mail.id);
    };
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
      isSelectedMail
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

.mailcontents {
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 8px;
}
</style>
