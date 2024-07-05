<template>
	<div class="page-container member-tree-container">
		<div class="panel-item">
			<el-input v-model="filterText" style="width: 240px" placeholder="Filter keyword" />

			<el-tree ref="treeRef" style="max-width: 600px" class="filter-tree" :data="memberTreeData"
				:props="defaultProps" default-expand-all :filter-node-method="filterNode">
				<template #default="{ node }">
					<div class="tree-node">
						<svg-icon :icon-class="'user'" />
						<span>{{ node.data.member_name }}</span>
					</div>
				</template>
			</el-tree>
		</div>
		<div class="panel-item">Tables</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';

const filterText = ref('');
const treeRef = ref();

watch(filterText, (val) => {
	treeRef.value.filter(val)
})

const filterNode = (value, data) => {
	if (!value) return true
	return data.label.toLowerCase().includes(value.toLowerCase())
}

const memberTreeData = [{
	member_id: 1,
	member_name: 'Member 1 Name',
	member_type: 'Member 1 Type',
	children: [{
		member_id: 1.1,
		member_name: 'Member 1 Children 1 Name',
		member_type: 'Member 1 Children 1 Type',
		children: [{
			member_id: 1.2,
			member_name: 'Member 1 Children 1 Children 1 Name',
			member_type: 'Member 1 Children 1 Children 1 Type',
		}]
	}]
}, {
	member_id: 2,
	member_name: 'Member 2 Name',
	member_type: 'Member 2 Type',
	children: [{
		member_id: 2.1,
		member_name: 'Member 2 Children 1 Name',
		member_type: 'Member 2 Children 1 Type',
		children: [{
			member_id: 2.2,
			member_name: 'Member 2 Children 1 Children 1 Name',
			member_type: 'Member 2 Children 1 Children 1 Type',
		}]
	}]
}];
</script>

<style lang="scss" scoped>
.member-tree-container {
	display: grid;
	grid-template-columns: 1fr 1fr;
}

.tree-node {
	display: flex;
	align-items: center;
	gap: 5px;
}
</style>
