<template>
  <div>
    <div class="transit-buttons">
      <router-link class="btn" v-for="(trans, i) in transitList" :key="i" :to="`mail/${trans.code}`">
        <img :src="require(`../../assets/account/mail/${trans.icon}-icon.png`)" />
        {{ trans.name }}
        <div class="right">
          <!--          <q-chip-->
          <!--            v-if="trans.icon === 'inbox' && store.unreadInboxMail != 0"-->
          <!--            color="brand"-->
          <!--            size="sm"-->
          <!--          >-->
          <!--            {{ store.unreadInboxMail }}-->
          <!--          </q-chip>-->
          <RiArrowRightSLine />
        </div>
      </router-link>
    </div>
  </div>
</template>
<script lang="js">
import { defineComponent, ref, onMounted  } from "vue";
import { userStore } from "../../stores/index";
import { RiArrowRightSLine } from "vue-remix-icons";

export default defineComponent({
  name: "IndexPage",
  components: {
    RiArrowRightSLine
  },
  setup() {

    const store = userStore();
    const transitList = ref([
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
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #bacef1;

  .btn {
    color: #000000;
    text-decoration: none;
    position: relative;
    background: #ffffff;
    padding: 15px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid #00000020;

    img {
      width: 18px;
    }

    .right {
      position: absolute;
      right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        fill: #bbb;
      }
    }
  }
}
</style>
