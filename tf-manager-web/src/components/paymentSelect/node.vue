<template>
  <div class="node" v-if="list && list.length !== 0">
    <div class="title root" v-if="level === 1" />
    <div class="title" v-else>{{ name }}</div>
    <el-button
      :key="level"
      class="add"
      icon="el-icon-plus"
      size="mini"
      type="primary"
      @click="addto(list, level, name)"
    />
    <div class="node-content">
      <div
        class="node-item"
        :id="level + '_' + i"
        draggable="true"
        @click="clickItem(item)"
        :class="[
          item.children.length !== 0 ? 'node-group' : '',
          item.dragtype === 3
            ? 'dragging'
            : selectItem === item
              ? 'selected'
              : '',
        ]"
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
        <el-row :gutter="10" justify="space-between" align="middle">
          <el-col :span="6" style="position: relative">
            <!-- eslint-disable -->
            <img
              v-if="item.icon === 'OFFLINE' || item.icon === 'test'"
              :src="paymethodicon + '/000/fff.png&text=payment'"
            />
            <img v-else :src="paymethodicon + '/payment/' + item.icon" />
          </el-col>
          <el-col :span="12">
            <div class="node-text">
              <div class="group-node" v-if="item.children.length !== 0">
                <div>{{ item.name }}</div>
              </div>
              <div class="payment-node" v-else>
                <div>{{ $t('fields.name') }}: {{ item.name }}</div>
                <div>{{ $t('fields.payment') }}: {{ item.paymentName }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6" class="icons">
            <i
              class="el-icon-edit"
              size="mini"
              type="success"
              @click.stop="editHandle(item, i, idx)"
            />
            <i
              class="el-icon-remove"
              size="mini"
              type="danger"
              @click.stop="deleteItem(item, i, idx)"
            />
          </el-col>
        </el-row>
        <!-- <el-icon
          title="编辑"
          style="margin: 0 10px"
          class="pointer"
          @click.stop="editHandle(item, i, idx)"
        >
        <Edit />
        </el-icon>
        <el-tag @click.stop="deleteItem(idx, index, element)">x</el-tag>-->
      </div>
      <!-- </div> -->
      <!--      <el-button icon="el-icon-refresh" size="mini" v-if="level === 1" type="primary" @click="addNode()">submit</el-button>-->
    </div>
    <div :key="i" v-for="(item, i) in list">
      <node
        :name="item.name"
        v-if="selectItem === item"
        :level="parseInt(level) + 1"
        :list="item.children"
        v-bind="$attrs"
      />
    </div>
    <el-dialog v-model="dialogVisible" :title="$t('fields.edit')" width="40%">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        label-width="100px"
      >
        <el-form-item :label="'Copy From'" prop="name">
          <el-select
            v-model="noteId"
            size="small"
            class="filter-item"
            style="width: 100%"
            @change="copyNoteName"
          >
            <el-option
              v-for="item in snoteList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('fields.name')" prop="name" required>
          <el-input v-model="ruleForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('fields.icon')" prop="icon" required>
          <el-row :gutter="24">
            <el-col :span="18">
              <el-input
                :readonly="true"
                v-model.number="ruleForm.icon"
                autocomplete="off"
              />
            </el-col>
            <el-col :span="6">
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="input"
                style="display: none"
                accept="image/*"
                @change="attachPhoto($event, 'payment')"
              />
              <el-button
                style="display: block"
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.input.click()"
              >
                {{ $t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
          <!-- <el-input v-model.number="ruleForm.icon" autocomplete="off" /> -->
        </el-form-item>
        <div class="el-dialog__header">
          <div class="el-dialog__title">{{ $t('fields.promo') }}</div>
        </div>
        <el-form-item :label="$t('fields.icon')" prop="promoIcon">
          <el-row :gutter="24">
            <el-col :span="18">
              <el-input
                :readonly="true"
                v-model="ruleForm.promoIcon"
                autocomplete="off"
              />
            </el-col>
            <el-col :span="6">
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="input1"
                style="display: none"
                accept="image/*"
                @change="attachPhoto($event, 'paymentLabel')"
              />
              <el-button
                style="display: block"
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.input1.click()"
              >
                {{ $t('fields.upload') }}
              </el-button>
            </el-col>
          </el-row>
          <!-- <el-input v-model="ruleForm.promoIcon" autocomplete="off" /> -->
        </el-form-item>
        <el-form-item :label="$t('fields.promoStyle')" prop="promoStyle">
          <el-input v-model.number="ruleForm.promoStyle" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ $t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="confirmEdit">
            {{ $t('fields.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import $ from 'jquery'
import { reactive, defineComponent } from 'vue'
import { uploadImage } from '../../api/image'
import bus from '../../utils/bus'
import i18n from '../../i18n/index'
import { getSystemPaymentShowBySiteIdGroupByNodeName } from '../../api/payment-display'

export default defineComponent({
  name: 'Node',
  order: 1,
  setup: (props, { emit }) => {},
  emits: ['exportNodes', 'addNodesToSelectedGroup'],
  props: {
    list: {
      type: Array,
      default: function() {
        return []
      },
    },
    level: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      paymethodicon: process.env.VUE_APP_IMAGE,
      ruleForm: {
        name: '',
        icon: '',
        promoIcon: '',
        promoStyle: '',
        siteId: '',
        level: '',
        way: '',
        add: false,
      },
      snoteList: reactive({
        list: [],
      }),
      noteId: null,
      selectItem: null,
      dragItem: null,
      dialogVisible: false,
    }
  },
  methods: {
    // 编辑
    editHandle(node, parentIdx, idx) {
      this.ruleForm = { ...node }
      this.loadNote(this.ruleForm.siteId)
      this.item = node
      this.dialogVisible = true
    },
    deleteItem(item, index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.list.splice(index, 1)
    },
    clickItem(item) {
      this.selectItem = item
    },
    addNode() {
      this.ruleForm = { name: '', add: true }
      this.dialogVisible = true
    },
    confirmEdit() {
      if (!this.ruleForm.add) {
        Object.assign(this.item, this.ruleForm)
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        this.list.push(this.ruleForm)
      }
      console.log(this.list)

      this.dialogVisible = false
      this.$emit('exportNodes', this.list)
    },
    addto(list, level, name) {
      // this.$emit('addNodesToSelectedGroup');
      bus.emit('addNodesToSelectedGroup', { list, level, name })
    },
    // 在id为node下添加一个新的节点
    addNewNode(id, node) {
      for (let i = 0; i < this.list.length; i++) {
        const item = this.findNodeByID(this.list[i])
        if (item) {
          if (item.parent) {
            item.parent.children.push(node)
          } else {
            // eslint-disable-next-line vue/no-mutating-props
            this.list.push(node)
          }
          break
        }
      }
    },
    findNodeByID(id, node) {
      if (node.id === id) {
        return node
      }
      for (let i = 0; i < node.children.length; i++) {
        const item = node.children[i]
        item.parent = node
      }
      const n = node.children.find(item => item.id === id)
      if (n) {
        return n
      }
      for (let i = 0; i < node.children.length; i++) {
        const item = this.findNodeByID(node.children[i])
        if (item) {
          return item
        }
      }
    },
    drag(e, item, i) {
      this.dragItem = item
      this.list.forEach((item, i) => {
        if (!item.dragenter || item === this.dragItem) {
          return
        }
        const ele = $('#' + this.level + '_' + i)
        const left = ele.offset().left
        const ox = e.clientX - left

        const width = ele.width() + 40
        const p = ox / width
        // console.log("ox", p, e.clientX, left, width);
        let dragtype
        if (p < 0.3) {
          dragtype = 1
          ele.removeClass('after-insert')
          ele.addClass('before-insert')
        } else if (p > 0.7) {
          dragtype = 2
          ele.removeClass('before-insert')
          ele.addClass('after-insert')
        } else {
          ele.removeClass('before-insert')
          ele.removeClass('after-insert')
          dragtype = 3
        }
        if (item.dragtype !== dragtype) {
          item.dragtype = dragtype
        }
      })
    },
    drop(item, i) {
      console.log('drop====', item)
      if (item === this.dragItem) {
        return
      }
      if (item.dragtype === 1) {
        // 前插入
        // eslint-disable-next-line vue/no-mutating-props
        this.list.splice(this.list.indexOf(this.dragItem), 1)
        console.log('list', this.list, this.list.indexOf(this.dragItem))
        // eslint-disable-next-line vue/no-mutating-props
        this.list.splice(this.list.indexOf(item), 0, this.dragItem)
      } else if (item.dragtype === 2) {
        // 后插入

        // eslint-disable-next-line vue/no-mutating-props
        this.list.splice(this.list.indexOf(this.dragItem), 1)

        const index = this.list.indexOf(item) + 1

        console.log('index', index)
        if (index >= this.list.length) {
          // eslint-disable-next-line vue/no-mutating-props
          this.list.push(this.dragItem)
        } else {
          // eslint-disable-next-line vue/no-mutating-props
          this.list.splice(this.list.indexOf(item) + 1, 0, this.dragItem)
        }
      } else if (item.dragtype === 3) {
        // 合并
        item.children = item.children || []
        if (item.children.length === 0) {
          const group = {
            name: 'group' + this.level + '-' + this.list.indexOf(item),
            childId: -1,
            children: [item, this.dragItem],
            icon: 'default',
          }
          // eslint-disable-next-line vue/no-mutating-props
          this.list.splice(i, 1, group)
        } else {
          item.children.push(this.dragItem)

          console.log('this.dragItem', this.list.indexOf(this.dragItem))
        }

        // eslint-disable-next-line vue/no-mutating-props
        this.list.splice(this.list.indexOf(this.dragItem), 1)
      }
      item.dragenter = false
      this.dragItem.dragenter = false
      item.dragtype = 0
      this.dragItem.dragtype = 0
      this.list.forEach((item, i) => {
        const ele = $('#' + this.level + '_' + i)
        ele.removeClass('before-insert')
        ele.removeClass('after-insert')
      })
    },
    dragenter(e, item, i) {
      item.dragenter = true
      e.preventDefault()
    },
    dragleave(item, i) {
      item.dragtype = 0
      item.dragenter = false
      const ele = $('#' + this.level + '_' + i)
      ele.removeClass('before-insert')
      ele.removeClass('after-insert')
      // console.log("odragleavex", item);
    },

    async attachPhoto(event, type) {
      console.log(type)
      const files = event.target.files[0]
      const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
      const dirPayment = 'payment'
      const dirPaymentLabel = 'payment/label'

      if (!allowFileType.find(ftype => ftype.includes(files.type))) {
        ElMessage({
          message: i18n.global.t('message.invalidFileType'),
          type: 'error',
        })
      } else {
        var formData = new FormData()
        formData.append('files', files)
        if (type === 'payment') {
          formData.append('dir', dirPayment)
        } else {
          formData.append('dir', dirPaymentLabel)
        }
        formData.append('overwrite', false)
        const data = await uploadImage(formData)
        if (data.code === 0) {
          if (type === 'payment') {
            this.ruleForm.icon = data.data
          } else {
            this.ruleForm.promoIcon = data.data
          }
        } else {
          ElMessage({
            message: i18n.global.t('message.failedToUploadImage'),
            type: 'error',
          })
        }
      }
    },
    async loadNote() {
      const { data: note } = await getSystemPaymentShowBySiteIdGroupByNodeName({
        financialLevel: this.ruleForm.level,
        siteId: this.ruleForm.siteId,
        way: this.ruleForm.way,
      })
      this.snoteList.list = note
    },
    copyNoteName() {
      const str = this.snoteList.list.find(d => d.id === this.noteId)
      this.ruleForm.name = str.name
      this.ruleForm.icon = str.icon
      this.ruleForm.promoIcon = str.promoIcon
      this.ruleForm.promoStyle = str.promoStyle
    },
  },
})
</script>
<style lang="scss" scoped>
$group-color: #ee734f;
$node-color: #309799;
// .container > .node {
//   .el-button--mini.add{
//     margin-top: 0;
//   }
// }
// .container > div > .node {
//   .el-button--mini.add{
//     margin-top: 20px;
//   }
// }
.container {
  margin: -20px;
}

.container > .node:first-of-type {
  margin-top: 0;
}

.node {
  margin-top: 20px;
  // color: #fff;
  // background-color: #000;
  // padding: 10px 0px;
  .el-button--mini.add {
    float: right;
  }

  .node-content {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    padding: 5px 0;
    justify-content: flex-start;
    // border-bottom: 1px solid #EEEEEE;
    // box-shadow: 15px 20px 64px -57px;
    box-shadow: 1px 10px 13px -14px rgba(0, 0, 0, 0.24);
    position: relative;
    width: 100%;
  }

  .title {
    min-width: 200px;
    margin: 20px 20px 0;
    float: left;
    font-size: 25px;
    font-weight: bold;

    &.root {
      display: none;
    }
  }

  .icons {
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }

  .el-icon-edit,
  .el-icon-remove {
    padding: 5px;
  }

  .el-icon-edit {
    color: $node-color;
  }

  .el-icon-remove {
    color: $node-color;
  }

  .node-item,
  .node-group {
    box-sizing: border-box;
    position: relative;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    position: relative;
    z-index: 2;
    display: flex;
    align-content: flex-start;
    background: #e9f4f5;
    color: $node-color;

    img {
      width: 100%;
    }

    .node-text {
      font-size: 12px;
      padding: 10px 5px;
      max-width: 200px;

      .payment-node > div:first-child,
      .group-node {
        font-size: 14px;
        font-weight: bold;
        margin: 5px 0;
      }
    }

    .node-item-border {
      display: flex;
      align-items: center;
      border: 1px solid #fff;
      padding: 5px 20px;
      border-radius: 5px;
    }

    &.before-insert {
      padding-left: 50px;
    }

    &.after-insert {
      padding-right: 50px;
    }

    &.before-insert::after {
      content: '';
      position: absolute;
      left: 0px;
      top: 0px;
      bottom: 0px;
      width: 30%;
      background-color: rgba(0, 153, 255, 0.8);
    }

    &.after-insert::after {
      content: '';
      position: absolute;
      right: 0px;
      top: 0px;
      bottom: 0px;
      width: 30%;
      background-color: rgba(0, 153, 255, 0.8);
    }
  }

  .node-item {
    &.selected {
      border: 2px solid $node-color;
      background: #ade6eb;
    }

    &.dragging {
      filter: brightness(90%);
    }
  }

  .node-group {
    margin: 15px;
    color: $group-color;

    .el-icon-edit {
      color: $group-color;
    }

    .el-icon-remove {
      color: $group-color;
    }

    &.selected {
      border: none;
      background: none;
      transition: none;

      &:before,
      &:after {
        content: '';
        background: #d88200;
        border: 1px solid #ee734f;
        color: #ffffff;
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: -2;
        transition: 0.5s;
        border-radius: 5px;
      }

      &:before {
        left: -6px;
        top: -6px;
        transform: rotate(-1.5deg);
        background: #ee734f;
      }

      &:after {
        left: 0px;
        top: 0px;
        background: #ffd2c6;
      }
    }

    &:before,
    &:after {
      content: '';
      background: #fdeeea;
      color: #ffffff;
      height: 100%;
      width: 100%;
      position: absolute;
      z-index: -2;
      transition: 0.5s;
      border: 1px solid #eee;
      border-radius: 5px;
      transition: none;
    }

    &:before {
      transform: rotate(0deg);
      left: 0px;
      top: 0px;
    }

    &:after {
      transform: rotate(0deg);
      right: 0;
      top: 0px;
    }
  }

  .promo {
    position: absolute;
    right: 0;
    top: 0;

    ::after {
      position: relative;
    }

    .val {
      position: absolute;
      z-index: 999999;
      right: 1px;
      top: 3px;
      font-size: 8px;
      color: #ffffff;
      display: block;
      background: #cd1e1e;
    }
  }

  .iconPromo {
    width: 55px;
  }
}
</style>
