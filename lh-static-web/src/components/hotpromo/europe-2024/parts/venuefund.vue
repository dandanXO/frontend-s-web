<template>
    <div class="tab-title">
        {{ tabtitle }}
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    tabtitle: String
  });
  
  </script>