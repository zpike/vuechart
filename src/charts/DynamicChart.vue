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
                    :loading="loading"/>
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
                            console.log(this.info)
                            let linedata = []
                            if (this.info.data !== null) {
                                linedata = this.info.data.line
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
            }
        },
        mounted() {
            this.getDevId()
        },
        created() {
            // this.loadingData()
            this.chartSettings = {
                smooth: true
            }
        },
    }
</script>