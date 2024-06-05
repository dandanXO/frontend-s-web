<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item icon="info" :label="'제목'" :caption="'날짜'" disable>
      <q-card style="background:transparent;">
        <q-card-section>
          콘텐츠
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-expansion-item expand-separator v-for="item in announcementList" :key="item.page" :label="item.title"
      icon="notifications" :caption="formatDate(item.createTime)">
      <q-card style="background:transparent;padding:10px;margin:0px;">
        <q-card-section style="white-space:pre-wrap;max-height:400px;overflow-y:auto;">
          {{ item.content }}
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<script setup id="FinanceDeposit">
import { ref } from "vue";
import { userStore } from "stores/index";
import moment from "moment";
import { storeToRefs } from "pinia";

const store = userStore();
const { announcementList } = storeToRefs(store);
const formatDate = (timestamp) => moment(timestamp).format("YYYY/MM/DD");

</script>

<style lang="scss" scoped></style>