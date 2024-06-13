<template>
  <el-space>
    <el-input :readonly="true" v-model.number="ruleForm.icon" autocomplete="off" />
    <!-- eslint-disable -->
    <input
      id="uploadFile"
      type="file"
      ref="input"
      style="display: none"
      accept="image/*"
      @change="attachPhoto($event, 'payment')"
    />
    <a-button class="common-btn" @click="$refs.input.click()">Upload Image</a-button>
  </el-space>
  <!-- <el-input v-model.number="ruleForm.icon" autocomplete="off" /> -->
</template>

<script>
import { defineComponent, reactive } from "vue";

import { uploadImage } from "@/api/image";
import { ElMessage } from "element-plus";
export default defineComponent({
  emits: ["photoResponse"],

  setup: (props, { emit }) => {
    const ruleForm = reactive({
      icon: null
    });
    const clear = () => {
      ruleForm.icon = null;
      emit("photoResponse", null);
    };
    const attachPhoto = async (event, type) => {
      const files = event.target.files[0];
      const allowFileType = ["image/jpeg", "image/png", "image/gif"];
      const dirPayment = "payment";
      const dirPaymentLabel = "payment/label";

      if (!allowFileType.find((ftype) => ftype.includes(files.type))) {
        ElMessage({
          message: "Upload Limit, please change your image.",
          type: "error"
        });
      } else {
        var formData = new FormData();
        formData.append("files", files);
        if (type === "payment") {
          formData.append("dir", dirPayment);
        } else {
          formData.append("dir", dirPaymentLabel);
        }
        formData.append("overwrite", false);
        const data = await uploadImage(formData);
        if (data.code === 0) {
          ElMessage({
            message: "Upload Success.",
            type: "success"
          });

          if (type === "payment") {
            ruleForm.icon = data.data;
            emit("photoResponse", data.data);
          } else {
            ruleForm.promoIcon = data.data;
          }
        } else {
          ElMessage({
            message: "File upload failed. Upload limit, please upload images later.",
            type: "error"
          });
        }
      }
    };

    return {
      attachPhoto,
      ruleForm,
      clear
    };
  }
});
</script>
