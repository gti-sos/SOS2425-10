<svelte:head>
  <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/percent.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  let root: any;
  let API = "/api/v2/accidents-stats";
  if (dev) API = "http://localhost:16079" + API;

  async function fetchAndRenderPyramid() {
    const res = await fetch(API);
    const data = await res.json();

    const grouped: Record<string, number> = {};
    data.forEach(item => {
      const province = item.province;
      grouped[province] = (grouped[province] || 0) + Number(item.total_victims);
    });

    const pyramidData = Object.entries(grouped)
      .map(([province, victims]) => ({ category: province, value: victims }))
      .sort((a, b) => b.value - a.value);

    if (root) root.dispose();

    const am5 = window.am5;
    const am5percent = window.am5percent;
    const am5themes_Animated = window.am5themes_Animated;

    root = am5.Root.new("pyramid-container");
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(am5percent.SlicedChart.new(root, {
      layout: root.verticalLayout
    }));

    const series = chart.series.push(am5percent.FunnelSeries.new(root, {
      categoryField: "category",
      valueField: "value",
      orientation: "vertical",
      alignLabels: true
    }));

    series.labels.template.setAll({
      text: "{category}: {value} víctimas"
    });

    series.slices.template.setAll({
      tooltipText: "{category}: {value} víctimas",
      interactive: true
    });

    series.data.setAll(pyramidData);
  }

  onMount(() => {
    fetchAndRenderPyramid();
    const interval = setInterval(fetchAndRenderPyramid, 3000);
    return () => root && root.dispose();
  });
</script>

<h2 style="text-align: center; margin-top: 1rem;">Pirámide de Víctimas por Provincia</h2>
<div id="pyramid-container" style="width: 100%; height: 600px;"></div>
<p style="text-align: center; color: #555; margin-top: 1rem;">
  Este gráfico de tipo pirámide muestra las provincias ordenadas por total de víctimas. Se actualiza automáticamente cada 3 segundos.
</p>

<style>
  #pyramid-container {
    max-width: 800px;
    margin: 0 auto;
  }
</style>