<template>
  <div>
    <message-text :message="message" />
    <br />
    <q-form ref="myForm" class="my-form q-gutter-sm" @submit="onSubmit" autocomplete="off">
      <template v-for="(field, index) in formFields" :key="`message-form-${message.meta.type}-${index}`">
        <template v-if="['text', 'password'].includes(field.type)">
          <q-input
            dense
            v-model="field.model"
            :label="$t('fields.' + field.name)"
            :type="field.type"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t(`${field.name}_field_required`)]"
            :disable="status === 2"
          />
        </template>
      </template>
      <p class="text-red" v-if="txtError">
        {{ txtError }}
      </p>
      <div class="flex justify-end">
        <q-btn round icon="send" @click="onSubmit" v-show="status === 0" :loading="loading" type="submit" />
        <q-btn round icon="rotate_right" color="red" @click="onReset" v-show="status === 1" />
        <q-btn round icon="done" color="green" v-show="status === 2" disabled />
      </div>
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onBeforeUnmount } from "vue";
import emitter from "src/cs-client-web/helpers/event-bus";
import collect from "collect.js";
import MessageText from "src/cs-client-web/components/chat/message/MessageText";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MessageForm",
  components: {
    MessageText
  },
  props: {
    message: { type: Object, required: true },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { t } = useI18n();
    const myForm = ref(null);
    const loading = ref(false);
    const formFields = ref(null);
    const status = ref(props.message.formStatus);
    const txtError = ref(null);

    const clickable = computed(() => {
      return props.clickable || props.message.type === "form";
    });

    formFields.value = collect(props.message.meta.fields ?? [])
      .map((item) => {
        item.model = null;
        return item;
      })
      .all();

    const onSubmit = () => {
      if (!clickable.value) {
        return;
      }

      let sendObj = {
        type: "button_reply",
        save: false
      };

      sendObj.form = {
        name: "",
        fields: []
      };

      myForm.value.validate().then((success) => {
        if (success) {
          loading.value = true;

          sendObj.form.id = props.message._formId;
          sendObj.form.name = props.message.meta.type;
          sendObj.form.fields = formFields.value;

          emitter.emit("SendMessage", { ...sendObj });

          setTimeout(() => {
            if (status.value === 0) {
              status.value = 1;
              txtError.value = t("sys_exception");
              loading.value = false;
            }
          }, 6000);

          if (props.message.meta.type === "SEND_LOGIN_NAME") {
            setTimeout(() => {
              loading.value = false;
            }, 1000);

            status.value = 2;
          }
        }
      });
    };

    const onReset = () => {
      loading.value = false;
      status.value = 0;

      formFields.value = collect(formFields.value)
        .map((item) => {
          item.model = null;
          return item;
        })
        .all();

      myForm.value.resetValidation();
      txtError.value = "";
    };

    const formResponse = (e) => {
      const { formId, code, errorMsg } = e;

      if (formId === props.message._formId) {
        loading.value = false;
        status.value = code;

        if (errorMsg !== undefined) {
          txtError.value = errorMsg;
        }
      }
    };

    emitter.on("chat:form-response", formResponse);

    onBeforeUnmount(() => {
      emitter.off("chat:form-response", formResponse);
    });

    return { myForm, loading, formFields, status, txtError, onSubmit, onReset };
  }
});
</script>

<style scoped>
.my-form {
  min-width: 260px;
}
</style>
