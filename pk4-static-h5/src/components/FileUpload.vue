<template>
  <q-file
    name="upload_img"
    v-model="file"
    label-color="brand"
    outlined
    clearable
    :class="file? '' : 'hasFile'"
  >
    <!-- Display error message -->
    <!-- <template v-slot:error="{ error }">
      <div class="text-negative">{{ error }}</div>
    </template> -->
    <template v-slot:prepend>
      <img style="
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 32px;
    width: 32px;" v-if="!file" src="../assets/images/common/image-icon.png">
    </template>

  </q-file>
 
</template>

<script>
import { ref, defineComponent, watch, defineExpose } from "vue";
import { userStore } from "src/stores";
import { useQuasar } from "quasar";
import { getRndInteger } from "boot/utils";

export default defineComponent({
  emits: ["photoResponse"],
  name: "UploadExample",
  setup: (props, { emit }) => {
    const store = userStore();

    var rstArray = Object.values(process.env.RST_API);
    var rstApi = rstArray[getRndInteger(0, rstArray.length)];

    const action = rstApi + "/session/image/uploadOrder?token=" + store.token;
    const $q = useQuasar();
    const resetFile = () => {
      file.value = null;
    };
    const file = ref();
    watch(file, (newValue, oldValue) => {
      uploadFile(newValue);
    });
    const uploadFile = async (uploadedItem) => {
      if (uploadedItem) {
        const formData = new FormData();
        formData.append("files", file.value);
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
              message: `${file.value.name} uploaded successfully`,
              icon: "check_circle_outline"
            });
          } else {
            $q.notify({
              type: "negative",
              position: "top",
              message: `${file.value.name} upload failed. Please try again`,
              icon: "report_problem"
            });
            file.value = null;
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    defineExpose({
      resetFile
    });

    return {
      file,
      action,
      // handleChange,
      uploadFile,
      // uploadedCallBack,
      resetFile
    };
  }
});
</script>

<style scoped lang="scss">
.q-uploader .q-uploader-upload-btn {
  color: #ffffff !important;
}
.q-field__control-container {
  height: 100%;
  flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.q-file .q-field__native {
  display: block;
}
:deep(.q-field__control):after {
 height: 100%;
}
.hasFile { 
  :deep(.q-field__control-container) {
    display: flex; padding: 30px 0; justify-content: center;

  }
}
</style>
