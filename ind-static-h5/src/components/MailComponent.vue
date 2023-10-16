<template>
  <div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="brand"/>
      <div class="label">加载中</div>
    </q-inner-loading>
    <div v-if="!loading">
      <q-infinite-scroll @load="onLoad" :offset="150">
        <q-card v-for="(det, n) in truncatedList" :key="n" class="q-pa-sm"
                :class="{active: isSelectedMail === det.title }" style="background: #212534; color: #bacef1;"
                @click="selectMail(det)">
          <div style="display:flex; justify-content: space-between; align-items: center">
            <div>
              <q-icon name="mail"/>
              {{ det.title }}
            </div>
            <q-chip color="brand" size="sm" label="已读" v-if="det.isRead && det.isRead !== 0"/>

          </div>
          <div class="text-grey mailcontents" :style="`height: ${isSelectedMail === det.title ? 'auto' : '0px'}`">
            {{ det.content }}
          </div>
          <div v-if="mailType === 'outbox'" class="buttons">
            <q-btn outline label="催单" size="sm" color="bright" class="q-mr-sm"/>
            <q-btn outline label="复制" size="sm" color="bright"/>
          </div>
        </q-card>

        <template v-slot:loading>
          <div v-if="comList.length > 0">
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px"/>
            </div>
          </div>
          <div v-else class="q-pa-md" style="text-align: center;">
            {{ truncatedList.length === 0 ? '暂无数据' : '暂无更多数据了' }}
          </div>
        </template>

      </q-infinite-scroll>
    </div>
  </div>
</template>
<script>
import {defineComponent, onMounted, ref} from "vue";
import moment from "moment"

export default defineComponent({
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    mailType: {
      type: String,
      default: function () {
        return ''
      }

    },
  },
  emits: ["readMsg"],
  setup(props, context) {
    const truncatedList = ref([])
    const comList = ref({})
    const onLoad = (index, done) => {
      comList.value = props.list
      setTimeout(() => {
        if (comList.value.length) {
          var slicedArray = comList.value.splice(0, 6);
          slicedArray.forEach(element => {
            truncatedList.value.push(element);
          });
          done();
        }
      }, 200)
    }
    const isSelectedMail = ref('');
    const selectMail = (mail) => {
      console.log(mail.id);
      isSelectedMail.value = mail.title;
      // context.emit('readMsg', mail.id);
    }
    onMounted(() => {
      onLoad
    })
    return {
      humanDatetime(ts) {
        return moment(ts).format("YYYY-MM-DD HH:mm:ss");
      },
      onLoad,
      truncatedList,
      comList,
      selectMail,
      isSelectedMail,
    }
  },
})
</script>
<style scoped lang="scss">
.table-data {
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  margin: 0 0 10px;

  .label {
    flex: 1;
  }

  .desc {
    flex: 3;
    word-break: break-all;
  }
}

.buttons {
  text-align: right;
}

.mailcontents {
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
