<template>
  <q-carousel
    v-model="innerSlide"
    swipeable
    animated
    :navigation="false"
    padding
    :arrows="false"
    @update:model-value="emits('chageSlide', $event)"
  >
    <q-carousel-slide v-for="(item, index) in mailData" :key="item.id" :name="index" class="column no-wrap flex-center">
      <div class="announcement-component">
        <div class="announcement-title" v-html="item.title"></div>
        <div class="announcement-content" v-html="item.content"></div>
        <div class="announcement-footer">
          <div class="footer-button" @click="handleService">
            {{$t('lang.inbox_contactCS')}}
            <img src="../../assets/images/home/announcement/arrow-right.svg" alt="" />
          </div>
          <div class="footer-button" @click="handleDetail(item)">
            {{$t('lang.inbox_viewDetails')}}
            <img src="../../assets/images/home/announcement/arrow-right.svg" alt="" />
          </div>
        </div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script setup>
import { ref, defineEmits, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  slide: {
    type: Number,
    default: 1
  },
  mailData: {
    type: Array,
    default: () => []
  }
});
const emits = defineEmits(["chageSlide"]);
const innerSlide = ref(0);
watch(
  () => props.slide,
  (newV, oldV) => {
    innerSlide.value = newV;

    if (newV != oldV) {
    }
  },
  { immediate: true }
);
watch(
  () => innerSlide,
  (newV) => {
    console.log("inin");
    emits("chageSlide", newV);
  }
);

const handleService = () => {
  router.push("/liveChat");
};

const handleDetail = (mail) => {
  router.push({
    path: "/account/inbox",
    query: {
      id: mail.id,
      type: mail.type
    }
  });
};
</script>

<style lang="scss" scoped>
.announcement-component {
  padding: 10px 12px 66px;
  background: white;
  height: 100%;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.announcement-title {
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin-bottom: 10px;
}

.announcement-content {
  font-size: 16px;
  color: #666666;
  margin-bottom: 12px;
  flex: 1;
  overflow: auto;
}

.announcement-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
  position: absolute;
  right: 20px;
  bottom: 2px;

  .footer-button {
    cursor: pointer;
    background: #2792fd;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    height: 30px;
    font-size: 16px;
    gap: 2px;
    padding: 8px 12px;
    color: white;
    &:hover {
      filter: brightness(0.9);
    }
  }
}
</style>
