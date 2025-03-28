<template>
  <div class="roles-main">
    <div class="header-container" v-if="hasRole(['TENANT','ADMIN'])">
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="uiControl.addNewNoteVisible = true"
                   v-permission="['sys:note:add']"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="t('fields.add')"
      v-model="uiControl.addNewNoteVisible"
      append-to-body
      width="800px"
    >
      <el-form
        ref="noteFormRef"
        :model="noteForm"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="160px"
      >
        <el-form-item :label="t('fields.type')" prop="noteType">
          <el-select
            v-model="noteForm.noteType"
            size="small"
            :placeholder="t('fields.type')"
            class="filter-item"
            style="width: 120px; margin-left: 5px"
          >
            <el-option
              v-for="item in uiControl.noteTypeOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input v-model="noteForm.title" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.content')" prop="content">
          <quill-editor ref="quillEditorRef"
                        :content="content"
                        :options="editorOption"
                        style="min-height: 500px;width: 350px"
                        @update:content="content = $event"
                        content-type="html" theme="snow"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="uiControl.addNewNoteVisible = false">{{ t('fields.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="viewDialogTitle"
      v-model="uiControl.isView"
      width="100%"
      append-to-body
    >
      <div
        style="max-height: 60vh; overflow-y: auto; padding-right: 8px;"
        v-html="viewDialogContent"
      /> <!-- ✅ Scrollable content -->

      <template #footer>
        <el-button @click="uiControl.isView = false">
          {{ t('fields.close') }}
        </el-button>
      </template>
    </el-dialog>
    <div class="notes-container">
      <el-card v-for="(note, index) in page.records" :key="note.id" class="note-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <div class="card-title">
              <div class="note-title">{{ note.title }}</div>
              <div class="note-type">{{ getNoteTypeByKey(note.noteType) }}</div>
              <div class="note-type">{{ note.createTime }}</div>
            </div>
            <div class="card-actions">
              <el-button
                type="info"
                size="mini"
                icon="el-icon-zoom-in"
                @click="viewFullContent(index)"
                circle
              />
              <el-button
                v-permission="['sys:note:delete']"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeNote(index)"
                circle
              />
            </div>
          </div>
        </template>
        <div class="card-content">
          <div v-html="note.content" /> <!-- ✅ Content is trimmed if too long -->
        </div>
      </el-card>
    </div>
    <el-pagination
      :total="page.total"
      :page-sizes="[30]"
      layout="total,sizes,prev, pager, next"
      style="margin-top: 10px"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadIpLabel"
    />
  </div>

</template>

<script setup>

import { onMounted, reactive, ref } from "vue";
import { hasRole } from "../../../utils/util";
import { getNotes, createNote, deleteNotes } from "../../../api/note";
import { useI18n } from "vue-i18n";
import { required } from '../../../utils/validate'
import { useStore } from "@/store";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { QuillEditor } from "@vueup/vue-quill";

const noteFormRef = ref(null)
const content = ref("");
const { t } = useI18n();
const quillEditorRef = ref(null);
const store = useStore()
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  addNewNoteVisible: false,
  isView: false,
  noteTypeOptions: [
    { key: 1, name: "Note" },
    { key: 2, name: "Task" },
    { key: 3, name: "Reminder" }
  ]
});
const viewDialogTitle = ref(""); // Stores the title of the viewed note
const viewDialogContent = ref(""); // Stores the full content of the viewed note

function viewFullContent(index) {
  const note = page.records[index];
  viewDialogTitle.value = note.title;
  viewDialogContent.value = note.content;
  uiControl.isView = true;
}

function imageHandler() {
  console.log("in handler")
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");

  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        insertToEditor(base64Image);
      };
      reader.readAsDataURL(file);
    }
  });

  input.click();
}

function getNoteTypeByKey(key) {
  key = parseInt(key)
  return uiControl.noteTypeOptions.find((item) => item.key === key).name;
}

function pasteImageHandler(node, delta) {
  const url = node.data.trim();

  // ✅ Check if the pasted URL is an image link
  if (/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url)) {
    return {
      ops: [{ insert: { image: url } }],
    };
  }

  return delta;
}

const editorOption = {
  modules: {
    toolbar: {
      container: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
      ],
      handlers: {
        image: imageHandler, // Attach Base64 image upload function
      },
    },
    clipboard: {
      matchers: [[Node.TEXT_NODE, pasteImageHandler]], // ✅ Handle pasted URLs
    },
  },
};

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  siteId: store.state.user.siteId,
  size: 30,
  current: 1
});

const noteForm = reactive({
  id: null,
  siteId: store.state.user.siteId,
  content: null,
  title: null,
  noteType: null,
});

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  noteType: [required(t('message.validateTypeRequired'))],
  content: [required(t('message.validateContentRequired'))],
  title: [required(t('message.validateTitleRequired'))],
})

function insertToEditor(base64Image) {
  if (!quillEditorRef.value) return; // Ensure Quill instance exists
  const quill = quillEditorRef.value.getQuill(); // ✅ Get Quill instance correctly

  const range = quill.getSelection(); // Get cursor position
  if (range) {
    quill.insertEmbed(range.index, "image", base64Image); // ✅ Insert image
    quill.setSelection(range.index + 1); // Move cursor after image
  }
}
async function loadIpLabel() {
  page.loading = true
  const { data: ret } = await getNotes(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.records = ret.records
  page.loading = false
}

async function removeNote(index) {
  const note = page.records[index]
  await deleteNotes(note.id)
  await loadIpLabel()
}

async function submit() {
  noteForm.content = content.value
  await createNote(noteForm)
  uiControl.addNewNoteVisible = false
  await loadIpLabel()
}

onMounted(async() => {
  await loadIpLabel();
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enabled-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.el-form-item--level-color:deep(.el-form-item__content) {
  display: flex !important;
}

.level-color {
  width: 30px;
  height: 30px;
}

.ql-container {
  min-height: 200px !important;
  background: white !important;
  border: none !important;
}

.ql-editor {
  min-height: 180px !important;
  font-size: 16px;
  padding: 10px;
}

.notes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* ✅ Equal-width cards */
  gap: 16px;
}

.note-card {
  height: 350px; /* ✅ Fixed card height */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.note-card .el-card__body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* ✅ Ensure content is evenly distributed */
}

.card-content {
  flex-grow: 1;
  overflow: hidden; /* ✅ Hide overflow */
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* ✅ Limit text to 4 lines */
  -webkit-box-orient: vertical;
  padding: 8px;
}

.card-content img {
  max-width: 100%; /* ✅ Ensure images fit */
  height: auto;
  display: block;
  object-fit: cover; /* ✅ Crop images to fit */
  max-height: 150px; /* ✅ Limit image height */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions {
  display: flex;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-title {
  display: flex;
  flex-direction: column;
}

.note-title {
  font-weight: bold;
}

.note-type {
  font-size: 12px;
  color: #888;
}

.card-content :is(p, div, span):empty {
  display: none;
}
</style>
