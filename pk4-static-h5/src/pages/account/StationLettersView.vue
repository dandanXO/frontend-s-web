<template>
  <div>
    <div class="transit-buttons">
      <router-link class="btn" v-for="(trans, i) in transitList" :key="i" :to="`mail/${trans.code}`">
        <!-- <img :src="require(`../../assets/images/account/${trans.icon}_letters.png`)"> -->
        {{ trans.name }}
        <div class="right">
          <!--          <q-chip v-if="trans.icon === 'inbox' && store.unreadInboxMail!= 0" color="brand" size="sm">-->
          <!--            {{ store.unreadInboxMail }}-->
          <!--          </q-chip>-->
        </div>
      </router-link>
    </div>
  </div>
</template>
<script lang="js">
import { defineComponent, onMounted, ref } from "vue";
import { userStore } from "../../stores/index";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const store = userStore();
    const transitList = ref([
      {
        code: "inbox",
        icon: "inbox",
        name: "收件箱"
      },
      {
        code: "outbox",
        icon: "outbox",
        name: "发件箱"
      },
      {
        code: "write",
        icon: "write",
        name: "写信"
      }
    ]);

    onMounted(() => {
      // store.getUnreadTotal();
    });

    return {
      store,
      transitList
    };
  }
});
</script>
<style scoped lang="scss">
.transit-buttons {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #B2BDBF;

  .btn {
    color: #B2BDBF;
    text-decoration: none;
    position: relative;
    background: #212534;
    padding: 15px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;

    img {
      width: 25px;
    }

    .right {
      position: absolute;
      right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        fill: #B2BDBF;
      }
    }
  }
}
</style>
