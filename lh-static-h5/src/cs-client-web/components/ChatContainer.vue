<template>
  <div class="WAL position-relative" :style="style" :class="isChatStarted ? 'WAL-start' : ''" v-show="isPageLoaded">
    <q-layout
      view="lHh Lpr lFf"
      class="prechat-section"
      v-if="!isPreStateStatus && !isChatStarted && isPreChat && !isNoticeOpen"
    >
      <chat-header
        ref="refChatHeader"
        :room="room"
        @close-room="closeRoom"
        @rate-service="rateService"
        @hide-start="hideStartBoard"
        :isChatStarted="isChatStarted"
        :isStorageDisabled="isStorageDisabled"
        class=""
      />

      <div class="flex justify-center">
        <q-spinner-dots size="50px" style="color: #9880ff" />
      </div>
    </q-layout>

    <q-layout v-if="isChatStarted && !isNoticeClicked" view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <chat-header
        ref="refChatHeader"
        :room="room"
        @close-room="closeRoom"
        @rate-service="rateService"
        @hide-start="hideStartBoard"
        @startNewChat="startNewChat"
        :isStorageDisabled="isStorageDisabled"
        :isChatStarted="isChatStarted"
        :disable="isDuplicateTab"
        class="shadow-1"
      />

      <q-page-container style="overflow: hidden; font-family: 'Open Sans', sans-serif">
        <q-page :class="isDuplicateTab ? 'pointer-none' : ''">
          <div class="notice-box" v-if="isNoticeOpen">
            <span class="notice-span" @click="openNoticePage">{{ t("got_new_notice") }}</span>
            <span class="close-notice-btn" @click="hideNoticeModal">
              <q-icon name="close"></q-icon>
            </span>
          </div>

          <div class="duplicate-box-top" v-if="isDuplicateTab">
            <span class="duplicate-span">{{ t("duplicated_tab_detected") }}</span>
          </div>

          <chat-window
            :current-user-id="currentUserId"
            :rooms="roomList"
            :room-id="roomId"
            :messages="messages"
            :room_status="room_status"
            :messagesLoaded="messagesLoaded"
            :firstPageLoaded="firstPageLoaded"
            :isStorageDisabled="isStorageDisabled"
            :show-messages-started="false"
            @send-message="sendMessage"
            @resend-message="resendMessage"
            @fetch-messages="fetchMessages"
            @startNewChat="startNewChat"
            @rate-service="rateService"
            ref="refChatWindow"
          />
        </q-page>
      </q-page-container>

      <div class="duplicate-box-bottom" v-if="isDuplicateTab">
        <q-btn
          color="primary"
          class=""
          size="md"
          @click="useThisChatBoard"
          icon-right="send"
          unelevated
          rounded
          style="width: 50%"
          :label="t('recover_chat')"
        />
      </div>

      <chat-footer
        :room="room"
        :room-id="roomId"
        :is_typing="is_typing"
        :is_rated="isRated"
        :isStorageDisabled="isStorageDisabled"
        :typing_username="typing_username"
        :disable="footerDisabled"
        @openRateBoard="openRateBoard"
      />
      <dialog-paste-image />

      <q-dialog class="modal-rating" v-model="isRateDialogModel">
        <q-card width="330px">
          <q-card-section class="">
            <RatingBoard :rating_comment="rating_comment" @updateRatingModel="updateRatingModel" :t="t" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="t('confirm.ok')" @click="confirmRateChat" :disable="has_giverating" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-layout>

    <q-layout
      view="lHh Lpr lFf"
      class="prechat-section"
      v-if="isPreStateStatus && !isChatStarted && isPreChat && !isNoticeOpen"
    >
      <chat-header
        ref="refChatHeader"
        :room="room"
        @close-room="closeRoom"
        @rate-service="rateService"
        @hide-start="hideStartBoard"
        :isChatStarted="isChatStarted"
        :isStorageDisabled="isStorageDisabled"
        class="shadow-1"
      />

      <div class="prechat-intro" v-html="preIntro"></div>

      <div class="prechat-form">
        <q-item>
          <q-item-section>
            <q-item-label>
              <span class="text-red">*</span>
              {{ t("account_name") }}
            </q-item-label>
            <q-item-label caption>
              <q-input
                ref="refLoginName"
                v-model="loginName"
                :disable="footerDisabled"
                clearable
                rounded
                outlined
                :rules="[(val) => !!val || t('field_required')]"
                :dense="true"
                :placeholder="t('account_name')"
              />
            </q-item-label>
            <q-item-label v-if="partnerCode === 'Play4WinCS'">
              <span class="text-red" style="padding-top: 3px; padding-bottom: 5px">
                Visitors please input your name or register on our website.
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="questionTypes">
          <q-item-section>
            <q-item-label>
              <span class="text-red">*</span>
              {{ t("select_your_question") }}
            </q-item-label>
            <q-item-label caption>
              <q-select
                class="select-input"
                ref="refQuestionType"
                rounded
                outlined
                v-model="selectedType"
                :dense="true"
                :disable="footerDisabled"
                :rules="[(val) => !!val || t('field_required')]"
                :options="questionTypes"
                clearable
                :autofocus="false"
                :label="t('select_your_question')"
                :label-slot="true"
                @popup-show="handleOpenPopup"
                :standout="false"
              >
                <template v-slot:label>
                  {{ t("select_your_question") }}
                </template>
              </q-select>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section class="start-chat-btn">
            <q-item-label>
              <q-btn
                color="primary"
                class="full-width login-btn"
                size="lg"
                @click="startPreTalk"
                icon-right="send"
                :disable="footerDisabled"
                unelevated
                rounded
                :label="t('start_chat')"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <div class="duplicate-box" v-if="isDuplicateTab">
        <span class="duplicate-span">{{ t("duplicated_tab_detected") }}</span>
        <q-btn color="primary" size="md" class="duplicate-span" @click="useThisChatBoard">
          {{ t("recover_chat") }}
        </q-btn>
      </div>
      <div class="duplicate-box" v-if="footerDisabled && isPreStateStatus && isPreChat">
        <span class="duplicate-span">{{ t("sess_timeout") }}</span>
        <q-btn color="primary" size="md" class="duplicate-span" @click="useThisChatBoard">
          {{ t("start_new_conversation") }}
        </q-btn>
      </div>
    </q-layout>

    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-layout
        view="lHh Lpr lFf"
        class="notice-section"
        transition-show="jump-down"
        transition-hide="jump-up"
        v-if="isNoticeOpen && (!isChatStarted || isNoticeClicked)"
      >
        <chat-header
          ref="refChatHeader"
          :room="room"
          @close-room="closeRoom"
          @rate-service="rateService"
          @hide-start="hideStartBoard"
          @startNewChat="startNewChat"
          :isChatStarted="isChatStarted"
          :isStorageDisabled="isStorageDisabled"
          class="shadow-1"
        />

        <div class="notice-board">
          <template v-if="room.avatar">
            <q-avatar color="grey-3 q-mt-xs" size="32px">
              <img :src="room.avatar" />
            </q-avatar>
          </template>
          <template v-else>
            <div class="bg-grey-3 q-mt-xs">
              <q-icon name="person" size="32px" color="grey-6" />
            </div>
          </template>

          <div style="position: relative; flex: 1">
            <div class="notice-message" v-html="notice_msg"></div>
          </div>

          <div class="message-stamp">{{ notice_timestamp }}</div>
        </div>

        <q-btn
          color="primary"
          class="q-mt-lg"
          size="md"
          @click="closeNotice"
          icon-right="send"
          unelevated
          rounded
          style="width: 60%"
          :label="chatLabel"
        />
      </q-layout>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import ChatHeader from "src/cs-client-web/components/chat/ChatHeader";
