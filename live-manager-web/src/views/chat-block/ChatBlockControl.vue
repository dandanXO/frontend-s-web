<template>
  <div class="p-buttonset">
    <Button
        v-if="!user.blocked"
        label="禁言"
        icon="pi pi-lock"
        severity="danger"
        size="small"
        @click="showDialog(user.name)"
    />
    <template v-else>
      <Button
          label="延長禁言"
          icon="pi pi-clock"
          severity="info"
          size="small"
          @click="showDialog(user.name)"
      />
      <Button
          label="解禁"
          icon="pi pi-check"
          severity="success"
          size="small"
          @click="unblock(user.name)"
      />
    </template>
  </div>

  <Dialog
      v-model:visible="dialog.visible"
      header="禁言設定"
      :style="{ width: '400px' }"
      modal
  >
    <div class="p-fluid">
      <div class="field">
        <label>帳號</label><br>
        <InputText v-model="dialog.form.loginName" disabled />
      </div>
      <div class="field">
        <label>禁言時長</label>
        <div class="p-inputgroup">
          <InputNumber v-model="dialog.form.duration" :min="1" :max="unitMaxMap[dialog.form.unit] || 60" />
          <Dropdown
              v-model="dialog.form.unit"
              :options="unitOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="單位"
              style="width: 120px"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="取消" icon="pi pi-times" class="p-button-text" @click="dialog.visible = false" />
      <Button label="確認" icon="pi pi-check" class="p-button-text" @click="submitBlock" />
    </template>
  </Dialog>
</template>

<script setup>
import { reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { DashboardService } from '@/service/DashboardService'
import dayjs from 'dayjs'

const props = defineProps({
  user: Object,
})

const emit = defineEmits(['refresh'])

const toast = useToast()

const dialog = reactive({
  visible: false,
  form: {
    loginName: '',
    duration: 10,
    unit: 'minute',
  },
})

const unitOptions = [
  { label: '分鐘', value: 'minute' },
  { label: '小時', value: 'hour' },
  { label: '天', value: 'day' },
  { label: '週', value: 'week' },
  { label: '月', value: 'month' },
]

const unitMaxMap = {
  minute: 60,
  hour: 24,
  day: 30,
  week: 4,
  month: 6,
}

function showDialog(name) {
  dialog.form.loginName = name
  dialog.form.duration = 10
  dialog.form.unit = 'minute'
  dialog.visible = true
}

async function submitBlock() {
  const blockTime = dayjs().add(dialog.form.duration, dialog.form.unit).format('YYYY-MM-DD HH:mm:ss')
  await DashboardService.blockUserApi({ loginName: dialog.form.loginName, blockTime })
  toast.add({ severity: 'success', summary: '成功', detail: '已禁言', life: 3000 })
  dialog.visible = false
  emit('refresh')
}

async function unblock(loginName) {
  await DashboardService.unblockUserApi({ loginName })
  toast.add({ severity: 'success', summary: '成功', detail: '已解除禁言', life: 3000 })
  emit('refresh')
}
</script>

<style scoped>
.p-buttonset {
  display: flex;
  gap: 0.5rem;
}
</style>
