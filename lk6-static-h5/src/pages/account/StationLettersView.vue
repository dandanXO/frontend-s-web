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
          <img class="svg" src="~assets/records/arrow-right-s-line.svg" />
        </div>
      </router-link>
    </div>
  </div>
</template>
<script lang="js">
import { defineComponent, ref, onMounted  } from "vue";
import { userStore } from "../../stores/index";

export default defineComponent({
  name: "IndexPage",
  setup() {

    const store = userStore();
    const transitList = ref([
      {
        code: "outbox",
        icon: "outbox",
        name: "我的反馈"
      },
      {
        code: "write",
        icon: "write",
        name: "意见反馈"
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

    img:not(.svg) {
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

      img.svg {
        filter: brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(5%) hue-rotate(136deg) brightness(108%)
          contrast(82%);
      }
    }
  }
}
</style>