import ChatFooter from "src/cs-client-web/components/chat/ChatFooter";
import ChatWindow from "src/cs-client-web/components/chat/ChatWindow";
import { useI18n } from "vue-i18n";
import { useChatStore } from "src/cs-client-web/stores/chat";
import { useUserStore } from "src/cs-client-web/stores/user";
import { useSocketStore } from "src/cs-client-web/stores/socket";
import { userStore as storeUser } from "src/stores";
import { storeToRefs } from "pinia";
import useSocket from "src/cs-client-web/composables/use-socket";
import chatEnum from "src/cs-client-web/enum/chatEnum";
import moment from "moment";
import { parseTimestamp } from "src/cs-client-web/utils/dates";
import collect from "collect.js";
import isEmpty from "lodash/isEmpty";
import findIndex from "lodash/findIndex";
import debounce from "lodash/debounce";
import isString from "lodash/isString";
import { strToJSON, uid } from "src/cs-client-web/utils/string";
import emitter from "src/cs-client-web/helpers/event-bus";
import DialogPasteImage from "src/cs-client-web/components/chat/DialogPasteImage";
import LocalStorage from "src/cs-client-web/utils/local-storage";
import { useQuasar, QSpinnerDots, SessionStorage } from "quasar";
import { sessionConfig } from "src/cs-client-web/constants";
import { useRouter, useRoute } from "vue-router";
import RatingBoard from "src/cs-client-web/components/chat/parts/RatingBoard.vue";

// require("jquery-idletimer/dist/idle-timer.1.1.1.min");

function attachHref(e) {
  if (e.target.tagName.toLowerCase() === "a") {
    e.preventDefault();

    let href = e.target.href;

    if (href) {
      window.open(href, "_blank");
    }
  }
}

