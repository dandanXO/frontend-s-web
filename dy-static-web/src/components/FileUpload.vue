<template>
  <el-upload
    v-model:file-list="fileList"
    :on-remove="handleRemove"
    :limit="1"
    :on-exceed="handleExceed"
    :action="action"
  >
    <el-button size="small" class="common-btn">
      <el-icon class="el-icon--left"><UploadFilled /></el-icon>
      上传图片
    </el-button>
  </el-upload>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, defineComponent, watch } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { userStore } from "@/store";

export default defineComponent({
  emits: ["photoResponse"],
  name: "UploadExample",
  components: {
    UploadFilled,
  },
  setup: (props, { emit }) => {
    const store = userStore();
    const fileList = ref([]);
    // const action = `https://fxlmnp.wallykrooger.com/upload?token=${store.token}`;
    const action = `${process.env.VUE_APP_RST_API}/session/image/uploadOrder`;
    watch(fileList, (newValue, oldValue) => {
      if (newValue.length > 0) {
        uploadFile(newValue);
      }
    });
    const uploadFile = async (uploadedItem) => {
      console.log(uploadedItem[0])
      if (uploadedItem[0]) {
        
        const formData = new FormData();
        formData.append("fileList", uploadedItem[0].raw);
        try {
          const response = await fetch(
            `${process.env.VUE_APP_RST_API}/session/image/uploadOrder`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();
          if (data.status === "success") {
            emit("photoResponse", data.data);
            ElMessage.success(`${uploadedItem[0].name} 上传成功`);
            fileList.value = [uploadedItem[0]];
          } else {
            ElMessage.warning(
              `${uploadedItem[0].name} 上传失败. 上传限制，请稍后再试`
            );
            fileList.value = [];
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    const handlePreview = (uploadFile) => {
      console.log(uploadFile)
    }

    const handleExceed = () => {
      ElMessage.warning(`上传图片限制仅为 1`);
    };

    const handleRemove = (uploadFile) => {
      return ElMessageBox.confirm(
        `取消上传 ${uploadFile.name} ?`
      ).then(
        () => true,
        () => false
      );
    };

    return {
      fileList,
      uploadFile,
      handlePreview,
      handleExceed,
      handleRemove,
      action,
    };
  },
});
</script>

<style>
.el-upload-list__item {
  width: calc(100% + 30px);
}
</style>
