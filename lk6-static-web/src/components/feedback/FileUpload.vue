<template>
  <el-space>
    <el-input :readonly="true" v-model.number="ruleForm.icon" autocomplete="off" />
    <input
      id="uploadFile"
      type="file"
      ref="input"
      style="display: none"
      accept="image/*"
      @change="attachPhoto($event, 'feedback')"
    />
    <el-button size="small" class="common-btn" @click="$refs.input.click()">上传图片</el-button>
  </el-space>
</template>

<script>
import { defineComponent, reactive } from "vue";

import { uploadImage } from "@/api/image";
import { useNotify } from "@/hooks/notify";
export default defineComponent({
  emits: ["photoResponse"],

  setup: (props, { emit }) => {
    const notify = useNotify();

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
      const dirPayment = "feedback";
      const dirPaymentLabel = "feedback/label";

      if (!allowFileType.find((ftype) => ftype.includes(files.type))) {
        notify({
          message: "上传限制",
          type: "error"
        });
      } else {
        var formData = new FormData();
        formData.append("files", files);
        if (type === "feedback") {
          formData.append("dir", dirPayment);
        } else {
          formData.append("dir", dirPaymentLabel);
        }
        formData.append("overwrite", false);
        formData.append("includeDir", true);

        const data = await uploadImage(formData);
        if (data.code === 0) {
          if (type === "feedback") {
            ruleForm.icon = data.data;
            emit("photoResponse", data.data);
          } else {
            ruleForm.promoIcon = data.data;
          }
        } else {
          notify({
            message: "上传失败. 上传限制，请稍后再试",
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
