<template>
  <q-page>
    <div class="loader-container">
      <q-spinner color="yellow" size="10em" :thickness="10" />
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const store = userStore();
    const regDevice = store.getDeviceType();
    return {
      regDevice,
      store
    };
  }
});
</script>
<style scoped>
iframe {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
}

.loader-container {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
