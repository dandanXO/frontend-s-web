<template>
  <div class="table-record">
    <!--    <MailComponent :loading="visible" :list="inquiriesList.records" type="outbox" />-->

    <q-page>
      <div v-if="!visible">
        <!--            <q-infinite-scroll @load="onLoad" :offset="150">-->
        <q-card
          v-for="(det, n) in mailData"
          :key="n"
          class="mail-inbox-list"
          :class="{ active: isSelectedMail === det.id }"
          style=""
          @click="toggleMail(det)"
        >
          <div class="title-div" :class="`${det.readTime && det.sendTime ? '' : 'unread'}`">
            <div>
              <q-checkbox
                v-if="allowSelectMultiple"
                rounded
                :model-value="selectedMailIds[det.id] ?? false"
                @update:model-value="(newValue) => (selectedMailIds[det.id] = newValue ?? false)"
                size="sm"
                style="font-size: 14px"
                color="#0089ED"
              />
              <q-chip size="sm" :label="$t('lang.mail_read')" v-if="det.readTime && det.sendTime" />
              {{ det.title }}
            </div>

            <div class="right-title">
              <RiArrowUpSLine v-if="isSelectedMail === det.id" />
              <RiArrowDownSLine v-if="isSelectedMail !== det.id" />
            </div>
          </div>
          <div class="mailcontents" v-if="isSelectedMail === det.id">
            {{ det.content }}
          </div>
          <div v-if="mailType === 'outbox'" class="buttons">
            <q-btn outline label="催单" size="sm" color="bright" class="q-mr-sm" />
            <q-btn outline label="复制" size="sm" color="bright" />
          </div>
        </q-card>

        <!--              <template v-slot:loading>-->
        <!--                <div v-if="comList.length > 0">-->
        <!--                  <div class="row justify-center q-my-md">-->
        <!--                    <q-spinner-dots color="primary" size="40px" />-->
        <!--                  </div>-->
        <!--                </div>-->
        <!--                <div v-else class="q-pa-md" style="text-align: center">-->
        <!--                  {{ truncatedList.length === 0 ? $t("lang.mail_nodata") : $t("lang.mail_nodatayet") }}-->
        <!--                </div>-->
        <!--              </template>-->
        <!--            </q-infinite-scroll>-->
      </div>

      <div class="loading-container" v-else>
        <q-inner-loading :showing="visible">
          <q-spinner-gears size="50px" color="brand" />
          <div class="label">{{ $t("lang.mail_loading") }}</div>
        </q-inner-loading>
      </div>
    </q-page>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { api } from "boot/axios";

const visible = ref(true);
const mailData = ref([]);
const mailboxData = ref({
  type: null,
  orderBy: "createTime"
});
const selected = ref();
const isLoading = ref(false);

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
    openMsg(mail);
  } else {
    isSelectedMail.value = -1;
  }
};

const isFetchingContent = ref(false);

const inquiriesList = ref([]);
const replyInquiries = ref([]);
const repliesOfInquiries = computed(() =>
  replyInquiries.value.records.filter(({ id }) => id === selected.value.replyId)
);

const loadOutbox = () => {
  isLoading.value = true;

  // api
  //   .get("/session/feedback/replies", {
  //     params: {
  //       type: mailboxData.value.type,
  //       orderBy: mailboxData.value.orderBy
  //     }
  //   })
  //   .then((response) => {
  //     if (response.code === 0) {
  //       mailData.value = response.data.records;
  //       visible.value = false;
  //     }
  //   })
  //   .catch((error) => {
  //     console.log("error", error);
  //   });

  api
    .get("/session/feedback/sysReply", {
      params: {
        type: mailboxData.value.type,
        orderBy: mailboxData.value.orderBy
      }
    })
    .then((response) => {
      if (response.code === 0) {
        mailData.value = response.data.records;
        visible.value = false;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });

  // Promise.all([api.get("/session/feedback/sysReply"), api.get("/session/feedback/replies")]).then(
  //   ([inquiriesRes, replyInquiriesRes]) => {
  //     const { code: inquiriesResCode, data: inquiriesResData } = inquiriesRes.data;
  //     const { code: replyInquiriesResCode, data: replyInquiriesResData } = replyInquiriesRes.data;
  //
  //     if (inquiriesResCode === 0) {
  //       const inquiriesResDataRecordsWithSelected = inquiriesResData.records.map((data) => ({
  //         ...data,
  //         selected: false
  //       }));
  //       inquiriesList.value = { ...inquiriesResData, records: inquiriesResDataRecordsWithSelected };
  //     }
  //
  //     if (replyInquiriesResCode === 0) {
  //       replyInquiries.value = replyInquiriesResData;
  //     }
  //
  //     visible.value = false;
  //   }
  // );
};
onMounted(() => {
  loadOutbox();
});
</script>
<style scoped lang="scss">
.table-record {
  width: 100%;
  gap: 10px;
  .label {
    color: #bacef1;
  }
}
</style>
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
    word-break: break-all;

    &.unread {
      font-weight: bold;
    }
  }

  .right-title {
    display: flex;
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

.loading-container {
  min-height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  margin: 0px 10px;
  flex-wrap: wrap;
}

.tab-flex {
  display: flex;
  align-items: center;
}
.red-dot-icon {
  height: 10px;
  width: 10px;
  background: #db0011;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
