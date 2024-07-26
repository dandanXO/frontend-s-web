<template>
  <div class="table-record">
    <MailComponent :loading="visible" :list="inquiriesList.records" type="outbox" />
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { api } from "boot/axios";
import MailComponent from "../../components/MailComponent.vue";
components: {
  MailComponent;
}
const visible = ref(true);
const mailData = ref([]);
const mailboxData = ref({
  type: null,
  orderBy: "createTime"
});
const selected = ref();
const isLoading = ref(false);

const isFetchingContent = ref(false);

const inquiriesList = ref([]);
const replyInquiries = ref([]);
const repliesOfInquiries = computed(() =>
  replyInquiries.value.records.filter(({ id }) => id === selected.value.replyId)
);

const loadOutbox = () => {
  isLoading.value = true;

  Promise.all([api.get("/session/feedback/sysReply"), api.get("/session/feedback/replies")]).then(
    ([inquiriesRes, replyInquiriesRes]) => {
      const { code: inquiriesResCode, data: inquiriesResData } = inquiriesRes.data;
      const { code: replyInquiriesResCode, data: replyInquiriesResData } = replyInquiriesRes.data;

      if (inquiriesResCode === 0) {
        const inquiriesResDataRecordsWithSelected = inquiriesResData.records.map((data) => ({
          ...data,
          selected: false
        }));
        inquiriesList.value = { ...inquiriesResData, records: inquiriesResDataRecordsWithSelected };
      }

      if (replyInquiriesResCode === 0) {
        replyInquiries.value = replyInquiriesResData;
      }

      visible.value = false;
    }
  );
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
