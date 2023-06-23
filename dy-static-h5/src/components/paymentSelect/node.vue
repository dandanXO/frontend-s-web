<template>
  <div class="node" v-if="list && list.length !== 0">
    <div v-if="level === 1"/>
    <!-- <div class="title" v-else>{{ name }}</div> -->
    <div class="account-title-container" v-else>
      <span class="account-title">{{ name }}</span>
    </div>
    <div class="node-content payment-method-wrapper">
      <div
        class="node-item payment-method-item"
        :id="level + '_' + i"
        @click="clickItem(item)"
        :class="[
          item.children ? 'node-group' : '',
          selectItem === item ? 'active' : '',
        ]"
        :key="i"
        v-for="(item, i) in list"
      >
        <div class="node-text">
          <img :src="imgURL + item.nodeIcon"/>
          <div class="overflow">{{ item.nodeName }}</div>
          <div
            class="promo"
            :style="
              item.promoStyle + 'background-image: url(' + imgURL + 'label/' + item.promotionIcon + ')'
            "
          >
            <span class="val">{{ item.promoValue }}</span>
          </div>
          <div class="payment-method-wrapper">
            <div
              class="payment-method-item"
              v-for="pm in payMethods"
              :key="pm.id"
              :class="{ active: pm.nodeName === activeMethod }"
            >
              <img :src="imgURL + pm.nodeIcon"/>
              <div>{{ pm.nodeName }}</div>
            </div>
          </div>
        </div>
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
    <div :key="i + nodeKey" v-for="(item, i) in list">
      <node
        @click="clickChildItem(item)"
        :name="item.nodeName"
        :class="[
          item.children ? 'node-group' : '',
          selectItem === item ? 'active' : '',
        ]"
        v-if="selectItem === item"
        :level="parseInt(level) + 1"
        :list="item.children"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>

<script>
import {defineComponent, reactive} from "vue";

const imgURL = process.env.IMAGE_CDN + '/payment/'
export default defineComponent({
  name: "NodeComp",
  order: 1,
  // setup: (props, { emit }) => {},
  emits: ["clicked"],
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
    level: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      ruleForm: {
        name: "",
        icon: "",
        add: false,
      },
      selectItem: null,
      dialogVisible: false,
      payMethods: reactive([]),
      nodeKey: 0,
      imgURL
    };
  },
  // methods: {
  //   clickItem(item) {
  //     this.list.forEach((element) => {
  //       element.hasActive = false;
  //     });
  //     if (item) {
  //       item.hasActive = true;
  //       this.selectItem = item;
  //       this.$emit("clicked", this.selectItem);
  //       if (item.group) {
  //         this.clickChildItem(item.children[0]);
  //       }
  //     }
  //   },
  //   clickChildItem(item) {
  //     this.list.forEach((element) => {
  //       element.hasActive = false;
  //     });
  //     item.hasActive = true;
  //     this.selectedItem = item;
  //     this.$emit("clicked", this.selectedItem);
  //   },
  // },
  updated() {
    this.$nextTick().then(() => {
      if (!this.selectItem) {
        // Add the component back in
        this.firstTime(this.list[0]);
      }
    });
  },

  methods: {
    firstTime(item) {
      if (item) {
        item.hasActive = true
        this.selectItem = item;
        this.$emit("clicked", this.selectItem);
        if (item.group) {
          this.$emit("clicked", item.children[0]);
        } else {
          this.$emit("clicked", item);
        }
      }
    },
    clickItem(item) {
      this.list.forEach((element) => {
        if (!element.hasActive && element.group) {
          element.children.forEach((e) => {
            e.hasActive = false
          })
        }
        ;
        element.hasActive = false;
      });
      this.list.forEach((element) => {
        element.hasActive = false;
      });
      if (item) {
        item.hasActive = true
        this.selectItem = item;
        if (item.group) {
          let activeChild = item.children.find((child) => child.hasActive === true)
          if (activeChild) {
            this.$emit("clicked", activeChild);
          } else {
            this.$emit("clicked", item.children[0]);
          }
        } else {
          this.$emit("clicked", item);
        }
      }
    },
    clickChildItem(item) {
      this.list.forEach((element) => {
        element.hasActive = false;
      });
      item.hasActive = true;
      this.selectedItem = item
      this.$emit("clicked", this.selectedItem);
    },
  },
  mounted() {
    // this.clickItem(this.list[0]);
    this.$nextTick(() => {
      this.firstTime(this.list[0]);
    })
  }
});
</script>
<style lang="scss" scoped>
$group-color: #76c034;
// $node-color: #dd4645;
$node-color: #4ab6fd;
.title {
  color: $group-color;
  margin: 10px auto;
  position: relative;
  margin-left: 18px;
  margin-bottom: 10px;
}

