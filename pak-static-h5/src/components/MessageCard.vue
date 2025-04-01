<template>
  <q-card class="msg-container">
    <div class="time-wrapper">
      <div class="time">{{ convertToGMT55(message.sendTime) }}</div>
      <div class="new-message-ribbon" v-if="!message.readTime"></div>
    </div>

    <q-card-section class="title"><span v-html="message.title"></span></q-card-section>
    <q-card-section class="content">
      <span v-html="shortenedContent"></span>
      <q-btn v-if="isLongContent" @click="expand = !expand" flat color="primary" size="sm">
        <!-- {{ expand ? "Show Less" : "Show More" }} -->
      </q-btn>
    </q-card-section>

    <q-card-section class="bottom-wrapper">
      <q-btn class="detail-btn" v-if="redirectType === 'INNER'" :to="message.redirectUrl" flat unelevated>
        {{ message?.redirectButton || $t("message.visitLink") }}
        <q-icon name="keyboard_arrow_right" size="medium" />
      </q-btn>
      <q-btn
        class="detail-btn"
        v-else-if="redirectType === 'OUTER'"
        @click="goToOuterLink(message.redirectUrl)"
        target="_blank"
        flat
        unelevated
      >
        {{ message?.redirectButton || $t("message.visitLink") }}
        <q-icon name="keyboard_arrow_right" size="medium" />
      </q-btn>
      <q-btn class="detail-btn" @click="$emit('details', message)" flat unelevated>
        {{ $t("btn.more") }}
        <q-icon name="keyboard_arrow_down" size="medium" />
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({ message: Object });
const expand = ref(true);

const isLongContent = computed(() => props.message.content.length > 50);
const shortenedContent = computed(() =>
  expand.value ? props.message.content : props.message.content.slice(0, 50) + "..."
);
const redirectType = props.message.redirectType;

const convertToGMT55 = (date) => date; // Replace with actual conversion logic

const goToOuterLink = (link) => {
  window.open(link, "_blank");
};
</script>
<style lang="scss" scoped>
.account-message-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  // padding: 0 20px;
  padding: 20px;
}
.msg-container {
  padding: 1rem;
  margin: 0;
  border-radius: 10px;
  margin-bottom: 15px;
  // border: 1px solid rgba(255, 255, 255, 0.05);
  // background: #2e30344f;
  background: #323738;

  position: relative;
  box-shadow: none;
  backdrop-filter: blur(4px);

  &:has(.new-message-ribbon) {
    //background: #2e30344f;
    // border: 1px solid #00AE00
  }

  .time-wrapper {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
    margin-bottom: 15px;
    font-weight: 700;
    .new-message-ribbon {
      // position: absolute;
      // right: 0;
      // top: 0;
      // width: 30px;
      // height: 30px;
      background: #21ef89;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .time {
      font-size: 1rem;
      // font-weight: 700;
      color: #ffffffb2;
    }
  }

  .message-wrapper {
    height: 100%;
    width: 100%;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    display: flex;
    gap: 0.5rem;
    margin-bottom: 10px;

    .status {
      border-radius: 12.5rem;
      background: rgba(255, 255, 255, 0.2);
      font-size: 1rem;
      font-weight: 700;
      padding: 0 1rem;
      min-height: unset;
      color: $negative;
    }
  }

  .content {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Limit to 2 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: auto; /* Adjust automatically */
    max-height: 40px; /* Adjust based on font-size & line-height */
    line-height: 20px; /* Ensure spacing is correct */
    margin-bottom: 15px;
  }

  .bottom-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 1rem 0 0 0;
    gap: 0.5rem;

    .detail-btn {
      font-size: 1rem;
      padding: 0.2rem 1rem;
      min-height: unset;
      text-transform: capitalize;
      background: #464f50;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      font-weight: 700;
      align-items: center;
    }
  }
}
</style>
