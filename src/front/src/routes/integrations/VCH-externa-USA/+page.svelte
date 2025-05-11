<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-3d.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  const Highcharts = window.Highcharts;

  let localAPI = "/api/v2/accidents-stats";
  if (dev) localAPI = "http://localhost:16079" + localAPI;

  const remoteAPI = "https://datausa.io/api/data?drilldowns=Nation&measures=Population";

  let totalVictimsByYear = {};
  let totalUSAByYear = {};
  let years = [];

  onMount(async () => {
    try {
      const resRemote = await fetch(remoteAPI);
      if (!resRemote.ok) throw new Error('Error al cargar datos de la API externa');
      const dataUSA = await resRemote.json();

      const unitedStatesData = dataUSA.data.filter(item => item.Nation === "United States");

      unitedStatesData.forEach(item => {
        const year = item.Year;
        totalUSAByYear[year] = (totalUSAByYear[year] || 0) + 1;
      });

      years = Object.keys(totalUSAByYear);

      const resLocal = await fetch(localAPI);
      if (!resLocal.ok) throw new Error('Error al cargar datos de la API local');
      const stats = await resLocal.json();

      stats.forEach(s => {
        const year = s.year;
        if (year) {
          totalVictimsByYear[year] = (totalVictimsByYear[year] || 0) + (s.total_victims || 0);
        }
      });

      createChart(totalVictimsByYear, totalUSAByYear, years);

    } catch (err) {
      console.error("Error al cargar datos:", err);
      alert('Hubo un problema al cargar los datos. Verifique las APIs.');
    }
  });

  function createChart(victimsByYear, usaCountByYear, years) {
    Highcharts.chart('container', {
      chart: {
        type: 'bar',
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 30,
          depth: 150
        }
      },
      title: {
        text: 'Comparación de Víctimas y Registros de USA por Año'
      },
      yAxis: {
        title: {
          text: 'Valor'
        },
        labels: {
          format: '{value:,.0f}'
        },
        gridLineDashStyle: 'Dash'
      },
      xAxis: {
        categories: years,
        title: {
          text: 'Año'
        }
      },
      plotOptions: {
        bar: {
          depth: 25,
          dataLabels: {
            enabled: true,
            format: '{y:,.0f}'
          }
        }
      },
      tooltip: {
        valueSuffix: ' unidades'
      },
      series: [{
        name: 'Total Víctimas',
        data: years.map(year => victimsByYear[year] || 0),
        color: 'rgb(50,150,200)',
        fillColor: 'rgba(50, 150, 200, 0.3)'
      }, {
        name: 'Registros USA por Año',
        data: years.map(year => usaCountByYear[year] || 0),
        color: 'rgb(200,110,50)',
        fillColor: 'rgba(200, 110, 50, 0.3)'
      }]
    });
  }
</script>

<div id="container"></div>

<style>
  #container {
    height: 400px;
    min-width: 310px;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
