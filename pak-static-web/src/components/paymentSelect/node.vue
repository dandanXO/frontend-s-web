<template>
  <div v-if="list && list.length !== 0" class="node">
    <div v-if="level === 1" class="" />
    <!-- <div class="title" v-else>{{ name }}</div> -->
    <div v-else class="account-title-container">
      <!-- <span class="account-name">{{ name }}</span> -->
    </div>
    <div class="node-content payment-method-wrapper">
      <div
        v-for="(item, i) in list"
        :id="level + '_' + i"
        :key="i"
        class="node-item payment-method-item"
        :class="[item.children ? 'node-group' : '', selectItem === item ? 'active' : '']"
        @click="clickItem(item)"
      >
        <div class="node-text">
          <img :src="imgURL + item.nodeIcon" />
          <div>{{ item.nodeName }}</div>
          <div
            class="promo"
            :style="item.promoStyle + 'background-image: url(' + imgURL + '/label/' + item.promotionIcon + ')'"
          >
            <span class="val">{{ item.promoValue }}</span>
          </div>
          <div class="payment-method-wrapper">
            <div
              v-for="pm in payMethods"
              :key="pm.id"
              class="payment-method-item"
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
    <div v-for="(item, i) in list" :key="i + nodeKey">
      <node
        v-if="selectItem === item"
        :name="item.nodeName"
        :class="[item.children ? 'node-group' : '', selectItem === item ? 'active' : '']"
        :level="parseInt(level) + 1"
        :list="item.children"
        v-bind="$attrs"
        @click="clickItem(item)"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "NodeComp",
  order: 1,
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
  // setup: (props, { emit }) => {},
  emits: ["clicked"],
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
      imgURL: process.env.VUE_APP_IMAGE_CDN + "/payment/",
      nodeKey: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.firstTime(this.list[0]);
    });
  },
  methods: {
    firstTime(item) {
      if (item) {
        item.hasActive = true;
        this.selectItem = item;
        // this.$emit("clicked", this.selectItem);
        if (item.group) {
          this.$emit("clicked", item.children[0]);
        } else {
          this.$emit("clicked", item);
        }
      }
    },
    clickItem(item) {
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
  }
});
</script>
<style lang="scss" scoped>
$group-color: #76c034;
$node-color: #dd4645;
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

