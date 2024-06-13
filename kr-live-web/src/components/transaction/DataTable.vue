<template>
    <q-table
        dense
        class="datatable"
        :grid="$q.screen.lt.md"
        :loading="props.loading"
        :columns="props.tableColumns"
        :rows="props.dataState"
        :no-data-label="$t('lang.no_data_label')"
        :rows-per-page-label="$t('lang.row_per_page_label')"
        :row-key="props.rowKey || 'serialNumber'"
        :rows-per-page-options="[props.rowsPerPage || 10]"
        :hide-pagination="true"
        >
            <template v-slot:loading>
                <q-inner-loading showing color="primary" />
            </template>
            <template v-slot:item="props" v-if="slots.item">
                <slot name="item" :props="props"></slot>
            </template>

            <template v-if="slots.slots?.['body-cell-status']" v-slot:body-cell-status="props">
                <slot name="body-cell-status" :props="props"></slot>
            </template>

            <template 
            v-if="slots?.['body-cell-operation']"
            v-slot:body-cell-operation="props">
                <slot name="body-cell-operation" :props="props"></slot>
            </template>

            <template 
            v-if="slots?.['body-cell-type']"
            v-slot:body-cell-type="props">
                <slot name="body-cell-type" :props="props"></slot>
            </template>
        </q-table>
        
        <div class="datatable-pagination" v-if="props.pagination && props.pagination.pages > 0">
            <span>{{ `페이지 ${props.pagination.current} / ${props.pagination.pages}` }}</span>
            <q-pagination
                :modelValue="props.pagination.current"
                :max="props.pagination.pages"
                :max-pages="10"
                @update:model-value="(currentPage) => {
                    emit('onChangePage', currentPage)
                }"
                boundary-links
            />
        </div>
</template>

<script setup>
import { useSlots } from 'vue';

const slots = useSlots();

const props = defineProps(['tableColumns', 'dataState', 'pagination', 'loading', 'rowsPerPage', 'rowKey']);
const emit = defineEmits(['onChangePage']);
</script>

<style lang="scss" scoped>
.datatable {
  box-shadow: none;
  border: 1px solid grey;
}

.datatable-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
}
</style>