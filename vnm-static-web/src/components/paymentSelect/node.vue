<template>
  <div class="node" v-if="list && list.length !== 0">
    <div style="margin-bottom: 5px;" class="" v-if="level === 1"><span class="methodtitle">{{$t('deposit.paymentMethod')}}</span></div>
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
          <div>{{ item.nodeName }}</div>
          <div class="recommended"></div>
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
        @click="clickItem(item)"
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
import { useLocalStorage } from "@vueuse/core";

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
      imgURL: useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + "/payment/",
      nodeKey: 0
    };
  },
  methods: {
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
    this.$nextTick(() => {
      this.firstTime(this.list[0]);
    });
    this.firstTime(this.list[0]);
  }
});
</script>
<style lang="scss" scoped>
$group-color: #76c034;
// $node-color: #dd4645;
$node-color: #4873f1;
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
  // display: grid;
  // grid-template-columns: repeat(auto-fill, 200px);
  // grid-gap: 20px;
  // margin-top: 10px;
  display: flex;
  column-gap: 20px;
  // margin-top: 20px;
  flex-wrap: wrap;
  // padding-bottom: 20px;

  .payment-method-item {
    text-align: center;
    border-radius: 6px;
    // border: solid 1px #484460;
    color: #ffffff;
    cursor: pointer;
    // padding: 20px 35px;
    img {
      border: 2px solid #dddddd;
      padding: 5px 15px;
      border-radius: 3px;
    }
    &:hover {
      // border-bottom: 3px solid rgba(255, 255, 255, .4);
    }
    &.active {
      // background: rgba(255,255,255, .2);
      .node-txt-img {
        border-color: #4873f1 !important;
      }
      img {
        // border-color: $node-color;
        // position: relative;
      }

      &:before {
        display: block;
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        height: 28px;
        width: 28px;
        z-index: 3;
        background-image: url("../../assets/svg/checkmark.svg");
        background-size: 100%;
        background-position: center center;
      }
    }

    // &.node-group {
    //   color: $group-color;
    //   &.active{
    //     border-color: $group-color;
    //   }
    // }

    img {
      // max-width: 50px;
      // max-width: 73px;
      // margin-bottom: 10px;
      max-width: 50px;
      margin-bottom: 10px;
      margin-top: 2px;
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
  // .node  {
  //   border-bottom: 1px solid #484460;
  //   padding: 0 25px;
  //   margin: 0 -25px;
}
.node {
  .methodtitle {

    // font-family: Poppins;
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
  text-align: left;
  }

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
      //   display: flex;
      //   justify-content: flex-start;
      //   align-items:  center;
      //   gap: 10px;
      // flex-wrap: wrap;
      display: block;
      .account-title-container {
        margin: 0 15px 0 10px;
        font-weight: bold;
        display: block;
        // float: left;
        vertical-align: bottom;
        margin-top: 25px;
        // min-width: 100px;
        text-align: left;
      }
      .node-text {
        gap: 5px;
        & > div {
          font-size: 12px;
          color: #424f72;
        }
        img {
          background-color: #f7f7f7;
          // box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
          // max-width: 1.5rem;
          margin-bottom: 0;
        }
      }
      .promo {
        img {
          background-color: transparent;
          box-shadow: none;
          padding: 0;
          border: 0;
        }
      }
    }
  }
  .node-content {
    // gap: 15px;
    .payment-method-item {
      text-align: center;
      padding: 5px;
      cursor: pointer;
      // background: #2b2b4b;
      // box-shadow: 6px 6px #161b23;

      &:hover {
      }
      &.active {
        // background-color: #1c1c32;
        // border-radius: 6px;
        border: solid 2px #468cff;
        box-shadow: unset;
        // box-shadow: none;
        // filter: drop-shadow(0px 0px 3px #ffffff);
      }
    }
    .node-item {
      display: flex;
      justify-content: center;
      min-width: 6rem;
      background-color: #f7f8fb;
      border-radius: 15px;
      box-shadow: 0px 0px 8px 0px #a9c9ea inset;
      margin-bottom: 30px;
      border: 2px solid;
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
        color: #424f72;
        font-weight: 700;
      }

      .node-txt-img {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.8rem;
        height: 3rem;
    margin-top: 10px;
        img {
          max-width: 3rem;
          width: 100%;
          height: auto;
          // max-width: 1.5rem;
          margin-bottom: 6px;
          border: 0;
          padding: 0;
        }
      }
    }
  }
  // .node-content {
  //   display: flex;
  //   align-items: stretch;
  //   flex-wrap: wrap;
  //   padding: 5px 0;
  //   justify-content: flex-start;
  //   position: relative;
  //   width: 100%;
  //   margin: 20px auto;
  //   background: #23263c;
  // }
  // .node {
  //   .node-content {
  //     .payment-method-item {
  //       text-align: center;
  //       padding: 10px 8px;
  //       cursor: pointer;
  //       background-color: #161b23;
  //       border-radius: 6px;
  //       border: solid 1px #484460;
  //       &:hover {
  //       }
  //       &.active {
  //         background: #161b23;
  //         border-color: $node-color;
  //       }
  //     }
  //     .node-item {
  //       display: flex;
  //       justify-content: center;
  //       width: 10rem;
  //       .payment-method-wrapper {
  //         display: none;
  //       }
  //     }
  //     .node-text {
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       img {
  //         max-width: 1.5rem;
  //         margin-bottom: 0;
  //         margin-right: 20px;
  //       }
  //     }
  //   }
  // }
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
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: top center;
      left: 0;
      right: 0;
      top: 90%;
      z-index: 4;
      img {
        padding: 0;
        border: 0;
        background-color: transparent;
        // max-width: 42px;
        // width: 42px;
      }
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
      // .val{
      //   position: absolute;
      //   z-index: 999999;
      //   right: 1px;
      //   top: 3px;
      //   font-size: 8px;
      //   color: #FFFFFF;
      //   display: block;
      //   background: #cd1e1e;
      // }
    }
  }
  // .node-item {
  //   &.selected{
  //     border-bottom: 5px solid $node-color;
  //   }
  // }
  // .node-group {
  //   color: $group-color;
  //   .el-icon-edit{
  //     color: $group-color;
  //   }
  //   .el-icon-remove{
  //     color: $group-color;
  //   }
  //   &.selected{
  //     border-bottom: 2px solid $group-color;
  //   }
  // }
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
