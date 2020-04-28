<template>
  <ve-gauge :data="chartData" :settings="chartSettings"></ve-gauge>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        dimension: 'type',
        metrics: 'value'
      }
      return {
        chartData: {
          columns: ['a', 'b', 'type', 'value'],
          rows: [
            { type: '速度', value: 80, a: 1, b: 2 }
          ]
        }
      }
    }
  }
</script>