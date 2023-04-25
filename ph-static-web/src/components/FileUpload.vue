<template>
  <a-upload
    v-model:file-list="fileList"
    name="file"
    :action="action"
    :max-count="1"
    @change="handleChange"
  >
    <a-button class="common-btn">
      <CloudUploadOutlined />
      Upload Image
    </a-button>
  </a-upload>
</template>

<script>
import { message } from "ant-design-vue";
import { ref, defineComponent } from "vue";
import { CloudUploadOutlined } from "@ant-design/icons-vue";
import { userStore } from "@/store";

export default defineComponent({
  emits: ['photoResponse'],
  name: "UploadExample",
  components: {
    CloudUploadOutlined,
  },
  setup: (props, { emit }) => {
    const store = userStore();
    const action = `https://fxlmnp.wallykrooger.com/upload?token=${store.token}`;
    const fileList = ref([]);

    const headers = {
      authorization: process.env.VUE_APP_SITE,
    };
    const handleChange = (info) => {
      console.log(info)
      // if (info.file.status !== "uploading") {
      //   console.log(info.file, info.fileList);
      // }
      // if (info.file.status !== "uploading") {
      //   console.log(info.file, info.fileList);
      // }
      // if (info.file.status === "done") {
      //   console.log(info.file, info.fileList);
      // }
      // if (info.file.response && info.file.response.status === "success") {
      //   emit('photoResponse', info.file.response.data)
      //   message.success(`${info.file.response.status} file uploaded successfully`);
      // } else if (info.file.response && info.file.response.status === "error") {
      //   info.file.status = 'error'
      //   message.error(`${info.file.name} file upload failed. Upload limit, please upload images later.`);
      // }
    };

    return {
      fileList,
      action,
      headers,
      handleChange,
    };
  },
});
</script>
<style>
.anticon-paper-clip {
  color: #ffffff !important;
}
</style>
