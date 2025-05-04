<template>
  <div v-for="(card, index) in cards" :key="card.id" class="forum-card">
    <div class="forum-card__header">
      <div class="forum-card__title">
        <img alt="forum" src="@/assets/images/agent/forum-icon.png" width="24" height="24" />
        <span>Forum</span>
      </div>
      <div class="forum-card__icons">
        <img alt="forum" src="@/assets/images/agent/add-user-icon.png" width="16" height="16" />
        <div class="icon-divider"></div>
        <img
          alt="scan-qr"
          src="@/assets/images/agent/scan-qr-icon.png"
          width="16"
          height="16"
          @click="isScanQrDialog = true"
        />
        <div class="icon-divider"></div>
        <img alt="delete" src="@/assets/images/agent/delete-icon.png" width="16" height="16" />
        <div class="icon-divider"></div>

        <img
          class="arrow-icon"
          :class="{ rotated: !card.expanded }"
          alt="forum"
          src="@/assets/images/agent/arrow-down.png"
          width="20"
          height="20"
          @click="toggleCard(index)"
        />
      </div>
    </div>

    <transition name="collapse">
      <div v-if="card.expanded" class="forum-card__info">
        <div class="row-info">
          <span>Creation Date</span>
          <span>2025-04-28</span>
        </div>
        <div class="row-info">
          <span>Date Of Expiry</span>
          <span>2025-04-29</span>
        </div>
      </div>
    </transition>

    <q-separator class="forum-card__separator" />

    <div class="forum-card__subtitles">
      <span>RegisterTypes</span>
      <span>Registers</span>
      <span>Status</span>
    </div>

    <div class="forum-card__footer">
      <div class="footer-item red">Member</div>
      <div class="footer-item blue">0</div>
      <div class="footer-item green">Normal</div>
    </div>
  </div>

  <q-dialog class="scan-qr-dialog" v-model="isScanQrDialog">
    <div class="popout-dialog">
      <q-btn dense icon="close" class="text-white top-right" flat v-close-popup />
      <div class="popout-dialog-container">
        <div class="qr-header">
          <div class="qr-header-left">
            <img alt="forum" src="@/assets/images/agent/forum-icon.png" width="24" height="24" />
            <span class="qr-title">gi6qq</span>
          </div>
          <span class="qr-subtitle">QR code</span>
        </div>

        <div class="qr-subtext">
          <img alt="scan-qr" src="@/assets/images/agent/scan-qr-icon-2.png" width="18" height="18" />
          <span>Scan the QR code to register</span>
        </div>

        <div class="qr-code-container">
          <img class="qr-code" alt="qr-code" src="@/assets/images/agent/qr-img-example.png" />
          <div class="qr-caption">press and hold to save QR code to album</div>
        </div>

        <div class="qr-link-row">
          <img alt="qr-code" src="@/assets/images/agent/copy-link-icon.png" width="20" height="20" />
          <span class="qr-url">https://Gi6qq.Link/.../Register.html</span>
        </div>

        <q-btn label="Copy Link" class="copy-btn" unelevated />
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { ref } from "vue";

const cards = ref(
  Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    expanded: false
  }))
);

const toggleCard = (index) => {
  if (cards.value[index]) {
    cards.value[index].expanded = !cards.value[index].expanded;
  }
};

const isScanQrDialog = ref(false);
</script>
<style lang="scss" scoped>
.forum-card {
  background: linear-gradient(90deg, #1c273d 0%, #12192b 100%);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  color: #b2bdbf;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  font-family: Microsoft YaHei UI;
  font-weight: 400;
  font-size: 1rem;

  .forum-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .forum-card__title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.4rem;
      font-weight: 600;
    }

    .forum-card__icons {
      display: flex;
      gap: 8px;
      place-items: center;

      .q-icon {
        color: #cfd4e0;
        cursor: pointer;
      }

      .icon-divider {
        width: 1px;
        height: 16px;
        background-color: rgba(255, 255, 255, 0.2);
        margin: 0 4px;
      }
    }
  }

  .forum-card__info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 1rem;

    .row-info {
      display: flex;
      justify-content: space-between;
    }
  }

  .forum-card__separator {
    margin-top: 4px;
    margin-bottom: 4px;
    opacity: 0.3;
  }

  .forum-card__subtitles {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;

    span {
      width: 33%;
      text-align: center;
    }
  }

  .forum-card__footer {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 1rem;

    .footer-item {
      width: 33%;
      text-align: center;

      &.red {
        color: #ef2121;
      }

      &.blue {
        color: #218fef;
      }

      &.green {
        color: #21ef89;
      }
    }
  }
}

.arrow-icon {
  transition: transform 0.3s ease;
  cursor: pointer;

  &.rotated {
    transform: rotate(180deg);
  }
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 200px;
  opacity: 1;
}

.scan-qr-dialog {
  .popout-dialog .popout-dialog-container {
    color: #b2bdbf;
    font-size: 1rem;
  }

  .qr-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 100%;
    position: relative;
    color: #090f1e;
    font-weight: 700;
    font-size: 1.25rem;

    .qr-header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .qr-subtitle {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0.275rem;
    }
  }

  .qr-subtext {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 10px;
  }

  .qr-code-container {
    text-align: center;
    background-color: #eaeff9;
    padding: 10px 12px;
    border-radius: 5px;
    width: 80%;
    .qr-caption {
      color: #999;
      font-size: 13px;
      margin-top: 8px;
    }
    .qr-code {
      width: 80%;
      max-width: 200px;
    }
  }

  .qr-link-row {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    color: #007bff;
    font-size: 14px;
    margin-top: 22px;
    margin-bottom: 20px;
  }

  .copy-btn {
    width: 100%;
    font-weight: bold;
    font-size: 14px;
    background: linear-gradient(90deg, #0287f2 0%, #0664d2 100%);
    color: #fff;
    border-radius: 12px;
  }
}
</style>
