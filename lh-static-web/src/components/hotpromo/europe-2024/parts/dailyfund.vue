<template>
    <div class="tab-title">
        {{ tabtitle }}
    </div>
    <table>
        <tr>
            <th>有效投注</th>
            <th>投注彩金</th>
            <th>专属队伍彩金</th>
            <th>彩金倍数</th>
        </tr>
        <tr>
            <td>≥1888</td>
            <td>18</td>
            <td>18</td>
            <td rowspan="4">3倍</td>
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