.node {
  .node-content {
    .node-item {
      color: rgba(255, 255, 255, 0.3);
    }
    .payment-method-item {
      background: url(../../assets/images/finance/bankcard-green.png) no-repeat left center;
      background-size: cover;
      filter: grayscale(1);
      height: 30px;
      width: 150px;
      height: 80px;
      color: #ffffff;
      border-radius: 6px;
      justify-content: flex-start;
      align-items: flex-end;
      padding: 10px;
      .node-text {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        color: #ffffff;
        height: 100%;
        padding-top: 25px;
        img {
          width: 40px;
          position: absolute;
          top: 10px;
          right: 10px;
          background: #181818;
        }
      }
      &.active {
        // background: rgba(255,255,255,.3);
        background: url(../../assets/images/finance/bankcard-green.png) no-repeat left center;
        background-size: cover;
        // background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%),
        //   linear-gradient(237.56deg, #5cffeb -21.06%, #9a5ca9 55.65%, #2cffd9 137.61%);
        border: 1px solid #b81212;
        filter: none;
        color: #ffffff;
        position: relative;
        &:after {
          content: "";
          background: url(../../assets/images/finance/bankcard-green-check.png) no-repeat bottom right;
          background-size: contain;
          width: 25px;
          height: 25px;
          position: absolute;
          right: -1px;
          bottom: -1px;
        }
      }
    }
  }
}
.node {
  .node {
    .node-content {
      .node-item {
        color: rgba(255, 255, 255, 0.3);
        &.payment-method-item {
          background: url(../../assets/images/finance/bankcard-green.png) no-repeat left center;
          background-size: cover;
          filter: grayscale(1);
          height: 30px;
          width: 150px;
          height: 80px;
          color: #ffffff;
          border-radius: 4px;
          justify-content: flex-start;
          align-items: flex-end;
          &.active {
            background: url(../../assets/images/finance/bankcard-green.png) no-repeat left center;
            background-size: cover;
            // background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%),
            //   linear-gradient(237.56deg, #5cffeb -21.06%, #9a5ca9 55.65%, #2cffd9 137.61%);
            border: 1px solid #b81212;
            filter: none;
            color: #ffffff;
            position: relative;
            &:after {
              content: "";
              background: url(../../assets/images/finance/bankcard-green-check.png) no-repeat bottom right;
              background-size: contain;
              width: 25px;
              height: 25px;
              position: absolute;
              right: -1px;
              bottom: -1px;
            }
          }
        }
      }
    }
  }
}
.payment-method-wrapper {
  // display: grid;
  // grid-template-columns: repeat(auto-fill, 200px);
  // grid-gap: 20px;
  // margin-top: 10px;
  display: flex;
  grid-gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
  padding-bottom: 20px;

  .payment-method-item {
    text-align: center;
    border-radius: 12px;
    color: #2222224d;

    cursor: pointer;
    padding: 20px 35px;
    &:hover {
      // border-bottom: 3px solid rgba(255, 255, 255, .4);
    }
    &.active {
      // background: rgba(255,255,255, .2);
    }

    // &.node-group {
    //   color: $group-color;
    //   &.active{
    //     border-color: $group-color;
    //   }
    // }

    img {
      max-width: 60px;
      margin-bottom: 10px;
      border-radius: 12px;
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
  .node {
    margin: 0 -30px;
    padding: 0 30px;
    .account-title-container {
      margin: 0 -30px;
      background: none;
      border-top: 1px solid #83a3ca33;
      font-weight: bold;
      padding: 0;
    }
    .node-content {
      // .node-item.payment-method-item {
      //   border-radius: 40px;
      //   font-weight: normal;
      //   background: transparent;
      //   color: #ffffff;
      //   min-width: 10rem;
      //   position: relative;
      //   &.active {
      //     background: linear-gradient(270deg, #1baa99 0%, #8ac542 100%);
      //     color: #ffffff;
      //     font-weight: bold;
      //   }

      //   &::after {
      //     position: absolute;
      //     content: "";
      //     inset: 0;
      //     background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
      //     border-radius: 40px;
      //     padding: 1px;
      //     mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      //     mask-composite: exclude;
      //     pointer-events: none;
      //   }
      // }
      .node-text {
        img {
          display: none;
        }
      }
    }
  }
  // .node-content {
  //   .payment-method-item {
  //     text-align: center;
  //     padding: 10px 8px;
  //     cursor: pointer;

  //     &:hover {
  //     }
  //     &.active {
  //       background: #075be81a;
  //       color: #075be8;
  //       box-shadow: none;
  //       filter: drop-shadow(0px 0px 3px #ffffff);
  //     }
  //   }
  //   .node-item {
  //     display: flex;
  //     justify-content: center;
  //     min-width: 6rem;
  //     // width: 140px;
  //       //     .payment-method-wrapper {
  //       display: none;
  //     }
  //   }
  //   .node-text {
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;
  //     flex-direction: column;
  //     gap: 10px;
  //     font-size: 14px;
  //     color: #ffffff;
  //     img {
  //       margin-bottom: 0;
  //     }
  //   }
  // }
  // .node-content {
  //   display: flex;
  //   align-items: stretch;
  //   flex-wrap: wrap;
  //   padding: 5px 0;
  //   justify-content: flex-start;
  //   position: relative;
  //   width: 100%;
  //   margin: 20px auto;
  //
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
      // .val{
      //   position: absolute;
      //   z-index: 999999;
      //   right: 1px;
      //   top: 3px;
      //   font-size: 8px;
      //
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
@media (max-width: 767px) {
  .node {
    .node {
      .account-title-container {
        margin: 0 -10px;
      }
    }
  }
}
</style>
