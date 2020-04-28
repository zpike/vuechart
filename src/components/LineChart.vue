<template>
    <main>
        <h2 class="showDate">{{ date }}</h2>

        <!-- <van-row>
            <van-col span="4">塔号</van-col>
            <van-col span="20">
                <van-radio-group v-model="radio" direction="horizontal">
                    <van-radio name="1">塔 1</van-radio>
                    <van-radio name="2">塔 2</van-radio>
                    <van-radio name="3">塔 3</van-radio>
                </van-radio-group>
            </van-col>
        </van-row> -->

<!--         <VCharts/>-->
        <VueEchart/>

    </main>
</template>

<script>
    import moment from 'moment'
    // import VCharts from "@/charts/VCharts";
    import VueEchart from "@/charts/VueEchart3";
    export default {
        name: "LineChart",
        components: {VueEchart},
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
    height: 300px;
    margin-top: 20px;
}
</style>