export default defineComponent({
  name: "ChatContainer",
  components: { DialogPasteImage, ChatWindow, ChatFooter, ChatHeader, RatingBoard },
  props: {
    room: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const { wsDisconnect, wsConnect, socketOnMessage, socketSendObj } = useSocket();
    const chatStore = useChatStore();
    const userStore = useUserStore();
    const socketStore = useSocketStore();
    const store = storeUser();
    const { roomList, isChatEnded, sendMessages, chatFreeze } = storeToRefs(chatStore);
    const { userId, nickname, token } = storeToRefs(userStore);
    const { isConnected } = storeToRefs(socketStore);
    const messages = ref([]);
    const messagesLoaded = ref(false);
    const firstPageLoaded = ref(false);
    const footerDisabled = ref(false);
    const prechatDisabled = ref(false);
    const refChatHeader = ref(null);
    const refChatWindow = ref();

    const isPageLoaded = ref(false);

    const isDuplicateTab = computed(() => {
      return socketStore.duplicateTabError;
    });

    const notice_msg = ref("");
    const isNoticeOpen = ref(false);

    //IF BackEnd Set PreChatState to true, this one will be true, if not will be false.
    const isPreStateStatus = ref(false);

    const isNoticeClicked = ref(false);

    const isPreChat = ref(false);
    const isChatStarted = ref(false);
    const refLoginName = ref(null);
    const refQuestionType = ref(null);

    const loginName = ref("");
    const selectedType = ref("");

    const questionTypes = ref([]);
    const preIntro = ref("");

    const notice_timestamp = ref("");

    const partnerCode = computed(() => {
      return LocalStorage.get("partnerCode");
    });

    const currentUserId = userId.value;
    // const roomId = ref(_room.value.id);

    const isStorageDisabled = computed(() => {
      return !userStore.is_storage_enabled;
    });

    const chatLabel = computed(() => {
      return isNoticeClicked ? t("continue_chat") : t("start_chat");
    });

    const _room = computed(() => {
      return props.room ? props.room : {};
    });

    const roomId = computed(() => {
      return _room.value && _room.value.id ? _room.value.id : "";
    });

    const avatarUrl = ref(_room.value && _room.value.avatar ? _room.value.avatar : "");

    const room_status = computed(() => {
      return _room.value && _room.value.status ? _room.value.status : "";
    });

    let sessResumeSuccess = false;
    let sessTimeoutDialogShown = false;
    const currentParentUrl = ref("");
    const isUrlSend = ref(false);

    const is_typing = ref(false);
    const typing_username = ref("");

    if (_room.value) {
      _room.value.newCount = 0;
    }

    const isRated = ref(false);
    const isRateDialogModel = ref(false);
    const openRateBoard = () => {
      // console.log("openRateBoard");
      isRateDialogModel.value = true;
    };

    const rating_comment = ref("");
    const rating_model = ref(0);

    const updateRatingModel = (rating, comment) => {
      // console.log("Tis" + comment);
      rating_model.value = rating;
      rating_comment.value = comment;
    };

    const confirmRateChat = () => {
      isRateDialogModel.value = false;
      // console.log(rating_model.value);
      // console.log(rating_comment.value);

      rateService(rating_model.value, rating_comment.value);

      $q.notify({
        type: "success",
        message: t("rate_submitted")
      });
    };

    function closeWin() {
      try {
        window.close();
      } catch (e) {
        console.log(e);
      }
    }

    function sessTimeout(reLogin = false) {
      if (sessTimeoutDialogShown) {
        return;
      }

      if (reLogin) {
        // console.log("Got relogin")
        chatFreeze.value = false;
        userStore.prepareForReLogin();
      }
      if (chatStore.mode_type === "3") {
        startNewChat(true, true);
        return;
      }

      sessTimeoutDialogShown = true;

      store.chatGuid = "";

      if (reLogin) {
        console.log("Dc2 HERE");
        wsDisconnect();

        window.parent.postMessage("sess_timeout", "*");

        LocalStorage.remove("loginDetails");
        LocalStorage.remove("isChatStarted");

        // startNewChat(true, true);
      } else {
        window.location.reload();
      }

      // $q.dialog({
      //   title: "",
      //   message: t("sess_timeout"),
      //   ok: t("start_new_chat"),
      //   class: "modal-endchat",
      //   cancel: null,
      //   persistent: true,
      //   noBackdropDismiss: true
      // }).onOk(() => {
      //   if (reLogin) {
      //     console.log("Dc2 HERE");
      //     wsDisconnect();

      //     window.parent.postMessage("sess_timeout", "*");

      //     LocalStorage.remove("loginDetails");
      //     LocalStorage.remove("isChatStarted");

      //     startNewChat(true, true);
      //   } else {
      //     window.location.reload();
      //   }
      // });
    }

    let checkResumeInterval;
    let sessResumeRetryCounter = 0;

    const isTest = SessionStorage.getItem("isTest");

    function sessResume() {
      let checkResumeCounter = 0;

      sessResumeSuccess = false;
      sessResumeRetryCounter++;

      if (checkResumeInterval) {
        clearInterval(checkResumeInterval);
      }

      // console.log("Resume Here");

      $q.loading.show({
        spinner: QSpinnerDots,
        spinnerColor: "#9880ff",
        message: t("socket.reconnecting")
      });

      // console.log("Resume Session");
      // alert(token.value.length + " " + token.value);

      var parentPage = currentParentUrl.value != "" ? currentParentUrl.value : LocalStorage.get("referrer");

      socketSendObj({
        cmd: chatEnum.CMD_SESS_RESUME,
        body: {
          token: token.value,
          page: parentPage
        }
      });

      isUrlSend.value = true;

      let chatStarted = LocalStorage.get("isChatStarted");
      isChatStarted.value = chatStarted ? true : false;

      // console.log("sessResume Here");
      if (isChatStarted.value == false && isPreChat.value == false) {
        clearInterval(checkResumeInterval);

        var quess = LocalStorage.get("questionTypes");
        var preChat = LocalStorage.get("preChat");
        questionTypes.value = JSON.parse(quess);
        preIntro.value = JSON.parse(preChat);

        isPreStateStatus.value = true;
        isPreChat.value = true;
        sessResumeSuccess = true;
        chatFreeze.value = false;
        footerDisabled.value = false;
        $q.loading.hide();

        setTimeout(() => {
          isPageLoaded.value = true;
          if (!preChat) {
            isChatStarted.value = true;
          }
        }, 250);
        return;
      }

      checkResumeInterval = setInterval(() => {
        if (checkResumeCounter >= 25) {
          // console.log("Retry more than 25");
          $q.loading.hide();

          clearInterval(checkResumeInterval);

          if (sessResumeRetryCounter > 0) {
            sessResumeRetryCounter = 0;
            sessTimeout(true);
          } else {
            // console.log("Resume 1 more time.");
            // sessTimeout(true);
            sessResume();
          }

          return;
        }

        checkResumeCounter++;

        // console.log("Ok Success resume");
        // console.log(sessResumeRetryCounter);
        // console.log("pre Chat" + isPreChat.value);

        if (sessResumeSuccess || isPreChat.value === true) {
          clearInterval(checkResumeInterval);
          $q.loading.hide();
          chatFreeze.value = false;
          footerDisabled.value = false;
          isPageLoaded.value = true;
        }
      }, 100);
    }

    function isSessTimeout() {
      let lastActiveAt = LocalStorage.get("lastActiveAt");

      if (lastActiveAt) {
        let inActiveInSeconds = moment().diff(lastActiveAt, "seconds");
        // console.log(inActiveInSeconds);

        return inActiveInSeconds > sessionConfig.TIMEOUT;
      }

      return true;
    }

    function handleVisibilityChange() {
      let wsLoggedIn = LocalStorage.get("wsLoggedIn", null);

      // console.log("Handle here");

      if (wsLoggedIn !== null && !wsLoggedIn) {
        sessTimeout();
        return;
      }

      // console.log("Check");
      // console.log(document.visibilityState)

      if (document.visibilityState === "hidden") {
        // console.log("hidden so we close room");
        if (isStorageDisabled.value === true) {
          closeRoom(_room.value);
        } else {
          LocalStorage.set("avatarUrl", avatarUrl.value);
          LocalStorage.set("lastActiveAt", moment().utc().valueOf());
          wsDisconnect();
          chatFreeze.value = true;
          footerDisabled.value = true;
          prechatDisabled.value = true;
        }
      } else {
        if (!isSessTimeout()) {
          avatarUrl.value = LocalStorage.get("avatarUrl");
          messages.value = LocalStorage.get("messageList", []);
          sendMessages.value = LocalStorage.get("sendMessageList", []);

          let ws = LocalStorage.get("ws");
          wsConnect(ws);
        } else {
          sessTimeout(true);
        }
      }
    }

    onMounted(async () => {
      if (isTest) {
        alert("in Chat Room 4");
      }

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // 关闭游览器前执行所要的事情
      window.onbeforeunload = function () {
        if (isTest) {
          alert("window.onbeforeunload");
        }
        // console.log("onbeforeunload");
        if (_room.value.status !== "CLOSED") {
          if (isTest) {
            alert("Before unload room not closed.");
          }
          // if (!["CLOSED", "WAIT_MATCH"].includes(_room.value.status)) {
          LocalStorage.set("wsLoggedIn", true);
          LocalStorage.set("avatarUrl", avatarUrl.value);
          LocalStorage.set("lastActiveAt", moment().utc().valueOf());
        } else {
          userStore.logout();
        }
      };

      if (LocalStorage.get("wsLoggedIn")) {
        // console.log('继续上次聊天');
        if (isTest) {
          alert("继续上次聊天!");
        }

        if (!isSessTimeout()) {
          avatarUrl.value = LocalStorage.get("avatarUrl");
          messages.value = LocalStorage.get("messageList", []);
          sendMessages.value = LocalStorage.get("sendMessageList", []);

          sessResume();
        } else {
          avatarUrl.value = LocalStorage.get("avatarUrl");
          messages.value = LocalStorage.get("messageList", []);
          sendMessages.value = LocalStorage.get("sendMessageList", []);

          sessResume();
        }
      } else {
        socketSendObj({
          cmd: chatEnum.CMD_SESS_LOGIN,
          body: {
            token: token.value,
            page: currentParentUrl.value != "" ? currentParentUrl.value : LocalStorage.get("referrer")
          }
        });

        isUrlSend.value = true;
        // console.log("THIS");
        LocalStorage.set("wsLoggedIn", true);

        // setTimeout(() => {
        //   $q.loading.hide();
        // }, 300)
      }

      if (!isConnected.value) {
        return;
      }

      document.addEventListener(`click`, attachHref);

      // console.log("init Window Listener");
      window.addEventListener("message", function (event) {
        // console.log("Message received from the parent: " + event.data); // Message received from parent
        if (isString(event.data)) {
          if (event.data == "openwindow") {
            const qPageDom = document.querySelector(".q-page");
            qPageDom.style.filter = "none";
            // console.log("isNoticeOpen.value" + isNoticeOpen.value);
            // console.log("isPreStateStatus.value" + isPreStateStatus.value);
            // console.log("isChatStarted.value" + isChatStarted.value);
            // console.log("questionTypes.value" + questionTypes.value);

            if (
              isNoticeOpen.value === false &&
              isPreStateStatus.value === false &&
              isChatStarted.value === false &&
              questionTypes.value.length === 0
            ) {
              NonPreChatStartChat();
              setTimeout(() => {
                if (isPreStateStatus.value === false) {
                  NonPreChatStartChat();
                }
              }, 3000);
            }

            if (
              isNoticeOpen.value === true &&
              isChatStarted.value === true &&
              (!questionTypes.value || questionTypes.value.length === 0)
            ) {
              isNoticeClicked.value = true;
            }

            if (refChatWindow.value) {
              refChatWindow.value.scrollUntilBtm();
            }
          } else if (event.data.indexOf("changeurl:") > -1) {
            var indexStr = event.data.indexOf(":");
            var parentUrl = event.data.substr(indexStr + 1);
            currentParentUrl.value = parentUrl;
            // console.log("url: " + currentParentUrl.value);
            window.parent.postMessage("receiveurl", "*");

            console.log(parentUrl);
            if (parentUrl.indexOf("/liveChat") > -1) {
              console.log("IS /liveChat Url");
              if (isPreStateStatus.value === false) {
                setTimeout(() => {
                  if (isPreStateStatus.value === false && isChatStarted.value === false) {
                    NonPreChatStartChat();
                  }
                }, 1000);
                setTimeout(() => {
                  if (isPreStateStatus.value === false && isChatStarted.value === false) {
                    NonPreChatStartChat();
                  }
                }, 3000);
              }
            }
          } else if (event.data.indexOf("updateurl:") > -1) {
            var indexStr = event.data.indexOf(":");
            var parentUrl = event.data.substr(indexStr + 1);
            currentParentUrl.value = parentUrl;
            // console.log("url: " + currentParentUrl.value);
            window.parent.postMessage("receiveurl", "*");
          }
        }
      });

      // console.log("WsOnMessage");
      socketOnMessage(WSOnMessage);

      //FOR TESTING.
      // setTimeout(() => {
      //   sessTimeout(true);
      // }, 10000);
    });

    const sendUrlUpdate = (url) => {
      // console.log(chatEnum.CMD_CHANGE_PAGE);

      socketSendObj({
        cmd: chatEnum.CMD_SEND_REDIRECT,
        body: {
          redirectCmd: chatEnum.CMD_CHANGE_PAGE,
          to: userStore.to_id,
          guestId: userStore.userId,
          page: url
        }
      });
    };

    watch(currentParentUrl, (newUrl, oldUrl) => {
      // console.log("url Changed")
      // console.log(newUrl);
      // console.log("ius Send:" + isUrlSend.value);
      if (newUrl != "") {
        sendUrlUpdate(newUrl);
      }
    });

    watch(
      isDuplicateTab,
      (newVar) => {
        // console.log("Changed Here");
        if (newVar == true) {
          wsDisconnect();
        }
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      let newMessages = _room.value.newMessages;

      if (newMessages) {
        _room.value.messagesHistory.push(...newMessages);
        _room.value.newMessages = [];
      }

      document.removeEventListener(`click`, attachHref);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    });

    const style = computed(() => ({
      height: $q.screen.height + "px"
    }));

    function processOnMessage(cmd, data) {
      let message = {};
      let subCmd = data?.redirectCmd ?? null;
      let msgType = data?.type ?? "text";
      let msgMeta = data?.meta || {};
      let formId = data?._formId ?? "";
      let msgId = data?.id ?? data?.msgId ?? uid();

      let baseMessage = {
        id: msgId,
        _id: data?._id ?? uid(),
        remoteId: data?.msgId ?? 0,
        senderId: data?.senderId ?? "sys",
        senderName: data?.senderName ?? "sys",
        avatarUrl: avatarUrl.value,
        type: msgType,
        content: data?.msg || "",
        files: data?.files ?? [],
        meta: msgMeta,
        seen: false,
        status: 4,
        timestamp: moment().utc().valueOf()
      };

      if (cmd === chatEnum.CMD_SEND_SERVER_RECEIVED) {
        let remoteMsgId = msgId;
        message = getMessageById(data._id);

        if (message) {
          message.id = remoteMsgId;
          message.status = 4;

          let newMessage = collect(_room.value.newMessages).where("_id", data._id).first();

          if (newMessage) {
            newMessage.id = remoteMsgId;
            newMessage.status = 4;
          }
        }

        return;
      }

      if (cmd === chatEnum.CMD_RECEIVED) {
        message = {
          ...baseMessage
        };

        window.parent.postMessage("receivemsg" + ":" + JSON.stringify(data.msg), "*");

        // console.log("RECEIVE LE");
        // console.log(message);

        if (msgType === "options") {
          let metaDesc = msgMeta?.description ?? t("select_option");
          let metaItems = msgMeta?.items ?? [];

          if (metaItems.length > 0) {
            message.content = metaDesc;
          }
        }

        if (msgType === "form") {
          message._formId = uid();
          message.formStatus = 0;

          if (msgMeta.type === "SEND_LOGIN_NAME") {
            message.content = t("form.send_login_name");
          }

          if (msgMeta.type === "LOGIN_PASSWORD") {
            message.content = t("form.login_password");
          }
        }

        if (formId) {
          if (subCmd === chatEnum.CMD_LOGIN_ERROR) {
            emitter.emit("chat:form-response", {
              formId: formId,
              code: 1,
              errorMsg: data?.message ?? t("sys_exception")
            });
          } else if (subCmd === chatEnum.CMD_LOGIN_SUCCESS) {
            emitter.emit("chat:form-response", { formId: formId, code: 2 });
          }

          return;
        }
      } else if (cmd === chatEnum.CMD_USER_JOINED) {
        // console.log(data);
        // console.log("USER JOINED");

        let nickname = data.nickname ?? "CS";

        message = {
          ...baseMessage,
          senderId: "sys",
          type: "sys",
          content: t("message_user_joined", { user: nickname })
        };

        avatarUrl.value = data.head;

        footerDisabled.value = false;
      } else if (cmd === chatEnum.CMD_ROOM_ENDED) {
        console.log("Cmd Room Ended");

        _room.value.status = "CLOSED";
        isChatEnded.value = true;
        footerDisabled.value = true;
        chatFreeze.value = true;

        message = {
          ...baseMessage,
          senderId: "sys",
          type: "end",
          content: t("message_chat_end")
        };

        setTimeout(() => {
          // console.log(refChatWindow.value);
          // console.log(chatStore.mode_type);

          if (chatStore.mode_type) {
            console.log("after 30 secs, start new");
            startNewChat(false);
          }
        }, 30000);
      } else if (cmd === chatEnum.CMD_DATA_UNREACHABLE) {
        message = {
          ...baseMessage,
          senderId: "sys",
          type: "text",
          content: t("message_unreachable")
        };
      } else if (cmd === chatEnum.CMD_LOGIN_REQUIRED) {
        message = {
          ...baseMessage,
          senderId: "sys",
          type: "text",
          content: t("message_login_required")
        };
      } else if (cmd === chatEnum.CMD_WAIT_SERVE) {
        message = {
          ...baseMessage,
          senderId: "sys",
          type: "text",
          content: t("message_wait_match")
        };
      } else if (cmd === chatEnum.CMD_RESUME_SUCCESS) {
        sessResumeSuccess = true;
      } else if (cmd === chatEnum.CMD_MSG_RECALL) {
        // console.log("RECALL EHRE");
        // console.log(data);
        // console.log(messages.value);
        let msgId = data.msgId ? data.msgId : "";
        let findIndex = messages.value.findIndex((x) => {
          return x._id === msgId;
        });
        if (findIndex > -1) {
          messages.value[findIndex]["status"] = -1;
          messages.value[findIndex]["deleted"] = -1;
        }
      } else if (cmd === chatEnum.CMD_MSG_TYPING) {
        // console.log("IS Typing");

        is_typing.value = true;
        _debounce_typing();
        typing_username.value = data.nickName ? data.nickName : "";
      } else if (cmd === chatEnum.CMD_SEND_MSG_BEFORE_MATCH) {
        // console.log("CMD_SEND_MSG_BEFORE_MATCH");
        // console.log(data);
        if (data?.SEND_MSG_BEFORE_MATCH === 0) {
          footerDisabled.value = true;
        } else {
          footerDisabled.value = false;
        }
      }

      if (!isEmpty(message)) {
        is_typing.value = false;
        _room.value.newMessages.push(message);

        // 新消息加前面
        addMessages(message);
      }
    }

    const _debounce_typing = debounce(() => {
      // console.log("back to false");
      is_typing.value = false;
      typing_username.value = "";
    }, 3000);

    async function WSOnMessage(payload) {
      //ONMESSAGEHERE
      // console.log('On message: ', payload);

      let { cmd, body } = payload;
      let data = strToJSON(body);

      if (cmd === chatEnum.CMD_RESUME_SUCCESS) {
        // console.log("resume here");

        sessResumeSuccess = true;

        if (data.message) {
          collect(data.message)
            .where("cmd", 4)
            .each((item) => {
              processOnMessage(item.cmd, strToJSON(item.body));
            });
        }
        isChatStarted.value = true;
        isPageLoaded.value = true;

        return;
      } else if (cmd === chatEnum.CMD_PRECHAT_SURVEY) {
        // console.log("CMD_PRECHAT_SURVEY");
        // console.log(data);

        if (data.preChatSurveyState && data.preChatSurveyState === true) {
          isPreChat.value = true;
          preIntro.value = data.intro;
          questionTypes.value = data.questionTypes;

          isPreStateStatus.value = true;

          LocalStorage.set("questionTypes", JSON.stringify(questionTypes.value));
          LocalStorage.set("preChat", JSON.stringify(preIntro.value));
        } else {
          isPreStateStatus.value = false;

          if (LocalStorage.get("newchat") || chatStore.mode_type == "") {
            NonPreChatStartChat();
            LocalStorage.remove("newchat");
            setTimeout(() => {
              if (isChatStarted.value == false) {
                NonPreChatStartChat();
              }
            }, 3000);
          }

          isPreChat.value = true;
          questionTypes.value = [];
        }

        isPageLoaded.value = true;

        if (data.rateChat && data.rateChat == 1) {
          chatStore.hasRateChat = true;
        }

        return;
      } else if (isChatStarted.value == false && cmd === chatEnum.CMD_RECEIVED) {
        isChatStarted.value = true;
      } else if (cmd == chatEnum.CMD_RECEIVE_NOTICE) {
        // console.log("Receive Notice");
        // console.log(data);

        notice_msg.value = data.msg ? convertSelfUrl(data.msg) : "";
        isNoticeOpen.value = true;

        notice_timestamp.value = moment().format("hh:mm A");

        window.parent.postMessage("receivemsg" + ":notice", "*");
      }

      processOnMessage(cmd, data);
    }

    const closeNotice = () => {
      isNoticeClicked.value = false;
      isNoticeOpen.value = false;
      // console.log("Close Notice: " + isPreStateStatus.value);

      if (isPreStateStatus.value === true) {
        notice_msg.value = "";
        notice_timestamp.value = "";
      } else if (isChatStarted.value == false) {
        window.parent.postMessage("closenotice", "*");
      } else {
        NonPreChatStartChat();
      }
    };

    const NonPreChatStartChat = () => {
      socketSendObj({
        cmd: chatEnum.CMD_GUEST_START_CHAT,
        body: {}
      });

      isChatStarted.value = true;
      LocalStorage.set("isChatStarted", "1");
    };

    const convertSelfUrl = (message) => {
      if (message.indexOf('href="/') > -1) {
        var originUrl = currentParentUrl.value.substring(0, getPosition(currentParentUrl.value, "/", 3));
        message = message.replaceAll('href="/', ' target="_self" ' + 'href="' + originUrl + "/");
      }

      return message;
    };

    const getPosition = (string, subString, index) => {
      return string.split(subString, index).join(subString).length;
    };

    const startNewChat = async (isStartNew, isCloseRoom = true) => {
      // debugger;
      // console.log("Start New Chat: " + isStartNew);

      isNoticeOpen.value = false;
      isNoticeClicked.value = false;

      var partnerId = LocalStorage.get("partnerId");
      var partnerCode = LocalStorage.get("partnerCode");

      var lang = LocalStorage.get("lang");
      var way = LocalStorage.get("way");
      var _token = LocalStorage.get("pretoken");
      var type = LocalStorage.get("type");
      var deviceId = LocalStorage.get("deviceId");

      var referrer_url = LocalStorage.get("referrer") ? LocalStorage.get("referrer") : "";

      hideStartBoard();

      // console.log(_room.value.status);
      if (_room.value.status !== "CLOSED" && isCloseRoom) {
        closeRoom();
      }

      if (!(chatFreeze || isChatEnded)) {
        // emit("close-room", props.room);
      } else {
        LocalStorage.set("partnerCode", partnerCode);
        LocalStorage.set("partnerId", partnerId);
        LocalStorage.set("lang", lang);
        LocalStorage.set("way", way);
        LocalStorage.set("type", type);
        LocalStorage.set("deviceId", deviceId);
      }

      var tokenUrl = "";
      if (_token) {
        tokenUrl = `&token=${_token}`;
      }
      var startnew = "";
      if (isStartNew === true) {
        startnew = "&newchat=true";
      } else {
        startnew = "&restartnew=true";
        window.parent.postMessage("minimize", "*");
      }

      var partnerText = "";
      if (partnerCode) {
        partnerText = `partnerCode=${partnerCode}`;
      } else {
        partnerText = `partnerId=${partnerId}`;
      }

      var deviceText = "";
      if (deviceId) {
        deviceText = `&deviceId=${deviceId}`;
      }

      var origin_url = window.location.origin;
      var url = `${origin_url}/liveChat?${partnerText}&way=${way}&lang=${lang}&type=${type}${deviceText}${startnew}&referral=${referrer_url}${tokenUrl}`;
      // console.log(url);

      setTimeout(() => {
        window.parent.postMessage("startnew", "*");
        window.location.href = url;
      }, 1000);
    };

    const startPreTalk = () => {
      refLoginName.value.validate();
      if (questionTypes.value) {
        refQuestionType.value.validate();
      }
      if (refLoginName.value.hasError || (questionTypes.value && refQuestionType.value.hasError)) {
        return;
      }

      socketSendObj({
        cmd: chatEnum.CMD_GUEST_START_CHAT,
        body: {
          loginName: loginName.value,
          questionType: selectedType.value
        }
      });

      isChatStarted.value = true;
      isPageLoaded.value = true;
      LocalStorage.set("isChatStarted", "1");
    };

    watch(isConnected, (newVal) => {
      if (newVal) {
        if (LocalStorage.get("wsLoggedIn", false)) {
          // console.log('绑定OnMessage');

          socketOnMessage(WSOnMessage);

          sessResume();
        }
      } else {
        // console.log("Disconnected.");
        chatFreeze.value = true;
        footerDisabled.value = true;
        prechatDisabled.value = true;
      }
    });

    watch(
      messages,
      (newVal) => {
        if (newVal && _room.value.status !== "CLOSED") {
          LocalStorage.set("messageList", newVal);
        }
      },
      { deep: true }
    );

    watch(
      sendMessages,
      (newVal) => {
        if (newVal) {
          LocalStorage.set("sendMessageList", newVal);
        }
      },
      { deep: true }
    );

    function getMessageById(id) {
      let index = findIndex(messages.value, (x) => x._id === id);

      return index > -1 ? messages.value[index] : null;
    }

    const formatMessage = (message) => {
      let name = message.senderName ?? "";

      return {
        ...message,
        ...{
          senderId: message.senderId,
          time: moment(message.timestamp).format("h:mm A"),
          date: parseTimestamp(message.timestamp),
          username: name,
          name: name
        }
      };
    };

    const formattedFiles = (files) => {
      const formattedFiles = [];

      files.forEach((file) => {
        const messageFile = {
          name: file.name,
          size: file.size ?? 0,
          type: file.type,
          extension: file.extension || file.type,
          url: file.url || file.localUrl
        };

        if (file.audio) {
          messageFile.audio = true;
          messageFile.duration = file.duration;
        }

        formattedFiles.push(messageFile);
      });

      return formattedFiles;
    };

    const addMessages = (data, insertStart = false) => {
      if (!data) {
        return;
      }

      if (!Array.isArray(data)) {
        data = [data];
      }

      collect(data)
        .when(insertStart, (items) => items.reverse())
        .each((message) => {
          const formattedMessage = formatMessage(message);

          if (!insertStart) {
            messages.value.push(formattedMessage);
            return;
          }

          messages.value.unshift(formattedMessage);
        });
    };

    const sendMessage = ({ type, content, files, meta, form = {} }) => {
      let id = uid();
      let _id = uid();
      let addToChatMsg = true;

      let message = {
        id: id,
        _id: _id,
        senderId: currentUserId,
        senderName: nickname.value,
        avatarUrl: require("src/cs-client-web/assets/user.png"),
        type: type,
        content: content,
        files: files,
        seen: true,
        status: 1,
        timestamp: moment().utc().valueOf()
      };

      if (files) {
        // upload files
        message.files = formattedFiles(files);
      }

      let msgObj = {
        id: id,
        _id: _id,
        senderId: userId.value,
        senderName: nickname.value,
        msg: content,
        to: props.room.id,
        type: type
      };

      if (files) {
        msgObj.files = files;
      }

      if (type === "sys" || type === "button_reply") {
        msgObj.save = false;
      }

      if (type === "button_reply" && !isEmpty(form)) {
        addToChatMsg = false;
        msgObj._formId = form.id;
        msgObj.itemType = form.name;

        if (form.name === "SEND_LOGIN_NAME") {
          msgObj.loginName = form.fields[0].model;
        } else if (form.name === "LOGIN_PASSWORD") {
          msgObj.loginName = form.fields[0].model;
          msgObj.password = form.fields[1].model;
        }
      }

      if (type === "option_reply") {
        addToChatMsg = false;
        msgObj.itemId = "" + meta.items[0].id;
        msgObj.apiCode = meta.items[0].apiCode;
        msgObj.itemType = meta.items[0].itemType;
        msgObj.msg = "";
      }

      if (type === "option_selected") {
        msgObj.msg = "";
        msgObj.meta = meta;
        msgObj.save = false;
        message.status = 4;
        message.content = "";
        message.meta = meta;
        _room.value.newMessages.push(message);
      }

      socketSendObj({
        cmd: chatEnum.CMD_SEND,
        body: msgObj
      });

      chatStore.addSendMessage(msgObj);

      if (addToChatMsg) {
        addMessages(message);
      }

      refChatWindow.value.scrollUntilBtm();

      if (type === "option_selected" && meta.items[0].itemType === "LOGIN_PASSWORD") {
        addMessages({
          id: uid(),
          _id: uid(),
          senderId: "sys",
          senderName: "sys",
          avatarUrl: avatarUrl.value,
          type: "form",
          files: [],
          seen: false,
          status: 4,
          timestamp: moment().utc().valueOf(),
          _formId: uid(),
          content: t("form.login_password"),
          meta: {
            type: "LOGIN_PASSWORD",
            fields: [
              {
                label: "Username",
                name: "username",
                type: "text",
                require: true
              },
              {
                label: "Password",
                name: "password",
                type: "password",
                require: true
              }
            ]
          },
          formStatus: 0
        });
      }
    };

    const resendMessage = (message) => {
      // console.log("重新发信息条", message, message.status);

      let thatMessage = getMessageById(message._id);

      if (thatMessage) {
        let payload = chatStore.getSendMessage(message._id);

        if (payload) {
          socketSendObj({
            cmd: chatEnum.CMD_SEND,
            body: payload
          });
          thatMessage.status = 1;
        }
      }
    };

    const fetchMessages = ({ infiniteScroller, options = {} }) => {
      if (options.reset) {
        //
      }

      if (infiniteScroller) {
        let moreMessages = chatStore.loadMoreMessages(roomId.value, infiniteScroller.index, 5);

        if (moreMessages) {
          addMessages(moreMessages, true);
        } else {
          messagesLoaded.value = true;
        }

        infiniteScroller.done();
      }
    };

    const closeRoom = () => {
      // console.log("Close Room");

      footerDisabled.value = true;
      _room.value.status = "CLOSED";

      socketSendObj({
        cmd: chatEnum.CMD_ROOM_CLOSE
      });

      chatStore.isChatEnded = true;

      isNoticeOpen.value = false;
      isNoticeClicked.value = false;

      userStore.logout();

      // emit("close-room", {room});

      let baseMessage = {
        id: uid(),
        _id: uid(),
        remoteId: 0,
        senderId: "sys",
        senderName: "sys",
        avatarUrl: avatarUrl.value,
        type: "end",
        content: "",
        files: [],
        meta: {},
        seen: false,
        status: 4,
        timestamp: moment().utc().valueOf()
      };

      var message = {
        ...baseMessage,
        senderId: "sys",
        type: "end",
        content: t("message_chat_end")
      };

      _room.value.newMessages.push(message);

      // 新消息加前面
      addMessages(message);

      socketSendObj({
        cmd: chatEnum.CMD_ROOM_LEAVE,
        body: {
          roomId: roomId.value
        }
      });

      setTimeout(() => {
        wsDisconnect();
      }, 1000);
    };

    const rateService = (rating, comment = "", fromUser = false) => {
      // console.log("RateService")
      // console.log(rating);
      // console.log(props.room);

      socketSendObj({
        cmd: chatEnum.CMD_SEND_REDIRECT,
        body: {
          redirectCmd: chatEnum.CMD_PUT_RATING,
          to: props.room.id,
          rating: rating,
          comment: comment
        }
      });

      if (refChatWindow.value) {
        refChatWindow.value.isRateAdded(rating, comment);
      }
      if (fromUser == true) {
        userStore.prepareForReLogin();
      }
      isRated.value = true;
    };

    const has_giverating = computed(() => {
      if (rating_model.value) {
        return false;
      }
      return true;
    });

    const hideStartBoard = (type) => {
      if (refChatWindow.value) {
        refChatWindow.value.hideStartBoard(type);
      }
    };

    const openNoticePage = () => {
      isNoticeClicked.value = true;
    };

    const hideNoticeModal = () => {
      isNoticeOpen.value = false;
    };

    const useThisChatBoard = () => {
      // window.location.reload();
      var partnerId = LocalStorage.get("partnerId");
      var partnerCode = LocalStorage.get("partnerCode");

      var lang = LocalStorage.get("lang");
      var way = LocalStorage.get("way");
      var _token = LocalStorage.get("pretoken");
      var type = LocalStorage.get("type");
      var deviceId = LocalStorage.get("deviceId");

      var referrer_url = LocalStorage.get("referrer") ? LocalStorage.get("referrer") : "";

      var tokenUrl = "";
      if (_token) {
        tokenUrl = `&token=${_token}`;
      }

      var partnerText = "";
      if (partnerCode) {
        partnerText = `partnerCode=${partnerCode}`;
      } else {
        partnerText = `partnerId=${partnerId}`;
      }

      var deviceText = "";
      if (deviceId) {
        deviceText = `&deviceId=${deviceId}`;
      }

      var origin_url = window.location.origin;
      var url = `${origin_url}/liveChat?${partnerText}&way=${way}&lang=${lang}&type=${type}${deviceText}&referral=${referrer_url}${tokenUrl}`;
      console.log(url);

      window.location.href = url;
    };

    const handleOpenPopup = () => {
      // selectedType.value= "";
    };

    return {
      t,
      style,
      currentUserId,
      roomList,
      roomId,
      messages,
      messagesLoaded,
      firstPageLoaded,
      footerDisabled,
      prechatDisabled,
      is_typing,
      typing_username,
      room_status,
      sendMessage,
      resendMessage,
      fetchMessages,
      closeRoom,
      openRateBoard,
      rating_comment,
      rating_model,
      updateRatingModel,
      confirmRateChat,
      has_giverating,
      isRateDialogModel,
      isRated,
      refChatHeader,
      refChatWindow,
      rateService,
      hideStartBoard,
      isStorageDisabled,
      isChatStarted,
      isNoticeClicked,
      preIntro,
      questionTypes,
      startPreTalk,
      loginName,
      selectedType,
      handleOpenPopup,
      refLoginName,
      refQuestionType,
      startNewChat,
      isPreChat,
      notice_msg,
      isNoticeOpen,
      closeNotice,
      notice_timestamp,
      isPreStateStatus,
      NonPreChatStartChat,
      openNoticePage,
      partnerCode,
      hideNoticeModal,
      chatLabel,
      isDuplicateTab,
      useThisChatBoard,
      isPageLoaded
    };
  }
});
</script>

