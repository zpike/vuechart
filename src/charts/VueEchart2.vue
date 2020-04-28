<template>
    <div class="echarts-demo">
        <!-- [1] 为 ECharts 准备一个具备大小 (宽高) 的 DOM -->
        <div id="chart" ref="chart" style="width: 300px; height: 300px"></div>
    </div>
</template>

<script>
    // [2] 引入 echarts
    // 全部引入
    // import echarts from 'echarts';

    // 按需引入
    import echarts from 'echarts/lib/echarts'; // 引入基本模板
    // import bar from 'echarts/lib/chart/bar';   // 引入柱状图组件

    export default {
        data() {
            return {
                chart: null,
            };
        },
        mounted() {
            // [3] 基于准备好的 DOM，初始化 Echarts 实例
            this.chart = echarts.init(this.$refs.chart);

            // [4] 设置 Echarts 图表数据
            this.chart.setOption({
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            });
        }
    };
</script>