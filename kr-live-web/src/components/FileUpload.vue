<template>
  <q-file dense name="upload_img" v-model="file" class="q-pt-md" outlined :label="$t('lang.upload_img')" color="white">
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
import { useI18n } from "vue-i18n";
import { getRndInteger } from "boot/utils";

export default defineComponent({
  emits: ["photoResponse"],
  name: "UploadExample",
  setup: (props, { emit }) => {
    const store = userStore();
    const { t } = useI18n();

    var rstArray = process.env.RST_API;
    if (typeof rstArray === "string" || rstArray instanceof String) {
      var rstApi = rstArray;
    } else {
      var apiLists = Object.values(rstArray);
      var rstApi = apiLists[getRndInteger(0, apiLists.length)];
    }

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
              message: `${file.value.name}` + t("lang.upload_successfully"),
              icon: "check_circle_outline"
            });
          } else {
            $q.notify({
              type: "negative",
              position: "top",
              message: t("lang.failed_upload_size_dont_meet_requirement"),
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
