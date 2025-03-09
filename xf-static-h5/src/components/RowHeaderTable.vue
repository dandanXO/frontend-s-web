<template>
  <div class="table-wrapper">
    <table :class="{ 'highlight-first-col': isHighlightFirstCol }">
      <thead>
        <tr>
          <th v-for="(header, i) in headerData" :key="i">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rowData" :key="i">
          <td v-for="(item, j) in row" :key="j">{{ item }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
const props = defineProps({
  headerData: {
    type: Array,
    required: true,
    default: () => []
  },
  rowData: {
    type: Array,
    required: true,
    default: () => []
  },
  isHighlightFirstCol: {
    type: Boolean,
    default: false
  }
});
</script>
<style scoped lang="scss">
.table-wrapper {
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(0, 191, 215, 0) 0%, #00bfd7 75.68%);
  padding: 1px;
  margin-bottom: 14px;

  table {
    text-align: center;
    font-size: 10px;
    color: #000;
    width: 100%;

    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    border-radius: 10px;

    thead {
      background-color: #445f95;

      th {
        color: #ffffff;
        padding: 12px 4px;
        font-size: 12px;
        max-width: 10px;
        overflow-wrap: anywhere;
        font-weight: 400;
      }
    }

    tbody {
      background: linear-gradient(180deg, #384e79 0%, #212e4b 100%);
      td {
        color: #ffffff99;
        padding: 10px 4px;
        font-size: 12px;
      }
    }
  }

  .highlight-first-col {
    tbody tr td:first-child {
      background-color: #445f95;
    }
  }

  th,
  td {
    padding: 12px;
  }

  th:first-of-type {
    border-top-left-radius: 10px;
  }
  th:last-of-type {
    border-top-right-radius: 10px;
  }
  tr:last-of-type td:first-of-type {
    border-bottom-left-radius: 10px;
  }
  tr:last-of-type td:last-of-type {
    border-bottom-right-radius: 10px;
  }
}
</style>
