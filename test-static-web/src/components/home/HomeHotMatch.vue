<template>
  <div class="hotmatch-section">
    <HomeTitle title="热门赛事" subtitle="POPULAR EVENTS"></HomeTitle>
    <div class="hotmatch-container">
      <div class="left-container">
        <HomeContentTitle title="热门赛事"></HomeContentTitle>

        <div class="tab-wrapper">
          <el-tabs class="tab" v-model="activeKey" type="card">
            <el-tab-pane key="1" label="电竞APP">
              <div class="hotmatch">
                <div class="top-wrapper">
                  <div class="match">
                    <img src="../../assets/images/mock/match_lol.png" />
                    <div class="match-name">英雄联盟全球总决赛2023</div>
                  </div>
                  <div class="date">07月27日20:32</div>
                </div>
                <div class="bot-wrapper">
                  <div class="team-name">TOP</div>
                  <img src="../../assets/images/mock/team_top.png" />
                  <div class="versus">VS</div>
                  <img src="../../assets/images/mock/team_rge.png" />
                  <div class="team-name">RGE</div>
                </div>
              </div>
              <div class="hotmatch">
                <div class="top-wrapper">
                  <div class="match">
                    <img src="../../assets/images/mock/match_lol.png" />
                    <div class="match-name">英雄联盟全球总决赛2023</div>
                  </div>
                  <div class="date">07月27日20:32</div>
                </div>
                <div class="bot-wrapper">
                  <div class="team-name">TOP</div>
                  <img src="../../assets/images/mock/team_top.png" />
                  <div class="versus">VS</div>
                  <img src="../../assets/images/mock/team_rge.png" />
                  <div class="team-name">RGE</div>
                </div>
              </div>
              <div class="hotmatch">
                <div class="top-wrapper">
                  <div class="match">
                    <img src="../../assets/images/mock/match_lol.png" />
                    <div class="match-name">英雄联盟全球总决赛2023</div>
                  </div>
                  <div class="date">07月27日20:32</div>
                </div>
                <div class="bot-wrapper">
                  <div class="team-name">TOP</div>
                  <img src="../../assets/images/mock/team_top.png" />
                  <div class="versus">VS</div>
                  <img src="../../assets/images/mock/team_rge.png" />
                  <div class="team-name">RGE</div>
                </div>
              </div>
              <div class="hotmatch">
                <div class="top-wrapper">
                  <div class="match">
                    <img src="../../assets/images/mock/match_lol.png" />
                    <div class="match-name">英雄联盟全球总决赛2023</div>
                  </div>
                  <div class="date">07月27日20:32</div>
                </div>
                <div class="bot-wrapper">
                  <div class="team-name">TOP</div>
                  <img src="../../assets/images/mock/team_top.png" />
                  <div class="versus">VS</div>
                  <img src="../../assets/images/mock/team_rge.png" />
                  <div class="team-name">RGE</div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane key="2" label="全站APP"></el-tab-pane>
            <el-tab-pane key="3" label="电竞APP"></el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="right-container">
        <img src="../../assets/home/hotmatch/bg.png" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import HomeTitle from "@/atoms/HomeTitle.vue";
import HomeContentTitle from "@/atoms/HomeContentTitle.vue";

onMounted(() => {});
</script>

<style lang="scss">
.hotmatch-section {
  width: 80%;
  max-width: 1040px;
  margin: 0 auto;

  .hotmatch-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .right-container {
      //   width: 50%;

      img {
        width: 37.5rem;
        position: relative;
        right: 3rem;
      }
    }

    .left-container {
      width: 50%;

      .tab-wrapper {
        border-radius: 1.25rem;
        background: #fff;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.22);
        padding: 0.5rem;

        .tab {
          border-radius: 0.8125rem;
          border: 1px solid #5c9fff;
          padding: 1rem;
          height: 31rem;
          overflow: auto;
          &::-webkit-scrollbar {
            display: none;
          }
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */

          .el-tabs__header {
            border-bottom: unset;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3.0625rem;
            background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
            box-shadow: 0px 2px 4.58px 0px #bbdcff inset, 0px -1px 3.664px 0px #a2bff4 inset;
            padding: 0.25rem 0;
            color: #468cff;
            font-family: Microsoft YaHei;
            font-size: 0.875rem;
            font-weight: 400;
            line-height: normal;
          }

          .hotmatch {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            border-radius: 1.25rem;
            background: #fff;
            box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
            color: #858585;
            font-family: Microsoft YaHei;
            font-size: 0.875rem;
            font-weight: 400;
            padding: 1rem;

            &:not(:last-child) {
              margin: 0 0 1rem 0;
            }

            .top-wrapper {
              display: flex;
              justify-content: space-between;
              width: 100%;

              .match {
                display: flex;
                gap: 10px;
              }
            }

            .bot-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 15px;

              .team-name {
                font-size: 1rem;
              }

              .versus {
                color: white;
                font-weight: 700;
                line-height: 2.5;
                border-radius: 1.875rem;
                background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
                box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
                width: 4rem;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
