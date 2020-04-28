<template>
    <van-tabs v-model="active">
            <van-tab title="NOx">
                <h4><van-icon name="bar-chart-o" color="#1989fa"/>  NOx浓度曲线图</h4>
                <!-- <button @click="getData">get Data</button> -->
                <v-chart :options="lineOption"
                :init-options="initOptions" autoresize/>
            </van-tab>

            <van-tab title="SO2">
                <h4><van-icon name="bar-chart-o" color="#1989fa"/>  SO2浓度曲线图</h4>
                <v-chart :options="lineOption" autoresize/>
            </van-tab>

            <van-tab title="Dust">
                <h4><van-icon name="bar-chart-o" color="#1989fa"/>  尘浓度曲线图</h4>
                <v-chart :options="lineOption" autoresize/>
            </van-tab>
    </van-tabs>
</template>

<script>
    import ECharts from 'vue-echarts'
    import 'echarts/lib/chart/line'
    import "echarts/lib/component/tooltip"
    import "echarts/lib/component/legend"
    // import "echarts/lib/component/markLine"
    // import 'echarts/lib/component/markArea'

    import mqtt from 'mqtt'
    import { MQTT_SERVICE, MQTT_USERNAME, MQTT_PASSWORD, MSG_TOPIC } from '@/utils/mqttconst'

    var client
    const options = {
        connectTimeout: 20000,
        clientId: 'ahb-charts',
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        clean: true
    }
    client = mqtt.connect(MQTT_SERVICE, options)

    const opt = {
        onSuccess() {
            console.log('退订成功')
        },
        onFailure(error) {
            console.log('退订失败')
            console.log(error)
        }
    }

    export default {
        components: {
            'v-chart': ECharts
        },
        mounted() {
            this.mqttConnect()
        },
        beforeDestroy() {
            this.mqttDisConnet()
        },
        data () {
            return {
                active: 0,
                SO2data: [],
                NOxdata: [],
                Dustdata: [],

                initOptions: {
                    renderer: 'canvas'
                },

                lineOption: {
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
                        data: ['NOx浓度']
                    },
                    xAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}'
                            }
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
                            name: 'NOx浓度',
                            smooth: true,
                            type: 'line',
                            color: '#89A9FD',
                            data: this.SO2data,
                            // markArea: {
                            //     data: [  [{
                            //         name: '小时均值',
                            //         xAxis: '45'
                            //     }, {
                            //         xAxis: '50',
                            //         yAxis: '30'
                            //     }] ]
                            // },
                            // markLine : {
                            //     silent:false,
                            //     label:{
                            //         position:"end",
                            //         formatter: "标准线",
                            //         color:"grey",
                            //         fontSize:14
                            //     },
                            //     data : [{
                            //         silent:true,
                            //         symbol: 'none',
                            //         lineStyle:{
                            //             type:"grid",
                            //             color:"grey"
                            //         },
                            //         yAxis: '30'
                            //     }]
                            // }
                        }
                    ]
                }
            }
        },
        methods: {
            mqttConnect() {
                // mqtt连接
                client.on('connect', () => {
                    console.log('连接成功:')
                    client.subscribe(MSG_TOPIC, { qos: 0 }, (error) => {
                    if (!error) {
                        console.log('订阅成功')
                    } else {
                        client.pubish(MSG_TOPIC, '传输失败')
                        console.log('订阅失败')
                    }
                    })
                })
                
                // 接收消息处理
                client.on('message', (topic, message) => {
                    // console.log('收到来自', topic, '的消息', message.toString())
                    this.msg = message.toString()
                    var pointName = JSON.parse(this.msg).pointName
                    var lineData = JSON.parse(this.msg).line

                    switch (pointName) {
                        case 'SO2':
                            // this.time1.push(lineData.tip)
                            this.SO2data.push([lineData.x_axis, lineData.value])
                            break;
                        case 'NOx':
                            this.NOxdata.push(lineData.value)
                            break;
                        case 'dust':
                            this.Dustdata.push(lineData.value)
                            break;
                        default:
                            break;
                    }
                    console.log(this.SO2data)
                    // this.data.splice(array.x_pos, 1, [array.x_pos, array.data])
                })
                // 断开发起重连
                client.on('reconnect', (error) => {
                    console.log('正在重连:', error)
                })
                // 链接异常处理
                client.on('error', (error) => {
                    console.log('连接失败:', error)
                })
            },
            mqttDisConnet() {
                client.unsubscribe(MSG_TOPIC, opt)
            }
        }
    }
</script>

<style>

</style>
