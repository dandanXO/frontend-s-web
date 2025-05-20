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
import { useRouter } from "vue-router";
import ArrowRightImg from "assets/images/home/arrow-right.png";
import ArrowRightDarkImg from "assets/images/home/arrow-right-dark.png";
import { userStore } from "src/stores";
const props = defineProps({
  to: String,
  loginNeeded: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const store = userStore();

const handleRouter = () => {
  if (props.loginNeeded && !store.token) {
    router.push("/login");
  } else {
    router.push(props.to);
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
