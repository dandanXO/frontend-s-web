<template>
  <div class="promotionbonus">
    <!-- <span class="menu-title">Mailbox</span> -->
    <div class="promo-items">
      <router-link :to="`/promo?name=${item.redirectUrl}&fromAccount=true`" v-for="(item, i) in promoList" :key="i" class="promo-item">
        <img :src="require(`../../assets/images/promotion/${item.icon}.png`)">
        {{ item.label }}
      </router-link>
    </div>
  </div>
</template>
<script lang="js">
import {defineComponent, onMounted, ref} from "vue";
import {api} from "boot/axios";

export default defineComponent({
  name: "PromotionView",
  components: {},
  setup() {
    // const promoList = ref([
    //   {
    //     code: "1",
    //     label: "体育免费竞猜",
    //     icon: "invite-friend",
    //     redirectUrl: "promo",
    //     iconLink:
    //         "https://sm.zzwangjie.com/static//image/7597bf69-7c02-42f6-987f-da06040887f1.png",
    //   },
    //   {
    //     code: "2",
    //     label: "体育保险",
    //     icon: "invite-friend",
    //     redirectUrl: "promo",
    //     iconLink:
    //         "https://sm.zzwangjie.com/static//image/43d35d61-264a-4f7c-9b32-7f865dfaf95a.png",
    //   },
    //   {
    //     code: "3",
    //     label: "电竞保险投注",
    //     icon: "invite-friend",
    //     redirectUrl: "promo",
    //     iconLink:
    //         "https://sm.zzwangjie.com/static//image/97f9fdf5-592f-48c9-810d-a0cbcb84128d.png",
    //   },
    //   {
    //     code: "4",
    //     label: "电子救援金",
    //     icon: "invite-friend",
    //     redirectUrl: "promo",
    //     iconLink:
    //         "https://sm.zzwangjie.com/static//image/926968b3-51b3-4683-8feb-e12f0c3849c7.png",
    //   },
    //   {
    //     code: "5",
    //     label: "邀请好友",
    //     icon: "invite-friend",
    //     redirectUrl: "promo",
    //     iconLink:
    //         "https://sm.zzwangjie.com/static//image/8a04274f-3480-4ad9-8a62-f82f3070f69e.png",
    //   },
    //   {
    //     code: "6",
    //     label: "APP存款红包",
    //     icon: "invite-friend",
    //     redirectUrl: "promo",
    //     iconLink:
    //         "https://sm.zzwangjie.com/static//image/ed69c241-d803-44ed-bbe1-1b8b1d0229f5.png",
    //   },
    //   {
    //     code: "7",
    //     label: "棋牌救援金",
    //     icon: "help",
    //     iconLink:
    //         "https://sm.zzwangjie.com/static//image/2e44202c-28b8-4c6b-b33a-b8ba336cb1fd.png",
    //   },
    //   {
    //     code: "8",
    //     label: "3d福彩",
    //     icon: "help",
    //     iconLink:
    //         "https://sm.zzwangjie.com/static//image/d49bbcd8-435b-4c5b-b742-8c8156798d45.png",
    //   },
    //   {
    //     code: "9",
    //     label: "usdt红包抽奖",
    //     icon: "help",
    //     iconLink:
    //         "https://sm.zzwangjie.com/static//image/9bcd47ee-813c-4b1d-8edd-e67bf679a68b.png",
    //   },
    //   {
    //     code: "10",
    //     label: "集虎卡",
    //     icon: "help",
    //     iconLink:
    //         "https://sm.zzwangjie.com/static//image/4c1e91c1-6d57-4d09-89e4-0193378ae321.png",
    //   },
    //
    // ]);
    const promoList = ref([
      {
        code: '1',
        label: '邀请好友',
        icon: 'invite-friend',
        redirectUrl: 'invitefriend'
      },
      {
        code: '2',
        label: '救援金',
        icon: 'help'
      },
      {
        code: '3',
        label: '砸金蛋',
        icon: 'gold_egg',
        redirectUrl: 'goldenegg'
      },
      {
        code: '4',
        label: '福彩 3D',
        icon: 'fucai3d'
      },
      {
        code: '3',
        label: '兴發虎卡',
        icon: 'huka'
      },
      {
        code: '3',
        label: '棋牌复活金',
        icon: 'qipaifuhuo'
      },
      {
        code: '3',
        label: '真人复活金',
        icon: 'zhenrenfuhuo'
      },
      {
        code: '3',
        label: '红包雨',
        icon: 'hongbaoyu',
        redirectUrl: 'hongbaoyu'
      },
      {
        code: '3',
        label: '签到奖金',
        icon: 'qiandaojiangjin'
      },
      {
        code: '3',
        label: '新手任务',
        icon: 'newbie',
        redirectUrl: 'welcomenewuser'
      },
    ])

    onMounted(()=>{
      // api.get( "/rest/api/hotPromotions" ).then((res) => {
      //   // console.log(reminderForm)
      //   const ret = res.data;
      //   if (res.code === 0) {
      //
      //   }
      // });
    })

    return {
      promoList
    }
  }
});

</script>
<style scoped lang="scss">
.promotionbonus {
  background: #212534;
  margin: 10px;
  padding: 5px;
  .promo-items {
    width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
      font-size: 11px;
      color: #bacef1;
      padding: 20px 0;
    .promo-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #323a4d;
      gap: 10px;
      padding: 10px;
      color: #ffffff;
      text-decoration: none;
    }
    img {
      width: 40px;
    }
  }
}
</style>
