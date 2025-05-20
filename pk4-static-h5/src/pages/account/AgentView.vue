<template>
  <div class="agent-view">
    <!-- <q-tabs v-model="activeTab" dense no-caps class="agent-tab" indicator-color="transparent" align="justify">
      <q-tab name="downline-reg" label="Downline Registration" />
      <q-tab name="link-reg" label="Link Registration" />
      <q-tab name="link-mgmt" label="Link Management" />
    </q-tabs>

    <DownlineReg v-if="activeTab === 'downline-reg'" />
    <LinkReg v-else-if="activeTab === 'link-reg'" />
    <LinkMgmt v-else /> -->

    <LinkMgmt/>
  </div>
</template>
<script setup>
import { ref } from "vue";
import DownlineReg from "src/components/agent/DownlineReg.vue";
import LinkReg from "src/components/agent/LinkReg.vue";
import LinkMgmt from "src/components/agent/LinkMgmt.vue";

const activeTab = ref("link-mgmt");
</script>
<style lang="scss" scoped>
.q-page-container {
  overflow: hidden;
}
.agent-view {
  padding: 15px;
  font-size: 0.9rem;
  height: calc(100vh - 75px);
  position: relative;
  overflow-y: auto;
}
.agent-tab {
  width: 100%;
  background: #3237384d;
  background-size: 100% 100%;
  border-radius: 8px;
  margin-top: 14px;

  :deep(.q-tab__label) {
    font-weight: 700;
    font-size: 0.9rem;
    @media (max-width: 400px) {
      font-size: 0.8rem;
    }
    @media (max-width: 350px) {
      font-size: 0.75rem;
    }
  }

  :deep(.q-tab--active) {
    color: white;
    background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
  }

  :deep(.q-tab--active .q-tab__label) {
    font-weight: 700 !important;
  }

  :deep(.q-tab__label) {
    white-space: normal;
    overflow-wrap: break-word;
    word-break: break-word;
    text-align: center;
  }
}

:deep(.acc-type-radio-container) {
  display: flex;
  margin: 20px 0;
  font-weight: 700;
  align-items: center;
  > div {
    margin-right: 14px;
  }
  .acc-type-radio {
    margin-right: 20px;
  }
}

:deep(.acc-type-radio .q-radio__inner),
:deep(.acc-type-radio .q-radio__bg) {
  display: none;
}

:deep(.form-field-label) {
  margin-bottom: 6px;
}
:deep(.landing-input) {
  margin-bottom: 12px;
}

:deep(.rebate-setting-container) {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  .toggle-container {
    .custom-toggle {
      min-width: 44px;
      min-height: 22px;
      border-radius: 999px;
      background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
      position: relative;
      justify-content: center;

      :deep(.q-toggle__track) {
        background-color: transparent !important;
        opacity: 1;
      }

      :deep(.q-toggle__thumb) {
        height: 16px;
        width: 16px;
        top: 2px;
      }

      :deep(.q-toggle--model-true .q-toggle__thumb) {
        left: 24px;
      }

      :deep(.q-toggle__inner--truthy .q-toggle__thumb:after) {
        color: white;
      }
    }

    .toggle-left-label {
      margin-right: 10px;
    }
    .toggle-right-label {
      margin-left: 10px;
    }
  }
}

:deep(.custom-btn) {
  width: calc(100% - 30px);
  background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
  height: 40px;
  padding: 10px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 30px;
}

:deep(.custom-select) {
  background: linear-gradient(90deg, #1c273d 0%, #12192b 100%);
  border-radius: 12px;
  margin-bottom: 24px;
}

:deep(.q-field__control:before),
:deep(.q-field__control) {
  background: transparent;
  border: none;
  border-radius: 12px;
  box-shadow: none;
  color: #cfd4e0;
  padding-left: 12px;
  padding-right: 12px;
  height: 40px;
}
:deep(.q-field__native),
:deep(.q-field__label) {
  color: #8a9bc0 !important;
  font-family: Microsoft YaHei UI !important;
}
:deep(.q-field--dense .q-field__append + .q-field__append) {
  display: none;
}
:deep(.q-field__append.q-anchor--skip) {
  display: none !important;
}
</style>
