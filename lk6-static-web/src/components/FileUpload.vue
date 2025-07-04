<!-- <template>
  <el-upload
    v-model="fileList"
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
              token: store.token
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
</style> -->
<template>
  <el-space>
              <el-input
                :readonly="true"
                v-model.number="ruleForm.icon"
                autocomplete="off"
              />
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="input"
                style="display: none"
                accept="image/*"
                @change="attachPhoto($event, 'payment')"
              />
    <el-button size="small" class="common-btn"
                @click="$refs.input.click()">
      上传图片
    </el-button></el-space>
          <!-- <el-input v-model.number="ruleForm.icon" autocomplete="off" /> -->
</template>

<script>
import {defineComponent, reactive} from "vue";

import { uploadImage } from '@/api/image';
import { useNotify } from "@/hooks/notify";

export default defineComponent({
  emits: ["photoResponse"],

  setup: (props, { emit }) => {
    const notify = useNotify();
    const ruleForm = reactive({
      icon: null
    })
    const clear = () => {
      ruleForm.icon = null
      emit("photoResponse", null);
    }
    const attachPhoto = async(event, type) => {
      const files = event.target.files[0]
      const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
      const dirPayment = 'payment'
      const dirPaymentLabel = 'payment/label'

      if (!allowFileType.find(ftype => ftype.includes(files.type))) {
        notify({
          message: '上传限制',
          type: 'error',
        })
      } else {
        var formData = new FormData()
        formData.append('files', files)
        if (type === 'payment') {
          formData.append('dir', dirPayment)
        } else {
          formData.append('dir', dirPaymentLabel)
        }
        formData.append('overwrite', false)
        formData.append('includeDir', true)

        const data = await uploadImage(formData)
        if (data.code === 0) {
          if (type === 'payment') {
            ruleForm.icon = data.data
            emit("photoResponse", data.data);
          } else {
            ruleForm.promoIcon = data.data
          }
        } else {
          notify({
            message: '上传失败. 上传限制，请稍后再试',
            type: 'error',
          })
        }
      }
    }

    return {
        attachPhoto,
        ruleForm,
        clear
      }
    }
  });

</script>