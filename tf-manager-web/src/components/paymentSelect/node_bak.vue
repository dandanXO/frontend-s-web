<template>
  <div class="node" v-if="list && list.length !== 0">
    <div class="node-content">
      <div class="title" v-if="level === 1">第{{ level }}层</div>
      <div class="title" v-else>{{ name }}</div>

      <div
        class="node-item"
        :id="level + '_' + i"
        draggable="true"
        @click="clickItem(item)"
        :style="{
          border:
            item.dragtype === 3
              ? '2px solid #0000ff'
              : selectItem === item
                ? '1px solid #ffff00'
                : '',
        }"
        @dragover="dragenter($event, item, i)"
        @dragleave="dragleave(item, i)"
        @drag="drag($event, item, i)"
        @drop="drop(item, i)"
        :key="i"
        v-for="(item, i) in list"
      >
        <!-- <div
          :class="{ before: item.dragtype === 1, after: item.dragtype === 2 }"
        ></div> -->
        <!-- <div class="node-item-border"> -->
        <div class="name">{{ item.name }}</div>
        <el-icon
          title="编辑"
          style="margin: 0 10px"
          class="pointer"
          @click.stop="editHandle(item, i, idx)"
        >
          <Edit />
        </el-icon>
        <el-tag @click.stop="deleteItem(idx, index, element)">x</el-tag>
      </div>
      <!-- </div> -->
      <el-button v-if="level === 1" type="primary" @click="addNode()">添加</el-button>
    </div>

    <div :key="i" v-for="(item, i) in list">
      <node
        :name="item.name"
        v-if="selectItem === item"
        :level="parseInt(level) + 1"
        :list="item.children"
      />
    </div>
    <el-dialog v-model="dialogVisible" title="编辑" width="30%">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        label-width="80px"
      >
        <el-form-item label="标签名" prop="name" required>
          <el-input v-model="ruleForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="年龄" prop="age" required>
          <el-input v-model.number="ruleForm.age" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Edit } from "@element-plus/icons-vue";
