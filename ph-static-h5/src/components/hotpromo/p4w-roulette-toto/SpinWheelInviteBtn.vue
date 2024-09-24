<template>
  <div class="progress-container">
    <div class="invite-btn" @click="open('bottom')">
      <span></span>
      <span>Invite friends to help</span>
      <q-icon class="share-btn" name="share" size="sm" />
    </div>
  </div>

  <q-dialog class="invite-popup prevent-rescroll" v-model="dialog" :position="position">
    <q-card style="width: 100%; margin: 0">
      <div class="invite-container">
        <div class="tagline">
          <span>Invite more friends to help you claim!!</span>
          <q-icon name="close" size="sm" style="color: #b9b9bb" v-close-popup />
        </div>
        <div class="socials-list">
          <div class="socials-list-item">
            <a @click="openFb">
              <img width="68" src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/messenger.png" />
            </a>
            <span>Messenger</span>
          </div>

          <div class="socials-list-item">
            <ShareNetwork
              network="Telegram"
              title="Come Join Play4Win with Me"
              description="Play4Win"
              url="https://m.play4win.cc"
              hashtags="play4win"
            >
              <img width="68" src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/telegram.png" />
            </ShareNetwork>
            <span>Telegram</span>
          </div>

          <div class="socials-list-item">
            <a @click="openViber">
              <img
                style="border-radius: 100px"
                width="70"
                src="../../../assets/images/promotion/hotpromo/p4w-roulette-toto/viber.png"
              />
            </a>
            <span>Viber</span>
          </div>
        </div>
        <div class="url-link">
          <q-input class="link" style="width: 100%" color="white" ref="copyinput" v-model="referralLink" outlined>
            <template v-slot:append>
              <q-icon name="content_copy" size="sm" style="color: #0062e8; transform: scaleX(-1)" @click="copyCode" />
            </template>
          </q-input>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "src/stores";

const store = userStore();
const dialog = ref(false);
const position = ref("bottom");
const referralLink = ref("");
const copyinput = ref(null);
const $q = useQuasar();

const openFb = () => {
  copyCode();
  setTimeout(() => {
    window.open("fb-messenger://", "_self");
  }, 100);
};

const openViber = () => {
  copyCode();
  setTimeout(() => {
    window.open("viber://pa?chatURI=https://play4win.cc&text=Come Join Play4Win", "_self");
  }, 100);
};

const open = (pos) => {
  position.value = pos;
  dialog.value = true;
};
const copyCode = () => {
  const copyText = copyinput.value;
  copyText.select();
  document.execCommand("copy");
  $q.notify({
    color: "positive",
    position: "top",
    message: "Copied",
    icon: "check_circle_outline"
  });
};
const getReferral = () => {
  if (!store.token) {
    $q.notify({
      type: "negative",
      position: "top",
      message: `Login to join the lucky draw.`,
      icon: "report_problem"
    });
    return;
  }
  api
    .get("/session/member/referralCode")
    .then((res) => {
      if (res.code === 0) {
        referralLink.value = `https://m.play4win.cc/refer/${res.data}`;
      }
    })
    .catch((err) => {});
};
onMounted(() => {
  getReferral();
});
</script>

<style lang="scss" scoped>
.progress-container {
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 15px;
  align-items: center;

  .invite-btn {
    height: 50px;
    background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
    color: #fff;
    width: 100%;
    border: none;
    max-width: 300px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-radius: 100px;
    font-size: 16px;
  }
}

.invite-popup {
  .invite-container {
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    background-color: #ffffff;

    .tagline {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 700;
    }

    .socials-list {
      display: flex;
      gap: 40px;

      .socials-list-item {
        display: flex;
        flex-direction: column;
        text-align: center;

        img {
          width: 70px;
        }
      }
    }

    .url-link {
      height: 60px;
      width: 100%;
      font-size: 14px;
      color: #99b1db;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .link {
        border: 1px solid #7dabc9;
        border-radius: 6px;
      }
    }
  }
}

.body--dark {
  .progress-container {
  }

  .invite-popup {
    .invite-container {
      background-color: #15141a;
    }
  }
}
</style>
