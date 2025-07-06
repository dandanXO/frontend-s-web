<template>
  <q-footer bordered class="footer-board text-white shadow-1">
    <div class="typing-div" v-if="is_typing">{{ typing_username }}{{ $t("is_typing") }}</div>

    <div class="column q-mx-sm q-py-sm text-black">
      <div class="row no-wrap justify-end items-end">
        <div class="col-grow items-end">
          <q-input
            ref="textareaRef"
            autogrow
            v-model="message"
            color="grey-2"
            :placeholder="$t('message_tip')"
            maxlength="500"
            class=""
            style="align-items: flex-end; justify-content: flex-end"
            borderless
            @keydown="onMessageKeydown"
            :disable="disable"
          >
            <template v-slot:append>
              <q-btn
                round
                flat
                icon="thumb_up_off_alt"
                class=""
                color="primary"
                :disable="disable || is_rated"
                @click="openRatingBoard"
              />

              <emoji-picker v-if="!isStorageDisabled" @on-pick="onEmojiPick" :disable="disable" />
              <file-uploader
                @upload-progress="onFileUploadProgress"
                @upload-failed="onFileUploadFailed"
                @complete="onFileUploadCompleted"
                :disable="disable"
              >
                <q-btn round flat icon="drive_folder_upload" class="" color="primary" :disable="disable" />
              </file-uploader>
              <q-btn
                class="send-btn"
                color="primary"
                unelevated
                @click="onSubmit"
                text-color="white"
                :disable="disable"
                size="md"
              >
                <div class="row items-center no-wrap">
                  <div class="text-center" style="margin-right: 6px">
                    {{ $t("send") }}
                  </div>
                  <img :src="require('src/cs-client-web/assets/images/send-icon.png')" />
                </div>
              </q-btn>
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <q-inner-loading :showing="loading">
      {{ loadingText }}
    </q-inner-loading>
  </q-footer>
</template>

<script>
/* eslint-disable */
import { computed, defineComponent, nextTick, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import EmojiPicker from "src/cs-client-web/components/chat/footer/EmojiPicker";
import FileUploader from "src/cs-client-web/components/chat/footer/FileUploader";
import emitter from "src/cs-client-web/helpers/event-bus";
import insertTextAtCursor from "insert-text-at-cursor";
import moment from "moment";
import throttle from "lodash/throttle";
import useSocket from "src/cs-client-web/composables/use-socket";
import chatEnum from "src/cs-client-web/enum/chatEnum";
import { useUserStore } from "src/cs-client-web/stores/user";
import { useChatStore } from "src/cs-client-web/stores/chat";

const MSG_MAX_LEN = 500;

export default defineComponent({
  name: "ChatFooter",
  components: { FileUploader, EmojiPicker },
  props: {
    disable: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    is_typing: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    is_rated: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    isStorageDisabled: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    typing_username: {
      type: String,
      default: () => {
        return "";
      }
    },
    roomId: {
      type: [String, Number]
    },
    room: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ["openRateBoard"],
  setup(props, { emit }) {
    const { socketSendObj } = useSocket();
    const $q = useQuasar();
    const { t } = useI18n();
    const textareaRef = ref(null);
    const message = ref("");
    const files = ref(null);
    const loading = ref(false);
    const loadingText = ref("");
    const user = useUserStore();

    let messageLastSentTime = null;

    const focusTextarea = () => {
      if (textareaRef.value === null) {
        return;
      }

      textareaRef.value.focus();
    };

    const onEmojiPick = async (event) => {
      insertTextAtCursor(textareaRef.value.$el, event.detail.unicode);

      await nextTick().then(() => {
        focusTextarea();
      });
    };

    watch(message, (newMsg) => {
      _throttle_typing(newMsg);
    });

    const lastMsg = ref("");
    const _throttle_typing = throttle((newMsg) => {
      // console.log("Wow Typing:" + newMsg);
      if (newMsg != "" || (newMsg == "" && newMsg != lastMsg.value)) {
        let payload = {
          cmd: chatEnum.CMD_SEND_REDIRECT,
          body: {
            to: props.roomId,
            roomId: user.userId,
            guestTypingContent: newMsg,
            redirectCmd: chatEnum.CMD_SEND_TYPING
          }
        };
        // console.log(payload);
        socketSendObj(payload);

        lastMsg.value = newMsg;
      }
    }, 1000);

    const resetMessage = () => {
      message.value = "";
      lastMsg.value = "";
      files.value = null;
    };

    const onSubmit = () => {
      let msg = message.value.trim();
      let msgType = "text";

      if (msg.length === 0 && (!files.value || !files.value.length)) {
        $q.notify({
          type: "negative",
          message: t("message_required")
        });

        return;
      }

      if (msg.length > MSG_MAX_LEN) {
        $q.notify({
          timeout: 1500,
          message: t("message_exceeded")
        });
        return;
      }

      if (messageLastSentTime) {
        if (moment().diff(messageLastSentTime, "milliseconds") < 600) {
          $q.notify({
            type: "negative",
            message: t("svr_busy")
          });

          return;
        }
      }

      if (files.value && files.value.length) {
        msgType = "file";
      } else {
        files.value = null;
      }

      emitter.emit("SendMessage", {
        type: msgType,
        content: msg,
        files: files.value
      });

      messageLastSentTime = moment().valueOf();

      if (msgType === "text") {
        focusTextarea();
      }

      resetMessage();
    };

    const onMessageKeydown = (e) => {
      if (e.keyCode === 13 || e.keyCode === 10) {
        e.preventDefault();

        if (e.shiftKey) {
          message.value += "\n";
        } else {
          onSubmit();
        }
      }
    };

    const onFileUploadProgress = function (value) {
      loading.value = true;
      loadingText.value = `uploading file (${value})`;

      if (value === 100) {
        loadingText.value = "";
        loading.value = false;
      }
    };

    const onFileUploadFailed = function () {
      loading.value = false;
    };

    const openRatingBoard = () => {
      emit("openRateBoard");
    };

    const onFileUploadCompleted = function (uploadedFiles) {
      loadingText.value = "";
      loading.value = false;
      files.value = uploadedFiles;
      onSubmit();
    };

    return {
      textareaRef,
      message,
      loading,
      loadingText,
      onEmojiPick,
      onFileUploadProgress,
      onFileUploadFailed,
      onFileUploadCompleted,
      onSubmit,
      onMessageKeydown,
      openRatingBoard
    };
  }
});
</script>

<style>
.footer-board {
  background: #f7f7f7;
}

.q-textarea .q-field__control {
  align-items: flex-end;
}

.q-textarea .q-field__native {
  height: 52px;

  border-radius: 5px;
  padding: 17px 12px 17px 4px;
}

.typing-div {
  background: grey;
  color: #000;
  opacity: 0.8;
  padding: 2px 6px;
  font-style: italic;
  font-size: 11px;
}

.send-btn {
  border-radius: 20px;
}
</style>
