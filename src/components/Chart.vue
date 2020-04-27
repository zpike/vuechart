<template>
    <div class="page-line-chart">
        <h4>NOx浓度曲线图</h4>
        <ve-line
                :data="chartData"
                :settings="chartSettings"
                :data-empty="dataEmpty"
                :loading="loading"
                :mark-line="markLine"
                :mark-area="markArea"
                :extend="chartExtend"
                :colors="colors"
                >
        </ve-line>
    </div>
</template>

<script>
    const DATA_FROM_BACKEND = {
        columns: ['date', 'PV', 'SV', 'IV'],
        rows: [
            { 'date': '5', 'PV': 13, 'SV': 30, 'IV':28},
            { 'date': '10', 'PV': 14, 'SV': 30, 'IV':28},
            { 'date': '15', 'PV': 17, 'SV': 30, 'IV':28},
            { 'date': '20', 'PV': 18, 'SV': 30, 'IV':28},
            { 'date': '25', 'PV': 19, 'SV': 30, 'IV':28},
            { 'date': '30', 'PV': 20, 'SV': 30, 'IV':28},
            { 'date': '35', 'PV': 21, 'SV': 30, 'IV':28},
            { 'date': '40', 'PV': 19, 'SV': 30, 'IV':28},
            { 'date': '45', 'PV': 17, 'SV': 30, 'IV':28},
            { 'date': '50', 'PV': 16, 'SV': 30, 'IV':28},
            { 'date': '55', 'PV': 15, 'SV': 30, 'IV':28},
            { 'date': '60', 'PV': 14, 'SV': 30, 'IV':28},
        ]
    }
    const EMPTY_DATA = {
        columns: [],
        rows: []
    }
    export default {
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
            this.markLine = {
                label:{
                    position:"end",
                    formatter: "标准线",
                    color:"grey",
                    fontSize:14
                },
                data: [{
                    silent:true,
                    symbol: 'none',
                    lineStyle:{
                        type:"grid",
                        color:"grey"
                    },
                    type: 'average'
                    // yAxis: '29'
                }]
            }
            this.markArea = {

            }
            this.chartSettings = {
                // xAxisType: 'value',
                // yAxisType: ['0,0a'],  //numerify
                // yAxisType: [function(v) {
                //     return v + 'min'
                // }],
                // digit: 3,
                labelMap: {
                    PV: 'NOx浓度',
                    SV: '达标线',
                    IV: '内部线'
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
