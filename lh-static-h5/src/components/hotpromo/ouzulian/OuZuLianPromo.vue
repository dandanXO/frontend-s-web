<template>

  <div class="row justify-center q-mt-md">
      <q-btn color="brightbtn" @click="handleSubmit" label="点击申请" />
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import { useQuasar } from "quasar";
import { eventapi } from "src/boot/axios";
import { useNotify } from "src/hooks/notify";

const props = defineProps({
  platformType: String
});

const notify = useNotify();
const $q = useQuasar();

const handleSubmit = () => {
  eventapi
    .post("/game-match/submit/UEFA")
    .then((response) => {
      if (response.code === 0) {
        notify({
          type: "success",
          message: "已成功申请",
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

</script>
