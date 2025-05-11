<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-3d.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  // @ts-ignore
  const Highcharts = window.Highcharts;

  let localAPI = "/api/v2/accidents-stats";
  if (dev) localAPI = "http://localhost:16079" + localAPI;

  const remoteAPI = "https://restcountries.com/v3.1/all";

  let totalArea = 0;
  let totalKm = 0;

  onMount(async () => {
    try {
      // Obtener área total desde la API externa
      const resRemote = await fetch(remoteAPI);
      if (!resRemote.ok) throw new Error('Error al cargar datos de la API externa');
      const countries = await resRemote.json();
      totalArea = countries.reduce((sum, c) => sum + (c.area || 0), 0);
      console.log("Área total de países:", totalArea.toLocaleString());

      // Obtener km totales desde la API local
      const resLocal = await fetch(localAPI);
      if (!resLocal.ok) throw new Error('Error al cargar datos de la API local');
      const stats = await resLocal.json();
      totalKm = stats.reduce((sum, s) => sum + (s.km || 0), 0);
      console.log("Total de km registrados:", totalKm.toLocaleString());

      // Iniciar gráfico después de cargar datos
      createChart(totalArea, totalKm);

    } catch (err) {
      console.error("Error al cargar datos:", err);
      alert('Hubo un problema al cargar los datos. Verifique las APIs.');
    }
  });

  function createChart(areaSum, kmSum) {
    Highcharts.chart('container', {
      chart: {
        type: 'column',  // Usamos 'column' para representar dos series
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 30,
          depth: 200
        }
      },
      title: {
        text: 'Comparación de Área y KM, APi externa paises'
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
        categories: ['Total Área', 'Total KM'],  // Separar en dos categorías
        title: {
          text: 'Métricas'
        }
      },
      plotOptions: {
        column: {
          depth: 100,
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
        name: 'Área Total (km²)',
        data: [areaSum, null],  // El valor de km es `null` en esta serie
        color: 'rgb(200,110,50)',  // Cambiar el color para el área
        fillColor: 'rgba(200, 110, 50, 0.3)'
      }, {
        name: 'Total KM',
        data: [null, kmSum],  // El valor de área es `null` en esta serie
        color: 'rgb(50,150,200)',  // Cambiar el color para los km
        fillColor: 'rgba(50, 150, 200, 0.3)'
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
