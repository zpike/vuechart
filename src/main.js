import Vue from 'vue'
import App from './App.vue'
import router from './router'
import utils from './utils/utils'

import { RadioGroup, Radio } from 'vant';
import { Col, Row } from 'vant';
import { Icon } from 'vant';
import { Notify } from 'vant'; 
import { Tab, Tabs } from 'vant';
import { Divider } from 'vant';
import { Toast } from 'vant';

import VeLine from 'v-charts/lib/line.common';
import VeHistogram from 'v-charts/lib/histogram.common.js';
import VeGauge from 'v-charts/lib/gauge.common.js';

import { VeLineChart } from 've-charts'  // 折线图
import { VeBarChart } from 've-charts'  //
import markArea from 've-charts'
import markLine from 've-charts'

Vue.component('VeLineChart', VeLineChart)
Vue.component('VeBarChart', VeBarChart)
Vue.component('markArea', markArea)
Vue.component('markLine', markLine)

Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Col);
Vue.use(Row);
Vue.use(Icon);
Vue.use(Notify);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Divider);
Vue.use(Toast);

[VeLine, VeHistogram, VeGauge].forEach(comp => {
  Vue.component(comp.name, comp);
});

Vue.config.productionTip = false
Vue.prototype.$utils = utils

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
