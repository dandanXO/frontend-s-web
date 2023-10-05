<template>
  <q-file
    name="upload_img"
    v-model="file"
    class="q-pt-md"
    filled
    :label="$t('lang.upload_img')"
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
import {useI18n} from "vue-i18n";

export default defineComponent({
  emits: ["photoResponse"],
  name: "UploadExample",
  setup: (props, { emit }) => {
    const store = userStore();
    const {t}= useI18n();
    const action = `${process.env.UPLOAD_IMG_API}/upload?token=${store.token}`;
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
            `${process.env.UPLOAD_IMG_API}/upload?token=${store.token}`,
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
              message: `${file.value.name}` + t('lang.upload_successfully'),
              icon: "check_circle_outline"
            });
          } else {
            $q.notify({
              type: "negative",
              position: "top",
              message: t('lang.failed_upload_size_dont_meet_requirement'),
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
