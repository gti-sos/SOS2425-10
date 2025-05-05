<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-3d.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  // @ts-ignore
  const Highcharts = window.Highcharts;

  interface AccidentData {
    province: string;
    total_victims: number;
  }

  let chart: any;
  let API = "/api/v2/accidents-stats";
  if (dev) API = "http://localhost:16079" + API;

  async function fetchAndUpdateChart() {
    const res = await fetch(API);
    const data: AccidentData[] = await res.json();

    // Agrupar víctimas por provincia
    const grouped: Record<string, number> = {};
    data.forEach((item) => {
      if (!grouped[item.province]) grouped[item.province] = 0;
      grouped[item.province] += Number(item.total_victims);
    });

    const seriesData = Object.entries(grouped).map(([province, victims]) => ({
      name: province,
      y: victims
    }));

    if (!chart) {
      chart = Highcharts.chart('container', {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
          }
        },
        title: {
          text: 'Víctimas por Provincia (Gráfico Donut 3D)'
        },
        accessibility: {
          point: {
            valueSuffix: ' víctimas'
          }
        },
        tooltip: {
          pointFormat: '<b>{point.y} víctimas</b>'
        },
        plotOptions: {
          pie: {
            innerSize: 100,
            depth: 45,
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.y}'
            }
          }
        },
        series: [{
          name: 'Total víctimas',
          data: seriesData
        }]
      });
    } else {
      chart.series[0].setData(seriesData);
    }
  }

  onMount(() => {
    fetchAndUpdateChart();
    const interval = setInterval(fetchAndUpdateChart, 2000);
    return () => clearInterval(interval);
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="width: 100%; height: 500px;"></div>
  <p class="highcharts-description">
    Este gráfico de tipo Donut 3D representa el número total de víctimas por provincia según los datos actuales en la API.
    Se actualiza automáticamente si se añaden, editan o eliminan accidentes desde el frontend.
  </p>
</figure>

<style>
  .highcharts-figure {
    min-width: 310px;
    max-width: 800px;
    margin: 1em auto;
  }
  .highcharts-description {
    margin: 1rem;
    text-align: center;
    color: #555;
  }
</style>