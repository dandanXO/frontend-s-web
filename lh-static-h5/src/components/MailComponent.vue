<template>
  <q-page>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brand" />
      <div class="label">加载中</div>
    </q-inner-loading>
    <div v-if="!loading">
      <q-infinite-scroll @load="onLoad" :offset="150">
        <q-card
          v-for="(det, n) in truncatedList"
          :key="n"
          class="mail-inbox-list"
          :class="{ active: isSelectedMail === det.id }"
          style=""
          @click="toggleMail(det)"
        >
          <div class="title-div">
            <div>
              标题：
              {{ det.title }}
            </div>

            <div class="right-title">
              <RiArrowUpSLine v-if="isSelectedMail === det.id" />
              <RiArrowDownSLine v-if="isSelectedMail !== det.id" />
            </div>
            <!--            <q-chip color="brand" size="sm" label="已读" v-if="det.isRead && det.isRead !== 0" />-->
          </div>
          <div class="mailcontents" v-if="isSelectedMail === det.id">
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
  </q-page>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import moment from "moment";
import { RiArrowDownSLine, RiArrowUpSLine } from "vue-remix-icons";

export default defineComponent({
  components: {
    RiArrowDownSLine,
    RiArrowUpSLine
  },
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
    const isSelectedMail = ref(-1);
    const toggleMail = (mail) => {
      if (isSelectedMail.value !== mail.id) {
        isSelectedMail.value = mail.id;
      } else {
        isSelectedMail.value = -1;
      }
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
      toggleMail,
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

.mail-inbox-list {
  margin-bottom: 16px;

  .title-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 10px;
    font-size: 1.1rem;
    color: $font-1;
  }

  .mailcontents {
    padding: 12px 12px 16px;
    background: #e0f0ff;
    color: $font-1;
    font-size: 1rem;
    height: auto;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.buttons {
  text-align: right;
}
</style>
