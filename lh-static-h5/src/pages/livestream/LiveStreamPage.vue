<template>
  <template v-if="!$q.dark.isActive">
    <div class="white">
      <div class="row justify-center q-pa-md">
        <q-btn-toggle
          v-model="model"
          class="top-toggle-menu"
          no-caps
          rounded
          unelevated
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="[
            { value: 'one', slot: 'one' },
            { value: 'two', slot: 'two' }
            // { value: 'three', slot: 'three' }
          ]"
        >
          <template v-slot:one>
            <div class="row items-center no-wrap">
              <q-icon left name="mic" />
              <div class="text-center">主播</div>
              <!-- <div class="float-stream">直播中</div> -->
              <q-badge color="red" rounded floating>直播中</q-badge>
            </div>
          </template>
          <template v-slot:two>
            <div class="row items-center no-wrap">
              <q-icon left name="sports_soccer" />
              <div class="text-center">足球</div>
            </div>
          </template>
          <!-- <template v-slot:three>
            <div class="row items-center no-wrap">
              <q-icon left name="sports_soccer" />
              <div class="text-center">lan球</div>
            </div>
          </template> -->
        </q-btn-toggle>
      </div>

      <!-- selection-container -->
      <div class="selection-container q-px-md">
        <!-- selection-item -->
        <router-link to="/livestream/streamplayer" class="selection-item">
          <div class="item-img"><img src="../../assets/images/livestream/img-placeholder-stream.png" alt="" /></div>
          <div class="item-content">
            <div class="content-title">德国甲级联赛</div>
            <div class="content-desc">沃尔夫斯堡VS库勒沃斯</div>
          </div>
          <div class="item-float-content">
            <div class="content-float float-user">
              <div class="user-avatar"><img src="https://cdn.quasar.dev/img/avatar.png" /></div>
              <div>悦悦</div>
            </div>
            <div class="content-float float-filled">
              <div>正在直播</div>
            </div>
          </div>
        </router-link>

        <div class="selection-item">
          <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
          <div class="item-content">
            <div class="content-title">2025LCK杯</div>
            <div class="content-desc">T1 vs Nongshim RedForce</div>
          </div>
          <div class="item-float-content">
            <div class="content-float float-user">
              <div class="user-avatar"><img src="https://cdn.quasar.dev/img/avatar.png" /></div>
              <div>悦悦</div>
            </div>
            <div class="content-float float-detail">
              <q-icon name="notifications" />
              <div>7人预约</div>
            </div>
          </div>
        </div>

        <div class="selection-item">
          <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
          <div class="item-content">
            <div class="content-title">2025LCK杯</div>
            <div class="content-desc">T1 vs Nongshim RedForce</div>
          </div>
        </div>
        <div class="selection-item">
          <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
          <div class="item-content">
            <div class="content-title">2025LCK杯</div>
            <div class="content-desc">T1 vs Nongshim RedForce</div>
          </div>
        </div>
        <div class="selection-item">
          <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
          <div class="item-content">
            <div class="content-title">2025LCK杯</div>
            <div class="content-desc">T1 vs Nongshim RedForce</div>
          </div>
        </div>
        <div class="selection-item">
          <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
          <div class="item-content">
            <div class="content-title">2025LCK杯</div>
            <div class="content-desc">T1 vs Nongshim RedForce</div>
          </div>
        </div>
        <div class="selection-item">
          <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
          <div class="item-content">
            <div class="content-title">2025LCK杯</div>
            <div class="content-desc">T1 vs Nongshim RedForce</div>
          </div>
        </div>
        <div class="selection-item">
          <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
          <div class="item-content">
            <div class="content-title">2025LCK杯</div>
            <div class="content-desc">T1 vs Nongshim RedForce</div>
          </div>
        </div>
        <div class="selection-item">
          <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
          <div class="item-content">
            <div class="content-title">2025LCK杯</div>
            <div class="content-desc">T1 vs Nongshim RedForce</div>
          </div>
        </div>
        <div class="selection-item">
          <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
          <div class="item-content">
            <div class="content-title">2025LCK杯</div>
            <div class="content-desc">T1 vs Nongshim RedForce</div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- <template v-else>
    <div class="hot-match-container">
      <div class="competition-items">
        <div
          class="competition-item"
          v-for="competitionType in competitionTypes"
          :class="{ active: competitionType === selectedCompetitionType }"
          @click="selectedCompetitionType = competitionType"
          :key="competitionType"
        >
          <img
            class="competition-item-img"
            :src="
              competitionType === selectedCompetitionType
                ? require(`../../assets/images/hotmatch/${competitionType.toLowerCase()}-active-bg.png`)
                : require(`../../assets/images/hotmatch/${competitionType.toLowerCase()}-bg.png`)
            "
          />
        </div>
      </div>
    </div>

    <div class="hot-match-items">
      <div
        :class="selectedCompetitionType"
        class="hot-match-item"
        v-for="hotMatch in hotMatchesByType"
        :key="hotMatch.id"
      >
        <div class="hot-match-info">
          <div class="hot-match-name">
            {{ hotMatch.competitionName }}
          </div>
          <div class="hot-match-scores">
            <div class="hot-match-team">
              <img class="hot-match-img" :src="`${imgUrl}/promo/${hotMatch.teamOneLogo}`" />
              <span>{{ hotMatch.teamOneName }}</span>
            </div>
            <div class="hot-match-time">
              {{ hotMatch.competitionTime }}
              <div class="bet-btn" @click="openGame(hotMatch.platformName, hotMatch.platformCode, hotMatch.gameCode)">
                立即投注
              </div>
            </div>
            <div class="hot-match-team">
              <img class="hot-match-img" :src="`${imgUrl}/promo/${hotMatch.teamTwoLogo}`" />
              <span>{{ hotMatch.teamTwoName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template> -->

  <GameModal ref="gameRef" />
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import GameModal from "../../components/modal/GameModal.vue";

const model = ref("one");
</script>

<style lang="scss" scoped>
.top-toggle-menu {
  width: 100%;
  padding: 6px;
  background: #ffffff;
  box-shadow: 0px -1px 3.66px 0px #a2bff4 inset;

  :deep(.q-btn-item) {
    width: 100%;

    &.bg-primary {
      border-radius: 50px;
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%) !important;
    }
  }

  .float-stream {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.selection-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 12px;
  column-gap: 12px;
  .selection-item {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 4px 4px 0px #10264517;
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    .item-float-content {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      top: 0;
      left: 0;
      padding: 8px;

      .content-float {
        background: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 24px;
        font-size: 12px;
        min-height: 24px;
        &.float-user {
          padding: 0px 8px 0px 0px;
          .user-avatar {
            img {
              display: block;
              width: 100%;
              max-width: 24px;
              border-radius: 50%;
            }
          }
        }
        &.float-detail {
        }
        &.float-filled {
          border-radius: 6px;
          background: #1ac1a2;
        }
      }
    }

    .item-img {
      img {
        display: block;
        width: 100%;
        opacity: 0.9;
      }
    }
    .item-content {
      padding: 3px 6px;
      .content-title {
        font-size: 18px;
        font-weight: bold;
      }
      .content-desc {
        color: #7a80a1;
      }
    }
  }
}
</style>
