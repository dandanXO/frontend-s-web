<template>
  <q-page>
    <div class="loading-div" v-if="!visible">
      <q-spinner-hourglass
          color="blue-6"
          size="8em"
      />
    </div>
    <!--    <iframe-->
    <!--        @load="loadGame()"-->
    <!--        :src="src"-->
    <!--        scrolling="auto"-->
    <!--        frameborder="0"-->
    <!--        class="sport-iframe"-->
    <!--    ></iframe>-->
  </q-page>
  <!--  <q-page>-->

  <!--    <div  class="topActions">-->
  <!--      <q-toolbar-title></q-toolbar-title>-->
  <!--      <q-btn-->
  <!--          flat-->
  <!--          @click="closeDialog()"-->
  <!--          round-->
  <!--          dense-->
  <!--          icon="close"-->
  <!--          style="width:26px;height:26px;min-height: 26px; min-width: 26px;"-->
  <!--      />-->
  <!--    </div>-->


  <!--    <iframe-->
  <!--        @load="loadGame()"-->
  <!--        :src="src"-->
  <!--        frameborder="0"-->
  <!--        class="poker-iframe"-->
  <!--    ></iframe>-->
  <!--  </q-page>-->
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {userStore} from "stores/index";
import {useQuasar, Platform, AppFullscreen} from "quasar";
import {api} from "boot/axios";
import {cached} from "boot/cache";
import {isAndroid} from "boot/utils";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
let src = ref("");
const store = userStore();
const visible = ref(false);
const loadGame = () => {
  if (src.value !== "") {
    $q.loading.hide();
  }
};

const closeDialog = () => {
  src.value = ""
  router.go(-1);
}


onMounted(() => {
// && !store.isInitEsport
  if (store.hasToken()) {
    $q.loading.show({message: "正加载页面"});

    if (Platform.is.capacitor) {
      window.screen.orientation.lock('portrait');
    }

    const isMobile = Platform.is.mobile;
    var way = null;
    if ("standalone" in window.navigator && window.navigator.standalone) {
      way = "IOS";
    } else {
      way = Platform.is.mobile ? "H5" : "WEB";
      if (Platform.is.capacitor) {
        if (Platform.is.android) {
          way = "ANDROID";
        }
      }
    }

    cached.get("POKER_IFRAME_URL", () => api.get(`/session/launch?_time=${new Date().getTime()}`, {
          params: {
            platform: "KYDY",
            gameCode: "ky_lobby",
            isMobile: Platform.is.mobile ? true : false,
            way: way
          }
        }),
        {expired_value: 30}
    ).then((res) => {
      console.log(res);

      $q.loading.hide();
      visible.value = true;

      if(way !== "H5"){

        if(way=="ANDROID"){
          var ref = cordova.InAppBrowser.open(res, '_blank', 'location=no,zoom=no');
          ref.addEventListener('loadstop', function(e){
            router.go(-1);
          });
        }else{
          window.location.href= res;
        }

      }else{
        window.location.href= res;
        setTimeout(()=>{
          router.push("/")
        },1000)

      }

      // store.isInitEsport = true;
      // src.value = res;

    }).catch((err) => {
      $q.loading.hide();
      visible.value = true;
    });

  }
});
</script>

<style lang="scss" scoped>
iframe {
  width: 100%;
  height: calc(100% - 26px);

  position: absolute;
  left: 0;
  right: 0;
  top: 26px;
  bottom: 0;
  margin: auto;
}

.topActions {
  display: flex;
  background: #d7d7d7;
  justify-content: flex-end;
  width: 100%;
  height: 26px;
}

.loading-div {
  z-index: 99;
  position: fixed;
  background: rgba(35, 38, 60, 0.4);
  text-align: center;
  margin: 0 auto;
  width: 100%;

  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;

  svg {
    color: var(--q-primary);
    width: 48px;
  }
}
</style>
