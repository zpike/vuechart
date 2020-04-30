<template>
    <van-tabs v-model="active">
        <van-tab title="NOx">
            <h4><van-icon name="bar-chart-o" color="#1989fa"/>  NOx浓度曲线图</h4>
            <!-- <button @click="getData">get Data</button> -->
            <ve-line
                :data="chartData"
                :settings="chartSettings"
                :data-empty="dataEmpty"
                :loading="loading"
                :extend="chartExtend"
                :colors="colors"
                >
        </ve-line>
        </van-tab>

        <van-tab title="SO2">
            <h4><van-icon name="bar-chart-o" color="#1989fa"/>  SO2浓度曲线图</h4>
            <ve-line
                :data="chartData"
                :settings="chartSettings"
                :data-empty="dataEmpty"
                :loading="loading"
                :extend="chartExtend"
                >
        </ve-line>
        </van-tab>

        <van-tab title="Dust">
            <h4><van-icon name="bar-chart-o" color="#1989fa"/>  尘浓度曲线图</h4>
            <ve-line
                :data="chartData"
                :settings="chartSettings"
                :data-empty="dataEmpty"
                :loading="loading"
                :extend="chartExtend"
                >
        </ve-line>
        </van-tab>
</van-tabs>
    
</template>

<script>
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
    const DATA_FROM_BACKEND = {
        columns: ['time', 'PV'],
        rows: [
            { 'time': '5', 'PV': 13},
            { 'time': '10', 'PV': 14},
            { 'time': '15', 'PV': 17},
            { 'time': '20', 'PV': 18},
            { 'time': '25', 'PV': 19},
            { 'time': '30', 'PV': 20},
            { 'time': '35', 'PV': 21},
            { 'time': '40', 'PV': 19},
            { 'time': '45', 'PV': 17},
            { 'time': '50', 'PV': 16},
            { 'time': '55', 'PV': 15},
            { 'time': '60', 'PV': 14},
        ]
    }
    const EMPTY_DATA = {
        columns: [],
        rows: []
    }

    const data1 = []
    const data2 = []
    const data3 = []

    export default {
        created() {
            this.getData()
            this.dataEmpty = !this.chartData.rows.length
        },
        mounted() {
            this.mqttConnect()
        },
        beforeDestroy() {
            this.mqttDisConnet()
        },
        data() {
            this.colors = ['#c23531','#2f4554', '#61a0a8',
                '#d48265', '#91c7ae','#749f83',
                '#ca8622', '#bda29a','#6e7074',
                '#546570', '#c4ccd3']
            this.chartExtend = {
                series (v) {
                    v.forEach(i => {
                        i.smooth = false
                    })
                    return v
                },
                // yAxis: {
                //     min: 0,
                //     max: 40,
                //     interval: 10,
                //
                // }
                // tooltip (v) {
                //     v.trigger = 'none'
                //     return v
                // }
            }
            // this.markLine = {
            //     label:{
            //         position:"end",
            //         formatter: "标准线",
            //         color:"grey",
            //         fontSize:14
            //     },
            //     data: [{
            //         silent:true,
            //         symbol: 'none',
            //         lineStyle:{
            //             type:"grid",
            //             color:"grey"
            //         },
            //         type: 'average'
            //         // yAxis: '29'
            //     }]
            // }
            // this.markArea = {

            // }
            this.chartSettings = {
                // xAxisType: 'value',
                // yAxisType: ['0,0a'],  //numerify
                // yAxisType: [function(v) {
                //     return v + 'min'
                // }],
                // digit: 3,
                labelMap: {
                    PV: 'NOx浓度',
                },
            }
            return {
                chartData: {
                    columns: [],
                    rows: []
                },
                loading: false,
                dataEmpty: false,
                active: 0,
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
                            data1.push({ 'PV': lineData.value, 'time': lineData.tip })
                            break;
                        case 'NOX':
                            data2.push({'time': lineData.tip , 'PV': lineData.value })
                            break;
                        case 'dust':
                            data3.push({'time': lineData.tip , 'PV': lineData.value })
                            break;
                        default:
                            break;
                    }
                    // console.log(data1)
                    // RT_DATA = {
                    //     columns: ['time', 'PV'],
                    //     row: data1
                    // }
                    // this.chartData = DATA_FROM_BACKEND
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
            },
            getData() {
                this.loading = true
                //ajax get http data
                setTimeout(() => {
                    this.chartData = this.chartData.rows.length ? EMPTY_DATA : DATA_FROM_BACKEND
                    this.dataEmpty = !this.chartData.rows.length
                    this.loading = false
                }, 1000)
            }
        },
    };
</script>
