<template>
  <div class="" style="">
    <div class="">
      <q-item-section class="table-row-head">
        <q-item-label>번호</q-item-label>
        <q-item-label>제목</q-item-label>
        <q-item-label>날짜</q-item-label>
      </q-item-section>
      <template v-for="(item) in articleData" :key="item.page">
        <q-expansion-item group="somegroup"  class="table-row-title">
          <template v-slot:header>
            <q-item-section class="table-row table-row-title">
              <q-item-label>{{ item.number }}</q-item-label>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label>{{ item.date }}</q-item-label>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section class="table-row-article">
              <article v-html="item.article"></article>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </template>
    </div>
  </div>
</template>

<script setup id="NotifyComponent">
import { ref } from "vue";

//TODO
const articleData = ref([
  {
    number: 12,
    title: "[필독] ※ 카지노 잭팟, 고배당 양방성 ※",
    date: "2024/01/13",
    article: `
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
      <p>라이트닝, 번영의나무, 풍성한, 식보, 블랙잭 등 잭팟, 페어, 타이 고배당이 나오는 배팅을 이용한 다구멍 사이드 양방배팅을 강력히 제재합니다.</p>
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
      <p>라이트닝, 번영의나무, 풍성한, 식보, 블랙잭 등 잭팟, 페어, 타이 고배당이 나오는 배팅을 이용한 다구멍 사이드 양방배팅을 강력히 제재합니다.</p>
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
      <p>라이트닝, 번영의나무, 풍성한, 식보, 블랙잭 등 잭팟, 페어, 타이 고배당이 나오는 배팅을 이용한 다구멍 사이드 양방배팅을 강력히 제재합니다.</p>
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
      <p>라이트닝, 번영의나무, 풍성한, 식보, 블랙잭 등 잭팟, 페어, 타이 고배당이 나오는 배팅을 이용한 다구멍 사이드 양방배팅을 강력히 제재합니다.</p>
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
  `,
  },
  {
    number: 11,
    title: "[필독] ※ 카지노 잭팟 양방성 배팅 제재 안내 ※",
    date: "2024/01/13",
    article: `
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
      <p>라이트닝, 번영의나무, 풍성한, 식보, 블랙잭 등 잭팟, 페어, 타이 고배당이 나오는 배팅을 이용한 다구멍 사이드 양방배팅을 강력히 제재합니다.</p>
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
      <p>라이트닝, 번영의나무, 풍성한, 식보, 블랙잭 등 잭팟, 페어, 타이 고배당이 나오는 배팅을 이용한 다구멍 사이드 양방배팅을 강력히 제재합니다.</p>
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
  `,
  },
  {
    number: 10,
    title: "[필독] ※ 양방성 배팅 제재 안내 ※",
    date: "2024/01/13",
    article: `
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
      <p>라이트닝, 번영의나무, 풍성한, 식보, 블랙잭 등 잭팟, 페어, 타이 고배당이 나오는 배팅을 이용한 다구멍 사이드 양방배팅을 강력히 제재합니다.</p>
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
      <p>라이트닝, 번영의나무, 풍성한, 식보, 블랙잭 등 잭팟, 페어, 타이 고배당이 나오는 배팅을 이용한 다구멍 사이드 양방배팅을 강력히 제재합니다.</p>
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
      <p>라이트닝, 번영의나무, 풍성한, 식보, 블랙잭 등 잭팟, 페어, 타이 고배당이 나오는 배팅을 이용한 다구멍 사이드 양방배팅을 강력히 제재합니다.</p>
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
  `,
  },
  {
    number: 9,
    title: "[필독] ※ 카지노 잭팟, 고배당 양방성 배팅 제재 안내 ※",
    date: "2024/01/13",
    article: `
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
      <p>라이트닝, 번영의나무, 풍성한, 식보, 블랙잭 등 잭팟, 페어, 타이 고배당이 나오는 배팅을 이용한 다구멍 사이드 양방배팅을 강력히 제재합니다.</p>
      <p>양방향, 작업 배팅은 사전 경고 없이 배팅금 포함 당첨금 전액 몰수 처리이며 </p>
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
  `,
  },
  {
    number: 8,
    title: "[필독] ※ 카지노 잭팟, 고배당 안내 ※",
    date: "2024/01/13",
    article: `
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
  `,
  },
  {
    number: 7,
    title: "[필독] ※ 카지노 잭팟, 고배당 안내 ※",
    date: "2024/01/13",
    article: `
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
  `,
  },
  {
    number: 6,
    title: "[필독] ※ 카지노 잭팟, 고배당 안내 ※",
    date: "2024/01/13",
    article: `
      <p>카지노 잭팟, 고배당 양방성 배팅 제제 안내드립니다.</p>
  `,
  },
]);

</script>

<style lang="scss" scoped>
.table-row-head {
  padding: 5px 10px 0 10px;
  display: grid;
  grid-template-columns: 50px 1fr 100px;
  .q-item__label {
    margin: auto;
    padding-bottom: 12px;
    &:nth-child(2) {
      text-align: left;
      margin-left: unset;
      margin-right: unset;
    }
  }
}
.table-row {
  padding: 0 10px 0 10px;
  display: grid;
  grid-template-columns: 50px 1fr 100px;
  .q-item__label {
    margin-top: auto;
    margin-bottom: auto;
    padding: unset;
    &:nth-child(2) {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.table-row-title {
  background: #212121;
  margin-bottom: 5px;

  :deep(.q-icon) {
    display: none;
  }

  :deep(.q-expansion-item__container .q-item) {
    display: flex;
    width: 100%;
    padding: 0;
    .q-item__label {
      &:first-child {
        width: 100px;
        text-align: center;
      }
      &:nth-child(2) {
        flex: 1;
        text-align: left;
      }
      &:last-child {
        text-align: right;
        width: 100px;
      }
    }
  }
}
.table-row-article {
  padding: 10px 5px;
  max-height: 100px;
  overflow: scroll;
  :deep(.q-expansion-item__content) {
    background: #151515;
  }
}
</style>
