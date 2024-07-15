<template>
    <MessagesPage :inboxType="inboxType" />
</template>

<script setup>
import { defineAsyncComponent, markRaw, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const MessagesPage = markRaw(defineAsyncComponent(() =>
  import('components/pageModalContent/message/MessagesPage.vue')
));
const inboxType = ref();

watch(() => route.fullPath, () => {
    const isInbox = route.fullPath.endsWith('personal/messages/inbox');
    const isOutbox = route.fullPath.endsWith('personal/messages/outbox');

    if(isInbox) {
        inboxType.value = 'NOTIFICATION';
    } else if(isOutbox) {
        inboxType.value = 'Outbox';
    } else {
        inboxType.value = 'ALL';
    }
})

</script>