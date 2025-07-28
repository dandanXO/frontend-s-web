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
        <div class="announcement-head">
          <!-- <img src="../../assets/images/home/announcement/title-img.png" alt="" /> -->

          <img :src="require(`../../assets/images/home/announcement/title-img${isDark ? '-dark' : ''}.png`)" alt="" />
        </div>

        <div class="announcement-container">
          <div class="announcement-title" v-html="item.title"></div>
          <div class="announcement-content" v-html="item.content"></div>
        </div>

        <div class="announcement-footer">
          <div class="footer-button" @click="handleService">
            联系客服
            <img src="../../assets/images/home/announcement/cs-icon.svg" alt="" />
          </div>
          <div class="footer-button" @click="handleDetail(item)">
            查看详情
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
import { useDark } from "@vueuse/core/index";

const isDark = useDark();
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
  height: 100%;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.announcement-head {
  display: flex;
  justify-content: center;
  padding-top: 70px;
}

.announcement-container {
  background: #f2f8ff;
  border-radius: 10px;
  margin-top: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 200px;
}

.announcement-title {
  font-size: 16px;
  font-weight: 600;
  color: black;
  // margin-bottom: 10px;
}

.announcement-content {
  font-size: 16px;
  color: #666666;
  margin-bottom: 12px;
  flex: 1;
  overflow: auto;
  width: 100%;
}

.announcement-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  align-items: center;
  margin-top: 16px;

  .footer-button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 60px;
    height: 50px;
    font-size: 16px;
    gap: 8px;
    padding: 14px 16px;
    color: #7a80a1;
    width: 100%;
    box-shadow: 0px -2px 4.58px 2px #bbdcff inset;
    white-space: nowrap;

    &:last-child {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: #ffffff;
    }

    &:hover {
      filter: brightness(0.9);
    }
  }
}

.body--dark {
  .announcement-component {
    // background: #333;
  }

  .announcement-title {
    color: #fff;
  }

  .announcement-container {
    background: #3d4d74;
    color: #ffffff;
  }

  .announcement-content {
    color: #d3d3d3;
  }

  .footer-button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    height: 50px;
    font-size: 16px;
    gap: 8px;
    padding: 14px 16px;
    color: #ffffff;
    width: 100%;
    border: 1px solid #369eff;
    box-shadow: none;

    &:last-child {
      // background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      background: url(../../assets/images/home/announcement/btn-dark.png);
      background-repeat: no-repeat;
      background-size: cover;
      color: #ffffff;
      border: 0;
    }

    &:hover {
      filter: brightness(0.9);
    }

    img {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%)
        contrast(100%);
    }
  }
}
</style>
