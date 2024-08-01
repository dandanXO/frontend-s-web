<template>
  <q-page>
    <div class="transit-buttons">
      <router-link class="btn" v-for="(trans, i) in transitList" :key="i" :to="`/account/${trans.code}`">
        <!-- <img :src="require(`../../assets/images/inbox/${trans.icon}-icon.png`)" /> -->
        {{ trans.name }}
        <div class="right">
          <img src="../../assets/images/inbox/account-right-icon.svg" />
        </div>
        <div v-if="trans.code === 'inbox' && store.unreadInboxMail" class="unread-count">
          {{ store.unreadInboxMail }}
        </div>
      </router-link>
    </div>
  </q-page>
</template>
<script lang="js">
import {defineComponent, onMounted, ref} from "vue";
import {userStore} from "../../stores/index";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MailBoxPage",
  components: {
  },
  setup() {
    const { t } = useI18n();
    const store = userStore();
    const transitList = ref([
      // {
      //   code: "inbox",
      //   icon: "inbox",
      //   name: "收件箱"
      // },
      {
        code: "inbox",
        icon: "inbox",
        name: t("lang.mail_mailbox")
      },
      {
        code: "outbox",
        icon: "outbox",
        name: t("lang.mail_outbox")
      },
      // {
      //   code: "feedback",
      //   icon: "feedback",
      //   name: t("lang.mail_feedback")
      // },
      {
        code: "write",
        icon: "write",
        name: t("lang.mail_compose")
      },

    ]);

    onMounted(() => {
      // store.getUnreadTotal();
    })

    return {
      store,
      transitList
    };

  }
});
</script>
<style scoped lang="scss">
.transit-buttons {
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  width: $box-width;
  margin: 10px auto 30px;
  gap: 0px;
  background: $white;
  border-radius: 10px;
  box-shadow: $shadow-bg;

  .btn {
    color: $font-1;
    text-decoration: none;
    position: relative;
    padding: 15px 24px;
    font-size: 1.2rem;
    border-bottom: 1px solid #ecedf0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;

    &:active {
      filter: brightness(0.85);
      background-color: $secondary;
    }

    img {
      width: 25px;
    }

    .right {
      position: absolute;
      right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 10px;
      }
    }

    .unread-count {
      width: 45px;
      height: 25px;
      border-radius: 25px;
      text-align: center;
      color: #fff;
      background: red;
      font-size: 16px;
      line-height: 25px;
    }
  }
}
</style>
