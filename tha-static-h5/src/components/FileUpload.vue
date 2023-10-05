<template>
  <q-file
    name="upload_img"
    v-model="file"
    class="q-pt-md"
    filled
    label="โหลดรูปภาพ"
    color="white"
  >
    <template v-slot:prepend>
      <q-icon name="cloud_upload" />
    </template>
    <!-- Display error message -->
    <!-- <template v-slot:error="{ error }">
      <div class="text-negative">{{ error }}</div>
    </template> -->
  </q-file>
</template>

<script>
import { ref, defineComponent, watch } from "vue";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";

export default defineComponent({
  emits: ["photoResponse"],
  name: "UploadExample",
  setup: (props, { emit }) => {
    const store = userStore();
    const action = `https://fxlmnp.wallykrooger.com/upload?token=${store.token}`;
    const $q = useQuasar();
    const file = ref();
    watch(file, (newValue, oldValue) => {
      uploadFile(newValue);
    });
    const uploadFile = async (uploadedItem) => {
      if (uploadedItem) {
        const formData = new FormData();
        formData.append("file", file.value);
        try {
          const response = await fetch(
            `https://fxlmnp.wallykrooger.com/upload?token=${store.token}`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();
          if (data.status === "success") {
            emit("photoResponse", data.data);
            $q.notify({
              type: "positive",
              position: "top",
              message: `${file.value.name} อัพโหลดเรียบร้อยแล้ว`,
              icon: "check_circle_outline"
            });
          } else {
            $q.notify({
              type: "negative",
              position: "top",
              message: `${file.value.name} การอัพโหลดล้มเหลว ขนาดภาพไม่ตรงที่กำหนด โปรดอัปโหลดรูปภาพในภายหลัง`,
              icon: "report_problem"
            });
            file.value = null;
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    return {
      file,
      action,
      // handleChange,
      uploadFile,
      // uploadedCallBack,
    };
  },
});
</script>

<style scoped>
.q-uploader .q-uploader-upload-btn {
  color: #ffffff !important;
}
</style>
