<template>
  <div>
    <div className="menu-title-container">
      <span className="menu-title">{{ "account.menu.vcode" }}</span>
    </div>
    <div class="account-content full">
      <div class="code-wrapper">
        <input
          class="code-input"
          :placeholder="'account.voucher.codeTip'"
        />
        <button class="common-btn code-btn">{{ t('common.confirm') }}</button>
      </div>
      <!-- <div class="promo-wrapper">
      <div class="promo-item" v-for="i in 6" :key="i">
        <div class="flex-box flex-justify-space">
          <div>
            <div class="promo-name">{{ "account.voucher.shareBy" }}</div>
            <div class="promo-desc">{{ "account.voucher.shareTip" }}</div>
          </div>
          <div>
            <img
              class="promo-img"
              :src="
                require('../../assets/images/account/promotion/promotion_' +
                  i +
                  '.png'
              "
            />
          </div>
        </div>
        <div class="flex-box flex-justify-space flex-wrap promo-action-box">
          <button class="promo-btn">{{ "account.voucher.cnow" }}</button>
          <button class="promo-btn read-more">{{ "account.voucher.readMore" }}</button>
        </div>
      </div>
    </div> -->
      <div class="voucher-table-wrapper">
        <el-table :columns="columns"></el-table>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "VoucherView",
  setup() {
    const { t } = useI18n();
    const columns = [
      {
        title: "ID",
        dataIndex: "1",
        key: "1",
      },
      {
        title: "Apply Time",
        dataIndex: "2",
        key: "2",
      },
      {
        title: "Voucher Code",
        dataIndex: "3",
        key: "3",
      },
      {
        title: "Amount",
        dataIndex: "4",
        key: "4",
      },
    ];
    return {
      columns
    };
  },
});
</script>

<style scoped lang="scss">
.account-container {
  .account-content-wrapper {
    .code-input {
      width: 100%;
      max-width: 400px;
      height: 40px;
      border: none;
      background-color: #16151c;
      padding: 15px;
    }
    .code-wrapper {
      display: flex;
      align-items: center;
      margin: 20px 0;
      gap: 5px;

      .code-btn {
        // width: 110px;
        // // height: 26px;
        // line-height: 26px; */
        padding: 3px 5px;
        font-size: 14px;
      }
    }
    .promo-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      grid-gap: 20px 24px;
      padding-top: 30px;
      .promo-item {
        width: 340px;
        height: 190px;
        padding: 8px 20px;
        background-color: #242e3b;
        border-left: 2px solid#ffffff;
        position: relative;
        &:before {
          content: "";
          display: inline-block;
          width: 6px;
          height: 40px;
          position: absolute;
          left: -2px;
          top: 0;
          background: #ffffff;
        }
        .promo-name {
          font-size: 16px;
        }
        .promo-desc {
          margin-top: 20px;
        }
        .promo-action-box {
          margin-top: 6px;
          .promo-btn {
            width: 100px;
            // height: 26px;
            // line-height: 26px;
            color: #242e3b;
            background-color: #1bcef1;
            &.read-more {
              color: #ffffff;
              background-color: #163d5b;
              border: 1px solid #ffffff;
            }
          }
        }
      }
    }
    .voucher-table-wrapper {
      margin-top: 50px;
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      .promo-wrapper {
        justify-items: flex-start;
      }
      .code-btn {
      }
    }
  }
}
</style>