.title::before,
.title::after {
  content: "";
  position: absolute;
  top: 8px;
  width: 6px;
  height: 6px;
  background-image: linear-gradient(0deg, #04a509 0%, $group-color 100%),
  linear-gradient(#ffffff, #ffffff);
}

.title::before {
  top: 8px;
  left: -16px;
}

.title::after {
  top: 15px;
  left: -10px;
}

.payment-method-wrapper {
  // display: grid;
  // grid-template-columns: repeat(auto-fill, 200px);
  // grid-gap: 20px;
  // margin-top: 10px;
  display: flex;
  grid-gap: 15px;
  flex-wrap: wrap;

  .payment-method-item {
    text-align: center;
    border-radius: 6px;
    // border: solid 1px #484460;
    color: #ffffff;
    cursor: pointer;
    // padding: 20px 35px;
    img {
      border: 1px solid;
      padding: 5px 15px;
      border-radius: 3px;
      max-width: 75px;
      margin-bottom: 10px;
    }

    &:hover {
      // border-bottom: 3px solid rgba(255, 255, 255, .4);
    }

    &.active {
      // background: rgba(255,255,255, .2);
      img {
        border-color: $node-color;
      }
    }

    // &.node-group {
    //   color: $group-color;
    //   &.active{
    //     border-color: $group-color;
    //   }
    // }
  }
}

.container {
  margin: -20px;
}

.container > .node:first-of-type {
  margin-top: 0;
}

.container > .node:first-of-type {
  padding: 500px;
}

.node:not(.node) {
  border-bottom: 1px solid #484460;
  // .node  {
  //   border-bottom: 1px solid #484460;
  //   padding: 0 25px;
  //   margin: 0 -25px;
}

.node {
  .node {
    margin: 0 -30px;
    padding: 0 30px;

    .account-title-container {
      margin: 0 -30px;
      background: none;
      // border-top: 1px solid #484460;
      // font-weight: bold;
    }

    &.node-group {
      // display: flex;
      // justify-content: flex-start;
      align-items: center;
      gap: 10px;
      margin: 10px 0px;
      padding: 0 0px;
      flex-wrap: wrap;

      .account-title-container {
        margin: 0;
      }

      .payment-method-wrapper {
        gap: 5px;
      }

      .payment-method-item {
        padding: 5px;
        border: 1px solid transparent;

        &.active {
          border: 1px solid #33bcd4;
        }
      }

      .node-text {
        display: flex;
        gap: 5px;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        & > div {
          font-size: 12px;
          color: #000000;
        }

        img {
          width: 15px;
          border: 0;
          background-color: #2a313e;
          // max-width: 1.5rem;
          padding: 0px;
          margin-bottom: 0;
        }
      }
    }
  }

  .node-content {
    gap: 0;

    .payment-method-item {
      text-align: center;
      padding: 10px 8px;
      cursor: pointer;
      // background: #2b2b4b;
      // box-shadow: 6px 6px #161b23;

      &:hover {
      }

      &.active {
        // background-color: #1c1c32;
        // border-radius: 6px;
        // border: solid 1px #1c1c32;
        // box-shadow: none;
        // filter: drop-shadow(0px 0px 3px #ffffff);
      }
    }

    .node-item {
      display: flex;
      justify-content: center;
      min-width: 2rem;

      .payment-method-wrapper {
        display: none;
      }
    }

    .node-text {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      flex-direction: column;

      & > div {
        font-size: 12px;
        color: #a0bcd6;
      }

      img {
        background-color: #fff;
        margin-bottom: 0;
        width: 100%;
        height: auto;
      }
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

  .node-item {
    position: relative;

    .promo {
      position: absolute;
      right: 0;
      top: 0;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: top center;
      // top: -5px;
      // right: 0;
      // background: #dd4645;
      // padding: 5px;
      // color: #000000;
      // font-size: 12px;
      // line-height: 10px;
      // top: -8px;
      // right: -1px;
      // background: #dd4645;
      // padding: 5px;
      // color: #000000;
      // font-size: 12px;
      // line-height: 10px;
      // border-radius: 0 10px;
      ::after {
        position: relative;
      }


    }
  }

}

@media (max-width: 768px) {
  .node {
    .node {
      .account-title-container {
        margin: 0 -10px;
      }
    }
  }
}
</style>
