<template>
  <div class="absolute-full fit">
    <div
      v-if="chat_type !== '3'"
      class="server-indicator-div row items-center justify-between"
      style="gap: 3px; margin-right: 8px"
    >
      <q-badge rounded :color="localStatusColor" />
      <q-badge @click="pingServer" rounded :color="restIndColor" />
      <q-badge rounded :color="wsIndColor" />
      <q-badge rounded :color="isCsPingColor" />
    </div>

    <div class="fit flex items-center justify-center text-center">
      <div class="column q-gutter-y-sm">
        <div class="flex column items-center justify-center">
          <q-spinner-dots size="50px" style="color: #9880ff" />
          <label>{{ $t("loading") }}</label>

          <div
            v-if="chat_type !== '3'"
            class="server-indicator-div row items-center justify-between"
            style="gap: 3px; margin-right: 8px"
          >
            <q-badge rounded :color="localStatusColor" />
            <q-badge @click="pingServer" rounded :color="restIndColor" />
            <q-badge rounded :color="wsIndColor" />
            <q-badge rounded :color="isCsPingColor" />
          </div>
        </div>

        <div class="text-grey-6" v-if="text">{{ text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

/* eslint-disable */
import { defineComponent, onBeforeMount, onActivated, ref, nextTick, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useChatStore } from "src/cs-client-web/stores/chat";
import { useUserStore } from "src/cs-client-web/stores/user";
import authAPI from "src/cs-client-web/api/authAPI";
import isEmpty from "lodash/isEmpty";
import clone from "lodash/clone";
import LocalStorage from "src/cs-client-web/utils/local-storage";
import useSocket from "src/cs-client-web/composables/use-socket";
import moment from "moment";
import { sessionConfig } from "src/cs-client-web/constants";
import { uid } from "src/cs-client-web/utils/string";

import { SessionStorage, useQuasar } from "quasar";
import { useSocketStore } from "src/cs-client-web/stores/socket";
import { storeToRefs } from "pinia";
import { getRndInteger } from "boot/utils";
import { userStore as storeUser } from "src/stores";

export default defineComponent({
  name: "CSLoginPage",
  setup() {
    const { t, locale } = useI18n({ useScope: "global" });
    const router = useRouter();
    const route = useRoute();
    const { wsConnect, socketSendObj } = useSocket();
    const chatStore = useChatStore();
    const userStore = useUserStore();
    const socketStore = useSocketStore();
    const { isConnected, isInternet, isCsPingColor } = storeToRefs(socketStore);

    const text = ref("");
    const $q = useQuasar();

    var rstArray = Object.values(process.env.RST_API);
    var rstApiRand = rstArray[getRndInteger(0, rstArray.length)];

    var rstApi = localStorage.getItem("DY_H5_RST_URL") ?? rstApiRand;

    const chat_type = ref("");
    // let partnerCode = route.query?.partnerCode ?? "";
    let partnerId = route.query?.partnerId ?? "";
    let partnerCode = "DYCS";
    const store = storeUser();

    let qChatGuid = route.query?.uid ?? "";

    // console.log("GET ID/Code: " + partnerCode + " " + partnerId + " " + qChatGuid);

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

    const pingCs = () => {
      authAPI.pingCs().then((res) => {
        if (res.status === 200) {
          isCsPingColor.value = "green";
        }
      });

      // axios.get( "https://api.psnaback.com/cs/ws/ping").then((res) => {
      //   console.log(res);
      //
      // });
    };

    onActivated(async () => {
      let way;
      let type;
      let deviceId;
      let is_start_new = "";
      let is_restart = "";

      let lang;
      let loginDetails;
      let chatGuid;

      await nextTick();
      pingCs();

      let isNewCs = partnerCode != "" || partnerId != "" ? true : false;
      if (isNewCs === true) {
        type = route.query?.type ?? "";
        deviceId = route.query?.deviceId ?? "";
        is_start_new = route.query?.newchat ?? "";
        is_restart = route.query?.restartnew ?? "";

        lang = route.query?.lang ?? LocalStorage.get("lang") ?? "";
        way = route.query?.way ?? LocalStorage.get("way") ?? "";
      } else {
        // console.log("Not NewCs");

        // partnerCode = LocalStorage.get("partnerCode") ?? "";
        // partnerId = LocalStorage.get("partnerId") ?? "";
        type = LocalStorage.get("type") ?? "";
        deviceId = LocalStorage.get("deviceId") ?? "";

        way = LocalStorage.get("way") ?? route.query?.way ?? "";
        lang = LocalStorage.get("lang") ?? route.query?.lang ?? "";
      }

      const isTest = route.query?.test ?? "";
      if (isTest) {
        alert("TESTING MODE!");
        SessionStorage.set("isTest", isTest);
      }

      chat_type.value = type;

      await nextTick();

      chatGuid = uid();

      let token = route.query?.token;
      // let isUseCode = (partnerCode && !partnerId) ? true : false;

      // alert("TYPE: " + type)

      let referrer_url = "";
      if (is_start_new !== "" || is_restart !== "") {
        referrer_url = route.query?.referral ?? "";
      }

      // console.log("Check Refrresh");
      if (LocalStorage.pull("refresh", false)) {
        window.parent.postMessage("minimize", "*");
        window.location.reload();
        return;
      }

      if (!way) {
        way = "WEB";
      }
      if (!lang) {
        lang = "zh-CN";
      }

      let device = $q.platform.is.mobile ? getPlatformModel() : "pc";
      let browser = $q.platform.is.name;

      locale.value = lang;

      // if (!isEmpty(partnerId) || !isEmpty(partnerCode)) {
      // await sleep(1000);

      if (!qChatGuid) {
        LocalStorage.set("chatGuid", chatGuid);
      } else {
        chatGuid = qChatGuid;
      }

      let wsLoggedIn = LocalStorage.get("wsLoggedIn");
      let pretoken = LocalStorage.get("pretoken");

      if (wsLoggedIn) {
        let lastActiveAt = LocalStorage.get("lastActiveAt");

        if (lastActiveAt) {
          let inActiveInSeconds = moment().diff(lastActiveAt, "seconds");

          if (inActiveInSeconds > sessionConfig.TIMEOUT) {
            userStore.logout();
          }
        }

        // console.log("Token: " + token);
        // console.log("PreToken: " + pretoken);
        if (!LocalStorage.get("isChatStarted")) {
          if (token && token != pretoken) {
            is_start_new = true;
            userStore.logout();
          } else if (token == undefined && token != pretoken) {
            userStore.logout();
          }
        }
      }

      LocalStorage.set("partnerId", partnerId);
      LocalStorage.set("partnerCode", partnerCode);
      LocalStorage.set("pretoken", token);
      LocalStorage.set("lang", locale.value);
      LocalStorage.set("way", way);
      LocalStorage.set("type", type);
      LocalStorage.set("deviceId", deviceId);

      loginDetails = LocalStorage.get("loginDetails");
      let isChatStarted = LocalStorage.get("isChatStarted");

      if (isChatStarted && loginDetails) {
        // console.log("Rc Here");
        // console.log(loginDetails);

        var respData = clone(loginDetails);
        await repsLogin(respData);
      } else {
        // console.log("Do New");

        // LocalStorage.remove('messageList');
        // LocalStorage.remove('sendMessageList');
        // LocalStorage.remove('wsLoggedIn');

        // alert("Token: " + token);

        authAPI
          .login(partnerId, way, token, device, browser, referrer_url, is_start_new, partnerCode, deviceId)
          .then(async (res) => {
            isInternet.value = true;

            if (res.data.code !== 0) {
              return;
            }

            // console.log("set Token");
            console.log(res.data.data);
            // console.log(res.data.data.token.length);

            LocalStorage.set("loginDetails", res.data.data);

            await repsLogin(res.data.data);
          });
      }
      // }
      // else {
      //   text.value = t("errors.partner_id_missing");
      // }

      async function repsLogin(data) {
        const { guestId: userId, ip, token, to, partnerName: roomName, headIcon: avatarUrl } = data;

        userStore.userId = userId;
        userStore.nickname = ip;
        userStore.token = token;
        userStore.to_id = to;
        chatStore.roomId = to;
        chatStore.room.id = to;
        chatStore.room.roomName = roomName;
        chatStore.room.avatar = avatarUrl;
        chatStore.mode_type = type;

        const wsUrl = `${rstApi}/cs/ws`;

        LocalStorage.set("ws", wsUrl);
        document.title = t("doc_title", { name: roomName });

        if (wsUrl) {
          // console.log(wsUrl);
          wsConnect(wsUrl);

          const NUM_RETRIES = 4;
          let tryCount = 0;

          const interval = setInterval(async () => {
            if (tryCount >= NUM_RETRIES) {
              // text.value = t('sys_exception') + t('unable_connect_ws');
              clearInterval(interval);
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }

            try {
              tryCount++;

              socketSendObj({
                cmd: 0
              });

              window.parent.postMessage("loadedfinish", "*");
              if (is_start_new) {
                // console.log("Is New Page");

                LocalStorage.set("newchat", "1");

                setTimeout(() => {
                  window.parent.postMessage("loadnewfinish", "*");
                }, 1000);
              }

              clearInterval(interval);

              store.chatGuid = chatGuid;

              await router.push({
                path: `${route.path}/chat`,
                query: { uid: chatGuid, ...(store.token && { token: store.token }) }
              });
            } catch (e) {
              console.log(e);
            }
          }, 500);
        }
      }
    });

    onBeforeMount(async () => {
      if (partnerCode) {
        chatStore.prefixId = partnerCode + "_";
      } else if (partnerId) {
        chatStore.prefixId = partnerId + "_";
      } else if (qChatGuid) {
        var prefix = LocalStorage.findPrefixByChatUid(qChatGuid);
        if (prefix != "") {
          chatStore.prefixId = prefix;
        }
      }
    });

    function getPlatformModel() {
      var platform = $q.platform.is.platform;
      var isIOS = $q.platform.is.ios;

      if (platform === "android") {
        return "Android";
      } else if (platform === "iphone" || platform === "ipad" || isIOS == true) {
        return "iOS";
      }

      return platform;
    }

    return {
      text,
      restIndColor,
      wsIndColor,
      localStatusColor,
      isCsPingColor,
      pingServer,
      chat_type
    };
  }
});
</script>

<style scoped>
.server-indicator-div {
  width: 90px;
  padding: 10px;
  margin-left: auto;
}

.top-loading-txt {
  margin-left: -24px;
}
</style>