import $ from "jquery";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Node",
  order: 1,
  setup: (props, { emit }) => {

  },
  emits: ['exportNodes'],
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      }
    },
    level: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ""
    },
  },
  components: {
    Edit,
  },
  data() {
    return {
      ruleForm: {
        name: "",
        age: "",
        add: false,
      },
      selectItem: null,
      dragItem: null,
      dialogVisible: false,
    };
  },
  methods: {
    // 编辑
    editHandle(node, parentIdx, idx) {
      this.ruleForm = { ...node };
      this.item = node;
      this.dialogVisible = true;
    },
    deleteItem(item, index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.list.splice(index, 1);
    },
    clickItem(item) {
      this.selectItem = item;
    },
    addNode() {
      this.ruleForm = { name: "", add: true };
      this.dialogVisible = true;
    },
    confirmEdit() {
      if (!this.ruleForm.add) {
        Object.assign(this.item, this.ruleForm);
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        this.list.push(this.ruleForm);
      }

      this.dialogVisible = false;
    },
    // 在id为node下添加一个新的节点
    addNewNode(id, node) {
      for (let i = 0; i < this.list.length; i++) {
        const item = this.findNodeByID(this.list[i]);
        if (item) {
          if (item.parent) {
            item.parent.chlldren.push(item);
          } else {
            // eslint-disable-next-line vue/no-mutating-props
            this.list.push(item);
          }
          break;
        }
      }
    },
    findNodeByID(id, node) {
      if (node.id === id) {
        return node;
      }
      for (let i = 0; i < node.chlldren.length; i++) {
        const item = node.chlldren[i];
        item.parent = node;
      }
      const n = node.chlldren.find((item) => item.id === id);
      if (n) {
        return n;
      }
      for (let i = 0; i < node.chlldren.length; i++) {
        const item = this.findNodeByID(node.chlldren[i]);
        if (item) {
          return item;
        }
      }
    },
    drag(e, item, i) {
      this.dragItem = item;
      this.list.forEach((item, i) => {
        if (!item.dragenter || item === this.dragItem) {
          return;
        }
        const ele = $("#" + this.level + "_" + i);
        const left = ele.offset().left;
        const ox = e.clientX - left;

        const width = ele.width() + 40;
        const p = ox / width;
        // console.log("ox", p, e.clientX, left, width);
        let dragtype;
        if (p < 0.3) {
          dragtype = 1;
          ele.removeClass("after-insert");
          ele.addClass("before-insert");
        } else if (p > 0.7) {
          dragtype = 2;
          ele.removeClass("before-insert");
          ele.addClass("after-insert");
        } else {
          ele.removeClass("before-insert");
          ele.removeClass("after-insert");
          dragtype = 3;
        }
        if (item.dragtype !== dragtype) {
          item.dragtype = dragtype;
        }
      });
    },
    drop(item, i) {
      console.log("drop====", item);
      if (item === this.dragItem) {
        return;
      }
      if (item.dragtype === 1) {
        // 前插入
        // eslint-disable-next-line vue/no-mutating-props
        this.list.splice(this.list.indexOf(this.dragItem), 1);
        console.log("list", this.list, this.list.indexOf(this.dragItem));
        // eslint-disable-next-line vue/no-mutating-props
        this.list.splice(this.list.indexOf(item), 0, this.dragItem);
      } else if (item.dragtype === 2) {
        // 后插入

        // eslint-disable-next-line vue/no-mutating-props
        this.list.splice(this.list.indexOf(this.dragItem), 1);

        const index = this.list.indexOf(item) + 1;

        console.log("index", index);
        if (index >= this.list.length) {
          // eslint-disable-next-line vue/no-mutating-props
          this.list.push(this.dragItem);
        } else {
          // eslint-disable-next-line vue/no-mutating-props
          this.list.splice(this.list.indexOf(item) + 1, 0, this.dragItem);
        }
      } else if (item.dragtype === 3) {
        // 合并
        item.children = item.children || [];
        if (item.children.length === 0) {
          const group = {
            name: "group",
            children: [item, this.dragItem],
          };
          // eslint-disable-next-line vue/no-mutating-props
          this.list.splice(i, 1, group);
        } else {
          item.children.push(this.dragItem);

          console.log("this.dragItem", this.list.indexOf(this.dragItem));
        }

        // eslint-disable-next-line vue/no-mutating-props
        this.list.splice(this.list.indexOf(this.dragItem), 1);
      }
      item.dragenter = false;
      this.dragItem.dragenter = false;
      item.dragtype = 0;
      this.dragItem.dragtype = 0;
      this.list.forEach((item, i) => {
        const ele = $("#" + this.level + "_" + i);
        ele.removeClass("before-insert");
        ele.removeClass("after-insert");
      });
    },
    dragenter(e, item, i) {
      item.dragenter = true;
      e.preventDefault();
    },
    dragleave(item, i) {
      item.dragtype = 0;
      item.dragenter = false;
      const ele = $("#" + this.level + "_" + i);
      ele.removeClass("before-insert");
      ele.removeClass("after-insert");
      // console.log("odragleavex", item);
    },
  },
});
</script>

<style lang="scss" scoped>
.node {
  color: #fff;
  background-color: #000;
  padding: 10px 0px;

  .node-content {
    display: flex;
    align-items: center;
  }

  .title {
    padding: 10px;
  }

  .node-item {
    box-sizing: border-box;
    margin-right: 10px;
    display: flex;
    align-items: center;
    position: relative;
    border: 1px solid #fff;
    padding: 5px 20px;
    border-radius: 5px;
    position: relative;
    // .node-item-border {
    //   display: flex;
    //   align-items: center;
    //   border: 1px solid #fff;
    //   padding: 5px 20px;
    //   border-radius: 5px;
    // }
    // &.before-insert {
    //   padding-left: 50px;
    // }
    // &.after-insert {
    //   padding-right: 50px;
    // }
    &.before-insert::after {
      content: "";
      position: absolute;
      left: 0px;
      top: 0px;
      bottom: 0px;
      width: 30%;
      background-color: rgba(255, 255, 0, 0.8);
    }

    &.after-insert::after {
      content: "";
      position: absolute;
      right: 0px;
      top: 0px;
      bottom: 0px;
      width: 30%;
      background-color: rgba(255, 255, 0, 0.8);
    }
  }
}
</style>
