<template>
  <float-date-label :scroll-top="scrollAreaRef.verticalPosition" target=".message-date-label" />

  <q-scroll-area
    ref="scrollAreaRef"
    class="absolute-full bg-white"
    :thumb-style="{ width: '8px', height: '8px' }"
    @scroll="onPanelScroll"
  >
    <q-infinite-scroll
      ref="infiniteScrollRef"
      :disable="infiniteScrollDisabled"
      :initial-index="infiniteIndex"
      @load="onLoadMoreMessages"
      reverse
    >
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>
      <div v-if="messages.length">
        <div class="q-my-md text-center" v-if="showMessagesStarted">
          <message-divider :label="`${t('conversation_started')} ${messages[0].date}`" />
        </div>

        <div v-for="(message, i) in messages" :key="message.id">
          <chat-message
            :current-user-id="currentUserId"
            :message="message"
            :index="i"
            :room-users="room.users"
            :username-options="usernameOptions"
            :messages="messages"
            :new-message="newMessage"
            :show-new-messages-divider="showNewMessagesDivider"
            :show-avatar="showAvatar"
            @message-added="onMessageAdded"
            @resend-message="onResendMessage"
          ></chat-message>
        </div>
      </div>
    </q-infinite-scroll>

    <div v-if="hasRateChat && !isStorageDisabled && room_status == 'CLOSED' && !isVoteHide">
      <div class="rating-section-board">
        <p v-if="!isRated">{{ t("rate_customer_experience") }}</p>
        <h2 style="text-align: center" v-if="isRated">{{ t("voted_sent") }}!</h2>

        <div
          :class="isRated ? 'rated-class' : ''"
          class="row text-left flex-center"
          style="justify-content: flex-start; gap: 8px"
        >
          <q-rating
            :class="
              rating_model <= 1 ? 'red-star' : rating_model <= 3 ? 'normal-star' : rating_model >= 4 ? 'good-star' : ''
            "
            v-model="rating_model"
            size="2.4em"
            :color-selected="rating_color"
          />

          <div class="rating-score">{{ rating_model }}/5</div>
        </div>
        <div class="row justify-start text-center" style="margin-bottom: 12px; margin-top: 10px">
          <label style="margin-bottom: 5px">{{ t("your_comment") }}:</label>
          <textarea
            v-model="rating_comment"
            :placeholder="t('your_rating_label')"
            style="width: 100%"
            :disabled="isRated"
            maxlength="200"
            rows="5"
            cols="35"
          ></textarea>
        </div>
        <div style="text-align: right; margin-bottom: 12px">
          <q-btn
            style="width: 110px; border-radius: 8px"
            v-if="!isRated"
            @click="rateService"
            :disable="is_giverating"
            color="primary"
            :label="`${t('send')}`"
          ></q-btn>
        </div>
      </div>
    </div>

    <div
      v-if="!isStorageDisabled && room_status == 'CLOSED' && !isStartNewHide"
      style="text-align: center; margin-bottom: 12px"
    >
      <q-btn @click="startNewChat" class="btn-startnew" size="md" :label="`${t('start_new_conversation')}`"></q-btn>
    </div>
  </q-scroll-area>
  <page-scroller
    :target="scrollAreaRef"
    :scroll-area-info="scrollAreaInfo"
    :scroll-offset="pageScrollerTop"
    :offset="[-10, -60]"
    :count="scrollMessagesCount"
    @hide="onPageScrollerHide"
  />

  <media-preview :file="previewFile" @close="showMediaPreview = false" v-if="showMediaPreview" />
  <audio-player :audio-id="audioId" :file="audioFile" @close="showAudioPlayer = false" v-if="showAudioPlayer" />
</template>

<script>
/* eslint-disable */

