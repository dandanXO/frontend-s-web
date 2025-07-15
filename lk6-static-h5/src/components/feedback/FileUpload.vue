<template>
  <q-file name="upload_img" v-model="file" class="q-pt-md" filled :label="$t('common.uploadImg')" color="white">
    <template v-slot:prepend>
      <q-icon name="cloud_upload" />
    </template>
  </q-file>
</template>

<script>
import { ref, defineComponent, watch } from "vue";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { getRndInteger } from "boot/utils";
import { useI18n } from "vue-i18n";

export default defineComponent({
  emits: ["photoResponse"],
  name: "UploadExample",
  setup: (props, { emit }) => {
    const { t } = useI18n();
    const store = userStore();

    var rstArray = Object.values(process.env.RST_API);
    var rstApi = rstArray[getRndInteger(0, rstArray.length)];

    const action = rstApi + "/session/image/uploadOrder?token=" + store.token;
    const $q = useQuasar();
    const file = ref();
    watch(file, (newValue, oldValue) => {
      uploadFile(newValue);
    });
    const uploadFile = async (uploadedItem) => {
      if (uploadedItem) {
        const formData = new FormData();
        formData.append("files", file.value);
        formData.append("includeDir", true);
        try {
          const response = await fetch(`${rstApi}/session/image/uploadOrder`, {
            method: "POST",
            body: formData,
            headers: {
              token: `${store.token}`
            }
          });
          const data = await response.json();
          if (data.code === 0) {
            emit("photoResponse", data.data);
            $q.notify({
              type: "positive",
              position: "top",
              message: t("common.notification.uploadSuccess.message", { name: file.value.name }),
              icon: "check_circle_outline"
            });
          } else {
            $q.notify({
              type: "negative",
              position: "top",
              message: t("common.notification.uploadError.message", { name: file.value.name }),
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
      uploadFile
      // uploadedCallBack,
    };
  }
});
</script>

<style scoped>
.q-uploader .q-uploader-upload-btn {
  color: #ffffff !important;
}
</style>
