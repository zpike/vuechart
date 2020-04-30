<template>
    <van-tabs v-model="activeName" @click="loadingData" color="#5c89ff">
        <van-tab title="NOX" name="NOX">
            <h4>
                <van-icon name="bar-chart-o" color="#569cfc"/>
                NOx浓度曲线图
            </h4>
            <ve-line-chart
                    :title="title"
                    :legend-visible="false"
                    :settings="chartSettings"
                    :loading="loading"
                    v-bind="options"
            />
        </van-tab>

        <van-tab title="SO2" name="SO2">
            <h4>
                <van-icon name="bar-chart-o" color="#569cfc"/>
                SO2浓度曲线图
            </h4>
            <ve-line-chart
                    :title="title"
                    :legend-visible="false"
                    :settings="chartSettings"
                    :loading="loading"
                    v-bind="options"/>
        </van-tab>

        <van-tab title="DUST" name="DUST">
            <h4>
                <van-icon name="bar-chart-o" color="#569cfc"/>
                尘浓度曲线图
            </h4>
            <ve-line-chart
                    :title="title"
                    :legend-visible="false"
                    :settings="chartSettings"
                    :loading="loading"
                    v-bind="options"/>
        </van-tab>
    </van-tabs>
</template>

<script>
    import axios from 'axios'
    import {dataURL, devURL, x_token} from '../api'
    import mqtt from 'mqtt'
    import moment from 'moment'
    import {MQTT_SERVICE, MQTT_USERNAME, MQTT_PASSWORD} from '@/utils/mqttconst'

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
                activeName: 'NOX',
                deviceID: null,
                customerId: null,
                token: '',
                MSG_TOPIC: '',  //订阅主题
                towerNo: 0,  //塔1-3
                loading: true,
                info: {},
                chart: null,
                chartData: [],  // 图表数据
                anchor: [], // 时间锚
                barStart: '',
                barEnd: '',
                barValue: 0
            }
        },
        methods: {
            getDevId(token) {
                setTimeout(() => {
                    axios.defaults.headers.common['Authorization'] = token
                    axios.get(devURL).then(response => {
                        if (response.data.data !== null) {
                            this.deviceID = response.data.data[this.towerNo].id
                            this.customerId = response.data.data[this.towerNo].customerId
                            this.MSG_TOPIC = 'overproof/' + this.customerId + '/' + this.deviceID
                            console.log('mqtt-Topic: ' + this.MSG_TOPIC)
                        }
                        this.loadingData()  // 加载当前小时内的历史数据
                        this.mqttConnect() // mqtt连接 加载图表
                    })
                        .catch(error => {
                            console.log(error)
                        })
                }, 1000)
            },
            loadingData() {
                this.loading = true
                setTimeout(() => {
                    axios.defaults.headers.common['Authorization'] = this.token
                    axios
                        .get(dataURL, {
                            params: {
                                devid: this.deviceID,
                                pointName: this.activeName
                            }
                        })
                        .then(response => {
                            this.info = response.data
                            console.log(this.info)
                            let linedata = []
                            if (this.info.data !== null) {
                                linedata = this.info.data.line
                            }
                            let charArray = []
                            if (linedata !== undefined) {
                                linedata.forEach(function (v) {
                                    charArray.push({name: v.tip, value:[v.tip, v.value]})
                                })
                                this.chartData = charArray
                                this.RedrawChart() // 获取历史数据之后绘制图表
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .finally(() => this.loading = false)
                }, 1000)
            },
            mqttConnect() {
                // mqtt连接
                client.on('connect', () => {
                    console.log('连接成功:')
                    client.subscribe(this.MSG_TOPIC, {qos: 0}, (error) => {
                        if (!error) {
                            console.log('订阅成功')
                        } else {
                            client.pubish(this.MSG_TOPIC, '传输失败')
                            console.log('订阅失败')
                        }
                    })
                })

                // 接收消息处理
                client.on('message', (topic, message) => {
                    console.log('收到来自', topic, '的消息', message.toString())
                    this.msg = message.toString()
                    var pointName = JSON.parse(this.msg).pointName
                    var lineData = JSON.parse(this.msg).line
                    var barData = JSON.parse(this.msg).bar
                    if (barData !== undefined) {
                        this.barStart = moment(barData.tip).subtract(30, 'second')
                        this.barEnd = barData.tip
                        this.barValue = barData.value
                    }
                    switch (pointName) {
                        case 'SO2':
                            this.chartData.push({name: lineData.tip, value: [lineData.tip, lineData.value]})
                            break;
                        case 'NOX':
                            this.chartData.push({name: lineData.tip, value: [lineData.tip, lineData.value]})
                            break;
                        case 'DUST':
                            this.chartData.push({name: lineData.tip, value: [lineData.tip, lineData.value]})
                            break;
                        default:
                            break;
                    }
                    this.RedrawChart()  // 获取mqtt数据之后再次绘制图表
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
                client.unsubscribe(this.MSG_TOPIC, opt)
            },
            RedrawChart() {
                this.options = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    xAxis: {
                        name: '分钟',
                        type: 'time',
                        splitLine: {
                            show: false
                        },
                        maxInterval: 300 * 1000, // 5分钟间隔显示x轴
                        axisLabel: {
                            formatter: function (value) {
                                return moment(value).format('HH:mm');
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        },
                    },
                    series: [{
                        name: '浓度',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: this.chartData,
                        markArea: {
                            data: [
                                [{
                                    name: '平均值',
                                    xAxis: this.barStart
                                }, {
                                    xAxis: this.barEnd,
                                    yAxis: this.barValue
                                }]
                            ]
                        }
                    },
                        {
                            name: '.anchor',
                            type: 'line',
                            showSymbol: false,
                            data: this.anchor,
                            itemStyle: {normal: {opacity: 0}},
                            lineStyle: {normal: {opacity: 0}}
                        },
                    ]
                }
            }
        },
        created() {
            // let token = 'Bearer ' + this.$utils.getUrlKey("token")
            this.token = x_token
            this.getDevId(this.token)
            var nowHour = moment(new Date()).format('YYYY/MM/DD HH:00:00')
            var nextHour = moment(new Date()).add(1, 'hour').format('YYYY/MM/DD HH:00:00')
            this.anchor.push({name: nowHour, value: [nowHour, 0]})
            this.anchor.push({name: nextHour, value: [nextHour, 0]})

            this.title = {
                text: 'mg/Nm³'
            }
            this.chartSettings = {
                smooth: true,
                showSymbol: false
            }
            this.options = {

            }
        },
        beforeDestroy() {
            this.mqttDisConnet()
        },
    }
</script>
