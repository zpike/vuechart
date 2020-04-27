<template>
    <main>
        <v-chart :options="Options" autoresize theme="light"/>
    </main>
</template>

<script>
    import 'echarts/lib/chart/line'
    import "echarts/lib/component/tooltip"
    import "echarts/lib/component/legend"
    import "echarts/lib/component/markPoint"
    import "echarts/lib/component/markLine"
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/markArea'

    export default {
        components: {
        },
        data () {
            return {
                Options: {
                    title: {
                        text: 'SO2浓度实时曲线图',
                        subtext: 'mg/Nm³'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: 'blue'
                            }
                        }
                    },
                    legend: {
                        data: ['SO2浓度'],
                        y: 'bottom',
                        x: 'left'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            min: 0,
                            max: 40,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series: [
                        {
                            name: 'SO2浓度',
                            smooth: true,
                            type: 'line',
                            color: '#89A9FD',
                            data: [21, 23, 24, 25, 26, 27, 26, 26, 28, 31,33],
                            markArea: {
                                data: [  [{
                                    name: '小时均值',
                                    xAxis: '45'
                                }, {
                                    xAxis: '50',
                                    yAxis: '30'
                                }] ]
                            },
                            markLine : {
                                silent:false,
                                label:{
                                    position:"end",
                                    formatter: "标准线",
                                    color:"grey",
                                    fontSize:14
                                },
                                data : [{
                                    silent:true,
                                    symbol: 'none',
                                    lineStyle:{
                                        type:"grid",
                                        color:"grey"
                                    },
                                    yAxis: '30'
                                },
                                    [{
                                        symbol: 'none',
                                        lineStyle:{
                                            type:"grid",
                                            color:"red"
                                        },
                                        x: '90%',
                                        coord: [9, 28]
                                    }, {
                                        symbol: 'none',
                                        label: {
                                            position: 'start',
                                            formatter: '达标控制线',
                                            color: 'red'
                                        },
                                        coord: [9, 28]
                                    }],
                                    [{
                                        symbol: 'none',
                                        lineStyle:{
                                            type:"grid",
                                            color:"orange"
                                        },
                                        x: '90%',
                                        coord: [9, 26]
                                    }, {
                                        symbol: 'none',
                                        label: {
                                            position: 'start',
                                            formatter: '内部控制线',
                                            color: 'orange'
                                        },
                                        coord: [9, 26]
                                    }]
                                ]
                            }
                        }
                    ]
                }
            }
        }
    }
</script>

<style>

</style>