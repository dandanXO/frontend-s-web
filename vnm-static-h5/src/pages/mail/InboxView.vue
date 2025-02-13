<template>
  <div class="table-record">
    <MailComponent :loading="visible" :list="mailData" @readMsg="readMsg" type="index" />
  </div>
</template>
<script lang="js">
import {defineComponent, onMounted, ref} from "vue";
import {api} from "boot/axios";
import MailComponent from "../../components/MailComponent.vue";


export default defineComponent({
  components: {
    MailComponent
  },
  setup() {
    const visible = ref(true);
    const mailData = ref([]);
    const mailboxData = ref({
      type: null,
      orderBy: "sendTime"
    })
    const loadInbox = () => {
      api.get("/session/pm/inbox", {
        params: {
          type: mailboxData.value.type,
          orderBy: mailboxData.value.orderBy
        }
      }).then((response) => {
        if (response.code === 0) {
          mailData.value = response.data.records
          visible.value = false
        }
      }).catch((error) => {
        console.log("error", error);
      });
    }

    const readMsg = (msgId) => {
      // console.log("re3ead");
      // let data = {
      //   messageId: msgId
      // }
      // api.post('/session/message/accountMessage/read', data).then((res) => {
      //
      // })
    }
    onMounted(() => {
      loadInbox()
    })

    return {
      visible,
      mailData,
      readMsg
    }
  }
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
