<template>
    <div class="page-line-chart">
        <h4>尘浓度曲线图</h4>
        <ve-line
                :data="chartData"
                :grid="grid"
                :settings="chartSettings"
                :data-empty="dataEmpty"
                :loading="loading"
                :mark-line="markLine"
                :mark-area="markArea"
                :extend="chartExtend"
                >
        </ve-line>
    </div>
</template>

<script>
    const DATA_FROM_BACKEND = {
        columns: ['date', 'PV'],
        rows: [
            { 'date': '5', 'PV': 13},
            { 'date': '10', 'PV': 14},
            { 'date': '15', 'PV': 17},
            { 'date': '20', 'PV': 18},
            { 'date': '25', 'PV': 19},
            { 'date': '30', 'PV': 20},
            { 'date': '35', 'PV': 21},
            { 'date': '40', 'PV': 19},
            { 'date': '45', 'PV': 17},
            { 'date': '50', 'PV': 16},
            { 'date': '55', 'PV': 15},
            { 'date': '60', 'PV': 14},
        ]
    }
    const EMPTY_DATA = {
        columns: [],
        rows: []
    }
    export default {
        data() {
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
            this.grid = {
                show: false
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
            //         yAxis: '30'
            //     },
            //         [{
            //             symbol: 'none',
            //             lineStyle:{
            //                 type:"grid",
            //                 color:"red"
            //             },
            //             x: '90%',
            //             coord: [9, 28]
            //         }, {
            //             symbol: 'none',
            //             label: {
            //                 position: 'start',
            //                 formatter: '达标控制线',
            //                 color: 'red'
            //             },
            //             coord: [9, 28]
            //         }],
            //         [{
            //             symbol: 'none',
            //             lineStyle:{
            //                 type:"grid",
            //                 color:"orange"
            //             },
            //             x: '90%',
            //             coord: [9, 26]
            //         }, {
            //             symbol: 'none',
            //             label: {
            //                 position: 'start',
            //                 formatter: '内部控制线',
            //                 color: 'orange'
            //             },
            //             coord: [9, 26]
            //         }]
            //     ]
            // }
            this.markArea = {

            }
            this.chartSettings = {
                // xAxisType: 'value',
                // yAxisType: ['0,0a'],  //numerify
                // yAxisType: [function(v) {
                //     return v + 'min'
                // }],
                digit: 3,
                labelMap: {
                    PV: '尘浓度',
                },
            }
            return {
                chartData: {
                    columns: [],
                    rows: []
                },
                loading: false,
                dataEmpty: false,

            }
        },
        methods: {
            getData() {
                this.loading = true
                //ajax get http data
                setTimeout(() => {
                    this.chartData = this.chartData.rows.length
                    ? EMPTY_DATA : DATA_FROM_BACKEND
                    this.dataEmpty = !this.chartData.rows.length
                    this.loading = false
                }, 1000)
            }
        },
        mounted() {
            this.getData()
        }
    };
</script>
