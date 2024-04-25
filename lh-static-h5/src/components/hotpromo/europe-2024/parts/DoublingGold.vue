<template>
    <div class="tab-title">
        {{ tabtitle }}
    </div>
    <div class="doublinggold">
        <span class="note">
            注：用户选定每组的参与队伍后不予更改；
        </span>
        <div class="teams">
            <div v-for="(team, teamindex) in teams" :key="teamindex" class="team">
                <div class="team-box">
                    <div class="team-num">{{ team.name }} 组</div>
                    <div class="chosen-items">
                        <div class="selection">
                            {{ team.selection.length > 0 ? '' : '请选队伍' }}
                            <div class="selected-items">
                                <div v-for="(t, idx) in team.selection" :key="idx">
                                    {{ t.name }}
                                </div>
                            </div>
                        </div>
                        <div @click="team.selection.length > 0 ? confirmSelection(team) : null" class="unselectedbtn" v-if="!team.isSelectionConfirmed">
                            {{ team.selection.length > 0 ? '确定' : '未选择' }}
                        </div>
                        <div class="selectedbtn" v-if="team.isSelectionConfirmed">
                            已选择
                        </div>
                    </div>
                    <div class="choices" :class="{ isConfirmed: team.isSelectionConfirmed }">
                        <div @click="team.isSelectionConfirmed ? null : toggleSelection(team, choice.name)"
                            :class="{ 'selected': team.selection.some(item => item.name === choice.name) }"
                            v-for="(choice, cidx) in choices" :key="cidx" class="choice">
                            <div class="close-icon"></div>
                            <img src="../images/flag.png">
                            {{ choice.name }}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <table>
        <tr>
            <th>早期有效投注</th>
            <th>开赛奖金</th>
            <th>彩金倍数</th>
        </tr>
        <tr>
            <td>≥1888</td>
            <td>18</td>
            <td rowspan="2">3倍</td>
        </tr>
        <tr>
            <td>≥1888</td>
            <td>18</td>
        </tr>
    </table>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    tabtitle: String
});
const teams = ref([
    {
        name: 'A',
        selection: [{ name: '德国' }, { name: '苏格兰' }],
        isSelectionConfirmed: true,
    },
    
    {
        name: 'B',
        selection: [],
        isSelectionConfirmed: false,
    },
    
    {
        name: 'C',
        selection: [],
        isSelectionConfirmed: false,
    },
    
    {
        name: 'D',
        selection: [],
        isSelectionConfirmed: false,
    }
])
const choices = ref([
    {
        name: '德国',
    },
    {
        name: '苏格兰'
    },
    {
        name: '美国'
    },
    {
        name: '法国'
    },
])

function toggleSelection(team, choiceName) {
    if (team && Array.isArray(team.selection)) {
        const index = team.selection.findIndex(item => item.name === choiceName);
        if (index === -1) {
            // Choice is not selected, so add it to the selection
            team.selection.push({ name: choiceName });
        }
        else {
          // Choice is already selected, so remove it from the selection
          team.selection.splice(index, 1);
        }
        
    } else {
        console.error('Team or selection array is undefined.');
    }
}
function confirmSelection(team, choiceName) {
    if (team && Array.isArray(team.selection)) {
        team.isSelectionConfirmed = true;
    }

}
</script>
<style lang="scss">
.teams {
    display: grid;
    gap: 15px;
    margin: 20px 0;

    .team {
        .team-box {
            position: relative;
            background-size: contain;
            background: url(../images/teambg.png)no-repeat center center;

            .team-num {
                position: absolute;
                padding: 6px;
                background: linear-gradient(180deg, #F99500 0%, #B34B00 100%);
                width: 20%;
                border-radius: 5px;
                text-align: center;
                color: #ffffff;
                font-family: Microsoft YaHei UI;
                font-size: 20px;
                font-weight: 700;
                line-height: 25.56px;
            }

            .chosen-items {
                margin-left: 20%;
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #ffffff;
                font-family: Microsoft YaHei UI;
                font-size: 12px;
                font-weight: 400;
                padding: 10px;

                .selection {
                    color: #FFFFFFCC;
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    align-items: center;

                    .selected-items {

                        display: flex;
                        gap: 10px;
                        justify-content: center;
                        align-items: center;
                        color: #ffffff;
                    }
                }

                .unselectedbtn {
                    // background: linear-gradient(180deg, #FCF5FF 0%, #8DB9EE 100%);
                    // font-family: Microsoft YaHei UI;
                    // font-size: 24px;
                    // font-weight: 700;
                    // line-height: 31.92px;
                    // letter-spacing: 0.12em;
                    // color: #1A396F;
                    
                    background: linear-gradient(180deg, #FCF5FF 0%, #8DB9EE 100%);font-family: Microsoft YaHei UI;
                    font-size: 15px;
                    font-weight: 700;
                    color: #1A396F;
                    padding: 5px 20px;
                    border-radius: 24px;
                    cursor: pointer;
                }

                .selectedbtn {
                    background: linear-gradient(180deg, #008DF9 0%, #0051B3 100%);
                    font-family: Microsoft YaHei UI;
                    font-size: 15px;
                    font-weight: 700;
                    color: #ffffff;
                    padding: 5px 20px;
                    border-radius: 24px;
                }
            }

            .choices {
                display: flex;
                gap: 10px;
                align-items: center;
                justify-content: space-evenly;
    height: 150px;

                .choice {
                    display: flex;
                    flex-direction: column;
                    color: #ffffff;
                    align-items: center;
                    justify-content: center;
                    padding: 5px;
                    cursor:pointer;

                    .close-icon {
                        display: none;
                    }

                    &.selected {
                        border: 1px solid;
                        background: linear-gradient(180deg, #00D1FF 0%, #0D70D6 100%);
                        border-radius: 14px;
                        position: relative;

                        .close-icon {
                        display: block;
                            background: url(../images/close.png);
                            position: absolute;
                            top: -15px;
                            right: -15px;
                            width: 35px;
                            height: 35px;
                            background-size: contain;
                        }
                    }
                }
                &.isConfirmed {
                    .choice {
                        opacity: .4;
                        &.selected {
                            opacity: 1;
                        }
                        .close-icon {
                            display: none;
                        }
                    }
                }
            }
        }
    }
}
</style>