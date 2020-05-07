<template>
    <main>
        <h2 class="showDate">{{ date }}</h2>

        <van-divider />

        <van-row>
            <van-col span="4">塔号</van-col>
            <van-col span="20">
<!--                <van-radio-group v-model="radio" direction="horizontal">-->
<!--                    <van-radio v-for="(devList, index) in devLists" :key="devList.id" name="index">{{ devList.name }} + {{index}}</van-radio>-->
<!--                </van-radio-group>-->
                <van-radio-group v-model="radio" direction="horizontal">
                    <van-radio name="1">塔 1</van-radio>
                </van-radio-group>
            </van-col>
        </van-row>

        <Chart/>

    </main>
</template>

<script>
    import axios from 'axios'
    import {devURL} from '@/api'
    import moment from 'moment'
    import Chart from "@/charts/Chart";

    export default {
        name: "OverridWarn",
        components: {Chart},
        data() {
            return {
                radio: '1',
                date: null,
                devLists: {},
            }
        },
        created() {
            let token = 'Bearer ' + this.$utils.getUrlKey("token")
            let vm = this;
            setInterval(function () {
                vm.date = vm.getCurrentTime();
            }, 1000)
            this.getDevList(token)
        },
        methods: {
            getCurrentTime() {
                return moment(new Date()).format('HH:mm:ss')
            },
            // 获取设备ID 塔1-3
            getDevList(token) {
                setTimeout(() => {
                    axios.defaults.headers.common['Authorization'] = token
                    axios.get(devURL).then(response => {
                        this.devLists = response.data.data
                    })
                        .catch(error => {
                            console.log(error)
                        })
                }, 1000)
            },
        }
    }
</script>

<style lang="less">
    @import '../style/var';

    .showDate {
        margin-bottom: 20px;
    }

    .van-radio-group {
        background: @white;
        margin-left: 20px;
        margin-bottom: 20px;
    }

    .echarts {
        width: 100%;
        height: 300px;
    }
</style>
