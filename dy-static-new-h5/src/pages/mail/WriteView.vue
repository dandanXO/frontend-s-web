<template>
    <div class="write-letter">
        <q-form ref="formRef" :model="mailDetailList">
        <div class="q-pa-md bg-white q-ma-sm">
            <div class="top row justify-between items-center">
                <div class="title">
                    标题
                </div>
                <q-btn-dropdown class="text-blue-6" border label="快捷输入" menu-anchor="bottom end">
                <q-list>
                    <q-item v-for="(item, i) in options" :key="i" clickable v-close-popup @click="onItemClick(item)">
                    <q-item-section>
                        <q-item-label>{{ item }}</q-item-label>
                    </q-item-section>
                    </q-item>

                </q-list>
                </q-btn-dropdown>
            </div>
            <q-input :rules="[
                    (val) => (val && val.length > 0) || '请输入标题',
                    (val) =>
                      (val && val.length < 255) || '标题长度为255以下.'
                  ]"
                  ref="titleRef"
                  name="title"
                  counter
                  bottom-slots
                  maxlength="255"
                  v-model="mailDetailList.title"
                  class="q-mt-md write-input"
                  filled
                  placeholder="请输入标题" />
        </div>
        <div class="q-pa-md bg-white q-ma-sm">
            <div class="top title q-pb-xs">内容
            </div>
            <q-input ref="contentRef"
                  :rules="[
                    (val) => (val && val.length > 0) || '请输入内容',
                    (val) =>
                      (val && val.length < 501) || '内容长度为500以下'
                  ]"
                  name="content"
                  filled
                  type="textarea"
                  :auto-size="{ minRows: 4, maxRows: 16 }"
                  class="mail-txtarea q-mb-md write-input"
                  counter
                  maxlength="500"
                  v-model="mailDetailList.content"
                  placeholder="请输入内容" />
        </div>
        <div class=" q-pa-md">
            <q-btn
              color="dyblue"
              class="fit submit-btn"
              @click="onSubmit"
              label="发送"
            />
        </div>


        </q-form>
    </div>
</template>
<script setup>
    import { onMounted, ref } from "vue";
    import { useQuasar } from "quasar";
    import { api } from "boot/axios";
    import { useRouter } from "vue-router";
    var qs = require("qs");
    const $q = useQuasar();
    const router = useRouter();
    const options = [
        '存款问题', '转账问题','提款问题','其他'
    ]
    const mailDetailList = ref({
        title: "",
        content: ""
    });
    const onItemClick = (item) => {
        mailDetailList.value.title = item
    }
    const titleRef = ref();
    const contentRef = ref();
    const onSubmit = () => {
      titleRef.value.validate();
      contentRef.value.validate();
      if (
        titleRef.value.hasError ||
        contentRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
          api.post("/session/writeOutbox", qs.stringify(mailDetailList.value)).then((response) => {
            if(response.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "发送成功",
                  icon: "check_circle_outline"
                });
                router.push('/account/mail/outbox');
              }
          })
        .catch((error) => {
          console.log("error", error);
        });
      }
    };
onMounted(() => {
})

</script>
<style scoped lang="scss">
    .write-letter {
        .top {
            display: flex;
            justify-content: space-between;
        }

      .title{
        font-weight: 600;
        font-size: 16px;
      }

      .q-field--filled .q-field__control{
        border-radius: 10px;
      }

      .submit-btn{
        height: 45px;
        font-size: 16px;
        border-radius: 8px;
        background: linear-gradient(180deg,#52ACFF ,#3559Da);
      }
    }
</style>
