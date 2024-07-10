<template>
  
  <div class="row justify-center q-mt-md">
      <q-btn color="brightbtn" @click="handleSubmit" label="点击申请" />
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import { useQuasar } from "quasar";
import { eventapi } from "src/boot/axios";

const props = defineProps({
  platformType: String
});

const $q = useQuasar();

const handleSubmit = () => {
  eventapi
    .post("/game-match/submit/UEFA")
    .then((response) => {
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "已成功申请",
          icon: "check_circle_outline"
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

</script>
