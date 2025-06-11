<template>
  <div class="mail-detail-wrapper">
    <div class="mail-detail-title-wrapper">
      <h3 class="mail-detail-title__title" :title="mail.title" v-html="mail.title" />
      <span class="mail-detail-title__send-time">{{ mail.sendTime }}</span>
    </div>
    <div class="mail-detail-content-wrapper">
      <div v-html="mail.content.replace(/\n/g, '<br/>')" />
    </div>
    <div class="mail-detail-action-wrapper">
      <div v-if="mail?.redirectType && mail.redirectType !== 'NONE'"  class="common-large-btn redirect-btn" @click="handleRedirectClick">
        {{ mail?.redirectButton || "立即前往" }}
      </div>
    </div>
    <GameModal ref="gameRef" />
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import GameModal from "../modal/GameModal.vue";
import { ref, onUnmounted } from "vue";

const props = defineProps({
  mail: Object
});

const router = useRouter();

const gameRef = ref();

const openGame = (gameName, code, gameCode) => {
  gameRef.value.open(gameName, code, gameCode);
};

const handleRedirectClick = () => {
  if (props.mail.redirectType === "INNER") {
    const openPattern = /^open\/(.*)/;
    if (props.mail.redirectUrl.match(openPattern) && gameRef.value) {
      const extractedUrl = props.mail.redirectUrl.match(openPattern)[1];
      const [gameName, platformCode, gameCode] = extractedUrl.split("/");
      openGame(gameName, platformCode, gameCode);
    } else if (props.mail.redirectUrl.startsWith("/")) {
      router.push(props.mail.redirectUrl);
    } else {
      router.push({ path: "/promo", query: { name: props.mail.redirectUrl } });
    }
  } else if (props.mail.redirectType === "OUTER") {
    window.open(props.mail.redirectUrl, "_blank");
  }
};
</script>
<style lang="scss" scoped>
.mail-detail-wrapper {
  display: flex;
  flex-direction: column;
  padding: 10px 2rem;
  min-height: inherit;

  .mail-detail-title-wrapper {
    padding: 0 0 8px;
    border-bottom: 1px solid #d6d5dc;

    .mail-detail-title__title {
      font-size: 2rem;
      margin: 0;

      :deep(p) {
        margin: 0 !important;
      }
    }
    .mail-detail-title__send-time {
      color: #7a80a1;
    }
  }
  .mail-detail-content-wrapper {
    padding: 12px 0;
  }
  .mail-detail-action-wrapper {
    margin: auto 0 0;
    .common-large-btn {
      width: 100%;
    }
  }
}

.redirect-btn {
  border: 1px solid #D1D5DB;
  box-shadow: 0px 1px 2px 0px #0000000D;
  width: 230px;
  height: 40px;
  gap: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  background: linear-gradient(270deg, #3080f4, #70b1ff);
  border-radius: 8px;
  font-size: .75rem;
  margin-top: 6px;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
