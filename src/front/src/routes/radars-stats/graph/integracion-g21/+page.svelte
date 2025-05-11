<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
// @ts-nocheck

  import { onMount } from "svelte";
  import { browser, dev } from "$app/environment";

  let errorMsg = '';

  onMount(async () => {
    if (!browser) return;

    const API = dev
      ? "http://localhost:16079/api-proxy/api/v1/cultural-event"
      : "/api-proxy/api/v1/cultural-event";

    try {
      const res = await fetch(API);
      const events = await res.json();

      console.log("Datos cargados:", events);

      const grouped = {};

      events.forEach(event => {
        const types = event.event_type?.split(',').map(t => t.trim()) || [];
        types.forEach(type => {
          grouped[type] = (grouped[type] || 0) + (event.total_attendance || 0);
        });
      });

      const chartData = Object.entries(grouped)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({ name, y: value }));

      Highcharts.chart('container', {
        chart: {
          type: 'pie',
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
        },
        title: {
          text: 'Tipos<br>de Evento<br>Cultural',
          align: 'center',
          verticalAlign: 'middle',
          y: 60,
          style: {
            fontSize: '1.1em'
          }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: -50,
              style: {
                fontWeight: 'bold',
                color: 'white'
              }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
            size: '110%'
          }
        },
        series: [{
          name: 'Asistencia',
          innerSize: '50%',
          data: chartData
        }]
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
      errorMsg = 'No se pudo cargar el gráfico.';
    }
  });
</script>

<figure class="highcharts-figure">
  <div id="container" style="height: 400px;"></div>
  {#if errorMsg}
    <p style="color: red; text-align: center">{errorMsg}</p>
  {/if}
  <p class="highcharts-description">
    Este gráfico semicircular representa la asistencia total agrupada por tipo de evento cultural,
    utilizando datos reales consumidos mediante tu proxy.
  </p>
</figure>

<style>
  .highcharts-figure {
    min-width: 320px;
    max-width: 600px;
    margin: 1em auto;
  }

  .highcharts-description {
    margin: 0.3rem 10px;
    text-align: center;
    color: #444;
  }
</style>
