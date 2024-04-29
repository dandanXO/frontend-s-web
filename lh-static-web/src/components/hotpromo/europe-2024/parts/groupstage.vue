<template>
    <div class="team-buttons">
    <button
        v-for="(group, index) in groups"
        :key="index"
        @click="activateTeamsTab(index)"
        :class="{ active: groupActiveTab === index }"
    >
        {{ group.name }} 组
    </button>
</div>
    <div class="team-content">
        <template v-for="gp in groups[groupActiveTab].items">
            <div class="gpbar">
                <div class="group-head">
                    <div class="team-name">
                        {{ groups[groupActiveTab].name }} 组
                    </div>
                    <div class="smalltxt">
                        Group<br>
                        小组赛
                    </div>
                </div>
                <div class="group-section">
                    <div class="team teamA">
                        {{ gp.teamA.name }}
                        <img src="../images/flag.png">
                    </div>
                    <div class="versus">
                        <span class="vs">VS</span>
                        <span class="date">{{ gp.date }}</span>
                    </div>
                    <div class="team teamB">
                        {{ gp.teamB.name }}
                        <img src="../images/flag.png">
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup>

import { ref } from 'vue';
const groups = ref([
  { name: 'A', items: [
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    },
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    },
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    },
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    }
  ] },
  { name: 'B', items: [
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    },
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    },
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    },
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    }
  ] },
  { name: 'C', items: [
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    },
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    },
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    },
    {
        date: '2024-6-15  上午3:00',
        location: 'XXXXXXX体育场',
        teamA: {
            name: '德国',
            flag: 'germany',
        },
        teamB: {
            name: '德国',
            flag: 'germany',
        }
    }
  ] },
]);
const groupActiveTab = ref(0);
function activateTeamsTab(index) {
    groupActiveTab.value = index;
}
</script>
<style lang="scss">
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
                flex: 2;
                background: url(../images/groupbg.png)no-repeat center center;
                    display: flex;
                    background-size: cover;
                    justify-content: space-evenly;
                    gap: 20px;
                    align-items: center;
                    padding: 30px 55px 30px 0px;
                .team-name {
                    color: #FFFFFF33;
                    font-family: Microsoft YaHei UI;
                    font-size: 62.95px;
                    font-weight: 700;
                    line-height: 83.73px;
                }
                .smalltxt {
                    font-family: Microsoft YaHei UI;
                    font-size: 25.67px;
                    font-weight: 400;
                    line-height: 34.14px;
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
                    font-size: 32px;
                    font-weight: 400;
                    line-height: 42.56px;
                    letter-spacing: 0.12em;
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    align-items: center;
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
                        font-size: 58.64px;
                        font-weight: 700;
                        line-height: 77.99px;
                        letter-spacing: 0.12em;
                    }
                    .date {
                        font-family: Microsoft YaHei UI;
                        font-size: 20px;
                        font-weight: 400;
                        line-height: 26.6px;
                        color: #FFFFFFCC;
                    }
                }
            }

        }
    }
</style>