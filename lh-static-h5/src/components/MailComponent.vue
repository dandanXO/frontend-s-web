<template>
  <q-page>    
    <q-tabs active-color="dark" indicator-color="bright" align="justify" v-model="mailboxMessageTab" @update:model-value="changeMailboxType">
      <q-tab :key="index" :name="item.type" :label="item.name" v-for="(item, index) in mailboxMessageTypeData"/>
    </q-tabs>

    <q-tab-panels v-model="mailboxMessageTab" animated>
      <q-tab-panel :key="index" :name="item.type" v-for="(item, index) in mailboxMessageTypeData">
        <q-btn class="common-md-btn" size="md" @click="readAllMessage(item.type)">全部已读</q-btn>
        <q-btn class="common-md-btn" size="md"  @click="deleteAllMessage(item.type)">全部删除</q-btn>
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="brand" />
          <div class="label">加载中</div>
        </q-inner-loading>

        <div v-if="!loading">
          <q-infinite-scroll @load="onLoad" :offset="150">
            <q-card
              v-for="(det, n) in truncatedList.filter((listItem) => {
                if(mailboxMessageTab === 'ALL') {
                  return true;
                }

                return listItem.type === mailboxMessageTab
              })"
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
      </q-tab-panel>
    </q-tab-panels>
    
    <q-dialog width="100%" v-model="isDeleteAllModal">
      <q-card style="width: 100%; padding: 20px" class="text-black">
        <q-card-section class="q-mb-md text-center" style="flex-direction: column">
          <strong>温馨提示</strong>
          <br />
          <br />
          确认删除信息？
        </q-card-section>
        <q-card-actions align="right">
          <q-btn class="common-md-btn"  size="md" @click="confirmDeleteAll(type)" label="确认" />
          <q-btn class="common-md-white-btn"  size="md" @click="isDeleteAllModal = false" label="取消" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import moment from "moment";
import { RiArrowDownSLine, RiArrowUpSLine } from "vue-remix-icons";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

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
    const mailboxMessageTypeData = ref([
      { num: 1, type: "NOTIFICATION", name: "通知" },
      { num: 2, type: "ACTIVITY", name: "活动" },
      { num: 3, type: "ANNOUNCEMENT", name: "公告" },
      { num: 4, type: "PAYMENT", name: "充提" },
      { num: 5, type: "ALL", name: "全部" }
    ]);
    const mailboxMessageTab = ref(mailboxMessageTypeData.value[0].type);
    const $q = useQuasar();
    const isDeleteAllModal = ref(false);
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
            onLoad()
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const deleteAllMessage = (type) => {
      isDeleteAllModal.value = true;
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
            onLoad();
          }
        })
        .catch((error) => {
          isDeleteAllModal.value = false;
          console.log(error);
        });
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
      isSelectedMail,
      mailboxMessageTypeData,
      mailboxMessageTab,
      readAllMessage,
      deleteAllMessage,
      confirmDeleteAll,
      isDeleteAllModal
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