<style lang="scss">
.WAL {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  padding-bottom: 20px;

  &__layout {
    margin: 0 auto;
    z-index: 4000;
    height: 100%;

    max-width: 950px;
    border-radius: 20px;
    width: calc(90%);
  }
}

.q-menu {
  max-height: 250px;
  height: fit-content;
}

.WAL-start {
  &:before {
    content: "";
    height: 127px;
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #009688;
  }
}

.notice-section {
  background: rgb(255, 255, 255);
  //background: linear-gradient(180deg, rgba(255, 255, 255) 0%, rgba(222, 246, 246, 1) 65%, rgba(191, 238, 238, 1) 100%);
  width: 100%;
  height: auto;
  min-height: 100vh;
  padding: 49px 15px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  overflow-y: auto;

  .notice-board {
    width: 100%;
    margin-top: 8px;
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    gap: 8px;

    .message-stamp {
      align-self: end;
      color: #adadad;
      margin-bottom: 3px;
      font-size: 0.8rem;
    }
  }

  .notice-message {
    width: 100%;
    //max-width: 100%;
    padding: 12px 16px 12px;
    //border: 1px solid #ababab;

    background: #f2f7fd;
    //background: linear-gradient(180deg, rgba(255, 255, 255) 0%, rgba(222, 246, 246, 1) 65%, rgba(191, 238, 238, 1) 100%);
    border-radius: 15px;
    height: auto;
    color: #000;
    font-size: 13px;

    p {
      color: #000;
    }

    * {
      max-width: 100%;
      max-height: 100vh;
    }

    a,
    a:hover,
    a:visited,
    a:active {
      color: #3d00e3;
    }
  }

  .notice-close {
    cursor: pointer;
  }

  .close-btn {
    right: -8px;
    top: -8px;
    position: absolute;
    color: #fff;
  }
}

