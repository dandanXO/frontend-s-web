<template>
    <div class="card">
      <Toast />
      <DataTable
        v-model:filters="filters"
        :value="sensitiveWords"
        :loading="loading"
        dataKey="id"
        :paginator="true"
        :rows="10"
        filterDisplay="menu"
        :globalFilterFields="['word', 'createdAt']"
        responsiveLayout="scroll"
      >
        <!-- 搜尋欄位 -->
        <template #header>
          <div class="flex justify-between" style="display: flex; gap: 8px">
            <div style="display: flex; gap: 8px">
              <Button
                :size="'small'"
                type="button"
                icon="pi pi-filter-slash"
                label="清除"
                outlined
                @click="clearFilter()"
              />
            </div>
            <!-- 搜尋框 -->
            <IconField class="search-container">
              <InputIcon>
                <i class="pi pi-search search-icon" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="關鍵詞搜索" :size="'small'" class="search-input" />
            </IconField>
            <!-- 重新載入按鈕 -->
            <Button
              :size="'small'"
              type="button"
              icon="pi pi-refresh"
              label="重新載入"
              severity="info"
              @click="fetchSensitiveWords"
              :loading="loading"
            />

            <Button 
              :size="'small'"
              label="新增敏感字" 
              icon="pi pi-plus" 
              @click="openDialog()" 
            />

          </div>
        </template>
  
        <!-- 表格欄位 -->
        <Column field="word" header="敏感字" sortable>
          <template #body="slotProps">
            {{ slotProps.data.word }}
          </template>
        </Column>
        <Column field="createTime" header="建立時間" sortable>
          <template #body="slotProps">
            {{ formatDateTime(slotProps.data.createTime) }}
          </template>
        </Column>
        <Column field="createBy" header="建立者" sortable>
          <template #body="slotProps">
            {{ slotProps.data.createBy }}
          </template>
        </Column>
        <Column header="操作" :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <Button 
              icon="pi pi-pencil" 
              class="mr-2 p-button-rounded p-button-success"
              @click="editWord(slotProps.data)"
            />
            <Button 
              icon="pi pi-trash" 
              class="p-button-rounded p-button-danger" 
              @click="confirmDelete(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
  
      <!-- 新增/編輯對話框 -->
      <Dialog 
        v-model:visible="dialogVisible" 
        :style="{width: '450px'}" 
        :header="dialogMode === 'add' ? '新增敏感字' : '編輯敏感字'" 
        :modal="true"
        class="p-fluid"
      >
        <div class="field">
          <label for="word">敏感字</label>
          <InputText id="word" v-model.trim="editingWord.word" required autofocus />
        </div>
        <template #footer>
          <Button label="取消" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
          <Button label="確定" icon="pi pi-check" class="p-button-text" @click="saveWord" />
        </template>
      </Dialog>
  
      <!-- 刪除確認對話框 -->
      <Dialog 
        v-model:visible="deleteDialogVisible" 
        :style="{width: '450px'}"
        header="確認"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem" />
          <span>確定要刪除此敏感字嗎？</span>
        </div>
        <template #footer>
          <Button label="否" icon="pi pi-times" class="p-button-text" @click="deleteDialogVisible = false" />
          <Button label="是" icon="pi pi-check" class="p-button-text" @click="deleteWord" />
        </template>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useToast } from 'primevue/usetoast'
  import { DashboardService } from '@/service/DashboardService'
  import { useI18n } from 'vue-i18n'

  const t = useI18n()
  const toast = useToast()
  const loading = ref(false)
  const sensitiveWords = ref([])
  const dialogVisible = ref(false)
  const deleteDialogVisible = ref(false)
  const dialogMode = ref('add') // 'add' 或 'edit'
  const editingWord = ref({
    id: null,
    siteId: 7,
    word: ''
  })
  
  // 直接定義 FilterMatchMode
  const FilterMatchMode = {
    STARTS_WITH: 'startsWith',
    CONTAINS: 'contains',
    NOT_CONTAINS: 'notContains',
    ENDS_WITH: 'endsWith',
    EQUALS: 'equals',
    NOT_EQUALS: 'notEquals',
    IN: 'in',
    LESS_THAN: 'lt',
    LESS_THAN_OR_EQUAL_TO: 'lte',
    GREATER_THAN: 'gt',
    GREATER_THAN_OR_EQUAL_TO: 'gte',
    BETWEEN: 'between',
    DATE_IS: 'dateIs',
    DATE_IS_NOT: 'dateIsNot',
    DATE_BEFORE: 'dateBefore',
    DATE_AFTER: 'dateAfter'
  }
  
  // 過濾器設置
  const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
  })
  
  // 格式化日期時間
  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('zh-TW');
  };
  
  // 清除數據
  const clearData = () => {
    sensitiveWords.value = [];
    loading.value = false;
    dialogVisible.value = false;
    deleteDialogVisible.value = false;
    editingWord.value = { id: null, word: '', siteId: 7 };
    filters.value = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
  };
  
  // 清除過濾器
  const clearFilter = () => {
    filters.value = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
  };
  
  // 修改獲取敏感字列表方法
  const fetchSensitiveWords = async () => {
    try {
      clearData();
      loading.value = true;
      const response = await DashboardService.getSensitiveWords();
      sensitiveWords.value = response.data || [];
    } catch (error) {
      toast.add({ 
        severity: 'error', 
        summary: '錯誤', 
        detail: '獲取敏感字列表失敗', 
        life: 3000 
      });
    } finally {
      loading.value = false;
    }
  };
  
  // 開啟對話框
  const openDialog = (word = null) => {
    if (word) {
      dialogMode.value = 'edit'
      editingWord.value = { ...word }
    } else {
      dialogMode.value = 'add'
      editingWord.value = { id: null, word: '' }
    }
    dialogVisible.value = true
  }
  
  // 關閉對話框
  const closeDialog = () => {
    dialogVisible.value = false
    editingWord.value = { id: null, word: '' }
  }
  
  // 編輯敏感字
  const editWord = (word) => {
    openDialog(word)
  }
  
  // 保存敏感字
  const saveWord = async () => {
    if (!editingWord.value.word) {
      toast.add({ severity: 'warn', summary: '警告', detail: '請輸入敏感字', life: 3000 })
      return
    }
  
    try {
      if (dialogMode.value === 'add') {
        const response = await DashboardService.addSensitiveWord(editingWord.value)
        console.log(response)
        console.log(response.code)
        console.log(response.message)
        if (response.code === 0) {
          toast.add({ severity: 'success', summary: '成功', detail: '新增敏感字成功', life: 3000 })
        } else {
          toast.add({ severity: 'error', summary: '錯誤', detail: response.message, life: 3000 })
        }
      } else {
        const response = await DashboardService.updateSensitiveWord(editingWord.value)
        if (response.code === 0) {
          toast.add({ severity: 'success', summary: '成功', detail: '更新敏感字成功', life: 3000 })
        } else {
          toast.add({ severity: 'error', summary: '錯誤', detail: response.message, life: 3000 })
        }
      }
      closeDialog()
      await fetchSensitiveWords()
    } catch (error) {
      toast.add({ severity: 'error', summary: '錯誤', detail: t('sensitiveWord.errorUpdateSensitiveWord'), life: 3000 })
    }
  }
  
  // 確認刪除
  const confirmDelete = (word) => {
    editingWord.value = word
    deleteDialogVisible.value = true
  }
  
  // 刪除敏感字
  const deleteWord = async () => {
    try {
      const response = await DashboardService.deleteSensitiveWord(editingWord.value.id)
      if (response.code === 0) {
        toast.add({ severity: 'success', summary: '成功', detail: '刪除敏感字成功', life: 3000 })
        deleteDialogVisible.value = false
        await fetchSensitiveWords()
      } else {
        toast.add({ severity: 'error', summary: '錯誤', detail: response.message, life: 3000 })
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: '錯誤', detail: '刪除失敗', life: 3000 })
    }
  }
  
  onMounted(() => {
    fetchSensitiveWords()
  })
  </script>
  
  <style scoped>
  .p-button.p-button-icon-only {
    width: 2rem;
    padding: 0.5rem 0;
  }
  
  .confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-container {
    width: 100%;
    max-width: 230px;
  }

  /* 自定義圖標樣式 */
  :deep(.p-input-icon-left i) {
    color: #666; /* 修改圖標顏色 */
    font-size: 1.5rem; /* 修改圖標大小 */
  }

  /* 在懸停時改變圖標顏色 */
  :deep(.p-input-icon-left:hover i) {
    color: #3B82F6;
  }

  /* 搜索圖標樣式 */
  :deep(.search-icon) {
    color: #6B7280; /* 深灰色圖標 */
    font-size: 0.7rem; /* 調整大小 */
    transition: color 0.3s ease; /* 平滑過渡 */
  }

  /* 當搜索框獲得焦點時的圖標樣式 */
  :deep(.p-inputtext:focus ~ .p-input-icon-left i) {
    color: #3B82F6; /* 藍色高亮 */
  }

  /* 搜索容器樣式 */
  .search-container {
    min-width: 200px; /* 設置最小寬度 */
    position: relative;
  }

  /* 搜索輸入框樣式 */
  :deep(.search-input) {
    transition: all 0.3s ease;
    border-radius: 4px; /* 圓角邊框 */
  }

  /* 搜索輸入框獲得焦點時的樣式 */
  :deep(.search-input:focus) {
    border-color: #3B82F6; /* 藍色邊框 */
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.25); /* 輕微發光效果 */
  }

  /* 如果需要調整圖標位置 */
  :deep(.p-input-icon-left) {
    display: flex;
    align-items: center;
  }

  :deep(.p-input-icon-left i) {
    margin-left: 0.5rem; /* 調整左邊距 */
  }
  </style> 