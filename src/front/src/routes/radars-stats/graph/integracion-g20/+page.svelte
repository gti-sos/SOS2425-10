<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/dumbbell.js"></script>
    <script src="https://code.highcharts.com/modules/lollipop.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>


</svelte:head>

<style>
    .highcharts-figure,
.highcharts-data-table table {
    min-width: 320px;
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

.ld-label {
    width: 200px;
    display: inline-block;
}

.ld-url-input {
    width: 500px;
}

.ld-time-input {
    width: 40px;
}

.highcharts-description {
    margin: 0.3rem 10px;
}

</style>
    
<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    
    onMount(async () => {
      try {
        const finesRes = await fetch('https://sos2425-20.onrender.com/api/v1/fines');
        const finesData = await finesRes.json();
    
        const radarsRes = await fetch('https://sos2425-10.onrender.com/api/v1/radars-stats');
        const radarsData = await radarsRes.json();
    
        // Agrupar radares por provincia (ciudad) – asumimos coincidencia por nombre
        const radarCountByCity = {};
        radarsData.forEach(radar => {
          const city = radar.province || radar.location || 'Desconocido';
          radarCountByCity[city] = (radarCountByCity[city] || 0) + 1;
        });
    
        // Combinar ambos datasets
        const chartData = finesData.map(fine => {
          const city = fine.city;
          const totalFines = fine.itv + fine.alcohol_rate + fine.fixed_radar;
          const radarCount = radarCountByCity[city] || 0;
          const total = totalFines + radarCount;
    
          return {
            name: city,
            y: total
          };
        });
    
        // Gráfico Lollipop
        Highcharts.chart('container', {
          chart: {
            type: 'lollipop'
          },
          accessibility: {
            point: {
              valueDescriptionFormat: '{index}. {xDescription}, {point.y} infracciones.'
            }
          },
          legend: { enabled: false },
          subtitle: {
            text: 'Datos combinados de multas + radares por ciudad'
          },
          title: {
            text: 'Total de Infracciones por Ciudad (2023)'
          },
          tooltip: {
            shared: true,
            pointFormat: '<b>{point.y}</b> infracciones totales'
          },
          xAxis: {
            type: 'category',
            title: { text: 'Ciudad' }
          },
          yAxis: {
            title: { text: 'Total infracciones + radares' }
          },
          series: [{
            name: 'Total',
            data: chartData
          }]
        });
    
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    });
    </script>
    
    
<figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
        Lollipop charts are variants of column charts, with a circle
        marker for the data value and a line extending to the axis.
    </p>
</figure>