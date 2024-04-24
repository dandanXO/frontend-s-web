<template>
    <div class="tab-title">
        {{ tabtitle }}
    </div>
    <div class="doublinggold">
        <span class="note">
            注：用户选定每组的参与队伍后不予更改；
        </span>
        <div class="teams">
            <div class="team">
                <div class="team-box">
                    <div class="team-num">A 组</div>
                    <div class="chosen-items">已选择：</div>

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
  import { defineProps } from 'vue';
  
  const props = defineProps({
    tabtitle: String
  });
  
  </script>