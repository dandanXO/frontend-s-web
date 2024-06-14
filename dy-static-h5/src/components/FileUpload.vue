<template>
  <q-file
    name="upload_img"
    v-model="file"
    class="q-pt-md"
    filled
    label="上传图片"
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
import {api} from "boot/axios";

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
      var rstUrl = localStorage.getItem("DY_H5_RST_URL");
      if(!rstUrl){
        rstUrl = process.env.RST_API.split(",")[0];
      }
      if (uploadedItem) {
        const formData = new FormData();
        formData.append("files", file.value);
        formData.append('includeDir', true)
        try {
          const response = await fetch(
            `${rstUrl}/session/image/uploadOrder`,
            {
              method: "POST",
              body: formData,
              headers: {
                token: `${store.token}`
              }
            }
          );
          const data = await response.json();
          if (data.code === 0) {
            emit("photoResponse", data.data);
            $q.notify({
              type: "positive",
              position: "top",
              message: `${file.value.name} 上传成功。`,
              icon: "check_circle_outline"
            });
          } else {
            $q.notify({
              type: "negative",
              position: "top",
              message: `${file.value.name} 上传失败。请稍后再试。`,
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
