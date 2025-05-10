<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  const Highcharts = window.Highcharts;

  let localAPI = "/api/v2/accidents-stats";
  if (dev) localAPI = "http://localhost:16079" + localAPI;

  const remoteAPI = "https://sos2425-20.onrender.com/api/v1/accidents-with-animals";

  async function fetchLocalData() {
    const res = await fetch(localAPI);
    return res.ok ? await res.json() : [];
  }

  async function fetchRemoteData() {
    const res = await fetch(remoteAPI);
    return res.ok ? await res.json() : [];
  }

  onMount(async () => {
    const [localData, remoteData] = await Promise.all([
      fetchLocalData(),
      fetchRemoteData()
    ]);

    const totalVictimsByYear = {};
    localData.forEach(item => {
      const year = item.year;
      totalVictimsByYear[year] = (totalVictimsByYear[year] || 0) + (item.total_victims || 0);
    });

    const animalsByYear = {};
    remoteData.forEach(item => {
      const year = item.anyo;
      animalsByYear[year] = (animalsByYear[year] || 0) + (item.other_animal_group || 0);
    });

    const allYears = Array.from(new Set([
      ...Object.keys(totalVictimsByYear),
      ...Object.keys(animalsByYear)
    ])).map(Number).sort((a, b) => a - b);

    const selectedYears = allYears.slice(0, 3); // Mostrar solo 3 años

    const seriesData = selectedYears.flatMap((year, i) => {
      const colors = Highcharts.getOptions().colors;
      return [
        {
          name: `Total Victims ${year}`,
          data: [{
            color: colors[i],
            radius: `${112 - i * 25}%`,
            innerRadius: `${100 - i * 25}%`,
            y: totalVictimsByYear[year] || 0
          }]
        },
        {
          name: `Other Animal Accidents ${year}`,
          data: [{
            color: colors[i + 3],
            radius: `${99 - i * 25}%`,
            innerRadius: `${87 - i * 25}%`,
            y: animalsByYear[year] || 0
          }]
        }
      ];
    });

    const maxValue = Math.max(...seriesData.map(s => s.data[0].y)) * 1.2;

    Highcharts.chart('container', {
      chart: {
        type: 'solidgauge',
        height: '110%'
      },
      title: {
        text: 'Total Victims vs other_animal_group (en 2023)'
      },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 5,
        useHTML: true,
        pointFormat: '<b>{series.name}:</b> {point.y}'
      },
      pane: {
        startAngle: 0,
        endAngle: 360,
        background: seriesData.map(s => ({
          outerRadius: s.data[0].radius,
          innerRadius: s.data[0].innerRadius,
          backgroundColor: new Highcharts.Color(s.data[0].color).setOpacity(0.3).get(),
          borderWidth: 0
        }))
      },
      yAxis: {
        min: 0,
        max: maxValue,
        lineWidth: 0,
        tickPositions: []
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: true,
            format: '{y}'
          },
          linecap: 'round',
          stickyTracking: false,
          rounded: true
        }
      },
      series: seriesData
    });
  });
</script>

<figure class="highcharts-figure">
  <div id="container"></div>
  <p class="highcharts-description">
    Gráfico comparativo de víctimas totales por accidentes de tráfico y accidentes con animales (other_animal_group), agrupado por año.
  </p>
</figure>

<style>
#container {
  max-width: 400px;
  margin: 0 auto;
}

.highcharts-figure {
  min-width: 380px;
  max-width: 600px;
  margin: 0 auto;
}

.highcharts-description {
  margin: 0.3rem 10px;
}
</style>
