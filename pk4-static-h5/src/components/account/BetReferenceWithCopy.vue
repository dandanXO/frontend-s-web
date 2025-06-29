<template>
    <div class="bet-id-wrapper">
      <div class="order">
        <div class="bet-id" ref="betIdRef">{{ props.betId }}</div>
      </div>
        <img v-if="hasCopied" src="../../assets/images/account/copied-btn.svg" />
        <img v-else src="../../assets/images/account/copy-btn-white.svg" @click="copyMessage()" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n';
const props = defineProps(['betId']);

const hasCopied = ref(false);
const betIdRef = ref();
const $q = useQuasar();
const { t } = useI18n();

const copyMessage = () => {
  let copyText = null;
  copyText = eval(`betIdRef.value.innerText`);
  // Create a temporary textarea element
  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = copyText;
  document.body.appendChild(tempTextarea);

  // Select the text and copy it
  tempTextarea.select();
  document.execCommand("copy");

  // Remove the temporary textarea element
  document.body.removeChild(tempTextarea);
  hasCopied.value = true;
  $q.notify({
    color: "positive",
    position: "top",
    message: t("message.copySuccess"),
    icon: "check_circle_outline"
  });
};
</script>