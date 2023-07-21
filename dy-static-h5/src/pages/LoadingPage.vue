<template>
  <div class="loading-container">
    <q-scroll-area
        ref="scrollPageRef"
        style=" height:calc(100%);"
        :thumb-style="{ width: 0 }"
    >
      <div class="loading-div">
        <q-spinner-hourglass
            color="blue-6"
            size="8em"
        />
      </div>

    </q-scroll-area>
  </div>
</template>

<script lang="js">
/* eslint-disable */
import {defineComponent, onMounted, ref} from "vue";
import {useQuasar, Platform} from "quasar";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const isLoading = ref(false);


    onMounted(() => {

    });

    return {
      isLoading
    };
  }
});
</script>
<style scoped lang="scss">

.loading-div {
  z-index: 99;
  position: fixed;
  background: rgba(35, 38, 60, 0.4);
  text-align: center;
  margin: 0 auto;
  width: 100%;

  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;

  svg {
    color: var(--q-primary);
    width: 48px;
  }
}

.loading-container {

  height: calc(100%);
}
</style>
