<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/dumbbell.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>


<script lang="ts">
  import { onMount } from 'svelte';
  import { dev, browser } from '$app/environment';

  // @ts-ignore
  const Highcharts = window.Highcharts;
  

  interface Registration {
    year: number;
    total_general: number;
  }

  interface SpaceXLaunch {
    name: string;
    date_utc: string;
    links: {
      youtube_id: string;
      webcast: string;
    };
  }

  let chart: any;

  onMount(async () => {
    if (!browser) return;

    const REG_API = dev
      ? "http://localhost:16079/api/v1/registrations-stats"
      : "/api/v1/registrations-stats";

    const SPACEX_API = "https://api.spacexdata.com/v4/launches/latest";

    const [resReg, resLaunch] = await Promise.all([
      fetch(REG_API),
      fetch(SPACEX_API)
    ]);

    const regData: Registration[] = await resReg.json();
    const launch: SpaceXLaunch = await resLaunch.json();

    const launchYear = new Date(launch.date_utc).getFullYear();

    const years = [...new Set(regData.map(r => r.year))].sort();

    const totalByYear: Record<number, number> = {};
    regData.forEach(r => {
      totalByYear[r.year] = (totalByYear[r.year] || 0) + (r.total_general || 0);
    });

    const seriesData = years.map(y => {
      return {
        name: y === launchYear ? `${y} 🚀` : y.toString(),
        low: 0,
        high: totalByYear[y] || 0
      };
    });

    chart = Highcharts.chart('container', {
      chart: {
        type: 'dumbbell',
        inverted: true
      },
      title: {
        text: 'Matriculaciones anuales y año del último lanzamiento SpaceX'
      },
      subtitle: {
        text: `Último lanzamiento: <b>${launch.name}</b> - ${launchYear} <a href="${launch.links.webcast}" target="_blank">[Ver]</a>`,
        useHTML: true
      },
      xAxis: {
        categories: seriesData.map(d => d.name),
        title: { text: 'Año' }
      },
      yAxis: {
        title: { text: 'Matriculaciones totales' },
        labels: {
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            return Math.floor(this.value as number);
          }
        }
      },
      tooltip: {
        pointFormat: '<b>Matriculaciones:</b> {point.high}',
        shared: false
      },
      series: [{
        name: 'Matriculaciones',
        data: seriesData,
        color: '#007bff',
        connectorColor: '#ccc'
      }],
      credits: { enabled: false }
    });
  });
</script>

{#if browser}
<figure class="highcharts-figure">
  <div id="container" style="width: 100%; height: 600px;"></div>
  <p class="highcharts-description">
    El gráfico muestra la evolución de las matriculaciones por año junto con un marcador especial en el año del último lanzamiento de SpaceX.
  </p>
</figure>
{/if}

<style>
  .highcharts-figure {
    max-width: 1000px;
    margin: auto;
  }
  .highcharts-description {
    text-align: center;
    margin-top: 1rem;
    color: #444;
  }
</style>
