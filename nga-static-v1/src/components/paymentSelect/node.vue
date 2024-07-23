<template>
  <div class="node" v-if="list && list.length !== 0">
    <div v-if="level === 1" />
    <!-- <div class="title" v-else>{{ name }}</div> -->
    <div class="account-title-container" v-else>
      <span class="account-title">{{ name }}</span>
    </div>
    <div class="node-content payment-method-wrapper deposit-options" :style="gridColAmount">
      <div
        class="node-item payment-method-item deposit-option-btn"
        :id="level + '_' + i"
        @click="clickItem(item)"
        :class="[item.children ? 'node-group' : '', selectItem === item ? 'active' : '']"
        :style="item.group && item.children.length === 0 ? 'display:none' : ''"
        :key="i"
        v-for="(item, i) in list"
      >
        <div class="node-text">
          <div class="node-txt-img"><img :src="imgURL + item.nodeIcon" /></div>
          <div class="overflow">{{ item.nodeName }}</div>
          <div class="promo">
            <img v-if="item.promotionIcon" :src="`${imgURL}label/${item.promotionIcon}`" />
          </div>

          <div class="payment-method-wrapper">
            <div
              class="payment-method-item"
              v-for="pm in payMethods"
              :key="pm.id"
              :class="{ active: pm.nodeName === activeMethod }"
            >
              <img :src="imgURL + pm.nodeIcon" />
              <div>{{ pm.nodeName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :key="i + nodeKey" v-for="(item, i) in list">
      <node
        @click="clickChildItem(item)"
        :name="item.nodeName"
        :class="[item.children ? 'node-group' : '', selectItem === item ? 'active' : '']"
        v-if="selectItem === item"
        :level="parseInt(level) + 1"
        :list="item.children"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

const imgURL = process.env.IMAGE_CDN + "/payment/";
export default defineComponent({
  name: "NodeComp",
  order: 1,
  emits: ["clicked"],
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
    gridcol: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      ruleForm: {
        name: "",
        icon: "",
        add: false
      },
      selectItem: null,
      dialogVisible: false,
      payMethods: reactive([]),
      nodeKey: 0,
      imgURL,
      gridColAmount: "grid-template-columns: repeat(" + this.gridcol + ", 1fr);"
    };
  },
  computed() {},
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
        item.hasActive = true;
        this.selectItem = item;
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
            e.hasActive = false;
          });
        }
        element.hasActive = false;
      });
      this.list.forEach((element) => {
        element.hasActive = false;
      });
      if (item) {
        item.hasActive = true;
        this.selectItem = item;
        if (item.group) {
          let activeChild = item.children.find((child) => child.hasActive === true);
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
      this.selectedItem = item;
      this.$emit("clicked", this.selectedItem);
    }
  },
  mounted() {
    // this.clickItem(this.list[0]);
    this.$nextTick(() => {
      this.firstTime(this.list[0]);
    });
  }
});
</script>
<style lang="scss" scoped>
$group-color: #76c034;
// $node-color: #dd4645;
$node-color: #33bcd4;
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
  background-image: linear-gradient(0deg, #04a509 0%, $group-color 100%), linear-gradient(#ffffff, #ffffff);
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
  // display: flex;
  grid-gap: 15px;
  display: grid;
  margin-bottom: 20px;
  width: 100%;

  .payment-method-item {
    text-align: center;
    border-radius: 6px;
    color: #ffffff;
    cursor: pointer;
    img {
      max-width: 75px;
      margin-bottom: 10px;
      width: 100%;
      height: auto;
    }

    &:hover {
      // border-bottom: 3px solid rgba(255, 255, 255, .4);
    }

    &.active {
      // background: rgba(255,255,255, .2);
      .node-text {
        .node-txt-img {
          border-color: $node-color;

          // &:before {
          //   display: block;
          //   content: "";
          //   position: absolute;
          //   bottom: 23px;
          //   right: 3px;
          //   background-color: #4873f1;
          //   height: 15px;
          //   width: 15px;
          //   z-index: 3;
          //   border-radius: 3px;
          //   background-image: url("../../assets/images/account/CheckBox.svg");
          //   background-size: 100%;
          //   background-position: center center;
          // }

          img {
            // border-color: $node-color;
          }
        }
      }
    }
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
}

.node {
  .node {
    margin: 0 -30px;
    padding: 0 30px;

    .account-title-container {
      margin: 0 -30px;
      background: none;
    }

    &.node-group {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 10px;
      margin: 10px 0px;
      padding: 0 0px;
      flex-direction: column;
      .account-title-container {
        margin: 0;
      }
      .payment-method-wrapper {
        gap: 5px;
      }
      .payment-method-item {
        border: 1px solid transparent;
      }
      .node-text {
        display: flex;
        gap: 5px;
        justify-content: center;
        align-items: center;
        & > div {
          font-size: 12px;
          color: #ffffff;
        }
        img {
          //width: 15px;
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
    gap: 10px;

    .payment-method-item {
      text-align: center;
      cursor: pointer;
    }

    .node-item {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 4.5rem;

      .payment-method-wrapper {
        display: none;
      }
    }

    .node-text {
      display: flex;
      justify-content: center;
      align-items: center;
      // gap: 5px;
      flex-direction: column;

      & > div {
        font-size: 12px;
        color: #fff;
        padding-bottom: 5px;
      }

      .node-txt-img {
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4rem;
        height: 4rem;

        img {
          background-color: transparent;
          margin-bottom: 0;
          padding: 5px 10px;
          width: 100%;
          height: auto;
        }
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
      right: -5px;
      top: -5px;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: top center;
      img {
        padding: 0;
        border: 0;
        background-color: transparent;
      }
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

.deposit-options {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 16px;
  .deposit-option-btn {
    color: #cccccc;
    background-color: rgba(21, 0, 37, 0.5) !important;
    min-width: 100px;
    max-width: 160px;
    width: 100%;
    border-radius: 6px;
    border: 3px solid transparent;

    &.active {
      color: #ffe66b;
      border: 3px solid #ffe66b;
    }

    &.label-on-discount {
      position: relative;
      &:after {
        content: "";
        // background-image: url(../../assets/images/index/popout/label-discount.png);
        background-repeat: no-repeat;
        display: block;
        position: absolute;
        top: -4px;
        right: -5px;
        width: 30px;
        height: 30px;
        background-size: 100%;
      }
    }
  }
}
</style>
