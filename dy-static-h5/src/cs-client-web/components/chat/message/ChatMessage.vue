<template>
  <message-divider :label="$t('new_messages')" v-if="showNewMessagesDividerLine" />

  <message-date :message="message" v-if="showDate" />

  <div ref="messageRef" :class="messageWrapClass" :id="`message-${message.id}`">
    <template v-if="message.type === 'system' || message.type === 'sys'">
      <message-system :message="message"></message-system>
    </template>
    <template v-else-if="message.type === 'system' || message.type === 'end'">
      <div class="message-ended">
        <div class="message-system-container q-pa-sm">{{ message.time }} - {{ message.content }}</div>
      </div>
    </template>
    <template v-else-if="message.type === 'notice' || message.type === 'welcome'">
      <message-notice :message="message"></message-notice>
    </template>
    <template v-else>
      <div v-intersection="onMessageIntersection">
        <div
          :class="containerClass"
          :data-id="message.id"
          :id="`message-container-${message.id}`"
          style="flex-wrap: nowrap"
        >
          <q-avatar size="36px" color="grey-3" :class="`message-avatar message-avatar--${op} q`" v-if="showAvatar">
            <template v-if="hasAvatar">
              <img :src="message.avatarUrl" />
            </template>
            <template v-else>
              <div class="bg-grey-3">
                <q-icon name="person" size="36px" color="grey-6" />
              </div>
            </template>
          </q-avatar>
          <div :id="`message-menu-${index}`">
            <div :class="`message-name message-name--${op} text-grey-8`" v-if="showUsername">
              {{ message.name || "user" }}
            </div>
            <div :class="messageClass">
              <div :class="textClass">
                <template v-if="message?.deleted">
                  <i class="msg-recalled">{{ $t("recall_msg") }}</i>
                </template>
                <template v-else>
                  <template v-if="['text', 'html'].includes(message.type)">
                    <message-text :message="message"></message-text>
                  </template>
                  <template v-if="message.type === 'file'">
                    <message-files :message="message"></message-files>
                  </template>
                  <template v-if="message.type === 'voice'">
                    <message-audio :sent="sent" :message="message"></message-audio>
                  </template>
                  <template v-if="message.type === 'options' || message.type === 'option_selected'">
                    <message-options :message="message" :clickable="!sent" />
                  </template>
                  <template v-if="message.type === 'form'">
                    <message-form :message="message" :clickable="!sent" />
                  </template>
                </template>
              </div>
            </div>

            <div class="q-mt-sm" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
          <div class="message-stamp">
            {{ message.time }}
          </div>

          <div
            :class="['self-center', !sent ? 'q-ml-sm' : 'q-mr-sm']"
            v-show="message?.status && (message.status === 1 || message.status === 2)"
          >
            <div v-show="message.status === 1">
              <q-spinner-oval color="grey-9" size="1.25em" />
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t("message_sending") }}
              </q-tooltip>
            </div>
            <div v-show="message.status === 2" class="cursor-pointer" @click="resendMessage">
              <q-icon name="error" color="red" size="1.5em" />
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[5, 5]">
                {{ $t("message_resend") }}
              </q-tooltip>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from "vue";
import MessageDate from "src/cs-client-web/components/chat/message/MessageDate";
import MessageText from "src/cs-client-web/components/chat/message/MessageText";
import MessageAudio from "src/cs-client-web/components/chat/message/MessageAudio";
import MessageFiles from "src/cs-client-web/components/chat/message/MessageFiles";
import MessageSystem from "src/cs-client-web/components/chat/message/MessageSystem";
import MessageNotice from "src/cs-client-web/components/chat/message/MessageNotice";
import MessageOptions from "src/cs-client-web/components/chat/message/MessageOptions";
import MessageDivider from "src/cs-client-web/components/chat/message/MessageDivider";
import MessageForm from "src/cs-client-web/components/chat/message/MessageForm";

const MSG_SEND_TIMEOUT = 6;

