<template>
    <van-tabs v-model="activeName" @click="loadingData" color="#5c89ff">
        <van-tab title="NOx" name="NOX">
            <h4>
                <van-icon name="bar-chart-o" color="#569cfc"/>
                NOx浓度曲线图
            </h4>
            <ve-line-chart
                    :title="title"
                    :legend-visible="false"
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
                    :loading="loading"
                    v-bind="options"/>
        </van-tab>

        <van-tab title="烟尘" name="DUST">
            <h4>
                <van-icon name="bar-chart-o" color="#569cfc"/>
                尘浓度曲线图
            </h4>
            <ve-line-chart
                    :title="title"
                    :legend-visible="false"
                    :loading="loading"
                    v-bind="options"/>
        </van-tab>

        <h4 class="overproof">当日超点次数共计：{{ getOverTimes() }} 次
            <span v-if="getOverTimes() > 0">; 分别发生于：
                <small v-for="(overList ) in overLists" :key="overList.id" style="color: #FF0029">{{ overList }},
                </small>
            </span>
        </h4>
    </van-tabs>
</template>

<script>
    import axios from 'axios'
    import {dataURL, devURL} from '../api'
    import mqtt from 'mqtt'
    import moment from 'moment'
    import {BASE_TOPIC, MQTT_PASSWORD, MQTT_SERVICE, MQTT_USERNAME} from '@/utils/mqttconst'

    export default {
        data() {
            return {
                mqttoptions: {},
                client: null,
                opt: {},
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
                color: '',
                barStart: '', //当前平均值起始值
                barEnd: '',  //当前平均值结束值
                barValue: 0,  //当前平均值
                warningMax: 0, //达标控制线
                warningMin: 0, //内部控制线
                standardValue: 0,  //标准值
                overLists: [],
            }
        },
        computed: {

        },
        methods: {
            getDevId(token) {
                setTimeout(() => {
                    axios.defaults.headers.common['Authorization'] = token
                    axios.get(devURL).then(response => {
                        if (response.data.data !== null) {
                            this.deviceID = response.data.data[this.towerNo].id
                            this.customerId = response.data.data[this.towerNo].customerId
                            this.MSG_TOPIC = BASE_TOPIC + '/' + this.customerId + '/' + this.deviceID
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
            getHistoryData() {
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
                            this.info = response.data.data
                            console.log(this.info)
                            if (this.info.overValue !== undefined) {
                                this.overLists = this.info.overValue
                            } else {
                                this.overLists = []
                            }
                            let linedata = []
                            linedata = this.info.line
                            if (this.info.bar !== undefined) {
                                this.barEnd = this.info.bar.tip
                                this.barStart = moment(this.info.bar.tip).subtract(40, 'second').format('YYYY/MM/DD HH:mm:ss')
                                this.barValue = this.info.bar.value
                                this.warningMax = this.info.warningLineMax
                                this.warningMin = this.info.warningLineMin
                                this.standardValue = this.info.standardLine
                            }
                            let charArray = []
                            if (linedata !== undefined) {
                                linedata.forEach(function (v) {
                                    charArray.push({name: v.tip, value: [v.tip, v.value]})
                                })
                                this.chartData = charArray
                                switch (this.activeName) {
                                    case "NOX":
                                        this.color = '#5ECB4F'
                                        break;
                                    case 'SO2':
                                        this.color = '#FEB843'
                                        break;
                                    case 'DUST':
                                        this.color = '#5C89FF'
                                        break;
                                }
                                this.initChart() // 获取历史数据之后绘制图表
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .finally(() => this.loading = false)
                }, 1000)
            },
            loadingData() {
                this.loading = true
                this.getHistoryData()
            },
            reloadPage(time) {
                var startTime = moment(this.chartData[0].name, 'YYYY/MM/DD HH:mm:ss')
                var endTime = moment(time, 'YYYY/MM/DD HH:mm:ss')
                if (endTime.diff(startTime, 'seconds') >= 3600) {
                    location.reload()
                    console.log('reload page')
                }
            },
            mqttConnect() {
                this.client = mqtt.connect(MQTT_SERVICE, this.mqttoptions)

                // mqtt连接
                this.client.on('connect', () => {
                    console.log('连接成功:')
                    this.client.subscribe(this.MSG_TOPIC, {qos: 0}, (error) => {
                        if (!error) {
                            console.log('订阅成功')
                        } else {
                            this.client.pubish(this.MSG_TOPIC, '传输失败')
                            console.log('订阅失败')
                        }
                    })
                })

                // 接收消息处理
                this.client.on('message', (topic, message) => {
                    console.log('收到来自', topic, '的消息', message.toString())
                    this.msg = message.toString()
                    let chartArray = JSON.parse(this.msg)
                    var pointName = chartArray.pointName
                    var lineData = chartArray.line
                    switch (this.activeName) {
                        case 'NOX':
                            if (pointName === 'NOX') {
                                this.chartData.push({name: lineData.tip, value: [lineData.tip, lineData.value]})
                                this.color = '#5ECB4F'
                                if (chartArray.bar !== undefined) {
                                    this.getHistoryData()
                                }
                                this.reloadPage(lineData.tip)
                            }
                            break;
                        case 'SO2':
                            if (pointName === 'SO2') {
                                this.chartData.push({name: lineData.tip, value: [lineData.tip, lineData.value]})
                                this.color = '#FEB843'
                                if (chartArray.bar !== undefined) {
                                    this.getHistoryData()
                                }
                                this.reloadPage(lineData.tip)
                            }
                            break;
                        case 'DUST':
                            if (pointName === 'DUST') {
                                this.chartData.push({name: lineData.tip, value: [lineData.tip, lineData.value]})
                                this.color = '#5C89FF'
                                if (chartArray.bar !== undefined) {
                                    this.getHistoryData()
                                }
                                this.reloadPage(lineData.tip)
                            }
                            break;
                        default:
                            break;
                    }
                    if (moment(lineData.tip).format('mm:ss') === '00:00') {
                        this.loadingData()
                    }
                    this.initChart()  // 获取mqtt数据之后再次绘制图表
                })
                // 断开发起重连
                this.client.on('reconnect', (error) => {
                    console.log('正在重连:', error)
                })
                // 链接异常处理
                this.client.on('error', (error) => {
                    console.log('连接失败:', error)
                })
            },
            getOverTimes() {
              return this.overLists.length
            },
            mqttDisConnet() {
                this.client.unsubscribe(this.MSG_TOPIC, this.opt)
                console.log('取消订阅')
            },
            initChart() {
                this.options = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        formatter: function (params) {
                            params = params[0];
                            var date = new Date(params.name);
                            return '时间：' + date.getMinutes() + ':' + date.getSeconds() + '<br />' + '浓度：' + params.value[1];
                        },
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
                                return moment(value).format('mm');
                            },
                            rotate: 60,
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: false
                        }
                    },
                    dataZoom: [{
                        type: 'inside',
                        throttle: 50
                    }],
                    series: [{
                        name: '浓度',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: this.chartData,
                        color: this.color,
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
                        },
                        markLine: {
                            label:{
                                position:"",
                                formatter: "标准线",
                                color:"grey",
                                fontSize:12,
                                x: '90%'
                            },
                            data: [{
                                silent:true,
                                symbol: 'none',
                                lineStyle:{
                                    type:"grid",
                                    color:"grey"
                                },
                                yAxis: this.standardValue
                            },
                                [{
                                    symbol: 'none',
                                    lineStyle: {
                                        type: 'grid',
                                        color: 'red'
                                    },
                                    x: '85%',
                                    coord: [this.barEnd, this.warningMax]
                                }, {
                                    symbol: 'none',
                                    label: {
                                        position: 'start',
                                        formatter: '达标线',
                                        color: 'red',
                                        fontsize: 12
                                    },
                                    coord: [this.barEnd, this.warningMax]
                                }],
                                [{
                                    symbol: 'none',
                                    lineStyle: {
                                        type: 'grid',
                                        color: 'orange'
                                    },
                                    x: '85%',
                                    coord: [this.barEnd, this.warningMin]
                                }, {
                                    symbol: 'none',
                                    label: {
                                        position: 'start',
                                        formatter: '内部线',
                                        color: 'orange',
                                        fontsize: 12
                                    },
                                    coord: [this.barEnd, this.warningMin]
                                }]]
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
            this.mqttoptions = {
                connectTimeout: 20000,
                clientId: 'mobile_' + Math.random().toString(16).substr(2, 8),
                username: MQTT_USERNAME,
                password: MQTT_PASSWORD,
                clean: true
            }

            this.opt = {
                onSuccess() {
                    console.log('退订成功')
                },
                onFailure(error) {
                    console.log('退订失败')
                    console.log(error)
                }
            }

            this.token = 'Bearer ' + this.$utils.getUrlKey("token")  //获取URL中的token
            this.getDevId(this.token)  //获取设备ID 客户ID 加载历史数据 连接MQTT
            var nowHour = moment(new Date()).format('YYYY/MM/DD HH:00:00')
            var nextHour = moment(new Date()).add(1, 'hour').format('YYYY/MM/DD HH:00:00')
            this.anchor.push({name: nowHour, value: [nowHour, 0]})
            this.anchor.push({name: nextHour, value: [nextHour, 0]})

            this.title = {
                text: 'mg/Nm³'
            }
            this.options = {}
        },
        beforeDestroy() {
            this.mqttDisConnet()
        },
    }
</script>

<style lang="less">
    .overproof {
        margin-top: 40px;
    }
</style>