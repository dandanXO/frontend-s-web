<template>
  <div class="menu-main">
    <div class="header-container">
      <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')">{{ t('fields.add') }}</el-button>
    </div>
    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="660px"
               @close="uiControl.popoverVisible = false"
               destroy-on-close
    >
      <el-form ref="menuForm" :model="form" :rules="formRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.menuType')" prop="type">
          <el-radio-group v-model="form.type" size="mini" style="width: 300px">
            <el-radio-button label="CATALOG">Catalog</el-radio-button>
            <el-radio-button label="MENU">Menu</el-radio-button>
            <el-radio-button label="BUTTON">Features</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== 'BUTTON'" :label="t('fields.menuIcon')" prop="icon">
          <el-popover
            :visible="uiControl.popoverVisible"
            placement="bottom-start"
            :width="450"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <template #reference>
              <el-input v-model="form.icon" @click="uiControl.popoverVisible = true" style="width: 450px;"
                        :placeholder="t('fields.menuIcon')"
                        readonly
              >
                <template #prefix>
                  <svg-icon v-if="form.icon" :icon-class="form.icon" class="el-input__icon"
                            style="height: 32px;width: 16px;"
                  />
                  <i v-else class="el-icon-search el-input__icon" />
                </template>
              </el-input>
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== 'BUTTON'" :label="t('fields.menuTitle')" prop="name">
          <el-input v-model="form.name" :style=" form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'"
                    :placeholder="t('fields.menuTitle')"
          />
        </el-form-item>
        <el-form-item v-show="form.type.toString() === 'BUTTON'" :label="t('fields.features')" prop="name">
          <el-input v-model="form.name" :placeholder="t('fields.features')" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== 'CATALOG'" :label="t('fields.permission')" prop="permission">
          <el-input v-model="form.permission" :placeholder="t('fields.permission')"
                    style="width: 178px;"
          />
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== 'BUTTON'" :label="t('fields.router')" prop="path">
          <el-input v-model="form.path" :placeholder="t('fields.router')" style="width: 178px;" />
        </el-form-item>
        <el-form-item :label="t('fields.sorting')" prop="menuSort">
          <el-input-number v-model.number="form.menuSort" :min="0" :max="999" controls-position="right"
                           style="width: 178px;"
          />
        </el-form-item>
        <el-form-item :label="t('fields.hidden')">
          <el-radio-group v-model="form.hidden">
            <el-radio-button label="true">YES</el-radio-button>
            <el-radio-button label="false">NO</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() === 'MENU'" :label="t('fields.componentName')" prop="componentName">
          <el-input v-model="form.componentName" style="width: 178px;" :placeholder="t('fields.componentName')" />
        </el-form-item>
        <el-form-item v-show="form.type.toString() === 'MENU'" :label="t('fields.componentPath')" prop="component">
          <el-input v-model="form.component" style="width: 450px;" :placeholder="t('fields.componentPath')" />
        </el-form-item>
        <el-form-item :label="t('fields.superiorCategory')" prop="parentId">
          <TreeSelect
            style="width: 450px;"
            :placeholder="t('fields.superiorCategory')" @selected="selectTreeNode"
            :view-val="form.parentId"
          />
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="sites">
          <el-select
            v-model="form.sites"
            multiple
            :placeholder="t('fields.pleaseChoose')"
            filterable
            style="width: 450px;"
          >
            <el-option
              v-for="item in sitesList.value"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button size="small" @click="resetForm">{{ t('fields.cancel') }}</el-button>
        <el-button size="small" @click="submit" type="primary">{{ t('fields.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-table :data="list" style="width: 100%;margin-top: 40px" size="small" row-key="id"
              ref="treeTable"
              lazy
              :key="tableKey"
              :load="load"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              :empty-text="t('fields.noData')"
    >
      <el-table-column prop="name" :label="t('fields.menuTitle')" width="250" align="left" />
      <el-table-column prop="icon" :label="t('fields.menuIcon')" width="100" align="center">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.icon" class="el-input__icon"
                    style="height: 32px;width: 100%; display: flex;justify-content: center;align-items: center"
          />
        </template>
      </el-table-column>
      <el-table-column prop="menuSort" :label="t('fields.sorting')" width="180" align="center" />
      <el-table-column prop="permission" :label="t('fields.permission')" width="180" align="center" />
      <el-table-column prop="path" :label="t('fields.componentPath')" min-width="200" align="center" />
      <el-table-column :label="t('fields.hidden')" min-width="80" align="center">
        <template #default="scope">
          <span v-if="scope.row.hidden">Y</span>
          <span v-else>N</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')" min-width="180" align="center">
        <template #default="scope">
          <span v-formatter="{data: scope.row.createTime,formatter: 'HH:mm:ss MM/DD/YYYY',type: 'date'}" />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="center" fixed="right" min-width="120">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" @click="editMenu(scope.row)" />
          <el-button icon="el-icon-remove" size="mini" type="danger" @click="removeMenu(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import IconSelect from "../../../components/IconSelect";
import TreeSelect from "./tree-select";
import { required } from "../../../utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { createMenu, deleteMenu, fetchMenu, MenuType, MenuViewScope, updateMenu } from "../../../api/menus";
import { useI18n } from "vue-i18n";
import { useStore } from "../../../store";

const { t } = useI18n();
const uiControl = reactive({
  dialogVisible: false,
  popoverVisible: false,
  dialogTitle: "",
  dialogType: "CREATE"
});
const list = reactive([]);
const sitesList = reactive([]);
const form = reactive({
  id: null,
  name: null,
  type: MenuType.CATALOG,
  icon: null,
  permission: null,
  path: null,
  componentName: null,
  component: null,
  parentId: null,
  hidden: false,
  viewScope: MenuViewScope.ALL,
  menuSort: 1,
  remark: null,
  sites: []
});

const formRules = reactive({
  name: [required(t('message.validateMenuTitleRequired'))]
});
const menuForm = ref(null);
const treeTable = ref(null);
const tableKey = ref(Math.random());

async function initList() {
  const { data: menus } = await fetchMenu();
  list.length = 0;
  list.push(...menus);
}

function selected(name) {
  form.icon = name;
  uiControl.popoverVisible = false;
}

async function load(tree, treeNode, resolve) {
  const { data: children } = await fetchMenu(tree.id);
  resolve(children);
}

function selectTreeNode(id) {
  form.parentId = id;
}

function showDialog(type) {
  if (type === "CREATE") {
    Object.keys(form).forEach(key => {
      if (key === "type") {
        form.type = MenuType.CATALOG;
      } else if (key === "viewScope") {
        form.tyviewScopepe = MenuViewScope.ALL;
      } else if (key === "hidden") {
        form.hidden = false;
      } else if (key === "sites") {
        form.sites = sitesList.value.map(item => item.id)
      } else {
        form[key] = null;
      }
    });
    uiControl.dialogTitle = t('fields.addMenu');
  } else {
    uiControl.dialogTitle = t('fields.editMenu');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

/**
 * 刷新菜单table
 * @param menu
 */
function refresh() {
  initList();
  tableKey.value = Math.random();
}

/**
 * 更新菜单
 * @param menu
 */
function editMenu(menu) {
  for (const key in menu) {
    if (Object.keys(form).find(k => k === key)) {
      form[key] = menu[key];
    }
  }
  showDialog("EDIT");
}

/**
 *  新增菜单
 */
function create() {
  menuForm.value.validate(async (valid) => {
    if (valid) {
      await createMenu(form);
      refresh(form);
      uiControl.dialogVisible = false;
      ElMessage({ message: "新增成功", type: "success" });
    }
  });
}

/**
 *  编辑菜单
 */
function edit() {
  menuForm.value.validate(async (valid) => {
    if (valid) {
      await updateMenu(form);
      refresh(form);
      uiControl.dialogVisible = false;
      ElMessage({ message: "编辑成功", type: "success" });
    }
  });
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  } else {
    edit();
  }
}

/**
 * 删除菜单
 * @param menu
 */
function removeMenu(menu) {
  if (menu.hasChildren) {
    ElMessage({ message: "该菜单含有子节点，请先删除子节点", type: "warning" });
  } else {
    ElMessageBox.confirm(
      "确认是否删除？此操作不能撤销",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }
    ).then(async () => {
      await deleteMenu(menu.id);
      refresh(menu);
      ElMessage({ message: "删除成功", type: "success" });
    });
  }
}

function resetForm() {
  uiControl.dialogVisible = false;
}

function initSite() {
  sitesList.value = useStore().state.user.sites;
  if (sitesList.value[0].id !== 9999) {
    sitesList.value.unshift({
      id: 9999,
      siteName: 'All Sites',
      siteCode: 'ALL'
    })
  }
}

onMounted(() => {
  initList()
  initSite()
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