.notice-box {
  background: linear-gradient(181.58deg, #7c4dff -1.44%, #3d00e3 102.18%);
  height: 48px;
  z-index: 99;
  font-size: 16px;
  color: #fff;
  position: relative;
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .notice-span {
    line-height: 48px;
    padding-right: 40px;
    width: calc(100% - 70px);
  }

  .close-notice-btn {
    color: #fff;
    width: 60px;
    margin-right: 8px;
    font-size: 24px;
    text-align: right;
  }
}

.duplicate-box {
  background: red;
  height: 48px;
  z-index: 99;
  font-size: 13px;
  color: #fff;
  position: fixed;
  bottom: 60px;
  left: 0px;
  right: 0px;
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .duplicate-span {
    padding-right: 0px;
    width: auto;
  }
}

.pointer-none {
  pointer-events: none;
  opacity: 0.9;
}

.duplicate-box-top {
  background: red;
  height: 48px;
  z-index: 99;
  font-size: 13px;
  color: #fff;
  position: relative;
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .duplicate-span {
    padding-right: 0px;
    width: calc(100%);
  }
}

.duplicate-box-bottom {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 60px;
  z-index: 3000;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
}

.WAL-start,
.WAL__layout {
  height: calc(100vh - 60px) !important;
}

.prechat-section {
  background: rgb(255, 255, 255);
  background: linear-gradient(180deg, rgba(255, 255, 255) 0%, rgba(222, 246, 246, 1) 65%, rgba(191, 238, 238, 1) 100%);
  width: 100%;
  height: calc(100vh - 60px);
  min-height: 100vh;
  padding: 55px 15px 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  //justify-content: center;

  overflow-y: auto;

  .prechat-intro {
    width: 100%;
    margin-bottom: 10px;

    img {
      max-width: 100%;
    }
  }

  .prechat-form {
    border-top: 1px solid #cbcbcb;
    padding-top: 10px;
    width: 90%;
    margin: 0 auto 15px;

    .q-item {
      margin-bottom: 0px;
    }

    .q-field--with-bottom {
      padding-bottom: 12px;
    }
  }

  .select-input {
    &.q-field--auto-height.q-field--labeled .q-field__control-container {
      padding-top: 6px !important;
    }

    &.q-field--labeled .q-field__native {
      min-height: 24px !important;
    }

    &.q-field--float .q-field__label {
      display: none;
    }
  }
}

::-webkit-scrollbar {
  width: 3px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 850px) {
  .WAL {
    padding: 0;

    &__layout {
      width: 100%;
      border-radius: 0;
    }
  }
}

.scroll::-webkit-scrollbar {
  width: 0;
}

.q-field--dense.q-field--float .q-field__label {
  transform: none !important;
}

.q-select__dialog label span {
  display: none;
}

.login-btn .block {
  font-size: 17px;
}

.start-chat-btn {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(90% - 48px);
  background: rgba(210, 242, 242, 0.2);
  backdrop-filter: blur(4px);
  padding-bottom: 16px;
}

.modal-rating {
  .q-card {
    border-radius: 14px;
    padding: 30px 10px 10px;
  }
}
</style>
