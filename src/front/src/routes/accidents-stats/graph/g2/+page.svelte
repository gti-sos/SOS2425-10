<svelte:head>
  <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
</svelte:head>

<script lang="ts">
  //am chart
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  let root: any;
  let API = "/api/v2/accidents-stats";
  if (dev) API = "http://localhost:16079" + API;

  async function fetchAndRenderChart() {
    const res = await fetch(API);
    const data = await res.json();

    // Agrupar víctimas por provincia
    const grouped: Record<string, number> = {};
    data.forEach((item) => {
      if (!grouped[item.province]) grouped[item.province] = 0;
      grouped[item.province] += Number(item.total_victims);
    });

    const chartData = Object.entries(grouped).map(([province, victims]) => ({
      province,
      victims
    }));

    // Limpiar instancia anterior si existe
    if (root) {
      root.dispose();
    }

    // Crear nuevo gráfico
    const am5 = window.am5;
    const am5xy = window.am5xy;
    const am5themes_Animated = window.am5themes_Animated;

    root = am5.Root.new("amchart-container");
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      layout: root.verticalLayout
    }));

    const yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "province",
      renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 20 })
    }));

    yAxis.data.setAll(chartData);

    const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererX.new(root, {})
    }));

    const series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Víctimas",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "victims",
      categoryYField: "province",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueX} víctimas"
      })
    }));

    series.data.setAll(chartData);
    series.appear(1000);
    chart.appear(1000, 100);
  }

  onMount(() => {
    fetchAndRenderChart();
    const interval = setInterval(fetchAndRenderChart, 2000000);
    return () => {
      clearInterval(interval);
      if (root) root.dispose();
    };
  });
</script>

<h2 style="text-align: center; margin-top: 1rem;">Víctimas por Provincia (amCharts)</h2>
<div id="amchart-container" style="width: 100%; height: 500px;"></div>
<p style="text-align: center; color: #555; margin-top: 1rem;">
  Gráfico de barras horizontales agrupadas generado con amCharts. Muestra el total de víctimas por provincia y se actualiza automáticamente cada 2 segundos.
</p>

<style>
  #amchart-container {
    max-width: 800px;
    margin: 0 auto;
  }
</style>