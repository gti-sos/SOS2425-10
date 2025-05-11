<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  const Highcharts = window.Highcharts;

  // API para datos locales de víctimas
  let localAPI = "/api/v2/accidents-stats";
  if (dev) localAPI = "http://localhost:16079" + localAPI;

  // API para la información de razas de perros
  const remoteAPI = "https://api.thedogapi.com/v1/breeds";

  let totalVictims = 0;
  let toyBreedCount = 0;

  onMount(async () => {
    try {
      // Cargar datos de razas de perros
      const resRemote = await fetch(remoteAPI);
      if (!resRemote.ok) throw new Error('Error al cargar datos de la API de perros');
      const dogData = await resRemote.json();

      // Contar razas con breed_group "Toy"
      toyBreedCount = dogData.filter(d => d.breed_group === "Toy").length;

      // Cargar datos de víctimas
      const resLocal = await fetch(localAPI);
      if (!resLocal.ok) throw new Error('Error al cargar datos de la API local');
      const stats = await resLocal.json();

      // Sumar total de víctimas
      stats.forEach(s => {
        totalVictims += s.total_victims || 0;
      });

      // Crear gráfico
      createPieChart(toyBreedCount, totalVictims);

    } catch (err) {
      console.error("Error al cargar datos:", err);
      alert('Hubo un problema al cargar los datos. Verifique las APIs.');
    }
  });

  function createPieChart(toyCount, victimCount) {
    Highcharts.chart('container', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Proporción de Razas "Toy" y Total de Víctimas'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      accessibility: {
        point: {
          valueSuffix: ''
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Cantidad',
        colorByPoint: true,
        data: [{
          name: 'Razas Toy',
          y: toyCount,
          color: '#3498db'
        }, {
          name: 'Total Víctimas',
          y: victimCount,
          color: '#e67e22'
        }]
      }]
    });
  }
</script>

<div id="container"></div>

<style>
  #container {
    height: 400px;
    min-width: 310px;
    max-width: 600px;
    margin: 0 auto;
  }
</style>
