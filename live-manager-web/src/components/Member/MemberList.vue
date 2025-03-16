<template>
  <div class="card">
    <DataTable
      style="font-size: small"
      :size="'small'"
      v-model:filters="filters"
      :value="customers"
      paginator
      showGridlines
      :rows="10"
      dataKey="id"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
    >
      <template #header>
        <div class="flex justify-between" style="display: flex; gap: 8px">
          <Button
            :size="'small'"
            type="button"
            icon="pi pi-filter-slash"
            label="清除"
            outlined
            @click="clearFilter()"
          />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="关键词搜索" :size="'small'" />
          </IconField>
        </div>
      </template>
      <template #empty> No customers found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column field="name" header="登录名" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
        </template>
      </Column>
      <Column header="VIP" filterField="country.name" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.VIPStatus }}
        </template>
      </Column>
      <Column
        header="真实姓名"
        filterField="representative"
        :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '8rem' }"
        style="min-width: 8rem"
      >
        <template #body="{ data }">
          {{ data.representative.name }}
        </template>
      </Column>
      <Column header="代理代码" filterField="date" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ data.identifier }}
        </template>
      </Column>
      <Column header="上级用户名" filterField="balance" dataType="numeric" style="min-width: 10rem">
        <template #body="{ data }">
          {{ data.linkedPhoneNumber }}
        </template>
      </Column>
      <Column header="余额" filterField="balance" dataType="numeric" style="min-width: 10rem">
        <template #body="{ data }"> $ {{ data.balance }} </template>
      </Column>
      <Column header="注册时间" filterField="balance" dataType="date" style="min-width: 10rem">
        <template #body="{ data }"> {{ data.date.toLocaleString() }} </template>
      </Column>
      <Column header="会员组别" filterField="country.name" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.VIPStatus }}
        </template>
      </Column>
      <Column
        header="状态"
        field="status"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <Tag :value="data.status" :severity="getSeverity(data.status)" />
        </template>
      </Column>
      <Column
        header="会员类型"
        field="status"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <Tag :value="data.status" :severity="getSeverity(data.status)" />
        </template>
      </Column>
      <Column header="站点" filterField="balance" dataType="numeric" style="min-width: 10rem">
        <template #body="{ data }"> {{ data.service }} </template>
      </Column>
      <Column header="最近登录" filterField="balance" dataType="numeric" style="min-width: 10rem">
        <template #body="{ data }"> {{ data.date.toLocaleString() }} </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { DashboardService } from '@/service/DashboardService'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'

const customers = ref()
const filters = ref()

const loading = ref(false)

onMounted(() => {
  loading.value = true

  setTimeout(() => {
    DashboardService.getMembersList().then((data) => {
      customers.value = data
      loading.value = false
    })
  }, 2000)
})

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}
const getSeverity = (status) => {
  switch (status) {
    case 'unqualified':
      return 'danger'

    case 'qualified':
      return 'success'

    case 'new':
      return 'info'

    case 'negotiation':
      return 'warn'

    case 'renewal':
      return null
  }
}
</script>
