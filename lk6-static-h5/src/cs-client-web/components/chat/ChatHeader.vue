<template>
  <q-header class="header-board">
    <q-toolbar>
      <q-item class="q-px-none">
        <q-item-section side>
          <template v-if="room.avatar">
            <q-avatar color="grey-3" size="32px">
              <img :src="room.avatar" />
            </q-avatar>
          </template>
          <template v-else>
            <div class="bg-grey-3">
              <q-icon name="person" size="32px" color="grey-6" />
            </div>
          </template>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-white">{{ room.roomName }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-space />

      <div class="server-indicator-div row items-center justify-between" style="gap: 3px; margin-right: 8px">
        <q-badge rounded :color="localStatusColor" />
        <q-badge @click="pingServer" rounded :color="restIndColor" />
        <q-badge rounded :color="wsIndColor" />
      </div>

      <q-btn v-if="isChatStarted" @click="handleOnModal" flat>
        <img :src="require('src/cs-client-web/assets/images/more-icon.png')" />
      </q-btn>

      <q-btn
        v-if="
          chatStore.mode_type != '4' &&
          chatStore.mode_type != '2' &&
          chatStore.mode_type != 'null' &&
          chatStore.mode_type
        "
        @click="minimizeChat"
        flat
      >
        <img :src="require('src/cs-client-web/assets/images/minimize-icon.png')" />
      </q-btn>
    </q-toolbar>

    <div v-if="isStorageDisabled" class="top-header-notice">
      <p>
        <q-icon name="warning" color="red"></q-icon>
        {{ $t("no_storage_notification") }}
      </p>
    </div>

    <div class="popup-close-menu" v-if="is_show_modal">
      <q-list style="min-width: 100px">
        <q-item @click="onEndChat" :disable="chatFreeze || isChatEnded" clickable v-close-popup>
          <q-item-section class="text-black">{{ $t("end_chat") }}</q-item-section>
        </q-item>
        <q-separator />
        <q-item v-if="!isStorageDisabled" :disable="disable" @click="startNewChat(true)" clickable v-close-popup>
          <q-item-section class="text-black">{{ $t("start_new_chat") }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-header>

  <q-dialog class="modal-endchat" v-model="isEndedModal" persistent>
    <q-card style="min-width: 330px">
      <q-card-section>
        <div class="text-h6">{{ t("confirm_end_chat") }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="hasRateChat">
        <RatingBoard @updateRatingModel="updateRatingModel" :t="t" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="t('confirm.cancel')" @click="cancelEnd" v-close-popup />
        <q-btn flat :label="t('confirm.ok')" @click="confirmEndChat" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import { computed, defineComponent, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useChatStore } from "src/cs-client-web/stores/chat";
import { storeToRefs } from "pinia";
import LocalStorage from "src/cs-client-web/utils/local-storage";
import { useUserStore } from "src/cs-client-web/stores/user";
import { useRouter } from "vue-router";
import { useSocketStore } from "src/cs-client-web/stores/socket";
import authAPI from "src/cs-client-web/api/authAPI";
import RatingBoard from "src/cs-client-web/components/chat/parts/RatingBoard.vue";

export default defineComponent({
  name: "ChatHeader",
  components: { RatingBoard },
  props: {
    room: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isStorageDisabled: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    isChatStarted: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    disable: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  emits: ["close-room", "rate-service", "hide-start", "startNewChat"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const { t } = useI18n();
    const router = useRouter();
    const chatStore = useChatStore();
    const userStore = useUserStore();
    const socketStore = useSocketStore();
    const { isChatEnded, chatFreeze } = storeToRefs(chatStore);
    const { isConnected, isInternet } = storeToRefs(socketStore);

    const is_show_modal = ref(false);

    const isEndedModal = ref(false);
    const rating_model = ref(0);
    const rating_comment = ref("");

    const updateRatingModel = (rating, comment) => {
      // console.log("here" + comment);
      rating_model.value = rating;
      rating_comment.value = comment;
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

    const hasRateChat = ref(chatStore.hasRateChat);

    const onEndChat = () => {
      // 您确定要终止聊天吗？
      isEndedModal.value = true;
      return;
    };

    const confirmEndChat = () => {
      // console.log(rating_model.value);
      isEndedModal.value = false;
      if (hasRateChat.value === true && rating_model.value > 0 && rating_model.value <= 5) {
        console.log("Rate Service");
        emit("rate-service", rating_model.value, rating_comment.value);
      } else {
        emit("hide-start", false);
      }

      var partnerId = LocalStorage.get("partnerId");
      var partnerCode = LocalStorage.get("partnerCode");

      var lang = LocalStorage.get("lang");
      var way = LocalStorage.get("way");
      var referrer_url = LocalStorage.get("referrer");
      var _token = LocalStorage.pull("pretoken");
      var type = LocalStorage.get("type");
      var deviceId = LocalStorage.get("deviceId");

      emit("close-room", props.room);

      LocalStorage.set("partnerId", partnerId);
      LocalStorage.set("partnerCode", partnerCode);
      LocalStorage.set("lang", lang);
      LocalStorage.set("type", type);
      LocalStorage.set("deviceId", deviceId);

      LocalStorage.set("way", way);
      LocalStorage.set("referrer", referrer_url);
      LocalStorage.set("pretoken", _token);

      hideModal();

      setTimeout(() => {
        // console.log("25 Seconds, start new chat.");
        if (chatStore.mode_type) {
          startNewChat(false);
        }
      }, 30000);
    };

    const startNewChat = (isStartNew) => {
      emit("startNewChat", isStartNew);
    };

    const minimizeChat = () => {
      // console.log("Minimize");
      hideModal();

      let type = LocalStorage.get("type");
      // console.log(type);

      const qPageDom = document.querySelector(".q-page");
      qPageDom.style.filter = "brightness(0) invert(1)";

      window.parent.postMessage("minimize", "*");
    };

    const handleOnModal = () => {
      is_show_modal.value = !is_show_modal.value;
    };

    const cancelEnd = () => {
      rating_model.value = 0;
      rating_comment.value = "";
    };

    const hideModal = () => {
      is_show_modal.value = false;
    };

    const isPinging = ref(false);
    const restIndColor = computed(() => {
      if (isPinging.value == true) {
        return "yellow";
      }
      if (isInternet.value === true) {
        return "green";
      } else {
        return "red";
      }
    });
    const wsIndColor = computed(() => {
      if (isConnected.value === true) {
        return "green";
      } else {
        return "red";
      }
    });
    const localStatusColor = computed(() => {
      if (userStore.is_storage_enabled === true) {
        return "green";
      } else {
        return "red";
      }
    });

    const pingServer = () => {
      isPinging.value = true;
      authAPI.ping().then((d) => {
        // console.log(d);
        isPinging.value = false;
        if (d.data?.code === 0) {
          isInternet.value = true;
        } else {
          isInternet.value = false;
        }
      });
    };

    onMounted(() => {
      let container = document.getElementsByClassName("q-page-container");
      let footer = document.getElementsByClassName("q-footer");
      if (container.length > 1) {
        container[1].addEventListener("click", function (e) {
          hideModal();
        });
      }
      if (footer.length > 0) {
        footer[0].addEventListener("click", function (e) {
          hideModal();
        });
      }
    });

    return {
      t,
      chatStore,
      isChatEnded,
      chatFreeze,
      onEndChat,
      handleOnModal,
      is_show_modal,
      hideModal,
      startNewChat,
      minimizeChat,
      isEndedModal,
      rating_model,
      updateRatingModel,
      rating_comment,
      confirmEndChat,
      cancelEnd,
      rating_color,
      hasRateChat,
      restIndColor,
      localStatusColor,
      wsIndColor,
      pingServer
    };
  }
});
</script>

<style lang="scss" scoped>
.header-board {
  background: linear-gradient(to left, #8ec1f7, #4183d3);
  padding: 0px 8px;
  width: 100%;
}

.q-toolbar {
  min-height: 45px;

  .q-item {
    min-height: 45px;
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .q-item__label {
    line-height: 36px !important;
    font-size: 16px;
  }
}

.popup-close-menu {
  padding: 4px 4px;
  position: absolute;
  top: 42px;
  right: 20px;
  background: #fafafa;
  border-radius: 20px;
  border: 1px solid #cbcbcb;

  .q-item {
    min-height: 36px;
  }
}

.top-header-notice {
  background: #475d66 !important;
  height: auto;
  z-index: 9;
  padding: 4px 6px 10px;
  width: calc(100% + 16px);
  margin: 0px -8px;

  p {
    color: #dedede;
    margin-bottom: 0px !important;
  }
}

.modal-endchat {
  .q-card {
    border-radius: 10px;
    padding: 25px 15px 10px;
  }
  .text-h6 {
    padding-bottom: 14px;
    font-weight: 600;
  }
}

.q-toolbar {
  background-color: var(--q-primary);
}

.text-h6 {
  padding-bottom: 14px;
}
</style>
