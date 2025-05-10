<svelte:head>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  // @ts-ignore
  const Highcharts = window.Highcharts;

  let localAPI = "/api/v2/accidents-stats";
  if (dev) localAPI = "http://localhost:16079" + localAPI;

  const remoteAPI = "https://sos2425-13.onrender.com/api/v1/water-supply-improvements";

  async function fetchAndProcessData() {
    const [localRes, remoteRes] = await Promise.all([
      fetch(localAPI),
      fetch(remoteAPI)
    ]);
    const localData = await localRes.json();
    const remoteData = await remoteRes.json();

    // Agrupar por año y sumar total_victims
    const victimsByYear = {};
    for (const entry of localData) {
      const year = entry.year;
      const victims = Number(entry.total_victims) || 0;
      victimsByYear[year] = (victimsByYear[year] || 0) + victims;
    }

    // Agrupar benefited_population
    const popByYear = {};
    for (const entry of remoteData) {
      const year = entry.year;
      const pop = Number(entry.benefited_population) || 0;
      popByYear[year] = (popByYear[year] || 0) + pop;
    }

    // Unir y ordenar años
    const allYears = Array.from(new Set([...Object.keys(victimsByYear), ...Object.keys(popByYear)]))
      .map(Number)
      .sort((a, b) => a - b);

    const victimsData = allYears.map(year => victimsByYear[year] || 0);
    const popData = allYears.map(year => popByYear[year] || 0);

    renderChart(allYears, victimsData, popData);
  }

  function renderChart(years, victimsData, popData) {
    Highcharts.chart('container', {
      chart: {
        polar: true
      },
      title: {
        text: 'Comparación por Año'
      },
      subtitle: {
        text: 'Total de Víctimas vs Población Beneficiada'
      },
      pane: {
        startAngle: 0,
        endAngle: 360
      },
      xAxis: {
        categories: years.map(String),
        tickmarkPlacement: 'on',
        lineWidth: 0
      },
      yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0
      },
      series: [{
        type: 'line',
        name: 'Total de Víctimas',
        data: victimsData,
        pointPlacement: 'on'
      }, {
        type: 'line',
        name: 'Población Beneficiada',
        data: popData,
        pointPlacement: 'on'
      }]
    });
  }

  onMount(() => {
    fetchAndProcessData();
  });
</script>



<figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
        polar chart 
    </p>
</figure>

<style>
.highcharts-figure,
.highcharts-data-table table {
    min-width: 320px;
    max-width: 660px;
    margin: 1em auto;
}

.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}

.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}

.highcharts-data-table th {
    font-weight: 600;
    padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
    padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tbody tr:nth-child(even) {
    background: #f8f8f8;
}

.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

.highcharts-description {
    margin: 0.3rem 10px;
}

</style>