import { defineComponent, ref, watch, nextTick, computed, defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import ChatFooter from "src/cs-client-web/components/chat/ChatFooter";
import ChatHeader from "src/cs-client-web/components/chat/ChatHeader";
import ChatMessage from "src/cs-client-web/components/chat/message/ChatMessage";
import FloatDateLabel from "src/cs-client-web/components/chat/parts/FloatDateLabel";
import PageScroller from "src/cs-client-web/components/chat/parts/PageScroller";
import MessageDivider from "src/cs-client-web/components/chat/message/MessageDivider";
import emitter from "src/cs-client-web/helpers/event-bus";
import collect from "collect.js";
import LocalStorage from "src/cs-client-web/utils/local-storage";
import { useChatStore } from "src/cs-client-web/stores/chat";

const AudioPlayer = defineAsyncComponent(() => import("src/cs-client-web/components/chat/media/AudioPlayer"));
const MediaPreview = defineAsyncComponent(() => import("src/cs-client-web/components/chat/media/MediaPreview"));

export default defineComponent({
  name: "ChatWindow",
  components: {
    AudioPlayer,
    MediaPreview,
    ChatHeader,
    ChatMessage,
    PageScroller,
    FloatDateLabel,
    ChatFooter,
    MessageDivider
  },
  props: {
    currentUserId: {
      type: [String, Number],
      required: true
    },
    rooms: { type: Array, default: () => [] },
    room_status: {
      type: String,
      default: () => {
        return "";
      }
    },
    roomId: {
      type: String,
      default: () => {
        return "";
      }
    },
    messages: {
      type: Array,
      default: () => {
        return [];
      }
    },
    messagesLoaded: {
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
    firstPageLoaded: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    autoScroll: {
      type: Object,
      default: () => {
        return {
          send: {
            new: true,
            newAfterScrollUp: true
          },
          receive: {
            new: true,
            newAfterScrollUp: false
          }
        };
      }
    },
    pageScrollerTop: {
      type: Number,
      default: 300
    },
    showMessagesStarted: {
      type: Boolean,
      default: true
    },
    showNewMessagesDivider: { type: Boolean, default: true },
    usernameOptions: {
      type: Object,
      default: () => ({ minUsers: 3, currentUser: false })
    }
  },
  emits: ["fetch-messages", "rate-service", "send-message", "resend-message", "startNewChat"],
  expose: ["isRateAdded", "hideStartBoard"],
  setup(props, { expose, emit }) {
    // ,"rate-service"
    const { t } = useI18n();
    const chatStore = useChatStore();
    const previewFile = ref({});
    const showMediaPreview = ref(false);
    const audioFile = ref({});
    const audioId = ref(0);
    const showAudioPlayer = ref(false);
    const newMessage = ref(null);
    const loadingMessages = ref(false);
    const scrollAreaRef = ref({});
    const infiniteScrollRef = ref({});
    const scrollAreaInfo = ref({});
    const scrollMessagesCount = ref(0);
    const currentUserId = props.currentUserId;
    const showAvatar = ref(true);

    let isMessageRendering = false;
    let infiniteIndex = 0;

    const isStartNewHide = ref(false);
    const isVoteHide = ref(false);

    const isRated = ref(false);
    const rating_model = ref(0);
    const rating_comment = ref("");

    const is_giverating = computed(() => {
      if (rating_model.value) {
        return false;
      }
      return true;
    });

    const hasRateChat = ref(chatStore.hasRateChat);

    if (props.firstPageLoaded) {
      infiniteIndex = 1;
    }

    const room = computed(() => {
      return props.rooms.find((room) => room.id === props.roomId) || {};
    });

    const showMessagesStarted = computed(() => {
      return props.showMessagesStarted && props.messages.length && props.messagesLoaded;
    });

    const infiniteScrollDisabled = computed(() => {
      // 等信息条渲染完后再次开启加载器
      return props.messagesLoaded;
    });

    // 监测新消息条
    let newMessageWatcher = watch(props.messages, (newVal) => {
      if (newMessage.value) {
        if (newMessageWatcher !== void 0) {
          newMessageWatcher();
          newMessageWatcher = void 0;
        }
        return;
      }

      try {
        newVal.forEach((message) => {
          if (!message?.seen) {
            newMessage.value = message;
            throw "Break";
          }
        });
      } catch (e) {
        if (e !== "Break") throw e;
      }
    });

    watch(
      () => props.roomId,
      (newRoomId) => {
        if (infiniteScrollRef.value) {
          infiniteScrollRef.value.reset();
          infiniteScrollRef.value.setIndex(0);
        }

        if (newRoomId && props.rooms.length) {
          const room = props.rooms.find((r) => r.roomId === newRoomId);
          fetchRoom({ room });
        }
      }
    );

    /*
    watch(() => screen.width, () => {
      showAvatar.value = screen.gt.xs;
    })
    */

    const rateService = () => {
      // console.log(rating_model.value);
      if (rating_model.value > 0 && rating_model.value <= 5) {
        emit("rate-service", rating_model.value, rating_comment.value, true);
        isRated.value = true;
      }
    };

    const hideStartBoard = (isVoted = true) => {
      if (isVoted == false) {
        isVoteHide.value = true;
        isStartNewHide.value = false;
      } else {
        isStartNewHide.value = true;
        isVoteHide.value = false;
      }
    };

    const isRateAdded = (rating, comment) => {
      rating_model.value = rating;
      rating_comment.value = comment;
      isRated.value = true;
    };

    const startNewChat = () => {
      emit("startNewChat", true);
    };

    const fetchRoom = ({ room }) => {
      emit("fetch-messages", {
        room,
        infiniteScrollRef: infiniteScrollRef.value,
        options: { reset: true }
      });
    };

    const onLoadMoreMessages = (index, done) => {
      loadingMessages.value = true;

      setTimeout(() => {
        emit("fetch-messages", {
          infiniteScroller: { index: index, done: done }
        });
        isMessageRendering = true;
        loadingMessages.value = false;
      }, 300);
    };

    emitter.on("SendMessage", async (e) => {
      const { type, content, files, replyMessage, meta, form } = e;

      if (newMessage.value) {
        newMessage.value = null;
      }

      if (newMessageWatcher !== void 0) {
        newMessageWatcher();
        newMessageWatcher = void 0;
      }

      emit("send-message", {
        type: type,
        content: content,
        files: files,
        replyMessage: replyMessage,
        meta: meta,
        form: form
      });
    });

    emitter.on("openFile", (e) => {
      let action = e.action;

      if (action === "preview") {
        previewFile.value = e.file;
        showMediaPreview.value = true;
      } else if (action === "download") {
        window.open(e.file.url, "_blank");
      }
    });

    emitter.on("AudioPlayer", async (e) => {
      let action = e.action;

      audioId.value = e.id;

      if (showAudioPlayer.value) {
        audioFile.value = {};
        showAudioPlayer.value = false;
      }

      await nextTick().then(() => {
        if (action === "play") {
          audioFile.value = e.file;
          showAudioPlayer.value = true;
        }
      });
    });

    const scrollToBottom = (latestMessage) => {
      // console.log("Scroll To Btm");

      if (scrollAreaRef.value) {
        scrollUntilBtm();

        // 解决图像未能即时加载无法跳至底部
        if (latestMessage && latestMessage.files && latestMessage.files.length) {
          const TO_BOTTOM_TRY_MAX = 10;

          let files = collect(latestMessage.files);
          let toBottomTimerCount = 0;
          let fileLoadableCount = files
            .filter((file) => {
              return "loaded" in file;
            })
            .count();

          let toBottomTimer = setInterval(() => {
            if (toBottomTimerCount > TO_BOTTOM_TRY_MAX) {
              clearInterval(toBottomTimer);
            }

            let fileLoadedCount = files
              .filter((file) => {
                return "loaded" in file && file.loaded;
              })
              .count();

            // 等待全部图像加载完成,在跳至底部
            if (fileLoadableCount === fileLoadedCount) {
              clearInterval(toBottomTimer);
              scrollUntilBtm();
            }

            toBottomTimerCount++;
          }, 500);

          return;
        }

        setTimeout(() => {
          scrollUntilBtm();
        }, 0);
      }
    };

    const onMessageAdded = (message, index, ref) => {
      // 判断不是最后一条信息忽略
      if (index !== props.messages.length - 1) {
        return;
      }

      isMessageRendering = false;

      let messageEle = ref;
      let { verticalContainerSize, verticalPosition, verticalSize } = scrollAreaRef.value.getScroll();
      let scrollTop = verticalContainerSize + verticalPosition;

      setTimeout(() => {
        let scrolledUp = verticalSize - scrollTop > messageEle.offsetHeight;

        if (message.senderId === currentUserId) {
          if (scrolledUp) {
            if (props.autoScroll.send.newAfterScrollUp) {
              scrollToBottom(message);
            }
          } else {
            if (props.autoScroll.send.new) {
              scrollToBottom(message);
            }
          }
        } else {
          if (scrolledUp) {
            if (props.autoScroll.receive.newAfterScrollUp) {
              scrollToBottom(message);
            }
          } else {
            if (props.autoScroll.receive.new) {
              scrollToBottom(message);
            }
          }

          scrollMessagesCount.value++;
        }
      }, 100);
    };

    const onResendMessage = (message) => {
      emit("resend-message", message);
    };

    const onPageScrollerHide = () => {
      scrollMessagesCount.value = 0;
    };

    const onPanelScroll = (info) => {
      scrollAreaInfo.value = info;
    };

    const rating_color = computed(() => {
      if (rating_model.value >= 4) {
        return "green";
      } else if (rating_model.value >= 3) {
        return "yellow";
      } else if (rating_model.value >= 1) {
        return "red";
      }
      return "grey";
    });

    const scrollUntilBtm = () => {
      nextTick(() => {
        const el = scrollAreaRef.value?.$el?.querySelector(".q-scrollarea__container");
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
        // scrollAreaRef.value.setScrollPercentage("vertical", 1);
      });
    };

    expose({ scrollUntilBtm });

    return {
      t,
      scrollAreaRef,
      infiniteScrollRef,
      room,
      newMessage,
      startNewChat,
      showMessagesStarted,
      previewFile,
      showMediaPreview,
      audioId,
      audioFile,
      showAudioPlayer,
      showAvatar,
      infiniteIndex,
      infiniteScrollDisabled,
      scrollAreaInfo,
      scrollMessagesCount,
      onMessageAdded,
      onResendMessage,
      onPageScrollerHide,
      onPanelScroll,
      onLoadMoreMessages,
      rating_model,
      rating_color,
      rating_comment,
      rateService,
      is_giverating,
      isRated,
      isRateAdded,
      isStartNewHide,
      isVoteHide,
      hideStartBoard,
      hasRateChat
    };
  }
});
</script>

<style lang="scss">
p {
  font-family: "Open Sans", sans-serif;
  line-height: 20px;
  font-size: 14px;
}

.reply-message {
  &-text {
    width: auto;
    min-width: 0;
    max-width: 100%;
    flex: 10000 1 0%;
  }

  &-remove {
    color: grey;
  }
}

.image {
  height: auto;
  width: 160px;
  display: inline-block;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
  vertical-align: middle;
}

.rating-section-board {
  border-radius: 20px;
  background: #f2f2f2;
  padding: 15px 25px 24px;
  width: 96%;
  margin: 0 auto 12px;
  min-width: 300px;
  min-height: 100px;

  p {
    font-size: 16px;
    color: #283853;
    font-weight: 600;
    margin-bottom: 8px;
  }

  label {
    font-size: 16px;
    font-weight: 600;
    color: #283853;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 18px;
    line-height: 18px;
    margin-bottom: 10px;
    margin-top: 0px;
    font-weight: 600;
    color: #283853;
  }

  .rating-score {
    font-size: 16px;
    font-weight: 600;
  }

  textarea {
    border-radius: 8px;
    padding: 6px 10px;
    border: 0px;

    &.disabled,
    &[disabled] {
      background: #dedede;
      opacity: 0.85 !important;
    }
  }

  .rated-class {
    pointer-events: none;
  }
}

.btn-startnew {
  background: #f67600;
  min-width: 200px;
  border-radius: 40px;
  color: white;
  height: 32px !important;
}

.q-rating {
  .q-rating__icon:not(.q-rating__icon--active) {
    color: #d0d0d0;
    opacity: 0.6;

    .text-yellow {
      color: yellow !important;
    }
  }

  &.red-star {
    color: red !important;
  }

  &.normal-star {
    color: yellow !important;
  }

  &.good-star {
    color: forestgreen !important;
  }
}
</style>
