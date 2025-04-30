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
        <img alt="forum" src="@/assets/images/agent/scan-qr-icon.png" width="16" height="16" />
        <div class="icon-divider"></div>
        <img alt="forum" src="@/assets/images/agent/delete-icon.png" width="16" height="16" />
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
</style>
