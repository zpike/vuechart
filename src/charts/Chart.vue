<template>
    <van-tabs v-model="activeName" @click="loadingData" color="#87CEFF">
        <van-tab title="NOx" name="NOx">
            <h4>
                <van-icon name="bar-chart-o" color="#1989fa"/>
                NOx浓度曲线图
            </h4>
            <ve-line-chart
                    :data="chartData"
                    :legend-visible="false"
                    :settings="chartSettings"
                    :loading="loading"
                    v-bind="options"
            />
        </van-tab>

        <van-tab title="SO2" name="SO2">
            <h4>
                <van-icon name="bar-chart-o" color="#1989fa"/>
                SO2浓度曲线图
            </h4>
            <ve-line-chart
                    :data="chartData"
                    :legend-visible="false"
                    :settings="chartSettings"
                    :loading="loading"/>
        </van-tab>

        <van-tab title="Dust" name="dust">
            <h4>
                <van-icon name="bar-chart-o" color="#1989fa"/>
                尘浓度曲线图
            </h4>
            <ve-line-chart
                    :data="chartData"
                    :legend-visible="false"
                    :settings="chartSettings"
                    :loading="loading"/>
        </van-tab>
    </van-tabs>
</template>

<script>
    import axios from 'axios'
    import {Notify} from 'vant';
    import {dataURL, devURL, token} from '../api'
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
        data() {
            return {
                activeName: 'NOx',
                deviceID: 0,
                info: {},
                loading: true,
                chartData: {},
                DataX: [],
                DataY: [],
            }
        },
        methods: {
            getDevId() {
                setTimeout(() => {
                    axios.defaults.headers.common['Authorization'] = token
                    axios.get(devURL).then(response => {
                        if (response.data.data !== null) {
                            this.deviceID = response.data.data[0].id
                        }
                        this.loadingData()
                    })
                        .catch(error => {
                            console.log(error)
                        })
                }, 1000)
            },
            loadingData() {
                Notify({type: 'warning', message: this.activeName});
                this.loading = true
                setTimeout(() => {
                    axios.defaults.headers.common['Authorization'] = token
                    axios
                        .get(dataURL, {
                            params: {
                                devid: this.deviceID,
                                pointName: this.activeName
                            }
                        })
                        .then(response => {
                            this.info = response.data
                            // console.log(this.info)
                            let linedata = []
                            let bardata = []
                            if (this.info.data !== null) {
                                linedata = this.info.data.line
                                bardata = this.info.data.bar
                                // this.barstart = bardata.x_pos
                            }
                            // console.log(linedata)
                            if (linedata !== undefined) {
                                this.DataX = linedata.map(obj => {
                                    return obj.tip
                                })
                                this.DataY = linedata.map(obj => {
                                    return obj.value
                                })
                                this.initChart()
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .finally(() => this.loading = false)
                }, 1000)
            },
            initChart() {
                this.chartData = {
                    dimensions: {
                        name: 'date',
                        data: this.DataX
                    },
                    measures: [
                        {
                            name: this.activeName,
                            data: this.DataY
                        }
                    ]
                }
            },
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
                    console.log(this.msg)
                    var pointName = JSON.parse(this.msg).pointName
                    var lineData = JSON.parse(this.msg).line
                    switch (pointName) {
                        case 'SO2':
                            this.DataX.push(lineData.tip)
                            this.DataY.push(lineData.value)
                            break;
                        case 'NOx':
                            this.DataX.push(lineData.tip)
                            this.DataY.push(lineData.value)
                            break;
                        case 'dust':
                            this.DataX.push(lineData.tip)
                            this.DataY.push(lineData.value)
                            break;
                        default:
                            break;
                    }
                    this.initChart()
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
        },
        mounted() {
            this.getDevId()
            this.mqttConnect()
        },
        created() {
            this.options = {
                series: [{
                    markArea: {
                        data: [
                            [{
                                name: '平均值',
                                xAxis: '09:50'
                            }, {
                                xAxis: '10:00',
                                yAxis: '30'
                            }]
                        ]
                    }
                }]
            }
            this.chartSettings = {
                smooth: true,
                showSymbol: false,
            }
        },
        beforeDestroy() {
            this.mqttDisConnet()
        },
    }
</script>
