<template>
  <div>
    <div v-bind="getRootProps()" id="uploader">
      <input v-bind="getInputProps()" />
      <div v-if="isDragActive">
        <span>{{ $t("upload_placeholder") }}</span>
      </div>
    </div>
    <div @click="openFileUploader">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useDropzone } from "vue3-dropzone";
import uploadFile from "src/cs-client-web/utils/upload-file";

export default defineComponent({
  name: "FileUploader",
  props: {
    disable: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  emits: ["upload-progress", "upload-failed", "complete"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const { t } = useI18n();

    const saveFiles = async (files) => {
      let uploadedFiles = [];

      for (let x = 0; x < files.length; x++) {
        let file = files[x];
        // 上载
        await uploadFile(file.name, file, (event) => {
          const percentage = Math.round((100 * event.loaded) / event.total);
          console.log(`file ${file.name} progress ->> ${percentage}%`);

          emit("upload-progress", percentage);
        })
          .then((resFile) => {
            uploadedFiles.push(resFile);
          })
          .catch(() => {
            emit("upload-failed");
          });
      }

      emit("complete", uploadedFiles);
    };

    function onDrop(acceptFiles, rejectReasons) {
      if (rejectReasons.length) {
        let error = rejectReasons[0].errors[0];
        let codeKey = null;

        if (error.code === "file-too-large") {
          codeKey = "upload_file_too_large";
        } else if (error.code === "too-many-files") {
          codeKey = "upload_too_many_files";
        }

        if (codeKey) {
          $q.notify({
            type: "warning",
            message: t(codeKey)
          });
        }

        return;
      }

      saveFiles(acceptFiles); // 保存文件
    }

    const options = {
      maxSize: 60000000, // 5MB
      multiple: false,
      onDrop
    };

    const { getRootProps, getInputProps, ...dzApi } = useDropzone(options);

    const openFileUploader = () => {
      if (!props.disable) {
        dzApi.open();
      }
    };

    return {
      getRootProps,
      getInputProps,
      ...dzApi,
      openFileUploader
    };
  }
});
</script>

<style lang="scss" scoped>
#uploader {
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    display: table;
    text-align: center;
    border: 2px dashed grey;
    width: 100%;
    height: 100%;

    span {
      display: table-cell;
      vertical-align: middle;
    }
  }
}

.uploader--active {
  padding: 5px;
  z-index: 9999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
