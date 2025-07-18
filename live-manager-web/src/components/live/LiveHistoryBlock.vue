<template>
    <div class="card">
        <!-- Stream History List -->
        <DataTable
            :value="page.records"
            :loading="page.loading"
            responsiveLayout="scroll"
            scrollable
            scrollWidth="100%"
            fit
        >
            <template #header>
                <InputText :size="'small'" v-model="request.title" :placeholder="t('fields.title')" style="margin-right: 10px;" />
                <InputText :size="'small'" v-model="request.homeTeamName" :placeholder="t('fields.homeTeam')" style="margin-right: 10px;" />
                <InputText :size="'small'" v-model="request.awayTeamName" :placeholder="t('fields.awayTeam')" style="margin-right: 10px;" />
                <Button :size="'small'" :label="t('fields.search')" severity="success" @click="loadStreamList" style="margin-right: 10px;" />
                <Button :size="'small'" :label="t('fields.reset')" severity="warn" @click="resetQuery" style="margin-right: 10px;" />
            </template>
            <Column field="title" :header="t('fields.title')" minWidth="250" />
            <Column :header="t('fields.homeTeam')" minWidth="250">
                <template #body="slotProps">
                    <div>
                        {{ slotProps.data.homeNameZh || slotProps.data.homeNameEn }}
                    </div>
                </template>
            </Column>
            <Column :header="t('fields.awayTeam')" minWidth="250">
                <template #body="slotProps">
                    <div>
                        {{ slotProps.data.awayNameZh || slotProps.data.awayNameEn }}
                    </div>
                </template>
            </Column>
            <Column :header="t('fields.operator')" minWidth="250">
                <template #body="slotProps">
                    <div>
                        <Button :size="'small'" :label="t('fields.chatHistory')" severity="info" @click="showChatHistory(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <Paginator
            :rows="request.size"
            :totalRecords="page.total"
            :rowsPerPageOptions="[10, 20, 50]"
            :first="(request.current - 1) * request.size"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            @page="changePage"
            class="p-mt-2"
        />

        <Dialog
            :header="t('fields.chatHistory')"
            v-model:visible="uiControl.dialogVisible"
            modal
            class="p-dialog-md live-event-dialog"
            appendTo="body"
            :style="{ width: '80vw' }"
        >
            
            <DataTable
                :value="chatPage.records"
                :loading="chatPage.loading"
                responsiveLayout="scroll"
                scrollable
                scrollWidth="100%"
            >
                <Column field="name" :header="t('fields.name')" minWidth="150" />
                <Column field="content" :header="t('fields.content')" minWidth="150" />
                <Column :header="t('fields.operator')" minWidth="150">
                    <template #body="slotProps">
                        <div v-if="!slotProps.data.blocked">
                            <form>
                                <label style="margin-right: 10px;">{{ t('fields.blockDuration') }}</label>
                                <InputNumber v-model="form.duration" :min="1" :max="unitMaxMap[form.unit] || 60" inputStyle="width: 100px;" style="margin-right: 10px;" />
                                <Dropdown
                                    v-model="form.unit"
                                    :options="durationUnits"
                                    optionLabel="label"
                                    optionValue="value"
                                    style="width: 100px; margin-right: 10px;"
                                />
                                <Button icon="pi pi-lock" severity="info" size="small" :label="t('fields.block')" @click="blockUser(slotProps.data)" style="margin-right: 10px;" />
                            </form>
                        </div>      
                        <div v-else>
                            <Button icon="pi pi-check" severity="success" size="small" :label="t('fields.unblock')" @click="unblockUser(slotProps.data)" style="margin-right: 10px;" />
                        </div>
                    </template>
                </Column>
            </DataTable>
            <Paginator
            :rows="chatRequest.size"
            :totalRecords="chatPage.total"
            :rowsPerPageOptions="[10, 20, 50]"
            :first="(chatRequest.current - 1) * chatRequest.size"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            @page="changeChatPage"
            class="p-mt-2"
        />
        </Dialog>

    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { DashboardService } from '@/service/DashboardService'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore.js'
