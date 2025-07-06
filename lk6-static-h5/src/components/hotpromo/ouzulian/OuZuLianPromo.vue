<template>
  
  <div class="row justify-center q-mt-md">
      <q-btn color="brightbtn" @click="handleSubmit" label="点击申请" />
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import { useQuasar } from "quasar";
import { eventapi } from "src/boot/axios";
import { userStore } from "../../../stores/index";
import { useRouter } from "vue-router";
const router = useRouter();
const store = userStore();
const props = defineProps({
  platformType: String
});

const $q = useQuasar();

const handleSubmit = () => {
  if (!store.token) {
    $q.dialog({
        class: "q-px-md q-pt-md",
        title: "系统提示",
        message: "请登录后再操作",
        ok: {
          push: true,
          color: 'dyblue',
          label: "去登录",
          tabindex: 1
        },
        cancel: {
          push: true,
          color: 'warning',
          label: "取消",
          tabindex: 0
        },
        persistent: true,
      }).onOk(() => {
        router.push('/login');
      })
      return
  }
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
