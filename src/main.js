import Vue from 'vue'
import App from './App.vue'
import { RadioGroup, Radio } from 'vant';
import { Col, Row } from 'vant';
import ECharts from 'vue-echarts/components/ECharts'

import VeLine from 'v-charts/lib/line.common';
import VeHistogram from 'v-charts/lib/histogram.common.js';
import VeGauge from 'v-charts/lib/gauge.common.js';

import 'echarts/lib/component/markLine';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markArea';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import 'zrender/lib/svg/svg';
import 'v-charts/lib/style.css';

Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Col);
Vue.use(Row);

[VeLine, VeHistogram, VeGauge].forEach(comp => {
  Vue.component(comp.name, comp);
});

Vue.component('v-chart', ECharts)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
