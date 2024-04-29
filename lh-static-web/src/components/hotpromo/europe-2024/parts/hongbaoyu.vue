<template>
    <div class="tab-title">
        {{ tabtitle }}
    </div>
    <div class="redpacket">
        <div class="hongbao"><img src="../images/hongbao.png"></div>
        <div class="claim-button"></div>
    </div>
    
    <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <th>进*粒球</th>
          <th>红包雨总奖金</th>
          <th>流水倍数</th>
        </tr>
        
        <tr>
          <td>≥1</td>
          <td>10,000</td>
          <td rowspan="3">1倍/不限场馆</td>
        </tr>
        
        
        <tr>
          <td>≥3</td>
          <td>50,000</td>
        </tr>
        
        <tr>
          <td>≥5</td>
          <td>100,000</td>
        </tr>
      </table>
    <div class="rule-title">
        活动规则
    </div>
    <ol class="rule-content">
        <li>赛事期间，欧洲杯比赛队伍进球时，请点击红包雨页面的红包按钮领取红包雨奖金，未点击红包按钮视为自动放弃参与该活动；</li>
        <li>赛事期间，欧洲杯每一场比赛最高开启3场红包雨，最高红包雨奖金最高100,000元，先到先得抢完截止；</li>
        <li>仅限已绑定手机号与银行卡的账号方可参与此活动；</li>
        <li>同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</li>
        <li>任何用户或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；</li>
        <li>为避免文字理解差异，本站保留本活动最终解释权。</li>
    </ol>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    tabtitle: String
  });
  
  </script>
  <style lang="scss" scoped>
  .redpacket {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .hongbao {
        width: 500px;
        img {
            width: 100%;
        }
    }
    .claim-button {
        background-repeat: no-repeat;
        background-image: url(../images/claim-btn.png);
        background-size: contain;
        width: 330px;
        height: 150px;
        cursor: pointer;
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
    font-size: 32px;
    font-weight: 700;
    line-height: 42.6px;
  }
  .rule-content {
    font-size: 24px;
    font-weight: 400;
  }
</style>