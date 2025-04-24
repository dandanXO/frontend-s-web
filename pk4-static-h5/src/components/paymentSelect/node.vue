<template>
  <div class="node" v-if="list && list.length !== 0">
    <div v-if="level === 1" />
    <!-- <div class="title" v-else>{{ name }}</div> -->
    <div class="account-title-container" v-else>
      <span class="account-title">{{ name }}</span>
    </div>
    <div class="node-content payment-method-wrapper">
      <div
        class="node-item payment-method-item"
        :id="level + '_' + i"
        @click="clickItem(item)"
        :class="[item.children ? 'node-group' : '', selectItem === item ? 'active' : '']"
        :style="item.group && item.children.length === 0 ? 'display:none' : ''"
        :key="i"
        v-for="(item, i) in list"
      >
        <div class="node-text">
          <div class="node-txt-img panel"><img :src="imgURL + item.nodeIcon" /></div>
          <div class="overflow txt-title">{{ item.nodeName }}</div>
          <div class="payment-range-div" v-if="level > 1 && item.depositMax === 9999999">
            {{ displayWithThousand(item.depositMin) }} - {{ $t("deposit.unlimited") }}
          </div>
          <div class="payment-range-div" v-else-if="level > 1">
            {{ displayWithThousand(item.depositMin) }} - {{ displayWithThousand(item.depositMax) }}
          </div>
          <div class="promo">
            <img v-if="item.promotionIcon" :src="`${imgURL}${item.promotionIcon}`" />
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
      <!--      <pre>{{ item }}</pre>-->
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
      default: 5
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
      gridColAmount: "grid-template-columns: repeat(5 , 1fr);"
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
    displayWithThousand(value) {
      if (value < 1000) {
        return value;
      } else {
        const newval = value / 1000;
        return newval + "k";
      }
    },
    firstTime(item) {
      if (item) {
        item.hasActive = true;
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
$node-color: #b81212;
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
  margin-bottom: 15px;
  width: 100%;
  grid-template-columns: repeat(5, 1fr);
  padding-right: 15px;
  align-items: flex-start;

  .payment-method-item {
    text-align: center;
    border-radius: 6px;
    color: #ffffff;
    cursor: pointer;
    img {
      max-width: 85px;
      margin-bottom: 5px;
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
          // border-color: $node-color;
          // border-width: 2px;
          box-shadow: unset;
          background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);


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
      gap: 0px;
      margin: 10px 0px 8px;
      padding: 0 0px;
      flex-direction: column;
      .account-title-container {
        margin: 0 0 8px;
      }
      .payment-method-wrapper {
        gap: 5px;
      }
      .payment-method-item {
        border: 1px solid transparent;
      }
      .node-text {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .promo {
          right: 2px;
        }

        & > div {
          font-size: 12px;
          color: #ffffff;
        }
        img {
          border: 0;
          padding: 0px;
          margin-bottom: 0;
        }

        .payment-range-div {
          font-size: 11px;
          line-height: 14px;
        }
      }
    }
  }

  .node-content {
    column-gap: 10px;
    row-gap: 16px;

    .payment-method-item {
      text-align: center;
      cursor: pointer;
    }

    .node-item {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 5.5rem;

      .payment-method-wrapper {
        display: none;
      }
    }

    .node-text {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      flex-direction: column;

      & > div {
        font-size: 12px;
        color: #ffffff;
      }

      .txt-title {
        // font-size: 11px !important;
        white-space: nowrap;
      }

      .node-txt-img {
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        // box-shadow: inset 0 0 8px 0 #a9c9ea;
        width: 60px;
        height: 60px;
        margin-bottom: 5px;
        border: 2px solid transparent;
        border-radius: 10px;
        padding: 4px 4px;
        // background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);

        img {
          background-color: transparent;
          margin-bottom: 0;
          padding: 0;
          display: block;
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
      right: 0px;
      top: 0px;
      transform: translate(0%, 0);
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: top center;
      //width: 100%;
      max-width: 36px;
      width: 34px;
      height: 34px;
      img {
        padding: 0;
        border: 0;
        background-color: transparent;
        max-width: 40px;
        width: 100%;
      }
      ::after {
        position: relative;
      }
    }
  }
}

.body--dark {
  .node {
    .node-content {
      .node-text > div {
        // color: $font-3-dark;
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

// @media (max-width: 375px) {
//   .node .node-content .node-text .node-txt-img {
//     width: 4.5rem;
//     height: 4.5rem;
//   }
//   .node .node-item .promo img {
//     max-width: 50px;
//     width: 50px;
//   }
//   .node .node-item .promo {
//     right: -10px;
//     top: -10px;
//   }
//   .node .node-content .node-text .node-txt-img img {
//     // padding: 5px 10px;
//   }
// }
@media (max-width: 420px) {
  .node-txt-img {
    width: 54px !important;
    height: 54px !important;
  }

  .node .node.node-group .node-text .promo {
    width: 34px;
    height: 34px;
    right: 4px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

@media (max-width: 355px) {
  .payment-method-wrapper {
    grid-template-columns: repeat(4, 1fr);
  }
}

.node-item.payment-method-item {
  pointer-events: auto;
}

.node-group {
  pointer-events: none;
}
</style>
