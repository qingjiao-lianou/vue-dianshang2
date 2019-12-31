<template>
  <div class="reports">
    <v-chart :options="data" />
  </div>
</template>
<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/polar";
import { getReportsData } from "@/api/reports_index.js";
export default {
  data() {
    return {
      data: {}
    };
  },
  components: {
    "v-chart": ECharts
  },
  mounted() {
    getReportsData(1).then(res => {
      this.data = res.data.data;
    });
  }
};
</script>
<style lang="less" scoped>
.reports {
  width: 100%;
  height: 100%;
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>