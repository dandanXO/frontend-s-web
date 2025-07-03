<!--TODO-->
<template>
  <div class="card">
    <DataTable
      :value="page.records"
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
            v-model="request.sportType"
            :options="uiControl.sport"
            optionLabel="name"
            optionValue="name"
            :placeholder="t('fields.sportType')"
            :size="'small'"
          />
          <InputText
            type="text"
            v-model="request.nameZh"
            :optionLabel="t('fields.teamNameEn')"
            :placeholder="t('fields.teamNameEn')"
          />
          <InputText
            type="text"
            v-model="request.nameEn"
            :optionLabel="t('fields.teamNameZh')"
            :placeholder="t('fields.teamNameZh')"
          />
          <Button
            :label="t('fields.search')"
            :size="'small'"
            severity="success"
            icon="pi pi-search"
            @click="loadTeam"
          />
          <Button
            :label="t('fields.reset')"
            :size="'small'"
            severity="warn"
            icon="pi pi-refresh"
            @click="resetQuery"
          />
          <Button
            :label="t('fields.add')"
            :size="'small'"
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

      <Column field="eventStartTime" :header="t('fields.sportType')" sortable>
        <template #body="slotProps">
          {{ getSportName(slotProps.data.sportId) }}
        </template>
      </Column>

      <Column field="liveStatus" :header="t('fields.teamNameEn')" sortable>
        <template #body="slotProps">
          {{ slotProps.data.nameEn }}
        </template>
      </Column>

      <Column field="sportId" :header="t('fields.teamNameZh')" sortable>
        <template #body="slotProps">
          {{ slotProps.data.nameZh }}
        </template>
      </Column>

      <Column field="liveStatus" :header="t('fields.teamIcon')" sortable style="min-width: 80px; max-width: 80px;">
        <template #body="slotProps">
          <Image
            v-if="slotProps.data.icon"
            :src="
              slotProps.data.icon.startsWith('http:') || slotProps.data.icon.startsWith('https:')
                ? slotProps.data.icon
                : promoDir + slotProps.data.icon
            "
            preview
            alt="Image"
            width="50"
      height="50"
      style="object-fit: contain; max-width: 100%;"
          />
        </template>
      </Column>
      <Column field="liveStatus" :header="t('fields.operate')" sortable>
        <template #body="slotProps">
          <div class="flex justify-between" style="display: flex; gap: 8px">
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
              @click="deleteTeam(slotProps.data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
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
      <label for="name" class="w-24 font-semibold">{{ t('fields.sportType') }}</label>

      <div style="width: 450px">
        <Select
          v-model="form.sportId"
          style="width: 100%"
          :options="uiControl.sport"
          optionLabel="name"
          optionValue="id"
          :placeholder="t('fields.sportType')"
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
      <label for="loginName" class="w-24 font-semibold"> {{ t('fields.teamNameEn') }}</label>
      <div style="width: 450px">
        <InputText id="loginName" class="w-full" style="width: 100%" v-model="form.nameEn" />
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
      <label for="password" class="w-24 font-semibold">{{ t('fields.teamNameZh') }}</label>
      <div style="width: 450px">
        <InputText id="password" class="w-full" style="width: 100%" v-model="form.nameZh" />
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
      <label for="confirmPassword" class="w-24 font-semibold">{{ t('fields.teamIcon') }}</label>
      <div style="width: 100px">
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
      <Button type="button" :label="t('fields.confirm')" :loading="isSubmitting" @click="submit" />
    </div>
  </Dialog>
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { defineComponent, reactive, onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { liveSportTyps } from '@/utils/live'
import { DashboardService } from '@/service/DashboardService'
import { useStorage } from '@vueuse/core'
import { useConfirm } from 'primevue/useconfirm'
import { uploadImage } from '@/service/image'
import { useToast } from 'primevue/usetoast'
const promoDir = useStorage('IMAGE_CDN', '', sessionStorage).value + '/promo/'
const { getSportLiveTeam, createSportLiveTeam, editSportLiveTeam, deleteSportLiveTeam,createSiteImage } =
  DashboardService
const { t } = useI18n()
const confirm = useConfirm()
const toast = useToast()

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  editBtn: true,
  removeBtn: true,
  dialogLoading: false,
  sport: liveSportTyps,
  eventStatus: computed(() => [
    { name: '1', display: t('fields.active') },
    { name: '2', display: t('fields.inactive') },
  ]),
})
const request = reactive({
  size: 30,
  current: 1,
  sportType: null,
  nameZh: null,
  nameEn: null,
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

function resetQuery() {
  request.sportType = null
  request.nameEn = null
  request.nameZh = null
}

async function loadTeam() {
  const { records, pages } = await getSportLiveTeam(request)
  page.pages = pages
  page.records = records
  page.loading = false
}

function getSportName(id) {
  const sport = uiControl.sport.find((s) => s.id === id)
  return sport ? sport.display : '-'
}

const form = reactive({
  id: null,
  sportId: null,
  nameZh: null,
  nameEn: null,
  icon: null,
  siteId: 7
})

function showDialog(type, row = null) {
  uiControl.dialogVisible = true
  uiControl.dialogType = type
  if (type === 'EDIT' && row) {
    Object.assign(form, {
      id: row.id,
      sportId: row.sportId,
      nameZh: row.nameZh,
      nameEn: row.nameEn,
      icon: row.icon,
    })
    form.id = row.id
    form.icon = row.icon ? promoDir + row.icon : null
    console.log(form.icon)
  } else {
    Object.assign(form, {
      id: null,
      sportId: null,
      nameZh: null,
      nameEn: null,
      icon: null,
    })
  }
}
function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

async function create() {
  await createSportLiveTeam(form)
  uiControl.dialogVisible = false
  await loadTeam()
  toast.add({
    severity: 'success',
    summary: t('message.addSuccess'),
    life: 3000,
  })
}

async function edit() {
  await editSportLiveTeam(form)
  uiControl.dialogVisible = false
  toast.add({
    severity: 'success',
    summary: t('message.updateSuccess'),
    life: 3000,
  })
  await loadTeam()
}

async function deleteTeam(teamId) {
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
        await deleteSportLiveTeam({ teamId: teamId })
        toast.add({
          severity: 'success',
          summary: t('message.deleteSuccess'),
          life: 3000,
        })
        await loadTeam()
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
    console.log('attachPhoto');
    
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
  imageForm.siteId = 7
  console.log('submitImageUpload')

  try {
    const response = await createSiteImage(imageForm)
    console.log(response)

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
function generateRandomString(charSize) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < charSize; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

onMounted(() => {
  loadTeam()
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

.p-image img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
</style>
