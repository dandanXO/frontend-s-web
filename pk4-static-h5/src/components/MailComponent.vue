<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brand" />
      <div class="label">{{ $t("btn.loading") }}</div>
    </q-inner-loading>
    <!-- <pre>truncatedList{{ truncatedList }}</pre> -->
    <div v-if="!loading">
      <q-infinite-scroll @load="onLoad" :offset="150">
        <q-card
          v-for="(det, n) in truncatedList"
          :key="n"
          class="q-pa-sm mailBox"
          :class="{ active: isSelectedMail === det.title }"
          @click="onDetailsClick(det)"
        >
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div>
              <q-icon name="mail" />
              <span v-html="det.title"></span>
            </div>
            <q-chip color="brand" size="sm" label="Read" v-if="det.isRead && det.isRead !== 0" />
          </div>
          <div class="text-grey mailcontents" :style="`height: ${isSelectedMail === det.title ? 'auto' : '0px'}`">
            <span v-html="det.content"></span>
          </div>

          <div class="text-grey date q-mt-sm">
            {{ det.sendTime }}
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
            {{ truncatedList.length === 0 ? $t("records.noRecord") : $t("records.noMoreRecord") }}
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import moment from "moment";
import { t } from "src/boot/lang";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

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
      isSelectedMail.value = mail.title;
      // context.emit('readMsg', mail.id);
    };
    const store = userStore();
    const router = useRouter();
    const onDetailsClick = (mailData) => {
      store.setMailData(mailData);

      // NOTE: /session/inbox/read api call inside message-detail page onMounted
      router.push("/account/feedback-detail");
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
      isSelectedMail,
      onDetailsClick
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
}

.mailBox {
  padding: 16px;
  margin: 0 16px 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(46, 48, 52, 0.3098039216);
  position: relative;
  box-shadow: none;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
</style>
