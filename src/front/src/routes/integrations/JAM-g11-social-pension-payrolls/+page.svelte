<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/dumbbell.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  // @ts-ignore
  const Highcharts = window.Highcharts;

  let localAPI = "/api/v1/registrations-stats"; 
  if (dev) localAPI = "http://localhost:16079" + localAPI;

  const remoteAPI = "https://sos2425-11.onrender.com/api/v1/social-pension-payrolls"; 

  async function fetchAndProcessData() {
    const [localRes, remoteRes] = await Promise.all([
      fetch(localAPI),
      fetch(remoteAPI)
    ]);
    const localData = await localRes.json();
    const remoteData = await remoteRes.json();

    // Agrupar total_general por año (local)
    const localByYear = {};
    localData.forEach(entry => {
      const year = entry.year;
      const total = Number(entry.total_general) || 0;
      localByYear[year] = (localByYear[year] || 0) + total;
    });

    // Agrupar disability_number por año (remota)
    const remoteByYear = {};
    remoteData.forEach(entry => {
      const year = entry.year;
      const dis = Number(entry.disability_number) || 0;
      remoteByYear[year] = (remoteByYear[year] || 0) + dis;
    });

    // Unir años y construir la serie para dumbbell
    const allYears = Array.from(new Set([...Object.keys(localByYear), ...Object.keys(remoteByYear)]))
      .map(Number)
      .sort((a, b) => a - b);

    const data = allYears.map(year => ({
      name: year.toString(),
      low: remoteByYear[year] || 0,
      high: localByYear[year] || 0
    }));

    renderChart(data);
  }

  function renderChart(data) {
    Highcharts.chart('container', {
      chart: {
        type: 'dumbbell',
        inverted: true
      },

      legend: {
        enabled: false
      },

      title: {
        text: 'Comparativa por Año: Total General vs Número de Personas con Discapacidad'
      },

      subtitle: {
        text: 'Fuente: APIs locales y externas del grupo SOS2425'
      },

      tooltip: {
        shared: true,
        pointFormat: '<b>{point.name}</b><br/>Discapacidad: {point.low}<br/>Total General: {point.high}'
      },

      xAxis: {
        type: 'category'
      },

      yAxis: {
        title: {
          text: 'Número de Personas'
        }
      },

      series: [{
        name: 'Comparación',
        data: data
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
    Este gráfico muestra una comparativa año a año entre el número total de registros generales y el número de personas con discapacidad.
    Utiliza un gráfico dumbbell para representar los dos valores extremos por año.
  </p>
</figure>

<style>
.highcharts-figure,
.highcharts-data-table table {
    min-width: 310px;
    max-width: 800px;
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
    font-size: 0.9rem;
    text-align: center;
    color: #333;
}
</style>
