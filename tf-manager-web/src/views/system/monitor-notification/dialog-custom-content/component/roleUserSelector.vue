<template>
  <div>
    <el-form-item label="指定角色">
      <el-select
        v-model="selectedRoleNameArr"
        size="small"
        class="filter-item"
        style="width: 350px"
        multiple
        filterable
        @visible-change="handleRoleSelectorVisibleChange"
        @remove-tag="handleRoleRemoved"
      >
        <el-option
          v-for="item in simpleRoleArrBySite"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="排除用户">
      <el-select
        v-model="excludedUserNameArr"
        size="small"
        class="filter-item"
        style="width: 350px"
        multiple
        filterable
      >
        <el-option
          v-for="item in simpleUserArrBySelectedRoles"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, defineExpose } from 'vue';
import { getSimpleRoles, getSimpleUsersByRoles } from "@/api/roles";
import { ElMessage } from "element-plus";

const props = defineProps({
  siteId: {
    type: Number,
    required: true,
  },
  systemRoleIdListToSendNotification: {
    type: Array,
    required: true,
  },
  systemUserIdListToExclude: {
    type: Array,
    required: true,
  },
});

const selectedRoleNameArr = ref([]);
const excludedUserNameArr = ref([]);

const simpleRoleArrBySite = ref([]);
const simpleUserArrBySelectedRoles = ref([]);

onMounted(async () => {
  await loadSimpleRoleBySite();

  selectedRoleNameArr.value = getRoleNamesByIds(props.systemRoleIdListToSendNotification, simpleRoleArrBySite.value)
  await loadExcludedUserBySelectedRoles();
});

function getRoleNamesByIds(roleIds, simpleRoleList) {
  return roleIds.map(id => {
    const role = simpleRoleList.find(role => role.id === id);
    return role ? role.name : undefined;
  }).filter(name => name !== undefined);
}

async function loadSimpleRoleBySite() {
  const res = await getSimpleRoles(props.siteId);
  if (res.code !== 0) {
    return;
  }
  simpleRoleArrBySite.value = res.data;
}

async function loadExcludedUserBySelectedRoles() {
  if (selectedRoleNameArr.value.length === 0) {
    simpleUserArrBySelectedRoles.value = [];
    excludedUserNameArr.value = [];
    return;
  }
  const res = await getSimpleUsersByRoles(getRoleIdsByNames(selectedRoleNameArr.value, simpleRoleArrBySite.value));
  if (res.code !== 0) {
    ElMessage({
      message: 'Failed to get simple user by roles.',
      type: 'error',
    })
    return;
  }

  simpleUserArrBySelectedRoles.value = res.data;
  excludedUserNameArr.value = getUserNamesByIds(props.systemUserIdListToExclude, simpleUserArrBySelectedRoles.value)
}

const getUserNamesByIds = (userIds, simpleUsers) => {
  return simpleUsers
    .filter(simpleUser => userIds.includes(simpleUser.id))
    .map(simpleUser => simpleUser.name);
};

const handleRoleSelectorVisibleChange = (isVisible) => {
  if (!isVisible) {
    loadExcludedUserBySelectedRoles();
  }
};

const handleRoleRemoved = () => {
  loadExcludedUserBySelectedRoles();
};

const getRoleIdsByNames = (roleNames, simpleRoleList) => {
  return simpleRoleList
    .filter(role => roleNames.includes(role.name))
    .map(role => role.id);
};

const getUserIdsByNames = (userNames, simpleUsers) => {
  return simpleUsers
    .filter(simpleUser => userNames.includes(simpleUser.name))
    .map(simpleUser => simpleUser.id);
};

const fetchSystemRoleIdListToSendNotification = () => {
  return getRoleIdsByNames(selectedRoleNameArr.value, simpleRoleArrBySite.value)
}

const fetchSystemUserIdListToExclude = () => {
  return getUserIdsByNames(excludedUserNameArr.value, simpleUserArrBySelectedRoles.value)
}

// 向父元件暴露方法
defineExpose({
  fetchSystemRoleIdListToSendNotification,
  fetchSystemUserIdListToExclude,
});

</script>

<style scoped lang="scss">
</style>
