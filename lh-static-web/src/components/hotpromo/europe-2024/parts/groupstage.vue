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
                        Group
                        小组赛
                    </div>
                </div>
                <div class="group">
                    {{ gp.date }}
                </div>
                <div class="team teamA">
                    {{ gp.teamA.name }}
                    <img src="../images/flag.png">
                </div>
                <div class="versus">
                    <span>VS</span>
                    <span>{{ gp.location }}</span>
                </div>
                <div class="team teamB">
                    {{ gp.teamB.name }}
                    <img src="../images/flag.png">
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
  { name: 'B' },
  { name: 'C' },
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
        gap: 5px;
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
            justify-content: space-between;
            align-items: center;
            background: #051D4766;
            .group-head {
                background: url(../images/groupbg.png)no-repeat center center;
                    display: flex;
                    background-size: cover;
                    ;
                .team-name {
                    color: #FFFFFF33;
                    font-family: Microsoft YaHei UI;
                    font-size: 62.95px;
                    font-weight: 700;
                    line-height: 83.73px;


                }
            }

        }
    }
</style>