export default defineComponent({
  name: "ChatMessage",
  components: {
    MessageForm,
    MessageDivider,
    MessageDate,
    MessageText,
    MessageAudio,
    MessageFiles,
    MessageSystem,
    MessageNotice,
    MessageOptions
  },
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    message: {
      type: Object,
      require: true
    },
    messages: {
      type: Array,
      require: true
    },
    newMessage: {
      type: Object,
      default: () => {}
    },
    roomUsers: { type: Array, default: () => [] },
    usernameOptions: { type: Object, required: true },
    showNewMessagesDivider: { type: Boolean, required: true },
    showAvatar: {
      type: Boolean,
      default: true
    }
  },
  emits: ["message-added", "resend-message"],
  setup(props, { emit }) {
    const messageRef = ref();
    const message = ref(props.message);

    // console.log("Message");
    // console.log(message.value);

    const sent = computed(() => {
      return props.currentUserId === message.value?.senderId;
    });

    const op = computed(() => (sent.value ? "sent" : "received"));

    const messageWrapClass = computed(() => {
      if ((message.value.type === "notice" || message.value.type === "welcome") && message.value.content == "") {
        return "message-type-empty";
      }
      return [`message message--${op.value} message-text`, `message-type-${message.value.type}`];
    });

    const textClass = computed(() => `message-text-content message-text-content--${op.value}`);

    const messageClass = computed(() => `message-text message-text--${op.value}`);

    const containerClass = computed(
      () =>
        "message-container row items-end no-wrap" + (props.currentUserId === message.value?.senderId ? " reverse" : "")
    );

    const showUsername = computed(() => {
      if (!props.usernameOptions.currentUser && sent) {
        return false;
      } else {
        return props.roomUsers.length >= props.usernameOptions.minUsers;
      }
    });

    const showDate = computed(() => {
      return props.index > 0 && props.message.date !== props.messages[props.index - 1].date;
    });

    const showNewMessagesDividerLine = computed(() => {
      return (
        props.showNewMessagesDivider.value && props.newMessage.value && props.newMessage.value.id === message.value.id
      );
    });

    const hasAvatar = computed(() => {
      return !!message.value?.avatarUrl?.length;
    });

    let stopInterval = false;

    function messageSendingJob() {
      let count = 0;

      let messageSendingInterval = setInterval(() => {
        let status = message.value.status ?? 4;

        if (stopInterval || status > 1) {
          count = 0;
          clearInterval(messageSendingInterval);
          return;
        }

        if (status === 1) {
          count++;

          if (count >= MSG_SEND_TIMEOUT) {
            message.value.status = 2;
            clearInterval(messageSendingInterval);
            return;
          }
        }
      }, 1000);
    }

    onMounted(() => {
      emit("message-added", props.message, props.index, messageRef.value);
      messageSendingJob();
    });

    onBeforeUnmount(() => {
      stopInterval = true;
    });

    const resendMessage = () => {
      messageSendingJob();
      emit("resend-message", props.message);
    };

    const onMessageIntersection = (entry) => {
      if (entry.isIntersecting) {
        if (message.value?.seen) {
          return;
        }

        message.value.seen = true;
      }
    };

    return {
      sent,
      op,
      messageWrapClass,
      textClass,
      messageClass,
      containerClass,
      messageRef,
      showDate,
      showUsername,
      showNewMessagesDividerLine,
      hasAvatar,
      resendMessage,
      onMessageIntersection
    };
  }
});
</script>

<style lang="scss" scoped>
.message-name {
  margin-bottom: 2px;
}

.message-name,
.message-label {
  font-size: small;
}

.message-label {
  margin: 24px 0;
  text-align: center;
}

.message-stamp {
  color: #adadad;
  margin-bottom: 5px;
  display: block;
  font-size: 0.6rem;
  min-width: 48px;
}

.message-avatar {
  align-self: self-start;
}

.message {
  padding: 6px 12px !important;
  margin-bottom: 0;

  &.message-selected {
    .message-cover-layer-1 {
      display: block;
    }
  }

  &:first-child .message-label {
    margin-top: 0;
  }
}

.message-avatar--received {
  margin-right: 10px;
}

.message-text--received {
  background: #f2f7fd !important;
  //background: linear-gradient(45deg, #fbedff, #d3fdff) !important;
  border-radius: 15px;
  margin-right: 10px;
}

.message-text-content--received {
  color: #000;
}

.message-name--sent {
  text-align: right;
}

.message-avatar--sent {
  margin-left: 10px;
}

.message-container--sent {
  flex-direction: row-reverse;
}

.message-text--sent {
  background: #5b97de !important;
  //background: #f4f3f3 !important;
  border-radius: 15px;
  margin-left: 10px;
}

.message-type-welcome {
  border-bottom: 1px solid #eeeeee;
  margin: 8px 12px;
}

.message-type-empty {
  height: 8px;
}

.message-text-content--sent {
  color: #fff !important;
}

.message-text {
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.2;
  word-break: break-word;
  white-space: pre-line;
  position: relative;

  & + & {
    margin-top: 3px;
  }

  &:last-child {
    min-height: 34px;

    .q-message-stamp {
      display: block;
    }
  }
}

.msg-recalled {
  font-size: 13px;
  opacity: 0.6;
}

.message--sent {
  margin-left: 52px;

  .message-stamp {
    text-align: right;
  }
}

.message-ended {
  text-align: center;
  color: #000000;
  opacity: 0.6;
  font-size: 15px;
  margin: 10px auto;
}
</style>
