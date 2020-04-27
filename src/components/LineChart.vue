<template>
    <main>
        <h2 class="showDate">{{ date }}</h2>

        <van-row>
            <van-col span="4">塔号</van-col>
            <van-col span="20">
                <van-radio-group v-model="radio" direction="horizontal">
                    <van-radio name="1">塔 1</van-radio>
                    <van-radio name="2">塔 2</van-radio>
                    <van-radio name="3">塔 3</van-radio>
                </van-radio-group>
            </van-col>
        </van-row>

        <Chart1/>

        <Chart2/>

    </main>
</template>

<script>
    import moment from 'moment'
    import Chart1 from "@/components/Chart1";
    import Chart2 from "@/components/Chart2";
    export default {
        name: "LineChart",
        components: {Chart1, Chart2},
        data() {
            return {
                radio: '1',
                date: null,
            }
        },
        mounted() {
          let vm = this;
          setInterval(function () {
              vm.date = vm.getCurrentTime();
          }, 1000)
        },
        methods: {
          getCurrentTime() {
              return moment(new Date()).format('HH:mm:ss')
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
}

.echarts {
    width: 100%;
    height: 100%;
    margin-top: 20px;
    margin-left: 20px;
}
</style>