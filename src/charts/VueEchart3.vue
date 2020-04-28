<template>
    <ve-line-chart :data="chartData" :loading="loading" />
</template>

<script>
    module.exports = {
        data () {
            return {
                loading: true,
                chartData: {}
            }
        },
        methods: {
            loadingLineData () {
                this.loading = true
                setTimeout(() => {
                    this.chartData = {
                        dimensions: {
                            name: 'Repo',
                            data: [
                                'Vue.js', 'React', 'Create RA', 'Puppteer', 'Axios',
                                'VS Code', 'Prettier', 'RN', 'Element', 'Electron'
                            ].reverse()
                        },
                        measures: [
                            {
                                name: 'Rising Star',
                                data: [
                                    40000, 27800, 22500, 22000, 21900,
                                    20200, 17700, 15600, 14900, 14800
                                ].reverse()
                            }
                        ]
                    }
                    this.loading = false
                }, 2000)
            }
        },
        created () {
            this.loadingLineData()
        }
    }
</script>