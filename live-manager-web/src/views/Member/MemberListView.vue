<template>
  <Card>
    <template #title>会员列表</template>
    <template #content>
      <MemberList />
    </template>
  </Card>
</template>

<script setup>
import MemberList from '@/components/Member/MemberList.vue'
</script>
