<template>
  <div>
    <div class="acc-type-radio-container">
      <div>Account type:</div>
      <q-radio v-model="accTypeLinkReg" val="player" class="acc-type-radio">
        <template #default>
          <div class="row items-center no-wrap">
            <span>
              <img
                v-if="accTypeLinkReg === 'player'"
                src="@/assets/images/agent/check.png"
                alt="Checked"
                width="24"
                height="24"
              />
              <img v-else src="@/assets/images/agent/uncheck.png" alt="Unchecked" width="24" height="24" />
            </span>
            <span class="q-ml-sm">Player</span>
          </div>
        </template>
      </q-radio>
      <q-radio v-model="accTypeLinkReg" val="agent" class="acc-type-radio">
        <template #default>
          <div class="row items-center no-wrap">
            <span>
              <img
                v-if="accTypeLinkReg === 'agent'"
                src="@/assets/images/agent/check.png"
                alt="Checked"
                width="24"
                height="24"
              />
              <img v-else src="@/assets/images/agent/uncheck.png" alt="Unchecked" width="24" height="24" />
            </span>
            <span class="q-ml-sm">Agent</span>
          </div>
        </template>
      </q-radio>
    </div>

    <q-select
      v-model="linkRegForm.duration"
      :options="durationList"
      outlined
      dense
      dropdown-icon=""
      class="custom-select"
      emit-value
      map-options
      label="Duration"
    >
      <template #append>
        <img alt="forum" src="@/assets/images/agent/arrow-down.png" width="20" height="20" />
      </template>
    </q-select>

    <q-select
      v-model="linkRegForm.forum"
      :options="forumList"
      outlined
      dense
      dropdown-icon=""
      class="custom-select"
      emit-value
      map-options
      label="Forum"
    >
      <template #append>
        <img alt="forum" src="@/assets/images/agent/arrow-down.png" width="20" height="20" />
      </template>
    </q-select>

    <q-select
      v-model="linkRegForm.promoForum"
      :options="promoForumList"
      outlined
      dense
      dropdown-icon=""
      class="custom-select"
      emit-value
      map-options
      label="PromotionForum"
    >
      <template #append>
        <img alt="forum" src="@/assets/images/agent/arrow-down.png" width="20" height="20" />
      </template>
    </q-select>

    <div class="rebate-setting-container">
      <div>Rebate Setting:</div>
      <div class="toggle-container">
        <span class="toggle-left-label" :class="!isHighestLinkReg ? 'active' : ''">Lowest</span>
        <q-toggle
          v-model="isHighestLinkReg"
          color="primary"
          keep-color
          dense
          size="md"
          ripple="false"
          class="custom-toggle"
        />
        <span class="toggle-right-label" :class="isHighestLinkReg ? 'active' : ''">Highest</span>
      </div>
    </div>

    <div class="custom-btn">GENERATE LINK</div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";

const accTypeLinkReg = ref("player");
const linkRegForm = reactive({
  duration: "",
  forum: "",
  promoForum: ""
});
const durationList = [
  { label: "1 Day", value: "1" },
  { label: "7 Days", value: "7" },
  { label: "30 Days", value: "30" }
];

const forumList = [
  { label: "1 Day", value: "1" },
  { label: "7 Days", value: "7" },
  { label: "30 Days", value: "30" }
];
const promoForumList = [
  { label: "1 Day", value: "1" },
  { label: "7 Days", value: "7" },
  { label: "30 Days", value: "30" }
];
const isHighestLinkReg = ref(false);
</script>
