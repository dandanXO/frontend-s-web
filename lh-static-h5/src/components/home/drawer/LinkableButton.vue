<template>
  <a class="link-button-wrapper" @click="handleRouter">
    <div class="link-button-content-wrapper">
      <slot />
    </div>
    <div class="right">
      <img :src="$q.dark.isActive ? ArrowRightDarkImg : ArrowRightImg" />
    </div>
  </a>
</template>
<script setup>
import { useRouter } from 'vue-router'
import ArrowRightImg from "assets/images/home/arrow-right.png";
import ArrowRightDarkImg from "assets/images/home/arrow-right-dark.png";
const props = defineProps({
  to: String,
  outerlink: String
});

const router = useRouter()

const handleRouter = () => {
  console.log(props.outerlink)
  if (props.outerlink) {
    window.open(props.outerlink, '_blank')
  } else {
    router.push({ path: props.to })
  }
};
</script>
<style scoped lang="scss">
.link-button-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  color: $font-4;
  .link-button-content-wrapper {
    display: flex;
    flex: 1;
    align-items: center;
  }
  .right {
    img {
      width: 10px;
      height: auto;
    }
  }
}

.body--dark {
  .link-button-wrapper {
    color: $font-3-dark;
  }
}
</style>
