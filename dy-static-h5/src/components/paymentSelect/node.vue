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
          <div class="node-txt-img"><img :src="imgURL + item.nodeIcon" /></div>
          <div class="overflow">{{ item.nodeName }}</div>
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
import { useLocalStorage } from "@vueuse/core";
import { defineComponent, reactive } from "vue";

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/payment/";
console.log(process.env.IMAGE_CDN);
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
      imgURL
    };
  },
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
  grid-gap: 20px;
  // flex-wrap: wrap;
  // justify-content: space-evenly;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 4px;
  align-items: flex-start;

  .payment-method-item {
    text-align: center;
    border-radius: 6px;
    color: #ffffff;
    cursor: pointer;

    img {
      max-width: 60px;
      margin-bottom: 10px;
      width: 100%;
      height: auto;
    }

    &.active {
      .node-txt-img {
        border-width: 2px;
        border-style: solid;
        border-color: #0089ed !important;

        &:before {
          display: block;
          content: "";
          position: absolute;
          top: 0px;
          left: 0px;
          background-color: #0089ed;
          height: 15px;
          width: 15px;
          z-index: 3;
          border-radius: 3px;
          background-image: url("../../assets/images/account/CheckBox.svg");
          background-size: 100%;
          background-position: center center;
        }

        img {
          // border-color: $node-color;
        }
      }

      .overflow {
        color: #0089ed;
        font-weight: 600;
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
      // margin: 0 -30px;
      background: none;

      .account-title {
        font-size: 14px;
        display: block;
        font-weight: 600;
        margin-bottom: 12px;
      }
    }
  }

  .node-content {
    column-gap: 10px;
    row-gap: 10px;

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
        color: #000;
      }

      .node-txt-img {
        background-color: #f7f7f7;
        display: flex;
        align-items: center;
        justify-content: center;
        //box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
        width: 60px;
        height: 60px;
        margin-bottom: 5px;
        //border: 1px solid #c2c2c2;
        border-radius: 4px;

        img {
          background-color: transparent;
          margin-bottom: 0;
          padding: 5px;
          display: block;
          width: 100%;
          height: auto;
        }
      }

      .overflow {
        font-size: 0.9em;
        white-space: nowrap;
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
      right: 50%;
      transform: translate(50%, 0);
      top: -10px;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: top center;
      width: 100%;
      max-width: 40px;

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

@media (max-width: 420px) {
  .node-txt-img {
    width: 54px !important;
    height: 54px !important;
  }
}

@media (max-width: 355px) {
  .payment-method-wrapper {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
