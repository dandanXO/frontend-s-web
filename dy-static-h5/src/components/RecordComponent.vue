<template>
    <div>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="brand"  />
        <div class="label">加载中</div>
      </q-inner-loading>
      <div v-if="!loading">
        <q-infinite-scroll @load="onLoad" :offset="250">
<!--          style="background: #212534; color: #bacef1;"-->
            <q-card v-for="(det, n) in truncatedList" :key="n" class="q-pa-sm" >
                    <div class="table-data" v-for="(head, e) in headers" :key="e">
                        <div class="label">
                            {{ head.label }}
                        </div>
                        <template v-for="obj in Object.keys(det)" :key="obj">
                            <div v-if="obj === head.key" class="desc">
                                <div v-if="obj === 'status'">
                                    {{ checkRecord(det[obj])}}
                                </div>
                                <div v-if="obj === 'commitDate'">
                                    {{ humanDatetime(det[obj])}}
                                </div>
                                <div v-if="obj !== 'status' || obj === 'commitDate'">
                                    {{ det[obj] }}
                                </div>
                            </div>
                        </template>
                        <!-- <div v-if="Object.keys(head.key)" class="desc">
                            {{ det.value }}

                        </div> -->
                    </div>
                    <div v-if="recordType === 'deposit'" class="buttons">
                        <q-btn outline label="催单" size="sm" color="bright" class="q-mr-sm" />
                         <q-btn outline label="复制" size="sm" color="bright"  />
                    </div>
            </q-card>

            <template v-slot:loading>
                <div v-if="comList.length > 0">
                <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
                </div>
                </div>
                <div v-else class="q-pa-md" style="text-align: center;">
                    没有更多数据了
                </div>
            </template>

        </q-infinite-scroll>
      </div>
    </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import moment from "moment"
import { translateRecord } from "../directives/translate.js";
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
        recordType: {
            type: String,
            default: function () {
                return ''
            }

        },
        headers: {
        type: Array,
        default: function () {
            return [];
        }
        },
    },
    setup(props, { emit }) {
        const truncatedList = ref([])
        const comList = ref({})
        const onLoad = (index, done) => {
            comList.value = props.list
            setTimeout(() => {
                if (comList.value.length) {
                    var slicedArray = comList.value.splice(0, 3);
                    slicedArray.forEach(element => {
                        truncatedList.value.push(element);
                    });
                    done();
                }
        }, 200)
        }
        return {
            humanDatetime(ts) {
                return moment(ts).format("YYYY-MM-DD HH:mm:ss");
            },
            checkRecord(status) {
                return translateRecord(status);                
            },
            onLoad,
            truncatedList,
            comList
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
</style>
