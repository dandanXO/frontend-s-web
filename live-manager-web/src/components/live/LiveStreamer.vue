<!--TODO-->
<template>
  <div class="card">
    <DataTable
      :value="liveStreamerList"
      :paginator="true"
      :rows="10"
      :loading="loading"
      dataKey="eventId"
      :filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['title']"
      responsiveLayout="scroll"
    >
      <template #header>
        <div class="flex justify-between" style="display: flex; gap: 8px">
          <Select
            v-model="request.liveStatus"
            :options="uiControl.status"
            optionLabel="name"
            :placeholder="t('fields.status')"
            size="small"
          />
          <InputText type="text" v-model="request.name" optionLabel="名称" placeholder="名称" />
          <Button :label="t('fields.search')" size="small" severity="success" icon="pi pi-search" />
          <Button
            :label="t('fields.reset')"
            size="small"
            severity="warn"
            icon="pi pi-refresh"
            @click="resetQuery"
          />
          <Button
            :label="t('fields.add')"
            size="small"
            severity="info"
            icon="pi pi-plus"
            @click="resetQuery"
          />
        </div>
      </template>
      <Column field="title" header="ID" sortable>
        <template #body="slotProps">
          {{ slotProps.data.id }}
        </template>
      </Column>

      <Column field="eventStartTime" :header="t('fields.name')" sortable>
        <template #body="slotProps">
          {{ slotProps.data.name }}
        </template>
      </Column>

      <Column field="liveStatus" :header="t('fields.status')" sortable>
        <template #body="slotProps">
          {{ getStatusName(slotProps.data.liveStatus) }}
        </template>
      </Column>

      <Column field="sportId" :header="t('fields.account')" sortable>
        <template #body="slotProps">
          {{ slotProps.data.loginName }}
        </template>
      </Column>

      <Column field="liveStatus" :header="t('fields.photo')" sortable>
        <template #body="slotProps">
          <Image
            v-if="slotProps.data.avatar"
            :src="promoDir + slotProps.data.avatar"
            alt="Image"
            width="250"
          />
        </template>
      </Column>
      <Column field="liveStatus" :header="t('fields.operate')" sortable>
        <template #body="slotProps">
          <div class="flex justify-between" style="display: flex; gap: 8px">
            <Button
              :label="t('fields.updatePassword')"
              size="small"
              severity="secondary"
              icon="pi pi-key"
              @click="showChangePasswordDialog(slotProps.data)"
            />
            <Button
              :label="t('fields.edit')"
              size="small"
              severity="info"
              icon="pi pi-key"
              @click="resetQuery"
            />
            <Button
              :label="t('fields.delete')"
              size="small"
              severity="danger"
              icon="pi pi-key"
              @click="resetQuery"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="changePasswordDialog.visible"
      modal
      :header="t('fields.updatePassword')"
      :style="{ width: '500px' }"
    >
      <div
        style="
          display: flex;
          gap: 8px;
          flex-direction: row;
          align-items: center;
          justify-content: end;
          width: 450px;
          margin-bottom: 16px;
        "
      >
        <label for="newPassword" class="font-semibold w-24">{{ t('fields.newPassword') }}</label>

        <div style="width: 350px">
          <InputText
            id="newPassword"
            :class="{ 'p-invalid': fieldErrors.newPassword }"
            autocomplete="new-password"
            type="password"
            style="width: 100%"
            v-model="changePasswordDialog.form.newPassword"
            @blur="validateField('newPassword')"
            @input="clearFieldError('newPassword')"
          />
          <Message
            v-if="fieldErrors.newPassword"
            severity="error"
            size="small"
            variant="simple"
            class="mt-1"
          >
            {{ fieldErrors.newPassword }}
          </Message>
        </div>
      </div>

      <div
        style="
          display: flex;
          gap: 8px;
          flex-direction: row;
          align-items: center;
          justify-content: end;
          width: 450px;
          margin-bottom: 16px;
        "
      >
        <label for="confirmPassword" class="font-semibold w-24">{{
          t('fields.confirmPassword')
        }}</label>
        <div style="width: 350px">
          <InputText
            id="confirmPassword"
            class="w-full"
            :class="{ 'p-invalid': fieldErrors.confirmPassword }"
            autocomplete="new-password"
            type="password"
            style="width: 100%"
            v-model="changePasswordDialog.form.confirmPassword"
            @blur="validateField('confirmPassword')"
            @input="clearFieldError('confirmPassword')"
          />
          <Message
            v-if="fieldErrors.confirmPassword"
            severity="error"
            size="small"
            variant="simple"
            class="mt-1"
          >
            {{ fieldErrors.confirmPassword }}
          </Message>
        </div>
      </div>

      <div
        style="
          display: flex;
          gap: 8px;
          flex-direction: row;
          align-items: center;
          justify-content: end;
          width: 450px;
          margin-bottom: 16px;
        "
      >
        <Button
          type="button"
          :label="t('fields.cancel')"
          severity="secondary"
          @click="closeDialog"
        />
        <Button
          type="button"
          :label="t('fields.confirm')"
          :loading="isSubmitting"
          @click="submitChangePassword"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { defineComponent, reactive, onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { liveSportTyps } from '@/utils/live'
import { DashboardService } from '@/service/DashboardService'
import { required, size } from '@/utils/validate'
import { useToast } from 'primevue/usetoast'
import { useStorage } from '@vueuse/core'
const promoDir = useStorage('IMAGE_CDN', '', sessionStorage).value + '/promo/'
const { getSportLiveStreamer, updateSportLiveStreamer } = DashboardService
const { t } = useI18n()
const toast = useToast()

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  dialogLoading: false,
  status: [
    { name: t('fields.notStarted'), display: "t('fields.notStarted')", id: 0 },
    { name: t('fields.inProgress'), display: "t('fields.inProgress')", id: 1 },
  ],
})

