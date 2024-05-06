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
        <template v-for="(gp, idx) in groupedMatches[groupActiveTab].items" :key="idx">
            <div class="gpbar">
                <div class="group-head">
                    <div class="team-name">
                        {{ groupedMatches[groupActiveTab].teamGroup }} 组
                    </div>
                    <div class="smalltxt">
                        Group<br>
                        小组赛
                    </div>
                </div>
                <div class="group-section">
                    <div class="team teamA">
                        {{ gp.teamOneName }}
                        <img :src="imgUrl + gp.teamOneIcon">
                    </div>
                    <div class="versus">
                        <span class="vs">VS</span>
                        <span class="date">{{ gp.matchTime }}</span>
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
import { eventapi } from "boot/axios";
const matches = ref([]);
const imgUrl = process.env.IMAGE_CDN + '/promo/';
const groupedMatches = computed(() => {
  const groups = {};
  matches.value.forEach(match => {
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
    eventapi.get("/uefa/match/all").then((res) => {
        if (res.code === 0) {
            matches.value = res.data
        }
    })
})
</script>
<style lang="scss">
.team-buttons {
        display: flex;
        gap:10px;
        margin: 20px 0px;
    button {
        color: #FFFFFFCC;
        display: flex;
        background: none;
        font-family: 'Microsoft YaHei UI';
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0.12em;
        justify-content: center;
        align-items: center;
        border: 0;
        gap: 10px;
        &:before{
            content: '';
            width: 2px;
            height: 10px;
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
        display: flex;
        flex-direction: column;
        gap: 20px;
        .gpbar {
            display: flex;
            justify-content: stretch;
            align-items: center;
            background: #051D4766;
            border: 1px solid #FFFFFF66;
            .group-head {
                flex: 1;
                background: url(../images/groupbg.png)no-repeat right center;
                    
                
            display: flex;
    background-size: cover;
    justify-content: space-evenly;
    align-items: center;
    padding: 5px 25px 5px 0;
    flex-direction: column;
                .team-name {
                    color: #FFFFFF33;
                    font-family: Microsoft YaHei UI;
                    font-size: 15px;
                    font-weight: 700;
                }
                .smalltxt {
                    font-family: Microsoft YaHei UI;
                    font-size: 8px;
                    font-weight: 400;
                    text-align: left;
                    color: #ffffff;

                }
            }
            .group-section {
                flex:6;
                display: flex;
                justify-content: center;
                align-items: center;
                    gap: 20px;
                .team {
                    color: #ffffff;
                    font-family: Microsoft YaHei UI;
                    font-size: 12px;
                    font-weight: 400;
                    letter-spacing: 0.12em;
                    display: flex;
                    gap: 5px;
                    justify-content: center;
                    align-items: center;
                    img {
                        width: 20px !important;
                        height: unset;
                    }
                    &.teamB {
                        flex-direction: row-reverse;
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
                        font-size: 18px;
                        font-weight: 700;
                        letter-spacing: 0.12em;
                    }
                    .date {
                        font-family: Microsoft YaHei UI;
                        font-size: 10px;
                        font-weight: 400;
                        color: #FFFFFFCC;
                    }
                }
            }

        }
    }
</style>