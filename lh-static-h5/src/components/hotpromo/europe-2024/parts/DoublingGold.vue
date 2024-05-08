<template>
  <div class="tab-title">
    {{ tabtitle }}
  </div>

  <div class="doublinggold">
        <span class="note">
            注：用户选定每组的参与队伍后不予更改；
        </span>
    <div class="teams">
      <div v-for="(team, teamindex) in teams" class="team" :key="teamindex">
        <div class="team-box">
          <div class="team-num">{{ team.name }} 组</div>
          <div class="chosen-items">
            <div class="selection">
              {{ team.selection.length > 0 ? ' 已选择：' : '请选队伍' }}
              <div class="selected-items">
                <div v-for="t in team.selection" :key="t">
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
            <div @click="team.isSelectionConfirmed ? null : toggleSelection(team, choice)"
                 :class="{ 'selected': team.selection.some(item => item.id === choice.id) }"
                 v-for="(choice, choiceindex) in team.choices" class="choice" :key="choiceindex">
              <div class="close-icon"></div>
              <img class="team-flag" :src="`${imgURL}${choice.teamIcon}`" />
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
      <td>88</td>
    </tr>
  </table>
  <div class="rule-title">
    活动规则
  </div>
  <ol class="rule-content">
    <li>活动期间，会员在A组~F组每组选出一只队伍作为用户参赛队伍，若用户选择的队伍胜利且有效投注≥3,000元即可获的专属队伍奖金；</li>
    <li>活动期间，用户参与免费竞猜，竞猜正确可获100积分，若用户选择的参与队伍获胜可额外加赠100积分，积分对应彩金仅限领取1次，积分≥6000分是可获188元；</li>
    <li>此活动全体会员均可参与，参与前请完善个人资料，绑定手机号码及银行卡；</li>
    <li>仅计算已结算并产生输赢结果的注单，任何平局、串关、取消的注单不予计算，任何低于欧洲盘1.5、香港盘0.5赔率以下的注单以及在同一赛事中同时投注对等盘口将不予计算；</li>
    <li>每位有效会员、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑以及其他登录设备只能享受一次活动优惠，如有任何违规者或任何团体以不正常的方式进行套取活动优惠，我站保留在不通知的情况下冻结或关  闭相关账户的权利，并不退还款项，且用户列入黑名单；</li>
    <li>为避免文字理解差异，本站保留最终解释权。</li>
  </ol>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import { eventapi } from "boot/axios"


const imgURL = process.env.IMAGE_CDN + "/promo/";
const props = defineProps({
  tabtitle: String
});
const teams = ref([
  // {
  //     name: 'A',
  //     selection: [{ name: '德国' }, { name: '苏格兰' }],
  //     isSelectionConfirmed: true,
  //     choices: [{
  //     name: '德国',
  // },
  // {
  //     name: '苏格兰'
  // },
  // {
  //     name: '美国'
  // },
  // {
  //     name: '法国'
  // },]
  // },

  // {
  //     name: 'B',
  //     selection: [],
  //     isSelectionConfirmed: false,
  // },

  // {
  //     name: 'C',
  //     selection: [],
  //     isSelectionConfirmed: false,
  // },

  // {
  //     name: 'D',
  //     selection: [],
  //     isSelectionConfirmed: false,
  // }
]);

function toggleSelection(team, choice) {
  if (team && Array.isArray(team.selection)) {
    const index = team.selection.findIndex(item => item.id === choice.id);
    if (index === -1) {
      // Choice is not selected, so add it to the selection
      team.selection = ([{ id: choice.id, name: choice.name }]);
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
    // team.isSelectionConfirmed = true;
    const teamIds = [];
    team.selection.forEach(element => {
      teamIds.push(element.id)
    });
    eventapi.post("/uefa/team/submit", teamIds).then((res) => {
      if (res.code === 0) {
        team.isSelectionConfirmed = true;
        init();
      }
    })
  }

}
const init = () => {
  eventapi.get("/uefa/team").then((res) => {
    if (res.code === 0) {
      teams.value = [];
      const groupedTeams = {}; // Object to store teams grouped by teamGroup
      res.data.teams.forEach(teamData => {
        const teamGroup = teamData.teamGroup;
        if (!groupedTeams[teamGroup]) {
          // Initialize an array for the teamGroup if not exists
          groupedTeams[teamGroup] = [];
        }
        // Push the teamData to the corresponding teamGroup array
        groupedTeams[teamGroup].push(teamData);
      });

      // Iterate over grouped teams and create team objects
      for (const teamGroup in groupedTeams) {
        if (groupedTeams.hasOwnProperty(teamGroup)) {
          const teamsInGroup = groupedTeams[teamGroup];
          const team = {
            name: teamGroup,
            selection: [],
            isSelectionConfirmed: false,
            choices: []
          };
          // Push choices for the teamGroup into the team's choices array
          teamsInGroup.forEach(teamData => {
            team.choices.push({ name: teamData.teamName, id: teamData.id, teamIcon: teamData.teamIcon });
          });
          // Push the team object to the teams array
          teams.value.push(team);
        }
      }
      // Update selection for selected teams
      res.data.selected.forEach((selectedTeam) => {
        const team = teams.value.find(team => team.name === selectedTeam.teamGroup);
        if (team) {
          const selectedTeamName = selectedTeam.teamName;
          const choice = team.choices.find(choice => choice.name === selectedTeamName);
          if (choice) {
            team.selection.push(choice);
            team.isSelectionConfirmed = true;
          }
        }
      });
    }
  });
}
onMounted(() => {
  init()
})
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

          .team-flag{
            width: 50px;
            height: auto;
            max-height: 50px;
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
.rule-title, .rule-content {
  font-family: Microsoft YaHei UI;
  line-height: 31.95px;
  letter-spacing: 0.12em;
  text-align: left;
  color: #ffffff;
  margin: 10px 0;
}
.rule-title {
  font-size:22px;
  font-weight: 700;
  line-height: 42.6px;
}
.rule-content {
  font-size: 16px;
  font-weight: 400;
  margin: 10px;
}
</style>