const changePasswordDialog = reactive({
  visible: false,
  userId: null,
  form: {
    newPassword: '',
    confirmPassword: '',
  },
})

const fieldErrors = reactive({
  newPassword: '',
  confirmPassword: '',
})

const isSubmitting = ref(false)

const validateForm = () => {
  const newPasswordValid = validateField('newPassword')
  const confirmPasswordValid = validateField('confirmPassword')
  return newPasswordValid && confirmPasswordValid
}

const clearFieldError = (fieldName) => {
  if (fieldErrors[fieldName]) {
    fieldErrors[fieldName] = ''
  }
}

function showChangePasswordDialog(row) {
  changePasswordDialog.userId = row.id
  changePasswordDialog.form.newPassword = ''
  changePasswordDialog.form.confirmPassword = ''
  changePasswordDialog.visible = true
}
function closeDialog() {
  changePasswordDialog.visible = false
  changePasswordDialog.form.newPassword = ''
  changePasswordDialog.form.confirmPassword = ''
  fieldErrors.newPassword = ''
  fieldErrors.confirmPassword = ''
}

const changePasswordRules = {
  newPassword: [
    required(t('message.validatePasswordRequired')),
    size(6, 12, t('message.validatePasswordSize')),
  ],
  confirmPassword: [
    required(t('message.validatePasswordRequired')),
    size(6, 12, t('message.validatePasswordSize')),
    {
      validator: (rule, value, callback) => {
        if (value !== changePasswordDialog.form.newPassword) {
          callback(new Error(t('message.passwordNotMatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 驗證方法
const validateField = (fieldName) => {
  const rules = changePasswordRules[fieldName]
  const value = changePasswordDialog.form[fieldName]

  for (const rule of rules) {
    if (rule.required && (!value || value.trim() === '')) {
      fieldErrors[fieldName] = rule.message
      return false
    }

    if (rule.min && rule.max && value && (value.length < rule.min || value.length > rule.max)) {
      fieldErrors[fieldName] = rule.message
      return false
    }

    if (rule.validator) {
      rule.validator(rule, value, (error) => {
        if (error) {
          fieldErrors[fieldName] = error.message
        } else {
          fieldErrors[fieldName] = ''
        }
      })
      return !fieldErrors[fieldName]
    }
  }

  fieldErrors[fieldName] = ''
  return true
}

async function submitChangePassword() {
  // 模擬原本的 validate 方法結構
  const validate = (callback) => {
    const isValid = validateForm()
    callback(isValid)
  }

  try {
    isSubmitting.value = true

    await validate(async (valid) => {
      if (!valid) return

      await updateSportLiveStreamer({
        id: changePasswordDialog.userId,
        password: changePasswordDialog.form.newPassword,
      })

      toast.add({
        severity: 'success',
        summary: t('message.updateSuccess'),
        life: 3000,
      })

      closeDialog()
      await loadStreamer()
    })
  } catch (error) {
    console.error('Error updating password:', error)
    toast.add({
      severity: 'error',
      summary: t('message.updateError') || 'Failed to update password',
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

const request = reactive({
  size: 30,
  current: 1,
  liveStatus: null,
  name: null,
})

const liveStreamerList = ref([])

function resetQuery() {
  request.status = null
  request.name = null
}

function getStatusName(statusId) {
  const status = uiControl.status.find((item) => item.id === statusId)
  return status.name
}

async function loadStreamer() {
  const res = await getSportLiveStreamer(request)

  liveStreamerList.value = res.records
}

onMounted(() => {
  loadStreamer()
})
</script>

<style scoped>
.p-button.p-button-icon-only {
  width: 2rem;
  padding: 0.5rem 0;
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
  color: #3b82f6;
}

/* 搜索圖標樣式 */
:deep(.search-icon) {
  color: #6b7280; /* 深灰色圖標 */
  font-size: 0.7rem; /* 調整大小 */
  transition: color 0.3s ease; /* 平滑過渡 */
}

/* 當搜索框獲得焦點時的圖標樣式 */
:deep(.p-inputtext:focus ~ .p-input-icon-left i) {
  color: #3b82f6; /* 藍色高亮 */
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
  border-color: #3b82f6; /* 藍色邊框 */
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
