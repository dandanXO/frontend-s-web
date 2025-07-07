<template>
  <q-page>
    <div class="transit-buttons">
      <router-link class="btn" v-for="(trans, i) in transitList" :key="i" :to="`/account/${trans.code}`">
        <img :src="loadIcon(trans.icon)" />
        {{ trans.name }}
        <div class="right">
          <img src="../../assets/images/inbox/account-right-icon.svg" />
        </div>
      </router-link>
    </div>
  </q-page>
</template>
<script lang="js">
import {defineComponent, onMounted, ref} from "vue";
import {userStore} from "../../stores/index";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MailBoxPage",
  components: {
  },
  setup() {
    const $q = useQuasar()

    const store = userStore();
    const transitList = ref([
      // {
      //   code: "inbox",
      //   icon: "inbox",
      //   name: "收件箱"
      // },
      {
        code: "write",
        icon: "write",
        name: "意见反馈"
      },
      {
        code: "outbox",
        icon: "outbox",
        name: "我的反馈"
      },
      {
        code: "feedback",
        icon: "feedback",
        name: "有奖问答"
      },

    ]);

    const loadIcon = (name) => {
      if($q.dark.isActive) {
        try {
          return require(`../../assets/images/inbox/${name}-icon-dark.png`)
        } catch {
          return require(`../../assets/images/inbox/${name}-icon.png`)
        }
      } else {
        return require(`../../assets/images/inbox/${name}-icon.png`)
      }
    }

    onMounted(() => {
      // store.getUnreadTotal();
    })

    return {
      store,
      transitList,
      loadIcon
    };

  }
});
</script>
<style scoped lang="scss">
.transit-buttons {
  // padding: 10px 0px;
  display: flex;
  flex-direction: column;
  width: $box-width;
  margin: 10px auto 30px;
  gap: 0px;
  background: $white;
  border-radius: 10px;
  box-shadow: $shadow-bg;

  .btn:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .btn:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
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
  }
}

.body--dark {
  .transit-buttons {
    @include content-block-dark;
    .btn {
      border-color: #666666;
      color: #e1e1e1;
      &:last-child {
        border-bottom: none;
      }
      &:active {
        background-color: $background-dark-header;
      }
    }
  }
}
</style>
