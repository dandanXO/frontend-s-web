<template>
  <div class="team-buttons">
    <button
      v-for="(group, index) in groupedMatches"
      :key="index"
      @click="activateTeamsTab(index)"
      :class="{ active: groupActiveTab === index }"
    >
      {{ group.teamGroup }} 组
    </button>
  </div>
  <transition name="fade" mode="out">
    <div class="team-content" v-if="groupedMatches[groupActiveTab]">
      <template v-for="gp in groupedMatches[groupActiveTab].items">
        <div class="gpbar">
          <div class="group-head">
            <!-- <div class="team-name">
              {{ groupedMatches[groupActiveTab].teamGroup }} 组
            </div> -->
            <div class="smalltxt">
              <div class="team-name">
                Group<br>
                小组赛
              </div>
              <span class="date">{{ gp.matchTime }}</span>
            </div>
          </div>
          <div class="group-section">
            <div class="team teamA">
              {{ gp.teamOneName }}
              <img :src="imgUrl + gp.teamOneIcon">
            </div>
            <div class="versus">
              <span class="vs">VS</span>
              <button
                class="bracket-team-select__button"
              >
                点击投注
              </button>
            </div>
            <div class="team teamB">
              {{ gp.teamTwoName }}
              <img :src="imgUrl + gp.teamTwoIcon">
            </div>
          </div>
        </div>
      </template>
    </div>
  </transition>
</template>
<script setup>

import { onMounted, computed } from 'vue';
import { ref } from 'vue';
import { euroMatchAll } from '@/api/promotion/eurocup';
const matches = ref([]);
const imgUrl = process.env.VUE_APP_IMAGE_CDN + '/promo/';
const groupedMatches = computed(() => {
  const groups = {};
  matches.value.forEach(match => {
    if(match.teamGroup === '2' || match.teamGroup === '4'|| match.teamGroup === '8' || match.teamGroup === '16') {
      return
    }
    if (!groups[match.teamGroup]) {
      groups[match.teamGroup] = [];
    }
    groups[match.teamGroup].push(match);
  });
  return Object.keys(groups).map(teamGroup => ({
    teamGroup,
    items: groups[teamGroup]
  }));
});
const groupActiveTab = ref(0);
function activateTeamsTab(index) {
  groupActiveTab.value = index;
}
onMounted(() => {
  euroMatchAll().then((res) => {
    if (res.code === 0) {
      matches.value = res.data
    }
  })
})
</script>
<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.team-buttons {
  display: flex;
  gap: 50px;
  margin: 20px 0px;
  button {
    color: #FFFFFFCC;
    display: flex;
    background: none;
    font-family: 'Microsoft YaHei UI';
    font-size: 32px;
    font-weight: 700;
    line-height: 42.56px;
    letter-spacing: 0.12em;
    justify-content: center;
    align-items: center;
    gap: 10px;
    &:before{
      content: '';
      width: 5px;
      height: 30px;
      background: unset;
    }
    &.active {
      color: #FFFFFF;
      &:before {
        background: linear-gradient(180deg, #008DF9 0%, #00FFF0 100%);
      }
    }
  }
}
.team-content {
  // display: flex;
  // flex-direction: column;
  gap: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  .gpbar {
    display: flex;
    justify-content: stretch;
    align-items: center;
    background: #051D4766;
    border: 1px solid #FFFFFF66;
    .group-head {
      flex: 2;
      background: url(../images/groupbg.png)no-repeat center right;
      display: flex;
      background-size: cover;
      justify-content: space-evenly;
      gap: 20px;
      align-items: center;
      padding: 20px 50px 20px 0;

      .smalltxt {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;

        .team-name {
          color: #FFFFFF33;
          font-family: Microsoft YaHei UI;
          font-size: 25.67px;
          font-weight: 700;
          line-height: 34.14px;
          text-align: center;
        }

        .date {
          font-family: Microsoft YaHei UI;
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
          color: #FFFFFFCC;
        }
      }
    }
    .group-section {
      flex:6;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;

      > div{
        flex: 1;
      }
      .team {
        color: #ffffff;
        font-family: Microsoft YaHei UI;
        font-size: 22px;
        font-weight: 400;
        line-height: 32.56px;
        letter-spacing: 0.12em;
        display: flex;

        gap: 0;
    align-items: center;
    flex-direction: column-reverse;
        &.teamA{
          justify-content: flex-end;
        }
        &.teamB {
          justify-content: flex-end;
        }
        img {
          width: 50px;
        }

      }
      .versus {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .vs {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%);
          color: transparent; /* Hide the original text */
          -webkit-background-clip: text; /* Apply background gradient to the text */
          background-clip: text;
          font-family: Microsoft YaHei UI;
          font-size: 58.64px;
          font-weight: 700;
          line-height: 77.99px;
          letter-spacing: 0.12em;
        }

        .bracket-team-select__button {
          background: linear-gradient(180deg, #fcf5ff 0%, #8db9ee 100%);
          padding: 6px 30px;
          border-radius: 33px;
          font-size: 20px;
          font-weight: 700;
          line-height: 28px;
          letter-spacing: 0.12em;
          color: #333333;
          word-break: keep-all;

          &:hover,
          &.active {
            background: linear-gradient(180deg, #008df9 0%, #0051b3 100%);
            color: #ffffff;
          }
        }
      }
    }

  }
}
</style>