<template>
  <div class="tab-container">
    <div class="tab-style q-gutter-y-md">
      <q-tabs inline-label class="tab-wrapper text-white">
        <q-route-tab
          v-for="(e, i) in tabList"
          :key="`${e}-${i}`"
          :ripple="false"
          name="mails"
          class="tab-btn-container"
        >
          <img
            v-if="isActiveTab(e)"
            class="tab-title-deco left"
            src="../assets/images/index/tab-title-deco.png"
            alt=""
          />
          <img v-if="isActiveTab(e)" class="text-glow" src="../assets/images/index/text-glow.png" alt="" />
          <q-btn
            :class="`tab-title-btn ${!isActiveTab(e) ? 'inactive-text' : ''}`"
            size="sm"
            color="yellow"
            flat
            :ripple="false"
            @click="onTabClick(e)"
          >
            {{ e }}
          </q-btn>
          <img v-if="isActiveTab(e)" class="tab-title-deco" src="../assets/images/index/tab-title-deco.png" alt="" />
        </q-route-tab>
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["tabList", "onTabClick", "isActiveTab"]);
</script>

<style lang="scss">
.tab-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 0 7rem;

  .tab-style {
    max-width: 18.25rem;

    .tab-wrapper {
      .tab-btn-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 1.5rem 0 0;

        img {
          width: 2.25rem;
        }

        .tab-title-deco {
          &.left {
            transform: rotate(180deg);
          }
        }

        .text-glow {
          position: absolute;
          width: 5rem;
        }

        .tab-title-btn {
          padding: 0;

          &.inactive-text {
            opacity: 0.5;
          }

          span {
            font-size: 1.25rem;
            font-weight: 700;
            color: white;
            text-transform: capitalize;
          }
        }
      }
    }
  }
}
</style>
