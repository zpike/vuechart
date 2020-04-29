<template>
    <main>
        <h2 class="showDate">{{ date }}</h2>

        <van-divider />

        <van-row>
            <van-col span="4">塔号</van-col>
            <van-col span="20">
                <van-radio-group v-model="radio" direction="horizontal">
                    <van-radio v-for="devList in devLists" :key="devList.id" name="1" >{{ devList.name }}</van-radio>
                </van-radio-group>
            </van-col>
        </van-row>

        <DynamicChart/>

    </main>
</template>

<script>
    import axios from 'axios'
    import {devURL, token} from '@/api'
    import moment from 'moment'
    import DynamicChart from "@/charts/DynamicChart";

    export default {
        name: "LineChart",
        components: {DynamicChart},
        data() {
            return {
                radio: '1',
                date: null,
                devLists: {},
            }
        },
        mounted() {
            let vm = this;
            setInterval(function () {
                vm.date = vm.getCurrentTime();
            }, 1000)
            this.getDevList()
        },
        methods: {
            getCurrentTime() {
                return moment(new Date()).format('HH:mm:ss')
            },
            getDevList() {
                setTimeout(() => {
                    axios.defaults.headers.common['Authorization'] = token
                    axios.get(devURL).then(response => {
                        this.devLists = response.data.data
                        // console.log(this.devLists)
                    })
                        .catch(error => {
                            console.log(error)
                        })
                }, 1000)
            }
        }
    }
</script>

<style lang="less">
    @import '../style/var';

    .showDate {
        margin-bottom: 20px;
        margin-top: -8px;
    }

    .van-radio-group {
        background: @white;
        margin-left: 20px;
        margin-bottom: 30px;
    }

    .echarts {
        width: 100%;
        height: 300px;
        margin-top: 20px;
    }
</style>