import dayjs from 'dayjs'
import { useToast } from 'primevue/usetoast';

const { t } = useI18n()
const store = useUserStore()
const toast = useToast();

const uiControl = reactive({
    dialogVisible: false,
})

const request = reactive({
  siteId: store.siteId,
  size: 30,
  current: 1,
  title: null,
  homeTeamName: null,
  awayTeamName: null,
});

const page = reactive({
    pages: 0,
    records: [],
    total: 0,
    current: 1,
    loading: false,
})

const chatRequest = reactive({
  streamId: null,
  loginName: null,
  size: 30,
  current: 1,
});

const chatPage = reactive({
  pages: 0,
  records: [],
  loading: false,
});

const unitMaxMap = {
  minute: 60,
  hour: 24,
  day: 30,
  week: 4,
  month: 6
};

const form = reactive({
  loginName: null,
  duration: null,
  unit: null,
})

const durationUnits = ref([
  { label: t('fields.minutes'), value: 'minute' },
  { label: t('fields.hours'), value: 'hour' },
  { label: t('fields.days'), value: 'day' },
  { label: t('fields.weeks'), value: 'week' },
  { label: t('fields.months'), value: 'month' }
]);

const { getStreamHistoryList, getChatHistoryv2, blockUserApiV1, unblockUserApiV2 } = DashboardService


function changePage(event) {
  request.current = event.page + 1;
  request.size = event.rows;
  loadStreamList();
}

function changeChatPage(event) {
  chatRequest.current = event.page + 1;
  chatRequest.size = event.rows;
  loadChatHistory(chatRequest.streamId);
}

function resetQuery() {
    request.title = null
    request.homeTeamName = null
    request.awayTeamName = null
    loadStreamList()
}

function showChatHistory(data) {
    uiControl.dialogVisible = true
    chatRequest.streamId = data.id
    loadChatHistory(data.id)
}

async function loadChatHistory(id) {
    chatRequest.streamId = id
    chatPage.loading = true

    const query = new URLSearchParams({
        current: chatRequest.current,
        size: chatRequest.size
    });

    try {
        const response = await getChatHistoryv2(`?${query.toString()}`, chatRequest);
        const data = response?.data || response;
        chatPage.pages = data?.pages || 0;
        chatPage.records = data?.records || [];
    } catch (error) {
        console.error("Failed to load chat history:", error);
    } finally {
        chatPage.loading = false;
    }
}

async function loadStreamList() {
  page.loading = true
  const { data : res } = await getStreamHistoryList(request);
  page.records = res.records || []
  page.total = res.total || 0
  page.pages = res.pages || 0
  page.current = res.current || 1
  page.loading = false
}

async function blockUser(data) {
    form.loginName = data.name

    if (!form.loginName || !form.duration || !form.unit) {
        toast.add({ severity: 'warn', summary: 'warn', detail: t('message.validateBlockReasonRequired'), life: 3000 });
        return;
    }

    const blockTime = dayjs().add(form.duration, form.unit).format('YYYY-MM-DD HH:mm:ss');

    try {
        await blockUserApiV1({ loginName: form.loginName, blockTime });
        toast.add({ severity: 'success', summary: 'success', detail: t('fields.blockSuccess'), life: 3000 });
        form.loginName = ''; 
        loadChatHistory(chatRequest.streamId);
    } catch (error) {
        toast.add({ severity: 'error', summary: 'error', detail: t('fields.blockFailed'), life: 3000 });
    }
}

async function unblockUser(data) {
    const loginName = data.name

    try {
        await unblockUserApiV2({ loginName });
        toast.add({ severity: 'success', summary: 'success', detail: t('fields.unblockSuccess'), life: 3000 });
        loadChatHistory(chatRequest.streamId);
    } catch (error) {
        console.error('Unblock user failed:', error);
        toast.add({ severity: 'error', summary: 'error', detail: t('message.unblockFailed'), life: 3000 });
    }
}

onMounted(() => {
    loadStreamList()
})
</script>

<style scoped>

</style>