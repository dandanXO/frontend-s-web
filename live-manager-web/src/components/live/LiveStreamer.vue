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
          <InputText type="text" v-model="request.name" :optionLabel="t('fields.name')" :placeholder="t('fields.name')" />
          <Button
            :label="t('fields.search')"
            size="small"
            severity="success"
            icon="pi pi-search"
            @click="loadStreamer"
          />
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
            @click="showDialog('CREATE')"
          />
        </div>
      </template>
      <Column field="title" :header="t('fields.id')" sortable>
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
            preview
            alt="Image"
            width="100"
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
              @click="showDialog('EDIT', slotProps.data)"
            />
            <Button
              :label="t('fields.delete')"
              size="small"
              severity="danger"
              icon="pi pi-key"
              @click="deleteStreamer(slotProps.data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- 編輯新增dialog -->
    <Dialog
      v-model:visible="uiControl.dialogVisible"
      :header="t('fields.edit')"
      modal
      :style="{ width: '700px' }"
    >
      <div
        style="
          display: flex;
          gap: 8px;
          flex-direction: row;
          align-items: center;
          justify-content: end;
          width: 650px;
          margin-bottom: 16px;
        "
      >
        <label for="name" class="w-24 font-semibold">{{ t('fields.name') }}</label>

        <div style="width: 600px">
          <InputText
            id="name"
            :class="{ 'p-invalid': fieldErrors.name }"
            autocomplete="new-password"
            style="width: 100%"
            v-model="form.name"
            @blur="validateField('name')"
            @input="clearFieldError('name')"
          />
          <Message
            v-if="fieldErrors.name"
            severity="error"
            size="small"
            variant="simple"
            class="mt-1"
          >
            {{ fieldErrors.name }}
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
          width: 650px;
          margin-bottom: 16px;
        "
      >
        <label for="loginName" class="w-24 font-semibold">{{ t('fields.account') }}</label>
        <div style="width: 600px">
          <InputText
            id="loginName"
            class="w-full"
            :class="{ 'p-invalid': fieldErrors.loginName }"
            autocomplete="new-password"
            style="width: 100%"
            v-model="form.loginName"
            @blur="validateField('loginName')"
            @input="clearFieldError('loginName')"
          />
          <Message
            v-if="fieldErrors.loginName"
            severity="error"
            size="small"
            variant="simple"
            class="mt-1"
          >
            {{ fieldErrors.loginName }}
          </Message>
        </div>
      </div>

      <div
        v-if="uiControl.dialogType === 'CREATE'"
        style="
          display: flex;
          gap: 8px;
          flex-direction: row;
          align-items: center;
          justify-content: end;
          width: 650px;
          margin-bottom: 16px;
        "
      >
        <label for="password" class="w-24 font-semibold">{{ t('fields.password') }}</label>
        <div style="width: 600px">
          <InputText
            id="password"
            class="w-full"
            :class="{ 'p-invalid': fieldErrors.confirmPassword }"
            autocomplete="new-password"
            type="password"
            style="width: 100%"
            v-model="form.password"
            @input="clearFieldError('confirmPassword')"
          />
        </div>
      </div>

      <div
        style="
          display: flex;
          gap: 8px;
          flex-direction: row;
          align-items: center;
          justify-content: end;
          width: 650px;
          margin-bottom: 16px;
        "
      >
        <label for="confirmPassword" class="w-24 font-semibold">{{ t('fields.photo') }}</label>
        <div style="width: 600px">
          <Button
            type="button"
            :label="t('fields.upload')"
            icon="pi pi-cloud-upload"
            :loading="isSubmitting"
            @click="$refs.inputImage.click()"
          />
          <input
            id="uploadFile"
            type="file"
            ref="inputImage"
            style="display: none"
            accept="image/*"
            @change="attachImage"
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
          width: 650px;
          margin-bottom: 16px;
        "
      >
        <Button
          type="button"
          :label="t('fields.cancel')"
          severity="secondary"
          @click="closeEditDialog"
        />
        <Button
          type="button"
          :label="t('fields.confirm')"
          :loading="isSubmitting"
          @click="submit"
        />
      </div>
    </Dialog>

    <!-- 更改密碼dialog -->
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
        <label for="newPassword" class="w-24 font-semibold">{{ t('fields.newPassword') }}</label>

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
        <label for="confirmPassword" class="w-24 font-semibold">{{
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
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { defineComponent, reactive, onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { liveSportTyps } from '@/utils/live'
import { DashboardService } from '@/service/DashboardService'
import { required, size } from '@/utils/validate'
import { useToast } from 'primevue/usetoast'
import { uploadImage } from '@/service/image'
import { useStorage } from '@vueuse/core'
import { useConfirm } from 'primevue/useconfirm'
import { useUserStore } from '@/store/user'
const promoDir = useStorage('IMAGE_CDN', '', sessionStorage).value + '/streamer/'
const { getSportLiveStreamer, updateSportLiveStreamer, deleteSportLiveStreamer,createSiteImage,createSportLiveStreamer } = DashboardService
const { t } = useI18n()
const toast = useToast()
const confirm = useConfirm()
const store = useUserStore()

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  dialogLoading: false,
  status: [
    { name: t('fields.notStarted'), display: "t('fields.notStarted')", id: 0, value: 0 },
    { name: t('fields.inProgress'), display: "t('fields.inProgress')", id: 1, value: 1 },
  ],
})

const request = reactive({
  size: 30,
  current: 1,
  liveStatus: null,
  name: null,
})

const form = reactive({
  id: null,
  name: null,
  loginName: null,
  password: null,
  avatar: null,
})

const liveStreamerList = ref([])

const changePasswordDialog = reactive({
  visible: false,
  userId: null,
  form: {
    newPassword: '',
    confirmPassword: '',
  },
})

const fieldErrors = reactive({
  name: '',
  loginName: '',
  newPassword: '',
  confirmPassword: '',
})

const isSubmitting = ref(false)

const imageForm = reactive({
  id: null,
  name: null,
  path: null,
  displayPath: null,
  category: null,
  siteId: null,
  remark: null,
  imageDimension: null,
  promoType: null,
})

//更改密碼
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
function closeEditDialog() {
  uiControl.dialogVisible = false
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
    required(t('message.validateParamRequired')),
    size(6, 12, t('message.validatePasswordSize')),
  ],
  confirmPassword: [
    required(t('message.validateParamRequired')),
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

function showDialog(type, row = null) {
  uiControl.dialogVisible = true
  uiControl.dialogType = type
  if (type === 'EDIT' && row) {
    Object.assign(form, {
      id: row.id,
      name: row.name,
      loginName: row.loginName,
      avatar: row.avatar,
    })
    form.id = row.id
    form.avatar = row.avatar ? promoDir + row.avatar : null
    console.log(form.avatar)
  } else {
    Object.assign(form, {
      id: null,
      name: null,
      liveStatus: 0,
      loginName: null,
      password: null,
      avatar: null,
    })
  }
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

// 完整的 create() 函數實現
async function create() {
  try {
    isSubmitting.value = true
    
    // 基本驗證
    if (!form.name || !form.loginName || !form.password) {
      toast.add({
        severity: 'error',
        summary: t('message.validateParamRequired'),
        life: 3000,
      })
      return
    }

    // 密碼長度驗證
    if (form.password.length < 6 || form.password.length > 12) {
      toast.add({
        severity: 'error',
        summary: t('message.validatePasswordSize'),
        life: 3000,
      })
      return
    }

    // 處理頭像路徑
    if (form.avatar && form.avatar.startsWith("http")) {
      form.avatar = form.avatar.split('/').pop()
    }

    // 準備提交的數據
    const submitData = {
      name: form.name,
      loginName: form.loginName,
      password: form.password,
      avatar: form.avatar,
      liveStatus: 0 // 默認狀態為未開始
    }

    console.log('Creating streamer with data:', submitData)
    
    // 調用API創建主播
    const response = await createSportLiveStreamer(submitData);
     

    // 檢查響應
    if (response && (response.code === 0 || response.success)) {
      // 成功處理
      uiControl.dialogVisible = false
      await loadStreamer()
      
      toast.add({
        severity: 'success',
        summary: t('message.addSuccess'),
        life: 3000,
      })
      
      // 重置表單
      Object.assign(form, {
        id: null,
        name: null,
        loginName: null,
        password: null,
        avatar: null,
      })
    } else {
      throw new Error(response?.message || 'Create failed')
    }

  } catch (error) {
    console.error('Error creating streamer:', error)
    toast.add({
      severity: 'error',
      summary: t('message.addError') || 'Failed to create streamer',
      detail: error.message,
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

// 同時也完善 edit() 函數
async function edit() {
  try {
    isSubmitting.value = true
    
    // 基本驗證
    if (!form.name || !form.loginName) {
      toast.add({
        severity: 'error',
        summary: t('message.validateParamRequired'),
        life: 3000,
      })
      return
    }

    // 處理頭像路徑
    if (form.avatar && form.avatar.startsWith("http")) {
      form.avatar = form.avatar.split('/').pop()
    }

    // 準備提交的數據
    const submitData = {
      id: form.id,
      name: form.name,
      loginName: form.loginName,
      avatar: form.avatar,
    }

    console.log('Updating streamer with data:', submitData)
    
    // 調用API更新主播
    const response = await updateSportLiveStreamer(submitData)
    console.log(response);
    

    // 檢查響應
    if (response && (response.code === 0 || response.success)) {
      // 成功處理
      uiControl.dialogVisible = false
      await loadStreamer()
      
      toast.add({
        severity: 'success',
        summary: t('message.updateSuccess'),
        life: 3000,
      })
    } else {
      throw new Error(response?.message || 'Update failed')
    }

  } catch (error) {
    console.error('Error updating streamer:', error)
    toast.add({
      severity: 'error',
      summary: t('message.updateError') || 'Failed to update streamer',
      detail: error.message,
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

// 同時需要修改 submit() 函數來正確調用這些方法
function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
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

function resetQuery() {
  request.status = null
  request.name = null
}

function getStatusName(statusId) {
  const status = uiControl.status.find((item) => item.id === statusId)
  return status.name
}

async function loadStreamer() {
  console.log(request, 'dan')
  const _request = request
  if (request.liveStatus) {
    _request.liveStatus = request.liveStatus.value
  }

  const res = await getSportLiveStreamer(_request)

  liveStreamerList.value = res.records
}

onMounted(() => {
  loadStreamer()
})

async function attachImage(event) {
  const file = event.target.files[0]
  console.log(file)

  if (!file) return

  const data = await attachPhoto(event)
  if (data) {
    form.avatar = data
    // await submitImageUpload()
  } else {
    toast.add({
      severity: 'error',
      summary: t('message.failedToUploadImage'),
      life: 3000,
    })
  }
}

async function attachPhoto(event) {
  const files = event.target.files[0]
  console.log('attachPhoto', files)

  if (!files) return

  var fr = new FileReader()
  fr.onload = function () {
    var img = new Image()
    img.onload = function () {
      imageForm.imageDimension = img.width + ' * ' + img.height
    }
    img.src = fr.result
  }
  fr.readAsDataURL(files)

  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowFileType.includes(files.type)) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
    return null
  }

  const formData = new FormData()
  formData.append('files', files)
  formData.append('dir', 'streamer')
  formData.append('overwrite', false)
  console.log(formData)

  try {
    const response = await uploadImage(formData)
    return response.code === 0 ? response.data : null
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('message.failedToUploadImage'),
      life: 3000,
    })
    return null
  }
}

async function submitImageUpload() {
  imageForm.name = generateRandomString(8)
  imageForm.path = form.avatar
  imageForm.category = 'PROMO'
  imageForm.siteId = store.siteId
  console.log('submitImageUpload');
  

  try {
    

    if (response && response.code === 0) {
      toast.add({
        severity: 'success',
        summary: t('message.addSuccess'),
        life: 3000,
      })
      autoSelectImage()
    } else {
      toast.add({
        severity: 'error',
        summary: t('message.failedToUploadImage'),
        life: 3000,
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('message.failedToUploadImage'),
      life: 3000,
    })
  }
}

function generateRandomString(charSize) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < charSize; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

function deleteStreamer(teamId) {
  confirm.require({
    message: t('message.confirmDelete'),
    icon: 'pi pi-info-circle',
    rejectLabel: t('fields.cancel'),
    rejectProps: {
      label: t('fields.cancel'),
      severity: 'secondary',
    },
    acceptLabel: t('fields.confirm'),
    acceptProps: {
      label: t('fields.confirm'),
      severity: 'danger',
    },
    accept: async () => {
      try {
        await deleteSportLiveStreamer({ teamId: teamId })
        toast.add({
          severity: 'success',
          summary: t('message.deleteSuccess'),
          life: 3000,
        })
        await loadStreamer()
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: t('message.deleteFailed'),
          detail: err.message,
        })
      }
    },
  })
}

function autoSelectImage() {
  if (!form.avatar) {
    return
  }
  form.avatar = '7' + '/' + form.avatar
}
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
